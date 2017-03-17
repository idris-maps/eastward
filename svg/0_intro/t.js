var fs = require('fs')
var x = require('./map_2')

fs.writeFile('map.svg', x, 'utf-8', function() {
	console.log('done')
})

