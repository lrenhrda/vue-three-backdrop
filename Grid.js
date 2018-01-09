/**
 * GRID
 * ----------------------------------------
 * Returns a promise for a grid of points.
 * Optional perturbation and caching.
 */

import * as _ from 'lodash'
import * as Common from './Common'

export default class grid {
  constructor (shape, distance, options) {
    let opts = _.defaults(options, {
      perturbation: 0,
      cache: false
    })

    return new Promise((resolve, reject) => {
      if (!shape) {
        reject(new Error('Must provide a shape for the grid.'))
      }

      if (!distance) {
        reject(new Error('Must provide a distance between grid points.'))
      }

      if (!shape.isVector3) {
        reject(new Error('Shape parameter must be instance of THREE.Vector3.'))
      }

      let x
      let y
      let z
      let points = []

      for (z = 0; z < (Math.abs(shape.z) / distance); z++) {
        for (y = 0; y < (Math.abs(shape.y) / distance); y++) {
          for (x = 0; x < (Math.abs(shape.x) / distance); x++) {
            var origin = [
              x * distance,
              y * distance,
              z * distance
            ]

            origin.add(
              Common.uniformRandomNormal().multiplyScalar(
                Common.exponentiallyRandomValue(opts.perturbation)
              )
            )

            points.push(origin)
          }
        }
      };

      resolve(points)
    })
  }
}
