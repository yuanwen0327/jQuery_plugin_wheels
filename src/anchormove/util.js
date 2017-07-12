/**
 * 获取所有content的offsetTop值
 * @param {Number} offset - 偏移量
 * @returns {Number[]} - 应用了偏移的offsetTop集合
 */
function getAnchorPoints(offset) {
  var tops = []
  $.each(this.anchorList, function () {
    tops.push($(this.$$cid).offset().top - offset)
  })
  return tops
};

module.exports = {
  getAnchorPoints: getAnchorPoints
}
