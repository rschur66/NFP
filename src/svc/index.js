import {Router} from "express";
import member from "./member";
import discussion from "./discussion";
import analytics from "./analytics";
import box from "./box";
import commerce from './commerce';
import experiment from './experiment';

const router = Router();

router.use('/member', member);
router.use('/commerce', commerce);
router.use('/discussion',discussion);
router.use('/analytics', analytics);
router.use('/box',box);
router.use('/experiment',experiment);

export default router;
