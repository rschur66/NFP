import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App                 from './components/skeleton/App.jsx';
import LandingPage         from './components/pages/landing_page/LandingPage.jsx';
import Magazine            from './components/pages/magazine/Magazine.jsx';
import MagazineLanding     from './components/pages/magazine/MagazineLanding.jsx';
import Post                from './components/pages/magazine/Post.jsx';
import Judges              from './components/pages/judges/Judges.jsx';
import PrivacyPolicy       from './components/pages/cms/PrivacyPolicy.jsx';
import TermsOfService      from './components/pages/cms/TermsOfService.jsx';
import TermsOfMembership   from './components/pages/cms/TermsOfMembership.jsx';
import ContactUs           from './components/pages/cms/ContactUs.jsx';
import LearnMore           from './components/pages/cms/LearnMore.jsx';
import OurStory            from './components/pages/our_story/OurStory.jsx';
import PageAboutSelections from './components/pages/selections/PageAboutSelections.jsx';
import PageMyBotm          from './components/pages/selections/PageMyBotm.jsx';
import PageMoreSelections  from './components/pages/selections/PageMoreSelections.jsx';
import PageOtherFavorites  from './components/pages/selections/PageOtherFavorites.jsx';
import Swag                from './components/pages/selections/Swag.jsx';
import Enroll              from './components/pages/enroll/Enroll.jsx';
import Gift                from './components/pages/gift/Gift.jsx';
import GiftSurveyGenre     from './components/pages/gift/GiftSurveyGenre.jsx';
import GiftSurveyFrequency from './components/pages/gift/GiftSurveyFrequency.jsx';
import GiftRedeemAccount   from './components/pages/gift/GiftRedeemAccount.jsx';
import GiftRedeemMember    from './components/pages/gift/GiftRedeemMember.jsx';
import PurchaseGift        from './components/pages/gift/PurchaseGift.jsx';
import GiftPurchaseAccount from './components/pages/gift/GiftPurchaseAccount.jsx';
import GiftPurchaseConfirmation from './components/pages/gift/GiftPurchaseConfirmation.jsx';
import GiftRedeem          from './components/pages/gift/GiftRedeem.jsx';
import Login               from './components/pages/account/Login.jsx';
import ForgotPassword      from './components/pages/account/ForgotPassword.jsx';
import ChangePassword      from './components/pages/account/ChangePassword.jsx';
import Account             from './components/pages/account/Account.jsx';
import AccountInfo         from './components/pages/account/AccountInfo.jsx';
import PlanInfo            from './components/pages/account/PlanInfo.jsx';
import Renewal             from './components/pages/account/Renewal.jsx';
import RenewalConfirmation from './components/pages/account/RenewalConfirmation.jsx';
import ShippingInfo        from './components/pages/account/ShippingInfo.jsx';
import ReferFriend         from './components/pages/account/ReferFriend.jsx';
import PaymentInfo         from './components/pages/account/PaymentInfo.jsx';
import MyBox               from './components/pages/account/MyBox.jsx';
import OrderHistory        from './components/pages/account/OrderHistory.jsx';
import Discussions         from './components/pages/discussions/Discussions.jsx';
import SurveyGenre         from './components/pages/enroll/EnrollSurveyGenre.jsx';
import SurveyFrequency     from './components/pages/enroll/EnrollSurveyFrequency.jsx';
import EnrollEnterEmail    from './components/pages/enroll/EnrollEnterEmail.jsx';
import EnrollSelectPlanItems  from './components/pages/enroll/EnrollSelectPlanItems.jsx';
import EnterAccountInfo    from './components/pages/enroll/EnterAccountInfo.jsx';
import EnrollConfirmation  from './components/pages/enroll/EnrollConfirmation.jsx';
import Promo               from './components/pages/promos/Promo.jsx';
import GrouponRedeem       from './components/pages/promos/GrouponRedeem.jsx';
import GrouponAccountInfo  from './components/pages/promos/GrouponAccountInfo.jsx';

//for testing
import Typography         from './components/skeleton/xRef-Typography.jsx';
import ButtonsForms       from './components/skeleton/xRef-ButtonsForms.jsx';
import { stepHierarchy } from './modules/enrollStep';
import { giftRedeemStepHierarchy } from './modules/giftRedeemStep';
import { giftStepHierarchy } from './modules/giftStep';
import { grouponRedeemStepHierarchy } from './modules/grouponRedeemStep';


