require('webduino-blockly');
var express = require('express');
var router = express.Router();
var db = require('../db');

var relaystatus=0;

boardReady('gwKK', function (board) {
  board.systemReset();
  board.samplingInterval = 250;
  console.log("gwKK Online");

  var relay = getRelay(board,9);
  relay.off();
  router.post('/relay/on', function(req, res) {
    relaystatus=1;
    relay.on();
    res.send(String(relaystatus));
  });

  router.post('/relay/off', function(req, res) {
    relaystatus=0;
    relay.off();
    res.send(String(relaystatus));
  });
});

router.post('/relay/status', function(req, res) {
  res.send(String(relaystatus));
});

module.exports = router;
