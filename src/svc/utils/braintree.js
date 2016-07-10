/*
 * async/await wrapper for braintree requests (once we know what they are)
 */
import {connect, Environment, Test} from "braintree";
import {braintreeConfig as braintree} from "../../common/config";

/*
 * NEVER include this in a client-side file.  It may work, and it will import credentials.
 */
const braintreeConfig = JSON.parse(JSON.stringify(braintree));
Object.assign(braintreeConfig, {environment: Environment[braintreeConfig.env]});
const gateway = connect(braintreeConfig);

const idPrefix = 'botm';
const bookspanMerchantId = 'BOTM_instant';

export function errorMessage(err) {
  console.log('Braintree error message: ', err.verification);
  if (err.verification && ( err.verification.cvvResponseCode !== 'M' || err.verification.avsPostalCodeResponseCode !== 'M' ))
    return "There was a problem processing your credit card. Please verify your information below and try again.";
  return err.message || err;
}

export async function getClientToken(memberId) {
  return new Promise((resolve, reject) => {
    if (memberId) {
      gateway.clientToken.generate({customerId: idPrefix + memberId},
        (err, result) => {
          if (result && result.clientToken) resolve(result.clientToken);
          else if (result && result.message === "Customer specified by customer_id does not exist") {
            gateway.clientToken.generate({},
              (err, result) => {
                if (result && result.clientToken) resolve(result.clientToken);
                else if (err) reject(err);
                else reject('Unspecified error - successful response from Braintree but no clientToken returned.');
              }
            );
          } else reject('Unspecified error - client found but no clientToken returned.', err || result.message);
        }
      );
    } else {
      gateway.clientToken.generate({},
        (err, result) => {
          if (err) console.error(JSON.stringify(err));
          if (result && result.clientToken) resolve(result.clientToken);
          else if (err) reject(err);
          else reject('Unspecified error - successful response from Braintree but no clientToken returned.');
        }
      );
    }
  });
}

export async function getDefaultPayment(memberId) {
  return new Promise((resolve, reject) => {
    gateway.customer.find(idPrefix + memberId, (err, member) => {
      if (member && member.paymentMethods) resolve(member.paymentMethods[0]);
      else {
//        console.error("Failure to retrieve customer payment methods: ", err || member);
        resolve(null);
      }
    });
  });
}

export async function isMemberInBraintree(memberId) {
  return new Promise((resolve, reject)=> {
    gateway.customer.find(idPrefix + memberId, (err, result) => {
      if (err && err.name !== "notFoundError") {
//        console.error("Failed to find customer", err);
        resolve(false);
      } else result ? resolve(true) : resolve(false);
    });
  });
}

export async function createMember(member, deviceData = null) {
  return new Promise((resolve, reject) => {
    if (!member) return reject('createMember needs a customer obj');
    gateway.customer.create({
      id: idPrefix + ( member.id || member ),
      firstName: member.first_name,
      lastName: member.last_name,
      email: member.email,
      deviceData: deviceData
    }, (err, result) => {
      if (result && result.success) return resolve(true);
      return reject(err || result);
    });
  });
}

export async function authPurchase(nonce, token, amount, identifier=null) {
  return new Promise((resolve, reject) => {
    let sale = {
      amount: (Math.round(amount * 100) / 100).toString(),
      descriptor: {
        name: !identifier ? "BKS*BOOK OF THE MONTH" :
          ("BOM*" + identifier + ( typeof identifier === "string" ? "" : "-Month".slice( identifier.toString().length - 1 )) ),
        phone: "8887842670"
      }
    };
    if ( braintreeConfig.env === "Production" ) sale.merchantAccountId = bookspanMerchantId;
    if (nonce) sale.paymentMethodNonce = nonce;
    else  sale.paymentMethodToken = token;
    gateway.transaction.sale(sale, (err, result)=> {
      if (err || !result.success) {
        // console.log(err, result);
        reject(errorMessage(err || result));
      } else {
        resolve(result.transaction);
      }
    });
  });
}

