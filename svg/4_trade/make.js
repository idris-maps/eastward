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

var bg = body.c('rect').a({
	x: -2000, y: -2000, width: 5000, height: 5000, fill: color.sea
})

var projection = d3.geoMercator().scale(1700).translate([-100, 2300])
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

var landCp = defs.c('clipPath').a({ id: 'land-clippath-4'})
var landDef = defs.c('g').a({ id: 'land-def-4' })
land.forEach(function(d) {
	if(d.geometry) {
		landCp.c('path').a({d: path(d)})
		landDef.c('path').a({d: path(d)})
	}
})

var coast1 = body.c('use').a({ 
	id: 'coast-1', fill: 'none', 'xlink:href': '#land-def-4',
	stroke: color.coast, 'stroke-width': 22, 'stroke-linejoin': 'round'
})
var coast2 = body.c('use').a({ 
	id: 'coast-2', stroke: color.sea, 'xlink:href': '#land-def-4',
 'stroke-width': 20, 'stroke-linejoin': 'round'
})

var coast3 = body.c('use').a({ 
	id: 'coast-3', fill: 'none', 'xlink:href': '#land-def-4',
	stroke: color.coast, 'stroke-width': 11, 'stroke-linejoin': 'round'
})
var coast4 = body.c('use').a({ 
	id: 'coast-4', stroke: color.sea, 'xlink:href': '#land-def-4',
 'stroke-width': 9, 'stroke-linejoin': 'round'
})


var land0 = body.c('use').a({ 
	id: 'land-0', fill: 'none', 'xlink:href': '#land-def-4',
	stroke: color.coast, 'stroke-width': 2, 'stroke-linejoin': 'round'
})

var land1 = body.c('use').a({ 
	id: 'land', fill: color.land,
	'xlink:href': '#land-def-4', 'stroke-linejoin': 'round'})


var areas = body.c('g').a({	'clip-path': 'url(#land-clippath-4)'})
var area = require('./map-areas')
areas.c('path').a({
	d: area.weapons,
	fill: color.origin
})
areas.c('path').a({
	d: area.amber,
	fill: color.settlements
})
areas.c('path').a({
	d: area.slaves,
	fill: color.raids
})

var arrowD = require('./arrows')
body.c('path').a({
	d: arrowD, fill: color.label, transform: 'translate(-50,0)', 'fill-opacity': 0.6,
	stroke: 'white'
})

var icon = require('./icon')
var iconG = body.c('g')
ic(iconG, icon.weapon, 350, 90)
ic(iconG, icon.amber, 470, 220)
ic(iconG, icon.timber, 745, 230)
ic(iconG, icon.fur, 745, 290)
ic(iconG, icon.honey, 745, 350)
ic(iconG, icon.slave, 745, 410)
ic(iconG, icon.glass, 940, 880)
ic(iconG, icon.jewell, 940, 940)
ic(iconG, icon.book, 880, 880)
ic(iconG, icon.silk, 880, 940)
ic(iconG, icon.spices, 820, 880)
ic(iconG, icon.wine, 820, 940)

var textBg = body.c('rect').a({
	x: 100, y: 520, width: 430, height: 320, fill: 'white'
})

var textG = body.c('g').a({ fill: color.label })
var textData = require('./text-simpl')
textData.forEach(function(d) {
	textG.c('path').a({d: d[0]})
})

fs.writeFile('map.svg', svg.outer(), 'utf-8', function() {
	console.log('Wrote 4_trade/map.svg')
	fs.writeFile('map.html', '<html><head><meta content="utf-8"></head><body>' + svg.outer() + '</body></html>', 'utf-8', function() {
		console.log('Wrote 4_trade/map.html')
	})
})

function ic(g, d, x, y) {
	var gg = g.c('g').a({ transform: 'translate(' + x + ',' + y + ')' })
	gg.c('circle').a({cx: 25, cy: 25, r: 25, fill: 'white', stroke: color.label, 'stroke-width': 2})
	gg.c('path').a({d: d, fill: color.label})
}
