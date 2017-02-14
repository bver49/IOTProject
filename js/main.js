$(document).ready(function(){

	var sb_status = 0 ;
	var speed = "500" ;
	var timer ;
	$(".darken").hide();

	$(".menu").click(function(){
		if (sb_status == 0){
			sb_status = 1 ;
			$(".darken").show();
			$(".sidebar").animate({left:'+=380px'},speed);
	  	$(".darken").animate({opacity:'1'},speed);
		}
		else if (sb_status == 1){
			sb_status = 0 ;
			$(".sidebar").animate({left:'-=380px'},speed);
	  	$(".darken").animate({opacity:'0'},speed);
	  	setTimeout(function(){ $(".darken").hide(); }, speed);
		}
	});

	// 開始使用
	$("#startuse").click(function(){
		if(sb_status==0){
			sb_status = 1 ;
			$(".darken").show();
			$(".sidebar").animate({left:'+=380px'},speed);
			$(".darken").animate({opacity:'1'},speed);
		}
		else{
			sb_status = 0 ;
			$(".sidebar").animate({left:'-=380px'},speed);
			$(".darken").animate({opacity:'0'},speed);
	  	setTimeout(function(){ $(".darken").hide(); }, speed);
		}
	});

	// 按下卡片
	/*
	$(".card").mouseup(function(){
		var cardstatus = $(this).css("background-color");
		if ( cardstatus.match("114, 240, 201") ) {
			$(this).css("box-shadow","0px 0px 0px 2px rgba(255, 255, 255, 0.7)");
			$(this).css("background","transparent");
			$(this).children("p").css("color","rgba(255, 255, 255, 0.9)");
			$(this).children("p").css("font-weight","100");
		}
		else {
			$(this).css("box-shadow","0px 0px 0px 2px rgba(114, 240, 201, 1)");
			$(this).css("background","rgba(114, 240, 201, 1)");
			$(this).children("p").css("color","rgba(0, 0, 0, 1)");
			$(this).children("p").css("font-weight","500");
		}
	});*/

	$(".darken").click(function(){
		if (sb_status == 1){
			sb_status = 0 ;
			$(".sidebar").animate({left:'-=380px'},speed);
	  		$(".darken").animate({opacity:'0'},speed);
	  		setTimeout(function(){ $(".darken").hide(); }, speed);
		}
	});

});
