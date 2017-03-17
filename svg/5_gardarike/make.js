var layoutCreater = require('../lib/layout')
var fs = require('fs')
var d3 = require('d3-geo')
var pathParser = require('svg-path-parser')
var simpl = require('svg-path-simplifier')

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
var cities = require('../data/cities')


var bg = body.c('rect').a({
	x: -2000, y: -2000, width: 5000, height: 5000, fill: color.sea
})


var projection = d3.geoMercator().scale(1800).translate([-400,2500])
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

var landCp = defs.c('clipPath').a({ id: 'land-clippath-5'})
var landDef = defs.c('g').a({ id: 'land-def-5' })
land.forEach(function(d) {
	if(d.geometry) {
		landCp.c('path').a({d: path(d)})
		landDef.c('path').a({d: path(d)})
	}
})

var coast1 = body.c('use').a({ 
	id: 'coast-1', fill: 'none', 'xlink:href': '#land-def-5',
	stroke: color.coast, 'stroke-width': 22, 'stroke-linejoin': 'round'
})
var coast2 = body.c('use').a({ 
	id: 'coast-2', stroke: color.sea, 'xlink:href': '#land-def-5',
 'stroke-width': 20, 'stroke-linejoin': 'round'
})
var coast3 = body.c('use').a({ 
	id: 'coast-3', fill: 'none', 'xlink:href': '#land-def-5',
	stroke: color.coast, 'stroke-width': 11, 'stroke-linejoin': 'round'
})
var coast4 = body.c('use').a({ 
	id: 'coast-4', stroke: color.sea, 'xlink:href': '#land-def-5',
 'stroke-width': 9, 'stroke-linejoin': 'round'
})


var land0 = body.c('use').a({ 
	id: 'land-0', fill: 'none', 'xlink:href': '#land-def-5',
	stroke: color.coast, 'stroke-width': 2, 'stroke-linejoin': 'round'
})
var land1 = body.c('use').a({ 
	id: 'land', fill: color.land,
	'xlink:href': '#land-def-5', 'stroke-linejoin': 'round'})

var areaD = require('./map-area')
body.c('path').a({
	d: areaD,
	fill: color.settlements,
	'clip-path': 'url(#land-clippath-5)'
})

var riversDef = defs.c('g').a({ id: 'rivers-def-5' })
rivers.forEach(function(f) {
	riversDef.c('path').a({
		d: path(f)
	})
})
var lakesDef = defs.c('g').a({ id: 'lakes-def-5' })
lakes.forEach(function(f) {
	lakesDef.c('path').a({
		d: path(f)
	})
})
var rivers0 = body.c('use').a({
		fill: 'none',
		'stroke-linejoin': 'round',
		stroke: 'white',
		'stroke-width': 3,
		'xlink:href': '#rivers-def-5',
		'clip-path': 'url(#land-clippath-5)'
})
var lakes0 = body.c('use').a({
		fill: 'none',
		'stroke-linejoin': 'round',
		stroke: 'white',
		'stroke-width': 2,
		'xlink:href': '#lakes-def-5'
})
var rivers1 = body.c('use').a({
		fill: 'none',
		'stroke-linejoin': 'round',
		stroke: color.sea,
		'stroke-width': 1,
		'xlink:href': '#rivers-def-5',
		'clip-path': 'url(#land-clippath-5)'
})
var lakes1 = body.c('use').a({
		fill: color.sea,
		'xlink:href': '#lakes-def-5'
})

var cityCircleBg = body.c('g').a({ fill: color.label, 'stroke-width': 2, stroke: 'white' })
var cityCircle = body.c('g').a({ fill: color.label })
var cityNameBg = body.c('g').a({ 
	fill: color.label, 'font-family': 'arial, helvetica, sans-serif', stroke: 'white',
	'text-anchor': 'end', 'font-size': 30, transform: 'translate(-10, 5)', 'stroke-width': 2
})
var cityName = body.c('g').a({ 
	fill: color.label, 'font-family': 'arial, helvetica, sans-serif', 
	'text-anchor': 'end', 'font-size': 30, transform: 'translate(-10, 5)'
})
var cityNameS = body.c('g').a({ 
	fill: color.label, 'font-family': 'arial, helvetica, sans-serif', 
	'text-anchor': 'start', 'font-size': 18, transform: 'translate(10, 2)'
})
cities.features.forEach(function(f) {
	var p = projection(f.geometry.coordinates)
	cityCircleBg.c('circle').a({ cx: p[0], cy: p[1], r: 3 })
	cityCircle.c('circle').a({ cx: p[0], cy: p[1], r: 3 })
	cityNameBg.c('text').a({ x: p[0], y: p[1] }).d(f.properties.name)
	cityName.c('text').a({ x: p[0], y: p[1] }).d(f.properties.name)
	cityNameS.c('text').a({ x: p[0], y: p[1] }).d(slavic(f.properties.wiki))
})

var textBg = body.c('rect').a({
	fill: 'white', x: 125, y: 800, width: 710, height: 115
})
var textG = body.c('g').a({fill: color.label, transform: 'translate(65, 7)'})
var textData = require('./text-simpl')
textData.forEach(function(d) {
	textG.c('path').a({d: d[0] })
})


fs.writeFile('map.svg', svg.outer(), 'utf-8', function() {
	console.log('Wrote 5_gardarike/map.svg')
	fs.writeFile('map.html', '<html><head><meta charset="utf-8"></head><body>' + svg.outer() + '</body></html>', 'utf-8', function() {
		console.log('Wrote 5_gardarike/map.html')
	})
})

function slavic(n) {
	var s = n.split('_')
	if(s.length === 2) { return '(' + s[0] + ' ' + s[1] + ')' }
	else { return '(' + n + ')' }
}
