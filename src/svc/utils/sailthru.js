import {createSailthruClient} from 'sailthru-client';
import {sailthruConfig} from '../../common/config.js';

let DEBUG_LOG_ALL = false;

export async function exportLeadToST(email, source, store) {
  let storeConfig = sailthruConfig[store.tla];
  if (!storeConfig.enable) return;
  let sailthruClient = createSailthruClient(storeConfig.apiKey, storeConfig.apiSecret);

  let postData = {
    id: email,
    key: 'email',
    keysconflict: 'merge',
    fields: {'keys': 1},
    vars: {
      source: source
    },
    lists: {}
  };
  postData.lists[storeConfig.lists.leads] = 1;
  if (DEBUG_LOG_ALL) console.log(postData);

  return new Promise((resolve, reject) => {
    sailthruClient.apiPost('user', postData, function (err, response) {
      if (DEBUG_LOG_ALL) console.log('err', err, 'response', response);
      err ? reject('Error trying to save to Sailthru.') : resolve(response || true);
    });
  });
}


async function test() {
  await exportLeadToST(`testing_${Date.now()}@bookspan.com`, 'Jane', {tla: 'BOM'});
  console.log('PASS exportLead');
}

if (require.main === module) {
  DEBUG_LOG_ALL = true;

  test()
    .then(() => {
      console.log('\n>>DONE! All sailthru tests passed.');
      process.exit(0);
    })
    .catch((err) => {
      console.log('\nFAIL>>', err, err.stack);
      process.exit(0);
    });
}


