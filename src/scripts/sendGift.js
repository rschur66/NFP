import {send} from '../svc/utils/ses';
import {html, text} from '../svc/email/giftDelivery';
import {
    readQuery,
    getWriteConn,
    queryConnection,
    beginTransaction,
    commitTransaction,
    rollback,
    releaseConnection,
    endCluster
} from '../svc/utils/db';

/*
 * node_modules/babel-cli/bin/babel-node.js --presets es2015,stage-0 src/scripts/sendGift.js
 */

async function getNext(){
    return await readQuery("SELECT g.*, p.months FROM gift g INNER JOIN plan p ON g.plan_id = p.id " +
        "WHERE (delivery_code IS NULL or delivery_code = '') AND delivery_date < CURRENT_TIMESTAMP AND delivery_method = 'email' " +
        "AND (redeemed <> 1 OR redeemed IS NULL) ORDER BY delivery_date DESC LIMIT 1");
}

async function sendGiftDeliveryEmail() {
    let conn = null, ge;
    try{
        let giftEmail = await getNext();
        if(giftEmail.length){
            ge = giftEmail[0];
            let result = await send(ge.recipient_email, ge.giver_name + " Has Gifted You a Book of the Month Subscription",
               html(ge.giver_name, ge.recipient_name, ge.message, ge.months + "-MONTH", ge.gift_code),
               text(ge.giver_name, ge.recipient_name, ge.message, ge.months + "-MONTH", ge.gift_code));
            conn = await getWriteConn();
            await beginTransaction(conn);
            await queryConnection(conn, "UPDATE gift SET delivery_code = ?, delivered = 1, delivery_date = CURRENT_TIMESTAMP WHERE id = ? ", [result.MessageId, ge.id]);
            await commitTransaction(conn);
            console.log(`Gift delivery email sent to ${ge.recipient_email} - ${result.MessageId}`);
        }else{
            console.log(`Gift delivery email queue empty`);
        }
    } catch(err){
        if (conn) await rollback(conn);
        console.error(`Gift delivery email not sent ${ge ? `to ${ge.recipient_email}` : ''} - ${err}`);
        throw err;
    } finally {
        if (conn) await releaseConnection(conn);
        await endCluster();
    }
}

sendGiftDeliveryEmail();