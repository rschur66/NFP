import {Router} from "express";
import {handleError} from '../utils';
import bodyParser from "body-parser";
import {
  getDiscussionsByProduct,
  getThreadById,
  replyDiscussion,
  editDiscussion,
  postDiscussion,
  likeDiscussion,
  unlikeDiscussion
} from './model';

const bodyParserJSON = bodyParser.json();

async function getProductDiscussions(req, res, next) {
  try {
    if (req.params && req.params['ids']) {
      res.status(200).json(await getDiscussionsByProduct(req.params['ids'].split(','), req.member ? req.member.id : null));
    } else
      next({code: 404, message: 'Product ID required.', body: ''});
  } catch (e) {
    console.error(e);
    next({code: 500, message: 'Failed to retrieve discussions.', body: e});
  }
}

async function discussionReply(req, res, next) {
  if (!req.params || !req.params.id)
    return next({code: 400, message: 'URL format must be /svc/discussion/reply/:discussionId.', body: null});
  if (!req.member)
    return next({code: 403, message: 'Must be logged in to reply to discussions.', body: null});
  if (!req.body.body)
    return next({code: 400, message: 'Missing content for reply.'});
  try {
    let newThread = await replyDiscussion(req.params.id, req.body.body, req.member.id, req.member.display_name);
    if (newThread) res.status(200).json(await getThreadById(newThread, req.member.id));
    else next({code: 400, message: 'Discussion_id does not exist.', body: ''});
  } catch (e) {
    next({code: 500, message: 'Unspecified server error.', body: e});
  }
}

async function discussionEdit(req, res, next) {
  if (!req.params || !req.params.id)
    return next({code: 400, message: 'URL format must be /svc/discussion/edit/:discussionId.', body: null});
  if (!req.member)
    return next({code: 403, message: 'Must be logged in to edit discussions.', body: null});
  if (!req.body.body)
    return next({code: 400, message: 'Missing content for edit.'});
  try {
    let newThread = await editDiscussion(req.params.id, req.body.body, req.body.title, req.member.id);
    if (newThread) res.status(200).json(await getThreadById(newThread, req.member.id));
    else next({code: 400, message: 'Discussion_id does not exist.', body: ''});
  } catch (e) {
    next({code: 500, message: 'Unspecified server error.', body: e});
  }
}

async function discussionPost(req, res, next) {
  if (!req.member || !req.member['id'])
    return next({code: 403, message: 'Must be logged in to start a discussion.', body: null});
  if (!req.params || !req.params['product_id'])
    return next({code: 400, message: 'URL format must be /svc/discussion/product/:productId.', body: null});
  if (!req.body || !req.body['body'])
    return next({code: 400, message: 'Missing body for post.'});
  if (!req.params || !req.params['product_id'])
    return next({code: 400, message: 'Must post about a product, product_id missing.'});
  if (!req.body['title'])
    return next({code: 400, message: 'Must title your post, title missing.'});
  try {
    let newThread = await postDiscussion(req.body['body'], req.body['title'], req.params['product_id'], req.member['id']);
    if (newThread) res.status(200).json(newThread);
    else next({code: 400, message: 'Discussion_id does not exist.', body: ''});
  } catch (e) {
    next({code: 500, message: 'Unspecified server error.', body: e});
  }
}

async function discussionLike(req, res, next) {
  if (!req.member || !req.member.id)
    return next({code: 403, message: 'Must be logged in to like a comment.', body: null});
  if (!req.params || !req.params.id)
    return next({code: 400, message: 'URL format must be /svc/discussion/like/:id.', body: null});
  let result = await likeDiscussion(req.params.id, req.member.id);
  return result ? next(result) : res.status(200).end();
}

async function discussionUnlike(req, res, next) {
  if (!req.member || !req.member.id)
    return next({code: 403, message: 'Must be logged in to unlike a comment.', body: null});
  if (!req.params || !req.params.id)
    return next({code: 400, message: 'URL format must be /svc/discussion/unlike/:id.', body: null});
  let result = await unlikeDiscussion(req.params.id, req.member.id);
  return result ? next(result) : res.status(200).end();
}

const router = Router();

router.get("/product/:ids", getProductDiscussions);
router.post("/reply/:id", bodyParserJSON, discussionReply);
router.post("/edit/:id", bodyParserJSON, discussionEdit);
router.post("/product/:product_id", bodyParserJSON, discussionPost);
router.put("/like/:id", discussionLike);
router.put("/unlike/:id", discussionUnlike);
router.use(handleError);

export default router;
