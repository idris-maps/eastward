module.exports = function() {
	var svgsArr = document.getElementsByTagName('svg')
	var svgs = []
	for(i=0;i<svgsArr.length;i++) { svgs.push(svgsArr[i]) }
	return svgs
}
