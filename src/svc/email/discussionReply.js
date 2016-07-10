import {send} from '../utils/ses';

export async function sendDiscussionReply(email, replier, topic, productId) {
  await send(email, subject(replier), html(replier, topic, productId), text(replier, topic, productId));
}

function subject(replier) {
  return `${replier} has replied to your comment`.toString();
}

function text(replier, topic, productId) {
  return `
${replier} has replied to your comment on '${topic}'

To see the comment thread, visit the <a href='https://www.bookofthemonth.com/discussions/product/${productId}'>Discussions page</a>.

Happy reading,
Book of the Month`.toString();
}

function html(replier, topic, productId) {
  return `<tr>
  <td>
    <table cellpadding="40" cellspacing="0" align="center" width="100%" style="background-color:#ffffff; border: 1px solid #deddd5;" >
      <tr>
        <td style="font-family: Arial, Helvetica, sans-serif; font-size:13px; line-height:150%; color:#000000">
          ${replier} has replied to your comment on '${topic}'
          <br>
          <br>
             To see the comment thread, visit the <a href='https://www.bookofthemonth.com/discussions/product/${productId}'>Discussions page</a>.
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
