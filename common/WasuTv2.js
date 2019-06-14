/*常量*/
var FavoritUrl = "favoritFolder.html";	//收藏
var SearchUrl = "searchIndex.html";		//搜索
var HistoryUrl = "historyFolder.html";	//历史
var LogOfNielsen ="http://218.108.243.25/hsanalyse/Analyse/getData.jsp?stbid="+getCookie("stbid")+"&inorout=1&actclass=Hindex&hostid=104";	//尼尔森日志
var logPath="http://ilog.wasu.cn/iLog/log";		//大数据日志埋点
var LogReferPage=encodeURIComponent(window.location.href);	//大数据RP地址
var SalePath ="/template_images/html/businessHall/yyt_index.html";	//营业厅地址
var DaoHangUrl = "http://" + document.domain+"/a?f=daohang";	//导航
var HongdongPath="http://125.210.228.101/activity/act.jsp?indexUrl=1&tvType=1&regionId=330100&stbId="+getCookie("stbid")+"&returnUrl="+getCookie("return_url");	//活动一类型路径
var ClpsRootUrl = (getCookie("root")||"http://" + document.domain+"/templates/iptvtest/runtime/default").replace(/\"/g,"")	;//clps模板路径
var CurRootUrl = "http://" + document.domain+"/template_images/html/";		//当前绝对路径
var ConfigRootPath = "http://" + document.domain+"/template_images/"+getCookie("cityCode");	//配置JS路径
var PerServAjaxUrl="http://125.210.122.169/PersonalityService/task/handleRequest.shtml?stbid="+getCookie("stbid")+"&folderCode="+getQueryString("messageCode")+"&"+Math.random();
/**/
var serviceSwitchStr="";
var cur_cookie="1_cookie";
var addFocusCookie;
var SETTIMECLOCKALL,SETTIMECLOCKALL1;
var OBJNAME;
var XMLHTTP;
var KEY_PAGEUP = 372;
var KEY_PAGEDOWN = 373;
var KEY_LEFT = 37;
var KEY_UP = 38;
var KEY_RIGHT = 39;
var KEY_DOWN = 40;
var KEY_BACK = 45;
var KEY_OK = 13;
var KEY_QUIT = 339;

/*按键方法*/
function returnVideo(){
	window.history.go(-1);
};
function keyBinds(_Obj){
	document.onkeydown = function(evt){
		var key_code = event.which ? event.which: event.keyCode;
		switch (key_code) {
			case 1:
			case KEY_UP:
				_Obj.keyUp();
				return 0;
				break;
			case 2:
			case KEY_DOWN:
				_Obj.keyDown();
				return 0;
				break;
			case 3:
			case KEY_LEFT:
				_Obj.keyLeft();
				return 0;
				break;
			case 4:
			case KEY_RIGHT:
				_Obj.keyRight();
				return 0;
				break;
			case KEY_OK:
				_Obj.doSelected();
				return 0;
				break;
			case 18:  
			case 340:
			case KEY_BACK:
				_Obj.comeBack();
				return 0;
				break;
			case KEY_QUIT:
				returnVideo();
				return 0;
				break;
			case KEY_PAGEUP:
				_Obj.pageUp();
				return 0;
				break;
			case KEY_PAGEDOWN:
				_Obj.pageDown();
				return 0;
				break;
			default:
				return key_code;
				break;
		}
	};
};
/*焦点记忆方法*/
function getCookieFocusId(){
	var cook_Value = getCookie(cur_cookie);
	if(cook_Value!=null){
		var cook_ValueArray = cook_Value.split("@/@");	
		if(ele(cook_ValueArray[0])!=null){
			return cook_ValueArray[0];
		}else{
			return null;
		}
	}else{
		return null;
	};
};

function getCookiePageInfo(_type){
	var cook_Value = getCookie(cur_cookie);
	if(cook_Value!=null){
		var cook_ValueArray = cook_Value.split("@/@");
		if(ele(cook_ValueArray[0])!=null){
			if(typeof(cook_ValueArray[1])!="undefined" && typeof(_type)=="number"){
				return cook_ValueArray[1].split("_")[_type];
			};
		}else{
			return null;
		}
	}else{
		return null;
	};
};
function setCookieData(_id,_otherInfo){
	var cookieValue = _id;
	if(typeof(_otherInfo)!="undefined" && _otherInfo!=null){
		cookieValue=cookieValue+"@/@"+_otherInfo;
	};
	setCookie(cur_cookie,cookieValue);
};
/*AJAX调用数据方法*/
var GetAjaxData = function(){
	this.loadStuts = true;
	this.ajaxUrl = "";
	this.ajaxData ="";
	this.getAjaxFunYb = function(_obj){
		if(this.loadStuts==true){
			this.loadStuts = false;
			var xmlhttp;
			xmlhttp=new XMLHttpRequest();
			xmlhttp.open("GET",this.ajaxUrl,true);
			xmlhttp.send();
			xmlhttp.onreadystatechange = function(){
				if(xmlhttp.readyState==4 && xmlhttp.status==200){
					var str = xmlhttp.responseText;
					_obj.loadStuts = true;
					try{var obj = eval ("(" + str + ")");}catch(err){var obj ={assets:[],totleAssets:0,totlePage:1};}
					_obj.ajaxData = obj;
				};
			};
			SETTIMECLOCKALL=setTimeout(function(){
				if(_obj.loadStuts == false){
					xmlhttp.abort();
					_obj.loadStuts = true;
				}
			},500);
		}
	};
	this.getAjaxFunTb = function(){
		if(this.ajaxUrl!=""){
			var xmlhttp;
			xmlhttp=new XMLHttpRequest();;	
			xmlhttp.open("GET",this.ajaxUrl,false);
			xmlhttp.send();
			var str = xmlhttp.responseText;
			try{var obj = eval ("(" + str + ")");}catch(err){var obj ={assets:[],totleAssets:0,totlePage:1};}
			this.ajaxData = obj;
		}
	};
}
/*获取区域信息方法*/
var GetLabelData = function(_parentLabelObjId,_focusId){
		var parentLabelId = _parentLabelObjId;
		var initLabelId = _focusId;
		var labelObjs = [];
		var curLabelIndex = 0;
		var curLabelObj = [];
		
		this.getParentLabelId = function(){
			return parentLabelId;		
		};
		this.getLabelObjs = function(){
			return labelObjs;
		};		
		this.getInitLabelId = function(){
			return initLabelId;		
		};
		this.setLabelObjs = function(){
			try{
				labelObjs = [];
				var list = ele(parentLabelId).childNodes;
				for(var i=0;i<list.length;i++){
					if(list[i].nodeType==1 && list[i].id.indexOf(parentLabelId)>-1){
						labelObjs.push(list[i]);
					};
				};
			}catch(err){};
		};
		this.setCurLabelIndexByInitLabelId = function(_id){
			try{
				for(var i in labelObjs){
					if(labelObjs[i].id == _id){
						curLabelIndex = parseInt(i);
						break;
					};
				};
			}catch(err){};	
		};		
		this.setCurLabelIndex = function(_num){
			if(_num > -1 && _num < labelObjs.length){
				curLabelIndex = _num;
			};
		};
		this.getCurLabelIndex = function(){
			return curLabelIndex;
		};
		this.getCurLabelObj = function(){
			return labelObjs[curLabelIndex];
		};
	};
/*rt活动,rc事件,pos*/
function refreshLog(_cp,_pageCode,_rt,_rc,_pos){
	if(serviceSwitchStr!="")eval(serviceSwitchStr);
	if(typeof(main_wasuSwitch)=="boolean"&&main_wasuSwitch==true){
		if(typeof(vodLogging_wasuSwitch)=="boolean"&&vodLogging_wasuSwitch==true){
			try{
				var pos = _pos == undefined?0:1;//0表示按钮点击,1表示页面加载
				var stbid=getCookie("stbid");
				var _projectName=getCookie("cityCode");
				var _iframeDom=ele("jiance");
				var cp=encodeURIComponent(toAbsURL(_cp));
				var _iframeUrl= logPath + "?stbid=" +stbid + "&dept=0&projectName=" + _projectName + "&pos=" + pos + "&rp=" + LogReferPage + "&cp=" + cp + "&pc=" + _pageCode + "&rt=" + _rt + "&rc=" + _rc;
				if(_iframeDom==null){
					 var iframeDomNew = document.createElement("iframe");
					 iframeDomNew.setAttribute("id","jiance");
					 iframeDomNew.width=0;
					 iframeDomNew.height=0;
					 iframeDomNew.src=_iframeUrl;
					 document.body.appendChild(iframeDomNew);
					 
				}else{
					 _iframeDom.src = _iframeUrl; 
				}
			}catch(e){}
		}							
	}

}
//转换成绝对路径
var toAbsURL = function(_url){
	var url=_url;
	if(url==""||url==undefined) return url;
	var a = document.createElement('a');
	if(typeof(a)=="object"){
		a.href = url;
    	return a.href;
	}else{
		var div = document.createElement('div');
        div.innerHTML = '<a href="' + url.replace(/"/g, '%22') + '"/>';
        return div.firstChild.href;
	}

};


/*基本框架（一维）,_stepMap:[1,0]表示横向（默认）,[0,1]表示纵向，"[1,1]"表示自定义；*/	
var BaseAreaData = function(_parentObjId,_focusId,_focusClassName,_stepMap,_areaMap){
		GetLabelData.call(this,_parentObjId,_focusId);
		this.focusClassName = _focusClassName;
		var stepMap = [1,0];
		var areaMapLeft,areaMapRight,areaMapTop,areaMapBottom;
		this.setStepMap = function(_Obj){
			if(_Obj.length == 2 &&_Obj[0]>-1 && _Obj[1]>-1){
				stepMap = _Obj;
			};						
		};
		this.getStepMap = function(){
			return stepMap;
		};		
		this.setAreaMapLeft = function(_Obj){
			try{
				if(_Obj.getLabelObjs().length > 0){
					areaMapLeft = _Obj;
				};
			}catch(err){areaMapLeft = null;};
		};
		this.setAreaMapRight = function(_Obj){
			try{
				if(_Obj.getLabelObjs().length > 0){
					areaMapRight = _Obj;
				};
			}catch(err){areaMapRight = null;};
		};
		this.setAreaMapTop = function(_Obj){
			try{
				if(_Obj.getLabelObjs().length > 0){
					areaMapTop = _Obj;
				};
			}catch(err){areaMapTop = null;};
		};
		this.setAreaMapBottom = function(_Obj){
			try{
				if(_Obj.getLabelObjs().length > 0){
					areaMapBottom = _Obj;
				}
			}catch(err){areaMapBottom = null;};
		};		
		this.getAreaMapLeft = function(){
			return areaMapLeft;
		}
		this.getAreaMapRight = function(){
			return areaMapRight;
		};
		this.getAreaMapTop = function(){
			return areaMapTop;
		};
		this.getAreaMapBottom = function(){
			return areaMapBottom;
		};	
		this.setAreaMap = function(_Obj){
			try{
				if(_Obj != undefined&& _Obj.length > 0){	
					this.setAreaMapLeft(_Obj[0].Left);
					this.setAreaMapRight(_Obj[0].Right);
					this.setAreaMapTop(_Obj[0].Top);
					this.setAreaMapBottom(_Obj[0].Bottom);
				};
			}catch(err){};
		};
		this.initialData = function(){
			this.setLabelObjs();
			try{
				var focusId = getCookieFocusId();
				if(focusId!=null&&focusId.indexOf(this.getParentLabelId())>-1){
					this.setCurLabelIndexByInitLabelId(focusId);
					this.startRun();
				}else{this.setCurLabelIndexByInitLabelId(_focusId)};			
			}catch(err){this.setCurLabelIndexByInitLabelId(_focusId)}
			this.setStepMap(_stepMap);
			this.setAreaMap(_areaMap);
		}; 
	};
	BaseAreaData.prototype.startRun = function(){
		this.onFocus();
		keyBinds(this);		
	};
	BaseAreaData.prototype.onFocus = function(){
		this.getCurLabelObj().className = (this.getCurLabelObj().className+" "+this.focusClassName).replace(/(^\s*)|(\s*$)/g, "");
    };
	BaseAreaData.prototype.lostFocus = function(){
		var reg = new RegExp(this.focusClassName,"g");
		this.getCurLabelObj().className = this.getCurLabelObj().className.replace(reg,"").replace(/(^\s*)|(\s*$)/g, "");
    };
	BaseAreaData.prototype.navPosChange = function(_num){
		if(this.getCurLabelIndex() + _num > -1 && this.getCurLabelIndex() + _num < this.getLabelObjs().length){
			this.lostFocus();
			this.setCurLabelIndex(this.getCurLabelIndex() + _num);
			this.onFocus();
		};
    };
	BaseAreaData.prototype.navAreaChange = function(_obj){
		try{

			if(_obj.getLabelObjs().length > 0){
				this.lostFocus();
				_obj.setCurLabelIndexByInitLabelId(_obj.getInitLabelId());
				_obj.startRun();	
			};
		}catch(err){};
    };
	BaseAreaData.prototype.doSelected = function(){
		var strs = this.getCurLabelObj().title;		
		var _pageCode=this.getCurLabelObj().id;
		if (strs == undefined || strs == null || strs == "") {
			return
		}else{
			eval("var _addressObj = " + strs);
			if (_addressObj != undefined && _addressObj != null && _addressObj.length > 0) {
				var jsName = _addressObj[0].js;
				var strUrl = _addressObj[0].url;
				var jsresult = true;
				if (jsName != undefined && jsName != null && jsName != "") {
					try{						
						refreshLog("",_pageCode);
					}catch(e){};
					try {
						setTimeout(function(){jsresult = eval(jsName);},400);
					} catch(e) {
						jsresult = false;
					};
				};
				if (strUrl != undefined && strUrl != null && strUrl != "") {
					try{
						var temp = strUrl.split("?");
						strUrl = temp[0];
						if (temp.length > 1){
							strUrl += "?" + encodeURI(temp[1]);
						};
						setCookieData(this.getCurLabelObj().id,addFocusCookie)
						delCookieLess(cur_cookie);						
						refreshLog(strUrl,_pageCode);
					}catch(e){};
					setTimeout(function(){window.location.href = clearAllSpace(strUrl);},400);
				};
				return jsresult;
			};
		};
	};
	BaseAreaData.prototype.pageUp= function(){
	};
	BaseAreaData.prototype.pageDown= function(){
	};
	BaseAreaData.prototype.comeBack = function(){
		window.history.go(-1);
	};
	BaseAreaData.prototype.keyUp = function(){
		var y = this.getStepMap()[1];
		var index =this.getCurLabelIndex(); 
        if(-1<index-y&&index-y<index) {
            this.navPosChange(-y);
        }else{
            this.navAreaChange(this.getAreaMapTop());
        };
	};
	BaseAreaData.prototype.keyDown = function(){
		var y = this.getStepMap()[1];
		var index =this.getCurLabelIndex(); 
		var len = this.getLabelObjs().length;
        if(index<index+y&&index+y<len){
            this.navPosChange(y);
        }else{
            this.navAreaChange(this.getAreaMapBottom());
        };
	};	
	BaseAreaData.prototype.keyLeft = function(){
		var x = this.getStepMap()[0];
		var index =this.getCurLabelIndex(); 
        if(-1<index-x&&index-x<index){
            this.navPosChange(-x);
        }else{
            this.navAreaChange(this.getAreaMapLeft());
        };
	};	
	BaseAreaData.prototype.keyRight = function(){
		var x = this.getStepMap()[0];
		var index =this.getCurLabelIndex(); 
		var len = this.getLabelObjs().length;
		if(index<index+x && index+x<len ){
			this.navPosChange(x);
		}else{
			this.navAreaChange(this.getAreaMapRight());
		};
	};
/*一维焦点固定滚动条,_stepMap:[1,0]表示横向（默认）,[0,1]表示纵向，"[1,1]"表示自定义；*/
var BaseAreaWheelData = function(_parentObjId,_focusId,_focusClassName,_stepMap,_areaMap,_objList){
		BaseAreaData.call(this,_parentObjId,_focusId,_focusClassName,_stepMap,_areaMap);
		var totleAssets = [];
		var curPageAssets = [];
		var curAssetIndex = 0;
		
		this.setTotleAssets = function(_obj){
			if(_obj.length > this.getCurLabelIndex()){
				totleAssets = _obj;
			};
		};
		this.getTotleAssets = function(){
			return totleAssets;
		};
		this.getTotleAssetsLength = function(){
			return totleAssets.length;
		};
		this.setCurAssetIndex = function(_num){
			try{
				var num = parseInt(_num);
				var len = totleAssets.length;
				curAssetIndex = (num + len)%len;
			}catch(err){};
		};
		this.getCurAssetIndex = function(){
			return curAssetIndex;
		};
		this.setCurPageAssets = function(){
			curPageAssets = [];
			var length = totleAssets.length;
			var minIndex = curAssetIndex - this.getCurLabelIndex();
			for(var i=0,len=this.getLabelObjs().length;i<len;i++) {
				curPageAssets.push(totleAssets[(minIndex+i+length)%length]);
			}; 
		};
		this.getCurPageAssets = function(){
			return curPageAssets;
		};
		this.initialData = function(){
			this.setLabelObjs();
			this.setStepMap(_stepMap);
			this.setAreaMap(_areaMap);
			this.setCurLabelIndexByInitLabelId(_focusId);
			try{
				var focusId = getCookieFocusId();
				if(focusId!=null&&focusId.indexOf(this.getParentLabelId())>-1){
					this.startRun();
				};			
			}catch(err){};
			this.setTotleAssets(_objList);
			var assetIndex = getCookiePageInfo(0);
			if(assetIndex != null ){
				this.setCurAssetIndex(assetIndex);
			}else{
				this.setCurAssetIndex(this.getCurLabelIndex());
			};
			this.setCurPageAssets();
			this.loadPageAsset();
		};
	}
	extend(BaseAreaWheelData,BaseAreaData);
	BaseAreaWheelData.prototype.startRun = function(){
		this.onFocus();
		keyBinds(this);
	}
	BaseAreaWheelData.prototype.loadPageAsset = function(){
		for(var i=0;i<this.getLabelObjs().length;i++){
			this.getLabelObjs()[i].title="#";
			this.getLabelObjs()[i].innerHTML=" ";
		}
		for(var i=0;i<this.getCurPageAssetsLength();i++){
			this.getLabelObjs()[i].title="[{'url':'" + this.getCurPageAssets()[i].url + "'}]";
			this.getLabelObjs()[i].innerHTML=this.getCurPageAssets()[i].name;
		}
		
	};
	BaseAreaWheelData.prototype.navPosChange = function(_num){
		this.setCurAssetIndex(this.getCurAssetIndex() + _num);
		this.setCurPageAssets();
		this.loadPageAsset();
	};
	BaseAreaWheelData.prototype.keyUp = function(){
		if(this.getStepMap()[1] == 0 && typeof(this.getAreaMapTop())!="undefined"){
			this.navAreaChange(this.getAreaMapTop());
		}else if(this.getStepMap()[1] > 0){
			this.navPosChange(-this.getStepMap()[1]);
		};
	};
	BaseAreaWheelData.prototype.keyDown = function(){
		if(this.getStepMap()[1] == 0 && typeof(this.getAreaMapBottom())!="undefined"){
			this.navAreaChange(this.getAreaMapBottom());
		}else if(this.getStepMap()[1] > 0){
			this.navPosChange(this.getStepMap()[1]);
		};
	};	
	BaseAreaWheelData.prototype.keyLeft = function(){
		if(this.getStepMap()[0] == 0 && typeof(this.getAreaMapLeft())!="undefined"){
			this.navAreaChange(this.getAreaMapLeft());
		}else if(this.getStepMap()[0] > 0){
			this.navPosChange(-this.getStepMap()[0]);
		};
	};	
	BaseAreaWheelData.prototype.keyRight = function(){
		if(this.getStepMap()[0] == 0 && typeof(this.getAreaMapRight())!="undefined"){
			this.navAreaChange(this.getAreaMapRight());
		}else if(this.getStepMap()[0] > 0){
			this.navPosChange(this.getStepMap()[0]);
		};
	};
	BaseAreaWheelData.prototype.doSelected = function(){
		var strs = this.getCurLabelObj().title;		
		var _pageCode=this.getCurLabelObj().id;
		if (strs == undefined || strs == null || strs == "") {
			return
		}else{
			eval("var _addressObj = " + strs);
			if (_addressObj != undefined && _addressObj != null && _addressObj.length > 0) {
				var jsName = _addressObj[0].js;
				var strUrl = _addressObj[0].url;
				var jsresult = true;
				if (jsName != undefined && jsName != null && jsName != "") {
					try{						
						refreshLog("",_pageCode);
					}catch(e){};
					try {
						setTimeout(function(){jsresult = eval(jsName);},400);
					} catch(e) {
						jsresult = false;
					};
				};
				if (strUrl != undefined && strUrl != null && strUrl != "") {
					try{
						var temp = strUrl.split("?");
						strUrl = temp[0];
						if (temp.length > 1){
							strUrl += "?" + encodeURI(temp[1]);
						};
						refreshLog(strUrl,_pageCode);
						addFocusCookie = this.getCurAssetIndex();
						setCookieData(this.getCurLabelObj().id,addFocusCookie)
						delCookieLess(cur_cookie);						
					}catch(e){};
					setTimeout(function(){window.location.href = clearAllSpace(strUrl);},400);
				};
				return jsresult;
			};
		};		
	};
	

/* 二维横向框架 */	
var SideToSideData = function(_parentObjId,_focusId,_focusClassName,_stepMap,_areaMap){
		BaseAreaData.call(this,_parentObjId,_focusId,_focusClassName,_stepMap,_areaMap);
		this.initialData = function(){
			this.setLabelObjs();
			try{
				var focusId = getCookieFocusId();
				if(focusId!=null&&focusId.indexOf(this.getParentLabelId())>-1){
					this.setCurLabelIndexByInitLabelId(focusId);
					this.startRun();
				}else{this.setCurLabelIndexByInitLabelId(_focusId)};			
			}catch(err){this.setCurLabelIndexByInitLabelId(_focusId)}
			this.setStepMap(_stepMap);
			this.setAreaMap(_areaMap);
		} 
	};
	extend(SideToSideData,BaseAreaData);
	SideToSideData.prototype.keyLeft = function(){
		var x = this.getStepMap()[0];
		var y = this.getStepMap()[1];
		var index =this.getCurLabelIndex(); 
        if(index%y==0){
            this.navAreaChange(this.getAreaMapLeft());
        }else{
			this.navPosChange(-x);
        };
	};
	SideToSideData.prototype.keyRight = function(){
		var x = this.getStepMap()[0];
		var y = this.getStepMap()[1];
		var index =this.getCurLabelIndex(); 
		if(index%y==y-1||index==(this.getLabelObjs().length-1)){
			this.navAreaChange(this.getAreaMapRight());
		}else{
			this.navPosChange(x);
		};
	};	
/* 二维纵向框架 */
var EndToEndData = function(_parentObjId,_focusId,_focusClassName,_stepMap,_areaMap){
		BaseAreaData.call(this,_parentObjId,_focusId,_focusClassName,_stepMap,_areaMap);
		this.initialData = function(){
			this.setLabelObjs();
			try{
				var focusId = getCookieFocusId();
				if(focusId!=null&&focusId.indexOf(this.getParentLabelId())>-1){
					this.setCurLabelIndexByInitLabelId(focusId);
					this.startRun();
				}else{this.setCurLabelIndexByInitLabelId(_focusId)};			
			}catch(err){this.setCurLabelIndexByInitLabelId(_focusId)}
			this.setStepMap(_stepMap);
			this.setAreaMap(_areaMap);
		}
	};
	extend(EndToEndData,BaseAreaData);
	EndToEndData.prototype.keyUp = function(){
		var x = this.getStepMap()[0];
		var y = this.getStepMap()[1];
		var index =this.getCurLabelIndex(); 
        if(index%x==0){
            this.navAreaChange(this.getAreaMapTop());
        }else{
			this.navPosChange(-y);
        }
	};
	EndToEndData.prototype.keyDown = function(){
		var x = this.getStepMap()[0];
		var y = this.getStepMap()[1];
		var index =this.getCurLabelIndex(); 
		if(index%x==x-1||index==(this.getLabelObjs().length-1)){
			this.navAreaChange(this.getAreaMapBottom());
		}else{
			this.navPosChange(y);
		};
	};		
/* 横向列表页翻页框架 */	
var SideToSidePageData = function(_parentObjId,_focusId,_focusClassName,_stepMap,_areaMap,_urlPage){
		SideToSideData.call(this,_parentObjId,_focusId,_focusClassName,_stepMap,_areaMap);
		GetAjaxData.call(this);
		var curPageNum = 1;
		var totlePageNum = 1;
		var curPageAssets = [];
		this.urlPage = _urlPage;
		
		this.setCurPageNum = function(_num){
			var num = parseInt(_num);
			curPageNum = num;
		};
		this.getCurPageNum = function(){
			return curPageNum;
		};
		this.setCurPageAssets = function(_objList){
			curPageAssets = _objList;
		};
		this.getCurPageAssets = function(){
			return curPageAssets;
		};
		this.getCurPageAssetsLength = function(){
			return curPageAssets.length;
		};
		this.setTotlePageNum = function(_num){
			var num = parseInt(_num);
			totlePageNum = num;
		}
		this.getTotlePageNum = function(){
			return totlePageNum;
		};
		this.getAjaxFunYb = function(_num){
			if(this.loadStuts==true){
				this.loadStuts = false;
				var xmlhttp;
				xmlhttp=new XMLHttpRequest();
				xmlhttp.open("GET",this.ajaxUrl,true);
				xmlhttp.send();
				OBJNAME = this;
				xmlhttp.onreadystatechange = function(){
					if(xmlhttp.readyState==4 && xmlhttp.status==200){
						OBJNAME.lostFocus();
						var str = xmlhttp.responseText;
						OBJNAME.loadStuts = true;
						clearTimeout(SETTIMECLOCKALL);
						try{var obj = eval ("(" + str + ")");}catch(err){var obj ={assets:[],totleAssets:0,totlePage:1};}
						OBJNAME.setCurPageAssets(obj.assets);
						OBJNAME.delPageAsset();
						OBJNAME.setCurLabelIndex(_num);			
						OBJNAME.onFocus();
						OBJNAME.loadPageAsset();
						OBJNAME.showUpTag();
						OBJNAME.showDownTag();
						if(OBJNAME.getCurPageNum() == OBJNAME.getTotlePageNum()){
							OBJNAME.hidDownTag();			
						}else if(OBJNAME.getCurPageNum()==1){
							OBJNAME.hidUpTag();
						};
						OBJNAME=null;
					};
					
				};
				SETTIMECLOCKALL=setTimeout(function(){
					if(OBJNAME.loadStuts == false){
						xmlhttp.abort();
						OBJNAME.loadStuts = true;
						OBJNAME=null;
					}
				},500);	
			}
		};				
		this.getAjaxFunTb = function(){
			this.setAjaxUrl();
			var xmlhttp;
			xmlhttp=new XMLHttpRequest();
			xmlhttp.open("GET",this.ajaxUrl,false);
			xmlhttp.send();
			var str = xmlhttp.responseText;
			try{var obj = eval ("(" + str + ")");}catch(err){var obj ={assets:[],totleAssets:0,totlePage:1};}
			this.setCurPageAssets(obj.assets);
			this.loadPageAsset();
			this.setTotlePageNum(obj.totlePage);
		};		
		this.initialData = function(){
			this.setLabelObjs();
			try{
				var focusId = getCookieFocusId();
				if(focusId!=null&&focusId.indexOf(this.getParentLabelId())>-1){
					this.setCurLabelIndexByInitLabelId(focusId);
					this.startRun();
				}else{this.setCurLabelIndexByInitLabelId(_focusId)};			
			}catch(err){this.setCurLabelIndexByInitLabelId(_focusId)};	
			var pageNum = getCookiePageInfo(0);
			if(pageNum != null){
				this.setCurPageNum(pageNum);	
			};	
			this.getAjaxFunTb();		
			this.setStepMap(_stepMap);
			this.setAreaMap(_areaMap);
			if(this.getCurPageNum() > 1){
				this.showUpTag();
			};
			if(this.getCurPageNum()<this.getTotlePageNum()){
				this.showDownTag();
			};	
		};	
	}
	extend(SideToSidePageData,SideToSideData);
	SideToSidePageData.prototype.setAjaxUrl = function(){
		if(typeof(this.urlPage)!="undefined" && this.urlPage.indexOf("?") > -1){
			this.ajaxUrl = this.urlPage + "&pageSize="+ this.getLabelObjs().length + "&pageNum=" + this.getCurPageNum()+"&random="+Math.random();
		}else{
			this.ajaxUrl = this.urlPage + "?pageSize="+ this.getLabelObjs().length + "&pageNum=" + this.getCurPageNum()+"&random="+Math.random();
		};
	};
	SideToSidePageData.prototype.navPosChange = function(_num){
		var num = this.getCurLabelIndex() + _num;
		var length = this.getLabelObjs().length;
		var maxIndex = this.getCurPageAssetsLength()-1;
		if(num > -1 && num < length){
			this.lostFocus();
			this.setCurLabelIndex(num);
			if(num > maxIndex){
				this.setCurLabelIndex(maxIndex);
			};
			this.onFocus();
		}else if(num < 0 && this.getCurPageNum() > 1 && this.loadStuts == true){
			this.setCurPageNum(this.getCurPageNum()-1);
			this.setAjaxUrl();
			var pos = num + length;
			this.getAjaxFunYb(pos);
		}else if(num > length-1 && this.getCurPageNum() < this.getTotlePageNum() && this.loadStuts == true){
			var pageNun = this.getCurPageNum();
			var totlePageNum = this.getTotlePageNum();
			this.setCurPageNum(pageNun+1);
			this.setAjaxUrl();
			var pos = num - length;
			if(pos > maxIndex){
				pos = maxIndex;
			}
			this.getAjaxFunYb(pos);
		};
    };
	SideToSidePageData.prototype.pageDown = function(){
		var pageNun = this.getCurPageNum();
		var totlePageNum = this.getTotlePageNum();
		if(pageNun < totlePageNum && this.loadStuts == true){
			this.setCurPageNum(pageNun+1);
			this.setAjaxUrl();
			this.loadStuts = false;
			var xmlhttp;
			xmlhttp=new XMLHttpRequest();
			xmlhttp.open("GET",this.ajaxUrl,true);
			xmlhttp.send();
			OBJNAME = this;
			xmlhttp.onreadystatechange = function(){
				if(xmlhttp.readyState==4 && xmlhttp.status==200){
					var str = xmlhttp.responseText;
					OBJNAME.loadStuts = true;
					clearTimeout(SETTIMECLOCKALL);
					try{var obj = eval ("(" + str + ")");}catch(err){var obj ={assets:[],totleAssets:0,totlePage:1};}
					OBJNAME.setCurPageAssets(obj.assets);
					OBJNAME.delPageAsset();
					OBJNAME.loadPageAsset();
					OBJNAME.showUpTag();
					if(OBJNAME.getCurPageNum() < OBJNAME.getTotlePageNum()){
						OBJNAME.showDownTag();		
					}else{
						OBJNAME.hidDownTag();	
					}
					OBJNAME=null;
				};
			};
			SETTIMECLOCKALL=setTimeout(function(){
				if(OBJNAME.loadStuts == false){
					xmlhttp.abort();
					OBJNAME.loadStuts = true;
					OBJNAME=null;
				}
			},500);	
		};		
	};
	SideToSidePageData.prototype.pageUp = function(){
		if(this.getCurPageNum() > 1 && this.loadStuts == true){
			this.setCurPageNum(this.getCurPageNum()-1);
			this.setAjaxUrl();
			this.loadStuts = false;
			var xmlhttp;
			xmlhttp=new XMLHttpRequest();
			xmlhttp.open("GET",this.ajaxUrl,true);
			xmlhttp.send();
			OBJNAME = this;
			xmlhttp.onreadystatechange = function(){
				if(xmlhttp.readyState==4 && xmlhttp.status==200){
					var str = xmlhttp.responseText;
					OBJNAME.loadStuts = true;
					clearTimeout(SETTIMECLOCKALL);
					try{var obj = eval ("(" + str + ")");}catch(err){var obj ={assets:[],totleAssets:0,totlePage:1};}
					OBJNAME.setCurPageAssets(obj.assets);
					OBJNAME.delPageAsset();
					OBJNAME.loadPageAsset();
					OBJNAME.showDownTag();
					if(OBJNAME.getCurPageNum() > 1){
						OBJNAME.showUpTag();		
					}else{
						OBJNAME.hidUpTag();
					}
					OBJNAME=null;
				}
			}
			SETTIMECLOCKALL=setTimeout(function(){
				if(OBJNAME.loadStuts == false){
					xmlhttp.abort();
					OBJNAME.loadStuts = true;
					OBJNAME=null;
				}
			},500);
		};		
	};
	SideToSidePageData.prototype.delPageAsset = function(){
		for(var i=0;i<this.getLabelObjs().length;i++){
			this.getLabelObjs()[i].title="#";
		};
	};	
	SideToSidePageData.prototype.loadPageAsset = function(){
		for(var i=0;i<this.getCurPageAssetsLength();i++){
			this.getLabelObjs()[i].title="[{'url':'" + this.getCurPageAssets()[i].url + "'}]";
		};
	};
	SideToSidePageData.prototype.showUpTag = function(){
	};
	SideToSidePageData.prototype.showDownTag = function(){
	};
	SideToSidePageData.prototype.hidUpTag = function(){
	};
	SideToSidePageData.prototype.hidDownTag = function(){
	};
	SideToSidePageData.prototype.keyUp = function(){
		var index = this.getCurLabelIndex();
		var y = this.getStepMap()[1];
		var len = this.getCurPageAssetsLength();
							
 		if(index < y && index < len && this.getCurPageNum() == 1){
			this.navAreaChange(this.getAreaMapTop());
		}else{
			this.navPosChange(-y);
		} 
	};
	SideToSidePageData.prototype.keyDown = function(){
		var index = this.getCurLabelIndex();
		var y = this.getStepMap()[1];
		var len = this.getCurPageAssetsLength();
		if(index > Math.floor(len/y)*y && this.getCurPageNum() == this.getTotlePageNum()){
			this.navAreaChange(this.getAreaMapBottom());
		}else{
			this.navPosChange(y);		
		};	
	};
	SideToSidePageData.prototype.keyLeft = function(){
		var index = this.getCurLabelIndex();
		if(index%this.getStepMap()[1]==0){
			this.navAreaChange(this.getAreaMapLeft());
		}else{
			this.navPosChange(-this.getStepMap()[0]);
		} 
	};
	SideToSidePageData.prototype.keyRight = function(){
		var index = this.getCurLabelIndex();
		var y = this.getStepMap()[1];
		var x = this.getStepMap()[0];	
		if((index%y==(y-1)||index==(this.getCurPageAssetsLength()-1))){
			this.navAreaChange(this.getAreaMapRight());
		}else{
			this.navPosChange(x);
		}; 
	};
		
	SideToSidePageData.prototype.doSelected = function(){
		var strs = this.getCurLabelObj().title;			
		var _pageCode=this.getCurLabelObj().id;
		if (strs == undefined || strs == null || strs == "") {
			return
		}else{
			eval("var _addressObj = " + strs);
			if (_addressObj != undefined && _addressObj != null && _addressObj.length > 0) {
				var jsName = _addressObj[0].js;
				var strUrl = _addressObj[0].url;
				var jsresult = true;
				if (jsName != undefined && jsName != null && jsName != "") {
					try{						
						refreshLog("",_pageCode);
					}catch(e){};
					try {
						setTimeout(function(){jsresult = eval(jsName);},400);
					} catch(e) {
						jsresult = false;
					}
				}
				if (strUrl != undefined && strUrl != null && strUrl != "") {
					try{
						var temp = strUrl.split("?");
						strUrl = temp[0];
						if (temp.length > 1){
							strUrl += "?" + encodeURI(temp[1]);
						}
						refreshLog(strUrl,_pageCode);
						addFocusCookie = this.getCurPageNum();
						setCookieData(this.getCurLabelObj().id,addFocusCookie)
						delCookieLess(cur_cookie);
					}catch(e){};
					setTimeout(function(){window.location.href = clearAllSpace(strUrl);},400);
				};
				return jsresult;
			}
		}
	};	
function extend(subClass,superClass){
    var F = function(){};
    F.prototype = superClass.prototype;
    subClass.prototype = new F();
    subClass.prototype.constructor = subClass;
    subClass.superclass = superClass.prototype;
    if(superClass.prototype.constructor == Object.prototype.constructor){
        superClass.prototype.constructor = superClass;
    }
}

function ele(_elementId){
  var obj = document.getElementById(_elementId);
  if(typeof(obj)!="object"){
	  obj = null;
  }
  return obj;
}
function getClass(_elementId){
	try{
		var className = "";
		var obj = ele(_elementId);
		if(obj!=null){
		 className=obj.className;
		}
		return className;
	}catch(e){}
}
function setClass(_elementId,_className){
	 try{
		 var obj = ele(_elementId);
		 if(obj!=null){
		   obj.className = _className;
		 }
	}catch(e){}
}
function addClass(_elementId,_className){
	try{
		var oldClassName = getClass(_elementId);
		var	newClassName = (oldClassName +" "+ _className).replace(/(^\s*)|(\s*$)/g, "");
		setClass(_elementId,newClassName);
	}catch(e){}
}
function removeClass(_elementId,_className){
	var oldClassName = getClass(_elementId);
	if(oldClassName!=null){
		var reg = new RegExp(_className,"g");
		var newClassName = oldClassName.replace(reg,"").replace(/(^\s*)|(\s*$)/g, "");
		setClass(_elementId,newClassName)
	}
}
function eleGetHtml(_elementId){
	 var text = "";
	 var obj = ele(_elementId);
	 if(obj!=null)
	  text=obj.innerHTML;
	 return text;
}
function eleSetHtml(_elementId,_text){
	 var obj = ele(_elementId);
	 if(obj!=null)
	   obj.innerHTML = _text;
}
function addHtml(_elementId,_text){
	try{
		var oldtext = eleGetHtml(_elementId);
		var newtext = oldtext + _text;
		eleSetHtml(_elementId,newtext);
	}catch(e){}
}
function setCookie(name,value){
	var domain = document.domain;
	var exp = new Date(); 
	exp.setTime(exp.getTime() + (30*24*60*60*1000));
	window.document.cookie = name + "=" + escape (value) + "; expires=" + exp.toGMTString()+";path=/;";
}
function getCookie(sName){
	var aCookie = document.cookie.split("; ");
	for (var i=0; i < aCookie.length; i++)
	{
		var aCrumb = aCookie[i].split("=");
		if (sName == aCrumb[0]){
		  return unescape(aCrumb[1]);
		}
	}
	return null;
}
function delCookie(name){ 
	var exp = new Date(); 
	exp.setTime(exp.getTime() -1000);
	window.document.cookie = name + "= null; expires=" + exp.toGMTString()+";path=/;";
}
function delCookieLess(curCookie)
{			
	var strCookie=document.cookie; 
	var arrCookie=strCookie.split("; "); 
	for(var i=0;i<arrCookie.length;i++){ 
		var arr=arrCookie[i].split("=");  
		if(parseInt(arr[0]) < parseInt(curCookie)){ 
			delCookie(arr[0]);
		} 
	} 
}	
function delAllCookie()
{			
	var strCookie=document.cookie; 
	var arrCookie=strCookie.split("; ");
	for(var i=0;i<arrCookie.length;i++){ 
		var arr=arrCookie[i].split("="); 
		var matchCookie = arr[0].match("_cookie");
		if(matchCookie == "_cookie")
		{
			delCookie(arr[0]);
		}
	} 
}
/** 文字滚动 */
var _scrollTimeout1;
var _scrollTimeout2;
var _obj_textAlign;
var _obj_width;
function scrollText(scrollObj,_scrollWidth,_txtFontSize){
	_obj_textAlign = scrollObj.style.textAlign;
	_obj_width =_scrollWidth;//scrollObj.offsetWidth;
	_scrollTimeout1 = setTimeout(function(){
		var text_width = scrollObj.innerHTML.length*_txtFontSize;
		var text_left = 0;
		var inc = -1;
		if(text_width > _scrollWidth){
				scrollObj.style.textAlign="left";
				scrollObj.style.left=text_left+"px";
				scrollObj.style.width = _scrollWidth*2+"px";
				_scrollTimeout2 = setInterval(function(){
					if(text_left+text_width==_scrollWidth){
						inc = 1;
					}else if(text_left==10){
						inc = -1;
					}
					text_left += inc;
					scrollObj.style.left = text_left+"px";
				},50);
		}
	},500);
}
function stopScroll(scrollObj,_align){
		clearInterval(_scrollTimeout2);
		clearTimeout(_scrollTimeout1);	
		_scrollTimeout1 = null;	
		_scrollTimeout2 = null;
		scrollObj.style.textAlign= (_align=="undefined") ? _obj_textAlign : _align;
		scrollObj.style.left=0;
		scrollObj.style.width = _obj_width+"px";
}
/** end 文字滚动 */
function goToUrl(url,pageCode){
	var _strUrl=encodeURIComponent(url),_pageCode=pageCode;
	try{					
			refreshLog(_strUrl,_pageCode);
	}catch(e){};
	setTimeout(function(){window.location.href = clearAllSpace(url);},400);
}
//去除字符串中所有空格
function clearAllSpace(_str){
	return typeof(_str)=='string'?_str.replace(/\s/g,""):null;
}
//快捷订购
function gotoQuickOrder(_stbid,_ppvid,_backLevel){
	var stbid=_stbid||getCookie("stbid");
	var ppvId=_ppvid||"999992";
	var backLevel=_backLevel||1;
	return clearAllSpace("/template_images/html/quickOrder/order_index.jsp?stbid="+stbid+"&ppvId="+ppvId+"&backLevel="+backLevel+"&random="+Math.random());
	//return "http://125.210.122.176/commonOrderV2/order/recommendProducts.do?stbid="+stbid+"&ppvId="+ppvId+"&backLevel="+backLevel+"&random="+Math.random();

}
// 调用网厅单个产品订购页,_pValue=PPV,_type=平台类型，_backUrl返回地址
function gotoYYTEpglist(_pValue,_type,_backUrl){
	var rootPath="http://125.210.122.18/product/epglist.do";
	var pValue=_pValue,type=_type;
	var backUrl=encodeURI(_backUrl);
	var gotoUrl=rootPath+"?resourceNo="+getCookie("stbid")+"&type="+_type+"&pType=3&pValue="+pValue+"&backUrl="+backUrl;
	var currentUrl=window.location.href;
	if(currentUrl.indexOf(".hzdtv.tv")<0){
		gotoUrl="/templates/iptvtest/runtime/default/template/index/alert/alert.jsp?id=commer"
	}
	window.location.href=clearAllSpace(gotoUrl);
}
// 调用网厅产品包订购页,_tagId=指定id,_type=平台类型，_backUrl返回地址
function gotoYYTList(_tagId,_type,_backUrl){
	var rootPath="http://125.210.122.18/product/list.do";
	var tagId=_tagId,type=_type;
	var backUrl=encodeURI(_backUrl);
	var gotoUrl=rootPath+"?resourceNo="+getCookie("stbid")+"&type="+_type+"&tagId="+tagId+"&backUrl="+backUrl;
	var currentUrl=window.location.href;
	if(currentUrl.indexOf(".hzdtv.tv")<0){
		gotoUrl="/templates/iptvtest/runtime/default/template/index/alert/alert.jsp?id=commer"
	}
	window.location.href=clearAllSpace(gotoUrl);
}
// 调用杭州网厅产品包订购页,_epgCode=门户编码,_type=平台类型，_backUrl返回地址
function gotoYYTIndex(_epgCode,_type,_backUrl){
	var rootPath="http://125.210.122.18/boss-selfpc/index.do";
	var epgCode=_epgCode,type=_type;
	var backUrl=encodeURI(_backUrl);
	var gotoUrl=rootPath+"?resourceNo="+getCookie("stbid")+"&type="+_type+"&epgCode="+_epgCode+"&backUrl="+backUrl;
	var currentUrl=window.location.href;
	if(currentUrl.indexOf(".hzdtv.tv")<0){
		gotoUrl="/templates/iptvtest/runtime/default/template/index/alert/alert.jsp?id=commer"
	}
	window.location.href=clearAllSpace(gotoUrl);
}
///////////////////////////////////////////////////////////
function base64decode(str){  
    var c1, c2, c3, c4;  
    var i, len, out;  
    len = str.length;  
    i = 0;  
    out = "";  
	var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
    while (i < len) {  
        /* c1 */  
        do {  
            c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];  
        }  
        while (i < len && c1 == -1);  
        if (c1 == -1)   
            break;  
        /* c2 */  
        do {  
            c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];  
        }  
        while (i < len && c2 == -1);  
        if (c2 == -1)   
            break;  
        out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));  
        /* c3 */  
        do {  
            c3 = str.charCodeAt(i++) & 0xff;  
            if (c3 == 61)   
                return out;  
            c3 = base64DecodeChars[c3];  
        }  
        while (i < len && c3 == -1);  
        if (c3 == -1)   
            break;  
        out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));  
        /* c4 */  
        do {  
            c4 = str.charCodeAt(i++) & 0xff;  
            if (c4 == 61)   
                return out;  
            c4 = base64DecodeChars[c4];  
        }  
        while (i < len && c4 == -1);  
        if (c4 == -1)   
            break;  
        out += String.fromCharCode(((c3 & 0x03) << 6) | c4);  
    }  
    return out;  
}
function isUndefined(_obj){
	return typeof(_obj)=="undefined";
}
function getPageInfo(){
	try{
		var pageInfoCookiesStr = getCookie("pageInfoCookies");
		var pageInfoCookies =base64decode(pageInfoCookiesStr);
		eval("var out = " + pageInfoCookies);
		return out;
	}catch(err){var out = {profileCode:"",userId:getCookie("userId")};return out;}
}
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); 
	return null;
}
function getColumnName(_fcode,_pType){
	try{
		var _str = "";
		if(_pType=="undefined" || _pType==null || _pType==""){
			_str = _fcode.split("_")[0];
		}else{
			_str = _pType;
		}
		var _r = "";
		switch(_str){
			case "music":
				_r = "音乐";
				break;
			case "news":
				_r = "新闻";
				break;
			case "edu":
				_r = "教育";
				break;
			case "yule":
				_r = "娱乐";
				break;
			case "ddly":
				_r = "少儿";
				break;
			case "gq":
				_r = "高清";
				break;
			case "jlp":
				_r = "纪录";
				break;
			case "lanmu":
				_r = "栏目";
				break;
			case "fashion":
				_r = "生活";
				break;
			case "sport":
				_r = "体育";
				break;
			case "finance":
				_r = "财经";
				break;
			case "mgtv":
				_r = "芒果TV";
				break;
			case null:
				break;
		}
		return _r;
	}catch(e){}
}

