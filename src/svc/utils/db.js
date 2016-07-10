import * as mysql from "mysql";
import assert from "assert";
import {mysqlConfig, awsConfig} from "../../common/config.js";

const poolCluster = mysql.createPoolCluster(mysqlConfig.poolCluster);

poolCluster.add('WRITE', mysqlConfig.write_pool);
if (awsConfig.zone === 'A') {
  poolCluster.add('READ1', mysqlConfig.read_pool_a);
  poolCluster.add('READ2', mysqlConfig.read_pool_b);
} else if (awsConfig.zone === 'B') {
  poolCluster.add('READ1', mysqlConfig.read_pool_b);
  poolCluster.add('READ2', mysqlConfig.read_pool_a);
} else {
  console.error('Config file requires that awsConfig.zone be set to \'A\' or \'B\'');
  poolCluster.add('READ1', mysqlConfig.read_pool_a);
  poolCluster.add('READ2', mysqlConfig.read_pool_b);
}

export function releaseConnection(connection) {
  return new Promise((resolve, reject)=> {
    if (connection)
      try {
        connection.release();
        resolve();
      } catch (e) {
        reject('Failed to release connection: ' + e);
      }
  })
}

// Write always has to go to the cluster write endpoint.
export function getWriteConn() {
  return new Promise((resolve, reject) => {
    poolCluster.getConnection('WRITE', 'ORDER', (err, connection) => {
      err ? reject(err) : resolve(connection);
    });
  });
}

// When getting a read connection, try for same zone first.
export function getReadConn() {
  return new Promise((resolve, reject) => {
    poolCluster.getConnection('READ*', 'ORDER', (err, connection) => {
      err ? reject(err) : resolve(connection);
    });
  });
}

export function beginTransaction(connection) {
  return new Promise((resolve, reject)=> {
    connection.beginTransaction((err)=> {
      if (err) {
        console.error(err);
        reject(connection);
      } else resolve(connection);
    });
  });
}

export function commitTransaction(conn) {
  return new Promise((resolve, reject)=> {
    conn.commit((err)=> {
      if (err) reject(conn); else resolve();
    })
  });
}

export function rollback(conn) {
  return new Promise((resolve, reject)=> {
    conn.rollback((err)=> {
      if (err) reject(err); else resolve();
    });
  });
}

// Quick promise wrapper around query
export function queryConnection(connection, query, params) {
  return new Promise((resolve, reject) => {
    connection.query(query, params, (err, result) => {
      err ? reject(err) : resolve(JSON.parse(JSON.stringify(result)));
    });
  });
}

export async function readQuery(query, params) {
  let connection = null, result = null;
  try {
    connection = await getReadConn();
    result = await queryConnection(connection, query, params);
  } catch (e) {
    throw e;
  } finally {
    await releaseConnection(connection);
  }
  return JSON.parse(JSON.stringify(result));
}


export async function writeQuery(query, params) {
  let connection = null, result = null;
  try {
    connection = await getWriteConn();
    result = await queryConnection(connection, query, params);
  } catch (e) {
    throw e;
  } finally {
    await releaseConnection(connection);
  }
  return JSON.parse(JSON.stringify(result));
}

export async function endCluster() {
  return new Promise(() => poolCluster.end());
}

/**************************************
 * Unit testing
 * to run from project root directory:
 * > ./node_modules/.bin/babel-node --presets es2015,stage-0 src/svc/utils/db.js
 *************************************/

export async function test(debug) {
  let readConn, writeConn, conn, result;
  try {
    if (debug) console.log('Begin db test:');
    readConn = await getReadConn();
    if (debug) console.log('getReadConn: passed');
    result = await queryConnection(readConn, 'SELECT 1+1 AS test');
    assert(result[0] && result[0].test === 2, 'queryConnection failed');
    if (debug) console.log('queryConnection: passed');
    writeConn = await getWriteConn();
    if (debug) console.log('getWriteConn: passed');
    result = await queryConnection(writeConn, 'INSERT test_table (val) VALUES (?)', [7]);
    assert(result, result.insertId, 'getWriteConn failed');
    if (debug) console.log('queryConnection1: passed');
    result = await queryConnection(readConn, 'SELECT val FROM test_table WHERE id = ?', [result.insertId]);
    assert(Array.isArray(result) && result[0].val === 7, 'queryConnection2: failed');
    if (debug) console.log('queryConnection2: passed');
    result = await readQuery('SELECT 1+2 AS test');
    assert(Array.isArray(result) && result[0].test === 3, 'readQuery: failed');
    if (debug) console.log('readQuery: passed');
    result = await writeQuery('INSERT test_table (val) VALUES (?)', [11]);
    assert(result && result.insertId, 'writeQuery: failed');
    if (debug) console.log('writeQuery: passed');
    result = await readQuery('SELECT val FROM test_table WHERE id = ?', [result.insertId]);
    assert(Array.isArray(result) && result[0].val === 11, 'readQuery&writeQuery failed');
    if (debug) console.log('readQuery&writeQuery: passed');
    conn = await getWriteConn();
    await beginTransaction(conn);
    await queryConnection(conn, 'INSERT test_table (val) VALUES (?)', [1013]);
    await rollback(conn);
    result = await readQuery('SELECT MAX(val) val FROM test_table;');
    assert(Array.isArray(result) && result[0].val <= 13, 'transaction w/ rollback: failed');
    if (debug) console.log('transaction w/ rollback: passed');
    await beginTransaction(conn);
    await queryConnection(conn, 'INSERT test_table (val) VALUES (?)', [13]);
    await commitTransaction(conn);
    result = await readQuery('SELECT MAX(val) val FROM test_table;');
    assert(Array.isArray(result) && result[0].val === 13, 'transaction w/ commit: failed');
    if (debug) console.log('transaction w/ commit: passed');
    await writeQuery('DELETE FROM test_table');
    if (debug) console.log('DB tests successful!');
    return true;
  } catch (e) {
    console.error('Error running DB tests: ' + e, e.stack);
    return false;
  } finally {
    if (readConn) readConn.release();
    if (writeConn) writeConn.release();
    if (conn) conn.release();
    //if (debug && poolCluster) await endCluster();
  }
}

// test(true);
