import {send} from '../utils/ses';

export async function sendPasswordReset(first_name, email, reset_token) {
  await send(email, subject(), html(first_name, reset_token), text(first_name, reset_token));
}

function subject() {
  return `Reset your Book of the Month password`.toString();
}

function text(first_name, reset_token) {
  return `
  Forgot your password, ${first_name}?
	We recently received a request to change the password for your Book of the Month account.
	To reset your password, click on the link below (or copy and paste the URL into your browser):
	https://www.bookofthemonth.com/reset-password?token=${reset_token}
	If you did not make this request, you can safely ignore this message and your password will remain the same.
`.toString();
}

function html(first_name, reset_token) {
  return `
<tr>
  <td>
    <table cellpadding="40" cellspacing="0" align="center" width="100%" style="background-color:#ffffff; border: 1px solid #deddd5;" >
      <tr>
        <td style="font-family: Arial, Helvetica, sans-serif; font-size:13px; line-height:150%; color:#000000">
            Forgot your password, ${first_name}?
          <br>
          <br>
            We recently received a request to change the password for your Book of the Month account.
          <br>
          <br>
            To reset your password, click on the link below (or copy and paste the URL into your browser):
          <br>
            https://www.bookofthemonth.com/reset-password?token=${reset_token}
          <br>
          <br>
            If you did not make this request, you can safely ignore this message and your password will remain the same.
          <br>
          <br>
        </td>
      </tr>
    </table>
  </td>
</tr>
`.toString();
}
