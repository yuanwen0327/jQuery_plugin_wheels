module.exports = function () {
  var ctx = this;
  var nowTop = $(document).scrollTop();
  var $bn = $(ctx.options.bottomPoint + ':visible');
  //参考容器距离顶部的距离
  var BT = $bn.offset().top;
  //参考容器的高度
  var BH = $bn.outerHeight();
  //参考容器底部距离顶部的距离
  var BB = BT + BH;
  //浮动容器的高度
  var AH = ctx.$wrap.outerHeight();
  //浮动容器距离顶部的距离
  var AT = ctx.$wrap.offset().top;

  var floatPoint = ctx.$ele.offset().top - ctx.options.fixTop;

  var threshold =
    BB - ctx.options.fixTop - AH;


  if (nowTop < floatPoint) {
    //小于浮动点
    stop();
  } else if (nowTop < threshold) {
    //小于平移点
    start();
    ctx.$wrap
      .css('top', ctx.options.fixTop)
      .show();
  } else if (nowTop < BB) {
    //小于隐藏点
    start();
    switch (ctx.options.bottomEffect) {
      case 'offset':
        ctx.$wrap.css('top', -(AH + nowTop - BB));
        break;
      case 'hide':
        ctx.$wrap.hide();
        break;
    }
  } else {
    //大于隐藏点
    stop();
  }


  function stop() {
    if(!ctx.$wrap.hasClass('layout'))return;
    ctx.$wrap
      .removeClass('layout')
      .css("top", '');
  }

  function start() {
    !ctx.$wrap.hasClass('layout') && ctx.$wrap.addClass('layout')
  }
}