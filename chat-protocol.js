var WireProtocol = require('msgproto').WireProtocol
var ChatMessage = require('./chat-message')
var transDuplex = require('duplex-transform')

module.exports = ChatProtocol

function ChatProtocol(name, wire) {
  var chats = WireProtocol(ChatMessage, wire)
  return transDuplex.obj(encode, chats, decode)

  function encode(text, enc, next) {
    var now = (new Date()).toISOString()
    var msg = ChatMessage(name, text, now)
    this.push(msg)
    next()
  }

  function decode(msg, enc, next) {
    this.push(chatLine(msg))
    next()
  }

  function chatLine(msg) {
    return "[" + msg.time +"] " + msg.name + ": " + msg.text.trim() + "\n"
  }
}
