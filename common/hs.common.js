//  立即执行函数
+function (f) {


    //  判断参数是否是一个 function
    if (typeof f === 'function') {
        //
        f(window);
    }


}(function (v) {
    //  v 代表 window
    var unload_fun_list = new Array();
    var load_fun_list = new Array();
    var list = [], backList = [];
    var focusList = [], blurList = [], beginAreaList = [], blurAreaList = [], selectList = [];
    var fObjList = [];
    var isTouchFlag = false;
    var clickFn = function () {
        if (isTouchFlag) {
            return;
        }
        var obj = _frameWork.objects[_frameWork.getId(this)];
        console.log('click:mouse ->' + obj.objid);
        _frameWork.areaLastFocus[obj.group] = null;
        _frameWork.initFocus(obj.objid);
        doSelect(obj.group, obj.objindex, obj.objid);
        _frameWork.execSelect(obj.group, obj.objid, obj.objindex);
    };
    var bindEvent = function () {
        if (window.addEventListener) {
            return function (target, evType, handler) {
                target.addEventListener(evType, handler);
            };
        } else if (window.attachEvent) {
            return function (target, evType, handler) {
                target.attachEvent('on' + evType, function () {
                    handler.call(target, window.event);
                });
            };
        } else {
            return function (target, evType, handler) {
                target['on' + evType] = handler;
            };
        }
    };
    var unbindEvent = function (target, evType, handle) {
        if (target.removeEventListener) {
            target.removeEventListener(evType, handle, false);
        } else if (target.detachEvent) {
            target.detachEvent('on' + evType, handle);
        } else {
            target['on' + evType] = null;
        }
    };
    var touch_even = function (element, callBack) {
        // 1. 定义一些必须的变量
        // 开始的时间
        var startTime = 0;
        // 标示 是否触发了 move事件
        var isMove = false;
        // 定义 最大的 延迟时间
        var maxTime = 250;

        var clientX_start, clientX_end;
        var clientY_start, clientY_end;
        var minRange = 10;
        var direction;

        bindEvent()(element, 'touchstart', function (even) {
            var event = event || window.event;
            clientX_start = event.touches[0].clientX;
            clientY_start = event.touches[0].clientY;

            clientX_end = clientX_start;
            clientY_end = clientY_start;

            // 记录开始时间
            startTime = Date.now();
            // 修正 我们标示变量的值
            isMove = false;
        });
        bindEvent()(element, 'touchmove', function (even) {
            var event = event || window.event;
            clientX_end = event.touches[0].clientX;
            clientY_end = event.touches[0].clientY;

            isMove = true;
        });
        bindEvent()(element, 'touchend', function (even) {
            var event = event || window.event;
            var distanceX = clientX_end - clientX_start;
            var distanceY = clientY_end - clientY_start;

            //判断滑动方向
            if (Math.abs(distanceX) > Math.abs(distanceY) && distanceX > 0) {
                // console.log('往右滑动');
                callBack('move_r', even);
            } else if (Math.abs(distanceX) > Math.abs(distanceY) && distanceX < 0) {
                // console.log('往左滑动');
                callBack('move_l', even);
            } else if (Math.abs(distanceX) < Math.abs(distanceY) && distanceY < 0) {
                // console.log('往上滑动');
                callBack('move_t', even);
            } else if (Math.abs(distanceX) < Math.abs(distanceY) && distanceY > 0) {
                // console.log('往下滑动');
                callBack('move_b', even);
            } else {
                // console.log('点击未滑动');
                // 判断 延迟延迟的时间
                if ((Date.now() - startTime) > maxTime) {
                    // console.log('太长了,都属于长按了');
                    return;
                }
                callBack('click', even);
            }
        });
    };

    var cssText = function (el, value) {
        if (_frameWork.isString(value)) {
            if (el.style.cssText.length > 1) {
                el.style.cssText += value;
            } else {
                var style = value.split(';');
                for (var m = 0; m < style.length; ++m) {
                    var item = style[m].split(':');
                    el.style[item[0]] = item[1];
                }
            }
            return true;
        }
    };

    var _frameWork = {
        /*核心参数*/
        objects: {},
        focObj: null,
        areaLastFocus: {},
        prevFocObj: null,
        prevArea: null,
        focArea: null,
        direction: null,
        defaultUpCode: [1, 38],
        defaultDownCode: [2, 40],
        defaultLeftCode: [3, 37],
        defaultRightCode: [4, 39],
        defaultDoCode: [13],
        defaultBackCode: [8, 27, 45, 340],
        defaultNumberCode: [48, 49, 50, 51, 52, 53, 54, 55, 56, 57],

        stopBubble: function (e) {
            //如果提供了事件对象，则这是一个非IE浏览器
            if (e && e.stopPropagation)
            //因此它支持W3C的stopPropagation()方法
                e.stopPropagation();
            else
            //否则，我们需要使用IE的方式来取消事件冒泡
                window.event.cancelBubble = true;
        },
        defaultEvenFn: function () {
            if (backList.length > 0) {
                this.recoverAllEvenCode();
            } else {
                this.addEvenToList(this.defaultUpCode, function () {
                    _frameWork.up();
                });
                this.addEvenToList(this.defaultDownCode, function () {
                    _frameWork.down();
                });
                this.addEvenToList(this.defaultLeftCode, function () {
                    _frameWork.left();
                });
                this.addEvenToList(this.defaultRightCode, function () {
                    _frameWork.right();
                });
                this.addEvenToList(this.defaultDoCode, function () {
                    _frameWork.doSelect();
                });
                this.addEvenToList(this.defaultBackCode, function () {
                    _frameWork.memoryO.goBack();
                });
            }

        },
        // 禁用上下左右确认返回键的响应, 可恢复原有状态
        forbiddenAllEvenCode: function () {
            // 备份list状态
            for (var i = 0; i < list.length; i++) {
                backList.push(list[i]);
            }
            this.addEvenToList(this.defaultUpCode, function () {
            });
            this.addEvenToList(this.defaultDownCode, function () {
            });
            this.addEvenToList(this.defaultLeftCode, function () {
            });
            this.addEvenToList(this.defaultRightCode, function () {
            });
            this.addEvenToList(this.defaultDoCode, function () {
            });
            this.addEvenToList(this.defaultBackCode, function () {
            });
        },
        recoverAllEvenCode: function () {
            list = backList;
            backList = [];
        },
        /*默认事件处理*/
        defaultBackFn: function () {
            this.addEvenToList(this.defaultBackCode, function () {
                _frameWork.memoryO.goBack();
            });
        },
        /*默认事件处理*/
        defaultDoFn: function () {
            this.addEvenToList(this.defaultDoCode, function () {
                _frameWork.doSelect();
            });
        },
        /**
         *
         * @param _group Array
         * @param _fn
         */
        addFocus: function (_group, _fn) {
            this.addEvenToList(_group, _fn, focusList);
        },
        /**
         *
         * @param _group Array
         * @param _fn
         */
        addBeginArea: function (_group, _fn) {
            this.addEvenToList(_group, _fn, beginAreaList);
        },
        /**
         *
         * @param _group Array
         * @param _fn
         */
        addBlur: function (_group, _fn) {
            this.addEvenToList(_group, _fn, blurList);
        },
        /**
         *
         * @param _group Array
         * @param _fn
         */
        addBlurArea: function (_group, _fn) {
            this.addEvenToList(_group, _fn, blurAreaList);
        },
        /**
         *
         * @param _group Array
         * @param _fn
         */
        addSelect: function (_group, _fn) {
            this.addEvenToList(_group, _fn, selectList);
        },
        hasClass: function (obj, c_name) {
            var oldClass = obj.className;
            var reg = new RegExp(' ' + c_name + ' ', 'g');
            return reg.test(' ' + oldClass + ' ');
        },

        addClass: function (obj, c_name) {
            if (this.hasClass(obj, c_name)) {
                return;
            }
            var oldClass = obj.className;
            var newClass = (oldClass + ' ' + c_name).replace(/(^\s*)|(\s*$)/g, '');
            obj.className = newClass;
        },

        removeClass: function (obj, c_name) {
            var oldClass = obj.className;
            var reg = new RegExp(c_name, 'g');
            var newClass = oldClass.replace(reg, '').replace(/(^\s*)|(\s*$)/g, '');
            obj.className = newClass;
        },

        initFocus: function (objid, holdOut) {

            if (objid == '' || objid == null || this.isDomExist(objid)) {
                console.log('ERROR:hs.initFocus(' + objid + '),objid is not defined!');
                return;
            }
            this.doFocus(objid, holdOut);
        },

        doFocus: function (jdomid, holdOut) {
            var holdOutFlag = holdOut || false;
            if (jdomid == null)
                return;
            var newObj = this.objects[jdomid];
            if (!newObj) {
                console.log('ERROR : ' + jdomid + '未注册fObject对象!');
                return;
            }

            var area = newObj.group;

            this.prevFocObj = this.focObj;

            if (this.focObj != null) {
                if (!holdOutFlag) {
                    this.focObj.doBlur();
                    this.execBlur(this.focObj.group, this.focObj.objid, this.focObj.objindex);
                }
                if (this.focObj.group != area) {
                    this.prevArea = this.focObj.group;
                    if (this.onBlurArea) {
                        this.onBlurArea(this.focObj);
                    }
                    this.execBlurArea(this.focObj.group, this.focObj.objid, this.focObj.objindex);
                }
            }

            var isAreaLastFocus = (typeof (this.areaLastFocus[area]) != 'undefined') && (this.areaLastFocus[area] != null) && (this.prevFocObj != null) && (area != this.prevFocObj.group)

            if (this.focObj == null || this.focObj.group != area) {
                var obj = isAreaLastFocus ? this.areaLastFocus[area] : newObj;
                if (this.onBeginArea) {
                    this.onBeginArea(obj);
                }
                this.execBeginArea(obj.group, obj.objid, obj.objindex);
            }

            this.focArea = area;

            //this.focObj 新焦点
            if (isAreaLastFocus) {
                this.focObj = this.areaLastFocus[area];
                this.areaLastFocus[area].doFocus();
                this.execFocus(this.areaLastFocus[area].group, this.areaLastFocus[area].objid, this.areaLastFocus[area].objindex);
            } else {    //当区域对象无的的时候
                this.focObj = newObj;
                this.areaLastFocus[newObj.group] = this.focObj;
                this.focObj.doFocus();
                this.execFocus(this.focObj.group, this.focObj.objid, this.focObj.objindex);
            }

        },
        execFocus: function (group, objid, objindex) {
            this.initExec(group, objid, objindex, focusList);
        },
        execBlur: function (group, objid, objindex) {
            this.initExec(group, objid, objindex, blurList);
        },
        execBeginArea: function (group, objid, objindex) {
            this.initExec(group, objid, objindex, beginAreaList);
        },
        execBlurArea: function (group, objid, objindex) {
            this.initExec(group, objid, objindex, blurAreaList);
        },
        execSelect: function (group, objid, objindex) {
            this.initExec(group, objid, objindex, selectList);
        },
        initExec: function (group, objid, objindex, _list) {
            for (var k = 0; k < _list.length; k++) {
                if ((typeof _list[k].key) == 'number') {
                    if (_list[k].key == group) {
                        _list[k].action(group, objid, objindex);
                    }
                } else {
                    for (var m = 0; m < _list[k].key.length; m++) {
                        if (_list[k].key[m] == group) {
                            _list[k].action(group, objid, objindex);
                            return;
                        }
                    }
                }
            }
        },
        up: function () {
            if (this.focObj == null || this.focObj.up == null) {
                console.log('ERROR : doUp error!')
                return;
            }
            this.direction = 1;
            var up = this.focObj.up;

            if (typeof (up) == 'function') {
                this.focObj.doUp();
                return;
            }

            while (up != null && this.isDomExist(up)) {
                console.log('ERROR:UP ' + up + ' Not Found');
                return;
            }
            this.doFocus(up);
        },
        down: function () {
            if (this.focObj == null || this.focObj.down == null) {
                console.log('ERROR : doDown error!')
                return;
            }
            this.direction = 2;
            var down = this.focObj.down;

            if (typeof (down) == 'function') {
                this.focObj.doDown();
                return;
            }
            while (down != null && this.isDomExist(down)) {
                console.log('ERROR:DOWN ' + down + ' Not Found');
                return;
            }

            this.doFocus(down);
        },
        left: function () {
            if (this.focObj == null || this.focObj.left == null) {
                console.log('ERROR : doLeft error!')
                return;
            }
            this.direction = 3;
            var left = this.focObj.left;

            if (typeof (left) == 'function') {
                this.focObj.doLeft();
                return;
            }
            while (left != null && this.isDomExist(left)) {
                console.log('ERROR:LEFT ' + left + ' Not Found');
                return;
            }
            this.doFocus(left);
        },
        right: function () {
            if (this.focObj == null || this.focObj.right == null) {
                console.log('ERROR : doRight error!')
                return;
            }
            this.direction = 4;
            var right = this.focObj.right;

            if (typeof (right) == 'function') {
                this.focObj.doRight();
                return;
            }
            while (right != null && this.isDomExist(right)) {
                console.log('ERROR:RIGHT ' + right + ' Not Found');
                return;
            }
            this.doFocus(right);
        },
        doSelect: function () {
            if (!this.focObj) {
                console.log('ERROR : doSelect error!')
                return;
            }
            this.focObj.doSelect();
            this.execSelect(this.focObj.group, this.focObj.objid, this.focObj.objindex);
        },
        add: function (fObject) {
            var oid = fObject.objid;
            if (this.isDomExist(oid)) {
                console.log('dom:' + oid + '未存在!');
                return;
            }
            this.objects[oid] = fObject;
            touch_even($(oid), function (type, even) {
                isTouchFlag = true;
                console.log(type + ':touch->' + fObject.objid);
                if (type == 'click') {
                    _frameWork.areaLastFocus[fObject.group] = null;
                    _frameWork.initFocus(fObject.objid);
                    doSelect(fObject.group, fObject.objindex, fObject.objid);
                } else if (type == 'move_l' && !fObject.touchCallback) {
                    _frameWork.memoryO.goBack();
                } else if (fObject.touchCallback && typeof (fObject.touchCallback) == 'function') {
                    fObject.touchCallback(type, even);
                }
            });

            //绑定事件前先解绑下, 防止事件多次重复绑定
            unbindEvent($(oid), 'click', clickFn);
            bindEvent()($(oid), 'click', clickFn);
        },
        isDomExist: function (objid) {
            if ($(objid)) {
                return false;
            } else {
                return true;
            }
        },
        getId: function (dom) {
            if (dom) {
                return dom.getAttribute('id');
            } else {
                console.log('dom 为空');
                return;
            }

        },
        fObjCommit: function () {
            for (var i = 0; i < fObjList.length; i++) {
                _frameWork.add(fObjList[i]);
            }
            fObjList = [];
        },
        /**
         *
         * @param ele
         * @param attr
         * @returns {*}
         */
        getStyle: function (ele, attr) {
            if (window.getComputedStyle) {
                return window.getComputedStyle(ele, null)[attr];
            }
            return ele.currentStyle[attr];
        },

        screenWidth: function () {
            return screen.width == 0 ? 1280 : screen.width;
        },

        screenHeight: function () {
            return screen.height == 0 ? 720 : screen.height;
        },

        windowWidth: function () {
            if (window.innerWidth) {
                return window.innerWidth;
            } else if ((document.body) && (document.body.clientWidth)) {
                return document.body.clientWidth;
            }
        },

        windowHeight: function () {
            if (window.innerHeight) {
                return window.innerHeight;
            } else if ((document.body) && (document.body.clientHeight)) {
                return document.body.clientHeight;
            }
        },
        getBaseUrl: function (projectName) {
            if (!projectName) {
                alert('缺少必要参数projectName');
            }
            return location.href.substring(0, location.href.indexOf(projectName)) + projectName + '/';
        },

        /* author: meizz
         将 Date 转化为指定格式的String
         月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
         年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
         例子：
         formatDate('yyyy-MM-dd hh:mm:ss.S', new Date()) ==> 2006-07-02 08:09:04.423
         formatDate('yyyy-M-d h:m:s.S', new Date())      ==> 2006-7-2 8:9:4.18 */
        formatDate: function (_fmt, _date) {
            if (_date instanceof Date) {
                var o = {
                    'M+': _date.getMonth() + 1,
                    //月份
                    'd+': _date.getDate(),
                    //日
                    'h+': _date.getHours(),
                    //小时
                    'm+': _date.getMinutes(),
                    //分
                    's+': _date.getSeconds(),
                    //秒
                    'q+': Math.floor((_date.getMonth() + 3) / 3),
                    //季度
                    'S': _date.getMilliseconds() //毫秒
                };

                if (/(y+)/.test(_fmt)) {
                    _fmt = _fmt.replace(RegExp.$1, (_date.getFullYear() + '').substr(4 - RegExp.$1.length));
                }

                for (var k in o) {
                    if (new RegExp('(' + k + ')').test(_fmt)) {
                        _fmt = _fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
                    }
                }

                return _fmt;
            } else {
                return '';
            }
        },

        /*
        接口说明：
        功能：从秒转换到字符串
        参数：_second，大于0，小于一天（24小时）
        返回值：输出字符串格式为hh:mm:ss
                小于0，或大于一天，则返回'00:00:00'
        */
        formatTime: function (_second) {
            if (typeof _second != 'number' || _second < 0 || _second >= 86400) {
                return '00:00:00';
            }

            var o = {
                'h+': parseInt(_second / 3600),
                'm+': parseInt(_second / 60 % 60),
                's+': _second % 60
            }

            var _fmt = 'hh:mm:ss';
            for (var k in o) {
                if (new RegExp('(' + k + ')').test(_fmt)) {
                    _fmt = _fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
                }
            }
            return _fmt;
        },

        /*
        接口说明：
        功能：从hh:mm:ss格式字符串转换到数字秒
        参数：hh:mm:ss格式字符串
        返回值：输出数字秒
        */
        formatToTime: function (_stime) {
            if (typeof _stime != 'string' || _stime.length != 8) {
                return 0;
            }

            var a = _stime.split(':');
            if (a.length != 3) {
                return 0;
            }
            var sum = parseFloat(a[0]) * 3600 + parseFloat(a[1]) * 60 + parseFloat(a[2]);
            try {
                return sum;
            } catch (e) {
                return 0;
            }
        },

        /*
        接口说明：
        功能：关闭直播广告
              目前此方法只在茁壮中间件有效
        */
        stopAD: function () {
            if (_isIpanel()) {
                iPanel.setBootAdStatus(0);
            }
        },


        /*
        接口说明：
        功能：页面跳转到一个指定的地址
        参数：_url，要跳转到的地址
        */
        go: function (_url) {
            window.location.href = _url;
        },

        /*
        接口说明：
        功能：指定页面onload的处理方法
        参数：fn，需要处理的方法
              isAdd，是否为添加方式
                     如果是添加方式，保留前次添加的所有方法
                     如果非添加方式，会清除前次添加的所有方法
        */
        load: function (fn, isAdd) {
            if (typeof fn === 'function') {
                if (typeof isAdd === 'boolean' && isAdd == false) {
                    load_fun_list = [];
                }

                load_fun_list.push(fn);
                window.onload = function () {
                    for (var i = 0; i < load_fun_list.length; i++) {
                        load_fun_list[i]();
                    }
                };
            }
        },

        /*
        接口说明：
        功能：指定页面onunload的处理方法
        参数：fn，需要处理的方法
              isAdd，是否以添加方式指定
                     如果是添加方式，保留前次添加的所有方法
                     如果非添加方式，会清除前次添加的所有方法
        */
        unload: function (fn, isAdd) {
            if (typeof fn === 'function') {
                if (typeof isAdd === 'boolean' && isAdd == false) {
                    unload_fun_list = [];
                }

                unload_fun_list.push(fn);
                window.onunload = function () {
                    for (var i = 0; i < unload_fun_list.length; i++) {
                        unload_fun_list[i]();
                    }
                };
            }
        },
        /*事件监听增加处理*/
        defaultFun: function (key_code) {
            var ret = 1;
            for (var k = 0; k < list.length; k++) {
                for (var m = 0; m < list[k].key.length; m++) {
                    if (list[k].key[m] == key_code) {
                        this;
                        if (this.arrayIsContains(hs.defaultNumberCode, key_code)) key_code -= 48;
                        list[k].action(key_code);
                        ret = 0;
                        break;
                    }
                }
            }
            return ret;
        },
        /*
        接口说明：
        功能：在默认处理监听事件的方法中，增加对一组按键值的处理
        参数：_key，按键值列表，为整形的数组
              _fun，对应按键值的处理方法
        */
        addEvenToList: function (_key, _fun, _list) {
            var ls = _list || list;
            var isExist = false;
            var obj = {key: _key, action: _fun};
            for (var k = 0; k < _key.length; k++) {
                isExist = this.removeFromList(_key[k], obj, ls);
            }
            if (!isExist) {
                ls.push(obj);
            }
        },

        /*
           接口说明：
           功能：在默认处理监听事件的方法中，删除对单个按键值的处理
           参数：_key，按键值，为单个整形值
           */
        removeFromList: function (_key, obj, _list) {
            // console.log(_key);
            var ls = _list || list;
            var isExist = false;
            for (var k = 0; k < ls.length; k++) {
                for (var m = 0; m < ls[k].key.length; m++) {
                    if (ls[k].key[m] == _key) {
                        ls.splice(k, 1, obj);
                        isExist = true;
                        break;
                    }
                }
            }
            return isExist;
        },
        addRecord: function (id, code, isTW, title) {
            //增加记录功能
            this.ajax.get('http://21.254.5.190/UTLService/UIL/Trace/Handler.ashx?stbid=' + this.mw.getSTBID() + '&is_tw=' + isTW + '&cid=' + id + '&ctitle=' + title + '&mcode=' + code, function (data) {
                console.log(data);
            }, 0, function (msg) {

            }, 3000);
        },
        /**
         * ajax
         */
        AjaxObject: function () {
            var geturl1 = 'http://21.254.5.190/UnityService/WcfService.svc/';
            // 省网图文
            var geturl2 = 'http://21.254.5.190/UTLService/UIL/Publish/Handler.ashx';
            // 杭网图文
            var geturl3 = 'http://vas-add.wasu.cn/UTLService/UIL/Publish/Handler.ashx';

            var ajaxUrl = '';
            var timeout = 500;
            var _t = null;
            var xmlhttp = null;
            var loadStuts = false;
            this.async = true;
            var that = this;

            var init = function (_url, _type, _timeout) {
                if (typeof _url == 'string') {
                    ajaxUrl = _url;
                }

                if (typeof _type == 'number') {
                    switch (_type) {
                        case 1:
                            ajaxUrl = geturl1 + ajaxUrl;
                            break;
                        case 2:
                            ajaxUrl = geturl2 + ajaxUrl;
                            break;
                        case 3:
                            ajaxUrl = geturl3 + ajaxUrl;
                            break;
                    }
                }

                if (typeof _timeout == 'number') {
                    timeout = _timeout;
                }

            };

            var destroy = function () {
                if (xmlhttp != null) {
                    xmlhttp.abort();
                    xmlhttp = null;
                }
                loadStuts = false;
            };

            /*

              接口说明：
              功能：发起ajax请求
              参数：_method，请求方法，为“POST”或“GET”
                    _url，请求地址
                    _data，只有方法为“POST”时有效，post数据，为数组类型，数组元素遵循“变量名=变量值”格式
                    _fun，正确返回的回调地址
                    _type, 前缀地址
                    _err，错误返回执行函数
                    _timeout，超时时间
          */

            var ajax_method = function (_method, _url, _data, _fun, _type, _err, _timeout) {
                if (typeof _method != 'string' || ('POST' != _method && 'GET' != _method)) {
                    _err('_method ERROR!');
                }
                init(_url, _type, _timeout);
                if (ajaxUrl) {
                    destroy();
                    xmlhttp = new XMLHttpRequest();

                    // 将 object 类型的参数转换为 key=value&key=value
                    if (typeof _data === 'object') {
                        var tempArr = []
                        for (var key in _data) {
                            var value = _method == 'GET' ? key + '=' + encodeURIComponent(_data[key]) : key + '=' + _data[key];
                            tempArr.push(value);
                        }
                        _data = tempArr.join('&')
                    }
                    if (xmlhttp != null) {
                        xmlhttp.open(_method, ajaxUrl, that.async);
                        if (that.async) {
                            setMyTimeOut(_err);
                            xmlhttp.onreadystatechange = function () {
                                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                                    if (loadStuts) return;
                                    clearTimeOut();
                                    var str = xmlhttp.responseText;
                                    _fun(str);
                                }
                            };
                        }

                        if ('POST' == _method && _data != null) {
                            xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                            xmlhttp.send(_data);
                        } else {
                            xmlhttp.send();
                        }

                        if (!that.async) {
                            var str = xmlhttp.responseText;
                            _fun(str);
                        }
                    } else {
                        _err('xmlhttp is null!');
                    }
                }
            };

            this.get = function (_url, _fun, _type, _err, _timeout) {
                ajax_method('GET', _url, null, _fun, _type, _err, _timeout);
            };

            this.post = function (_url, _data, _fun, _type, _err, _timeout) {
                ajax_method('POST', _url, _data, _fun, _type, _err, _timeout);
            };

            var setMyTimeOut = function (_err) {
                clearTimeOut();
                _t = setTimeout(function () {
                        dealErr(_err);
                    },
                    timeout);
            };

            var clearTimeOut = function (_err) {
                if (_t != null) {
                    clearTimeout(_t);
                }
            };

            var dealErr = function (_err) {
                if (loadStuts == false) {
                    loadStuts = true;
                    xmlhttp.abort();
                    _err('请求超时!');
                }
            };

        },

        /**
         * xml
         */
        xml: {
            loadXML: function (xmlFile) {
                var xmlDoc;
                if (!!window.ActiveXObject || 'ActiveXObject' in window) {
                    var xmlDomVersions = ['MSXML.2.DOMDocument.6.0', 'MSXML.2.DOMDocument.3.0', 'Microsoft.XMLDOM'];
                    for (var i = 0; i < xmlDomVersions.length; i++) {
                        try {
                            xmlDoc = new ActiveXObject(xmlDomVersions[i]);
                            xmlDoc.async = false;
                            xmlDoc.loadXML(xmlFile);
                            break;
                        } catch (e) {
                        }
                    }
                } else if (isFirefox = navigator.userAgent.indexOf('Firefox') > 0) { //火狐浏览器
                    xmlDoc = document.implementation.createDocument('', '', null);
                    xmlDoc.load(xmlFile);
                } else { //谷歌浏览器
                    domParser = new DOMParser();
                    xmlDoc = domParser.parseFromString(xmlFile, 'text/xml');
                }
                return xmlDoc;
            }
        },
        /**
         * media
         */
        mw: {
            /*视频播放参数*/
            lpos: 1,
            tpos: 1,
            wpos: 1,
            hpos: 1,
            playurl: [],
            m_index: 0,

            /*
              接口说明：
              功能：判断中间件是否为茁壮提供
             */
            _isIpanel: function () {
                var appVersion = navigator.appVersion;
                if (appVersion.indexOf('iPanel') != -1) {
                    return !this._isEnRich();
                }
                return false;
            },

            /*
                接口说明：
                功能：判断中间件是否为影立驰提供
            */
            _isEnRich: function () {
                if ((typeof SysInfo != 'undefined') && (typeof SysInfo == 'object') && ('EnRich' == SysInfo.mdwName)) {
                    return true;
                }
                return false;
            },
            /*
            接口说明：
            功能：获取STBID
            */
            getSTBID: function () {
                if (this._isIpanel()) {
                    return hardware.STB.serial;
                } else if (this._isEnRich()) {
                    return iPanel.getGlobalVar('X-TERMINAL-ID');
                } else {
                    return '1104002091800024C126B94A';
                }
            },

            /*
            接口说明：
            功能：获取硬件版本号
            */
            getHV: function () {
                if (this._isIpanel()) {
                    return hardware.STB.hVersion;
                } else if (this._isEnRich()) {
                    return SysInfo.hardwareVersion;
                } else {
                    return null;
                }
            },

            /*
            接口说明：
            功能：获取软件版本号
            */
            getSV: function () {
                if (this._isIpanel()) {
                    return hardware.STB.sVersion;
                } else if (this._isEnRich()) {
                    return SysInfo.softwareVersion;
                } else {
                    return null;
                }

            },

            /*
           接口说明：
           功能：关闭媒体
           */
            closeMedia: function () {
                try {
                    media.AV.close();
                } catch (e) {
                    console.log(e);
                }
            },
            setPosition: function (_left, _top, _width, _high, _callback) {
                try {
                    media.video.setPosition(_left, _top, _width, _high);
                    if (typeof _callback == 'function') {
                        _callback();
                    }
                } catch (e) {
                    console.log(e);
                }
            },
            /*
            接口说明：
            功能：指定时间点进行定点播放
            参数：_press，指定的时间点，字符串类型
                          hh:mm:ss
            返回值：成功或者失败标志
            */
            seek: function (_press) {
                try {
                    if (typeof _press != 'string') {
                        console.log(" seek()：Parameter is string hh:mm:ss");
                        return false;
                    } else {
                        media.AV.seek(_press);
                        return true;
                    }
                } catch (e) {
                    console.log(e);
                    return false;
                }
            },

            /*
            接口说明：
            功能：暂停或重启当前播放
            返回值：当前状态是否暂停
                    执行失败的话返回false
            */
            pause: function () {
                try {
                    if (media.AV.status != "pause") {
                        media.AV.pause();
                        return true;
                    } else {
                        media.AV.play();
                        return false;
                    }
                } catch (e) {
                    console.log(e);
                    return false;
                }
            },
            /*
               接口说明：
               功能：获取当前播放状态
               返回值：返回状态的字符串描述，
                       ＂play＂ :媒体正在播放中；
                       ＂pause＂ :媒体为暂停状态；
                       ＂forward＂: 媒体在快速前进；
                       ＂backward＂: 媒体在快速后退；
                       ＂repeat＂ :媒体重绕；
                       ＂slow＂ :媒体慢放；
                       ＂stop＂ :停止；
                       ＂unknown＂ :未知
                       影立驰中间件不支持，返回"unknown"
            */
            getStatus: function () {
                try {
                    if (this.isIpanel()) {
                        return media.AV.status;
                    } else {
                        return "unknown";
                    }
                } catch (e) {
                    console.log(e);
                    return 0;
                }
            },

            /*
            接口说明：
            功能：获取当前资产总时长
            返回值：返回值为数字秒
            */
            getDuration: function () {
                try {
                    return media.AV.duration;
                } catch (e) {
                    console.log(e);
                    return 0;
                }
            },
            /*
            接口说明：
           功能：获取当前播放时间点
            返回值：返回值单位为秒
            */
            getElapsed: function () {
                try {
                    return media.AV.elapsed;
                } catch (e) {
                    console.log(e);
                    return 0;
                }
            },
            /*
           接口说明：
           功能：设置全屏播放
           */
            fullScreen: function (_callback) {
                try {
                    media.video.fullScreen();
                    if (typeof _callback == 'function') {
                        _callback();
                    }
                } catch (e) {
                    console.log(e);
                    return false;
                }
            },
            /**
             * 视频计时页面
             * @param playUrl   视频地址
             * @param id        栏目id
             * @param title     栏目title
             * @param module    模块
             * @param account   账号
             */
            goJSPlayPage: function (playUrl, id, title, module, account, domain) {
                domain = domain || 'http://21.254.5.190';
                account = account || '';
                _frameWork.go(domain + '/hsvod/vodplay2timer.htm?vod=' + encodeURIComponent(playUrl) + '&id=' + id +
                    '&title=' + title + '&type=V&module=' + module + '&account=' + account);
            },
            /**
             * 视频不计时页面
             * @param playUrl
             * @param isSeek    是否记录已播放时间
             */
            goPlayPage: function (playUrl, isSeek, ret, domain) {
                domain = domain || 'http://21.254.5.190';
                isSeek = isSeek || false;
                ret = ret || location.href;
                var url = domain + '/hsvod/vodplay.htm?vod=' + encodeURIComponent(playUrl);
                if (isSeek) {
                    _frameWork.locationUrl.setQueryString(url, 'seek', _frameWork.mw.getElapsed());
                }
                _frameWork.locationUrl.setQueryString(url, 'ret', ret);
                _frameWork.go(url);
            },
            /**
             * 监控视频页面
             * @param playUrl
             * @param domain
             */
            goMonitorPage: function (playUrl, domain) {
                domain = domain || 'http://21.254.5.190';
                _frameWork.go(domain + '/hsvod/vodplay2monitor.htm?vod=' + encodeURIComponent(playUrl));
            },
            /**
             *  接口说明：
             *  功能：设置媒体
             * @param left_Media
             * @param top_Media
             * @param width_Media
             * @param height_Media
             * @param _loadUrl
             * @param _onPlay
             * @param _closeFun
             * @param _errFun
             */
            setMedia: function (left_Media, top_Media, width_Media, height_Media, _loadUrl, _onPlay, _closeFun, _errFun) {
                try {
                    //添加视频load图片
                    /*
                    //取消load , 部分机顶盒无5202 事件导致img无法删除
                    _loadUrl = _loadUrl || 'http://21.254.5.190/frame/img/loading.png';
                     if (_loadUrl) {
                         var videoNode = $('img_load');
                         _frameWork.removeElem(videoNode);
                         _frameWork.createElem('img',
                             {id:'img_load', src:_loadUrl,style:'position:absolute;left:'+ left_Media +'px;top:'+ top_Media +'px;width:'+ width_Media +'px;height:'+ height_Media +'px'});
                     }
                     */

                    var hVersion = this.getHV();
                    var sVersion = this.getSV();
                    if (left_Media && top_Media && width_Media && height_Media) {
                        this.lpos = left_Media;
                        this.tpos = top_Media;
                        this.wpos = width_Media;
                        this.hpos = height_Media;
                    }
                    if (hVersion == '07109a00' && sVersion == '10571143') {
                        iPanel.debug('120E video()');
                    } else {
                        iPanel.debug('hm3000');
                    }
                    _frameWork.unload(function () {
                        _frameWork.mw.closeMedia();
                    }, true);
                    /*播放结束*/
                    _frameWork.addEvenToList([5210], function () {
                        media.AV.close();
                        if (_frameWork.mw.m_index < _frameWork.mw.playurl.length - 1) {
                            _frameWork.mw.m_index += 1;
                        } else {
                            _frameWork.mw.m_index = 0;
                        }
                        if (typeof _closeFun == 'function') {
                            _closeFun();
                        }
                        media.AV.open(_frameWork.mw.playurl[_frameWork.mw.m_index], 'VOD');
                    });
                    /*打开成功*/
                    _frameWork.addEvenToList([5202], function () {

                        media.AV.play();
                        /*setTimeout(function () {
                            var videoNode = $('img_load');
                            _frameWork.removeElem(videoNode);
                        }, 500);*/
                        if (typeof _onPlay == 'function') {
                            _onPlay();
                        }
                    });
                    /*连接失败、搜索失败、播放失败*/
                    _frameWork.addEvenToList([5203, 5204, 5206], function (key_code) {
                        media.AV.close();
                        if (typeof _errFun == 'function') {
                            _errFun();
                        }
                    });
                    this.setPosition()
                    this.playVOD();
                } catch (e) {
                    // console.log(e);
                }
            },
            setPosition: function () {
                media.video.setPosition(this.lpos, this.tpos, this.wpos, this.hpos);
            },
            playVOD: function () {
                try {
                    if (!this.playurl instanceof Arrar) {
                        alert('playurl参数必须为数组!');
                        return;
                    }
                    if (this.playurl.length < 1) {
                        alert('尚未初始化playurl');
                        return;
                    }
                    this.modeChange(this.playurl[this.m_index]);
                    media.AV.open(this.playurl[this.m_index], 'VOD');
                } catch (e) {
                    console.log(e);
                }
            },
            modeChange: function (rtsp_url) {
                var serverModel = "IP";

                if (this._isIpanel()) {
                    if (typeof (rtsp_url) != 'undefined') {
                        if (rtsp_url.indexOf('isIpqam=1') != -1) {
                            serverModel = 'DVB';
                        } else {
                            serverModel = 'IP';
                        }
                    }
                    try {
                        if (serverModel == 'IP') {
                            //机顶盒的厂商名称 只读属性；
                            var __providerName = hardware.STB.provider;
                            var __providerNameFlag = __providerName.indexOf('摩托') > 0 ? true : false;
                            var ipanel_soft_version = iPanel.System.revision;
                            if (__providerName.indexOf('摩托') != -1 || __providerNameFlag || ipanel_soft_version.indexOf('41506') != -1) {//第三方VOD的点播模式切换
                                VOD.changeServer('sihua_3rd', 'ip');
                            } else {
                                VOD.changeServer('isma_v2', 'ip');
                            }
                        } else {
                            VOD.changeServer('isma_v2', 'dvb');
                        }
                    } catch (e) {
                        console.log("error:" + e.message);
                    }
                }
            },

            getSiteInfo: function (siteID, siteIndex, siteItem) {
                var base_url = 'http://125.210.227.229/catalog';
                var content = {'data': [], 'pages': ''};
                var data = '<?xml version="1.0" encoding="UTF-8"?>'
                data += '<message module="CATALOG_SERVICE" version="1.0">' +
                    '<header component-type="REQUEST" action="REQUEST" component-id="catalog" sequence="100000001" command="RELATIVE_CONTENT_QUERY" version="2.0"/>' +
                    '<body>' +
                    '               <folders>' +
                    '                   <folder>' +
                    '<site-code>hzvsite</site-code>' +
                    '<code>' + siteID + '</code>' +
                    '<page-index>' + siteIndex + '</page-index>' +
                    '<page-items>' + siteItem + '</page-items>' +
                    '</folder>' +
                    '</folders>' +
                    '           </body>' +
                    '</message>';

                _frameWork.ajax.post('http://21.254.5.190/UTLService/UIL/Cross/Handler.ashx', 'url=' + base_url + '&data=' + encodeURIComponent(data.replace(/</ig, '&lt;').replace(/>/ig, '&gt;')) + '&method=soap', function (response) {
                    // console.log(response);
                    if (response.indexOf('未查询到任何内容信息') != -1) {
                        console.log('未查询到任何内容信息!');
                    } else {
                        var xmlDoc = _frameWork.xml.loadXML(response); //loadXML方法载入xml字符串
                        var elements = xmlDoc.getElementsByTagName('content');
                        var pages = xmlDoc.getElementsByTagName('contents')[0].getAttribute('total-pages');
                        for (var i = 0; i < elements.length; i++) {
                            var name = elements[i].getElementsByTagName('name')[0].firstChild.nodeValue;
                            var creatTime = elements[i].getElementsByTagName('creat-time')[0].firstChild.nodeValue;
                            var code = elements[i].getElementsByTagName('code')[0].firstChild.nodeValue;
                            var imgUrl = elements[i].getElementsByTagName('url').length > 1 ? elements[i].getElementsByTagName('url')[1].firstChild.nodeValue : null;
                            content.data.push({
                                'codeID': code,
                                'name': name,
                                'creatTime': creatTime,
                                'imgUrl': imgUrl,
                                'playUrl': ''
                            });
                            content.pages = pages;
                        }
                    }
                }, null, function (msg) {
                    console.log(msg);
                }, 3500);
                /*for (var i = 0; i < content.data.length; i++) {
                    content.data[i].playUrl = this.getSite2Url(siteID, content.data[i].codeID,1);
                }*/
                return content;
            },
            /*type 1省网*/
            getSite2Url: function (siteID, contentID, types) {
                var types = types || 1;
                var rp1_s = "&owchid=hdds_ip&isHD=0&isIpqam=0";//省网后缀
                var rp1 = "rtsp://21.254.5.198:554";//省网匹配

                var base_url = 'http://125.210.227.229/catalog';
                var data = '<?xml version="1.0" encoding="UTF-8" ?>' +
                    '<message module="CATALOG_SERVICE" version="1.0">' +
                    '<header component-type="REQUEST" action="REQUEST" component-id="catalog" sequence="100000001" command="CONTENT_URL_QUERY" version="2.0"/>' +
                    '<body>' +
                    '<contents>' +
                    '<content>' +
                    '<site-code>hzvsite</site-code>' +
                    '<folder-code>' + siteID + '</folder-code>' +
                    '<code>' + contentID + '</code>' +
                    '<items-index>1</items-index>' +
                    '<format>50</format>' +
                    /*  '<begin-time></begin-time>'+
                        '<end-time></end-time>'+
                        '<file-index></file-index>'+ */
                    '</content>' +
                    '</contents>' +
                    '</body>' +
                    '</message>';
                var str = '';
                _frameWork.ajax.post('http://21.254.5.190/UTLService/UIL/Cross/Handler.ashx', 'url=' + base_url + '&data=' + encodeURIComponent(data.replace(/</ig, '&lt;').replace(/>/ig, '&gt;')) + '&method=soap', function (response) {
                    // console.log(response);
                    if (types == 1) {
                        var xmlDoc = _frameWork.xml.loadXML(response);
                        var elements = xmlDoc.getElementsByTagName('play-urls');
                        for (var i = 0; i < elements.length; i++) {
                            var urls = elements[i].getElementsByTagName('play-url');
                            for (var j = 0; j < urls.length; j++) {
                                var url = urls[j].firstChild.nodeValue;
                                if (url.indexOf(rp1) != -1 && url.indexOf('&isHD=0') != -1) {
                                    str = url.substring(0, url.indexOf('&')) + rp1_s;
                                    break;
                                }
                            }
                        }
                    } else {
                        /*杭网*/
                        /*var tmp = response.substring(response.indexOf(rp2));
                            tmp = tmp.substring(0,tmp.indexOf('&token'));
                            contentPlayUrl.push(tmp);*/
                    }
                }, null, function (msg) {
                    console.log(msg);
                }, 3500);
                return str;
            },
            /*types == 1省*/
            getConidToUrl: function (contentID, types) {
                var rp2 = 'rtsp://125.210.227.234:5541/hdds_ip';
                // var rp1_s = "&owchid=vod01_channel&isHD=0&isIpqam=0";//省网后缀
                // var rp1 = "rtsp://21.254.5.158:554";//省网匹配
                var rp1_s = "&owchid=hdds_ip&isHD=0&isIpqam=0";//省网后缀
                var rp1 = "rtsp://21.254.5.198:554";//省网匹配
                var url = 'http://125.210.227.229/catalog';
                var values = '<?xml version="1.0" encoding="UTF-8"?>' +
                    '<message module="CATALOG_SERVICE" version="1.0">' +
                    '<header component-type="REQUEST" action="REQUEST" component-id="catalog" sequence="100000001" command="CONTENT_URL_QUERY" version="2.0"/>' +
                    '<body>' +
                    '<contents>' +
                    '<content>' +
                    '<code>' + contentID + '</code>' +
                    '<items-index>1</items-index>' +
                    '<site-code>hzvsite</site-code>' +
                    '<format>50</format>' +
                    '</content>' +
                    '</contents>' +
                    '</body>' +
                    '</message>';

                var res = '';
                var str = '';
                _frameWork.ajax.post('http://125.210.113.145/WSL/Core/CrossDomain.ashx', 'url=' + encodeURIComponent(url) + '&data=' + encodeURIComponent(values.replace(/</ig, '&lt;').replace(/>/ig, '&gt;')) + '&method=post&type=soap', function (obj) {
                    // console.log('getConidToUrl');
                    res = obj;
                }, 0, 3000);

                // var res = request.getAllResponseHeaders() + request.responseText;
                if (types == 1) {
                    var xmlDoc = _frameWork.xml.loadXML(res);
                    var elements = xmlDoc.getElementsByTagName('play-urls');
                    for (var i = 0; i < elements.length; i++) {
                        var urls = elements[i].getElementsByTagName('play-url');
                        for (var j = 0; j < urls.length; j++) {
                            var url = urls[j].firstChild.nodeValue;
                            if (url.indexOf(rp1) != -1 && url.indexOf('&isHD=0') != -1) {
                                str = url.substring(0, url.indexOf('&')) + rp1_s;
                                break;
                            }
                        }
                    }
                    return str;
                } else {
                    var tmp = res.substring(res.indexOf(rp2));
                    return tmp.substring(0, tmp.indexOf('&token'));
                }
            }
        },
        cookie: {
            get: function (name) {
                var arr, reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
                if (arr = document.cookie.match(reg)) {
                    if (arr[2].indexOf('"') === 0) {
                        arr[2] = arr[2].slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
                    }
                    try {
                        arr[2].replace(/\+/g, ' ');
                        return decodeURIComponent(arr[2]);
                    } catch (e) {
                        console.log(e.message);
                    }
                } else {
                    return null;
                }
            },
            /**
             *
             * @param name
             * @param value
             * @param days
             */
            set: function (name, value, days) {
                var exp = new Date();
                exp.setTime(exp.getTime() + (days * 24 * 60 * 60 * 1000));
                if (days) {
                    window.document.cookie = name + '=' + encodeURIComponent(value) + ';expires=' + exp.toGMTString() + ';path=/';
                } else {
                    window.document.cookie = name + '=' + encodeURIComponent(value) + ';path=/';
                }
            },
            delOne: function (name) {
                var exp = new Date();
                exp.setTime(exp.getTime() - 1);
                var cval = this.get(name);
                if (cval != null) {
                    document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString() + ';path=/';
                }
            },
            delAll: function () {
                var strCookie = document.cookie;
                var arrCookie = strCookie.split('; '); // 将多cookie切割为多个名/值对
                for (var i = 0; i < arrCookie.length; i++) { // 遍历cookie数组，处理每个cookie对
                    if (arrCookie[i].indexOf('=') != -1) {
                        var arr = arrCookie[i].split('=');
                        if (arr.length > 0)
                            this.delOne(arr[0]);
                    } else if (arrCookie[i].indexOf(';') != -1) {
                        var nn = arrCookie[i].indexOf(';');
                        var arr = arrCookie[i].substring(0, nn);
                        if (arr.length > 0)
                            this.delOne(arr);
                    }
                }
            }
        },
        /**
         * global
         * @private
         */
        global: {
            get: function (name) {
                var GlobalValue = '';
                try {
                    GlobalValue = iPanel.getGlobalVar(name);
                } catch (e) {
                    console.log(e.message);
                    return null;
                }
                return GlobalValue;
            },
            set: function (name, value) {
                try {
                    iPanel.setGlobalVar(name, value);
                } catch (e) {
                    console.log(e.message);
                }
            },
            del: function (key) {
                try {
                    iPanel.delGlobalVar(key);
                } catch (e) {
                    console.log(e.message);
                }
            }
        },
        /**
         * json
         */
        json: {
            /**
             *  @author whf
             * 将json字符串转换成json
             * */
            parse: function (str) {
                try {
                    str = eval('(' + str + ')');
                    return str;
                } catch (e) {
                    console.log(e.message);
                }
            },
            /**
             * @author whf
             * 将对象解析成字符串,便于存cookie
             * */
            stringify: function (obj) {
                var arr = [];
                var fmt = function (s) {
                    if (typeof s == 'object' && s != null) {
                        if (s instanceof Array) {
                            var temp = [];
                            for (var index = 0; index < s.length; index++) {
                                temp.push(fmt(s[index]));
                            }
                            return ('[' + temp.join(',') + ']');
                        } else {
                            return _frameWork.json.stringify(s);
                        }
                    } else {
                        return /^(string)$/.test(typeof s) ? '"' + s + '"' : s;
                    }
                };
                for (var i in obj) {
                    arr.push('"' + i + '":' + fmt(obj[i]));
                }
                return '{' + arr.join(',') + '}';
            }
        },
        /**
         * locationUrl
         */
        locationUrl: {
            /**
             * @param _u
             * @returns {string|*}
             */
            getQueryString: function (name) {
                var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
                var r = window.location.search.substr(1).match(reg);
                if (r != null) return (decodeURIComponent(r[2]));
                return '';
            },
            // 判定浏览器厂商信息
            getNavigatorUA: function () {
                var _ua = navigator.userAgent.toLowerCase();
                if (/ipanel/.test(_ua)) {
                    return 'iPanel';
                } else if (/windows /.test(_ua)) {
                    return 'PC';
                }
                return _ua;
            },
            /**
             *
             * @param _u
             * @param _k
             * @param _v
             * @returns {string|*}
             */
            setQueryString: function (_u, _k, _v) {
                _u.indexOf('?') != -1 ? _u += '&' : _u += '?';
                _u += _k + '=' + encodeURIComponent(_v);
                return _u;
            },
            /**
             * @param url
             * @returns {*}
             */
            formatImgUrl: function (url, prefixSrc) {
                var regex = /src="([^"]*)"/gi;
                var prefixSrc = prefixSrc || 'http://21.254.5.190';
                if (url != null && url != '') {
                    return prefixSrc + regex.exec(url)[1];
                }
                return '';
            },
            replaceImgUrl: function (url, prefixSrc) {
                var regex = /<img[\s]*(alt=\"\")?[\s]*src="/gi;
                var prefixSrc = prefixSrc || 'http://21.254.5.190';
                var rs = regex.exec(url);
                if (url != null && url != '' && rs) {
                    url = url.replace(regex, '<img src="' + prefixSrc);
                }
                return url;
            }
        },
        /**
         * 返回处理
         */
        memoryO: {
            upBackUrl: '',
            backName: '',
            localhostName: '',
            upBackName: '',
            goBackFlag: false,
            backObj: {'url': '', 'fObjectArr': [], 'pageIndexArr': []},

            goBackO: function (url, fObjectArr, pageIndexArr) {
                var tempO = new Object();
                tempO.url = url;
                tempO.fObjectArr = fObjectArr;
                tempO.pageIndexArr = pageIndexArr;
                return tempO;
            },
            initBackO: function (url, fObjectArr, pageIndexArr) {
                return this.goBackO(url, fObjectArr, pageIndexArr);
            },

            /**
             * @param {string} backname 返回标识名字
             */
            initMemoryO: function (backname) {
                _frameWork.forbiddenAllEvenCode();
                this.backName = backname;
                this.localhostName = backname + '_url';
                var upBackName = _frameWork.locationUrl.getQueryString('upBackName');
                this.upBackName = upBackName;
                if (upBackName) {
                    this.upBackUrl = _frameWork.cookie.get(upBackName);
                }
                return this.loadBefor();
            },
            /**
             *
             * @param projectName  项目名字
             * @param newUrl    跳转后的返回地址
             * @param fileName  跳转文件短名字包括后缀
             * @returns {string}  返回跳转文件的全类名
             */
            getOutside: function (projectName, fileName) {
                var self = window.location.href;
                var name = fileName || 'outside_tools.htm';
                var baseUrl = _frameWork.getBaseUrl(projectName)
                _frameWork.global.set('outside_returnUrl', self);
                _frameWork.cookie.set('outside_returnUrl', self);
                return baseUrl + name;
            },
            goBack: function () {
                _frameWork.cookie.delOne('hs_back_' + this.backName);
                if (_frameWork.locationUrl.getQueryString('indexUrl')) {
                    //省网门户二次编码,需要二次解码.
                    window.location.href = decodeURIComponent(_frameWork.locationUrl.getQueryString('indexUrl'));
                } else if (_frameWork.locationUrl.getQueryString('returnUrl')) {
                    window.location.href = _frameWork.locationUrl.getQueryString('returnUrl');
                } else if (this.upBackUrl) {
                    _frameWork.cookie.delOne(this.upBackName);
                    window.location.href = this.upBackUrl;
                } else if (this.backObj.url) {
                    window.location.href = this.backObj.url;
                } else if (_frameWork.global.get('returnUrl')) {
                    window.location.href = _frameWork.global.get('returnUrl');
                } else {
                    history.go(-1);
                }
            },

            /**
             * @returns {boolean}
             */
            loadBefor: function () {
                var flag = false;
                var hs_back = _frameWork.cookie.get('hs_back_' + this.backName);
                if (hs_back) {
                    this.backObj = _frameWork.json.parse(hs_back);
                    flag = true
                }
                _frameWork.defaultEvenFn();
                return flag;
            },


            /**
             * @param {Object}
             * @param {Boolean} isHold = true|false,true表示将当前地址记录到cookie，false表示不可以
             *
             **/
            setBack: function (bObj, isHold) {
                isHold = isHold == true ? true : false;
                if (bObj.focObj) {
                    console.log('ERROR :setBack() focObj not find!');
                }
                if (!bObj.url && this.upBackUrl) {
                    bObj.url = this.upBackUrl;
                }
                if (!bObj.url && this.backObj.url) {
                    bObj.url = this.backObj.url;
                }
                _frameWork.cookie.set('hs_back_' + this.backName, _frameWork.json.stringify(bObj));
                if (isHold) {
                    _frameWork.cookie.set(this.localhostName, location.href);
                }
            }
        },
    };
    /*_frameWork 结束*/

    //hs.onBlur  和  hs.onFocus , doSelect需要自己重写
    function fObject(group, objindex, objid, up, down, left, right, touchCallback) {
        this.group = group;
        this.objindex = objindex;
        this.objid = objid;
        this.up = up;
        this.down = down;
        this.left = left;
        this.right = right;
        this.touchCallback = touchCallback;

        this.doBlur = function () {
            if (typeof (hs.onBlur) == 'function') {
                hs.onBlur(this.group, this.objid, this.objindex);
            } else {
                console.log('Error:you should implement the funcion hs.onBlur(groupid,objid,index)');
            }
        };
        this.doFocus = function () {
            if (typeof (hs.onFocus) == 'function') {
                hs.onFocus(this.group, this.objid, this.objindex);
            } else {
                console.log('Error:you should implement the funcion hs.onFocus(groupid,objid,index)');
            }
        };
        this.doUp = function () {
            if (typeof (this.up) == 'function') {
                this.up(this);
            }
        };
        this.doDown = function () {
            if (typeof (this.down) == 'function') {
                this.down(this);
            }
        };
        this.doLeft = function () {
            if (typeof (this.left) == 'function') {
                this.left(this);
            }
        };
        this.doRight = function () {
            if (typeof (this.right) == 'function') {
                this.right(this);
            }
        };
        this.doSelect = function () {
            doSelect(this.group, this.objindex, this.objid);
        };
        fObjList.push(this);
    }

    function grabEvent(event) {
        var key_code = event.keyCode || event.which;
        var ret = 1;
        ret = _frameWork.defaultFun(key_code);
        return ret;

    }

    /*
    接口说明：
    功能：DOM对象选择器
    参数：selector，DOM对象的ID
    返回：如果为找到指定对象，则返回null，否则返回找到的对象
    */
    v.$ = function (selector) {
        if (typeof selector == 'string') {
            var t = document.getElementById(selector);
            if (typeof t === 'undefined') {
                return null;
            } else {
                return t;
            }
        } else {
            console.log('getElementById(' + selector + ') is null!');

            return null;
        }
    };

    //  将hs 设置为  winodw的顶层对象属性
    v.hs = _frameWork;

    /*兼容旧版ajax*/
    v.hs.ajax = new function () {
        var ajax = new _frameWork.AjaxObject();
        ajax.async = false;
        this.get = ajax.get;
        this.post = ajax.post;
    };

    //将fObject 设置为  winodw的顶层对象属性
    v.fObject = fObject;

    v.document.onkeydown = grabEvent;
    v.document.onirkeypress = grabEvent;
    v.document.onsystemevent = grabEvent;
    /*初始化默认事件*/
    _frameWork.defaultEvenFn();

    //----------hs 扩展函数---------------
    _frameWork.isArray = function (obj) {
        return Object.prototype.toString.call(obj) === '[object Array]' || obj instanceof Array;
    };
    _frameWork.isObject = function (obj) {
        return typeof obj == 'object';
    };

    _frameWork.isFunction = function (obj) {
        return typeof obj == 'function';
    };

    _frameWork.isString = function (obj) {
        return typeof obj == 'string';
    };

    _frameWork.isBoolean = function (obj) {
        return typeof obj == 'boolean';
    };

    _frameWork.isNumber = function (obj) {
        return typeof obj == 'number';
    };

    _frameWork.isUndefined = function (obj) {
        return typeof obj == 'undefined';
    };

    /**
     * foreach方法
     * @param  items
     * @param  fn(value, index);
     */
    _frameWork.forEach = function () {
        if (![].forEach) {
            return function (items, fn, separator) {
                if (_frameWork.isString(items)) {
                    separator = separator || '|';
                    items = items.split(separator);
                }
                for (var i = 0, len = items.length; i < len; i++) {
                    fn(items[i], i);
                }
            };
        } else {
            return function (items, fn) {
                [].forEach.call(items, fn);
            }
        }
    }();

    /**
     * 判断对象是否为空
     * @param obj
     */
    _frameWork.isEmptyObject = function (obj) {
        for (var key in obj) {
            return false;
        }
        return true;
    };

    /**
     * 删除字符串首尾空白符
     * @param value
     * @returns {*}
     */
    _frameWork.trim = function (value) {
        if (this.isString(value)) {
            var reg = /^\s+|\s+$/g;
            return value.replace(reg, '');
        }
        return value;
    };


    //设置css style
    _frameWork.css = function (elem, value) {
        if (this.isString(value)) {
            cssText(elem, value);
        } else if (this.isObject(value)) {
            for (var m in value) elem.style[m] = value[m];
            return true;
        }
    };


    // 创建挂载dom元素
    _frameWork.createElem = function (type, prame, parentNode) {
        //hs.createElem( 'div', {id:'div2', style:'width:100px;height:50px;', attr:{exDragable:1}} );
        var o = document.createElement(type);
        for (var p in prame) {
            if (p === 'style') {
                cssText(o, prame[p]);
            } else if (p === 'attr') {
                for (var i in prame[p])
                    o.setAttribute(i, prame[p][i]);
            } else {
                o[p] = prame[p];
            }
        }

        if (this.isUndefined(parentNode)) {
            document.body.appendChild(o);
        } else if (parent !== null) {
            parentNode.appendChild(o);
        }
        return o;
    };
    // 删除dom
    _frameWork.removeElem = function (elem) {
        if (elem && elem.parentNode && elem.tagName.toLowerCase() !== 'body') {
            elem.parentNode.removeChild(elem);
            return true;
        }
    };
    // 块级元素:display切换[block,none]
    _frameWork.toggleDisplay = function (_e, _d) {
        if (this.isString(_d)) {
            var val = (_d === 'show' ? 'block' : 'none');
            this.css(_e, {display: val});
            return true;
        }
    };

    // 判断数组是否包含值
    _frameWork.arrayIsContains = function (_arr, _v) {
        var flag = false;
        this.forEach(_arr, function (_item, _index) {
            if (_item === _v) {
                flag = true;
                return;
            }
        });
        return flag;
    };

    // msg显示弹窗.
    _frameWork.showMsgInfo = function (_imgurl, _msg, _callback) {
        var _self = this;
        if (!$('hs_msg')) {
            _imgurl = _imgurl || 'http://21.254.5.190/frame/img/msg.png';
            this.createElem('div', {
                id: 'hs_msg',
                style: 'position:absolute;left:0px;top:0px;display:none;width:1280px;height:720px;'
            });
            $('hs_msg').innerHTML = ' <img src="' + _imgurl + '" style="position: absolute;left: 0px; top: 0px;" alt="">' +
                '<div style="position: absolute;left: 444px; top: 254px;width: 362px;height: 104px;line-height: 26px; font-size: 20px;color: #ffffff;overflow: hidden" id="hs_msg_info"></div>';
        }
        $('hs_msg_info').innerHTML = _msg;
        this.toggleDisplay($('hs_msg'), 'show');
        this.addEvenToList(hs.defaultDoCode, function () {
            _self.toggleDisplay($('hs_msg'), 'hidde');
            if (typeof _callback == 'function') {
                _callback();
            }
        });
        _frameWork.addEvenToList(hs.defaultBackCode, function () {
            _self.toggleDisplay($('hs_msg'), 'hidde');
            if (typeof _callback == 'function') {
                _callback();
            }
        });
    };

    // 键盘
    _frameWork.showKey = function (_left, _top, _keyArea, _objId) {
        var defalutLeft = 20;
        var defalutTop = 20;
        var key = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
        var leftArr = [1, 7, 13, 19, 25, 31];
        var rightArr = [6, 12, 18, 24, 30, 36];
        var str = '<img src="http://21.254.5.190/frame/img/key/key_bg.png" style="position:absolute;left:0px;top:0px;" />';
        _left = _left || 909;
        _top = _top || 166;
        var _self = this;
        if (!$('hs_keyboard')) {
            _keyArea = _keyArea || 100;
            this.createElem('div', {
                id: 'hs_keyboard',
                style: 'position:absolute;left:' + _left + 'px;top:' + _top + 'px;width:280px;height:318px;z-index:100;display:none;'
            });

            this.forEach(key, function (item, i) {
                // i 从1开始
                i += 1;
                new fObject(_keyArea, i, "user_key_" + i,
                    i - 6 >= 1 ? "user_key_" + (i - 6) : null,
                    i + 6 <= key.length ? "user_key_" + (i + 6) : "user_key_37",
                    function () {
                        if (_self.arrayIsContains(leftArr, _self.focObj.objindex)) {
                            _self.initFocus(_self.areaLastFocus[_self.prevArea].objid);
                        } else if (_self.focObj.objindex > 1) {
                            _self.initFocus("user_key_" + (_self.focObj.objindex - 1));
                        }
                    },
                    function () {
                        if (_self.arrayIsContains(rightArr, _self.focObj.objindex)) {
                            _self.initFocus(_self.areaLastFocus[_self.prevArea].objid);
                        } else if (_self.focObj.objindex < key.length) {
                            _self.initFocus("user_key_" + (_self.focObj.objindex + 1));
                        }
                    });

                str += '<div style="position: absolute;left: ' + defalutLeft + 'px;top: ' + defalutTop + 'px;width: 40px;height: 40px;" id="user_key_' + i + '">' +
                    '<img src="http://21.254.5.190/frame/img/key/key_foc1.png" style="position: absolute;left: 0px;top: 0px;width: 40px;height: 40px;display: none">' +
                    '<div style="position: absolute;left: 0px;top: 0px;width: 40px;height: 40px;line-height: 40px;text-align: center;font-size: 22px;">' + key[(i - 1)] + '</div>' +
                    '</div>';
                defalutLeft += 40;
                if (!(i % 6)) {
                    defalutLeft = 20;
                    defalutTop += 40;
                }
            });

            str += '<div style="position: absolute;left: 20px;top: ' + defalutTop + 'px;width: 80px;height: 40px;" id="user_key_37">' +
                '<img src="http://21.254.5.190/frame/img/key/key_foc2.png" style="position: absolute;left: 0px;top: 0px;width: 80px;height: 40px;display: none">' +
                '<div style="position: absolute;left: 0px;top: 0px;width: 80px;height: 40px;line-height: 40px;text-align: center;font-size: 22px;">确定</div>' +
                '</div>';
            new fObject(_keyArea, 37, "user_key_37",
                "user_key_31", null, null, "user_key_38");
            str += '<div style="position: absolute;left: 100px;top: ' + defalutTop + 'px;width: 80px;height: 40px;" id="user_key_38">' +
                '<img src="http://21.254.5.190/frame/img/key/key_foc2.png" style="position: absolute;left: 0px;top: 0px;width: 80px;height: 40px;display: none">' +
                '<div style="position: absolute;left: 0px;top: 0px;width: 80px;height: 40px;line-height: 40px;text-align: center;font-size: 22px;">删除</div>' +
                '</div>';
            new fObject(_keyArea, 38, "user_key_38",
                "user_key_33", null, "user_key_37", "user_key_39");
            str += '<div style="position: absolute;left: 180px;top: ' + defalutTop + 'px;width: 80px;height: 40px;" id="user_key_39">' +
                '<img src="http://21.254.5.190/frame/img/key/key_foc2.png" style="position: absolute;left: 0px;top: 0px;width: 80px;height: 40px;display: none">' +
                '<div style="position: absolute;left: 0px;top: 0px;width: 80px;height: 40px;line-height: 40px;text-align: center;font-size: 22px;">清空</div>' +
                '</div>';
            new fObject(_keyArea, 39, "user_key_39",
                "user_key_35", null, "user_key_38", null);

            $("hs_keyboard").innerHTML = str;
            this.fObjCommit();

            this.addFocus([_keyArea], function (group, id, index) {
                _frameWork.toggleDisplay($(id).getElementsByTagName('img')[0], 'show');
            });

            this.addBlur([_keyArea], function (group, id, index) {
                _frameWork.toggleDisplay($(id).getElementsByTagName('img')[0], 'hidden');
            });
        }
        this.addSelect([_keyArea], function (group, id, index) {
            if (index < 37) {
                var value = $(id).getElementsByTagName('div')[0].innerHTML;
                $(_objId).innerHTML += value;
            } else if (index == 37) {
                _self.initFocus(_objId);
            } else if (index == 38) {
                var value = $(_objId).innerHTML;
                $(_objId).innerHTML = value.substring(0, value.length - 1);
            } else if (index == 39) {
                $(_objId).innerHTML = '';
            }

        });
        this.toggleDisplay($("hs_keyboard"), 'show');
    };
    _frameWork.hiddenKey = function (_newObjid) {
        this.initFocus(_newObjid);
        this.toggleDisplay($("hs_keyboard"), 'hidden');
    };


    // 禁用图片拖拽 ondragstart="return false"
    window.ondragstart = function () {
        return false;
    };

    //视频自动播放
    // chrome://flags/#autoplay-policy        设置成 no user gesture is required 就好了。

    /*
        -webkit-user-select: none;
        user-select: none;
        -webkit-touch-action:none;
        touch-action:none;
        cursor: default;
    */

});






