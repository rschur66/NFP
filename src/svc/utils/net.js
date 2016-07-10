import * as request from "superagent";

export async function get(url) {
  return new Promise((resolve, reject)=> {
    request
      .get((global && global.serving ? 'localhost:8080' : '' ) + url)
      .set('Accept', 'application/json')
      .end((err, res)=> {
        if (err || res.statusCode !== 200)
          reject({'err': res.statusCode, 'message': res.statusMessage || res.text || res.statusText || ''});
        else
          try {
            resolve(JSON.parse(resolve(res.body)));
          } catch (e) {
            reject('Did not return valid JSON: ' + e);
          }
      });
  });
}

export async function post(url, data) {
  return new Promise((resolve, reject)=> {
    request
      .post((global && global.serving ? 'localhost:8080' : '' ) + url)
      .set('Accept', 'application/json')
      .send(data)
      .end((err, res)=> {
        if (err || res.statusCode !== 200)
          reject({'err': res.statusCode, 'message': res.statusMessage || res.text || res.statusText || ''});
        else
          try {
            resolve(JSON.parse(resolve(res.body)));
          } catch (e) {
            reject('Did not return valid JSON: ' + e);
          }
      });
  });
}

export async function put(url, data) {
  return new Promise((resolve, reject)=> {
    request
      .put((global && global.serving ? 'localhost:8080' : '' ) + url)
      .set('Accept', 'application/json')
      .send(data)
      .end((err, res)=> {
        if (err || res.statusCode !== 200)
          reject({'err': res.statusCode, 'message': res.statusMessage || res.text || res.statusText || ''});
        else
          try {
            resolve(JSON.parse(resolve(res.body)));
          } catch (e) {
            reject('Did not return valid JSON: ' + e);
          }
      });
  });
}

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

//test();
