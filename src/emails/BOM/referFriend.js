export function validate(data) {
  return; //@TODO add any template data validations here
}

export function formatData(data) {
  return;
}

export function subject(data) {
  return `${data.has invited you to Book of the Month!`;
}

export function text(data) {
  return `
%header%

%message%

https://www.bookofthemonth.com/referCode/?referCode=%referCode%

Happy reading,
Book of the Month
`;
}

export function html(data) {
  return `
<table cellpadding='0' cellspacing='0' width='90%' align='center'>
  <tr>
    <td width="1" height="20" ><img src="http://images.dbimedia.com/shared/spacer.gif" width="1px" height="20px" alt="" style="display: block;" /></td>
  </tr>
  <tr>
    <td width="1" height="20" ><img src="http://images.dbimedia.com/shared/spacer.gif" width="1px" height="20px" alt="" style="display: block;" /></td>
  </tr>
  <tr>
    <td style="font-family: Arial, Helvetica, sans-serif; font-size:13px; line-height:150%; color:#000000">
      %header%
      <br><br>
      %message%
      <br><br>
      <a href="https://www.bookofthemonth.com/referCode/?referCode=%referCode%" style="color: white; background-color: #11afe2; padding: 10px 30px; text-decoration: none">Accept Invitation</a>
      <br><br>

      Happy reading,
      <br>
      Book of the Month
      <br><br>
    </td>
  </tr>
</table>`;
}
