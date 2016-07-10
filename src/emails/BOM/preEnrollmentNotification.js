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
We just got a pre enrollment!
%enrollData%
`;
}

export function html(data) {
  return `
<style>
td {
  font-size:13px;
  font-family: Arial, Helvetica, sans-serif;
  line-height:150%;
  color:#000000;
}
</style>
<table cellpadding='0' cellspacing='0' width='600' align='center'>
  <tr>
    <td>
    We just got a pre enrollment! <br>
    %enrollData%
    </td>
  </tr>
</table>`;
}
