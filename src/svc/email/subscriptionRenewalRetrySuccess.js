import {send} from '../utils/ses';
import dateFormat from 'dateformat';

export async function sendRenewalRetrySuccessEmail(email, firstName, planName, planPrice, cardLastFour, month, pickLastDay) {
  try {
    let todayDate = dateFormat(new Date(), 'mm/dd/yy');
    let pickLastOrdinal = dateFormat(new Date().setDate(pickLastDay), 'dS');
    let monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
      'August', 'September', 'October', 'November', 'December'][month+1];
    await send(
      email,
      subject(),
      html(firstName, planName, cardLastFour, planPrice, todayDate, monthName, pickLastOrdinal),
      text(firstName, planName, cardLastFour, planPrice, todayDate, monthName, pickLastOrdinal)
    );
  } catch (error) {
    console.log('Error sending renewal retry success email to ' + email + ': ', error);
  }
}

function subject() {
  return `Your membership has renewed`;
}

function text(firstName, planName, cardLastFour, planPrice, todayDate, monthName, pickLastOrdinal) {
  return `Hi ${firstName},

Congratulations! Your Book of the Month membership has been renewed into a ${planName} membership. Your credit card ending in ${cardLastFour} was charged $${planPrice} plus tax on ${todayDate}.

The ${monthName} picking period has been extended just for you! Visit the site at https://www.bookofthemonth.com/ by the ${pickLastOrdinal} to choose your ${monthName} book.

Happy Reading,
Book of the Month`;
}

function html(firstName, planName, cardLastFour, planPrice, todayDate, monthName, pickLastOrdinal) {
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
            The ${monthName} picking period has been extended just for you! Visit the site at https://www.bookofthemonth.com/ by the ${pickLastOrdinal} to choose your ${monthName} book.
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
