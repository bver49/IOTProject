require('webduino-blockly');
var express = require('express');
var router = express.Router();
var db = require('../db');

//引用 nodemailer
var nodemailer = require('nodemailer');

//宣告發信物件
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'derek4947@gmail.com',
      pass: '831122dd'
    }
});

var alarmstatus =0;
var humidity=45;
var temp=25;
var sent = 0;

boardReady('Jwz0', function (board) {
  board.systemReset();
  board.samplingInterval = 250;
  console.log("Jwz0 Online");
  /* DHT */
  var dht = getDht(board, 11);

  dht.read(function(evt){
    temp  = dht.temperature;
    humidity = dht.humidity;
  }, 1000);

  /* pir */
  var pir = getPir(board, 13);
  var noisy = board.getPin(3);
  noisy.setMode(3);
  noisy.write(5);

  pir.on("detected", function(){
    if(alarmstatus==1){
      noisy.write(0);
      /*
      if(sent==0){
        sent=1;
        var content = "警告!感應到有人闖入";
        var options = {
            from: 'derek4947@gmail.com',
            to:email,
            subject: '警報',
            text: content
        }
        transporter.sendMail(options, function(error, info){
            if(error){
              console.log(error);
            }
            else{
              console.log('訊息發送: ' + info.response);
            }
        });
      }*/
    }
  });

  pir.on("ended", function(){
    if(alarmstatus==1){
      noisy.write(5);
    }
  });

  router.post('/alarm/on', function(req, res) {
    alarmstatus=1;
    res.send(String(alarmstatus));
  });

  router.post('/alarm/off', function(req, res) {
    sent=0;
    alarmstatus=0;
    noisy.write(5);
    res.send(String(alarmstatus));
  });

});

router.post('/dht/status', function(req, res) {
  res.send({t:temp,h:humidity});
});

router.post('/alarm/status', function(req, res) {
  res.send(String(alarmstatus));
});

module.exports = router;
