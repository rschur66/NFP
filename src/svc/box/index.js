import {Router} from "express";
import {setBox, setFutureBox} from "./model";
import {handleError} from "../utils";
import {box_log} from "../utils/log";
import {sendMember} from "../member";
import {
  makeBOM as sharedMakeBOM,
  addToBox as sharedAddToBox,
  removeFromBox as sharedRemoveFromBox,
  addToSwag as sharedAddToSwag,
  removeFromSwag as sharedRemoveFromSwag
} from "../../shared/box";

const router = Router();

async function makeBOM(req, ignore, next) {
  let y = (new Date()).getYear() - 115, m = (new Date()).getMonth(),
    productId = req.params && /^\d+$/.test(req.params['productId']) ? req.params['productId'] : null;
  if (!req.member)
    return next({code: 403, message: 'Not logged in.', body: null});
  if (!productId)
    return next({code: 400, message: 'Service called with invalid or missing productId.', body: req.member});
  if (!req.store.can_pick)
    return next({code: 400, message: 'The picking period has closed for this month, sorry!', body: req.member});
  if (!req.member.can_pick)
    return next({code: 400, message: 'Your picking period has closed for the month, sorry!', body: req.member});
  if (!req.store.features[y][m]['featured'].reduce((p, f)=>p || f == productId, false))
    return next({
      code: 400,
      message: 'Only this month\'s products may be set as your Book of the Month',
      body: req.member
    });
  try {
    await setBox(req.member.id, sharedMakeBOM(req.member.box.books, req.store.features[y][m]['featured'], productId));
    req.reload = true;
    next();
    box_log(req.member.id, parseInt(productId, 10), 'makeBoM', m, y);
  } catch (e) {
    next({code: 500, message: 'Unspecified server error.', body: req.member});
  }
}

async function addToBox(req, ignore, next) {
  let productId = req.params && /^\d+$/.test(req.params['productId']) ? req.params['productId'] : null,
    box = req.member['can_pick'] && req.store['can_pick'] ? req.member.box : req.member.box_future,
    isBook = req.store.products[productId] ? !req.store.products[productId]['swag'] : true;
  if (!req.member)
    return next({code: 403, message: 'Not logged in.', body: req.member});
  if (!productId || !Object.keys(req.store.products).reduce((p, f)=>p || f == productId, false))
    return next({code: 400, message: 'Service called with invalid or missing productId.', body: req.member});
  if ([...box.books, ...box.swag].find(p=>p == productId))
    return next({code: 400, message: 'Your box already contains this product.', body: req.member});
  if ((isBook && box.books.length > 2) || (!isBook && box.swag.length > 2))
    return next({
      code: 400,
      message: `Your box is full, please remove a ${isBook ? 'book' : 'product'} before adding a new one.`,
      body: req.member
    });
  try {
    let setB = req.member['can_pick'] && req.store['can_pick'] ? setBox : setFutureBox;
    let newBox = isBook ? [...sharedAddToBox(box.books, productId), ...box.swag] :
      [...box.books, ...sharedAddToSwag(box.swag, productId)];
    await setB(req.member.id, newBox);
    req.reload = true;
    next();
    let month = new Date().getMonth() + (req.member['can_pick'] && req.store['can_pick'] ? 0 : 1);
    let year = new Date(new Date().setMonth(month)).getYear() - 115;
    box_log(req.member.id, parseInt(productId, 10), 'add', month, year);
  } catch (e) {
    console.error(e);
    next({code: 500, message: 'Unspecified server error.', body: req.member});
  }
}

async function removeFromBox(req, ignore, next) {
  let productId = req.params && /^\d+$/.test(req.params['productId']) ? req.params['productId'] : null;
  if (!req.member)
    return next({code: 403, message: 'Not logged in.', body: []});
  if (!productId)
    return next({code: 400, message: 'Service called with invalid or missing productId.', body: req.member});
  if ((req.member['can_pick'] && req.store['can_pick'] ? req.member.box.books : req.member.box_future.books)[0] === productId)
    return next({code: 400, message: 'You cannot remove your BOM, please replace it instead.', body: req.member});
  try {
    let [box, setB] =
      req.member['can_pick'] && req.store['can_pick'] ? [req.member.box, setBox] : [req.member.box_future, setFutureBox];
    let newBox = [...sharedRemoveFromBox(box.books, productId), ...sharedRemoveFromSwag(box.swag, productId)];
    await setB(req.member.id, newBox);
    req.reload = true;
    next();
    let month = new Date().getMonth() + (req.member['can_pick'] && req.store['can_pick'] ? 0 : 1);
    let year = new Date(new Date().setMonth(month)).getYear() - 115;
    box_log(req.member.id, parseInt(productId, 10), 'remove', month, year);
  } catch (e) {
    console.error(e);
    next({code: 500, message: 'Unspecified server error.', body: req.member});
  }
}

async function skipMonth(req, ignore, next) {
  if (!req.member)
    return next({code: 403, message: 'Not logged in.', body: null});
  if (!req.member['can_pick'])
    return next({
      code: 400,
      message: 'You are not eligible to skip right now, either your order has shipped or the picking period has closed.',
      body: req.member
    });
  try {
    await setBox(req.member.id, []);
    req.reload = true;
    next();
  } catch (e) {
    next({code: 500, message: 'Unspecified server error.', body: req.member});
  }
  let month = new Date().getMonth() + (req.member['can_pick'] && req.store['can_pick'] ? 0 : 1);
  let year = new Date(new Date().setMonth(month)).getYear() - 115;
  box_log(req.member.id, null, 'skip', month, year);
}

router.get("/bom/:productId", makeBOM, sendMember);
router.get("/add/:productId", addToBox, sendMember);
router.get("/rem/:productId", removeFromBox, sendMember);
router.get("/skip", skipMonth, sendMember);
router.use(handleError);

export default router;