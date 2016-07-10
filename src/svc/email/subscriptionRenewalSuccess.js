import {send} from '../utils/ses';
import dateFormat from 'dateformat';

export async function sendRenewalSuccessEmail(email, firstName, planName, planPrice, cardLastFour, month) {
  try {
    let todayDate = dateFormat(new Date(), 'mm/dd/yy');
    let monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
      'August', 'September', 'October', 'November', 'December'][month+1];
    await send(
      email,
      subject(),
      html(firstName, planName, cardLastFour, planPrice, todayDate, monthName),
      text(firstName, planName, cardLastFour, planPrice, todayDate, monthName)
    );
  } catch (error) {
    console.log('Error sending renewal success email to ' + email + ': ', error);
  }
}

function subject() {
  return `Your membership has renewed`;
}

function text(firstName, planName, cardLastFour, planPrice, todayDate, monthName) {
  return `Hi ${firstName},

Congratulations! Your Book of the Month membership has been renewed into a ${planName} membership. Your credit card ending in ${cardLastFour} was charged $${planPrice} plus tax on ${todayDate}.

Visit the site at https://www.bookofthemonth.com/ between the 1st and the 6th of the month to choose your ${monthName} book.

Happy Reading,
Book of the Month`;
}

function html(firstName, planName, cardLastFour, planPrice, todayDate, monthName) {
  return `
  <tr>
    <td>
      <table cellpadding="20" cellspacing="0" align="center" width="100%" style="background-color:#ffffff; border: 1px solid #deddd5;" >
        <tr>
          <td align="center" style="font-family: Arial, Helvetica, sans-serif, 'Roboto'; font-size:16px; font-weight:400; color:#182747; ">
            <span style="display: inline-block; padding-bottom: 3px; border-bottom: 2px solid #2cc4ee; ">CONGRATULATIONS!</span>
          </td>
        </tr>
        <tr>
          <td style="vertical-align:top; font-family: Arial, Helvetica, sans-serif, 'Roboto'; color:#595962; font-size: 14px; line-height: 150%; font-weight: 400;">
            Hi ${firstName},
            <br><br>
            Congratulations! Your Book of the Month membership has been renewed into a ${planName} membership. Your credit card ending in ${cardLastFour} was charged $${planPrice} plus tax on ${todayDate}.
            <br><br>
            Visit the site at https://www.bookofthemonth.com/ between the 1st and the 6th of the month to choose your ${monthName} book.
            <br><br>
            Happy Reading,
            <br>
            Book of the Month
            <br><br>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  `;
}
