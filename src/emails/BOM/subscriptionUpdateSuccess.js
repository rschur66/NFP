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
CONGRATULATIONS

Hi %memberName%,

Your %months%-month membership plan has renewed successfully. Your card ending in %cardLastFour%
was charged $${data.planPrice} plus tax on %todayDate%.

Thank you for choosing Book of the Month. We look forward to continuing to provide you with today's very best books.

Happy Reading,
Book of the Month

ABOUT YOUR MEMBERSHIP

Your current plan is a %months%-month membership to Book of the Month.
Your membership will renew automatically and your credit card will be charged
for $${data.planPrice} plus tax on ${data.renewalDate}. To review our complete Membership Terms please click <a
href="www.bookofthemonth.com/membership-terms.html">here</a>.
If you would like to cancel your membership at any time, please call us at 1-888-784-2670.
`;
}

//@TODO strip this into it's only part and rest are partials
export function html(data) {
  return `
  <tr>
    <td>
      <table cellpadding="0" cellspacing="14" align="center" width="100%" style="background-color:#ffffff; border: 1px solid #deddd5;" >
        <tr>
          <td align="center">
            <table cellpadding="8px" cellspacing="0" width="100%" align="center" style="max-width: 425px;">
              <tr>
                <td align="center" style="font-size:39px; font-weight: lighter; font-family: 'Baskerville', 'Times New Roman', 'Times', serif; line-height:110%; color:#182747; text-align: center;" >
                  <span style="display: inline-block; border-bottom: 2px solid #2cc4ee; color:#182747;">Congratulations!</span>
                </td>
              </tr>
              <tr>
                <td align="center" style="font-size:14px; font-family: Arial, Helvetica, sans-serif, 'Roboto'; line-height:150%; color:#262c2d ; text-align: center; font-weight:300;" >
                  Thank you for selecting a renewal plan. Your membership has been updated to a %renewMonths%-month plan. When your current plan expires, your %renewMonths%-month membership will renew automatically.
                  <br /><br />
                  Thank you for choosing Book of the Month. We look forward to continuing to provide you with today's very best books.
                  <br /><br />
                  Happy reading,<br />
                  Book of the Month
                </td>
              </tr>
              <tr>
                <td align="center" style="text-align: center;"><img src="https://s3.amazonaws.com/bookspan-media/email/botm/logo-icon.gif" alt="Book of the Month" width="55" height="55" /></td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <!-- about your membership here-->
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
                <td valign="top" align="center" style="vertical-align:top; font-family: Arial, Helvetica, sans-serif, 'Roboto'; font-size: 18px; color:#2cc4ee; text-transform: uppercase;">
                  %renewMonths%-MONTH MEMBERSHIP
                </td>
              </tr>
               <tr>
                  <td style="vertical-align:top; font-family: Arial, Helvetica, sans-serif, 'Roboto'; color:#595962; font-size: 14px; line-height: 150%; font-weight: 400; ">
                    You have selected a %renewMonths%-month renewal plan to Book of the Month. Your membership will renew automatically and your credit card will be charge for $%renewPrice% on %renewDate%. For a complete list of the terms of your membership please <a href="https://www.bookofthemonth.com/membership-terms.html" style="color:#2cc4ee; text-decoration: none; ">click here</a>. If you would like to cancel your membership at any time, please call <span class="appleLinksGray">1-888-784-2670</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
      </table>
    </td>
  </tr>

