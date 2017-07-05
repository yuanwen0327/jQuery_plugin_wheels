var inAnim = require('../util').inAnim;
var stopAnim = require('../util').stopAnim;

module.exports = function (delta) {
  var ctx = this;
  var nav = ctx.$wrap;


  var floatPoint = typeof ctx.options.point == 'number' ?
    ctx.options.point :
    $(ctx.options.point).offset().top;

  //是否已显示
  var hasLayout = nav.hasClass('layout');

  //当前位置
  var nowTop = $(document).scrollTop();

  //向下滚动时delta为负数 上为正数
  if (nowTop < floatPoint) {
    //小于边界点
    stop();
  } else {
    //大于等于边界点
    if (delta > 0) {
      //如果向上滚动就显示
      up();
    } else if (delta < 0) {
      //向下滚动就不显示
      down();
    }

  }


  function stop() {
    if (!hasLayout) return;
    nav.finish();
    kill();
    inAnim(nav, false);
  }

  function down() {
    if (!hasLayout || inAnim(nav)) return;
    stopAnim(nav)
    inAnim(nav, true)
    nav
      .fadeOut(ctx.options.speed, function () {
        kill();
        inAnim(nav, false)
      });

  }

  function kill() {
    nav
      .removeClass('layout')
      .removeAttr("style");
  }

  function up() {
    if (hasLayout || inAnim(nav)) return;
    stopAnim(nav)
    nav.addClass('layout');
    inAnim(nav, true);
    nav.fadeIn(ctx.options.speed, function () {
      inAnim(nav, false);
    });
  }
}