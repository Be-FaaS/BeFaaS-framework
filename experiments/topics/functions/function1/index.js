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

module.exports = lib.serverless.msgHandler(async (event, ctx) => {
	console.log("event: " + JSON.stringify(event));
	console.log("ctx: " + JSON.stringify(ctx));	
	listPrimes(110);	
	console.log("Found 110 primes");	
	var result = await ctx.call('publisher', {
		fun: 'function2',
		event: {
			name: 'Schokolade',
			zucker: 10
		}
    })	
	console.log("Result from calling function2: " + JSON.stringify(result))
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
