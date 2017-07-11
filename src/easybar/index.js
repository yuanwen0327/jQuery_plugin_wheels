/**
 * 滚动条
 * Created by yuanwen on 2016/11/10.
 */

+
  (function ($) {
    'use strict';

    //变量
    var noSelect = 'noSelect';

    var addScrollEvent = function ($ele, callback) {
      //兼容ff

      $ele
        .off('mousewheel DOMMouseScroll')
        .on('mousewheel DOMMouseScroll', function (e) {
          //向下滚时返回true
          callback(e.originalEvent.wheelDelta ? e.originalEvent.wheelDelta < 0 : e.originalEvent.detail > 0);
          e.preventDefault();
        })
    };

    var Bar = function ($element, options) {
      var self = this;
      this.$ele = $element;
      this.options = $.extend({}, Bar.DEFAULTS, options);

      this.$wrap = this.$ele.is($(this.options.node.wrap)) ?
        this.$ele :
        this.$ele.find(this.options.node.wrap);
      this.$content = this.$wrap.find(this.options.node.content);
      this.$bar = this.$ele.find(this.options.node.bar);
      this.$point = this.$bar.find(this.options.node.point);


      // console.log(this.contentHeight,this.wrapHeight,this.$wrap)
      //如果高度还是不存在，说明是隐藏元素（display:none）
      //方法一 clone一个元素 设置position:absolute并将其移入body，设置vidibility为hidden，再获取高度
      //使用了actual插件
      this.contentHeight = this.options.contentHeight||this.$content.actual('height');
      this.wrapHeight = this.options.wrapHeight||this.$wrap.actual('height');



      this.update();

    };

    Bar.DEFAULTS = {
      wheelEvent: true,
      clickEvent: true,
      touchEvent: true
    };

    Bar.VERSION = '0.0.1';

    var fn = Bar.prototype;

    fn.update = function (opts) {
      var self=this;


      if (opts) {
        this.contentHeight = opts.contentHeight;
        this.wrapHeight = opts.wrapHeight;
      }
      // console.log(this.wrapHeight,this.contentHeight,this.$wrap);

      //不显示滚动条
      if(this.contentHeight<=this.wrapHeight) return;

      this.pointHeight = Math.pow(this.wrapHeight, 2) / this.contentHeight;
      this.ratio = this.contentHeight / this.wrapHeight;//比值
      //设置滚动条高度
      this.$point.height(this.pointHeight + "px");

      this.$bar.show();

      //事件绑定
      if (self.options.wheelEvent) {
        addScrollEvent(this.$wrap, function (isDown) {
          self.roll(isDown, 10);
        })
      }

      if (self.options.clickEvent) {
        this.$point
          .off('mousedown')
          .on('mousedown', function () {
            bindEvent.call(self);
            //阻止文字被选中
            return false;
          })
      }
    };

    fn.reset = function () {
      this.$point.css('top', 0);
      this.$content.css('top', 0);
    };

    fn.hide = function () {
      this.$bar.hide();
    }

    fn.reBindEvent = function () {
    }

    fn.roll = function (isDown, speed) {
      var self = this;
      var now = parseInt(self.$point.css('top')) + (isDown ? speed : -speed);
      var max = self.wrapHeight - self.pointHeight;
      // console.log(now,max);
      now = now <= 0 ? 0 : now > max ? max : now;
      // console.log(now);
      self.$point.css('top', now);
      self.$content.css('top', -now * self.ratio);
    };


    function bindEvent() {
      var self = this;
      var temp = 0;
      $(document).off('click');

      $(document).on('mousemove', function (e) {
        _move(e);
        //阻止文字被选中
        e.preventDefault();
      })

      $(document).on('click', _end)
      $(document).on('mouseup', _end)

      function _move(e) {
        $("body").addClass(noSelect);
        var Y = Math.round(e.pageY);
        var x = temp == 0 ? 0 : (temp - Y);
        temp = Y;
        // console.log(x)
        self.roll(temp < 0, x);
      }

      function _end(e) {
        $("body").removeClass(noSelect);
        temp = 0;
        $(document).off("mousemove");
        $(document).off("mouseup");
        //重新绑回全局click
        //兼容ff
        if (e.type == 'click') {
          self.reBindEvent();
        }
      }
    }

    function Plugin(option, arg) {
      return this.each(function () {
        var $this = $(this);
        var data = $this.data('yw.easybar');
        var options = typeof option == 'object' && option;

        if (!data) $this.data('yw.easybar', (data = new Bar($this, options)));


        switch (option) {
          case 'reset':
            data.reset();
            break;
        }
      })
    }

    $.fn.easybar = Plugin;
    $.fn.easybar.Constructor = Bar;


  })(window.jQuery);
