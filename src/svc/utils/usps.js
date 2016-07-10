import * as request from 'superagent';
import {parseString} from 'xml2js';
import {usps as credentials} from '../../common/credentials';

function buildPayload(street1, street2, city, state, zip5, zip4) {
  return `<AddressValidateRequest USERID="${credentials.id}">
    <Address>
      <Address1>${street1}</Address1>
      <Address2>${street2}</Address2>
      <City>${city}</City>
      <State>${state}</State>
      <Zip5>${zip5}</Zip5>
      <Zip4>${zip4}</Zip4>
    </Address>
  </AddressValidateRequest>`.toString();
}

async function extractResponse(response, resolve, reject) {
  parseString(response, (err, obj)=> {
    if (err) return reject(err);
    console.log(obj);
    let address = obj['AddressValidateResponse']['Address'][0];
    resolve({
      street1: Array.isArray(address['Address1']) ? address['Address1'][0] : null,
      street2: Array.isArray(address['Address2']) ? address['Address2'][0] : null,
      city: Array.isArray(address['City']) ? address['City'][0] : null,
      state: Array.isArray(address['State']) ? address['State'][0] : null,
      zip: Array.isArray(address['Zip5']) ? address['Zip5'][0] + (Array.isArray(address['Zip4']) ? '-' + address['Zip4'][0] : '') : null
    });
  });
}

export async function validate(street1, street2, city, state, zip5, zip4) {
  return new Promise((resolve, reject)=> {
    request
      .get(credentials.url)
      .query({API: 'Verify'})
      .query({XML: buildPayload(street1, street2, city, state, zip5, zip4)})
      .set('Accept', 'text/xml')
      .end((err, res)=> {
        if (err || res.statusCode !== 200)
          reject({'err': res.statusCode, 'message': res.statusMessage || res.text || ''});
        else
          extractResponse(res.text, resolve, reject);
      });
  })
}