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

var data = require('../data/selected_land.json').features

var bg = body.c('rect').a({
	x: -2000, y: -2000, width: 5000, height: 5000, fill: color.sea
})

var projection = d3.geoMercator().scale(800).translate([700, 1500])
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

var landCp = defs.c('clipPath').a({ id: 'land-clippath-1'})
var landDef = defs.c('g').a({ id: 'land-def-1' })
data.forEach(function(d) {
	if(d.geometry) {
		landCp.c('path').a({d: path(d)})
		landDef.c('path').a({d: path(d)})
	}
})
var coast1 = body.c('use').a({ 
	id: 'coast-1', fill: 'none', 'xlink:href': '#land-def-1',
	stroke: color.coast, 'stroke-width': 22, 'stroke-linejoin': 'round'
})
var coast2 = body.c('use').a({ 
	id: 'coast-2', stroke: color.sea, 'xlink:href': '#land-def-1',
 'stroke-width': 20, 'stroke-linejoin': 'round'
})

var coast3 = body.c('use').a({ 
	id: 'coast-3', fill: 'none', 'xlink:href': '#land-def-1',
	stroke: color.coast, 'stroke-width': 11, 'stroke-linejoin': 'round'
})
var coast4 = body.c('use').a({ 
	id: 'coast-4', stroke: color.sea, 'xlink:href': '#land-def-1',
 'stroke-width': 9, 'stroke-linejoin': 'round'
})


var land0 = body.c('use').a({ 
	id: 'land-0', fill: 'none', 'xlink:href': '#land-def-1',
	stroke: color.coast, 'stroke-width': 2, 'stroke-linejoin': 'round'
})

var land = body.c('use').a({ 
	id: 'land', fill: color.land,
	'xlink:href': '#land-def-1', 'stroke-linejoin': 'round'})


var mapAreas = body.c('g').a({ id: 'map-areas' })
var raids = require('./raids')
mapAreas.c('path').a({
	d: raids,
	fill: color.raids,
	'clip-path': 'url(#land-clippath-1)'
})
var settlements = require('./settlements')
mapAreas.c('path').a({
	d: settlements,
	fill: color.settlements,
	'clip-path': 'url(#land-clippath-1)'
})
var origin = require('./origin')
mapAreas.c('path').a({
	d: origin,
	fill: color.origin,
	'clip-path': 'url(#land-clippath-1)'
})

var textBg = body.c('rect').a({
	x: 70, y: 520, width: 360, height: 230, fill: 'white'
})
var textG = body.c('g').a({ fill: color.label, transform: 'translate(-100,0)' })
var textData = require('./text-simpl')

textData.forEach(function(d) {
	textG.c('path').a({d: d[0]})
})

var leg = [
	[color.raids, 'Raids'],
	[color.settlements, 'Settlements'],
	[color.origin, 'Origin']
]

var legG = body.c('g').a({ 
	transform: 'translate(70, 800)',	'font-family': 'arial,helvetica,sans-serif', 
	'font-size': 30, fill: color.label 
})
leg.forEach(function(d, i) {
	legG.c('rect').a({ x: 0, y: 40*i, width: 50, height: 25, fill: d[0] })
	legG.c('text').a({ x: 60, y: 40*i + 25, stroke: 'white', 'stroke-width':2 }).d(d[1])
	legG.c('text').a({ x: 60, y: 40*i + 25 }).d(d[1])
})

fs.writeFile('map.svg', svg.outer(), 'utf-8', function() {
	console.log('Wrote 1_vikings/map.svg')
	fs.writeFile('map.html', '<html><body>' + svg.outer() + '</body></html>', 'utf-8', function() {
		console.log('Wrote 1_vikings/map.html')
	})
})




