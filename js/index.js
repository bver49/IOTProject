var temp = 25;
var dry = 25;
var relaystatus = 0;
var alarmstatus = 0;
var autolight = 0;
var lightstatus = 0;
var acstatus = 0;
var sr_status = 0 ;
var speed = "500" ;

$(document).ready(function() {
  $(".voicedark").hide();
	$(".siri.tiny").hide();

  function getDht(){
    $.ajax({
      url: '/boardJwz0/dht/status',
      type: 'POST',
      success: function(response) {
        temp = response.t;
        dry = response.h;
        $('#temp').text(temp);
      }
    });
  }

  getDht();

  setInterval(function() {
    getDht();
  },5000);

  //Get relay status
  $.ajax({
    url: '/boardWq5L/relay/status',
    type: 'POST',
    success: function(response) {
      relayshow(response);
    }
  });

  function relayshow(res) {
    var btn = $("#powerbtn");
    if (parseInt(res) == 1) {
      $("#relaystatus").text("開啟中");
      relaystatus = 1;
      cardon(btn);
    } else {
      $("#relaystatus").text("關閉中");
      relaystatus = 0;
      cardoff(btn);
    }
  }

  //Change relay status
  $("#powerbtn").on('click', function() {
    if (relaystatus == 0) {
      $.ajax({
        url: '/boardWq5L/relay/on',
        type: 'POST',
        success: function(response) {
          relayshow(response);
        }
      });
    } else {
      $.ajax({
        url: '/boardWq5L/relay/off',
        type: 'POST',
        success: function(response) {
          relayshow(response);
        }
      });
    }
  });

  //Get alarm status
  $.ajax({
    url: '/boardJwz0/alarm/status',
    type: 'POST',
    success: function(response) {
      alarmshow(response);
    }
  });

  function alarmshow(res) {
    var btn = $("#alarmbtn");
    if (parseInt(res) == 1) {
      $("#alarmstatus").text("開啟中");
      alarmstatus = 1;
      cardon(btn);
    } else {
      $("#alarmstatus").text("關閉中");
      alarmstatus = 0;
      cardoff(btn);
    }
  }

  //Change alarm status
  $("#alarmbtn").on('click', function() {
    if (alarmstatus == 0) {
      $.ajax({
        url: '/boardJwz0/alarm/on',
        type: 'POST',
        success: function(response) {
          alarmshow(response);
        }
      });
    } else {
      $.ajax({
        url: '/boardJwz0/alarm/off',
        type: 'POST',
        success: function(response) {
          alarmshow(response);
        }
      });
    }
  });

  //Get autolight status
  $.ajax({
    url: '/boardYWkg/autolight/status',
    type: 'POST',
    success: function(response) {
      autolightshow(response);
    }
  });

  function autolightshow(res) {
    var btn = $("#autolight");
    if (parseInt(res) == 1) {
      $("#autostatus").text("開啟中");
      autolight = 1;
      $("#lightbtn").css({ opacity:0.5 });
      cardon(btn);
    } else {
      $("#autostatus").text("關閉中");
      autolight = 0;
      $("#lightbtn").css({ opacity:1 });
      cardoff(btn);
    }
  }

  //Change autolight status
  $("#autolight").on('click', function() {
    if (autolight == 0) {
      $.ajax({
        url: '/boardYWkg/autolight/on',
        type: 'POST',
        success: function(response) {
          autolightshow(response);
        }
      });
    }
    else {
      $.ajax({
        url: '/boardYWkg/autolight/off',
        type: 'POST',
        success: function(response) {
          autolightshow(response);
        }
      });
    }
  });

  //Get light status
  $.ajax({
    url: '/boardYWkg/light/status',
    type: 'POST',
    success: function(response) {
      lightshow(response);
    }
  });

  function lightshow(res) {
    var btn = $("#lightbtn");
    if (parseInt(res) == 1) {
      $("#lightstatus").text("開啟中");
      lightstatus = 1;
      cardon(btn);
    } else {
      $("#lightstatus").text("關閉中");
      lightstatus = 0;
      cardoff(btn);
    }
  }

  //Change light status
  $("#lightbtn").on('click', function() {
    if(autolight == 0){
      if (lightstatus == 0) {
        $.ajax({
          url: '/boardYWkg/light/on',
          type: 'POST',
          success: function(response) {
            lightshow(response);
          }
        });
      } else {
        $.ajax({
          url: '/boardYWkg/light/off',
          type: 'POST',
          success: function(response) {
            lightshow(response);
          }
        });
      }
    }
  });

  //get ac status
  $.ajax({
    url: '/boardYWkg/ac/status',
    type: 'POST',
    success: function(response) {
      acshow(response);
    }
  });

  function acshow(res) {
    var btn = $("#ac");
    if (parseInt(res) == 1) {
      $("#acstatus").text("開啟中");
      acstatus = 1;
      cardon(btn);
    } else {
      $("#acstatus").text("關閉中");
      acstatus = 0;
      cardoff(btn);
    }
  }

  //Change ac status
  $("#ac").on('click', function() {
    if (acstatus == 0) {
      $.ajax({
        url: '/boardYWkg/ac/on',
        type: 'POST',
        success: function(response) {
          acshow(response);
        }
      });
    } else {
      $.ajax({
        url: '/boardYWkg/ac/off',
        type: 'POST',
        success: function(response) {
          acshow(response);
        }
      });
    }
  });

  // 啟動語音
  $(".voicebtn").mousedown(function(){
    if(sr_status==0){
      sirishow();
    }
    else{
      siriclose();
    }
  });
});

