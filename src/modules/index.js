import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux'

import activeBook         from './active_book';
import activeJudge        from './active_judge';
import inactiveJudges     from './inactiveJudges';
import analytics          from './analytics';
import authors            from './authors';
import discussions        from './discussions';
import enrollStep         from './enrollStep';
import experiment         from './experiment';
import otherFavorites     from './otherFavorites';
import swag               from './swag';
import giftRedeemStep     from './giftRedeemStep';
import grouponRedeemStep  from './grouponRedeemStep';
import giftStep           from './giftStep';
import features           from './features';
import guestJudges        from './guestJudges';
import judges             from './judges';
import meetJudges         from './meetJudges';
import loginError         from './loginError';
import magazine           from './magazine';
import member             from './member';
import members            from './members';
import storeData          from './storeData';
import timeline           from './timeline';
import products           from './products';
import enrollData         from './enrollData';
import storeTime          from './storeTime';
import braintreeError     from './braintreeError';

const rootReducer = combineReducers({
  activeBook,
  activeJudge,
  inactiveJudges,
  analytics,
  authors,
  braintreeError,
  discussions,
  enrollStep,
  enrollData,
  experiment,
  features,
  giftStep,
  giftRedeemStep,
  grouponRedeemStep,
  guestJudges,
  judges,
  meetJudges,
  otherFavorites,
  swag,
  loginError,
  magazine,
  member,
  members,
  timeline,
  storeTime,
  storeData,
  products,
  routing: routerReducer
});

export default rootReducer;