var svg = require('./lib/svg')
var getSvgs = require('./lib/get-svgs')
var resize = require('./lib/resize')
var removeLoader = require('./lib/remove-loader')
var Siema = require('siema')
var app = { }

window.onload = function() {
	document.getElementById('book').innerHTML = svg
	setTimeout(function() {
		removeLoader(function() {
			app.svg = getSvgs()
			resize(app.svg)
			app.s = new Siema({selector: '#book'})
			window.onresize = function() { 
				resize(app.svg)
			}
			window.onkeyup = function(e) {
				var key = e.key
				if(key === 'ArrowRight') { app.s.next() }
				else if(key === 'ArrowLeft') { app.s.prev() }
			}
		})
	},1)
}

