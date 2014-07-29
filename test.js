var tape = require('tape')
var through = require('through2')
var enc = require('./')

var chunk = function() {
  return through(function(data, enc, cb) {
    while (data.length) {
      var n = ((Math.random() * data.length) | 0) + 1
      this.push(data.slice(0, n))
      data = data.slice(n)
    }
    cb()
  })
}

tape('encode + decode', function(t) {
  var e = enc.encode()
  var change = {
    key:'hello',
    from: 0,
    to: 1,
    change: 1,
    value: new Buffer('hello')
  }

  e.write(change)
  e.pipe(enc.decode()).on('data', function(data) {
    t.same(change, data)
    t.end()
  })
})

tape('encode + decode multi', function(t) {
  var e = enc.encode()
  var change = {
    key:'hello',
    from: 0,
    to: 1,
    change: 1,
    value: new Buffer('hello'),
    subset: 'meh'
  }

  e.write(change)
  e.write(change)
  e.write(change)
  e.write(change)
  e.end()

  e.pipe(enc.decode()).on('data', function(data) {
    t.same(change, data)
  }).on('end', function() {
    t.end()
  })
})


tape('encode + chunk + decode', function(t) {
  var e = enc.encode()
  var change = {
    key:'hello',
    from: 0,
    to: 1,
    change: 1,
    value: new Buffer('hello')
  }

  e.write(change)
  e.pipe(chunk()).pipe(enc.decode()).on('data', function(data) {
    t.same(change, data)
    t.end()
  })
})

tape('encode + chunk + decode multi', function(t) {
  var e = enc.encode()
  var change = {
    key:'hello',
    from: 0,
    to: 1,
    change: 1,
    value: new Buffer('hello')
  }

  e.write(change)
  e.write(change)
  e.write(change)
  e.write(change)
  e.end()

  e.pipe(chunk()).pipe(enc.decode()).on('data', function(data) {
    t.same(change, data)
  }).on('end', function() {
    t.end()
  })
})