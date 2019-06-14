+function (f) {
    if (typeof f === "function") {
        if (typeof hs != "undefined") {
            f(hs);
        }
    }
}(function (v) {
    function _publish() {
        /**
         *图文列表。
         *参数：用户id，栏目id，获取到的图文插入的节点
         * @param code
         * @param id
         * @param objid
         * @returns {string}
         */
        this.getPublishData = function (code, id, objid, domainCode, prefixSrc) {
            var title = "";
            domainCode = domainCode || 2;   //默认省网图文code
            v.ajax.get("?action=select&table=tw_mixture&params=mt_title,mt_subtitle,mt_customize,mt_about,mt_notes,mt_image,mt_type,create_dtime,mt_sequence"
                + "&column=" + id + "&where=&order=mt_sequence%20asc,id%20asc&code=" + code + "&index=1&items=70", function (data) {
                data = eval("(" + data + ")");
                console.log(data);
                if (data.Success == true) {
                    v.publish.setPublishData(objid, data.Data.Items, prefixSrc);
                }
            }, domainCode, function () {
                alert("hs.publish 获取内容失败!");
            }, 3000);
            return title;
        };

        this.setPublishData = function(objid, data, prefixSrc){
            var contenttext = "";
            title = data[0].mt_title;
            for (var i = 0; i < data.length; i++) {
                if (data[i].mt_type == "T") {
                    contenttext += "<div style=\"line-height:33px;font-size: 23px;text-align: justify;\">" + data[i].mt_notes + "</div>";
                }
                if (data[i].mt_type == "I") {
                    var imgsrc = v.locationUrl.formatImgUrl(data[i].mt_image, prefixSrc);

                    if (data[i].mt_subtitle != "") {
                        var imgPos = data[i].mt_subtitle.substring('=')[1];
                        contenttext += "<br/><div style=\"text-align:" + imgPos + ";\"><img src=\"" + imgsrc + "\"></img></div>";
                    } else {
                        contenttext += "<br/><div style=\"text-align:center;\"><img src=\"" + imgsrc + "\"></img></div>";
                    }
                }
                if(data[i].mt_type == "M"){
                    contenttext += "<div style=\"line-height:33px;font-size: 23px;text-align: justify;\">" + hs.locationUrl.replaceImgUrl(data[i].mt_notes, prefixSrc) + "</div>";
                }
            }
            $(objid).innerHTML = contenttext;
        };
        /**
         *图文向下翻页动作
         * @param ojbid
         */
        this.pagePublishDown = function (ojbid, speed, callbak) {
            var height = $(ojbid).offsetHeight - $(ojbid).parentNode.offsetHeight;
            var nowheight = parseInt(v.getStyle($(ojbid), "top"));
            speed = speed ? speed : 200;
            //console.log(height + "|" + nowheight);
            if (nowheight > (-height)) {
                nowheight -= speed;
                $(ojbid).style.top = nowheight + 'px';
            } else {
                if(typeof callbak == "function"){
                    callbak();
                }
            }
        };

        /**
         *图文向上翻页动作
         * @param ojbid
         */
        this.pagePublishUp = function (ojbid, speed, callbak) {
            speed = speed ? speed : 200;
            var nowheight = parseInt(v.getStyle($(ojbid), "top"));
            if (nowheight < (-speed)) {
                nowheight += speed;
                $(ojbid).style.top = nowheight + 'px';
            } else {
                nowheight = 0;
                $(ojbid).style.top = '0px';
                if(typeof callbak == "function"){
                    callbak();
                }
            }
        };
    }

    v.publish = new _publish();
});
