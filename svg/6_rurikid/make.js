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

var layout = layoutCreater(true)
var body = layout.body
var svg = layout.svg
var defs = layout.defs

var bg = body.c('rect').a({
	x: -2000, y: -2000, width: 5000, height: 5000, fill: color.sea
})

var data = require('./data.json')

var rectsB1 = body.c('g').a({ transform: 'translate(-170,-130)', fill: 'none', stroke: 'white' })
var rectsB2 = body.c('g').a({ transform: 'translate(-170,-130)', fill: 'none', stroke: 'white' })
var rects = body.c('g').a({ transform: 'translate(-170,-130)', fill: color.land, stroke: 'white' })
var names = body.c('g').a({ 
	transform: 'translate(-170,-130)', 'font-size': 24, fill: color.label,
	'text-anchor': 'middle', 'font-family': 'arial, helvetica,sans-serif'
})
var crown = require('./crown')
var crownP = body.c('path').a({ 
	stroke: color.settlements, fill: 'none', 'stroke-width': 5, 'stroke-dasharray': '5,2',
	transform: 'translate(0,-5)', d: crown
})

var reignBg = body.c('g').a({ 
	transform: 'translate(-170,-130)', fill: color.settlements
})
var reign = body.c('g').a({ 
	transform: 'translate(-170,-130)', 'font-size': 20, fill: 'white',
	'text-anchor': 'middle', 'font-family': 'arial, helvetica,sans-serif'
})

var m = {x: 180, y: 160, w: 120, h: 100 }

data.forEach(function(d) {
	rectsB1.c('rect').a({
		x: (d.x * m.x)-5,
		y: (d.y * m.y)-5,
		width: m.w + 10,
		height: m.h + 10
	})
	rectsB2.c('rect').a({
		x: (d.x * m.x)-10,
		y: (d.y * m.y)-10,
		width: m.w + 20,
		height: m.h + 20
	})
	rects.c('rect').a({
		x: d.x * m.x,
		y: d.y * m.y,
		width: m.w,
		height: m.h
	})
	names.c('text').a({
		x: (d.x * m.x) + m.w/2,
		y: (d.y * m.y) + 30
	}).d(d.n)
	if(d.p) {
		reignBg.c('ellipse').a({
			cx: (d.x * m.x) + m.w/2,
			cy: (d.y * m.y) + 68,
			rx: 60,
			ry: 25
		})
		reign.c('text').a({
			x: (d.x * m.x) + m.w/2,
			y: (d.y * m.y) + 75
		}).d(d.p)
	}
})

var arrowL = body.c('g').a({ transform: 'translate(-170,-130)', stroke: color.origin })
arrowL.c('line').a({ x1: 420, x2: 420, y1: (m.y*1)+m.h+10, y2: (m.y*2)-10 })
arrowL.c('line').a({ x1: 420, x2: 420, y1: (m.y*2)+m.h+10, y2: (m.y*3)-10 })
arrowL.c('line').a({ x1: 420, x2: 420, y1: (m.y*3)+m.h+10, y2: (m.y*4)-10  })
arrowL.c('line').a({ x1: 240, x2: 240, y1: (m.y*3)+m.h+10, y2: (m.y*4)-10 })
arrowL.c('line').a({ x1: 600, x2: 600, y1: (m.y*3)+m.h+10, y2: (m.y*4)-10 })
arrowL.c('line').a({ x1: 240, x2: 600, y1: (m.y*3)+m.h+10, y2: (m.y*3)+m.h+10 }) // link
arrowL.c('line').a({ x1: 240, x2: 240, y1: (m.y*4)+m.h+10, y2: (m.y*5)-10 })
arrowL.c('line').a({ x1: 600, x2: 600, y1: (m.y*4)+m.h+10, y2: (m.y*5)-10 })
arrowL.c('line').a({ x1: 420, x2: 420, y1: (m.y*5)+m.h+10, y2: (m.y*6)-10 })
arrowL.c('line').a({ x1: 600, x2: 600, y1: (m.y*5)+m.h+10, y2: (m.y*6)-10 })
arrowL.c('line').a({ x1: 780, x2: 780, y1: (m.y*5)+m.h+10, y2: (m.y*6)-10 })
arrowL.c('line').a({ x1: 420, x2: 780, y1: (m.y*5)+m.h+10, y2: (m.y*5)+m.h+10 }) // link


var arrowH = body.c('g').a({ transform: 'translate(-170,-130)', fill: color.origin })
tri(arrowH, 420, (m.y*2)-10)
tri(arrowH, 420, (m.y*3)-10)
tri(arrowH, 240, (m.y*4)-10)
tri(arrowH, 420, (m.y*4)-10)
tri(arrowH, 600, (m.y*4)-10)
tri(arrowH, 240, (m.y*5)-10)
tri(arrowH, 600, (m.y*5)-10)
tri(arrowH, 420, (m.y*6)-10)
tri(arrowH, 600, (m.y*6)-10)
tri(arrowH, 780, (m.y*6)-10)

var textBg = body.c('rect').a({
	transform: 'translate(540, 70)', x: -15, y: -40, width: 460, height: 680, fill: 'white'
})

var textPath = body.c('g').a({fill: color.label, transform: 'translate(10,5)'})
var textData = require('./text-simpl')
textData.forEach(function(d) {
	textPath.c('path').a({d: d[0]})
})

fs.writeFile('map.svg', svg.outer(), 'utf-8', function() {
	console.log('Wrote 6_rurikid/map.svg')
	fs.writeFile('map.html', '<html><head><meta charset="utf-8"></head><body>' + svg.outer() + '</body></html>', 'utf-8', function() {
		console.log('Wrote 6_rurikid/map.html')
	})
})

function tri(g, x,y) {
	g.c('path').a({
		d: 'M0 0 L-7 -10 L7 -10 Z',
		transform: 'translate(' + x + ',' + y + ')'
	})
}
