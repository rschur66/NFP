import {readQuery} from "../utils/db";
import * as commonmark from "commonmark";

const reader = new commonmark.Parser();
const writer = new commonmark.HtmlRenderer();

const matches = [];
const stores = new Map();

const socialTemplate = {
  website: null,
  facebook: null,
  twitter: null,
  tumblr: null,
  instagram: null
};

async function attachProducts(stores) {
  let planIDs = new Set();
  stores.forEach(s=> {
    if (s['plan1_id']) planIDs.add(s['plan1_id']);
    if (s['plan2_id']) planIDs.add(s['plan2_id']);
    if (s['plan3_id']) planIDs.add(s['plan3_id']);
  });
  let [p, pa, a, j, m, d, c, l, g, r] = await Promise.all([
    readQuery('SELECT * FROM product WHERE visible ORDER BY year, month, position;'),
    readQuery('SELECT * FROM product_author ORDER BY product_id ASC, position ASC;'),
    readQuery('SELECT * FROM author;'),
    readQuery('SELECT * FROM judge;'),
    readQuery('SELECT * FROM magazine WHERE visible ORDER BY live_date DESC;'),
    readQuery('SELECT product_id, count(*) total FROM discussion GROUP BY product_id;'),
    readQuery('SELECT b.year year, b.month month, b.product_id product_id, count(distinct b.member_id) count ' +
      'FROM box b INNER JOIN product p ON b.product_id = p.id WHERE p.year = b.year AND p.month = b.month ' +
      'GROUP BY b.year, b.month, b.product_id;'),
    readQuery('SELECT id, name, price_label, price_blurb, description, price FROM plan WHERE id IN (?)', [[...planIDs]]),
    readQuery('SELECT id, name, price_label, price_blurb, description, price FROM plan WHERE id IN (1003,1006,1012)'),
    readQuery('SELECT id, name, price_label, price_blurb, description, price FROM plan WHERE id IN (1001,1003,1012)')
  ]);
  let s = await readQuery('SELECT * FROM social WHERE id in ?', [[[
    ...p.map(p=>p['social_id']).filter(id=>id),
    ...a.map(a=>a['social_id']).filter(id=>id),
    ...j.map(j=>j['social_id']).filter(id=>id)]]]);
  let productMap = {}, authorMap = {}, judgeMap = {}, socialMap = {}, countMap = {}, planMap = {};
  p.forEach(prod=>productMap[prod['id']] = prod);
  a.forEach(aut =>authorMap[aut['id']] = aut);
  j.forEach(jud =>judgeMap[jud['id']] = jud);
  s.forEach(soc =>socialMap[soc['id']] = soc);
  l.forEach(pla =>planMap[pla['id']] = pla);
  g.forEach(pla =>planMap[pla['id']] = pla);
  r.forEach(pla =>planMap[pla['id']] = pla);
  c.forEach(cnt => {
    countMap[cnt['year']] = countMap[cnt['year']] || [];
    countMap[cnt['year']][cnt['month']] = countMap[cnt['year']][cnt['month']] || {total: 0};
    countMap[cnt['year']][cnt['month']][cnt['product_id']] = cnt['count'];
    countMap[cnt['year']][cnt['month']]['total'] += cnt['count'];
  });
  [...stores.values()].forEach(s=> {
    s.features = [];
    s.otherFavorites = {};
    s.products = {};
    s.swag = [];
    s.authors = {};
    s.judges = {};
    s.magazine = [];
    s.ship_days = [7, 15, 22];
    s.ship_date = new Date().setDate(s.ship_days.find(d=>d > new Date().getDate())) || new Date(new Date().getFullYear(), new Date().getMonth() + 1, 7);
    s.can_pick = new Date().getDate() < Math.max(...s.ship_days);
    s.plans = [
      s['plan1_id'] && planMap[s['plan1_id']] ? planMap[s['plan1_id']] : null,
      s['plan2_id'] && planMap[s['plan2_id']] ? planMap[s['plan2_id']] : null,
      s['plan3_id'] && planMap[s['plan3_id']] ? planMap[s['plan3_id']] : null
    ];
    delete s['plan1_id'];
    delete s['plan2_id'];
    delete s['plan3_id'];
    s.gift_plans = [planMap[1003], planMap[1006], planMap[1012]];
    s.renewal_plans = [planMap[1001], planMap[1003], planMap[1012]];
  });
  p.forEach(prod=> {
    prod.visible = prod.visible === 1;
    prod.swag = prod.swag === 1;
    prod.in_stock = prod.in_stock === 1;
    prod.description = writer.render(reader.parse(prod.description || ''));
    prod.judge_blurb = writer.render(reader.parse(prod.judge_blurb || ''));
    prod.social = socialMap[prod['social_id']] || JSON.parse(JSON.stringify(socialTemplate));
    prod.discussion_count = 0;
    delete prod['social_id'];
    let store = stores.get(prod['store_id']);
    if (store) {
      store.products[prod['id']] = prod;
      if (prod['swag']) {
        store.swag[prod['position']] = prod['id'];
      } if (!prod['featured'] && (!prod['swag'])) {
        store.otherFavorites[prod['position']] = prod['id'];
      } else if (typeof prod['year'] === 'number' && typeof prod['month'] === 'number') {
        store.features[prod['year']] = store.features[prod['year']] || [];
        store.features[prod['year']][prod['month']] = store.features[prod['year']][prod['month']] || {
            featured: [],
            percents: []
          };
        store.features[prod['year']][prod['month']]['featured'].push(prod['id']);
        if (countMap[prod['year']][prod['month']] && countMap[prod['year']][prod['month']][prod['id']])
          store.features[prod['year']][prod['month']]['percents'].push(Math.ceil(countMap[prod['year']][prod['month']][prod['id']] * 100 / countMap[prod['year']][prod['month']]['total']));
        else
          store.features[prod['year']][prod['month']]['percents'].push(Math.ceil(0 * 100 / 100));
      }
    }
  });
  [...stores.values()].forEach(s=> s.otherFavorites = Object.values(s.otherFavorites));
  [...stores.values()].forEach(s=> s.swag = Object.values(s.swag));

  a.forEach(author=> {
    author.bio = writer.render(reader.parse(author.bio || ''));
    author.social = socialMap[author['social_id']] || JSON.parse(JSON.stringify(socialTemplate));
    delete author['social_id'];
    if (stores.get(author['store_id'])) stores.get(author['store_id']).authors[author.id] = author;
  });
  j.forEach(judge=> {
    judge.bio = writer.render(reader.parse(judge.bio || ''));
    judge.social = socialMap[judge['social_id']] || JSON.parse(JSON.stringify(socialTemplate));
    delete judge['social_id'];
    if (stores.get(judge['store_id'])) stores.get(judge['store_id']).judges[judge.id] = judge;
  });
  m.forEach(mag=> {
    mag.summary = mag.summary ? writer.render(reader.parse(mag.summary)) : '';
    mag.presummary = mag.presummary ? writer.render(reader.parse(mag.presummary)) : '';
    if (stores.get(mag['store_id'])) stores.get(mag['store_id']).magazine.push(mag);
  });
  pa.forEach(prodAut=> {
    if (productMap[prodAut['product_id']] && authorMap[prodAut['author_id']]) {
      productMap[prodAut['product_id']].authors = productMap[prodAut['product_id']].authors || [];
      authorMap[prodAut['author_id']].products = authorMap[prodAut['author_id']].products || [];
      productMap[prodAut['product_id']].authors.push(prodAut['author_id']);
      authorMap[prodAut['author_id']].products.push(prodAut['product_id']);
    }
  });
  d.forEach(d=> productMap[d['product_id']] ? productMap[d['product_id']].discussion_count = d['total'] : null);
}

