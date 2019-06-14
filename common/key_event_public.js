var countFlag=0;
var seekTime = 0;
var count = 0;		
var movies=[];	
var playUrl = null;
var returnVideo_flag = false;
var contrlquit = 1;
var lpos,tpos,wpos,hpos;
//思华方填充RTSP地址
document.onsystemevent = grabEvent;
document.onkeypress = grabEvent;
document.onirkeypress = grabEvent;
function grabEvent(event)
{ 

	 var keycode = event.which;  //消息的按键值
	 //播放完成后，循环播放
	 iPanel.debug("keycode=="+keycode);
	 switch(keycode){
	 		case 5210:
	 		 	media.AV.close();
				setTimeout("playVOD()",2000);
				return 0;
				break;
			case 5202:
				iPanel.debug("5202");
				media.AV.play();  
				return 0;
				break;
		 	case 5205:
				var hVersion = hardware.STB.hVersion;
				if(hVersion=="0371666f"&&VOD.server.name== "sihua_3rd" &&serverModel== "IP"){//加入serverMdel这个条件后，满足两个条件后才能调用play 9-13//// VOD.server.name == "sihua_3rd" 表示第三方VOD201413
					media.AV.play();    //hm3000 ，后来发的5205 没有发play了
					return 0;
				}else{
					return 1;
				}
				break;
			case 339:
			case 340:
				iPanel.debug("returnVideo_flag=="+returnVideo_flag);
				if(returnVideo_flag){	
					returnVideo(lpos,tpos,wpos,hpos);
					contrlquit=1;
					return 0;
				}
				else{
					window.history.go(-1);
					return 0;
					}
				return 1;
				break;				
			    
	}
}
function playVOD(){
	playUrl=movies[countFlag];
	iPanel.debug("playUrl=="+playUrl);
	modeChange(playUrl);
	if(countFlag>=movies.length-1){
		countFlag=0;
	}else{
		countFlag++;
	}	
//	alert(2);
	media.AV.open(playUrl,'VOD');
}	
//---------------切换模式----------------------
var serverModel= "IP";
function modeChange(rtsp_url){
		if (typeof(rtsp_url)!="undefined"){ 
			if( rtsp_url.indexOf("isIpqam=1")!= -1){
				serverModel= "DVB";
			}else{
				serverModel= "IP";
			}
			}
		if(serverModel=="IP"){
			var __providerName = hardware.STB.provider;
			var __providerNameFlag = __providerName.indexOf("摩托")>0?true:false; 
			var ipanel_soft_version = iPanel.System.revision; 
			if(__providerName.indexOf("摩托") != -1|| __providerNameFlag || ipanel_soft_version.indexOf("41506") != -1){//第三方VOD的点播模式切换
      			 VOD.changeServer("sihua_3rd","ip");
			}else{
				VOD.changeServer("isma_v2","ip");
		} 
      		}else{
				VOD.changeServer("isma_v2","dvb"); 
}
}

//------------------------------------------------------
function initMedia(_num1,_num2,_num3,_num4){
//	alert(1);
	lpos = _num1;
	tpos = _num2;
	wpos = _num3;
	hpos = _num4;
	playVOD();
	//iPanel.Media.setPosition(_num1,_num2,_num3,_num4);
	setTimeout("Video()",1500)	
}

function Video(){
	returnVideo(lpos,tpos,wpos,hpos);
}

function $(id){
	return document.getElementById(id);
}

function fullScreen(){
	returnVideo_flag=true;
	iPanel.Media.setPosition(0,0,1280,720);
	for(var i = 0;i < document.getElementsByTagName("div").length; i++){
		document.getElementsByTagName("div")[i].style.visibility="hidden";
	}
}

function returnVideo(_num1,_num2,_num3,_num4){
    iPanel.Media.setPosition(_num1,_num2,_num3,_num4);
	returnVideo_flag=false;
	for(var i = 0;i < document.getElementsByTagName("div").length; i++){
		document.getElementsByTagName("div")[i].style.visibility="visible";
	}
}	

function fullScreen_ss(_){
	returnVideo_flag=true;
	var seekTime = media.AV.elapsed;
	iPanel.debug("key_event.js-------moviesIdStr=="+moviesId[countFlag-1]);
	window.location.href = "/templates/iptvtest/runtime/default/template/ss2012/vodPlay_movies.jsp?moviesId="+moviesId[countFlag];
}



//////////////////