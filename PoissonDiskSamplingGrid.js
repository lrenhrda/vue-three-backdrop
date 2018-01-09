/**
 * POISSON DISK SAMPLING GRID
 * ----------------------------------------
 * Returns a promise of a Poisson disk grid.
 * TODO: Make this use a Box3 for the shape parameter.
 */

import * as _ from 'lodash'
import PoissonDiskSampling from 'poisson-disk-sampling'

export default class PDSGrid {
  constructor (shape, minDistance, options) {
    let opts = _.defaults(options, {
      maxDistance: minDistance * 2,
      maxTries: 30,
      rng: Math.random,
      cache: false
    })

    return new Promise((resolve, reject) => {
      if (!shape) {
        reject(new Error('Must provide a shape for the grid.'))
      }

      if (!minDistance) {
        reject(new Error('Must provide a minimum distance between grid points.'))
      }

      if (!shape.isVector3) {
        reject(new Error('Shape parameter must be instance of THREE.Vector3.'))
      }

      let ssPds = JSON.parse(sessionStorage.getItem('pds'))
      let ssDimensions = JSON.parse(sessionStorage.getItem('dimensions'))
      let dimensions = [
        document.width,
        document.height
      ]

      if (ssPds &&
         (opts.cache !== false) &&
         (dimensions === ssDimensions)
      ) {
        resolve(ssPds)
      } else {
        let pds = new PoissonDiskSampling(
          shape.toArray(),
          minDistance,
          opts.maxDistance,
          opts.maxTries,
          opts.rng
        ).fill()

        sessionStorage.setItem('pds', JSON.stringify(pds))
        sessionStorage.setItem('dimensions', JSON.stringify([
          document.width,
          document.height
        ]))

        resolve(pds)
      }
    })
  }
}
