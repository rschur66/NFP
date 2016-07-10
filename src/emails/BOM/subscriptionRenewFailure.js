export function validate(data) {
  return; //@TODO add any template data validations here
}

export function formatData(data) {
  return;
}

export function subject(data) {
  return `Book of the Month: Contact Us feedback ${data.topic}`;
}

export function text(data) {
  return `
Your credit card ending in %last4D% failed when we attempted to renew your %months%-month membership plan.
In order to not miss out on your ${data.current.month} book, please visit the
https://www.bookofthemonth.com/#account/plans
page and update your payment information by ${data.current.month} 6th.

Thank you for choosing Book of the Month. We look forward to continuing to provide you with today's very best books.

Happy Reading,
Book of the Month

`;
}

export function html(data) {
  return `
<tr>
  <td>
    <table cellpadding="20" cellspacing="0" align="center" width="100%" style="background-color:#ffffff; border: 1px solid #deddd5;" >
      <tr>
        <td align="center" style="font-family: Arial, Helvetica, sans-serif, 'Roboto'; font-size:16px; font-weight:400; color:#182747; ">
          <span style="display: inline-block; padding-bottom: 3px; border-bottom: 2px solid #2cc4ee; ">Don't Miss Out On Your ${data.current.month} Box!</span>
        </td>
      </tr>
      <tr>
        <td style="vertical-align:top; font-family: Arial, Helvetica, sans-serif, 'Roboto'; color:#595962; font-size: 14px; line-height: 150%; font-weight: 400;">
          Your credit card ending in %last4D% failed when we attempted to renew your %months%-month membership plan.
          In order to not miss out on your ${data.current.month} book, please visit the
          <a href="https://www.bookofthemonth.com/#account/plans" style="color:#11afe2; text-decoration: none;">Account Settings</a>
          page and update your payment information by ${data.current.month} 6th.
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
</tr>`;
}
