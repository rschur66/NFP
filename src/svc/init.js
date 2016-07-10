import {test as dbTest} from './utils/db';
import {init as storeInit} from './store/model';

/*
 * This should eventually include testing for SQS, Braintree, etc.
 */

export async function testAll() {
  console.log('Testing resources:');
  let dbResult = await dbTest();
  console.log('DB: ', dbResult ? 'passed' : 'failed');
  return dbResult;
}

export async function loadAll() {
  console.log('Initializing content:');
  await storeInit();
  console.log('Content loaded.');
}