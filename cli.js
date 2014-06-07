#!/usr/bin/env node
var _ = require('underscore')
var transDuplex = require('duplex-transform')
var dgramChat = require('./index')
var charm = require('charm')()

var str2int = function(s) { return parseInt(s, 10) }

var args = process.argv.slice(2)
var name = args[0]
var srcAddr = args[1]
var dstAddrs = args.slice(2)
var prompt = '> ' + name + ': '

if (!srcAddr || !dstAddrs || !name) {
  console.log('Usage: msgproto-dgram-chat <name> <src-addr> <dst-addrs>...')
  console.log('')
  console.log('Try running two instances, talking to each other:')
  console.log('')
  console.log('  In one terminal:  dgram-chat eve :1234 :2345 :3456')
  console.log('  In another one:   dgram-chat bob :2345 :3456 :1234')
  console.log('  And in one more:  dgram-chat sam :3456 :2345 :1234')
  process.exit(-1)
}

function readLine(line, enc, next) {
  charm.up(1).erase('line')
  this.push(new Buffer(line.toString().trim()))
  charm.write(prompt)
  next()
}

function writeLine(line, enc, next) {
  charm.up(1).erase('line')
  charm.left(prompt.length).write(line) // no line break
  charm.erase('line')
  charm.down(1).erase('line')
  charm.write(prompt)
  this.push(line)
  next()
}

var chats = dgramChat(name, srcAddr, dstAddrs.concat([srcAddr]))
var stream = transDuplex.obj(readLine, chats, writeLine)

process.stdin.pipe(stream)
charm.pipe(process.stdout)

charm.down(1).write(prompt)
