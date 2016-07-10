import {send} from '../utils/ses';

export async function sendReferConfirmation(referrer_name, referee_name, email) {
  await send(email, subject(), html(referee_name, referrer_name), text(referee_name, referrer_name));
}

function subject() {
  return `1 Book Credit Has Been Added to Your Account`;
}

function text(referee_name, referrer_name) {
  return `
Congratulations, ${referrer_name}!

${referee_name} accepted your invitation and joined Book of the Month!
A credit for one free extra book has been added to your account.
To redeem this credit, add any title from “The Store” section of the
website to you box and your will receive it for free when that box ships.

Thank you for sharing Book of the Month!

Happy reading,
Book of the Month
`;
}

function html(referee_name, referrer_name) {
  return `
<table cellpadding='0' cellspacing='0' width='90%' align='center'>
  <tr>
    <td width="1" height="20" ><img src="http://images.dbimedia.com/shared/spacer.gif" width="1px" height="20px" alt="" style="display: block;" /></td>
  </tr>
  <tr>
    <td width="1" height="20" ><img src="http://images.dbimedia.com/shared/spacer.gif" width="1px" height="20px" alt="" style="display: block;" /></td>
  </tr>
  <tr>
    <td style="font-family: Arial, Helvetica, sans-serif; font-size:13px; line-height:150%; color:#000000">
      Congratulations, ${referrer_name}!
      <br><br>
      ${referee_name} accepted your invitation and joined Book of the Month!
      A credit for one free extra book has been added to your account.
      To redeem this credit, add any title from “The Store” section of the
      website to you box and your will receive it for free when that box ships.
      <br><br>
      Thank you for sharing Book of the Month!
      <br><br>

      Happy reading,
      <br>
      Book of the Month
      <br><br>
    </td>
  </tr>
</table>`;
}
