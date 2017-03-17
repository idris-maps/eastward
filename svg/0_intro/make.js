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

var layout = layoutCreater(true)
var body = layout.body
var svg = layout.svg
var defs = layout.defs

/*
var bg = body.c('rect').a({
	x: -2000, y: -2000, width: 5000, height: 5000, fill: color.sea
})
*/

fs.writeFile('map.svg', svg.outer(), 'utf-8', function() {
	console.log('Wrote 0_intro/map.svg')
	fs.writeFile('map.html', '<html><body>' + svg.outer() + '</body></html>', 'utf-8', function() {
		console.log('Wrote 0_intro/map.html')
	})
})




