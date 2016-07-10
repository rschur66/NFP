import {send} from '../utils/ses';

export async function sendReferFriend(referrer_name, referral_code, referralMessage, email) {
  let referral_message = `${referrer_name} has invited you to Book of the Month!`;
  if (referralMessage) referral_message = referralMessage;
  await send(email, subject(referrer_name), html(referral_code, referral_message), text(referral_code, referral_message));
}

export function subject(referrer_name) {
  return `${referrer_name} has invited you to Book of the Month!`;
}

export function text(referral_code, referral_message) {
  let textRaw = `${referral_message}

    Accept the invitation by clicking here:
    <a href="https://www.bookofthemonth.com/?referCode=${referral_code}" style="color: white; background-color: #11afe2; padding: 10px 30px; text-decoration: none">https://www.bookofthemonth.com/?referCode=${referral_code}</a>

    `;
  return textRaw.toString();
}

export function html(referral_code, referral_message) {
  let htmlRaw = `<!-- refer friend email -->
<table cellpadding='0' cellspacing='0' width='90%' align='center'>
  <tr>
    <td width="1" height="20" ><img src="http://images.dbimedia.com/shared/spacer.gif" width="1px" height="20px" alt="" style="display: block;" /></td>
  </tr>
  <tr>
    <td width="1" height="20" ><img src="http://images.dbimedia.com/shared/spacer.gif" width="1px" height="20px" alt="" style="display: block;" /></td>
  </tr>
  <tr>
    <td style="font-family: Arial, Helvetica, sans-serif; font-size:13px; line-height:150%; color:#000000">
      <div style="white-space: pre-wrap;">${referral_message}</div>
      <br><br>
      <a href="https://www.bookofthemonth.com/?referCode=${referral_code}" style="color: white; background-color: #11afe2; padding: 10px 30px; text-decoration: none">Accept Invitation</a>
      <br><br>

      Happy reading,
      <br>
      Book of the Month
      <br><br>
    </td>
  </tr>
</table>`;
  return htmlRaw.toString();
}
