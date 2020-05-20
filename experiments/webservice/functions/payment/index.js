const lib = require('@faastermetrics/lib')
const valid = require('card-validator')

function sanitizeCreditCard (card) {
  return card.replace(/[^0-9]/g, '')
}

/**
 * Email Service sends validation emails to the user with the content of
 * ones order. The body thus must include the customers order and their email.
 *
 * The service returns and empty result on success and an {error: "..."}
 * response on failure.
 *
 * Ex Payload Body: {
 *  "amount": {
 *    "units": 100,
 *    "nanos": 500000000,
 *    "currencyCode": "PHP"
 *  },
 *  "creditCard": {
 *    "creditCardNumber": "123 456 789 000",
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
    ? {
        transactionId: (Math.random() * 99999999999999999).toString(36)
      }
    : { error: 'credit card is invalid' }
})
