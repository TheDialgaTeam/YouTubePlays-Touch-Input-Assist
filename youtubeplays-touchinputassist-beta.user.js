// ==UserScript==
// @name         YouTubePlays Touch Input Assist
// @namespace    TheDialgaTeam/YouTubePlays-Touch-Input-Assist
// @version      0.2
// @author       Yong Jian Ming (jianmingyong)
// @description  Generate useful touch commands aims to help new players to understand how the touch commands work.
// @homepage     https://github.com/TheDialgaTeam/YouTubePlays-Touch-Input-Assist
// @updateURL    https://github.com/TheDialgaTeam/YouTubePlays-Touch-Input-Assist/raw/master/youtubeplays-touchinputassist-beta.user.js
// @downloadURL  https://github.com/TheDialgaTeam/YouTubePlays-Touch-Input-Assist/raw/master/youtubeplays-touchinputassist-beta.user.js
// @supportURL   https://github.com/TheDialgaTeam/YouTubePlays-Touch-Input-Assist/issues
// @match        https://www.youtube.com/watch?v=ArvVyvjm0yo*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @require      https://kit.fontawesome.com/e5e217aee3.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// ==/UserScript==
(function () {
  'use strict'; // SCRIPT CONSTANTS //

  function a() {
    var f = $('#movie_player');
    if (0 === f.length) return void setTimeout(a, 1e3);
    var g = f.find('.video-stream');
    if (0 === g.length) return void setTimeout(a, 1e3);
    var h = $('#chatframe').contents().find('yt-live-chat-renderer.style-scope');
    return 0 === h.length ? void setTimeout(a, 1e3) : void (n = f, o = g, p = h, b(), c(), d(), e());
  }

  function b() {
    $("<style>#touchGridToggle > svg, #touchGridLayout > svg { width: 50%; height: 100% }</style>").appendTo('head');
  }

  function c(a) {
    if (a || (a = 0), 5 !== a) {
      var b = $('.ytp-ad-skip-button');
      return 0 === b.length ? void setTimeout(c, 1e3, a + 1) : void b.click();
    }
  }

  function d() {
    'Top chat' === p.find('#label-text').text() && p.find('a.yt-simple-endpoint:nth-child(2) > paper-item:nth-child(1)').click();
    // Hide the live chat banner.
    var a = p.find('#live-chat-banner');
    0 !== a.length && a.css('display', 'none');
  }

  function e() {
    var a = l(s, parseFloat(o.css('width')), parseFloat(o.css('height'))),
        b = "<canvas id=\"touchGrid\" width=\"".concat(a.width, "\" height=\"").concat(a.height, "\" style=\"display: none; z-index: 999; position: absolute; border: 1px solid black; left: ").concat(a.left, "%\" />"),
        c = "<div id=\"touchCoord\" style=\"display: none; z-index: 999; position: absolute; left: ".concat(a.left, "%; top: ").concat(a.height + 8, "px\">\n<p>Touch Coordinates:</p>\n<p>X: <span id=\"touchCoordX\">0</span></p>\n<p>Y: <span id=\"touchCoordY\">0</span></p>\n<p>Touch Command: <span id=\"touchCoordCommand\">0</span></p>\n</div>");
    n.append(b), n.append(c);
    var d = n.find('.ytp-right-controls');

    if (d.prepend("<button id=\"touchGridToggle\" class=\"ytp-button\" title=\"Show Grid\" style=\"text-align: center\"><i class=\"fas fa-border-none\"></i></button>"), d.prepend("<button id=\"touchGridLayout\" class=\"ytp-button\" title=\"Switch to 3ds layout\" style=\"text-align: center\"><i class=\"fas fa-gamepad\"></i></button>"), f(n.find('#touchGrid')), h(n.find('#touchCoord')), j(d.find('#touchGridToggle')), k(d.find('#touchGridLayout')), t) {
      var e = d.find('#touchGridToggle');
      e.html("<i class=\"fas fa-border-all\"></i>"), e.attr('title', 'Hide Grid'), n.find('#touchGrid').css('display', 'inherit'), n.find('#touchCoord').css('display', 'inherit');
    }
  }

  function f(a) {
    // Register Mouse Move Event
    a.on('mousemove', function (b) {
      var c = 100 * ((b.pageX - a.offset().left) / a.width()),
          d = 100 * ((b.pageY - a.offset().top) / a.height());
      $('#touchCoordX').text(Math.round(c)), $('#touchCoordY').text(Math.round(d)), $('#touchCoordCommand').text("t:".concat(Math.round(c), ":").concat(Math.round(d)));
    }), a.on('click', function (b) {
      var c = 100 * ((b.pageX - a.offset().left) / a.width()),
          d = 100 * ((b.pageY - a.offset().top) / a.height()),
          e = p.find('yt-live-chat-text-input-field-renderer.style-scope > div:nth-child(2)');
      e.focus(), navigator.clipboard.writeText("t:".concat(Math.round(c), ":").concat(Math.round(d))).then(function () {
        GM_notification({
          title: 'Clipboard',
          text: 'Successfully copied to clipboard!',
          timeout: 3e3
        });
      }, function () {
        GM_notification({
          title: 'Clipboard',
          text: 'Unable to copy into clipboard!',
          timeout: 3e3
        });
      });
    }), g(a, a.get(0).getContext('2d'));
  }

  function g(a, b, c, d) {
    var e = l(s, parseFloat(o.css('width')), parseFloat(o.css('height')));
    return e.width === c && e.height === d ? void setTimeout(g, 1e3, a, b, c, d) : void (b.canvas.width = e.width, b.canvas.height = e.height, a.css('left', "".concat(e.left, "%")), m(b, e.width, e.height), setTimeout(g, 1e3, a, b, e.width, e.height));
  }

  function h(a) {
    i(a);
  }

  function i(a, b, c) {
    var d = l(s, parseFloat(o.css('width')), parseFloat(o.css('height')));
    return d.width === b && d.height === c ? void setTimeout(i, 1e3, a, b, c) : void (a.css('left', "".concat(d.left, "%")), a.css('top', "".concat(d.height + 8, "px")), setTimeout(i, 1e3, a, d.width, d.height));
  }

  function j(a) {
    a.on('click', function () {
      a.find('svg').hasClass('fa-border-all') ? (a.html("<i class=\"fas fa-border-none\"></i>"), a.attr('title', 'Show Grid'), n.find('#touchGrid').css('display', 'none'), n.find('#touchCoord').css('display', 'none'), GM_setValue('displayTouchGrid', !1)) : (a.html("<i class=\"fas fa-border-all\"></i>"), a.attr('title', 'Hide Grid'), n.find('#touchGrid').css('display', 'inherit'), n.find('#touchCoord').css('display', 'inherit'), GM_setValue('displayTouchGrid', !0));
    });
  }

  function k(a) {
    a.on('click', function () {
      s.name === q.name ? (a.attr('title', 'Switch to NDS layout'), s = r, GM_setValue('layoutMode', r), GM_notification({
        title: 'Touch Grid Mode',
        text: 'Successfully changed to 3DS layout!',
        timeout: 3e3
      })) : (a.attr('title', 'Switch to 3DS layout'), s = q, GM_setValue('layoutMode', q), GM_notification({
        title: 'Touch Grid Mode',
        text: 'Successfully changed to NDS layout!',
        timeout: 3e3
      }));
    });
  }

  function l(a, b) {
    var c = a.bottom.width / (a.top.width + a.bottom.width) * b,
        d = a.bottom.height / a.bottom.width * c;
    return {
      left: 100 * (a.top.width / (a.top.width + a.bottom.width)),
      width: c,
      height: d
    };
  }

  function m(a, b, c) {
    var d = b / 100,
        e = c / 100;
    a.clearRect(0, 0, a.canvas.width, a.canvas.height), a.beginPath();

    for (var f = 0; 100 >= f; f++) a.moveTo(f * d, 0), a.lineTo(f * d, c), a.moveTo(0, f * e), a.lineTo(b, f * e), 0 == f % 10 ? (a.setLineDash([]), a.lineWidth = .5, a.stroke(), a.beginPath()) : (a.setLineDash([1, 1]), a.lineWidth = .25, a.stroke(), a.beginPath());
  }

  var n,
      o,
      p,
      q = {
    name: "nds",
    top: {
      width: 256,
      height: 192
    },
    bottom: {
      width: 256,
      height: 192
    }
  },
      r = {
    name: "3ds",
    top: {
      width: 400,
      height: 240
    },
    bottom: {
      width: 320,
      height: 240
    }
  },
      s = GM_getValue('layoutMode', q),
      t = GM_getValue('displayTouchGrid', !1);
  a();
})();