function replaceParamVal(paramName,replaceWith,_url) {
    try{
		var oUrl = _url.toString();
		var re=eval('/('+ paramName+'=)([^&]*)/gi');
		var nUrl = oUrl.replace(re,paramName+'='+replaceWith);
		return nUrl;
	}catch(e){}
}

function getStringByName(s,name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = s.match(reg);
    if (r != null) return unescape(r[2]); 
	return null;
}

var PeiZiHandleObj = {
	getUrlHttp:null,
	url:"",
	text:"",
	loadStatus:true,
	_callBackFun:null,
	_callBackOfName:null,
	clearAjax:function(){
		if(PeiZiHandleObj.loadStatus==false){
			PeiZiHandleObj.getUrlHttp.abort();
			PeiZiHandleObj.loadStuts = true;
		}
	},
	getPeiZiUrl:function(_obj,_callBackFun){
		try{ 
			if(!_obj.type)return "#";
			PeiZiHandleObj._callBackFun = _callBackFun;
			PeiZiHandleObj.url = "";
			switch(_obj.type){
				case "1":
					if(typeof(PeiZiHandleObj._callBackFun)=="function"){
						PeiZiHandleObj._callBackFun(clearAllSpace("http://" + document.domain+"/a?f="+_obj.url));
					}
					break;
				case "2":
					if(typeof(PeiZiHandleObj._callBackFun)=="function"){
						PeiZiHandleObj._callBackFun(clearAllSpace(_obj.url));
					}
					break;
					
				case "3":
				  if(typeof(PeiZiHandleObj._callBackFun)=="function"){
					var _u = "http://125.210.228.101/activity/act.jsp?indexUrl="+getCookie("return_url")+"&tvType=1&regionId=330100&stbId="+getCookie("stbid")+"&returnUrl="+LogReferPage+"&piid="+_obj.url;
					PeiZiHandleObj._callBackFun(clearAllSpace(_u));
				  }
				  break;
				case "4":
					var url ="";
					if(_obj.url.indexOf("?") > -1){
						url = _obj.url;
						if(_obj.url.indexOf("indexUrl=") > -1){
							url = replaceParamVal("indexUrl",encodeURIComponent(getCookie("return_url")),url);
						}else{
							url = url +"&indexUrl="+encodeURIComponent(getCookie("return_url"));
						}
						if(_obj.url.indexOf("returnUrl=") > -1){
							url = replaceParamVal("returnUrl",LogReferPage,url);
						}else {
							url = url + "&returnUrl="+LogReferPage;
						}
						if(_obj.url.indexOf("stbid=") > -1){
							url = replaceParamVal("stbid",getCookie("stbid"),url);
						}else {
							url = url + "&stbid="+getCookie("stbid");
						}
						if(_obj.url.indexOf("uid=") > -1){
							url = replaceParamVal("uid",getCookie("uid"),url);
						}else{
							url = url + "&uid="+getCookie("uid");
						}
						if(_obj.url.indexOf("cityCode=") > -1){
							url = replaceParamVal("uid",getCookie("cityCode"),url);
						}else{
							url = url + "&cityCode="+getCookie("cityCode");
						}	
					}else{
						url =_obj.url+"?indexUrl="+encodeURIComponent(getCookie("return_url"))+"&returnUrl="+LogReferPage+"&stbid="+getCookie("stbid")+"&uid="+getCookie("uid")+"&cityCode="+getCookie("cityCode");
					}
					if(typeof(PeiZiHandleObj._callBackFun)=="function"){
						PeiZiHandleObj._callBackFun(clearAllSpace(url));
					}
					break;
				case "5":
					if(typeof(PeiZiHandleObj._callBackFun)=="function"){
						PeiZiHandleObj._callBackFun(clearAllSpace(_obj.url));
					}
					break;
				case "6":
					if(PeiZiHandleObj.loadStatus==true){
						PeiZiHandleObj.loadStatus = false;
						var DGresultCode = getQueryString("result");
						DGresultCode = (DGresultCode==null || DGresultCode=="null") ? "" : DGresultCode;
						var getUrlAjaxReq = ClpsRootUrl+"/template/jsonData/"+"/getPlayUrl.jsp?"+_obj.url;
						PeiZiHandleObj.getUrlHttp = new XMLHttpRequest();
						PeiZiHandleObj.getUrlHttp.abort();
						PeiZiHandleObj.getUrlHttp.open("GET",getUrlAjaxReq,true);
						PeiZiHandleObj.getUrlHttp.send();
						PeiZiHandleObj.getUrlHttp.onreadystatechange = function(){
							if(PeiZiHandleObj.getUrlHttp.readyState==4 && PeiZiHandleObj.getUrlHttp.status==200){
								var str = PeiZiHandleObj.getUrlHttp.responseText;
								PeiZiHandleObj.loadStatus = true;
								try{var ReqObj = eval ("(" + str + ")");}catch(err){var ReqObj ={};}
								PeiZiHandleObj.url = ReqObj.bottomUrl+"&DGresultCode="+DGresultCode;
								if(typeof(PeiZiHandleObj._callBackFun)=="function"){
									PeiZiHandleObj._callBackFun(clearAllSpace(PeiZiHandleObj.url));
								}
							}
						}
					}
					break;	
				default:
					if(_obj.url==null || typeof(_obj.url)=="undefined" || _obj.url=="")_obj.url="#";
					if(typeof(PeiZiHandleObj._callBackFun)=="function"){
						PeiZiHandleObj._callBackFun(clearAllSpace(_obj.url));
					}
			}
		}catch(e){}
	},
	
	getPeiZiText:function(_obj,_callBackOfName){
		try{ 
			if(_obj.text && _obj.text!==""){
				return _obj.text;
			}
			var _fCode = getStringByName(_obj.url,"f");
			if(_fCode==null || _fCode=="null" || _fCode=="")return _obj.text;
			var text = "";
			PeiZiHandleObj._callBackOfName = _callBackOfName;
			if(_obj.type && _obj.type=="2"){
				if(PeiZiHandleObj.loadStatus==true){
						PeiZiHandleObj.loadStatus = false;
						
						
						var getUrlAjaxReq = ClpsRootUrl+"/template/jsonData/"+"/getFolderName.jsp?f="+_fCode;
						PeiZiHandleObj.getUrlHttp = new XMLHttpRequest();
						PeiZiHandleObj.getUrlHttp.abort();
						PeiZiHandleObj.getUrlHttp.open("GET",getUrlAjaxReq,true);
						PeiZiHandleObj.getUrlHttp.send();
						PeiZiHandleObj.getUrlHttp.onreadystatechange = function(){
							if(PeiZiHandleObj.getUrlHttp.readyState==4 && PeiZiHandleObj.getUrlHttp.status==200){
								var str = PeiZiHandleObj.getUrlHttp.responseText;
								PeiZiHandleObj.loadStatus = true;
								try{var ReqObj = eval ("(" + str + ")");}catch(err){var ReqObj ={};}
								PeiZiHandleObj.text = ReqObj.name
								if(typeof(PeiZiHandleObj._callBackOfName)=="function"){
									PeiZiHandleObj._callBackOfName(PeiZiHandleObj.text);
								}
							}
						}
					}
			}
			if(_obj.text && _obj.text!="" && typeof(_obj.text)!="undefined")text = _obj.text;
			return text;
		}catch(e){}
	},
	getPeiZiImg:function(_obj){
		try{ 
			var img = "";
			if(_obj.img && _obj.img!="" && typeof(_obj.img)!="undefined")img = _obj.img;
			return img;
		}catch(e){}
	}
};



