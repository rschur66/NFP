export function validate(data) {
  //add any template data validations here
  if (!data.member.first_name) throw new Error('passwordReset needs member obj with first_name');
  if (!data.reset_link) throw new Error('passwordReset needs reset_link');
}

export function formatData(data) {
  //any data manipulates to alter template here
  return;
}

export function subject(data) {
  return `Reset your ${data.store.name} password`;
}

export function text(data) {
  return `
  Forgot your password, ${data.member.first_name}?
	We recently received a request to change the password for your Book of the Month account.
	To reset your password, click on the link below (or copy and paste the URL into your browser):
	${data.reset_link}
	If you did not make this request, you can safely ignore this message and your password will remain the same.
`;
}

export function html(data) {
  return `
<tr>
  <td>
    <table cellpadding="40" cellspacing="0" align="center" width="100%" style="background-color:#ffffff; border: 1px solid #deddd5;" >
      <tr>
        <td style="font-family: Arial, Helvetica, sans-serif; font-size:13px; line-height:150%; color:#000000">
            Forgot your password, ${data.member.first_name}?
          <br>
          <br>
            We recently received a request to change the password for your Book of the Month account.
          <br>
          <br>
            To reset your password, click on the link below (or copy and paste the URL into your browser):
          <br>
            ${data.reset_link}
          <br>
          <br>
            If you did not make this request, you can safely ignore this message and your password will remain the same.
          <br>
          <br>
        </td>
      </tr>
    </table>
  </td>
</tr>
`;
}
