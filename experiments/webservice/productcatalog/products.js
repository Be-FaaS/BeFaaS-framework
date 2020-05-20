const products = {
  bathing_suit: {
    id: 'QWERTY',
    name: 'Bathing Suit',
    description: 'You will never want to take this off!',
    picture: 'bathing_suit.jpg',
    priceUsd: {
      currencyCode: 'USD',
      units: 64,
      nanos: 990000000
    },
    categories: ['clothing', 'bath']
  },
  shiny_mirror: {
    id: 'REFLECTXXX',
    name: 'Shiny Mirror',
    description: 'You will definitely see yourself as a treasure by just looking at it.',
    picture: 'shiny_mirror.jpg',
    priceUsd: {
      currencyCode: 'USD',
      units: 149,
      nanos: 990000000
    },
    categories: ['clothing', 'bath']
  }
}
module.exports = { products }
