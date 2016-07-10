export function validate(data) {
  if (!data.contactInfo) { //@TODO check that this is actually required!
    throw new Error('Contact us form needs contactInfo field.');
  }
}

export function formatData(data) {
  return;
}

export function subject(data) {
  return `Book of the Month: Contact Us feedback ${data.topic}`;
}

export function text(data) {
  return `Hi Bookspaner!

${data.memberName} submitted a comment with the topic '${data.topic}':

${data.comment}

${data.firstName} can be reached at ${data.contactInfo}.

I know you'll do a great job handling it!

Your pal,
The Book of the Month Contact Page`;
}

export function html(data) {
  return `<tr>
  <td>
    <table cellpadding="40" cellspacing="0" align="center" width="100%" style="background-color:#ffffff; border: 1px solid #deddd5;" >
      <tr>
        <td style="font-family: Arial, Helvetica, sans-serif; font-size:13px; line-height:150%; color:#000000">
          Hi Bookspaner!
          <br>
          <br>
          ${data.memberName}  submitted a comment with the topic ${data.topic}
          <br>
          <br>
              ${data.comment}
          <br>
          <br>
            ${data.firstName} can be reached at ${data.contactInfo}.
          <br>
          <br>
         I know you'll do a great job handling it!
          <br>
          <br>
         Your pal,
         <br>
         The Book of the Month Contact Page
         <br><br>
        </td>
      </tr>
    </table>
  </td>
</tr>`;
}