//*************************弹窗功能**************************************************//
//ajax获取js文件
function getSwitchStatus(){
	var xmlhttp;
	//发出ajax请求获取访问url状态码,仅在200状态下进行页面跳转
	var xmlhttp=new XMLHttpRequest();//实例化一个XMLHttpRequest
	var jsUrl="/templates/iptvtest/runtime/default/common/js/serviceSwitch.js"+"?"+Math.random();
	xmlhttp.open("GET",jsUrl,true);//调用open()方法	
    var statusTimeoutFlag=window.setTimeout(function(){xmlhttp.abort();},2000); //计时器，超时后处理		
	xmlhttp.send();
	xmlhttp.onreadystatechange=function(){
		if (xmlhttp.readyState == 4) {
			window.clearTimeout(statusTimeoutFlag);
			if(xmlhttp.status == 200) {
				serviceSwitchStr = xmlhttp.responseText;
				try{
					eval(serviceSwitchStr);
					if(typeof(main_wasuSwitch)=="boolean"&&main_wasuSwitch==true){
						if(getQueryString("messageCode")!=null){  //个性化推荐
							if(typeof(overlayFrame_wasuSwitch)=="boolean"&&overlayFrame_wasuSwitch==true){
								CreatOverlayFrameObj.getOverlayFrameData(PerServAjaxUrl,myCallback);
							}							
						}

					}

				}catch(err){
						if(serviceSwitchStr.indexOf("main_wasuSwitch")>0){  //先检查总开关是否存在
							var str1=serviceSwitchStr.split("main_wasuSwitch")[1];
							if(str1.substring(str1.indexOf("=")+1,str1.indexOf(";")).replace(/\s+/g,"")=="true"){  //mainStatus为true
								if(getQueryString("messageCode")!=null){  //个性化推荐
									if(serviceSwitchStr.indexOf("overlayFrame_wasuSwitch")>0){  //先检查个性化弹窗开关是否存在
										var str2=serviceSwitchStr.split("overlayFrame_wasuSwitch")[1];
										if(str2.substring(str2.indexOf("=")+1,str2.indexOf(";")).replace(/\s+/g,"")=="true"){  //overlayFrameStatus为true
											CreatOverlayFrameObj.getOverlayFrameData(PerServAjaxUrl,myCallback);	
										}
								
									}	
								}
								
								
								
							}
						}	
					
					}
				
				
			}
		}
	}
}

