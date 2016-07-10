import express from "express";
import os from "os";
import services from "./svc";
import {getTitle, getKeywords, getDescription, getRedirect, getImage, getType} from "./pageData";
import analytics from "./svc/analytics";
//import {attachStore} from "./svc/store";
import {attachMember, captureSource} from "./svc/member/model";
import {visit_log, activity_log} from "./svc/utils/log";
import cookieParser from "cookie-parser";
import {testAll, loadAll} from "./svc/init";
import {initializeJudges} from "./modules/judges";
import {setProducts} from "./modules/products";
import {setAuthors} from "./modules/authors";
import {setExperiment} from "./modules/experiment";
import {setMagazine} from "./modules/magazine";
import {setMember} from "./modules/member";
import {setFeatures} from "./modules/features";
import {setOtherFavorites} from "./modules/otherFavorites";
import {setSwag} from "./modules/swag";
import {setStoreData} from "./modules/storeData";
import {setStoreTime} from "./modules/storeTime";
import React from "react";
import reducers from "./modules";
import {renderToString} from "react-dom/server";
import {Provider} from "react-redux";
import {createStore, applyMiddleware} from "redux";
import Thunk from "redux-thunk";
import getRoutes from "./routes.js";
import createLocation from "history/lib/createLocation";
import {match, RouterContext} from "react-router";
import template from "./template";
import compression from "compression";

global.serving = true;

const hostname = os.hostname();
const server = express();
//server.enable('trust proxy');

server.use((req, res, next)=> {
  if (req.header('X-Forwarded-Proto') === 'http' && req.hostname.toLowerCase().indexOf('bookofthemonth') > 0) {
    res.redirect(301, 'https://www.bookofthemonth.com' + req.path);
  } else {
    next();
  }
});

server.use((req, res, next)=> {
  if (getRedirect(req.path))
    res.redirect(301, getRedirect(req.path));
  else next();
});


server.use(compression());
server.use(express.static('build/public'));
server.use((req, res, next)=> {
  req.startTime = Date.now();
  res.on('finish', ()=> {
    let serveTime = Date.now() - req.startTime;
    //activity_log(req.member ? req.member.id : null, req.ip, req.path, serveTime);
    if (serveTime > 500 && serveTime < 5000) console.error(`SLOW WARNING: Served ${req.path} in ${serveTime}ms`);
    else if (serveTime >= 5000) console.error(`HANG ERROR: Failed to serve ${req.path} in ${serveTime}ms`);
  });
  next();
});

// server.use('/svc/analytics', analytics);
// server.use(attachStore);
// server.use(cookieParser());
// server.use(attachMember);
// server.use(captureSource);


// server.use((req, res, next)=>{
//   let ab_tests = [
//     {id: 10}
//   ];
//   ab_tests.forEach((exp)=>{
//     let unique_member_id = req['cookies'][`ab_${exp.id}`] || Math.round(Math.random() * Number.MAX_SAFE_INTEGER);
//     res.cookie(`ab_${exp.id}`, unique_member_id, {expires: new Date(Date.now() + (60 * 24 * 60 * 60 * 1000)), httpOnly: false});
//     exp['version'] = unique_member_id % 2;
//   });
//   req.ab_tests = ab_tests;
//   next();
// });


server.use('/svc', services);

function serve(req, res, next) {
  if (req.path.indexOf('svc') === -1) { //temp solution to exclude svc
    let store = applyMiddleware(Thunk)(createStore)(reducers);
     store.dispatch(setStoreData(true, 7, 7, 7, 7, 7));

    // store.dispatch(setStoreData(req.store.can_pick, req.store.ship_days, req.store.ship_date, req.store.plans, req.store.gift_plans, req.store.renewal_plans));
    // store.dispatch(initializeJudges(req.store.judges));
    // store.dispatch(setProducts(req.store.products));
    // store.dispatch(setAuthors(req.store.authors));
    // store.dispatch(setMagazine(req.store.magazine));
    // store.dispatch(setFeatures(req.store.features));
    // store.dispatch(setOtherFavorites(req.store.otherFavorites));
    // store.dispatch(setSwag(req.store.swag));
    // store.dispatch(setStoreTime(req.store.now));
    // store.dispatch(setExperiment(req.ab_tests));

    if (req.member) store.dispatch(setMember(req.member));

    // let data = {
    //   id: req.store.id,
    //   title: getTitle(req.path, store.getState()),
    //   image: getImage(req.path, store.getState()),
    //   tla: req.store.tla.toLowerCase(),
    //   hostname: hostname,
    //   startTime: req.startTime,
    //   url: "www.bookofthemonth.com" + req.url,
    //   type: getType(req.path),
    //   description: getDescription(req.path, store.getState()),
    //   keywords: getKeywords(req.path)
    // };

    let data = {
      id: 1,
      title: "NFP",
      image: '',
      tla: 'nfp',
      hostname: 'hostname',
      startTime: req.startTime,
      url: "www.bookofthemonth.com" + req.url,
      type: getType(req.path),
      description: getDescription(req.path, store.getState()),
      keywords: getKeywords(req.path)
    };


    const finalState = JSON.stringify(store.getState());
    const routes = getRoutes(store);
    let location = createLocation(req.url);

    match({routes, location}, (error, redirectLocation, renderProps) => {
      if (error) res.status(500).send(error.message);
      else if (redirectLocation) res.redirect(302, redirectLocation.pathname + redirectLocation.search);
      else if (renderProps) {
        data.body = renderToString(
          <Provider store={store}>
            <RouterContext {...renderProps} />
          </Provider>
        );
        res.status(200).send(template(data, finalState));
      } else res.status(404).send("Not Found");
    });
    visit_log(req.member ? req.member.id : null, req['ip'], req.path, req.get('Referrer'), JSON.stringify(req.query));
  }
  next();
}

server.get('*', serve);

async function start() {
  try {
    await testAll();
    await loadAll();
    setInterval(async()=> {
      await loadAll();
    }, 15 * 60 * 1000); // run loadAll every 15 minutes
    server.listen(8080, () => console.log('Listening on port 8080.'));
  } catch (e) {
    console.error(e);
  }
}

start();