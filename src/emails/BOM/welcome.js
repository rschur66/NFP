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

Welcome to Book of the Month. We will announce our next monthly selections on ${data.nextMonth} 1st. In the meantime, visit our discussions at https://www.bookofthemonth.com/discussions.html, learn more about our Judges at https://www.bookofthemonth.com/judges.html, or add additional books to your box by shopping in The Store at https://www.bookofthemonth.com/selections.html

Questions? Email us at support@bookofthemonth.com


Happy reading,
Book of the Month


Like us on Facebook at https://www.facebook.com/BookoftheMonth
`;
}

//@TODO strip this into it's only part and rest are partials
export function html(data) {
  return `
<tr>
  <td>
    <table cellpadding="40" cellspacing="0" align="center" width="100%" style="background-color:#ffffff; border: 1px solid #deddd5;" >
      <tr>
        <td style="font-family: Arial, Helvetica, sans-serif; font-size:13px; line-height:150%; color:#000000">
          Dear ${data.name},
          <br><br>
          Welcome to Book of the Month. We will announce our next monthly selections on ${data.nextMonth} 1st. In the meantime, visit our <a href="https://www.bookofthemonth.com/discussions.html"  style="color:#11afe2; text-decoration: none;">discussions</a>, learn more about our <a href="https://www.bookofthemonth.com/judges.html" style="color:#11afe2; text-decoration: none;">Judges</a>, or add additional books to your box by shopping in <a href="https://www.bookofthemonth.com/selections.html" style="color:#11afe2; text-decoration: none;">The Store</a>.
          <br><br>
          Questions? Email us at <a href="mailto:support@bookofthemonth.com" target="_top" style="color:#11afe2; text-decoration: none;">support@bookofthemonth.com</a>
          <br><br>
          Happy reading,
          <br>
          Book of the Month
          <br><br>
        </td>
      </tr>
    </table>
  </td>
</tr>`;
}
