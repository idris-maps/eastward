var layoutCreater = require('../lib/layout')
var fs = require('fs')
var d3 = require('d3-geo')
var pathParser = require('svg-path-parser')

var color = {
	sea: '#d7eef4',
	coast: 'white',//'#afdde9',
	land: '#afe9af',
	landCoast: '#87de87', 
	origin: '#d35f5f',
	settlements: '#ffb380',
	raids: '#ffe680',
	label: '#333333'
}

var layout = layoutCreater(false)
var body = layout.body
var svg = layout.svg
var defs = layout.defs

var data = require('../data/selected_land_2.json').features

var bg = body.c('rect').a({
	x: -2000, y: -2000, width: 5000, height: 5000, fill: color.sea
})

var projection = d3.geoMercator().scale(1000).translate([-100, 1400])
var pathOriginal = d3.geoPath().projection(projection)
function path(f) {
	var d = pathOriginal(f)
	var pathParts = pathParser(d)
	var str = ''
	pathParts.forEach(function(p) {
		var c = p.code
		if(p.x && p.y) {
			var x = Math.round(p.x)
			var y = Math.round(p.y)
			str = str + c + x + ',' + y
		} else { str = str + c }
	})
	return str
}

var landCp = defs.c('clipPath').a({ id: 'land-clippath-2'})
var landDef = defs.c('g').a({ id: 'land-def-2' })
data.forEach(function(d) {
	if(d.geometry) {
		landCp.c('path').a({d: path(d)})
		landDef.c('path').a({d: path(d)})
	}
})

var coast1 = body.c('use').a({ 
	id: 'coast-1', fill: 'none', 'xlink:href': '#land-def-2',
	stroke: color.coast, 'stroke-width': 22, 'stroke-linejoin': 'round'
})
var coast2 = body.c('use').a({ 
	id: 'coast-2', stroke: color.sea, 'xlink:href': '#land-def-2',
 'stroke-width': 20, 'stroke-linejoin': 'round'
})

var coast3 = body.c('use').a({ 
	id: 'coast-3', fill: 'none', 'xlink:href': '#land-def-2',
	stroke: color.coast, 'stroke-width': 11, 'stroke-linejoin': 'round'
})
var coast4 = body.c('use').a({ 
	id: 'coast-4', stroke: color.sea, 'xlink:href': '#land-def-2',
 'stroke-width': 9, 'stroke-linejoin': 'round'
})


var land0 = body.c('use').a({ 
	id: 'land-0', fill: 'none', 'xlink:href': '#land-def-2',
	stroke: color.coast, 'stroke-width': 2, 'stroke-linejoin': 'round'
})

var land = body.c('use').a({ 
	id: 'land', fill: color.land,
	'xlink:href': '#land-def-2', 'stroke-linejoin': 'round'})

var area = require('./area')

var mapAreas = body.c('g').a({ id: 'map-areas' })
mapAreas.c('path').a({
	d: area.abbasid,
	fill: color.settlements,
	'clip-path': 'url(#land-clippath-2)'
})
mapAreas.c('path').a({
	d: area.bysans,
	fill: color.raids,
	'clip-path': 'url(#land-clippath-2)'
})
mapAreas.c('path').a({
	d: area.scandinavia,
	fill: color.origin,
	'clip-path': 'url(#land-clippath-2)'
})

var labelUnder = body.c('g').a({ 
	'font-family': 'arial,helvetica,sans-serif', 'font-size': 40, stroke: 'white',
	'text-anchor': 'middle', fill: 'white', 'stroke-width': 2 })
labelUnder.c('text').a({ x: 420, y: 660 }).d('Bysantine Empire')
labelUnder.c('text').a({ x: 750, y: 800 }).d('Abbasid Caliphate')
var label = body.c('g').a({ 
	'font-family': 'arial,helvetica,sans-serif', 'font-size': 40,
	'text-anchor': 'middle', fill: color.label })
label.c('text').a({ x: 420, y: 660 }).d('Bysantine Empire')
label.c('text').a({ x: 750, y: 800 }).d('Abbasid Caliphate')

var textBg = body.c('rect').a({
	x: 305, y: 305, width: 500, height: 75, fill: 'white'
})
var textG = body.c('g').a({ fill: color.label, transform: 'translate(0,70)' })
var textData = require('./text')

textData.forEach(function(d) {
	textG.c('path').a({d: d[0] })
})

fs.writeFile('map.svg', svg.outer(), 'utf-8', function() {
	console.log('Wrote 2_bys_abbasid/map.svg')
	fs.writeFile('map.html', '<html><body>' + svg.outer() + '</body></html>', 'utf-8', function() {
		console.log('Wrote 2_bys_abbasid/map.html')
	})
})



