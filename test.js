const jsdom = require('jsdom').jsdom

global.document = jsdom('<!doctype html><html><body></body></html>')
global.window = document.defaultView
global.navigator = global.window.navigator

var media = require('./')
var test = require('tape')

test('a bare-bones <audio> and <video> abstraction', function (t) {
  t.equal(media.audio().nodeName, 'AUDIO')
  t.equal(media.video().nodeName, 'VIDEO')

  var audio = media.audio('foo/bar.mp3', {
    loop: true,
    controls: true,
    volume: 0.5,
    crossOrigin: 'Anonymous'
  })
  t.equal(audio.getAttribute('loop'), 'loop')
  t.equal(audio.getAttribute('controls'), 'controls')
  t.equal(audio.getAttribute('volume'), '0.5')
  t.equal(audio.getAttribute('crossorigin'), 'Anonymous')
  t.equal(audio.childNodes[0].nodeName, 'SOURCE')
  t.equal(audio.childNodes[0].getAttribute('src'), 'foo/bar.mp3')
  t.equal(audio.childNodes[0].getAttribute('type'), 'audio/mpeg')

  audio = media.audio([ 'foo/bar.mp3', 'foo/bar.wav' ])
  t.equal(audio.childNodes[0].getAttribute('type'), 'audio/mpeg')
  t.equal(audio.childNodes[1].getAttribute('type'), 'audio/wav')

  var customType = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2'
  var sourceElement = document.createElement('source')
  sourceElement.src = 'foo/bar.wav'
  audio = media.audio([ {
    src: 'foo/bar.mp3',
    type: customType
  }, sourceElement ])
  t.equal(audio.childNodes[0].getAttribute('type'), customType)
  t.equal(audio.childNodes[0].getAttribute('src'), 'foo/bar.mp3')
  t.equal(audio.childNodes[1].src, 'foo/bar.wav')
  t.end()
})
