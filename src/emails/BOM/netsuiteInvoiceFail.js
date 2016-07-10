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
A Book of the Month member was successfully added as a Netsuite customer, but Netsuite was unable to create an invoice for the member's subscription purchase.
Please forward this email to engineering@bookspan.com for debugging.


Member Info:

BOTM internal member id: %bomId%
Email: %email%
Username: %username%
Shipping Name: %shippingName
Braintree customer id: %braintreeId%
Netsuite internal id: %netsuiteId%
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
			A Book of the Month member was successfully added as a Netsuite customer, but Netsuite was unable to create an invoice for the member's subscription purchase.<br>
			Please forward this email to engineering@bookspan.com for debugging.<br>
			<br>
			<br>
			Member Info:
			<br>
			BOTM internal member id: %bomId%<br>
			Email: %email%<br>
			Username: %username%<br>
			Shipping Name: %shippingName<br>
			Braintree customer id: %braintreeId%<br>
			Netsuite internal id: %netsuiteId%<br>
			Billing zip code: %billingZip%<br>
			<br>
			<br>
			Order Info:
			<br>
			Braintree transaction id: %braintreeTransactionId%<br>
			Transaction date: %date%<br>
			Payment subtotal: %productRate%<br>
			Tax rate: %taxRate%<br>
			Tax amount: %taxAmount%<br>
			Payment total: %total%<br>
			<br>
			<br>
			Netsuite Info:
			<br>
			RESTlet endpoint: %endpoint%<br>
			JSON sent: %reqJSON%<br>
			Failure type: %type%<br>
			<br>
		</td>
	</tr>
</table>`;
}
