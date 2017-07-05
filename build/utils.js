var path = require('path')
var glob = require('glob')

exports.getEntry = function (globPath) {
  var entries = {},
    basename, tmp, pathname

  glob.sync(globPath).forEach(function (entry) {
    basename = path.basename(entry, path.extname(entry))
    tmp = entry.split('/').splice(-3)
    pathname = tmp.splice(1, 1).toString().toLowerCase()
    entries[pathname] = entry
  })
  return entries
}

