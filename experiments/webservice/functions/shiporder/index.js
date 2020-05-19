const lib = require('@faastermetrics/lib')

// Returns a new TrackingID for the shipment.
function generateTrackingID () {
  return Math.floor(Math.random() * 999999999999)
}
/**
 *
 * Ships out a package and provides respective tracking ID.
 *
 * Ex Payload Body: {
 *  "address":{
 *    "streetAddress": "Schillerstrasse 9",
 *    "city": "Munich",
 *    "state": "Bavaria",
 *    "country": "Germany"
 *  },
 *  "items":[
 *    {"id":1,"quantity":6},
 *    {"id":4,"quantity":-1}
 *  ]
 * }
 *
 * Response: {
 *   "id": <some tracking number>
 * }
 *
 */

module.exports = lib.serverless.rpcHandler(event => {
  // Ships order and provides tracking ID.
  lib.log({ event })
  // const { address, cart } = event
  return { id: generateTrackingID() }
})
