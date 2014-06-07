var ChatProtocol = require('./chat-protocol')
var multiDgrams = require('multi-dgram-stream')

module.exports = ChatOnWire

function ChatOnWire(name, srcAddr, dstAddrs) {
  var wire = multiDgrams(srcAddr, dstAddrs)
  var chats = ChatProtocol(name, wire)
  return chats
}
