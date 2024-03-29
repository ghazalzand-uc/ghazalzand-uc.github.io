window.Ohmni = new function() {

  this._events_handler = {};

  this.sendJsonCmd = function(jsonData) {
    let message = { type: "OhmniAPI", command: "jsoncmd", jsondata : jsonData };
    window.parent.postMessage(message, '*');
  }

  this.requestBotInfo = function() {
    const jsondata = { cmd: "requestBotInfo" };
    const message = { type: "OhmniAPI", command: "jsoncmd", jsondata : jsondata };
    window.parent.postMessage(message, '*');
  }

  this.setLightColor = function(hx, sx, vx) {
    var h = Math.floor(hx * 255.0 / 360.0 );
    var s = Math.floor(sx * 255.0 / 100.0 );
    var v = vx;
    let jsondata = { cmd: "setLightColor", h: h, s: s, v: v };
    this.sendJsonCmd(jsondata)
  }

  this.setNeckTorqueEnabled = function(enable) {
    let jsondata = { cmd: "setNeckTorqueEnabled", en: enable };
    this.sendJsonCmd(jsondata);
  }

  this.setNeckPosition = function(pos, ival) {
    let jsondata = { cmd: "setNeckPosition", pos: pos, ival: ival };
    this.sendJsonCmd(jsondata);
  }

  this.move = function(lspeed, rspeed, time) {
    let jsondata = { cmd: "move", lspeed: lspeed, rspeed: rspeed, time: time };
    this.sendJsonCmd(jsondata);
  }

  this.clickToLook = function(x, y) {
    var w = window.innerWidth;
    var h = window.innerHeight;
    let message = { type: "OhmniAPI", command: "clicklook", clicklookdata : { offsetX: x, offsetY: y, width: w, height: h } };
    window.parent.postMessage(message, '*');
  }

  this.showPageOnBot = function(url) {
    let message = { type: "OhmniAPI", command: "pageOnBot", pageInfo : { url: url }};
    window.parent.postMessage(message, '*');
  }

  this.hidePageOnBot = function() {
    this.showPageOnBot("about:blank");
  }

  this.captureVideo = (width = 300, height = 150) => {
    let message = { type: "OhmniAPI", command: "captureVideo", resolution: { width, height } };
    window.parent.postMessage(message, '*');
  };

  this.captureAudio = () => {
    let message = { type: "OhmniAPI", command: "captureAudio" };
    window.parent.postMessage(message, '*');
  };

  this.stopCaptureAudio = () => {
    let message = { type: "OhmniAPI", command: "stopCaptureAudio" };
    window.parent.postMessage(message, '*');
  };

  this.setBotVolume = (botVolume) => {
    let message = { type: "OhmniAPI", command: "setBotVolume", botVolume };
    window.parent.postMessage(message, '*');
  }

  this.getBotVolume = () => {
    let message = { type: "OhmniAPI", command: "getBotVolume" };
    window.parent.postMessage(message, '*');
  }

  this.on = function(event, handler) {
    this._events_handler[event] = handler;
  }

  this.emit = function(ename) {
    if (this._events_handler[ename] != null) {
      this._events_handler[ename].apply(null, Array.from(arguments).slice(1));
    }
  }
}

var normalizeEvent = function(event) {
  if (!event.offsetX) {
		event.offsetX = e.touches[0].pageX - e.touches[0].target.offsetLeft;
		event.offsetY = e.touches[0].pageY - e.touches[0].target.offsetTop;
  }
  return event;
};

var handleStart = (e) => {
  e = normalizeEvent(e);
  if (e.target.attributes['data-external'] != null) return;
  Ohmni.clickToLook(e.offsetX, e.offsetY);
}

document.addEventListener("touchstart", handleStart, false);

document.addEventListener("click", handleStart, false);

window.addEventListener('message', function(event) {
  if (!document.referrer.startsWith(event.origin)) return;
  switch (event.data.type) {
    case 'capi':
      var msg = event.data.jsonmsg
      Ohmni.emit('capi', msg);
      break;

    case 'cdata':
      var msg = event.data.jsonmsg
      Ohmni.emit('cdata', msg);
      break;

    case 'bot_info':
      if (showBotInfo) showBotInfo(event.data);
      break;

    case 'captureVideo':
      if (captureVideoCb) captureVideoCb(event.data.image);
      break;

    case 'captureAudio':
      if (captureAudioCb) captureAudioCb(event.data.audio);
      break;

    case 'getBotVolume':
      if (getBotVolumeCb) getBotVolumeCb(event.data.botVolume);
      break;
    default:
      console.log(event);
      break;
  }
});

