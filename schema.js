var protobuf = require('protocol-buffers')

module.exports = protobuf([{
  tag: 0,
  name: 'change',
  type: 'uint32'
}, {
  tag: 1,
  name: 'from',
  type: 'uint32'
}, {
  tag: 2,
  name: 'to',
  type: 'uint32'
}, {
  tag: 3,
  name: 'key',
  type: 'string'
}, {
  tag: 4,
  name: 'value',
  type: 'bytes'
}, {
  tag: 5,
  name: 'subset',
  type: 'string'
}])