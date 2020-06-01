const lib = require('@faastermetrics/lib')
const valid = require('card-validator')

function sanitizeCreditCard (card) {
  return card.replace(/[^0-9]/g, '')
}

function getTransactionId () {
  return (Math.random() * 99999999999999999).toString(36)
}

/**
 * The Payment Service accepts a payment value and a credit card. The service
 * checks the credit card number for plausible validity.
 *
 * The service returns a transactionID result on success and an {error: "..."}
 * response on failure.
 *
 * Ex Payload Body: {
 *  "amount": {
 *    "units": 100,
 *    "nanos": 500000000,
 *    "currencyCode": "PHP"
 *  },
 *  "creditCard": {
 *    "creditCardNumber": "378282246310005",
 *    "creditCardCvv": 123,
 *    "creditCardExpirationYear": 2000,
 *    "creditCardExpirationMonth": 10
 *   }
 * }
 *
 * Response: {
 *   "transactionId": "x1234b"
 *  }
 */
module.exports = lib.serverless.rpcHandler(request => {
  const ok = valid.number(
    sanitizeCreditCard(request.creditCard.creditCardNumber)
  ).isPotentiallyValid
  return ok
    ? { transactionId: getTransactionId() }
    : { error: 'credit card is invalid' }
})
