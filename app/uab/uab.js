/**
 * Created by ggice on 14/12/13.
 */
"use strict";

//Build Event Listeners
function addEventHandler(a, b, c) {
    if (a.addEventListener) {
        a.addEventListener(b, c, false)
    } else if (a.attachEvent) {
        a.attachEvent("on" + b, c)
    } else {
        a["on" + b] = c
    }
};
//the base
(function uabase() {
    var data = [];
    var that = {};
    //  create a heatmap instance
    var heatmap = h337.create({
        container: document.getElementsByTagName("BODY")[0],
        maxOpacity: .3,
        radius: 50,
        blur: .90,
        // backgroundColor with alpha so you can see through it
        backgroundColor: 'rgba(0, 0, 58, 0.10)'
    });
    //detection page click
    that.detectionPageClick = function (e) {
        var temData = {};
            temData.className = e.target.className,
            temData.id = e.target.id,
            temData.href = e.target.href,
            temData.x = e.layerX,
            temData.y = e.layerY;
        console.log(temData);
        data.push(temData);
        console.log(data);
        heatmap.addData({ x: temData.x, y: temData.y, value: 1 });
    };
    addEventHandler(document, "click", that.detectionPageClick);
    window.onbeforeunload = function () {
        var showData = JSON.stringify(data);
        return showData;
    };
}());