// Requirements
import * as Three from 'three'

export default class FixedDistanceBackdropCamera extends Three.PerspectiveCamera {
  constructor (vw, vh, z, near = 0.1, far = 2000) {
    super()

    // vw: viewport width
    // vh: viewport height
    // z:  z-axis distance
    this.type = 'FixedDistanceBackdropCamera'
    this.position.z = -1 * z
    this.position.x = vw / 2
    this.position.y = vh / 2
    this.rotation.x = Math.PI
    this.fov = (Math.atan2((vh / 2), z) * 2) * (180 / Math.PI)
    this.aspect = vw / vh
    this.near = near
    this.far = z + far
    this.focus = z

    this.updateProjectionMatrix()
  };
};
