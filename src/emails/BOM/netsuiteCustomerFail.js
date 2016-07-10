export function validate(data) {
  return; //@TODO add any template data validations here
}

export function formatData(data) {
  return;
}

export function subject(data) {
  return `Netsuite customer creation failure during BOTM customer enrollment`;
}

export function text(data) {
  return `
A Book of the Month member's subscription purchase was authorized by Braintree, but Netsuite was unable to add this customer to its database.
Please forward this email to engineering@bookspan.com for debugging.


Member Info:

BOTM internal member id: %bomId%
Email: %email%
Username: %username%
Shipping Name: %shippingName
Braintree customer id: %braintreeId%
Billing zip code: %billingZip%


Order Info:

Braintree transaction id: %braintreeTransactionId%
Transaction date: %date%
Payment subtotal: %productRate%
Tax rate: %taxRate%
Tax amount: %taxAmount%
Payment total: %total%


Netsuite Info:

RESTlet endpoint: %endpoint%
JSON sent: %reqJSON%
Failure type: %type%
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
			A Book of the Month member's subscription purchase was authorized by Braintree, but Netsuite was unable to add this customer to its database.<br>
			Please forward this email to engineering@bookspan.com for debugging.<br>
			<br>
			<br>
			Member Info:
			<br>
			BOTM internal member id: ${data.member.id}<br>
			Email: ${data.member.email}<br>
			Username: ${data.member.display_name}<br>
			Shipping Name: <br>
			Braintree customer id: <br>
			Billing zip code: <br>
			<br>
			<br>
			Order Info:
			<br>
			Braintree transaction id: <br>
			Transaction date:<br>
			Payment subtotal: <br>
			Tax rate: <br>
			Tax amount: <br>
			Payment total: <br>
			<br>
			<br>
			Netsuite Info:
			<br>
			RESTlet endpoint: <br>
			JSON sent: <br>
			Failure type: <br>
			<br>
		</td>
	</tr>
</table>`;
}
