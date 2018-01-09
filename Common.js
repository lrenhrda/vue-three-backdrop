/**
 * iso.js
 * ----------------------------------------
 * Common functions & utilities.
 */
import * as _ from 'lodash'
import * as Three from 'three'

/**
 * CLOSEST TO
 * ----------------------------------------
 * Returns the element from {options} that
 * is closest to {goal}.
 */
export function closestTo (options, goal) {
  return options.reduce(function (prev, curr) {
    return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev)
  })
}

/**
 * DEGREES TO RADIANS
 * ----------------------------------------
 * Converts degress to radians.
 */
export function degreesToRadians (degrees) {
  return degrees * Math.PI / 180
}

/**
 * GET ORIENTATION
 * ----------------------------------------
 * Detects device orientation. Falsey if
 * device does not support orientation.
 */
export function getOrientation () {
  if (typeof window.orientation !== 'undefined') {
    return Math.abs(window.orientation) - 90 === 0 ? 'landscape' : 'portrait'
  } else return false
}

/**
 * SCREEN SIZE
 * ----------------------------------------
 * Detects available screen size.
 */
export function screenSize () {
  return {
    width: Math.max(window.screen.width, window.screen.availWidth),
    height: Math.max(window.screen.height, window.screen.availHeight)
  }
}

/**
 * LARGEST AVAILABLE SCREEN DIMENSION
 * ----------------------------------------
 * Detects largest available screen size.
 * Returns max of width and height, because
 * user may be on mobile and could reorient.
 */
export function maxScreenDimension () {
  let s = screenSize()
  return Math.max(s.width, s.height)
}

/**
 * RANDOM WITH NEGATIVES
 * ----------------------------------------
 * Works like Math.random(), but also will
 * output negative values, from -1 to 1.
 */
export function randomWithNegatives () {
  return Math.random() * 2 - 1
}

/**
 * RANDOM INT BETWEEN
 * ----------------------------------------
 * Outputs a random integer between
 * two other given integers.
 */
export function randomIntBetween (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * SCROLL MAX
 * ----------------------------------------
 * Determines the maximum size available
 * for scrolling on the page.
 */
export function scrollMax () {
  let b = document.body
  let d = document.documentElement
  let s = 'scroll'
  let o = 'offset'
  let c = 'client'
  let h = 'Height'
  let w = 'Width'

  return {
    x: Math.max(b[ s + w ], b[ o + w ], d[ c + w ], d[ s + w ], d[ o + w ]),
    y: Math.max(b[ s + h ], b[ o + h ], d[ c + h ], d[ s + h ], d[ o + h ])
  }
}

/**
 * VIEWPORT DIMENSIONS
 * ----------------------------------------
 * Returns the dimensions of the viewport.
 */
export function getViewportDimensions () {
  var html = document.documentElement

  return {
    x: Math.max(
      html.clientWidth,
      window.innerWidth || 0
    ),
    y: Math.max(
      html.clientHeight,
      window.innerHeight || 0
    )
  }
}

/**
 * VIEWPORT WIDTH
 * ----------------------------------------
 * Returns the width of the viewport.
 */
export function getViewportWidth () {
  return getViewportDimensions().x
}

/**
 * VIEWPORT HEIGHT
 * ----------------------------------------
 * Returns the height of the viewport.
 */
export function getViewportHeight () {
  return getViewportDimensions().y
}

/**
 * DISPLAY DIMENSIONS
 * ----------------------------------------
 * Returns the dimensions of the display.
 */
export function getDisplayDimensions () {
  return {
    x: screen.width,
    y: screen.height
  }
}

/**
 * DISPLAY WIDTH
 * ----------------------------------------
 * Returns the width of the display.
 */
export function getDisplayWidth () {
  return getDisplayDimensions().x
}

/**
 * DISPLAY HEIGHT
 * ----------------------------------------
 * Returns the height of the display.
 */
export function getDisplayHeight () {
  return getDisplayDimensions().y
}

/**
 * DOCUMENT DIMENSIONS
 * ----------------------------------------
 * Returns the dimensions of the document.
 */
export function getDocumentDimensions () {
  var body = document.body
  var html = document.documentElement

  return {
    x: Math.max(
      body.scrollWidth,
      html.scrollWidth,
      body.offsetWidth,
      html.offsetWidth,
      body.clientWidth,
      html.clientWidth
    ),
    y: Math.max(
      body.scrollHeight,
      html.scrollHeight,
      body.offsetHeight,
      html.offsetHeight,
      body.clientHeight,
      html.clientHeight
    )
  }
}

/**
 * DOCUMENT WIDTH
 * ----------------------------------------
 * Returns the width of the document.
 */
export function getDocumentWidth () {
  return getDocumentDimensions().x
}

/**
 * DOCUMENT HEIGHT
 * ----------------------------------------
 * Returns the height of the document.
 */
export function getDocumentHeight () {
  return getDocumentDimensions().y
}

/**
 * GET SCROLL PERCENT
 * ----------------------------------------
 * Returns the percentage x,y (in decimal
 * form) that the user has scrolled.
 */
// export function getScrollPercent () {
//   let h = document.documentElement
//   let b = document.body
//   let w = window
//   let st = 'scrollTop'
//   let sh = 'scrollHeight'
//   let sl = 'scrollLeft'
//   let sw = 'scrollWidth'
//   let yo = 'pageYOffset'
//   let xo = 'pageXOffset'

//   return {
//     x: $(window).scrollLeft() / (scrollMax().x - h.clientWidth),
//     y: $(window).scrollTop() / (scrollMax().y - h.clientHeight)
//   }
// }

/**
 * CENTER OBJECT AT SCROLL
 * ----------------------------------------
 * Centers an element at the center of the
 * window, based on the scroll position.
 */
export function centerObjectAtScroll (o, cb) {
  let h = document.documentElement
  let b = document.body
  let w = window
  let st = 'scrollTop'
  let sl = 'scrollLeft'
  let iw = 'innerWidth'
  let ih = 'innerHeight'

  // Set the object's position:
  // o.position.x = (w[iw] / 2) + (h[sl] || b[sl])
  // o.position.y = (w[ih] / 2) - (h[st] || b[st])

  o.position.x = (w[iw] / 2) + (h[sl] || b[sl])
  o.position.y = (w[ih] / 2) + (h[st] || b[st])

  // Call the callback:
  if (_.isSet(cb)) { cb(o) }

  // Return the object:
  return o
}

/**
 * UNIFORM RANDOM NORMAL
 * ----------------------------------------
 * Creates a unified random normal,
 * expressed as a Vector3 object.
 */
export function uniformRandomNormal () {
  do {
    var vector = new Three.Vector3(
      randomWithNegatives(),
      randomWithNegatives(),
      randomWithNegatives()
    )
  } while (vector.length() < 0.001)
  return vector.normalize()
}

/**
 * EXP RANDOM VALUE
 * ----------------------------------------
 * Outputs an exponentially random
 * value given an input.
 */
export function exponentiallyRandomValue (l) {
  return l * Math.exp(-l * randomWithNegatives())
}
