// ==UserScript==
// @name         YouTubePlays Touch Input Assist
// @namespace    TheDialgaTeam/YouTubePlays-Touch-Input-Assist
// @version      0.2.4
// @author       Yong Jian Ming (jianmingyong)
// @description  Generate useful touch commands aims to help new players to understand how the touch commands work.
// @homepage     https://github.com/TheDialgaTeam/YouTubePlays-Touch-Input-Assist
// @updateURL    https://github.com/TheDialgaTeam/YouTubePlays-Touch-Input-Assist/raw/master/youtubeplays-touchinputassist.user.meta.js
// @downloadURL  https://github.com/TheDialgaTeam/YouTubePlays-Touch-Input-Assist/raw/master/youtubeplays-touchinputassist.user.js
// @supportURL   https://github.com/TheDialgaTeam/YouTubePlays-Touch-Input-Assist/issues
// @match        https://www.youtube.com/watch?v=HaTczl7e5WA*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @require      https://kit.fontawesome.com/e5e217aee3.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// ==/UserScript==
!function(){"use strict";var a,d,h,c={name:"nds",top:{width:256,height:192},bottom:{width:256,height:192}},s={name:"3ds",top:{width:400,height:240},bottom:{width:320,height:240}},n="<style>#touchGridToggle > svg, #touchGridLayout > svg { width: 50%; height: 100% }</style>",l=GM_getValue("layoutMode",c),r=GM_getValue("displayTouchGrid",!1);function u(t){var i;5!==(t=t||0)&&(0!==(i=$(".ytp-ad-skip-button")).length?i.click():setTimeout(u,1e3,t+1))}function p(t,i,o,e){var n=g(l,parseFloat(d.css("width")),parseFloat(d.css("height")));n.width!==o||n.height!==e?(i.canvas.width=n.width,i.canvas.height=n.height,t.css("left","".concat(n.left,"%")),function(t,i,o){var e=i/100,n=o/100;t.clearRect(0,0,t.canvas.width,t.canvas.height),t.beginPath();for(var a=0;a<=100;a++)t.moveTo(a*e,0),t.lineTo(a*e,o),t.moveTo(0,a*n),t.lineTo(i,a*n),a%10==0?(t.setLineDash([]),t.lineWidth=.5):(t.setLineDash([1,1]),t.lineWidth=.25),t.stroke(),t.beginPath()}(i,n.width,n.height),setTimeout(p,1e3,t,i,n.width,n.height)):setTimeout(p,1e3,t,i,o,e)}function f(t,i,o){var e=g(l,parseFloat(d.css("width")),parseFloat(d.css("height")));e.width!==i||e.height!==o?(t.css("left","".concat(e.left,"%")),t.css("top","".concat(e.height+8,"px")),setTimeout(f,1e3,t,e.width,e.height)):setTimeout(f,1e3,t,i,o)}function g(t,i){var o=t.bottom.width/(t.top.width+t.bottom.width)*i,e=t.bottom.height/t.bottom.width*o;return{left:t.top.width/(t.top.width+t.bottom.width)*100,width:o,height:e}}!function t(){var i,o,e=$("#movie_player");0!==e.length&&0!==(i=e.find(".video-stream")).length&&0!==(o=$("#chatframe").contents().find("yt-live-chat-renderer.style-scope")).length?(a=e,d=i,h=o,$(n).appendTo("head"),u(),function(){"Top chat"===h.find("#label-text").text()&&h.find("a.yt-simple-endpoint:nth-child(2) > paper-item:nth-child(1)").click();var t=h.find("#live-chat-banner");0!==t.length&&t.css("display","none")}(),function(){var t=g(l,parseFloat(d.css("width")),parseFloat(d.css("height"))),i='<canvas id="touchGrid" width="'.concat(t.width,'" height="').concat(t.height,'" style="display: none; z-index: 999; position: absolute; border: 1px solid black; left: ').concat(t.left,'%" />'),o='<div id="touchCoord" style="display: none; z-index: 999; position: absolute; left: '.concat(t.left,"%; top: ").concat(t.height+8,'px">\n<p>Touch Coordinates:</p>\n<p>X: <span id="touchCoordX">0</span></p>\n<p>Y: <span id="touchCoordY">0</span></p>\n<p>Touch Command: <span id="touchCoordCommand">0</span></p>\n</div>');a.append(i),a.append(o);var e,n=a.find(".ytp-right-controls");n.prepend('<button id="touchGridToggle" class="ytp-button" title="Show Grid" style="text-align: center"><i class="fas fa-border-none"></i></button>'),n.prepend('<button id="touchGridLayout" class="ytp-button" title="Switch to 3ds layout" style="text-align: center"><i class="fas fa-gamepad"></i></button>'),function(e){e.on("mousemove",function(t){var i=(t.pageX-e.offset().left)/e.width()*100,o=(t.pageY-e.offset().top)/e.height()*100;$("#touchCoordX").text(Math.round(i)),$("#touchCoordY").text(Math.round(o)),$("#touchCoordCommand").text("t:".concat(Math.round(i),":").concat(Math.round(o)))}),e.on("click",function(t){var i=(t.pageX-e.offset().left)/e.width()*100,o=(t.pageY-e.offset().top)/e.height()*100;h.find("yt-live-chat-text-input-field-renderer.style-scope > div:nth-child(2)").focus(),navigator.clipboard.writeText("t:".concat(Math.round(i),":").concat(Math.round(o))).then(function(){GM_notification({title:"Clipboard",text:"Successfully copied to clipboard!",timeout:3e3})},function(){GM_notification({title:"Clipboard",text:"Unable to copy into clipboard!",timeout:3e3})})}),p(e,e.get(0).getContext("2d"))}(a.find("#touchGrid")),function(t){f(t)}(a.find("#touchCoord")),function(t){t.on("click",function(){t.find("svg").hasClass("fa-border-all")?(t.html('<i class="fas fa-border-none"></i>'),t.attr("title","Show Grid"),a.find("#touchGrid").css("display","none"),a.find("#touchCoord").css("display","none"),GM_setValue("displayTouchGrid",!1)):(t.html('<i class="fas fa-border-all"></i>'),t.attr("title","Hide Grid"),a.find("#touchGrid").css("display","inherit"),a.find("#touchCoord").css("display","inherit"),GM_setValue("displayTouchGrid",!0))})}(n.find("#touchGridToggle")),function(t){t.on("click",function(){l.name===c.name?(t.attr("title","Switch to NDS layout"),l=s,GM_setValue("layoutMode",s),GM_notification({title:"Touch Grid Mode",text:"Successfully changed to 3DS layout!",timeout:3e3})):(t.attr("title","Switch to 3DS layout"),l=c,GM_setValue("layoutMode",c),GM_notification({title:"Touch Grid Mode",text:"Successfully changed to NDS layout!",timeout:3e3}))})}(n.find("#touchGridLayout")),r&&((e=n.find("#touchGridToggle")).html('<i class="fas fa-border-all"></i>'),e.attr("title","Hide Grid"),a.find("#touchGrid").css("display","inherit"),a.find("#touchCoord").css("display","inherit"))}()):setTimeout(t,1e3)}()}();
