var xml = require('xml-string')

module.exports = function(dev) {
	if(dev) { console.log('LAYOUT is in "dev" mode') }
	var svg = xml.create('svg')
	svg.a({
		viewBox: '0 0 1000 1000',
		xmlns: 'http://www.w3.org/2000/svg',
		'xmlns:xlink': 'http://www.w3.org/1999/xlink'
	})
	var defs = svg.c('defs')
	if(dev) {
		var guidelines = svg.c('g').a({ id: 'guidelines' })
		var bg = guidelines.c('rect').a({
			id: 'background',
			x: -2000, y: -2000, width: 5000, height: 5000, fill: 'none', stroke: 'black'
		})
		var frame = guidelines.c('rect').a({
			id: 'frame',
			x: 0, y: 0, width: 1000, height: 1000, fill: 'none', stroke: 'black'
		})
	}
	var body = svg.c('g').a({id: 'body'})
	if(dev) {
		return {
			svg: svg,
			defs: defs,
			body: body,
			bg: bg,
			frame: frame
		}
	} else {
		return {
			svg: svg,
			defs: defs,
			body: body
		}	
	}
}
