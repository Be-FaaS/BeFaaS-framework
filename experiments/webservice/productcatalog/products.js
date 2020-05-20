const products = {
  bathing_suit: {
    id: 'QWERTY',
    name: 'Bathing Suit',
    description: 'You will never want to take this off!',
    picture: 'https://source.unsplash.com/Ifh0UOYe9Gk/720x1080',
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
    picture: 'https://source.unsplash.com/JR1ChBgzJvQ/1080x720',
    priceUsd: {
      currencyCode: 'USD',
      units: 149,
      nanos: 990000000
    },
    categories: ['accessories', 'bath']
  }
}
module.exports = { products }
