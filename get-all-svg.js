var fs = require('fs')

getFolders(function(folders) {
	loop(0, folders, '', function(str) {
		fs.writeFile('./app/lib/svg.js', 'module.exports = \'' + str + '\'', 'utf-8', function() {
			console.log('done')
		})
	})
})


function loop(i, folders, str, callback) {
	if(i === folders.length) { callback(str) }
	else {
		console.log('./svg/' + folders[i] + '/map.svg')
		fs.readFile('./svg/' + folders[i] + '/map.svg', 'utf-8', function(err, file) {
			str = str + file
			loop(i+1, folders, str, callback)
		})
	}
}

function getFolders(callback) {
	fs.readdir('svg', function(err, list) {
		var svgFolders = []
		list.forEach(function(d) {
			var s = d.split('_')	
			if(!isNaN(s[0])) { svgFolders.push(d) }
		})
		callback(svgFolders)
	})
}
