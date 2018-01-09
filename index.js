import * as _ from 'lodash'
import ScrollFade from 'scroll-fade'

export default {
  template: '<progress class="scroll-progress" :value="value" max="100">{{ Math.round(value) }}%</progress>',
  data: function () {
    return {
      value: 0
    }
  },
  mounted () {
    window.addEventListener('scroll', _.throttle(this.onScroll, 25))
    ScrollFade(this.$el, {
      fadeDuration: '50vh',
      fadeEasing: 'easeOutCubic'
    })
  },
  methods: {
    onScroll: function () {
      this.value = this.getScrollPercent().y * 100
      // console.log(this.data)
    },
    scrollMax: function () {
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
    },
    getScrollPercent: function () {
      let h = document.documentElement
      let w = window
      let yo = 'pageYOffset'
      let xo = 'pageXOffset'

      return {
        x: w[xo] / (this.scrollMax().x - h.clientWidth),
        y: w[yo] / (this.scrollMax().y - h.clientHeight)
      }
    }
  }
}