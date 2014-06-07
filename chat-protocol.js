var WireProtocol = require('msgproto').WireProtocol
var IntegrityProto = require('ipfs-msgproto-integrity')
var ChatMessage = require('./chat-message')
var transDuplex = require('duplex-transform')
var shuffle = require('shuffle-buffer')

module.exports = ChatProtocol

function ChatProtocol(name, wire) {
  wire = WireProtocol(IntegrityProto.Frame, wire)
  wire = IntegrityProto.Corrupt(0.3, wire)
  wire = IntegrityProto('sha1', ChatMessage, wire)
  wire.incoming.on('invalid', function(obj) {
    console.log('>> caught bad packet <<')
  })

  wire = transDuplex.obj(chatEncode, wire, chatDecode) // the chat
  return wire

  function chatEncode(text, enc, next) {
    var now = (new Date()).toISOString()
    var msg = ChatMessage(name, text, now)
    this.push(msg)
    next()
  }

  function chatDecode(msg, enc, next) {
    this.push(chatLine(msg))
    next()
  }

  function chatLine(msg) {
    return "[" + msg.time +"] " + msg.name + ": " + msg.text.trim() + "\n"
  }

}
