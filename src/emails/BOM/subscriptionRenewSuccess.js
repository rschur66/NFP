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
Hi %memberName%,

Congratulations! Your %months%-month membership plan has been successfully renewed. Visit the site at https://www.bookofthemonth.com/ by the 6th to choose your ${data.current.month} book.

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
          <span style="display: inline-block; padding-bottom: 3px; border-bottom: 2px solid #2cc4ee; ">CONGRATULATIONS!</span>
        </td>
      </tr>
      <tr>
        <td style="vertical-align:top; font-family: Arial, Helvetica, sans-serif, 'Roboto'; color:#595962; font-size: 14px; line-height: 150%; font-weight: 400;">
          Hi %memberName%,
          <br><br>
          Your %months%-month membership plan has renewed successfully. Your card ending in %cardLastFour%
          was charged $${data.planPrice} plus tax on %todayDate%.
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
<!-- About membership -->
<tr>
  <td>
    <table cellpadding="20" cellspacing="0" border="0" width="100%" style="background-color:#ffffff; border: 1px solid #deddd5;">
      <tr>
        <td>
          <table cellspacing="0" cellpadding="5" width="100%">
            <tr>
              <td align="center" style="font-family: Arial, Helvetica, sans-serif, 'Roboto'; font-size:16px; line-height:130%; font-weight:400; color:#182747; ">
                <span style="display: inline-block; padding-bottom: 3px; border-bottom: 2px solid #2cc4ee; ">ABOUT YOUR MEMBERSHIP</span>
                <br />
                <img src="http://s3.amazonaws.com/bookspan-media/email/shared/spacer.gif" height="10" style="display: block; height: 10px;" />
              </td>
            </tr>
            <tr>
              <td style="vertical-align:top; font-family: Arial, Helvetica, sans-serif, 'Roboto'; color:#595962; font-size: 14px; line-height: 150%; font-weight: 400; ">
                Your current plan is a %months%-month membership to Book of the Month.
                Your membership will renew automatically and your credit card will be charged
                for $${data.planPrice} plus tax on ${data.renewalDate}. To review our complete Membership Terms please click <a
                href="www.bookofthemonth.com/membership-terms.html">here</a>.
                If you would like to cancel your membership at any time, please call us at 1-888-784-2670.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </td>
</tr>`;
}
