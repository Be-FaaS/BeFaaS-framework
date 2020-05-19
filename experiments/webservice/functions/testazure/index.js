module.exports = async function (context, req) {
  context.log('Hello experiment!')
  context.res = {
    // status: 200, /* Defaults to 200 */
    body: JSON.stringify('yay')
  }
  context.done()
}
