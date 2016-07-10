const LOCATION_CHANGE                = 'LOCATION_CHANGE';
const EMAIL_CAPTURE                  = 'EMAIL_CAPTURE';
const ENROLL_CONFIRMATION_ANALYTICS  = 'ENROLL_CONFIRMATION_ANALYTICS';
const GIFT_CONFIRMATION_TRACKING     = 'GIFT_CONFIRMATION_TRACKING';
const ENROLL_PLAN_TRACKING           = 'ENROLL_PLAN_TRACKING';

/* IMPORTANT: IF EDITS MADE TO THIS FILE MAKE SURE THAT 'enroll' event is firing on dataLayer */

export default function reducer(state = {}, action){
    switch(action.type){
        case LOCATION_CHANGE:
            if(window.dataLayer)
                window.dataLayer.push({
                    event: 'pageview',
                    logged_in: action.payload.member ? true : false,
                    url: action.payload.location
                });
            return action.payload;
        case ENROLL_CONFIRMATION_ANALYTICS:
            if(window.dataLayer){
                let plan = '', orderID, orderTotalCents, orderTotalDollars;
                if(action.payload){
                    plan =  action.payload.subscription ? action.payload.subscription.plan.name : '';
                    orderID = action.payload.order_history[0] ? action.payload.order_history[0].id: '';
                    orderTotalCents = action.payload.order_history[0] ? Math.ceil(action.payload.order_history[0].total * 100) : ''; //total in cents
                    orderTotalDollars = action.payload.order_history[0] ? action.payload.order_history[0].total : ''; //total in dollars
                    if(plan)
                        window.dataLayer.push({
                            event: 'enroll',
                            plan: plan,
                            orderID: orderID,
                            orderTotalCents: orderTotalCents,
                            orderTotalDollars: orderTotalDollars
                        });
                }
            }
            return state;
        case EMAIL_CAPTURE:
            let leadType, location = state.location;
            if(location.match(/magazine.*/)) leadType = "maglead";
            else if(location === "/") leadType = "landinglead";
            else if(location === "/enroll/email") leadType = "flowlead";
            if(leadType && window.dataLayer)
                window.dataLayer.push({
                    event: leadType
                });
            return state;
        case GIFT_CONFIRMATION_TRACKING:
            window.dataLayer.push({
                event: 'giftpurchase',
                plan: action.payload
            });
            return state;
        case ENROLL_PLAN_TRACKING:
            if(window.dataLayer){
                window.dataLayer.push({
                    event: 'selectPlan',
                    plan: action.payload.id
                });
            }
            return state;
        default:
            return state;
    }
}

export function setLocation(store, location){
    return store.dispatch({
        type: LOCATION_CHANGE,
        payload: {
            location: location,
            member: store.getState().member
        }
    })
}

export function setEmailCapture(){
    return {
        type: EMAIL_CAPTURE
    }
}

export function setGiftConfirmationTracking(plan){
    return ({
        type: GIFT_CONFIRMATION_TRACKING,
        payload: plan
    })
}

export function analyticsEnrollTracking(member){
    return({
        type: ENROLL_CONFIRMATION_ANALYTICS,
        payload: member
    })
}


export function enrollPlanTracking(plan){
    return ({
        type: ENROLL_PLAN_TRACKING,
        payload: plan
    })
}

/* IMPORTANT: IF EDITS MADE TO THIS FILE MAKE SURE THAT 'enroll' event is firing on dataLayer */