module.exports = function(el) {
	var element = new El(el)
	return element
}

function El(el) {
	var self = this
	self.el = el

	self.childs = []
	self.child = function(childEl) {
		var newChild = new El(childEl)
		self.childs.push(newChild)
		return newChild
	}
	self.c = function(childEl) {
		return self.child(childEl)
	}

	self.attrs = {}
	self.attr = function(o) { 
		self.attrs = o
	 return self 
	}
	self.a = function(o) {
		return self.attr(o)
	}

	self.content = undefined
	self.data = function(x) {
		self.content = x
	}
	self.d = function(x) {
		self.content = x
	}

	self.inner = function() {
		var str = ''
		self.childs.forEach(function(child) {
			str = str + child.outer()
		})	
		return str	
	}
	self.outer = function() {
		var str = '<' + self.el + attrString(self.attrs) + '>'
		if(self.content !== undefined) {
			str = str + self.content
		}
		str = str	+ self.inner() + '</' + self.el + '>'
		return str
	}
	return self
}

function attrString(o) {
	var str = ''
	for(k in o) {
		str = str + ' ' + k + '="' + o[k] + '"'
	}
	return str
}
