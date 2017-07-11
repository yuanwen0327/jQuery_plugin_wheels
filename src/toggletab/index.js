var hook = '[data-role="toggleTab"]';
var activeClass = 'active';
var hideClass = 'tab-item-hide';
var clipClass = 'tab-item-clip';


function ToggleTab($ele, opts) {
  var self = this;
  this.$ele = $ele;
  this.$wrap = $($ele.data('for'));

  this.$tabs = this.$ele.children();
  this.$items = this.$wrap.children();

  this.options = $.extend({}, ToggleTab.DEFAULTS, this.$ele.data(), opts);


  // console.log(this.options);

  this.init();
}

ToggleTab.DEFAULTS = {
  hideType: 'display',
  event: 'click'
}

var fn = ToggleTab.prototype;

fn.init = function () {
  var self = this;




  if (this.options.hideType == "clip") {
    this.$wrap.css('position', 'relative');
    this.$items.addClass(clipClass)
  } else {
    this.$items.addClass(hideClass)
  }

  var initActiveIndex = this.$tabs.index(this.$tabs.filter('.' + activeClass));
  this.changeTab(initActiveIndex);

  this.$tabs.on(this.options.event == 'click' ?
    'click' :
    'mouseenter',
    function (e) {
      self.changeTab(self.$tabs.index($(this)))
      e.preventDefault();
    });

}


fn.changeTab = function (index) {
  if (index < 0) index = 0;
  if (index >= this.$tabs.length) index = this.$tabs.length - 1;

  this.$tabs
    .removeClass(activeClass)
    .eq(index)
    .addClass(activeClass);

  var resultTabClass = this.options.hideType == "display" ?
    hideClass :
    clipClass;

  this.$items
    .addClass(resultTabClass)
    .eq(index)
    .removeClass(resultTabClass);

  this.$ele.trigger('yw.tt.change', [index])
};

function Plugin(option) {
  return this.each(function () {
    var $this = $(this);
    var data = $this.data('yw.tt');
    var options = typeof option == 'object' ? option : {};

    if (!data) $this.data('yw.tt', (data = new ToggleTab($this, options)));

    if (typeof option === 'number') {
      data.changeTab(option);
    }
  })
}

var old = $.fn.toggleTab;

$.fn.toggleTab = Plugin;
$.fn.toggleTab.Constructor = ToggleTab;


// NO CONFLICT
// =====================

$.fn.toggleTab.noConflict = function () {
  $.fn.toggleTab = old
  return this
}

$(function () {
  Plugin.call($(hook));
})