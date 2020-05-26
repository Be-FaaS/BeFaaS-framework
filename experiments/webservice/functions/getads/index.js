const lib = require('@faastermetrics/lib')

const ads = [
  {
    redirect_url:
      'https://commons.wikimedia.org/wiki/File:Cat_public_domain_dedication_image_0001.jpg',
    image_url:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Cat_public_domain_dedication_image_0001.jpg/800px-Cat_public_domain_dedication_image_0001.jpg',
    text: 'Look at this cute cat'
  },
  {
    redirect_url:
      'https://commons.wikimedia.org/wiki/File:Cat_public_domain_dedication_image_0002.jpg',
    image_url:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Cat_public_domain_dedication_image_0002.jpg/800px-Cat_public_domain_dedication_image_0002.jpg',
    text: 'Cat looking at stuff'
  },
  {
    redirect_url:
      'https://commons.wikimedia.org/wiki/File:Cat_public_domain_dedication_image_0003.jpg',
    image_url:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Cat_public_domain_dedication_image_0003.jpg/800px-Cat_public_domain_dedication_image_0003.jpg',
    text: 'Cat thinking really hard'
  },
  {
    redirect_url:
      'https://commons.wikimedia.org/wiki/File:Cat_public_domain_dedication_image_0004.jpg',
    image_url:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Cat_public_domain_dedication_image_0004.jpg/800px-Cat_public_domain_dedication_image_0004.jpg',
    text: 'Cat looking at you'
  }
]

const numAds = 2

module.exports = lib.serverless.rpcHandler(event => {
  // gets numAds by shuffeling the ad-array and then picks the first numAds elements out of the result
  var shownAds = ads.sort(() => 0.5 - Math.random()).slice(0, numAds)

  return shownAds
})
