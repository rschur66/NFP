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
Dear ${data.name},

Welcome to Book of the Month. Since 1926, Book of the Month has provided discerning readers like you with the very best books of the moment, delivered directly to your door. Below you will find all of the details to help you get started with your membership. Thank you for choosing Book of the Month.

  1. We have extended the selection period for your first month. View the New Selections to select your book of the month by the 21st. After your first month, the normal selection period will begin on the 1st and you will have until the 6th to select your book of the month.
  2. You may also add up to 2 additional titles by shopping at The Store https://www.bookofthemonth.com/selections.html.
  3. After the selection period, we will deliver your box straight to your door.


${data.aboutMembershipTitle}

${data.aboutMembershipMsg}


Questions? Email us at member.services@bookofthemonth.com.

Happy reading,
Book of the Month
Like us on Facebook https://www.facebook.com/BookoftheMonth

`;
}

//@TODO strip this into it's only part and rest are partials
export function html(data) {
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
                  <span style="display: inline-block; border-bottom: 2px solid #2cc4ee; color:#182747;">Welcome</span>
                </td>
              </tr>
              <tr>
                <td align="center" style="font-size:14px; font-family: Arial, Helvetica, sans-serif, 'Roboto'; line-height:150%; color:#262c2d ; text-align: center; font-weight:300;" >
                  Welcome to Book of the Month. Since 1926, Book of the Month has provided discerning readers like you with the very best books of the moment, delivered directly to your door. Below you will find all of the details to help you get started with your membership. Thank you for choosing Book of the Month.
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
                   We have extended the selection period for your first month. View the <a href="http://botm.bookspanstaging.com" style="white-space: nowrap; text-decoration: none; color:#333333; ">New Selections</a> to select your book of the month by the 21st. After your first month, the normal selection period will begin on the 1st and you will have until the 6th to select your book of the month.
                </td>
              </tr>
              <tr>
                <td>&nbsp;</td>
                <td align="center">
                  <img src="https://s3.amazonaws.com/bookspan-media/email/botm/selections.gif" border="0" style="display: block;" height="auto" width="100%" vspace="20" />
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
                  You may also add up to 2 additional titles by shopping in <a href="http://botm.bookspanstaging.com/selections.html?past=true" style="white-space: nowrap; text-decoration: none; color:#333333; ">The Store</a>.
                </td>
              </tr>
              <tr>
                <td>&nbsp;</td>
                <td align="center">
                  <img src="https://s3.amazonaws.com/bookspan-media/email/botm/my-box.gif" border="0" style="display: block;" height="auto" width="100%" vspace="20" />
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
                   After the selection period, we will deliver your box straight to your door.
                </td>
              </tr>
              <tr>
                <td>&nbsp;</td>
                <td align="center">
                  <img src="https://s3.amazonaws.com/bookspan-media/email/botm/shipped-box.gif" border="0" style="display: block;" height="auto" width="100%" vspace="20" />
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
                <td align="center" style="font-family: Arial, Helvetica, sans-serif, 'Roboto'; font-size:16px; line-height:130%; font-weight:400; color:#182747; ">
                  <span style="display: inline-block; padding-bottom: 3px; border-bottom: 2px solid #2cc4ee; ">${data.aboutMembershipTitle}</span>
                  <br />
                  <img src="http://s3.amazonaws.com/bookspan-media/email/shared/spacer.gif" height="10" style="display: block; height: 10px;" />
                </td>
              </tr>
              <tr>
                <td valign="top" align="center" style="vertical-align:top; font-family: Arial, Helvetica, sans-serif, 'Roboto'; font-size: 18px; color:#2cc4ee; text-transform: uppercase;">
                  ${data.planName} MEMBERSHIP
                </td>
              </tr>
               <tr>
                  <td style="vertical-align:top; font-family: Arial, Helvetica, sans-serif, 'Roboto'; color:#595962; font-size: 14px; line-height: 150%; font-weight: 400; ">
                    <!--You have enrolled in a ${data.planName} membership to Book of the Month. <span style="font-weight: 700">Your membership will renew automatically and your credit card will be charged for $${data.planPrice} on ${data.renewalDate}.</span> For a complete list of the terms of your membership please <a href="https://www.bookofthemonth.com/membership-terms.html" style="color:#2cc4ee; text-decoration:none; ">click here</a>. If you would like to cancel your membership at any time, please call <span class="appleLinksGray">1-888-784-2670</span>-->
                    <!--You have selected a ${data.planName} <span style="font-style:italic">Book of the Month</span> membership with a free 1-month Trial.-->
                    <!--If you do not cancel prior to the end of the Free Trial, <span style="font-weight:700">you will automatically enroll-->
                    <!--in a ${data.planName} membership plan and your credit card will be charged $${data.planPrice} on ${data.renewalDate}-->
                    <!--and every ${data.planName}s thereafter. We will send you an email reminder prior to the expiration of your-->
                    <!--Free Trial</span>. To review our complete Membership Terms please click <a href="https://www.bookofthemonth.com/membership-terms.html">here</a>-->
                    <!--If you would like to cancel your membership at any time, please call us at 1-888-784-2670.-->
                    ${data.aboutMembershipMsg}
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