export default function getRoutes (store) {
    
  function enrollAuthenticate(nextState, replace){

    if( stepHierarchy[nextState.routes[2].path] > 3 && stepHierarchy[nextState.routes[2].path] > stepHierarchy[store.getState().enrollStep])
      replace('/enroll/'+ store.getState().enrollStep);

    if(store.getState().enrollStep!='confirmation') antiAuthenticate(nextState, replace);
  }

  function giftRedeemAuthenticate(nextState, replace){
    if( giftRedeemStepHierarchy[nextState.routes[2].path] > giftRedeemStepHierarchy[store.getState().giftRedeemStep] )
      replace('/gift/' + store.getState().giftRedeemStep );
  }

  function giftAuthenticate(nextState, replace){
    if( giftStepHierarchy[nextState.routes[2].path] > giftStepHierarchy[store.getState().giftStep] )
      replace('/gift/' + store.getState().giftStep );
  }

  function grouponRedeemAuthenticate(nextState, replace){
    if( grouponRedeemStepHierarchy[nextState.routes[2].path] > grouponRedeemStepHierarchy[store.getState().grouponRedeemStep] )
      replace('/promos/'+ store.getState().grouponRedeemStep);
    if(store.getState().grouponRedeemStep!='confirmation') antiAuthenticate(nextState, replace);
  }

  function authenticate(nextState, replace){
    if ( !store.getState().member ) replace('/login');
  }

  function antiAuthenticate(nextState, replace){
    if ( store.getState().member ) replace('/my-box');
  }

  function hotjarTrigger(nextState, replace){
    if( typeof window !== 'undefined') hj('trigger', 'FbVisitor');
  }

  return (
      <Route path="/" component={App} >
        <IndexRoute                        component={LandingPage}  onEnter={antiAuthenticate}/>
        <Route path="judges"               component={Judges} />
        <Route path="judges/:judge"        component={Judges} />

        <Route path="our-story"            component={OurStory} />
        <Route path="my-botm"              component={PageMyBotm} onEnter={authenticate} />
        <Route path="my-botm/:book"        component={PageMyBotm} onEnter={authenticate} />
        <Route path="more-books"           component={PageMoreSelections} />
        <Route path="more-books/:book"     component={PageMoreSelections} />

        <Route path="other-favorites"      component={PageOtherFavorites} />
        <Route path="swag"                 component={Swag} />
        <Route path="about-selections"     component={PageAboutSelections} />
        <Route path="about-selections/:book" component={PageAboutSelections} />
        <Route path="learn-more"           component={LearnMore} />
        <Route path="privacy-policy"       component={PrivacyPolicy} />
        <Route path="terms-of-service"     component={TermsOfService} />
        <Route path="terms-of-membership"  component={TermsOfMembership} />
        <Route path="contact-us"           component={ContactUs} />
        <Route path="login"                component={Login} onEnter={antiAuthenticate} />
        <Route path="forgot-password"      component={ForgotPassword} />
        <Route path="reset-password"       component={ChangePassword} />

        <Route path="my-box"              component={MyBox} onEnter={authenticate} />
        <Route path="my-box/:date"        component={MyBox} onEnter={authenticate} />

        <Route path="discussions"         component={Discussions} />
        <Route path="discussions/:type"   component={Discussions} />
        <Route path="discussions/:type/:product_id" component={Discussions} />
        <Route path="discussions/:type/:year/:month" component={Discussions} />

        <Route path="promos"                 component={Promo}>
          <IndexRoute                       component={GrouponRedeem} onEnter={antiAuthenticate} />
          <Route path="groupon"             component={GrouponRedeem} onEnter={antiAuthenticate} />
          <Route path="account"             component={GrouponAccountInfo} onEnter={grouponRedeemAuthenticate}  />
          <Route path="confirmation"        component={EnrollConfirmation} onEnter={grouponRedeemAuthenticate}  />
        </Route>

        <Route path="typography"          component={Typography} />
        <Route path="buttons"             component={ButtonsForms} />


        <Route path="enroll"              component={Enroll}>
          <IndexRoute                     component={SurveyGenre} onEnter={antiAuthenticate} />
          <Route path="genre"             component={SurveyGenre} onEnter={antiAuthenticate} />
          <Route path="frequency"         component={SurveyFrequency} onEnter={enrollAuthenticate} />
          <Route path="email"             component={EnrollEnterEmail} onEnter={enrollAuthenticate} />
          <Route path="plan"              component={EnrollSelectPlanItems} onEnter={enrollAuthenticate} />
          <Route path="account"           component={EnterAccountInfo} onEnter={enrollAuthenticate} />
          <Route path="confirmation"      component={EnrollConfirmation} onEnter={enrollAuthenticate} />
        </Route>);

        <Route path="account"           component={Account} onEnter={authenticate} >
          <IndexRoute                   component={AccountInfo} />
          <Route path="shipping"        component={ShippingInfo} />
          <Route path="account-info"    component={AccountInfo} />
          <Route path="refer-a-friend"  component={ReferFriend} />
          <Route path="payment"         component={PaymentInfo} />
          <Route path="plan"            component={PlanInfo} />
          <Route path="order-history"   component={OrderHistory} />
        </Route>

        <Route path="renewal"               component={Renewal} />
        <Route path="renewal-confirmation"  component={RenewalConfirmation} onEnter={authenticate} />

        <Route path="magazine"            component={Magazine}>
          <IndexRoute                     component={MagazineLanding} />
          <Route path="post/:id"          component={Post} />
        </Route>

        <Route path="gift"              component={Gift}>
          <IndexRoute                   component={PurchaseGift} />
          <Route path="give"            component={PurchaseGift} />
          <Route path="gift-account"    component={GiftPurchaseAccount} onEnter={giftAuthenticate} />
          <Route path="purchase-confirmation" component={GiftPurchaseConfirmation} onEnter={giftAuthenticate} />
          <Route path="redeem"          component={GiftRedeem} />
          <Route path="genre"           component={GiftSurveyGenre} onEnter={giftRedeemAuthenticate} />
          <Route path="frequency"       component={GiftSurveyFrequency} onEnter={giftRedeemAuthenticate} />
          <Route path="account"         component={GiftRedeemAccount} onEnter={giftRedeemAuthenticate} />
          <Route path="confirmation"    getComponent={(nextState, cb) => {
              if(store.getState().member && !store.getState().enrollData.newMember ) cb(null, GiftRedeemMember);
              else cb(null, EnrollConfirmation);
          }} /> onEnter={giftRedeemAuthenticate} />
        </Route>

        <Route path=":book"          component={LandingPage} />
        <Route path="/welcome/:hero" component={LandingPage} />
        <Route path="/fb/welcome"    component={LandingPage} onEnter={hotjarTrigger} />

        // catch all
        <Route path="*"              component={LandingPage} />
      </Route>
  );
}
