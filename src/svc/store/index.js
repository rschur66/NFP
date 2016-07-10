import {match} from './model';

export function attachStore(req, ignore, next) {
  req.store = match('bookofthemonth.com').store;
  req.store.now = new Date().getTime();
  next();
}