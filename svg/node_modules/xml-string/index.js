var El = require('./lib/El')

exports.create = function(el) {
	var element = new El(el)
	return element
}
