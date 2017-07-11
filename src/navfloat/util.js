  function inAnim($ele, isInAnim) {
    if (arguments.length == 1) {
      return $ele.data('inAnim')
    }
    $ele.data('inAnim', isInAnim)
  }

  function stopAnim($ele) {
    $ele.stop();
    inAnim($ele, false);
  }

  module.exports = {
    inAnim: inAnim,
    stopAnim: stopAnim
  }