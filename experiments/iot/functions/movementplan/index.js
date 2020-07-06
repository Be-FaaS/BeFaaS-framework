const lib = require('@faastermetrics/lib')
const _ = require('lodash')

/*
bit order: 0b[red][yellow][green]
{
  lights: ["red","green", "yellow"],
  blink: false
}
*/

module.exports = lib.serverless.rpcHandler(
  { db: 'redis' },
  async (event, ctx) => {
    let { cars } = await ctx.db.get('movementplan:cars')

    if (event.objects) {
      cars = cars.slice(0, event.objects.length)
    } else if (event.carDirection) {
      cars.unshift(event.carDirection)
      cars = _.uniqBy(cars, 'plate')
      cars = cars.slice(0, 12)
    }
    await ctx.db.set('movementplan:cars', { cars })

    const res = {
      plan: cars
    }
    await ctx.call('setlightphasecalculation', res)
    return res
  }
)
