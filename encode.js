var stream = require('stream')
var util = require('util')
var varint = require('varint')
var schema = require('./schema')

var pool = new Buffer(5012)
var used = 0

var encv = function(n) {
  if (pool.length - used < 50) {
    pool = new Buffer(5012)
    used = 0
  }
  varint.encode(n, pool, used)
  return pool.slice(used, used += varint.encode.bytes)
}

var Encoder = function() {
  if (!(this instanceof Encoder)) return new Encoder()

  stream.Transform.call(this, {objectMode:true, highWaterMark:16})
  this._readableState.objectMode = false
  this._readableState.highWaterMark = 16384
}

util.inherits(Encoder, stream.Transform)

Encoder.prototype._transform = function(data, enc, cb) {
  data = schema.encode(data)
  this.push(encv(data.length))
  cb(null, data)
}

module.exports = Encoder