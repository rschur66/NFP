import {Router} from "express";
import {writeNewActivity, writeNewErrorActivity} from './model';

const ipRE = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;

export async function writeActivity(req, res, ignore) {
  try {
    writeNewActivity(returnIpAsInt(req['ip']), req.params['memberId'], req.params['path'], req.params['action']);
  } catch (e) {
    console.error(e);
  } finally {
    res.status(200).end();
  }
}

export async function writeErrorActivity(req, res, ignore) {
  try {
    writeNewErrorActivity(returnIpAsInt(req['ip']), req.params['memberId'], req.params['path'], req.params['action'], req.params['error'], req.headers["user-agent"]);
  } catch (e) {
    console.error(e);
  } finally {
    res.status(200).end();
  }
}

function returnIpAsInt(reqIp){
  let ipS = reqIp ? reqIp.toString().slice(7) : '', ipA = [], ip = 0;
  if (ipRE.test(ipS)) ipA = ipS.split('.');
  if (ipA.length === 4) ip = (ipA[0] * 16777216) + ipA[1] * 65536 + ipA[2] * 256 + ipA[3];
  return ip;
}

const router = Router();
router.get("/:path/:action/:memberId", writeActivity);
router.get("/error/:path/:action/:memberId/:error", writeErrorActivity);

export default router;