function sirishow() {
  speak("能幫你什麼嗎", ["zh-TW", 1, 1, 1], function() {}, 0);
  sr_status = 1;
  $(".upper").fadeOut(speed);
  $(".voicedark").fadeIn(speed*2);
  setTimeout(function(){
    $(".siri.tiny").fadeIn(speed*1.5);
  },speed*1.8);
  $(".voicebtn").attr("class","voicebtn pressed");
  setTimeout(function(){
    speechRecognition();
  },1000);
}

function siriclose(){
  sr_status = 0;
  $(".voicedark").fadeOut(speed);
  $(".siri.tiny").fadeOut(speed);
  $(".upper").fadeIn(speed*2);
  $(".voicebtn.pressed").attr("class","voicebtn");
  $(".userspeaks p").empty();
  $(".sirispeaks #siri").text("能幫你什麼嗎？");
  window._recognition.status = false;
  window._recognition.stop();
}


function sirisetword(word){
  $(".sirispeaks #siri").text(word);
}

function usersetword(word){
  $(".userspeaks p").text(word);
}


function speechRecognition() {
  if (!("webkitSpeechRecognition" in window)) {
    alert("本瀏覽器不支援語音辨識，請更換瀏覽器！(Chrome 25 版以上才支援語音辨識)");
  } else {
    window._recognition = new webkitSpeechRecognition();
    window._recognition.continuous = true;
    window._recognition.interimResults = true;
    window._recognition.lang = "cmn-Hant-TW";

    window._recognition.onstart = function() {
      console.log("Start recognize...");
      window._recognition.status = true;
    };

    window._recognition.onend = function() {
      console.log("Stop recognize");
      if (window._recognition.status) {
        window._recognition.start();
      }
    };

    window._recognition.onresult = function(event, result) {
      result = {};
      result.resultLength = event.results.length - 1;
      result.resultTranscript = event.results[result.resultLength][0].transcript;
      if (event.results[result.resultLength].isFinal === false) {
        console.log(result.resultTranscript);
        usersetword(result.resultTranscript);
        if (result.resultTranscript.indexOf("溫度") !== -1) {
          window._recognition.status = false;
          window._recognition.stop();
          speak((String('現在是') + String(temp) + "度"), ["zh-TW", 1, 1, 1], function() {}, 0);
          sirisetword('現在是'+temp+"度。");
          result.resultTranscript = "";
          setTimeout(function(){
            usersetword("");
            sirisetword("能幫你什麼嗎？");
            speechRecognition();
          },3000);
        }
        if (result.resultTranscript.indexOf("濕度") !== -1) {
          window._recognition.status = false;
          window._recognition.stop();
          speak((String('現在的濕度是百分之') + String(dry)), ["zh-TW", 1, 1, 1], function() {}, 0);
          sirisetword('現在的濕度是'+dry+"%");
          result.resultTranscript = "";
          setTimeout(function(){
            usersetword("");
            sirisetword("能幫你什麼嗎？");
            speechRecognition();
          },3000);
        }
        if (result.resultTranscript.indexOf("開燈") !== -1) {
          window._recognition.status = false;
          window._recognition.stop();
          if(lightstatus==0){
            speak("電燈已開啟", ["zh-TW", 1, 1, 1], function() {}, 0);
            sirisetword("電燈已開啟。");
            $("#lightbtn").click();
          }
          result.resultTranscript = "";
          setTimeout(function(){
            usersetword("");
            sirisetword("能幫你什麼嗎？");
            speechRecognition();
          },3000);
        }
        if (result.resultTranscript.indexOf("關燈") !== -1) {
          window._recognition.status = false;
          window._recognition.stop();
          if(lightstatus==1){
            speak("電燈已關閉", ["zh-TW", 1, 1, 1], function() {}, 0);
            sirisetword("電燈已關閉。");
            $("#lightbtn").click();
          }
          result.resultTranscript = "";
          setTimeout(function(){
            usersetword("");
            sirisetword("能幫你什麼嗎？");
            speechRecognition();
          },3000);
        }
        if (result.resultTranscript.indexOf("開冷氣") !== -1) {
          window._recognition.status = false;
          window._recognition.stop();
          if(acstatus==0){
            speak("冷氣已開啟", ["zh-TW", 1, 1, 1], function() {}, 0);
            sirisetword("冷氣已開啟。");
            $("#ac").click();
          }
          result.resultTranscript = "";
          setTimeout(function(){
            usersetword("");
            sirisetword("能幫你什麼嗎？");
            speechRecognition();
          },3000);
        }
        if (result.resultTranscript.indexOf("關冷氣") !== -1) {
          window._recognition.status = false;
          window._recognition.stop();
          if(acstatus==1){
            speak("冷氣已關閉", ["zh-TW", 1, 1, 1], function() {}, 0);
            sirisetword("冷氣已關閉。");
            $("#ac").click();
          }
          result.resultTranscript = "";
          setTimeout(function(){
            usersetword("");
            sirisetword("能幫你什麼嗎？");
            speechRecognition();
          },3000);
        }
        if (result.resultTranscript.indexOf("開電扇") !== -1) {
          window._recognition.status = false;
          window._recognition.stop();
          if(relaystatus==0){
            speak("電扇已開啟", ["zh-TW", 1, 1, 1], function() {}, 0);
            sirisetword("電扇已開啟。");
            $("#powerbtn").click();
          }
          result.resultTranscript = "";
          setTimeout(function(){
            usersetword("");
            sirisetword("能幫你什麼嗎？");
            speechRecognition();
          },3000);
        }
        if (result.resultTranscript.indexOf("關掉電扇") !== -1) {
          window._recognition.status = false;
          window._recognition.stop();
          if(relaystatus==1){
            speak("電扇已關閉", ["zh-TW", 1, 1, 1], function() {}, 0);
            sirisetword("電扇已關閉。");
            $("#powerbtn").click();
          }
          result.resultTranscript = "";
          setTimeout(function(){
            usersetword("");
            sirisetword("能幫你什麼嗎？");
            speechRecognition();
          },3000);
        }
      }
      else if (event.results[result.resultLength].isFinal === true) {
        console.log("final");
      }
    };
    window._recognition.start();
  }
}


	function cardon(btn){
    btn.css("box-shadow","0px 0px 0px 2px rgba(114, 240, 201, 1)");
    btn.css("background","rgba(114, 240, 201, 1)");
    btn.children("p").css("color","rgba(0, 0, 0, 1)");
    btn.children("p").css("font-weight","500");
	}
	function cardoff(btn){
		btn.css("box-shadow","0px 0px 0px 2px rgba(255, 255, 255, 0.7)");
		btn.css("background","transparent");
		btn.children("p").css("color","rgba(255, 255, 255, 0.9)");
		btn.children("p").css("font-weight","100");
	}
