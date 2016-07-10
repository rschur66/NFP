import {createPool} from "mysql";
import {mysqlConfig} from '../common/config';

/*
 Run with:
 node_modules/babel-cli/bin/babel-node.js --presets es2015,stage-0 src/scripts/generateGroupon.js
 */

const xavier = createPool(mysqlConfig.root_pool);

function queryPool(pool, query, params) {
  return new Promise((resolve, reject) =>
    pool.query(query, params, (err, rows) => {
      if (err || !rows) reject(err);
      else resolve(JSON.parse(JSON.stringify(rows)));
    }));
}

async function generateGrouponCodes() {
  console.log('generating groupon codes ');
  let grouponCodes = [];
  for( let i = 0; i < 1000; i++ )
    grouponCodes.push([ Math.random().toString(36).slice(2,12), 1017, 0]);
  await queryPool(xavier, 'INSERT groupon (groupon_code, plan_id, redeemed) VALUES ?;', [grouponCodes]);
}


async function run() {
  try { await generateGrouponCodes(); }
  catch (e) { console.error(e); }
  finally { xavier.end(); }
}

run();
