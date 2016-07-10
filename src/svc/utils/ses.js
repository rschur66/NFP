import {SES} from 'aws-sdk';
import {awsConfig} from '../../common/config.js';

const sesConfig = awsConfig.ses;
const emailOn = sesConfig.enable;
const recipient = sesConfig.overrideWithRecipient;

const ses = new SES(sesConfig);

export async function send(email, subject, html, text) {
  let params = {
    Destination: {
      ToAddresses: [email]
    },
    Message: {
      Body: {
        Html: {Data: buildHTML(html)},
        Text: {Data: text}
      },
      Subject: {Data: subject}
    },
    Source: 'Book of the Month <books@bookofthemonth.com>'
  };
  return new Promise((resolve, reject) => {
    if (!emailOn) {
      console.log('Intentionally aborted e-mail send.');
      resolve(true);
    } else {
      if (recipient) {
        console.log('Redirecting to dummy recipient: ', recipient);
        params['Destination']['ToAddresses'] = [recipient];
      }
      ses.sendEmail(params, (err, data) => {
        if (err) console.error('err', err);
        err ? reject(err) : resolve(data);
      });
    }
  });
}

function buildHTML(body) {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
<title>BOM Welcome Non PC</title>
</head>
<body bgcolor="#f5f4ed">

<style>
  @import url(https://fonts.googleapis.com/css?family=Roboto:300,400,700);
  [style*="Roboto"] {
    font-family: 'Roboto', Arial,Helvetica, sans-serif !important
  }
  /* RESET STYLES */
  body{margin:0; padding:0; height:100% }
  img{border:0; height:auto; line-height:100%; outline:none; text-decoration:none;}
  img{-ms-interpolation-mode:bicubic;} /* Allow smoother rendering of resized image in Internet Explorer */
  .appleLinksWhite a {color: #ffffff !important; text-decoration: none;}
  .appleLinksGray a {color: #333333 !important; text-decoration: none;}

</style>

<!-- Header here-->
<table cellpadding="0" cellspacing="10" border="0" width="100%" style="background-color:#182747;">
  <tr>
    <td></td><!-- for responsive -->
    <td width="310" align="center" valign="middle">
      <table cellpadding="5" cellspacing="0" border="0" style="background-color:#182747; color: #ffffff">
        <tr>
          <td style="font-size:28px; font-weight: lighter; font-family: 'Baskerville', 'Times New Roman', 'Times', serif; line-height:110%; color:#ffffff; text-align: center;" >
            <a href="https://www.bookofthemonth.com" style="color: #ffffff; text-decoration: none;"><img src="https://s3.amazonaws.com/bookspan-media/email/botm/logo.gif" alt="Book of the Month" height="auto" width="100%" max-width="310px" style="display: block;" /></a>
          </td>
        </tr>
      </table>
    </td>
    <td></td><!-- for responsive -->
  </tr>
</table>

<table width="100%" bgcolor="#f5f4ed" style="font-family: Arial, Helvetica, sans-serif, 'Roboto'">
  <tr>
    <td></td><!-- for responsive -->
    <td width="600">
      <table cellpadding="0" cellspacing="10" border="0" width="100%">
       <!-- begin email content -->
          ${body}
        </table>
    </td>
    <td></td><!--for responsive -->
  </tr>
</table>

<!-- footer links here-->
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#182747;">
    <tr>
      <td height="20">
        <img src="https://s3.amazonaws.com/bookspan-media/email/shared/spacer.gif" height="20" style="display: block;" />
      </td>
    </tr>
    <tr>
      <td align="center">
          <table cellpadding="10" cellspacing="0" border="0" width="100%" style="background-color:#182747; ">
          <tr>
            <td align="center" valign="middle" style="font-family: Arial, Helvetica, sans-serif, 'Roboto'; font-size:11px; line-height:20px; color:#d8dbdb; font-weight: 300;">
              For member services email: <a href="mailto:member.services@bookofthemonth.com" style="color: #ffffff; white-space: nowrap;">member.services@bookofthemonth.com</a>.
              <br/>
              <span class="appleLinksWhite">Book of the Month - 34 W 27th Street, 10th Floor, New York, NY 10001</span>
              <br />
              Book of the Month® is a registered trademark of Bookspan LLC.  All rights reserved.  Unauthorized use prohibited.
              <br />
              ©2016 Bookspan LLC. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td height="20">
        <img src="http://s3.amazonaws.com/bookspan-media/email/shared/spacer.gif" height="20" style="display: block;" />
      </td>
    </tr>
  </table>
</body>
</html>`.toString();
}