<!-- contact links here-->
  <tr>
    <td>
      <table cellpadding="20" cellspacing="0" border="0" width="100%" style="background-color:#ffffff; border: 1px solid #deddd5;">
        <tr>
          <td>
            <table cellspacing="0" cellpadding="5" width="100%">
              <tr>
                <td colspan="3"  align="center" style="font-family: Arial, Helvetica, sans-serif, 'Roboto'; font-size:16px; line-height:130%; font-weight:400; color:#182747;">
                  <span style="display: inline-block; padding-bottom: 3px; border-bottom: 2px solid #2cc4ee;">WE'RE HERE TO HELP</span>
                </td>
              </tr>
              <tr width="100%">
                <td align="center" valign="bottom" width="33.3%" style="text-align: center; width: 33.3%">
                  <img src="https://s3.amazonaws.com/bookspan-media/email/botm/icon-email.gif" width="26" height="16">
                </td>
                <td align="center" valign="bottom" width="33.3%" style="text-align: center; width: 33.3%">
                  <img src="https://s3.amazonaws.com/bookspan-media/email/botm/icon-chat.gif" width="30" height="26">
                </td>
                <td align="center" valign="bottom" width="33.3%" style="text-align: center; width: 33.3%">
                  <img src="https://s3.amazonaws.com/bookspan-media/email/botm/icon-phone.gif" width="16" height="27">
                </td>
              </tr>
            </table>
            <table cellspacing="10" cellpadding="10" width="100%">
              <tr width="100%">
                <td width="33.3%" style="text-align: center; font-family: Arial, Helvetica, sans-serif, 'Roboto'; font-size:12px; line-height:15px; font-weight:400; width: 33.3%; background-color:#2cc4ee; color:#ffffff; ">
                  <a href="https://www.bookofthemonth.com/contact-us.html" style="text-decoration: none; font-family: Arial, Helvetica, sans-serif, 'Roboto'; font-size:12px; line-height:15px; font-weight:400; color:#ffffff;">EMAIL</a>
                </td>
                <td width="33.3%" style="text-align: center; font-family: Arial, Helvetica, sans-serif, 'Roboto'; font-size:12px; line-height:15px; font-weight:400; width: 33.3%; background-color:#2cc4ee; color:#ffffff; ">
                  <a href="https://www.bookofthemonth.com" style="text-decoration: none; font-family: Arial, Helvetica, sans-serif, 'Roboto'; font-size:12px; line-height:15px; font-weight:400; color:#ffffff;">LIVE CHAT</a>
                </td>
                <td width="33.3%" style="text-align: center; font-family: Arial, Helvetica, sans-serif, 'Roboto'; font-size:12px; line-height:15px; font-weight:400; width: 33.3%; background-color:#2cc4ee; color:#ffffff; ">
                  <span class="appleLinksWhite" style="text-decoration: none; font-family: Arial, Helvetica, sans-serif, 'Roboto'; font-size:12px; line-height:15px; font-weight:400; color:#ffffff;">1-888-784-2670</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>

<!-- Facebook here-->
  <tr>
    <td>
      <table cellpadding="20" cellspacing="0" border="0" width="100%" style="background-color:#ffffff; border: 1px solid #deddd5;">
        <tr>
          <td align="center">
            <table cellpadding="10" cellspacing="0">
              <tr>
                <td align="center">
                  <img src="https://s3.amazonaws.com/bookspan-media/email/shared/icon-facebook.gif" width="41" height="36">
                </td>
              </tr>
              <tr>
                <td colspan="3" style="font-size:15px; font-family: Arial, Helvetica, sans-serif, 'Roboto'; line-height:120%; font-weight:400; color:#182747; text-align: center">
                  ON FACEBOOK? SO ARE WE!
                </td>
              </tr>
              <tr>
                <td style="font-size:14px; font-family: Arial, Helvetica, sans-serif, 'Roboto'; line-height:150%; text-align: center; font-weight: 300; ">
                    Like us on Facebook for the latest Book of the Month news and updates!
                </td>
              </tr>
              <tr>
                <td align="center">
                  <table cellspacing="0" cellpadding="4" style="background-color: #2cc4ee; ">
                    <tr>
                      <td>
                        <a href="https://www.facebook.com/BookoftheMonth" style="display:inline-block; padding: 4px 12px; background-color: #2cc4ee; color:#ffffff; font-size:12px; font-family: Arial, Helvetica, sans-serif, 'Roboto'; line-height:150%; text-decoration: none; ">LIKE US ON FACEBOOK</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>`;
}