var CreatOverlayFrameObj=(function(){
	return {
		getOverlayFrameData:function(_url,_callBack){   //获取接口数据
				var xmlhttp;
				var _rescallBack=_callBack||null;
				var _ifJump=0; //接口返回:是否弹出
				var _jumpUrl=0; //接口返回:链接
				if (window.XMLHttpRequest){
					 xmlhttp=new XMLHttpRequest();//实例化一个XMLHttpRequest
				 }
				xmlhttp.open("GET",_url,true);//调用open()方法	
				var timeoutFlag=window.setTimeout(function(){xmlhttp.abort();	},3000); //计时器，超时后处理
				xmlhttp.send();
				xmlhttp.onreadystatechange=function()
				{
					 if (xmlhttp.readyState == 4) {
						 window.clearTimeout(timeoutFlag);
						 if (xmlhttp.status == 200) {
							var str = xmlhttp.responseText;
							try{var obj = eval ("(" + str + ")");}catch(err){var obj ={};}
							if((obj.ifJump!=undefined)&&(typeof(obj.ifJump)=="boolean")){
								if((obj.tasks!=undefined)&&(obj.tasks.length>0)){
									_ifJump=obj.ifJump;
									_jumpUrl=obj.tasks[0].jumpUrl;
									if(typeof _rescallBack=="function" ) _rescallBack(_ifJump,_jumpUrl);
								}
							}
						}
					 }
				 }
			}
	}
})()

