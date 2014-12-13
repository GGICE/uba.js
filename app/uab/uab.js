/**
 * Created by ggice on 14/12/13.
 */
"use strict";
(function uabase(){
    var data = [];
  //  create a heatmap instance
    var heatmap = h337.create({
        container: document.getElementsByTagName("BODY")[0],
        maxOpacity: .3,
        radius: 50,
        blur: .90,
        // backgroundColor with alpha so you can see through it
        backgroundColor: 'rgba(0, 0, 58, 0.10)'
    });
    document.onclick = function(e) {
        var temData;
        var className = e.target.className,
            id = e.target.id,
            href = e.target.href,
            x = e.layerX,
            y = e.layerY;
        temData = {
            "className" : className,
            "id" : id,
            "href" : href,
            "x" : x,
            "y" : y
        };
        console.log(temData);
        data.push(temData);
        console.log(data);
        heatmap.addData({ x: x, y: y, value: 1 });
    };
    window.onbeforeunload = function() {
        var showData = JSON.stringify(data);
        return showData;
    };
}());