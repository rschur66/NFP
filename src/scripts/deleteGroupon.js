import {createPool} from "mysql";
import {mysqlConfig} from '../common/config';

/*
 Run with:
 node_modules/babel-cli/bin/babel-node.js --presets es2015,stage-0 src/scripts/deleteGroupon.js
 */

const xavier = createPool(mysqlConfig.root_pool);

function queryPool(pool, query, params) {
  return new Promise((resolve, reject) =>
    pool.query(query, params, (err, rows) => {
      if (err || !rows) reject(err);
      else resolve(JSON.parse(JSON.stringify(rows)));
    }));
}

async function deleteGrouponCodes() {
  console.log('deleting groupon codes ');
  await queryPool(xavier, 'TRUNCATE TABLE groupon;');
}


async function run() {
  try { await deleteGrouponCodes(); }
  catch (e) { console.error(e); }
  finally { xavier.end(); }
}

run();
