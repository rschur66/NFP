export function validate(data) {
  if(!data.gift.giver_name) throw new Error('giftPurchaseConfirmation needs data.gift.giver_name');
  if(!data.gift.months) throw new Error('giftPurchaseConfirmation needs data.gift.months');
  if(!data.gift.link) throw new Error('giftPurchaseConfirmation needs data.gift.link');
  if(!data.gift.order_id) throw new Error('giftPurchaseConfirmation needs data.gift.order_id');
  if(!data.gift.price) throw new Error('giftPurchaseConfirmation needs data.gift.price');
  if(!data.gift.tax) throw new Error('giftPurchaseConfirmation needs data.gift.tax');
  if(!data.gift.total) throw new Error('giftPurchaseConfirmation needs data.gift.total');
}

export function formatData(data) {
  return;
}

export function subject(data) {
  return `Gift Purchase Confirmation`;
}

export function text(data) {
  return `Dear ${data.gift.giver_name},

Thank you for giving the gift of reading! A receipt for your gift membership purchase can be found below.

Here is your printable gift certificate: ${data.gift.link}

Order Receipt
Gift Code: ${data.gift.order_id}
Description: ${data.gift.months}-month membership
Price: $${data.gift.price}
Tax: $${data.gift.tax}
Total: $${data.gift.total}

Feel free to contact us with any questions at member.services@bookofthemonth.com.

Happy reading,
Book of the Month

Like us on Facebook at https://www.facebook.com/BookoftheMonth`;
}

export function html(data) {
  return `<tr>
  <td>
    <table cellpadding="40" cellspacing="0" align="center" width="100%" style="background-color:#ffffff; border: 1px solid #deddd5;" >
      <tr>
        <td style="font-family: Arial, Helvetica, sans-serif; font-size:13px; line-height:150%; color:#000000">
          Dear ${data.gift.giver_name},<br><br>

          Thank you for giving the gift of reading!<br><br>

          Here is your printable gift voucher (it looks great printed in color!): ${data.gift.link}<br><br>

          Order Receipt<br>
          <span style="display:inline-block;width:100px;">Order Number:</span> ${data.gift.order_id}<br>
          <span style="display:inline-block;width:100px;">Description:</span> ${data.gift.months}-month membership<br>
          <span style="display:inline-block;width:100px;">Price:</span> $${data.gift.price}<br>
          <span style="display:inline-block;width:100px;">Tax:</span> $${data.gift.tax}<br>
          <span style="display:inline-block;width:100px;">Total:</span> $${data.gift.total}<br><br>

          Feel free to contact us with any questions at member.services@bookofthemonth.com. If you'd like to learn more about the club or join our mailing list, visit us
          <a href="https://bookofthemonth.com/join-landing.html">here</a><br><br>

          Happy reading,
          <br><br>
          Book of the Month
          <br><br>
        </td>
      </tr>
    </table>
  </td>
</tr>`;
}
