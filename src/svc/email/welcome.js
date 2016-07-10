function formatRenewalDate(renewal_date) {
  let renewalDate = new Date(renewal_date).toLocaleString('en-US', {month: 'numeric', day: 'numeric', year: 'numeric'});
  return renewalDate;
}

function formatEnrollmentPlan(plan_name) {
  let enrollmentPlan = plan_name.toLowerCase().split('-').join(' ');
  return enrollmentPlan;
}

export function getGreetingText() {
  return 'Welcome to Book of the Month. Since 1926, Book of the Month has provided discerning readers like you with the very best books of the moment, delivered directly to your door. Below you will find all of the details to help you get started with your membership. Thank you for choosing Book of the Month.';
}

export function formatEnrollmentText(plan_name, renewal_plan_price, renewal_date, gift) {
  let enrollmentPlan = formatEnrollmentPlan(plan_name);
  let renewalDate = formatRenewalDate(renewal_date);
  let enrollmentText = '';
  if (gift) {
    enrollmentText = 'You have enrolled in a ' + enrollmentPlan + ' gift membership to Book of the Month.  Your plan will expire on ' + renewalDate + ' and will not renew.';
  } else {
    enrollmentText = 'You have enrolled in a ' + enrollmentPlan + ' membership to Book of the Month. Your membership will renew automatically and your credit card will be charged for $' + renewal_plan_price + ' on ' + renewalDate + '.';
  }
  enrollmentText += ' For a complete list of the terms of your membership, please visit https://www.bookofthemonth.com/terms-of-membership. If you would like to cancel your membership at any time, please call 1-888-784-2670.';
  return enrollmentText;
}

export function getSignoffText() {
  return 'We hope you enjoy your first month!  Please let us know if you have any questions by emailing member.services@bookofthemonth.com.';
}
