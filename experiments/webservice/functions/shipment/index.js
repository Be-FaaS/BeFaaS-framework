const lib = require('@faastermetrics/lib')

// Returns a new TrackingID for the shipment
function generateTrackingID () {
  return Math.floor(Math.random() * 999999999999 )
}

// Iterates over given cart and calculates shipping cost in EUR
function calculateShippingCost (cart){
  var count = 0;
  for (var i = 0; i < cart.length; i++){
    count += cart[i].quantity
  }
  
  // Yes, overall item quantity increases quadratically in comparison to shipping cost. 
  if (count < 0){
    return 0
  }
  return Math.ceil(Math.sqrt(count))
}

/**
 *
 * Can either
 *
 * ship out a package ( /shipment ) and provide a tracking ID or
 * calculate shipping cost of a given cart ( /shipmentquote ).
 *
 *
 * Ex Payload Body: {
 *  "Address":[
 *    "StreetAddress": "Schillerstrasse 9",
 *    "City": "Munich",
 *    "State": "Bavaria",
 *    "Country": "Germany"
 *  ],
 *  "Items":[
 *    {"id":1,"quantity":6},
 *    {"id":4,"quantity":-1}
 *  ]
 * }
 *
 * Response for shipment: {
 *   "id": <some tracking number>
 * }
 *
 * Response for shipment quote: {
 * 	 "CostEur": [
 *	   "CurrencyCode": "EUR",
 *		 "Units": <shipment cost>,
 *	   "Nanos": 0
 *	 ]
 * }
 */

module.exports = lib.serverless.router(router => {
  // calculates shipping cost
  router.post('/shipmentquote', (ctx, next) => {
    let {address, cart} = ctx.request.body
    ctx.body = { 
      "CostEur": [
        "CurrencyCode": "EUR",
 	      "Units": calculateShippingCost(cart),
        "Nanos": 0
      ]
    }
  })

  // ships items and provides tracking number
  router.post('/shipping', (ctx, next) => {
    let {address, cart} = ctx.request.body
    ctx.body = { "id": generateTrackingID() }
  })

  router.attachEventHandler(request => {
    lib.log({ request })
    return { ok: true, from: 'shipment' }
  })
})