export async function addPaymentMethod(nonce, deviceData = null, member = null) {
  let customerExists = await isMemberInBraintree(member.id || member);
  if (!customerExists)  await createMember(member, deviceData);

  let addPaymentMethodObj = {
    customerId: idPrefix + ( member.id || member),
    paymentMethodNonce: nonce,
    deviceData: deviceData,
    options: {
      makeDefault: true,
      verifyCard: true
    },
    billingAddress: {
      firstName: member.first_name,
      lastName: member.last_name
    }
  };

  return new Promise((resolve, reject) => {
    gateway.paymentMethod.create(addPaymentMethodObj, (err, result) => {
      if (err || !result.success || !result.paymentMethod) {
        console.log("Failure to add default payment method: ", err || result);
        reject(errorMessage(err || result));
      } else {
        resolve(result.paymentMethod.token);
        deleteAllOldPaymentMethods(member.id || member, result.paymentMethod.token);
      }
    });
  });
}

export async function updatePaymentMethodInfo(updateObj, deviceData = null) {
  let updatePaymentMethodObj = {
    cvv: updateObj.cvv,
    options: {verifyCard: true},
    deviceData: deviceData,
    billingAddress: {
      postalCode: updateObj.postalCode,
      options: {updateExisting: true}
    }
  };

  if (updateObj.expirationMonth) updatePaymentMethodObj.expirationMonth = updateObj.expirationMonth;
  if (updateObj.expirationYear) updatePaymentMethodObj.expirationYear = updateObj.expirationYear;
  if (updateObj.lastName) updatePaymentMethodObj.billingAddress.lastName = updateObj.lastName;
  if (updateObj.firstName) updatePaymentMethodObj.billingAddress.firstName = updateObj.firstName;

  return new Promise((resolve, reject) => {
    gateway.paymentMethod.update(updateObj.token, updatePaymentMethodObj, (err, result) => {
      if (err || !result.success) {
        console.log("Failure to update payment method: ", err || result);
        reject(errorMessage(err || result));
      } else resolve(true);
    });
  });
}

async function deleteAllOldPaymentMethods(memberId, token) {
  let allPaymentMethods = await getAllPaymentMethods(memberId);
  let queries = [];
  if (allPaymentMethods && allPaymentMethods.length > 0)
    allPaymentMethods.forEach(paymentMethod => {
      if (paymentMethod.token !== token)
        queries.push(deletePaymentMethod(memberId, paymentMethod))
    });
  if (queries.length > 0) await Promise.all(queries);
  return;
}

async function getAllPaymentMethods(memberId) {
  return new Promise((resolve, reject) => {
    gateway.customer.find(idPrefix + memberId, (err, customer) => {
      if (customer && customer.paymentMethods) resolve(customer.paymentMethods);
      else resolve(null);
    });
  });
}

async function deletePaymentMethod(memberId, paymentMethod) {
  let billingAddress = paymentMethod.billingAddress;
  if (billingAddress && billingAddress.id) await deletePaymentMethodBillingAddress(memberId, billingAddress.id);

  return new Promise((resolve, reject) => {
    gateway.paymentMethod.delete(paymentMethod.token, function (err) {
      if (err) {
        console.log("Failed to delete payment method:", paymentMethod.token);
        reject(err);
      } else resolve(true);
    });
  });
}

async function deletePaymentMethodBillingAddress(memberId, address_id) {
  return new Promise((resolve, reject) => {
    gateway.address.delete(idPrefix + memberId, address_id, function (err) {
      if (err) {
        console.log("Failed to delete payment methods billing address:", address_id);
        reject(err);
      } else resolve(true);
    });
  });
}

export function cancelTransaction(transaction_id) {
  return new Promise((resolve)=> {
    if (transaction_id) {
      gateway.transaction.cancelRelease(transaction_id, (err, result)=> {
        if (err || !result.success) {
          console.error("Failure to cancel Transaction: ", err || result.message);
        }
        resolve();
      });
    } else resolve();
  });
}


async function test() {
  try {
    let find, create;
    //find = await isMemberInBraintree(12684);
    //console.log(find ? 'Pass truthy test': 'FAILED truthy test', find);
    find = await isMemberInBraintree('bad');
    console.log(!find ? 'Pass falsy test' : 'FAILED falsy test', find);

    create = await createMember({
        id: idPrefix + Date.now(),
        first_name: 'john',
        last_name: 'doe',
        email: 'random' + Date.now() + '@bookspan.com'
      }, //min member obj
      {}); //device obj
    console.log(create ? 'Pass truthy test' : 'FAILED truthy test', create);
    try {
      create = await createMember();
      console.log('Failed falsy test');
    } catch (e) {
      console.log('Pass falsy test', e);
    }

  } catch (e) {
    console.error('Error', e);
  }
}

//test();
