import {send} from '../utils/ses';

export async function sendGiftPurchaseConfirmation(giver_name, receiver_name, plan_name, delivery_date, method, voucher_code, order_id, price, tax, email) {
  await send(email, subject(),
    html(giver_name, receiver_name, plan_name, delivery_date, method, voucher_code, order_id, price, tax),
    text(giver_name, receiver_name, plan_name, delivery_date, method, voucher_code, order_id, price, tax));
}

function subject() {
  return `Gift Purchase Confirmation`;
}

function text(giver_name, receiver_name, plan_name, delivery_date, method, voucher_code, order_id, price, tax) {
  return `Dear ${giver_name},

Thank you for giving the gift of reading! A receipt for your gift membership purchase can be found below.

` + method == 'email' ? `We will email ${receiver_name} a ${plan_name} membership gift on ${delivery_date}.

If you would prefer to deliver your gift in person, use the link below to access a printable gift voucher:` :
  `Click Here to view your printable gift voucher (it looks great printed in color!):`
  + `
https://s3.amazonaws.com/botm/gift_certificates/${voucher_code}.pdf

Order Receipt${order_id ? `
Order Id: `+ order_id : ``}
Description: ${plan_name} membership
Price: $${price}
Tax: $${Math.round(100 * tax) / 100}
Total: $${Math.round(100 * (price + tax)) / 100}

Feel free to contact us with any questions at member.services@bookofthemonth.com.

Happy reading,
Book of the Month
Like us on Facebook https://www.facebook.com/BookoftheMonth`;
}

export function html(giver_name, receiver_name, plan_name, delivery_date, method, voucher_code, order_id, price, tax) {
  return `<tr>
  <td>
    <table cellpadding="40" cellspacing="0" align="center" width="100%" style="background-color:#ffffff; border: 1px solid #deddd5;" >
      <tr>
        <td style="font-family: Arial, Helvetica, sans-serif; font-size:13px; line-height:150%; color:#000000">
          Dear ${giver_name},
          <br>
          <br>
          Thank you for giving the gift of reading!
          <br>
          <br>
          ${method == 'email' ?
    `We will email ${receiver_name} a ${plan_name} membership gift on ${delivery_date}.
     <br>
     <br>
     If you would prefer to deliver your gift in person, use the link below to access a printable gift voucher:` :
    `Click Here to view your printable gift voucher (it looks great printed in color!):`}
          <br>
            https://s3.amazonaws.com/botm/gift_certificates/${voucher_code}.pdf
          <br>
          <br>
          Order Receipt<br>${order_id ? `
          <span style="display:inline-block;width:100px;">Order Number:</span> `+ order_id + '<br>': ``}
          <span style="display:inline-block;width:100px;">Description:</span> ${plan_name} membership<br>
          <span style="display:inline-block;width:100px;">Price:</span> $${price}<br>
          <span style="display:inline-block;width:100px;">Tax:</span> $${Math.round(100 * tax) / 100}<br>
          <span style="display:inline-block;width:100px;">Total:</span> $${Math.round(100 * (price + tax)) / 100}<br><br>

          Feel free to contact us with any questions at member.services@bookofthemonth.com. If you'd like to learn more
          about the club or join our mailing list, visit us
          <a href="https://bookofthemonth.com/">here</a><br><br>

          Happy reading,<br><br>
          Book of the Month<br><br>
        </td>
      </tr>
      </table>
      </td>
      </tr>`;
}