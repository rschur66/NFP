import {send} from '../utils/ses';

export async function sendShipConfirm(firstName, month, subtotal, tax, total, orderNumber, trackingNumber, products, email) {
  let monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][month];
  await send(
    email,
    subject(monthName),
    html(monthName, subtotal, tax, total, orderNumber, trackingNumber, products),
    text(firstName, monthName, products, trackingNumber)
  );
}

export function subject(monthName) {
  return `Your ${monthName} box has shipped!`;
}

export function text(firstName, monthName, products, trackingNumber) {
  let textRaw = `
Dear ${firstName},

Keep your eyes on the mail this week. Your ${monthName} box has shipped and is on its way to you.
This month’s box includes:
	${products.map(p=>p['title']).join('\n\t')}

Your tracking number is: ${trackingNumber}
It may take up to 12-hours for your tracking number to work.

Happy reading,
Book of the Month`;
  return textRaw.toString();
}

export function html(monthName, subtotal, tax, total, orderNumber, trackingNumber, products) {
  return `<tr>
          <td>
            <table cellpadding="20" cellspacing="0" align="center" width="100%" style="border: 1px solid #deddd5; background-color:#ffffff;" >
              <tr>
                <td align="center">
                  <table cellpadding="5px" cellspacing="0" width="100%" align="center" style="max-width: 520px;">
                    <tr>
                      <td align="center" style="text-align: center; font-size: 28px; font-weight: lighter; font-family: 'Baskerville', 'Times New Roman', 'Times', serif; line-height:110%; color:#182747;" >
                        Your ${monthName} box is on its way...
                      </td>
                    <tr>
                      <td align="center" style="text-align: center; font-size: 18px; font-family: Arial, Helvetica, sans-serif, 'Roboto'; line-height:150%; color:#182747; font-weight:100;" >
                        Get ready for your next great read.
                      </td>
                    </tr>
                    <tr>
                      <td align="center" color="#2cc4ee" style="font-size: 14px; font-family: Arial, Helvetica, sans-serif, 'Roboto'; line-height:150%; color:#2cc4ee; text-align: center; font-weight:700;" >
                        USPS TRACKING NUMBER: <a href="https://tools.usps.com/go/TrackConfirmAction?qtc_tLabels1=${trackingNumber}" style="color: #2cc4ee; font-weight:100;"><font color='#2cc4ee' >${trackingNumber}</font></a>
                        <br>
                        <span style="color: #666666; font-size:12px; font-family: Arial, Helvetica, sans-serif, 'Roboto'; line-height:150%; font-weight:300; text-align: center">(May take up to 24 hours for your tracking number to activate)</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
<!-- order details table -->
        <tr>
          <td>
            <table cellpadding="10" cellspacing="0" align="center" width="100%" style="border: 1px solid #deddd5; background-color:#ffffff;" >
              <tr>
                <td style="font-size:14px; font-family: Arial, Helvetica, sans-serif, 'Roboto'; line-height:150%; text-align: center; font-weight: 700;">
                  <table cellpadding="0" cellspacing="10" align="center" width="100%" style="border:0px; font-size:12px; font-family: Arial, Helvetica, sans-serif, 'Roboto'; line-height:150%; text-align: center; font-weight: 300;" >
                    <tr>
                      <td colspan="4" style="font-size:16px; font-family: Arial, Helvetica, sans-serif, 'Roboto'; line-height:150%; color:#182747; text-align: center; font-weight:700;">
                        BOX SUMMARY
                        <br />
                        <span style="color: #2cc4ee; font-size: 12px;">ORDER NUMBER: ${orderNumber}</span>
                      </td>
                    </tr>
                     <tr>
                      <td colspan="4" style="background-color:#e7ecef; font-size:0;">
                        <img src="http://s3.amazonaws.com/bookspan-media/email/shared/spacer.gif" height="1" width="1" style="display: block;" />
                      </td>
                    </tr>
                    <tr>
                      <th colspan="2" valign="bottom" style="font-weight: 700;">ITEM</th>
                      <th valign="bottom" style="font-weight: 700;">QUANTITY</th>
                      <th valign="bottom" style="font-weight: 700;">SUBTOTAL</th>
                    </tr>
                    <tr>
                      <td colspan="4" style="background-color:#e7ecef; font-size:0;">
                        <img src="http://s3.amazonaws.com/bookspan-media/email/shared/spacer.gif" height="1" width="1" style="display: block;" />
                      </td>
                    </tr>
 ${products.map(p=>`<tr>
                      <td><img src="https://s3.amazonaws.com/botm-media/covers/120x180/${p['url']}"></td>
                      <td>${p['title']}</td>
                      <td>1</td>
                      <td>${p['priceLabel']}</td>
                    </tr>`).join('')}
                    <tr>
                      <td colspan="4" align="right">
                        <table cellpadding="0" cellspacing="10" width="100%">
                          <tr>
                            <td align="right">ORDER SUBTOTAL</td>
                            <td align="right">$${subtotal}</td>
                            <td rowspan="3"style="width: 2%;"><img src="http://s3.amazonaws.com/bookspan-media/email/shared/spacer.gif" height="1" width="1" style="display: block;" /></td>
                          </tr>
                          <tr>
                            <td align="right">SHIPPING</td>
                            <td align="right">$0.00</td>
                          </tr>
                          <tr>
                            <td align="right">ESTIMATED SALES TAX</td>
                            <td align="right">$${tax}</td>
                          </tr>
                          <tr>
                            <td colspan="3" style="background-color:#e7ecef; font-size:0;">
                              <img src="http://s3.amazonaws.com/bookspan-media/email/shared/spacer.gif" height="1" width="1" style="display: block;" />
                            </td>
                          </tr>
                          <tr>
                            <td align="right" >ORDER TOTAL</td>
                            <td align="right">$${total}</td>
                            <td style="width: 2%;"><img src="http://s3.amazonaws.com/bookspan-media/email/shared/spacer.gif" height="1" width="1" style="display: block;" /></td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>`.toString();
}
