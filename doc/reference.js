/**
 * Created by ggice on 14/12/15.
 */
//当当网用户行为检测系统
if (typeof ddclick_page_tracker == "undefined") {

    //搜索引擎URL辨别
    function __dd_Campaign() {
        var f = [
            ["baidu", "word"],
            ["baidu", "wd"],
            ["google", "q"],
            ["soso", "w"],
            ["sogou", "query"],
            ["youdao", "q"],
            ["bing", "q"],
            ["yahoo", "p"],
            ["ask", "q"]
        ];
        this.transCampaignURL = function (a) {
            var b = /^https?:\/\/(.*?)($|\/.*)/;
            var c = b.exec(a);
            if (c != null) {
                var d = "";
                d = c[1];
                var e = URLUtil.getKeyValueArray(a);
                for (var i = 0; i &lt; f.length - 1; i++) {
                    if (d.indexOf(f[i][0]) &gt; 0) {
                        if (typeof e[f[i][1]] != "undefined") {
                            d = d + "|" + e[f[i][1]];
                            return d
                        }
                    }
                }
                return d + "|"
            } else {
                return a + "|"
            }
        }
    };

    //解析关键词
    var URLUtil = {
        getKeyValueArray: function (a) {
            var b = new Object();
            if (a.indexOf("?") &gt; 0) {
                var c = a.substring(a.indexOf("?") + 1);
                if (c.indexOf("#") &gt; 0) {
                    c = c.substring(0, c.indexOf("#"))
                }
                var d = c.split("&amp;");
                for (var i = 0; i &lt; d.length; i++) {
                    b[d[i].split("=")[0]] = d[i].split("=")[1]
                }
            }
            return b
        }
    };

    //设置Cookies
    var CookieUtil = {
        get: function (a) {
            var b = encodeURIComponent(a) + "=",
                cookieStart = document.cookie.indexOf(b),
                cookieValue = null;
            if (cookieStart &gt; -1) {
                var c = document.cookie.indexOf(";", cookieStart);
                if (c == -1) {
                    c = document.cookie.length
                }
                cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + b.length, c))
            }
            return cookieValue
        },

        set: function (a, b, c, d, e, f) {
            var g = encodeURIComponent(a) + "=" + encodeURIComponent(b);
            if (c instanceof Date) {
                g += "; expires=" + c.toGMTString()
            }
            if (d) {
                g += "; path=" + d
            }
            if (e) {
                g += "; domain=" + e
            }
            if (f) {
                g += "; secure"
            }
            document.cookie = g
        },
        unset: function (a, b, c, d) {
            this.set(a, "", new Date(0), b, c, d)
        }
    };

    //添加句柄跟踪
    function addEventHandler(a, b, c) {
        if (a.addEventListener) {
            a.addEventListener(b, c, false)
        } else if (a.attachEvent) {
            a.attachEvent("on" + b, c)
        } else {
            a["on" + b] = c
        }
    };

    //删除句柄跟踪
    function removeEventHandler(a, b, c) {
        if (a.removeEventListener) {
            a.removeEventListener(b, c, false)
        } else if (a.detachEvent) {
            a.detachEvent("on" + b, c)
        } else {
            a["on" + b] = null
        }
    };

    //页面跟踪
    function PageTracker() {
        var k = 0;
        var l = "";
        var o = 0;
        var p = "";
        var q = "";
        var r = escape(",");
        var s = "dangdang.com";
        var t = ['<a href="http://click.dangdang.com/">http://click.dangdang.com/</a>", "<a href="https://click.dangdang.com/">https://click.dangdang.com/</a>'];
        var u = "http:";
        try {
            u = document.location.protocol
        } catch (e) {}
        var v = ("https:" == u ? t[1] : t[0]);

        //获取页面渠道来源（优先判断浏览器是否带#dd_refer=,如果有获取后面的参数，如果没有浏览器referer）
        var w = function (a) {
            if (a.indexOf("#dd_refer=") &gt; 0) {
                p = unescape(a.substring(a.indexOf("#dd_refer=") + "#dd_refer=".length))
            } else {
                p = document.referrer;
                if (!p) {
                    try {
                        if (window.opener &amp;&amp; window.opener.location) {
                            p = window.opener.location.href
                        }
                    } catch (e) {}
                }
            }
            p = p.replace(/\t|\n|\r/g, "")
        };

        //拼接请求URL
        //调取方法：
        //跟踪页面浏览：x('', '', '', p, q, '', '1', document.title.replace(/\t|\n|\r/g, ""), '');
        //跟踪页面点击：x('', objName, regionIds, p, q, c, '2', document.title.replace(/\t|\n|\r/g, ""), objTagName)
        //异步调取？：x('', '', '', p, a, '', '5', document.title.replace(/\t|\n|\r/g, ""), '')
        //第一个参数a：空
        //第二个参数b：页面中的锚点
        //第三个参数c：记录多个点击锚点 id
        //第四个参数d：流量来源URL
        //第五个参数e：当前页面页面URL
        //第六个参数f：页面转向URL
        //第七个参数g：固定值,记录跟踪类型
        //第八个参数h：页面标题
        //第九个参数i：记录页面类 class
        //参数l：&amp;out_refer=
        //参数k：&amp;visit_count= 访问次数
        //参数o：&amp;is_first_pv=
        //参数i：&amp;ctr_type=
        var x = function (a, b, c, d, e, f, g, h, i) {
            if (b == null) b = '';
            var j = new Image();
            j.src = v + 'page_tracker.aspx?m_id=' + a + '&amp;o_id=' + b + '&amp;region_ids=' + c + '&amp;out_refer=' + escape(l) + '&amp;refer_url=' + escape(d) + '&amp;url=' + escape(e) + '&amp;to_url=' + escape(f) + '&amp;type=' + g + '&amp;visit_count=' + k + '&amp;is_first_pv=' + o + '&amp;ctr_type=' + i + "&amp;r=" + Math.random() + '&amp;title=' + escape(h);
            o = 0
        };

        //记录点击类型（表单统计）
        var z = function (a) {
            if (a == null || a.tagName == null) return false;
            if (a.tagName.toLowerCase() == "area" || a.tagName.toLowerCase() == "a" || (a.tagName.toLowerCase() == "input" &amp;&amp; (a.type.toLowerCase() == "button" || a.type.toLowerCase() == "sumbit" || a.type.toLowerCase() == "image"))) {
                return true
            }
            if (a.getAttribute("onclick") != "undefined" &amp;&amp; a.getAttribute("onclick") != null) {
                return true
            }
            return false
        };

        //获取时间+随机数
        //主要用途：标明唯一身份访问
        var A = function () {
            var n = new Date();
            var y = n.getFullYear() + '';
            var m = n.getMonth() + 1;
            if (m &lt; 10) m = "0" + m;
            var d = n.getDate();
            if (d &lt; 10) d = "0" + d;
            var H = n.getHours();
            if (H &lt; 10) H = "0" + H;
            var M = n.getMinutes();
            if (M &lt; 10) M = "0" + M;
            var S = n.getSeconds();
            if (S &lt; 10) S = "0" + S;
            var a = "00" + n.getMilliseconds();
            a = a.substr(a.length - 3, 3);
            return y + m + d + H + M + S + a + Math.floor(100000 + Math.random() * 900000) + Math.floor(100000 + Math.random() * 900000) + Math.floor(100000 + Math.random() * 900000)
        };

        //获取Cookies的值
        var B = function (a) {
            var b = document.cookie.match(new RegExp("(^| )" + a + "=([^;]*)(;|$)"));
            if (b != null) return unescape(b[2]);
            return ''
        };

        //设置Cookies值
        var C = function () {
            if (B('__permanent_id') == '' || !/^\d{35}$/.test(B('__permanent_id'))) {
                var a = new Date(2020, 1, 1);
                CookieUtil.set("__permanent_id", A(), a, "/", s)
            }
            if (CookieUtil.get("__ddclicka")) {
                CookieUtil.unset("__ddclicka", null, s)
            }
            var b = "0000000001";
            //有效期一年
            var c = new Date();
            c.setTime(c.getTime() + 2 * 365 * 24 * 60 * 60 * 1000);
            //有效期半小时
            var d = new Date();
            d.setTime(d.getTime() + 30 * 60 * 1000);
            var e;
            if (CookieUtil.get("__ddclick_visit") &amp;&amp; CookieUtil.get("__ddclick_visit").split(".").length == 2) {
                k = CookieUtil.get("__ddclick_visit").split(".")[1];
                if (isNaN(parseInt(k))) {
                    k = 0
                }
                if (!CookieUtil.get("__trace_id") || !CookieUtil.get("__ddclickc")) {
                    k++;
                    e = b + "." + k;
                    CookieUtil.set("__ddclick_visit", e, c, "/", s);
                    CookieUtil.set("__trace_id", A(), d, "/", s);
                    CookieUtil.set("__ddclickc", b, null, "/", s);
                    o = 1
                } else {
                    CookieUtil.set("__trace_id", A(), d, "/", s)
                }
            } else {
                k = 1;
                e = b + "." + k;
                CookieUtil.set("__ddclick_visit", e, c, "/", s);
                CookieUtil.set("__trace_id", A(), d, "/", s);
                CookieUtil.set("__ddclickc", b, null, "/", s);
                o = 1
            }
            D()
        };

        //来源关键词记录
        var D = function () {
            var a = new Date();
            a.setTime(a.getTime() + 24 * 60 * 60 * 1000);
            if (p == "" || p == null || p == "undefined") {
                if (o) {
                    l = "|";
                    CookieUtil.set("out_refer", l, a, "/", s)
                }
            } else {
                var b = /^https?:\/\/[\w\.]*?dangdang/;
                if (!b.test(p)) {
                    __dd_Campaign_obj = new __dd_Campaign();
                    l = __dd_Campaign_obj.transCampaignURL(p);
                    CookieUtil.set("out_refer", l, a, "/", s)
                }
            }
            l = CookieUtil.get("out_refer")
        };

        //跟踪页面点击
        this.trackPageclick = function (e) {
            e = e || window.event;
            if (e == null) return;
            var a = e.srcElement || e.target;
            var b = true;
            while (true) {
                b = z(a);
                if (b) {
                    break
                } else {
                    a = a.parentNode;
                    if (a == null || a.tagName == null || a.tagName.toLowerCase() == "body" || a.tagName.toLowerCase() == "html") return
                }
            }
            var c = objName = regionIds = objTagName = "";
            if (a.tagName) objTagName = a.tagName;
            if (a.href) c = a.href;
            if (a.id) objName = a.id;
            else if (a.name) objName = a.name;
            a = a.parentNode;
            while (a != null &amp;&amp; a.tagName != null &amp;&amp; a.tagName.toLowerCase() != "body" &amp;&amp; a.tagName.toLowerCase() != "html") {
                if (a.id) {
                    regionIds += a.id + r
                } else if (a.name) {
                    regionIds += a.name + r
                } else if (a.getAttribute) {
                    var d = a.getAttribute("name");
                    if (d) {
                        regionIds += d + r
                    }
                }
                a = a.parentNode
            }
            C();
            x('', objName, regionIds, p, q, c, '2', document.title.replace(/\t|\n|\r/g, ""), objTagName)
        };

        //跟踪页面浏览
        this.trackPageview = function () {
            if (arguments.length &gt; 0) {
                p = q;
                q = arguments[0];
                q = q.replace(/\t|\n|\r/g, "")
            } else {
                try {
                    q = location.href
                } catch (e) {
                    q = document.URL
                }
                if (typeof _ozurltail != "undefined") {
                    q = q + _ozurltail
                }
                q = q.replace(/\t|\n|\r/g, "");
                w(q)
            }
            C();
            x('', '', '', p, q, '', '1', document.title.replace(/\t|\n|\r/g, ""), '');
            removeEventHandler(document, "click", this.trackPageclick);
            addEventHandler(document, "click", this.trackPageclick)
        };

        //发送数据请求
        this.trackPingPHP = function (a) {
            a = a.replace(/\t|\n|\r/g, "");
            w(a);
            x('', '', '', p, a, '', '5', document.title.replace(/\t|\n|\r/g, ""), '')
        }
    };
    ddclick_page_tracker = new PageTracker();
    ddclick_page_tracker.trackPageview();

    //监测页面点击
    function __dd_trackPageclick(e) {
        if (e == null) e = window.event || arguments.callee.caller.arguments[0];
        ddclick_page_tracker.trackPageclick(e)
    };
    //监测页面浏览
    function __dd_trackPageview_forAjax(a) {
        ddclick_page_tracker.trackPageview(a)
    }
}