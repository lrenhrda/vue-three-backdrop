'use strict'

import * as _ from 'lodash'
import * as Three from 'three'

export default class AxisIndicator extends Three.Object3D {
  constructor (length = 100, thickness = 10, options) {
    super()

    let opts = _.defaults(options, {
      colors: {
        origin: 'yellow',
        x: 'red',
        y: 'green',
        z: 'blue'
      }
    })

    let materials = {
      origin: new Three.MeshBasicMaterial({ color: opts.colors.origin }),
      x: new Three.MeshBasicMaterial({ color: opts.colors.x }),
      y: new Three.MeshBasicMaterial({ color: opts.colors.y }),
      z: new Three.MeshBasicMaterial({ color: opts.colors.z })
    }

    // Origin
    let o = new Three.Mesh(
      new Three.SphereGeometry(thickness, 32, 32),
      materials.origin
    )

    // X Axis
    let x = new Three.Mesh(
      new Three.CylinderGeometry(0.3 * thickness, 0.3 * thickness, length, 32),
      materials.x
    )
    x.position.x = length / 2
    x.rotation.z = Math.PI / 2
    let xCone = new Three.Mesh(
      new Three.ConeGeometry(0.75 * thickness, 1.5 * thickness),
      materials.x
    )
    xCone.rotation.z = Math.PI
    xCone.position.y = -(length / 2)
    x.add(xCone)
    o.add(x)

    // Y Axis
    let y = new Three.Mesh(
      new Three.CylinderGeometry(0.3 * thickness, 0.3 * thickness, length, 32),
      materials.y
    )
    y.position.y = length / 2
    let yCone = new Three.Mesh(
      new Three.ConeGeometry(0.75 * thickness, 1.5 * thickness),
      materials.y
    )
    yCone.position.y = length / 2
    y.add(yCone)
    o.add(y)

    // Z Axis
    let z = new Three.Mesh(
      new Three.CylinderGeometry(0.3 * thickness, 0.3 * thickness, length, 32),
      materials.z
    )
    z.position.z = length / 2
    z.rotation.x = Math.PI / 2
    let zCone = new Three.Mesh(
      new Three.ConeGeometry(0.75 * thickness, 1.5 * thickness),
      materials.z
    )
    zCone.position.y = length / 2
    z.add(zCone)
    o.add(z)

    // Return the axes
    this.add(o)
  }
}
