var fs = require('fs')
var msgproto = require('msgproto')
var ProtoMessage = msgproto.ProtoMessage

module.exports = ChatMessage

function ChatMessage(name, text, time) {
  if (!(this instanceof ChatMessage))
    return new ChatMessage(name, text, time)

  ProtoMessage.call(this, ['name', 'text', 'time'])
  this.name = name
  this.text = text
  this.time = time
}

msgproto.Message.inherits(ChatMessage, ProtoMessage)

var chatSrc = fs.readFileSync(__dirname + '/chat.proto', 'utf-8')
ChatMessage.codec = msgproto.ProtobufCodec.fromProtoSrc(chatSrc).Chat
