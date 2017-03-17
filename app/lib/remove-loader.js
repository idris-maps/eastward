

module.exports = function(callback) {
	var el = document.getElementById('load')
	el.parentElement.removeChild(el)
	callback()
}
