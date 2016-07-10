export function validate(data) {
  if(!data.gift.giver_name) throw new Error('giftPurchaseConfirmation needs data.gift.giver_name');
  if(!data.gift.receiver_name) throw new Error('giftPurchaseConfirmation needs data.gift.receiver_name');
  if(!data.gift.months) throw new Error('giftPurchaseConfirmation needs data.gift.months');
}

export function formatData(data) {
  return;
}

export function subject(data) {
  return `Your gift has been redeemed`;
}

export function text(data) {
  return `Dear ${data.gift.giver_name},

We wanted to let you know that ${data.gift.receiver_name} has redeemed the ${data.gift.months}-month gift membership you purchased.
Thank you again for giving the gift of reading!

Happy reading,
Book of the Month`;
}

export function html(data) {
  return `<table cellpadding='0' cellspacing='0' width='90%' align='center'>
  <tr>
    <td width="1" height="20" ><img src="http://images.dbimedia.com/shared/spacer.gif" width="1px" height="20px" alt="" style="display: block;" /></td>
  <tr>
  <tr>
    <td style="font-family: Arial, Helvetica, sans-serif; font-size:13px; line-height:150%; color:#000000">
      Dear ${data.gift.giver_name},
      <br>
      <br>
      We wanted to let you know that ${data.gift.receiver_name} has redeemed the ${data.gift.months}-month gift membership you purchased.
      Thank you again for giving the gift of reading!
      <br>
      <br>

      Happy reading,<br><br>
      Book of the Month<br><br>
    </td>
  </tr>
</table>`;
}
