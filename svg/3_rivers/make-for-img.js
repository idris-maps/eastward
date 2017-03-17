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

var land = require('../data/selected_land.json').features
var rivers = require('../data/rivers_fixed.json').features
var lakes = require('../data/selected_lakes_10%.json').features
var routes = require('../data/routes.json').features

var bg = body.c('rect').a({
	x: -2000, y: -2000, width: 5000, height: 5000, fill: color.sea
})

var projection = d3.geoMercator().scale(1300).translate([-200, 1900])
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

var landCp = defs.c('clipPath').a({ id: 'land-clippath-3'})
var landDef = defs.c('g').a({ id: 'land-def-3' })
land.forEach(function(d) {
	if(d.geometry) {
		landCp.c('path').a({d: path(d)})
		landDef.c('path').a({d: path(d)})
	}
})

var coast1 = body.c('use').a({ 
	id: 'coast-1', fill: 'none', 'xlink:href': '#land-def-3',
	stroke: color.coast, 'stroke-width': 22, 'stroke-linejoin': 'round'
})
var coast2 = body.c('use').a({ 
	id: 'coast-2', stroke: color.sea, 'xlink:href': '#land-def-3',
 'stroke-width': 20, 'stroke-linejoin': 'round'
})

var coast3 = body.c('use').a({ 
	id: 'coast-3', fill: 'none', 'xlink:href': '#land-def-3',
	stroke: color.coast, 'stroke-width': 11, 'stroke-linejoin': 'round'
})
var coast4 = body.c('use').a({ 
	id: 'coast-4', stroke: color.sea, 'xlink:href': '#land-def-3',
 'stroke-width': 9, 'stroke-linejoin': 'round'
})


var land0 = body.c('use').a({ 
	id: 'land-0', fill: 'none', 'xlink:href': '#land-def-3',
	stroke: color.coast, 'stroke-width': 2, 'stroke-linejoin': 'round'
})

var land1 = body.c('use').a({ 
	id: 'land', fill: color.land,
	'xlink:href': '#land-def-3', 'stroke-linejoin': 'round'})

var riversDef = defs.c('g').a({ id: 'rivers-def' })
rivers.forEach(function(f) {
	riversDef.c('path').a({
		d: path(f)
	})
})

var rivers0 = body.c('use').a({
		fill: 'none',
		'stroke-linejoin': 'round',
		stroke: 'white',
		'stroke-width': 5,
		'xlink:href': '#rivers-def',
		'clip-path': 'url(#land-clippath-3)'
})



var lakesDef = defs.c('g').a({ id: 'lakes-def' })
lakes.forEach(function(f) {
	lakesDef.c('path').a({
		d: path(f)
	})
})

var lakes0 = body.c('use').a({
		fill: 'none',
		'stroke-linejoin': 'round',
		stroke: 'white',
		'stroke-width': 2,
		'xlink:href': '#lakes-def'
})

var rivers1 = body.c('use').a({
		fill: 'none',
		'stroke-linejoin': 'round',
		stroke: color.sea,
		'stroke-width': 3,
		'xlink:href': '#rivers-def',
		'clip-path': 'url(#land-clippath-3)'
})
var lakes1 = body.c('use').a({
		fill: color.sea,
		'xlink:href': '#lakes-def'
})

var routesG = body.c('g').a({
	id: 'routes',
	fill: 'none',
	stroke: color.origin,
	'stroke-width': 3,
	'stroke-dasharray': '10 10',
	'stroke-linejoin': 'round',
})
routes.forEach(function(f) {
	routesG.c('path').a({
		d: path(f)
	})
})
/*
var riverNames = body.c('g').a({
	'font-family': 'arial,helvetica,sans-serif', 'font-weight': 'bold',
	'font-size': 25, fill: color.origin, 'text-anchor': 'middle'
})
riverNames.c('text').a({
	x: 560, y: 590, transform: 'rotate(33, 560, 590)'
}).d('DNIEPER')
riverNames.c('text').a({
	x: 800, y: 590, transform: 'rotate(-68, 800, 590)'
}).d('VOLGA')

var destinations = body.c('g').a({ 
	'font-family': 'arial,helvetica,sans-serif', 
	'font-size': 30, fill: color.label, 'text-anchor': 'middle' 
})
destinations.c('text').a({x: 560, y: 900, 'stroke-width': 2, stroke: 'white'}).d('to Constantinople')
destinations.c('text').a({x: 900, y: 920, 'stroke-width': 2, stroke: 'white'}).d('to Baghdad')
destinations.c('text').a({x: 560, y: 900}).d('to Constantinople')
destinations.c('text').a({x: 900, y: 920}).d('to Baghdad')

var textBg = body.c('rect').a({
	x: 40, y: 500, width: 425, height: 130, fill: 'white'
})
var textG = body.c('g').a({ fill: color.label, transform: 'translate(0,0)' })
var textData = require('./text')

textData.forEach(function(d) {
	textG.c('path').a({d: d[0]})
})
*/
fs.writeFile('img.svg', svg.outer(), 'utf-8', function() {
	console.log('Wrote 3_rivers/img.svg')
	fs.writeFile('img.html', '<html><body>' + svg.outer() + '</body></html>', 'utf-8', function() {
		console.log('Wrote 3_rivers/img.html')
	})
})
