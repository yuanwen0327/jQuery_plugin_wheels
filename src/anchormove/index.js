var throttle = require('lodash/function/throttle');
var drop = require('lodash/array/drop');
var last = require('lodash/array/last');

var getAnchorPoints = require('./util').getAnchorPoints;

//只检索可见列表项
var tabList = '[data-role="anchormove"]';
var anchor = '[data-anchor]';
var relDom = '[data-for]';


var Move = function ($element, options) {
  var self = this;
  this.$element = $element;
  //将可见的列表项保存起来，init方法会刷新此变量
  this.anchorList = [];
  // this.anchorList = [{
  //   $$cid: '#content1',
  //   $$activeNode:null
  // }]

  this.options = $.extend({}, Move.DEFAULTS, this.$element.data(), options);

  this.$scrollDom = $(this.options.target == 'body' ?
    window :
    this.options.target);

  this.init();

  //监听scoll事件
  this.$scrollDom.on('scroll', throttle(function () {
    setActive.call(self);
  }, 16.7))
};

Move.DEFAULTS = require('./default');

Move.prototype.init = function () {

  var self = this;


  //刷新列表项
  this.anchorList = [];

  this.$element
    .find(relDom)
    .each(generatorAnchor);

  function generatorAnchor(i) {
    var $anchor = $(this);
    var _id = $anchor.data('for');
    var $content = $(_id);


    //如果该标签是a，将href补上
    if (this.nodeName == "A") {
      $anchor.attr('href', _id)
    }


    //隐藏列表项被隐藏的列表项
    $content.show();
    if ($anchor.is(':hidden')) {
      $content.hide();
      return true;
    }

    //查找实际要添加class的元素，放到$list中
    var $activeEle = $anchor.parentsUntil(self.$element, anchor);

    //将信息保存到anchor集合里
    self.anchorList.push({
      $$cid: _id,
      $$activeNode: $activeEle.length ? $activeEle : $anchor
    });

    //重新绑定事件
    $anchor
      .off('click.goToScoll')
      .on('click.goToScoll', function (e) {
        self.moveTo(i);
        e.stopPropagation();
        e.preventDefault();
      });
  }

  //根据位置默认点亮一个列表项
  setActive.call(this);
};


Move.prototype.moveTo = function (index) {
  var self = this;
  var tops = getAnchorPoints.call(this, this.options.clickOffset)
  /**动画 有时间再做 */
  this.$scrollDom.scrollTop(tops[index]);
};

function setActive() {
  var self = this;
  var now = this.$scrollDom.scrollTop();
  var tops = getAnchorPoints.call(this, this.options.floatOffset);

  tops.push($(last(this.anchorList).$$cid).outerHeight() + last(tops));

  if (now < tops[0] || now > last(tops)) {
    cleanActiveState();
    return
  }

  for (var i = 0; i < tops.length; i++) {
    if (now >= tops[i] && now < tops[i + 1]) {
      addActiveState(this.anchorList[i], i);
      return;
    }
  }

  function addActiveState(item, index) {
    var $needActiveNode = item.$$activeNode;
    if (!$needActiveNode.hasClass(self.options.activeClass)) {
      cleanActiveState();
      $needActiveNode.addClass(self.options.activeClass);
      self.$element.trigger('yw.am.active', [index, item.$$cid]);
    }
  }

  function cleanActiveState() {
    $.each(self.anchorList, function () {
      this.$$activeNode.removeClass(self.options.activeClass)
    })
  }
};



function Plugin(option) {
  var args = drop(Array.prototype.slice.call(arguments));
  return this.each(function () {
    var $this = $(this);
    var data = $this.data('yw.am');
    var options = typeof option == 'object' ? option : {};

    if (!data) $this.data('yw.am', (data = new Move($this, options)));

    if (typeof option === 'string') {
      require('./methods')[option].apply(data, args)
    }
  })
}

var old = $.fn.anchormove;

$.fn.anchormove = Plugin;
$.fn.anchormove.Constructor = Move;


// NO CONFLICT
// =====================

$.fn.anchormove.noConflict = function () {
  $.fn.anchormove = old
  return this
}

$(document)
  .ready(function () {
    Plugin.call($(tabList))
  })