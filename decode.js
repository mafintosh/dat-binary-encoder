var stream = require('stream')
var util = require('util')
var varint = require('varint')
var schema = require('./schema')

var Decoder = function() {
  if (!(this instanceof Decoder)) return new Decoder()

  stream.Transform.call(this, {objectMode:true, highWaterMark:16})
  this._writableState.objectMode = false
  this._writableState.highWaterMark = 16384

  this._header = new Buffer(50)
  this._buffer = null
  this._ptr = 0
  this._missing = 0
}

util.inherits(Decoder, stream.Transform)

Decoder.prototype._transform = function(data, enc, cb) {
  while (data && data.length) {
    if (this._missing) data = this._parseData(data)
    else data = this._parseHeader(data)
  }

  cb()
}

Decoder.prototype._parseData = function(data) {
  if (!this._buffer) {
    if (data.length === this._missing) {
      this._push(data)
      return null
    }
    if (data.length > this._missing) {
      var overflow = data.slice(0, this._missing)
      this._push(data.slice(0, this._missing))
      return overflow
    }
    this._buffer = new Buffer(this._missing)
    this._ptr = 0
  }

  if (data.length === this._missing) {
    data.copy(this._buffer, this._ptr)
    this._push(this._buffer)
    return null
  }

  if (data.length < this._missing) {
    data.copy(this._buffer, this._ptr)
    this._ptr += data.length
    this._missing -= data.length
    return null
  }

  var overflow = data.slice(this._missing)
  data.slice(0, this._missing).copy(this._buffer)
  this._push(this._buffer)
  return overflow
}

Decoder.prototype._push = function(data) {
  this._missing = 0
  this._ptr = 0
  this._buffer = null
  this.push(schema.decode(data))
}

Decoder.prototype._parseHeader = function(data) {
  for (var i = 0; i < data.length; i++) {
    this._header[this._ptr++] = data[i]
    if (!(data[i] & 0x80)) {
      this._ptr = 0
      this._missing = varint.decode(this._header)
      return data.slice(i+1)
    }
  }

  return null
}

module.exports = Decoder