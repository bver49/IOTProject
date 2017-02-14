require('webduino-blockly');
var express = require('express');
var router = express.Router();
var db = require('../db');

var autolight = 0;
var lightstatus = 0;
var acstatus = 0;

boardReady('YWkg', function (board) {
  console.log("YWkg Online");
  board.systemReset();
  board.samplingInterval = 20;
  var led = getLed(board, 13);
  led.off();

  var relay = getRelay(board, 9);
  relay.on();

  var photocell = getPhotocell(board, 2);
  photocell.on(function(val){
    photocell.detectedVal = val;
    if(autolight==1){
      if(photocell.detectedVal < 0.3){
        lightstatus=1;
        led.on();
      }
      else{
        lightstatus=0;
        led.off();
      }
    }
  });

  router.post('/autolight/on', function(req, res) {
    autolight=1;
    res.send(String(autolight));
  });

  router.post('/autolight/off', function(req, res) {
    autolight=0;
    res.send(String(autolight));
  });

  router.post('/light/on', function(req, res) {
    lightstatus=1;
    led.on();
    res.send(String(lightstatus));
  });

  router.post('/light/off', function(req, res) {
    lightstatus=0;
    led.off();
    res.send(String(lightstatus));
  });

  router.post('/ac/on', function(req, res) {
    acstatus=1;
    relay.off();
    res.send(String(acstatus));
  });

  router.post('/ac/off', function(req, res) {
    acstatus=0;
    relay.on();
    res.send(String(acstatus));
  });
});

router.post('/autolight/status', function(req, res) {
  res.send(String(autolight));
});

router.post('/light/status', function(req, res) {
  res.send(String(lightstatus));
});

router.post('/ac/status', function(req, res) {
  res.send(String(acstatus));
});

module.exports = router;
