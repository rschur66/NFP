
function subject() {
  return `Gift Purchase Confirmation`;
}

export function text(data) {
  return `Dear ${data.gift.giver_name},

Thank you for giving the gift of reading! A receipt for your gift membership purchase can be found below.

We will email ${data.gift.receiver_name} a ${data.gift.months}-month membership gift on ${data.gift.delivery_date_formatted}.

If you would prefer to deliver your gift in person, use the link below to access a printable gift voucher:
${data.gift.link}

Order Receipt
Gift Code: ${data.gift.order_id}
Description: ${data.gift.months}-month membership
Price: $${data.gift.price}
Tax: $${data.gift.tax}
Total: $${data.gift.total}

Feel free to contact us with any questions at member.services@bookofthemonth.com.

Happy reading,
Book of the Month
Like us on Facebook https://www.facebook.com/BookoftheMonth`;
}

export function html(data) {
  return `<tr>
  <td>
    <table cellpadding="40" cellspacing="0" align="center" width="100%" style="background-color:#ffffff; border: 1px solid #deddd5;" >
      <tr>
        <td style="font-family: Arial, Helvetica, sans-serif; font-size:13px; line-height:150%; color:#000000">
          Dear ${data.gift.giver_name},
          <br>
          <br>
          Thank you for giving the gift of reading!
          <br>
          <br>
          We will email ${data.gift.receiver_name} a ${data.gift.months}-month membership gift on ${data.gift.delivery_date_formatted}.
          <br>
          <br>
          If you would prefer to deliver your gift in person, use the link below to access a printable gift voucher:
          <br>
          ${data.gift.link}
          <br>
          <br>
          Order Receipt<br>
          <span style="display:inline-block;width:100px;">Order Number:</span> ${data.gift.order_id}<br>
          <span style="display:inline-block;width:100px;">Description:</span> ${data.gift.months}-month membership<br>
          <span style="display:inline-block;width:100px;">Price:</span> $${data.gift.price}<br>
          <span style="display:inline-block;width:100px;">Tax:</span> $${data.gift.tax}<br>
          <span style="display:inline-block;width:100px;">Total:</span> $${data.gift.total}<br><br>

          Feel free to contact us with any questions at member.services@bookofthemonth.com. If you'd like to learn more about the club or join our mailing list, visit us
          <a href="https://bookofthemonth.com/join-landing.html">here</a><br><br>

          Happy reading,<br><br>
          Book of the Month<br><br>
        </td>
      </tr>
    </table>
  </td>
</tr>`;
}
