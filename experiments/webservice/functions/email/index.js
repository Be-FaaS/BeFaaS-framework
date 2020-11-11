const lib = require('@befaas/lib')

// https://trac.webkit.org/browser/trunk/Source/WebCore/html/EmailInputType.cpp?rev=86298
const re = /^[a-z0-9!#$%&'*+/=?^_`{|}~.-]+@[a-z0-9-]+(\.[a-z0-9-]+)*$/i

function validateEmail (email) {
  return email && re.test(String(email).toLowerCase())
}

/**
 * Email Service sends validation emails to the user with the content of
 * ones order. The body thus must include the customers order and their email.
 *
 * The service returns and empty result on success and an {error: "..."}
 * response on failure.
 *
 * Ex Payload Body: {
 *    "email": "valid@email.com",
 *    "order" : {
 *      "order_id": "123fasd4",
 *      "shipping_tracking_id": "3uwfs",
 *      "shipping_cost": {
 *        "units": 100,
 *        "nanos": 500000000,
 *        "currencyCode": "PHP"
 *      },
 *      "shipping_address": {
 *        "streetAddress": "Schillerstrasse 9",
 *        "city": "Munich",
 *        "state": "Bavaria",
 *        "country": "Germany"
 *      },
 *      "items" : [
 *         {
 *         "item": {
 *           "productId": "1234b",
 *           "quantity": 3
 *         },
 *         "cost": {
 *           "units": 100,
 *           "nanos": 500000000,
 *           "currencyCode": "PHP"
 *         }
 *       }
 *     ]
 *   }
 * }
 *
 * Response: { }
 */
module.exports = lib.serverless.rpcHandler(request => {
  // Taken from the Chromium project:
  const ok = validateEmail(request.email)
  return ok ? {} : { error: 'email is invalid' }
})