async function loadStores(stores, matches) {
  let [s,m,c] = await Promise.all([
    readQuery('SELECT * FROM store;'),
    readQuery('SELECT * FROM store_match ORDER BY position ASC;'),
    readQuery('SELECT * FROM store_content;')]);
  s.forEach(s=>stores.set(s.id, s));
  m.forEach(m=>matches.push({re: new RegExp(m['re_match'], 'i'), store: stores.get(m['store_id'])}));
  matches.push({re: /.*/, store: null});
  c.forEach(c => stores.get(c['store_id']).content = c)
}

export async function init() {
  const oldStores = new Map(), oldMatches = [], newStores = new Map(), newMatches = [];
  [...stores.entries()].forEach(e=>oldStores.set(...e));
  matches.forEach(matchObj=> oldMatches.push(matchObj));
  try {
    await loadStores(newStores, newMatches);
    await attachProducts(newStores);
    stores.clear();
    matches.length = 0;
    [...newStores.entries()].forEach(e=>stores.set(...e));
    newMatches.forEach(matchObj=> matches.push(matchObj));
  } catch (err) {
    console.error('Failed to load store!  Error: ' + err);
    stores.clear();
    matches.length = 0;
    [...oldStores.entries()].forEach(e=>stores.set(...e));
    oldMatches.forEach(matchObj=> matches.push(matchObj));
  }
}

export function match(str) {
  return matches.find(m=>m.re.test(str));
}