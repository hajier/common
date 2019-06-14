var wasuReq = "http://" + document.domain + "/dataquery/";
// var wasuReq = "http://hd2.hzdtv.tv/dataquery/";

// var hsReq = "http://125.210.160.14:8080/SMSCH-STB/";
// var hsReq = "http://125.210.160.13:8080/SMSCH-STB/";
var hsReq = "http://125.210.113.200:8080/SMSCH-STB/";


var fullVideoUrl = '';

//全屏播放
function fullPlay(fcode, conid, type) {
    /*1*/
    // var noticeUrl = 'http://hd2.hzdtv.tv/dataquery/gotoAuthPlay?folderCode';
    // var da = "folderCode=" + fcode + "&contentId=" + conid + "&contentType=" + type;
    // hs.ajax.post("http://125.210.113.145/WSL/Core/CrossDomain.ashx", 'url=' + noticeUrl + '&data=' + encodeURIComponent(da) + '&method=get&type=default', function (obj) {
    /*2*/
    var noticeUrl = wasuReq + "gotoAuthPlay?folderCode=" + fcode + "&contentId=" + conid + "&contentType=" + type;
    /*3 docker 解决跨域*/
    // var noticeUrl = "http://125.210.144.12:41535/SMSCH-STB/hs/auth?folderCode=" + fcode + "&contentId=" + conid + "&contentType=" + type;

    hs.ajax.get(noticeUrl, function (obj) {
        // $("info").innerHTML = "请求:" + noticeUrl + "----播放地址:" + obj;
        var data = hs.json.parse(obj);
        console.log(data);
        if (!data) {
            return;
        }
        fullVideoUrl = data.authUrl;
        hs.go(fullVideoUrl);
    }, 0, function (msg) {
        console.log(msg)
    }, 3000)
}