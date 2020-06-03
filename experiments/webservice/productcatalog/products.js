const products = {
  QWERTY: {
    id: 'QWERTY',
    name: 'Espresso Machine',
    description: 'Without this, your day has not even begun.',
    picture: 'https://source.unsplash.com/ZfyZ14gd2FM/720x1080',
    priceUsd: {
      currencyCode: 'USD',
      units: 179,
      nanos: 990000000
    },
    categories: ['machines', 'kitchen']
  },
  EASYSTOOL: {
    id: 'EASYSTOOL',
    name: 'Bar Stool',
    description: 'Expensive chairs are overrated anyway.',
    picture: 'https://source.unsplash.com/4kTbAMRAHtQ/720x1080',
    priceUsd: {
      currencyCode: 'USD',
      units: 27,
      nanos: 990000000
    },
    categories: ['furniture', 'living room', 'kitchen']
  },
  REFLECTXXX: {
    id: 'REFLECTXXX',
    name: 'Shiny Mirror',
    description:
      'You will definitely see yourself as a treasure by just looking at it.',
    picture: 'https://source.unsplash.com/JR1ChBgzJvQ/1080x720',
    priceUsd: {
      currencyCode: 'USD',
      units: 149,
      nanos: 990000000
    },
    categories: ['furniture', 'bath']
  }
}
module.exports = { products }
