import {send} from '../utils/ses';
import {getGreetingText, formatEnrollmentText, getSignoffText} from './welcome';

const ordinalSuffixes = [,
  'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th', 'th',
  'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th',
  'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th', 'th'];

function whatHappensNext(mailing_date) {
  if (mailing_date === 7)
    return {
      text: `Visit My BOTM to select your Book of the Month by the 6th.`,
      html: `Visit <a href="https://www.bookofthemonth.com/my-botm">My BOTM</a> to select your Book of the Month by the 6th.`
    };
  let mailingDate = (mailing_date - 1) + ordinalSuffixes[(mailing_date - 1)];
  return {
    text: `We have extended the picking period for your first month.  Visit My BOTM to select your Book of the Month by the ${mailingDate}.  After your first month, the normal selection period will begin on the 1st and you will have until the 6th to select your book of the month.`,
    html: `We have extended the picking period for your first month.  Visit <a href="https://www.bookofthemonth.com/my-botm">My BOTM</a> to select your Book of the Month by the ${mailingDate}.  After your first month, the normal selection period will begin on the 1st and you will have until the 6th to select your book of the month.`
  };
}

export async function sendWelcomeOpenCycle(first_name, plan_name, mailing_date, renewal_plan_price, renewal_date, gift, email) {
  let greetingText = getGreetingText();
  let happensNextText = whatHappensNext(mailing_date);
  let enrollmentText = formatEnrollmentText(plan_name, renewal_plan_price, renewal_date, gift);
  let signoffText = getSignoffText();
  await send(email, subject(),
    html(first_name, plan_name, greetingText, happensNextText.html, enrollmentText, signoffText),
    text(first_name, greetingText, happensNextText.text, enrollmentText, signoffText));
}

function subject() {
  return `Welcome to Book of the Month!`;
}

function text(first_name, greetingText, happensNextText, enrollmentText, signoffText) {
  return `
Dear ${first_name},

${greetingText}

What Happens Next:

  1. ${happensNextText}
  2. Add up to 2 additional titles to your box for only $9.99 each by visiting More Books. 
  3. After the selection period closes, we will deliver your box straight to your door.

${enrollmentText}

${signoffText}

Happy reading,
Book of the Month
Like us on Facebook https://www.facebook.com/BookoftheMonth
`;
}

export function html(first_name, plan_name, greetingText, happensNextText, enrollmentText, signoffText) {
  return `
<!-- welcome message -->
  <tr>
    <td>
      <table cellpadding="0" cellspacing="14" align="center" width="100%" style="background-color:#ffffff; border: 1px solid #deddd5;" >
        <tr>
          <td align="center">
            <table cellpadding="8px" cellspacing="0" width="100%" align="center" style="max-width: 425px;">
              <tr>
                <td align="center" style="font-size:39px; font-weight: lighter; font-family: 'Baskerville', 'Times New Roman', 'Times', serif; line-height:110%; color:#182747; text-align: center;" >
                  <span style="display: inline-block; border-bottom: 2px solid #2cc4ee; color:#182747;">Welcome ${first_name}</span>
                </td>
              </tr>
              <tr>
                <td align="center" style="font-size:14px; font-family: Arial, Helvetica, sans-serif, 'Roboto'; line-height:150%; color:#262c2d ; text-align: center; font-weight:300;" >
                  ${greetingText}
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
<!-- feature selections -->
  <tr>
    <td>
      <table cellpadding="25" cellspacing="0" align="center" width="100%" style="border:0px; background-color:#ffffff; border: 1px solid #deddd5;" >
        <tr>
          <td>
            <table cellpadding="2" cellspacing="0" width="100%">
              <tr>
                <td colspan="2" style="font-size:16px; font-family: Arial, Helvetica, sans-serif, 'Roboto'; line-height:130%; text-align: center; font-weight: 400; color:#182747; ">
                   <span style="display: inline-block; padding-bottom: 3px; margin-bottom: 15px; border-bottom: 2px solid #2cc4ee; color:#182747; ">WHAT HAPPENS NEXT</span>
                </td>
              </tr>
            <!-- new selections-->
              <tr>
                <td valign="top" style="color:#2cc4ee; font-size:14px; font-family: Arial, Helvetica, sans-serif, 'Roboto'; line-height:150%; font-weight: 700;">
                  1.&nbsp;
                </td>
                <td style="font-size:14px; font-family: Arial, Helvetica, sans-serif, 'Roboto'; line-height:150%; text-align: left; font-weight: 300; max-width: 494px; color: #333333;" >
                   ${happensNextText}
                </td>
              </tr>
              <tr>
                <td>&nbsp;</td>
                <td align="center">
                  <hr style="height: 1px; background-color:#e7ecef; color:#deddd5; border: 0 none; margin-bottom: 30px;" />
                </td>
              </tr>

              <!-- my box-->
              <tr>
                <td valign="top" style="color:#2cc4ee; font-size:14px; font-family: Arial, Helvetica, sans-serif, 'Roboto'; line-height:150%; font-weight: 700;">
                  2.&nbsp;
                </td>
                <td style="font-size:14px; font-family: Arial, Helvetica, sans-serif, 'Roboto'; line-height:150%; text-align: left; font-weight: 300; max-width: 494px; color: #333333;" >
                  Add up to 2 additional titles to your box for only $9.99 each by visiting <a href="https://www.bookofthemonth.com/more-books"><span style="white-space: nowrap;">More Books</span></a>.
                </td>
              </tr>
              <tr>
                <td>&nbsp;</td>
                <td align="center">
                  <hr style="height: 1px; background-color:#e7ecef; color:#deddd5; border: 0 none; margin-bottom: 30px;" />
                </td>
              </tr>
              <!-- shipped box-->
              <tr>
                <td valign="top" style="color:#2cc4ee; font-size:14px; font-family: Arial, Helvetica, sans-serif, 'Roboto'; line-height:150%; font-weight: 700;">
                  3.&nbsp;
                </td>
                <td style="font-size:14px; font-family: Arial, Helvetica, sans-serif, 'Roboto'; line-height:150%; text-align: left; font-weight: 300; max-width: 494px; color: #333333;" >
                   After the selection period closes, we will deliver your box straight to your door.
                </td>
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
                <td valign="top" align="center" style="vertical-align:top; font-family: Arial, Helvetica, sans-serif, 'Roboto'; font-size: 18px; color:#2cc4ee; text-transform: uppercase;">
                  ${plan_name} MEMBERSHIP
                </td>
              </tr>
               <tr>
                  <td style="vertical-align:top; font-family: Arial, Helvetica, sans-serif, 'Roboto'; color:#595962; font-size: 14px; line-height: 150%; font-weight: 400; ">
                    ${enrollmentText}
                  </td>
                </tr>
                <tr>
                   <td style="vertical-align:top; font-family: Arial, Helvetica, sans-serif, 'Roboto'; color:#595962; font-size: 14px; line-height: 150%; font-weight: 400; ">
                     ${signoffText}
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
                  <img src="https://s3.amazonaws.com/bookspan-media/email/shared/icon-facebook.gif" width="41" height="36" alt="Facebook">
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
