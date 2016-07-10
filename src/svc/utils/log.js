import {writeQuery} from "./db";

const box_actions = ['add', 'remove', 'makeBoM', 'skip'];
const member_actions = ['update', 'create', 'logout', 'passwordReset', 'changeRenew', 'applyGift', 'purchasePlan'];
const ipRE = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
const visits = [];
const boxes = [];
const members = [];
const activities = [];
const steps = [];

function returnIpAsInt(reqIp) {
  let ipS = reqIp ? reqIp.toString().slice(7) : '', ipA = [], ip = 0;
  if (ipRE.test(ipS)) ipA = ipS.split('.');
  if (ipA.length === 4) ip = ipA[0] * Math.pow(2, 24) + ipA[1] * Math.pow(2, 16) + ipA[2] * Math.pow(2, 8) + ipA[3];
  return ip;
}

export function box_log(member_id, product_id, action, month, year) {
  if (box_actions.find(a=>a === action))
    boxes.push([member_id, product_id, month, year, action]);
}

export function member_log(member_id, action, params) {
  if (member_actions.find(a=>a === action) && typeof(member_id))
    members.push([member_id, action, params]);
}

export function visit_log(member_id, ip, path, referrer, query) {
  if (path.toString().indexOf('favicon') === -1)
    visits.push([member_id, returnIpAsInt(ip), path, referrer, query]);
}

export function ab_log(unique_member_id, experiment_id, version, step, device_type) {
  if (typeof(unique_member_id))
    steps.push([unique_member_id, experiment_id, version, step, device_type]);
}

export function activity_log(member_id, ip, path, serve_time) {
  activities.push([member_id, ip, path, serve_time]);
}

async function writeVisits() {
  try {
    let writes = [];
    if (visits.length)
      writes.push(writeQuery('INSERT visit_log (member_id, ip, path, referrer, query) VALUES ?;', [visits.length === 1 ? visits : visits.splice(0, 100)]));
    if (boxes.length)
      writes.push(writeQuery('INSERT box_log (member_id, product_id, month, year, action) VALUES ?', [boxes.length === 1 ? boxes : boxes.splice(0, 100)]));
    if (members.length)
      writes.push(writeQuery('INSERT member_log (member_id, action, params) VALUES ?', [members.length === 1 ? members : members.splice(0, 100)]));
    if (steps.length)
      writes.push(writeQuery('INSERT ab_log (unique_member_id, experiment_id, version, step, device_type) VALUES ?', [steps.length === 1 ? steps : steps.splice(0, 100)]));
    if (activities.length)
      writes.push(writeQuery('INSERT activity_log (member_id, ip, path, serve_time) VALUES ?', [activities.length === 1 ? activities : activities.splice(0, 100)]));
    await Promise.all(writes);
  } catch (e) {
    console.error('Failed to log events: ' + e);
  }
}

const interval = setInterval(writeVisits, 10000);

async function cleanup() {
  try {
    clearInterval(interval);
    console.log((members.length + boxes.length + visits.length + steps.length + activities.length) + ' log entries left in buffer.');
    await writeVisits();
    console.log('Log buffer dumped to DB');
  } catch (e) {
    console.log('Failed to purge log: ' + e);
  }
}

process.on('beforeExit', cleanup);
