# xml-string

Utility to create XML strings. Can be used to write any XML based files such as SVG, HTML or GPX.

## Install

```
$ npm install xml-string
```

## Usage

```
var xmlString = require('xml-string')
```

### .create()

```
var svg = xmlString.create('svg')
```

### .child()

Append a child element

```
var svg = xmlString.create('svg')
var g = svg.child('g')
```

### .attr()

Add attributes

```
var svg = xmlString.create('svg')
var g = svg.child('g')
g.attr({id:'group'})
```

### .data()

Add data

```
var svg = xmlString.create('svg')
var g = svg.child('g')
g.attr({id:'group'})
var text = g.child('text')
text.data('Hello world')
```

### .outer()

Returns the XML string

```
var svg = xmlString.create('svg')
var g = svg.child('g')
g.attr({id:'group'})
var text = g.child('text')
text.data('Hello world')

console.log(svg.outer())
// returns
// '<svg><g id="group"><text>Hello world</text></g></svg>'
```

## Aliases

- **.child()** > **.c()**
- **.attr()** > **.a()**
- **.data()** > **.d()**

Example:

```
var svg = xmlString.create('svg')
var g = svg.c('g')
g.a({id:'group'})
var text = g.c('text')
text.d('Hello world')

console.log(svg.outer())
// returns
// '<svg><g id="group"><text>Hello world</text></g></svg>'
```