//定义回调函数
function myCallback(_ifJump,_jumpUrl){
	if(_ifJump){
		//发出ajax请求获取访问url状态码,仅在200状态下进行页面跳转
		var xmlhttp=new XMLHttpRequest();//实例化一个XMLHttpRequest
		xmlhttp.open("GET",_jumpUrl,true);//调用open()方法	
		var timeoutFlag1=window.setTimeout(function(){xmlhttp.abort();},3000); //计时器，超时后处理		
		xmlhttp.send();
		xmlhttp.onreadystatechange=function(){
			if (xmlhttp.readyState == 4) {
				 window.clearTimeout(timeoutFlag1);
				 if(xmlhttp.status == 200) {
					setTimeout(function(){iPanel.overlayFrame.location.href=clearAllSpace(_jumpUrl);},1000);//overlay层弹出页面		
				}
			 }
		}
	}
}


getSwitchStatus();

/*
     auther  zhangxj
     date:20170331-lyp
     **/
          function AJAX_OBJ(url, callback, obj){   //obj内可包含param,ID,mark属性
        this.xml_http_obj = new XMLHttpRequest();//http对象
        this.url = url;//请求url
        this.callback = callback;//回调
        this.timeoutFlag=0;//      
        this.reqStatus = false;//请求状态，true为当前请求中，未结束
        if(typeof obj=="undefined"|| obj==null){    //兼容之前没传obj的情况
        	this.time=5000;//超时时间5s
        	this.param = null;//传透参数，不处理,默认为null
        	this.ID = "none";  //唯一接口标识
        	this.mark = null;//该请求是否为重要请求，若重要，传入参数1，否则不处理,默认为null，重要请求会跳转错误提示页
        }else{
        	if(typeof obj.ID=="undefined" || obj.ID==null){   //兼容组件里的该方法
                this.time=5000;//超时时间5s
                this.param = obj;
                this.ID = "none";  //唯一接口标识
                this.mark = null;//该请求是否为重要请求，若重要，传入参数1，否则不处理,默认为null，重要请求会跳转错误提示页
            }else{
                this.time=obj.time || 5000;//超时时间获取，默认为5s
                this.param = obj.param || null;//传透参数，不处理,默认为null
                this.ID = obj.ID;  //唯一接口标识,必传
                this.mark = obj.mark || null;//该请求是否为重要请求，若重要，传入参数1，否则不处理,默认为null，重要请求会跳转错误提示页
            }
        }
        
        /*
         请求：
         type： 值为true表示异步请求，false表示同步请求
         post_parm: get请求时不能传，传了就表示post请求，并且参数本身是post请求提交的参数
         **/
        this.send = function(type,post_parm,contentType){  //contentType为数据回发到服务器时浏览器使用的编码类型
            if(this.reqStatus==true)return;
            this.reqStatus = true;
            var request_url = this.url;
            var self = this;
			
            if (type == "true"){//异步请求
                this.xml_http_obj.onreadystatechange = function(){//状态监测方法
					self.check_status();
				};
				if(post_parm){
                    this.xml_http_obj.open("POST", request_url, true);//异步，post
                    if(contentType=="undefined" || contentType==null){   //默认类型
                    	this.xml_http_obj.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
                    }else{                                              //传递类型
                    	this.xml_http_obj.setRequestHeader("Content-Type",contentType);
                    }            
                }else{
                    this.xml_http_obj.open("GET", request_url, true);//异步，get
                }
            }else{
                if(post_parm){
                    this.xml_http_obj.open("POST", request_url, false);//同步，post
                    if(contentType=="undefined" || contentType==null){   //默认类型
                    	this.xml_http_obj.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
                    }else{                                              //传递类型
                    	this.xml_http_obj.setRequestHeader("Content-Type",contentType);
                    } 
                }else{
                    this.xml_http_obj.open("GET", request_url, false);//同步，get
                }
            }
            this.timeoutFlag=window.setTimeout(function(){//计时器，超时后处理
                self.reqStatus = false;
                self.timeoutTips(self.param);
                self.xml_http_obj.abort();
            },this.time);

            this.xml_http_obj.send(post_parm || null);//发送请求，有post参数则提交
			if(type=="false"){
				window.clearTimeout(this.timeoutFlag);
				this.reqStatus = false;
                this.callback(this.xml_http_obj.responseText,this.param);//回调
			}
        };

        this.check_status = function(){//状态监测值获取
			//alert(this.xml_http_obj.readyState+"_1_"+this.xml_http_obj.status)
            if(this.xml_http_obj.readyState == 4){
                window.clearTimeout(this.timeoutFlag);
                if(this.xml_http_obj.status == 200){
					//alert(this.xml_http_obj.readyState+"_2_"+this.xml_http_obj.status)
                    this.reqStatus = false;
                    this.callback(this.xml_http_obj.responseText,this.param);//回调
                }else{
                    this.reqStatus = false;
                    this.errorCallBack(this.xml_http_obj.status,this.param);//错误，传错误值如：500,404
                    this.xml_http_obj.abort();
                }
            }
        };
        this.cancelRequest = function(){//取消请求
            this.reqStatus = false;
            this.xml_http_obj.abort();
        };
        this.errorCallBack=function(){   //错误处理，默认不处理，需要的话重写，并接受错误参数
            if(this.mark!=null){    
                this.href();
            }
        };
        this.timeoutTips=function(){  //超时处理，默认不处理，需要的话重写。
            if(this.mark!=null){  
                this.href();
            }
        };

        this.href=function(){
            var id=this.ID;
            setTimeout(function(){window.location.href =clearAllSpace( "/template_html/hzhd2.2/public/html/ajax_errorMsg.jsp?backLevel=2&ID="+id);},400); //返回层级以及唯一接口标识
        }
    }
