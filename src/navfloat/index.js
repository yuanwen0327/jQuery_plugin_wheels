var throttle = require('lodash/function/throttle')

var showAside = require('./type/aside')
var showNav = require('./type/nav')

var wrap = '.float-wrap'
var Nav = function (eles, opt) {
  this.$ele = eles.length > 1 ? $(eles[0]) : eles
  this.defaults = {
    type: '',
    speed: 450,
    bottomPoint: null,
    bottomEffect: 'offset', // 'hide','none'
    point: null
  }
  this.options = $.extend({}, this.defaults, opt)
  this.$wrap = this.$ele.find(wrap)
}

Nav.prototype.init = function () {
  var self = this
  switch (this.options.type) {
    case 'aside':
      $(window).scroll(throttle(function () {
        showAside.call(self)
      }, 16))
      break
    case 'nav':
      var beforeTop = $(document).scrollTop()
      $(window).scroll(
        throttle(function () {
          var afterTop = $(document).scrollTop()
          var delta = beforeTop - afterTop
          beforeTop = afterTop
          showNav.call(self, delta)
        }, 100)
      )
      break
  }
  $(window).trigger('scroll')
}

$.fn.navfloat = function (opts) {
  return this.each(function () {
    new Nav($(this), opts).init()
  })
}
