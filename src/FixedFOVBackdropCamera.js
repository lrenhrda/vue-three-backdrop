// Requirements
import * as Three from 'three'
import * as Common from './Common'

/** FIXED FOV BACKDROP CAMERA
 * --------------------------------------------------------
 * Given a desired view plane size, creates a perspective
 * camera that adjusts its distance from the view plane
 * in order to maintain a given FOV angle (in degrees)
 */

export default class FixedFOVBackdropCamera extends Three.PerspectiveCamera {
  constructor (vw, vh, fov, near = 0.1, far = 2000) {
    super()

    // vw: viewport width
    // vh: viewport height
    // fov: field of view

    // z:  z-axis distance
    this.recalculate()

    this.type = 'FixedFOVBackdropCamera'
    this.position.z = -1 * this.z
    this.rotation.x = Math.PI
    this.fov = fov
    this.aspect = vw / vh
    this.near = near
    this.far = far
    this.focus = this.z

    this.updateProjectionMatrix()
  }

  getDistance () {
    this.recalculate()
    return this.z
  }

  recalculate () {
    let vh = Common.getViewportHeight()
    this.z = (vh / 2) / Math.tan((this.fov * (Math.PI / 180)) / 2)
    this.position.z = -1 * this.z
    this.focus = this.z
  }

  updateProjectionMatrix () {
    this.recalculate()
    super.updateProjectionMatrix()
  }
}
