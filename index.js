'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _three = require('three');

var Three = _interopRequireWildcard(_three);

var _Common = require('./Common');

var Common = _interopRequireWildcard(_Common);

var _FixedFOVBackdropCamera = require('./FixedFOVBackdropCamera');

var _FixedFOVBackdropCamera2 = _interopRequireDefault(_FixedFOVBackdropCamera);

var _ThreeAxisIndicator = require('./ThreeAxisIndicator');

var _ThreeAxisIndicator2 = _interopRequireDefault(_ThreeAxisIndicator);

var _ShapesList = require('./ShapesList');

var _ShapesList2 = _interopRequireDefault(_ShapesList);

var _PoissonDiskSamplingGrid = require('./PoissonDiskSamplingGrid');

var _PoissonDiskSamplingGrid2 = _interopRequireDefault(_PoissonDiskSamplingGrid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.default = {
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
      default: function _default() {
        return _ShapesList2.default;
      },
      type: Array
    },
    rotation: {
      default: true,
      type: Boolean
    }
  },
  computed: {
    renderer: function renderer() {
      return new Three.WebGLRenderer({
        alpha: true,
        antialias: true
      });
    },
    camera: function camera() {
      var c = new _FixedFOVBackdropCamera2.default(this.rect.width, this.rect.height, 30, 0.1, 10000);

      c.onInit = function (env) {
        Common.centerObjectAtScroll(this);
        this.position.z = this.getDistance();
        this.updateProjectionMatrix();
      };

      c.onDraw = function (env) {
        Common.centerObjectAtScroll(this);
        this.updateProjectionMatrix();
      };

      return c;
    },
    scene: function scene() {
      return new Three.Scene();
    },
    axisHelper: function axisHelper() {
      return new _ThreeAxisIndicator2.default(500, 20, {
        colors: {
          origin: '#F2CE75',
          x: '#FC5A3C',
          y: '#0F9978',
          z: '#0F6899'
        }
      });
    },
    gridHelper: function gridHelper() {
      return new Three.GridHelper(10000, 100, 'red', 'silver');
    },
    JSONLoader: function JSONLoader() {
      return new Three.JSONLoader();
    },
    baseMaterial: function baseMaterial() {
      return new Three.MeshPhongMaterial({
        color: '#ffffff'
      });
    }
  },
  data: function data() {
    return {
      scroll: {
        top: 0,
        left: 0
      }
    };
  },
  methods: {
    onResize: function onResize(event) {
      this.rect = this.$el.getBoundingClientRect();
      this.updateSize();
      this.onDraw();
    },
    onScroll: function onScroll(event) {
      this.scroll = {
        top: window.scrollY,
        left: window.scrollX
      };
      this.onDraw();
    },
    onInit: function onInit(event) {
      var _this = this;

      this.scene.traverseVisible(function (o) {
        if (_.isFunction(o.onInit)) o.onInit(_this);
      });
      this.onDraw();
    },
    onDraw: function onDraw(event) {
      var _this2 = this;

      // Update simulation:
      this.scene.traverseVisible(function (o) {
        if (_.isFunction(o.onDraw)) o.onDraw(_this2);
      });
      this.renderer.render(this.scene, this.camera);
    },
    onFocus: function onFocus(event) {
      console.log('Window has been focused.', event);
    },
    getRect: function getRect() {
      return this.$el.getBoundingClientRect();
    },
    updateSize: function updateSize() {
      this.renderer.setSize(this.rect.width, this.rect.height);
      this.camera.aspect = this.rect.width / this.rect.height;
      this.camera.updateProjectionMatrix();
      this.onDraw();
    },
    loadShapes: function loadShapes() {
      var _this3 = this;

      return Promise.all(this.shapes.map(function (file) {
        return new Promise(function (resolve, reject) {
          _this3.JSONLoader.load(file, function (shape) {
            resolve(new Three.Mesh(shape, _this3.baseMaterial));
          });
        });
      }));
    },
    generateGrid: function generateGrid(gridShape) {
      return new _PoissonDiskSamplingGrid2.default(gridShape, 400, {
        maxDistance: 500
      });
    }
  },
  mounted: function mounted() {
    var _this4 = this;

    window.addEventListener('resize', this.onResize);
    window.addEventListener('scroll', this.onScroll);
    window.addEventListener('focus', this.onFocus);

    this.rect = this.$el.getBoundingClientRect();
    this.$el.appendChild(this.renderer.domElement);
    this.updateSize();
    this.$el.style.background = this.bgColor;
    this.scene.background = this.bgColor;

    // var geometry = new Three.BoxGeometry(100, 100, 100)

    var lighting = new Three.HemisphereLight(this.groundColor, this.skyColor, 1);

    this.camera.aspect = this.rect.width / this.rect.height;
    this.camera.updateProjectionMatrix();

    // this.scene.add(this.gridHelper)
    // this.scene.add(this.axisHelper)
    this.scene.add(lighting);
    this.scene.add(this.camera);

    var fieldPadding = 500;
    var gridShape = new Three.Vector3(Common.getDisplayWidth() + 2 * fieldPadding, Common.getDocumentHeight() + 2 * fieldPadding, 1000);

    Promise.all([this.loadShapes(), this.generateGrid(gridShape)]).then(function (components) {
      var meshes = components[0];
      var grid = components[1];
      var field = new Three.Object3D();

      grid.forEach(function (point, i) {
        var mesh = meshes[Common.randomIntBetween(0, meshes.length - 1)].clone();

        var group = new Three.Group();
        var r = Common.randomWithNegatives();
        group.rotation.set(r * Math.PI, r * Math.PI, r * Math.PI);
        group.position.set(point[0], point[1], point[2]);
        group.name = 'hmShape-' + i;
        mesh.scale.set(2, 2, 2);

        if (_this4.rotation) {
          var s = Common.randomWithNegatives();
          mesh.onDraw = function (env) {
            var r = s * (window.scrollY / 1000);
            this.rotation.set(r * Math.PI, r * Math.PI, r * Math.PI);
          };
        }

        group.add(mesh);
        field.add(group);

        field.position.set(-1 * fieldPadding, -1 * fieldPadding, 0);

        _this4.scene.add(field);
        _this4.onDraw();
      });
    });

    this.onDraw();
  },
  beforeDestroy: function beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('focus', this.onFocus);
  }
};
