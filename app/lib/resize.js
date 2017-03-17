module.exports = function(svgs) {
	var book = document.getElementById('book')
	book.style.display = 'none'
		resize(svgs, function() {
			console.log('done resizing')
			book.style.display = 'block'
		})
}

function resize(svgs, callback) {
	var width = window.innerWidth
	var height = window.innerHeight
	var ratio = width/height
	if(ratio > 1) {
		var m = ((width-height)/2)/height*1000
		var vb = '-' + m + ' 0 ' + (1000+(m*2)) + ' 1000'

	} else {
		var m = ((height-width)/2)/width*1000
		var vb = '0 ' + ' -' + m + ' 1000 ' + (1000+(m*2))
	}
	svgs.forEach(function(svg) {
		svg.setAttribute('viewBox', vb)
	})
	callback()
}
