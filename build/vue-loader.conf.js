'use strict'
const isProduction = process.env.NODE_ENV === 'production'
const sourceMapEnabled = !isProduction

module.exports = {
  cacheBusting: true,
  transformToRequire: {
    video: ['src', 'poster'],
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  },
  esModule: true
}
