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
	console.log("All Vars:" +  JSON.stringify(process.env, null, 2));
	console.log("event: \n" + JSON.stringify(event, null, 2));
	console.log("ctx: \n" + JSON.stringify(ctx, null, 2));	
	listPrimes(110);	
	console.log("Found 110 primes");	
	var result = await ctx.lib.call('publisher', {
		fun: 'function2',
		event: {
			name: 'Schokolade',
			zucker: 10
		}
    })	
	console.log("Result from calling function2: " + JSON.stringify(result, null, 2))
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