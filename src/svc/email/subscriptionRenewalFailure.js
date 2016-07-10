import { send } from '../utils/ses';
import dateFormat from 'dateformat';

export async function sendRenewalFailureEmail(email, firstName, month) {
  try {
    let monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
      'August', 'September', 'October', 'November', 'December'][month+1];
    await send(
      email,
      subject(firstName),
      html(firstName, monthName),
      text(firstName, monthName)
    );
  } catch (error) {
    console.log('Error sending renewal failure email to ' + email + ': ', error);
  }
}

function subject(firstName) {
  return `${firstName}, we were not able to process your renewal.`;
}

function text(firstName, monthName){
  return `Hi ${firstName},

When we attempted to renew your membership, your credit card failed, but there is still time to get your ${monthName} book.

Please login at https://www.bookofthemonth.com/login and update your payment information to complete your renewal.

Thank you for choosing Book of the Month. We look forward to continuing to provide you with today's very best books.

Happy Reading,
Book of the Month`;
}

function html(firstName, monthName) {
  return `
  <tr>
    <td>
      <table cellpadding="20" cellspacing="0" align="center" width="100%" style="background-color:#ffffff; border: 1px solid #deddd5;" >
        <tr>
          <td align="center" style="font-family: Arial, Helvetica, sans-serif, 'Roboto'; font-size:16px; font-weight:400; color:#182747; ">
            <span style="display: inline-block; padding-bottom: 3px; border-bottom: 2px solid #2cc4ee; ">Don't Miss Out On Your ${monthName} Box!</span>
          </td>
        </tr>
        <tr>
          <td style="vertical-align:top; font-family: Arial, Helvetica, sans-serif, 'Roboto'; color:#595962; font-size: 14px; line-height: 150%; font-weight: 400;">
            Hi ${firstName},
            <br><br>
            When we attempted to renew your membership, your credit card failed, but there is still time to get your ${monthName} book.
          </td>
        </tr>
        <tr>
          <td align="center" style="vertical-align:top; font-family: Arial, Helvetica, sans-serif, 'Roboto'; color:#595962; padding: 0; font-size: 14px; line-height: 100%; font-weight: 400;">
            <a href="https://www.bookofthemonth.com/login"
            style="display: inline-block; color: #ffffff; background-color: #11afe2; text-decoration: none; text-align: center; vertical-align: middle; width: 150px; height: 40px; line-height: 40px; border-radius: 25px;">Update Account</a>
          </td>
        </tr>
        <tr>
          <td style="vertical-align:top; font-family: Arial, Helvetica, sans-serif, 'Roboto'; color:#595962; font-size: 14px; line-height: 150%; font-weight: 400;">
            Please login and update your payment information to complete your renewal.
            <br><br>
            Thank you for choosing Book of the Month. We look forward to continuing to provide you with today's very best books.
            <br><br>
            Happy Reading,
            <br><br>
            Book of the Month
            <br><br>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  `;
}
