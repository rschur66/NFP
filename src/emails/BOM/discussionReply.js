export function validate(data) {
  //add any template data validations here
  if(!data.replier) throw new Error('discussionReply needs replier name');
  if(!data.topic) throw new Error('discussionReply needs topic');
}

export function formatData(data) {
  return;
}

export function subject(data) {
  return `${data.replier} has replied to your comment`;
}

export function text(data) {
  return `
${data.replier} has replied to your comment on '${data.topic}'

To see the comment thread, visit the <a href='https://www.bookofthemonth.com/discussions.html'>Discussions page</a>.

Happy reading,
Book of the Month`;
}

export function html(data) {
  return `<tr>
  <td>
    <table cellpadding="40" cellspacing="0" align="center" width="100%" style="background-color:#ffffff; border: 1px solid #deddd5;" >
      <tr>
        <td style="font-family: Arial, Helvetica, sans-serif; font-size:13px; line-height:150%; color:#000000">
          ${data.replier} has replied to your comment on '${data.topic}'
          <br>
          <br>
             To see the comment thread, visit the <a href='https://www.bookofthemonth.com/discussions.html'>Discussions page</a>.
          <br>
          <br>
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
