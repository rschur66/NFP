import {get, post} from './net';

/*
 * async/await wrapper for netsuite requests (once we know what they are)
 */

async function test() {
  try {
    let getResult = await get('http://httpbin.org/get?hello=world');
    if (!getResult.args || getResult.args.hello !== 'world') console.log('Incorrect data in getResponse.');
    else console.log('GET passed');
    let postResult = await post('http://httpbin.org/post', {hello: "world"});
    if (!postResult.json || postResult.json.hello !== 'world') console.log('Incorrect data in postResponse.');
    else console.log('POST passed');
  } catch (e) {
    console.error(e);
  }
}

test();