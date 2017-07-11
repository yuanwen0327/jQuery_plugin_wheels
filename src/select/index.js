// 模拟select 袁文

// jq查询变量
var select = '[data-role="select"]'
// var input = '.select-input'
var title = '.select-input p'
var box = '.box-container'
var list = '.option-list'
var listBox = '.option-box'

// 属性变量
var optionClass = 'option-list'
var selected = 'data-selected'
var openClass = 'on'
var changedClass = 'hasChanged'

var Select = function ($element, options) {
  var self = this
  this.$element = $element
  this.box = $element.find(box)
  this.title = $element.find(title)
  // this.items = $element.find(list);
  this.listBox = $element.find(listBox)
  this.options = $.extend({}, Select.DEFAULTS, options)
  this.TIMER = null
  this.SCROLL = null

  self.globalCloseEvent()

  $element.on('click', title, function (e) {
    if ($element.prop('disabled')) return
    self.toggle('close', $(box).not(self.box))
    self.toggle()
    e.stopPropagation()
  })
  $element.on('click', list, function (e) {
    self.changeTitle(this)
    e.preventDefault()
  })
  // initScroll.call(self);
}

Select.DEFAULTS = {
  speed: 300, // 动画速度
  // delayHide: 2000, //是否开启列表自动隐藏，默认开启，时间为2000ms，关闭传入false
  moveList: false // 'first','hide'
}

Select.VERSION = '0.0.5'
/*
 * # 0.0.5 重写了开关盒子方法
 * */

// 将全局click事件独立出来，作为回调传入其它组件中
Select.prototype.globalCloseEvent = function () {
  var self = this
  $(document).on('click', function () {
    self.toggle('close', $(box))
  })
}

Select.prototype.changeTitle = function (l, hook) {
  var self = this
  var selectedData = {
    name: $(l).html(),
    val: $(l).data('val')
  }
  // 改title
  self.addTitle(selectedData.name)
  // 加钩子 可以控制加或不加
  if (hook !== false) hook = true
  // console.log(hook);
  hook && self.$element.addClass(changedClass)
  // 移动list[0]
  if (self.options.moveList === 'first') {
    $(l).insertBefore(self.$element.find(list).first())
  }

  // 暴露selected事件
  self.$element.trigger('selected', selectedData)

  // 加data-selected属性
  self.addSelected(l)
  // 关box
  self.toggle('close')
}

Select.prototype.addSelected = function (l) {
  this.$element.find(list).removeAttr(selected)
  $(l).attr(selected, true)
}

// Select.prototype.delayClose = function () {
//   var self = this;
//   self.$element.on('mouseenter', function (e) {
//     self.TIMER && clearTimeout(self.TIMER);
//     self.$element.one('mouseleave', function (e) {
//       self.TIMER = setTimeout(function () {
//         self.toggle('close')
//         // toggle(self.$element.find(box), true);
//       }, self.options.delayHide)
//     })
//   })
// }

Select.prototype.addOption = function (obj) {
  // var self = this
  if (!obj.name) return
  var $option = $('<li class="' + optionClass + '" data-val="' + obj.val + '">' + obj.name + '</li>')
  $option.appendTo(this.$element.find(listBox))
}

Select.prototype.removeOption = function () {
  this.$element.find(title).empty()
  this.$element.find(listBox).empty()
}
Select.prototype.addTitle = function (arg, hook) {
  var self = this
  switch (typeof arg) {
    case 'string':
      this.title.html(arg)
      break
    case 'number':
      var items = this.$element.find(list)
      var li = items[arg] ? items[arg] : items[items.length - 1]
      self.changeTitle($(li), hook)
      break
    case 'object':
      chooseItem.call(self, arg, hook)
      break
    default:
  }
}
Select.prototype.getValue = function () {
  var back = null
  this.$element.find(list).each(function () {
    if ($(this).attr(selected)) {
      back = {
        name: $(this).html(),
        val: $(this).attr('data-val')
      }
      return false
    }
  })
  return back
}

Select.prototype.toggle = function (stat, $box) {
  var self = this
  $box = $box || self.box
  var s = $box.parents(select)

  var method, classType

  switch (stat) {
    case 'open':
      method = 'slideDown'
      classType = 'addClass'

      break
    case 'close':
      method = 'slideUp'
      classType = 'removeClass'
      break
    default:
      method = 'slideToggle'
      classType = 'toggleClass'
  }

  $box[method](self.options.speed, function () {
    s[classType](openClass)
  })
}

// 一坨get方法
Select.prototype.get = function () {
  var self = this
  var lis = self.$element.find(list)
  var liHeight = lis.first().outerHeight(true)
  return {
    boxHeight: (function () {
      return lis.length * liHeight
    })(),
    wrapHeight: (function () {
      // todo 解耦
      return Math.min(lis.length, 5) * liHeight
    })()
  }
}

function chooseItem(obj, hook) {
  var self = this
  self.$element.find(list).each(function () {
    var $this = $(this)
    if (($this.html() === obj.name) || (obj.val && ($this.attr('data-val') === obj.val))) {
      self.changeTitle($this, hook)
    }
  })
}

function Plugin(option, arg, arg1) {
  return this.each(function () {
    var $this = $(this)
    var data = $this.data('yw.select')
    var options = typeof option === 'object' && option

    if (!data) $this.data('yw.select', (data = new Select($this, options)))

    switch (option) {
      case 'toggle':
        data.toggle()
        break
      case 'open':
        data.toggle(option)
        break
      case 'close':
        data.toggle(option)
        break
      case 'add':
        data.addOption(arg)
        break
      case 'remove':
        data.removeOption()
        break
      case 'title':
        data.addTitle(arg, arg1)
        break
    }
    // if (options.delayHide!=false ) data.delayClose()
  })
}

$.fn.selsim = Plugin
$.fn.selsim.Constructor = Select

$(document)
  .ready(function () {
    Plugin.call($(select))
  })
