export function validate(data) {
  if(!data.member.display_name) throw new Error('skipMonthConfirmation needs data.member.display_name');
  if(!data.new_expiration_date) throw new Error('skipMonthConfirmation needs data.new_expiration_date');
  if(!data.previous_expiration_date) throw new Error('skipMonthConfirmation needs data.previous_expiration_date');
  if(!data.month) throw new Error('skipMonthConfirmation needs data.month');
}

export function formatData(data) {
  //@TODO grab data fn from utils
  let d;
  if(data.new_expiration_date instanceof Date) {
    d = data.new_expiration_date;
    data.new_expiration_date_formatted = (d.getMonth() + 1) + '/' + d.getDate() + '/' +  d.getFullYear();
  } else {
    data.new_expiration_date_formatted = data.new_expiration_date;
  }

  if(data.previous_expiration_date instanceof Date) {
    d = data.previous_expiration_date;
    data.previous_expiration_date_formatted = (d.getMonth() + 1) + '/' + d.getDate() + '/' +  d.getFullYear();
  } else {
    data.previous_expiration_date_formatted = data.previous_expiration_date;
  }
  return;
}

export function subject(data) {
  return `You skipped your ${data.month} box`;
}

export function text(data) {
  return `
Dear ${data.member.display_name},

We are writing to confirm that you have skipped your ${data.month} Book of the Month box.
Your membership expiration date has been extended one month from ${data.previous_expiration_date_formatted}
to ${data.new_expiration_date_formatted}. We look forward to reading with you next month!

If this was a mistake or if you have any questions, please contact Member Services by
emailing member.services@bookofthemonth.com or calling us at 1-888-784-2670.

Happy reading,
Book of the Month
`;
}

export function html(data) {
  return `
<tr>
  <td>
    <table cellpadding='40' cellspacing='0' width='100%' align='center' style="background-color:#ffffff; border: 1px solid #deddd5;">
      <tr>
        <td style="font-family: Arial, Helvetica, sans-serif; font-size:13px; line-height:150%; color:#000000">
          Dear ${data.member.display_name},
          <br><br>
          We are writing to confirm that you have skipped your ${data.month} Book of the Month box.
          Your membership expiration date has been extended one month from ${data.previous_expiration_date_formatted}
          to ${data.new_expiration_date_formatted}. We look forward to reading with you next month!
          <br><br>
          If this was a mistake or if you have any questions, please contact Member Services by
          emailing member.services@bookofthemonth.com or calling us at 1-888-784-2670.
          <br><br>

          Happy reading,
          <br>
          Book of the Month
        </td>
      </tr>
    </table>
  </td>
</tr>`;
}