//设置配置项链接
function getPeiziUrl(_obj,_callBackFun){
	var peiziUrl;
	var thisUrl=encodeURIComponent(window.location.href);
	switch(_obj.type){
		case "1":	//热点
			peiziUrl = clearAllSpace(_obj.url);
			if(typeof(_callBackFun)=="function"){
				_callBackFun(peiziUrl);
			}
			break;	
		case "2": //指定栏目
			peiziUrl = clearAllSpace(_obj.url);
			
			if(typeof(_callBackFun)=="function"){
				_callBackFun(peiziUrl);
			}
			break;	
		case "3": //活动
			peiziUrl = clearAllSpace("http://125.210.228.101/activity/act.jsp?indexUrl="+getCookie("return_url")+"&tvType=1&regionId=330100&stbId="+getCookie("stbid")+"&returnUrl="+thisUrl+"&piid="+_obj.url);
			if(typeof(_callBackFun)=="function"){
				_callBackFun(peiziUrl);
			}
			break;
		case "4"://其他出处
			peiziUrl = _obj.url;
			var url = "";
			if(peiziUrl.indexOf("?") > -1){
				url = peiziUrl;		
				if(peiziUrl.indexOf("indexUrl=") > -1){
					url = replaceParamVal("indexUrl",encodeURIComponent(getCookie("return_url")),url);
				}else{
					url = url +"&indexUrl="+encodeURIComponent(getCookie("return_url"));
				}
				if(peiziUrl.indexOf("returnUrl=") > -1){
					url = replaceParamVal("returnUrl",thisUrl,url);
				}else {
					url = url + "&returnUrl="+thisUrl;
				}
				if(peiziUrl.indexOf("stbid=") > -1){
					url = replaceParamVal("stbid",getCookie("stbid"),url);
				}else {
					url = url + "&stbid="+getCookie("stbid");
				}
				if(peiziUrl.indexOf("uid=") > -1){
					url = replaceParamVal("uid",getCookie("uid"),url);
				}else{
					url = url + "&uid="+getCookie("uid");
				}
				if(peiziUrl.indexOf("cityCode=") > -1){
					url = replaceParamVal("uid",getCookie("cityCode"),url);
				}else{
					url = url + "&cityCode="+getCookie("cityCode");
				}	
			}else{
				url =_obj.url+"?indexUrl="+encodeURIComponent(getCookie("return_url"))+"&returnUrl="+thisUrl+"&stbid="+getCookie("stbid")+"&uid="+getCookie("uid")+"&cityCode="+getCookie("cityCode");
			}
			peiziUrl= clearAllSpace(url);
			if(typeof(_callBackFun)=="function"){
				_callBackFun(peiziUrl);
			}
			break;	
		case "5"://详情页
			peiziUrl=clearAllSpace(_obj.url);
			if(typeof(_callBackFun)=="function"){
				_callBackFun(peiziUrl);
			}
			break;
		case "6"://单点播放
			var singleAjaxData = new GetAjaxData();
			singleAjaxData.ajaxUrl =ClpsRootUrl+"/template/jsonData/"+"getPlayUrl.jsp?"+_obj.url+"&subMeidaIndex=1";
			singleAjaxData.getAjaxFunTb();
			peiziUrl = clearAllSpace(singleAjaxData.ajaxData.bottomUrl);
			if(typeof(_callBackFun)=="function"){
				if(peiziUrl!="null"){
					_callBackFun(peiziUrl);
				}
			}
			break;
		case "13": //站内html页
			peiziUrl = clearAllSpace(_obj.url);
			
			if(typeof(_callBackFun)=="function"){
				_callBackFun(peiziUrl);
			}
			break;	
		}
		
	return clearAllSpace(peiziUrl);
	
}
