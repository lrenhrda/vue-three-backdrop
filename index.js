const _ = require('lodash')
const Three = require('three')
const Common = require('./Common')
const FixedFOVBackdropCamera = require('./FixedFOVBackdropCamera')
const AxisIndicator = require('./ThreeAxisIndicator')
const ShapesList = require('./ShapesList')
const PDSGrid = require('./PoissonDiskSamplingGrid')

module.exports = {
  template: '<div class="three-backdrop"></div>',
  props: {
    skyColor: {
      default: '#ffffff',
      type: String
    },
    groundColor: {
      default: '#000000',
      type: String
    },
    bgColor: {
      default: '#d3d3d3',
      type: String
    },
    shapes: {
      default: function () {
        return ShapesList
      },
      type: Array
    },
    rotation: {
      default: true,
      type: Boolean
    }
  },
  computed: {
    renderer: function () {
      return new Three.WebGLRenderer({
        alpha: true,
        antialias: true
      })
    },
    camera: function () {
      let c = new FixedFOVBackdropCamera(
        this.rect.width,
        this.rect.height,
        30,
        0.1,
        10000
      )

      c.onInit = function (env) {
        Common.centerObjectAtScroll(this)
        this.position.z = this.getDistance()
        this.updateProjectionMatrix()
      }

      c.onDraw = function (env) {
        Common.centerObjectAtScroll(this)
        this.updateProjectionMatrix()
      }

      return c
    },
    scene: function () {
      return new Three.Scene()
    },
    axisHelper: function () {
      return new AxisIndicator(500, 20, {
        colors: {
          origin: '#F2CE75',
          x: '#FC5A3C',
          y: '#0F9978',
          z: '#0F6899'
        }
      })
    },
    gridHelper: function () {
      return new Three.GridHelper(10000, 100, 'red', 'silver')
    },
    JSONLoader: function () {
      return new Three.JSONLoader()
    },
    baseMaterial: function () {
      return new Three.MeshPhongMaterial({
        color: '#ffffff'
      })
    }
  },
  data: function () {
    return {
      scroll: {
        top: 0,
        left: 0
      }
    }
  },
  methods: {
    onResize (event) {
      this.rect = this.$el.getBoundingClientRect()
      this.updateSize()
      this.onDraw()
    },
    onScroll (event) {
      this.scroll = {
        top: window.scrollY,
        left: window.scrollX
      }
      this.onDraw()
    },
    onInit (event) {
      this.scene.traverseVisible(o => {
        if (_.isFunction(o.onInit)) o.onInit(this)
      })
      this.onDraw()
    },
    onDraw (event) {
      // Update simulation:
      this.scene.traverseVisible((o) => {
        if (_.isFunction(o.onDraw)) o.onDraw(this)
      })
      this.renderer.render(this.scene, this.camera)
    },
    onFocus (event) {
      console.log('Window has been focused.', event)
    },
    getRect () {
      return this.$el.getBoundingClientRect()
    },
    updateSize () {
      this.renderer.setSize(this.rect.width, this.rect.height)
      this.camera.aspect = this.rect.width / this.rect.height
      this.camera.updateProjectionMatrix()
      this.onDraw()
    },
    loadShapes () {
      return Promise.all(this.shapes.map(file => {
        return new Promise((resolve, reject) => {
          this.JSONLoader.load(file, shape => {
            resolve(new Three.Mesh(shape, this.baseMaterial))
          })
        })
      }))
    },
    generateGrid (gridShape) {
      return new PDSGrid(gridShape, 400, {
        maxDistance: 500
      })
    }
  },
  mounted () {
    window.addEventListener('resize', this.onResize)
    window.addEventListener('scroll', this.onScroll)
    window.addEventListener('focus', this.onFocus)

    this.rect = this.$el.getBoundingClientRect()
    this.$el.appendChild(this.renderer.domElement)
    this.updateSize()
    this.$el.style.background = this.bgColor
    this.scene.background = this.bgColor

    // var geometry = new Three.BoxGeometry(100, 100, 100)

    var lighting = new Three.HemisphereLight(
      this.groundColor,
      this.skyColor,
      1
    )

    this.camera.aspect = this.rect.width / this.rect.height
    this.camera.updateProjectionMatrix()

    // this.scene.add(this.gridHelper)
    // this.scene.add(this.axisHelper)
    this.scene.add(lighting)
    this.scene.add(this.camera)

    var fieldPadding = 500
    var gridShape = new Three.Vector3(
      Common.getDisplayWidth() + (2 * fieldPadding),
      Common.getDocumentHeight() + (2 * fieldPadding),
      1000
    )

    Promise.all([this.loadShapes(), this.generateGrid(gridShape)]).then(components => {
      let meshes = components[0]
      let grid = components[1]
      let field = new Three.Object3D()

      grid.forEach((point, i) => {
        var mesh = meshes[Common.randomIntBetween(0, meshes.length - 1)].clone()

        var group = new Three.Group()
        var r = Common.randomWithNegatives()
        group.rotation.set(r * Math.PI, r * Math.PI, r * Math.PI)
        group.position.set(point[0], point[1], point[2])
        group.name = 'hmShape-' + i
        mesh.scale.set(2, 2, 2)

        if (this.rotation) {
          let s = Common.randomWithNegatives()
          mesh.onDraw = function (env) {
            var r = s * (window.scrollY / 1000)
            this.rotation.set(r * Math.PI, r * Math.PI, r * Math.PI)
          }
        }

        group.add(mesh)
        field.add(group)

        field.position.set(
          -1 * fieldPadding,
          -1 * fieldPadding,
          0
        )

        this.scene.add(field)
        this.onDraw()
      })
    })

    this.onDraw()
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onResize)
    window.removeEventListener('scroll', this.onScroll)
    window.removeEventListener('focus', this.onFocus)
  }
}