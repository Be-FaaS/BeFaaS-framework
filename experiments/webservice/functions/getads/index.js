const lib = require('@faastermetrics/lib')

/**
 *
 * Returns two random ads without input.
 *
 * Example Request: {}
 *
 * Example Response: {
 *  "ads": [{
 *     redirect_url:
 *       'https://commons.wikimedia.org/wiki/File:Cat_public_domain_dedication_image_0011.jpg',
 *     image_url:
 *       'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Cat_public_domain_dedication_image_0011.jpg/800px-Cat_public_domain_dedication_image_0011.jpg',
 *     text: 'Cute cat'
 *   },
 *   {
 *     redirect_url:
 *       'https://commons.wikimedia.org/wiki/File:Tabby_cat_with_blue_eyes-3336579.jpg',
 *     image_url:
 *       'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Tabby_cat_with_blue_eyes-3336579.jpg/499px-Tabby_cat_with_blue_eyes-3336579.jpg',
 *     text: 'Cat with blue eyes'
 *   }]}
 *
 */



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
  },
  {
    redirect_url:
      'https://commons.wikimedia.org/wiki/File:Cat_public_domain_dedication_image_0007.jpg',
    image_url:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Cat_public_domain_dedication_image_0007.jpg/800px-Cat_public_domain_dedication_image_0007.jpg',
    text: 'Cat on wood'
  },
  {
    redirect_url:
      'https://commons.wikimedia.org/wiki/File:Cat_public_domain_dedication_image_0011.jpg',
    image_url:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Cat_public_domain_dedication_image_0011.jpg/800px-Cat_public_domain_dedication_image_0011.jpg',
    text: 'Cute cat'
  },
  {
    redirect_url:
      'https://commons.wikimedia.org/wiki/File:Tabby_cat_with_blue_eyes-3336579.jpg',
    image_url:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Tabby_cat_with_blue_eyes-3336579.jpg/499px-Tabby_cat_with_blue_eyes-3336579.jpg',
    text: 'Cat with blue eyes'
  }
]

const numAds = 2

module.exports = lib.serverless.rpcHandler(event => {
  // gets numAds by shuffeling the ad-array and then picks the first numAds elements out of the result
  const shownAds = ads.sort(() => 0.5 - Math.random()).slice(0, numAds)

  return { ads: shownAds }
})
