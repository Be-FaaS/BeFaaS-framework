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

module.exports = lib.serverless.msgHandler(undefined, async (event, ctx) => {
	console.log("All Vars:" +  JSON.stringify(process.env));
	console.log("event: " + JSON.stringify(event) + "\n");
	// console.log("ctx: " + JSON.stringify(ctx) + "\n");
	
	listPrimes(100);
	
	console.log("Found some primes");
	
	//Respond ok  
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      result: 'ok',
    }),
  }  
});