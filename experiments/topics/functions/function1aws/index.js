const lib = require('@befaas/lib')

function listPrimes( nPrimes ) {
    var primes = [];
    for( var n = 2;  nPrimes > 0;  n++ ) {
        if( isPrime(n) ) {
            primes.push( n );
            --nPrimes;
        }
    }
    return primes;
}

function isPrime( n ) {
    var max = Math.sqrt(n);
    for( var i = 2;  i <= max;  i++ ) {
        if( n % i === 0 )
            return false;
    }
    return true;
}

module.exports = lib.serverless.rpcHandler(async (request, ctx) => {
  listPrimes(100)
	
  const resp = await ctx.call('function2aws',{
	  item: "Pudding",
	  item2: "Sahne"
  })
  
  listPrimes(100)
  return { result: 'Im done 1.' }
  
})

module.exports = lib.serverless.snsHandler(undefined, async (event, ctx) => {
	console.log("EVENT: \n" + JSON.stringify(event, null, 2));
});
