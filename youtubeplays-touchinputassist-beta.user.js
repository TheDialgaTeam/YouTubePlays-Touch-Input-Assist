// ==UserScript==
// @name         YouTubePlays Touch Input Assist
// @namespace    TheDialgaTeam/YouTubePlays-Touch-Input-Assist
// @version      0.1
// @author       Yong Jian Ming (jianmingyong)
// @description  Generate useful touch commands aims to help new players to understand how the touch commands work.
// @homepage     https://github.com/TheDialgaTeam/YouTubePlays-Touch-Input-Assist
// @supportURL   https://github.com/TheDialgaTeam/YouTubePlays-Touch-Input-Assist/issues
// @match        https://www.youtube.com/watch?v=ArvVyvjm0yo*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @require      https://kit.fontawesome.com/e5e217aee3.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// ==/UserScript==

(function() {
    'use strict';

    // SCRIPT CONSTANTS //
    const TOUCH_LAYOUT_NDS = {
        name: "nds",
        top: {
            width: 256,
            height: 192,
        },
        bottom: {
            width: 256,
            height: 192,
        },
    };

    const TOUCH_LAYOUT_3DS = {
        name: "3ds",
        top: {
            width: 400,
            height: 240,
        },
        bottom: {
            width: 320,
            height: 240,
        },
    };

    // SCRIPT VARIABLES //
    var youtubePlayerContainer, youtubePlayerVideo, youtubeChatContainer;
    var layoutMode = GM_getValue('layoutMode', TOUCH_LAYOUT_NDS);
    var displayTouchGrid = GM_getValue('displayTouchGrid', false);

    function loadRequiredDomElements() {
        var playerContainer = $('#movie_player');

        if (playerContainer.length === 0) {
            setTimeout(loadRequiredDomElements, 1000);
            return;
        }

        var playerVideo = playerContainer.find('.video-stream');

        if (playerVideo.length === 0) {
            setTimeout(loadRequiredDomElements, 1000);
            return;
        }

        var chatContainer = $('#chatframe').contents().find('yt-live-chat-renderer.style-scope');

        if (chatContainer.length === 0) {
            setTimeout(loadRequiredDomElements, 1000);
            return;
        }

        youtubePlayerContainer = playerContainer;
        youtubePlayerVideo = playerVideo;
        youtubeChatContainer = chatContainer;

        skipAds();
        setupChat();
        setupVideo();
    }

    function skipAds(retry) {
        if (!retry) retry = 0;
        if (retry === 5) return;

        var skipAdsButton = $('.ytp-ad-skip-button');

        if (skipAdsButton.length === 0) {
            setTimeout(skipAds, 1000, retry + 1);
            return;
        }

        skipAdsButton.click();
    }

    function setupChat() {
        // Set the chat to Live chat mode.
        if (youtubeChatContainer.find('#label-text').text() === 'Top chat') {
            youtubeChatContainer.find('a.yt-simple-endpoint:nth-child(2) > paper-item:nth-child(1)').click();
        }

        // Hide the live chat banner.
        var liveChatBanner = youtubeChatContainer.find('#live-chat-banner');

        if (liveChatBanner.length !== 0) {
            liveChatBanner.css('display', 'none');
        }
    }

    function setupVideo() {
        var touchGridSize = getTouchGridSize(layoutMode, parseFloat(youtubePlayerVideo.css('width')), parseFloat(youtubePlayerVideo.css('height')));
        var touchGridHtml = `<canvas id="touchGrid" width="${touchGridSize.width}" height="${touchGridSize.height}" style="display: none; z-index: 999; position: absolute; border: 1px solid black; left: ${touchGridSize.left}%" />`;
        var touchCoordHtml = `<div id="touchCoord" style="display: none; z-index: 999; position: absolute; left: ${touchGridSize.left}%; top: ${touchGridSize.height + 8}px">
<p>Touch Coordinates:</p>
<p>X: <span id="touchCoordX">0</span></p>
<p>Y: <span id="touchCoordY">0</span></p>
<p>Touch Command: <span id="touchCoordCommand">0</span></p>
</div>`;
        var touchGridToggleHtml = `<button id="touchGridToggle" class="ytp-button" title="Show Grid" style="text-align: center"><i class="fas fa-border-none"></i></button>`;
        var touchGridLayoutHtml = `<button id="touchGridLayout" class="ytp-button" title="Switch to 3ds layout" style="text-align: center"><i class="fas fa-gamepad"></i></button>`;

        youtubePlayerContainer.append(touchGridHtml);
        youtubePlayerContainer.append(touchCoordHtml);

        var youtubePlayerControls = youtubePlayerContainer.find('.ytp-right-controls');
        youtubePlayerControls.prepend(touchGridToggleHtml);
        youtubePlayerControls.prepend(touchGridLayoutHtml);

        setupTouchGrid(youtubePlayerContainer.find('#touchGrid'));
        setupTouchCoord(youtubePlayerContainer.find('#touchCoord'));
        setupTouchGridToggle(youtubePlayerControls.find('#touchGridToggle'));
        setupTouchGridLayout(youtubePlayerControls.find('#touchGridLayout'));

        if (displayTouchGrid) {
            var touchGridToggle = youtubePlayerControls.find('#touchGridToggle');
            touchGridToggle.html(`<i class="fas fa-border-all"></i>`);
            touchGridToggle.attr('title', 'Hide Grid');

            youtubePlayerContainer.find('#touchGrid').css('display', 'inherit');
            youtubePlayerContainer.find('#touchCoord').css('display', 'inherit');
        }
    }

    function setupTouchGrid(touchGrid) {
        // Register Mouse Move Event
        touchGrid.on('mousemove', function (e) {
            var x = (e.pageX - touchGrid.offset().left) / touchGrid.width() * 100;
            var y = (e.pageY - touchGrid.offset().top) / touchGrid.height() * 100;

            $('#touchCoordX').text(Math.round(x));
            $('#touchCoordY').text(Math.round(y));
            $('#touchCoordCommand').text(`t:${Math.round(x)}:${Math.round(y)}`);
        });

        touchGrid.on('click', function (e) {
            var x = (e.pageX - touchGrid.offset().left) / touchGrid.width() * 100;
            var y = (e.pageY - touchGrid.offset().top) / touchGrid.height() * 100;

            var chatInput = youtubeChatContainer.find('yt-live-chat-text-input-field-renderer.style-scope > div:nth-child(2)');
            chatInput.focus();

            navigator.clipboard.writeText(`t:${Math.round(x)}:${Math.round(y)}`).then(function() {
                GM_notification({title: 'Clipboard', text: 'Successfully copied to clipboard!', timeout: 3000});
            }, function() {
                GM_notification({title: 'Clipboard', text: 'Unable to copy into clipboard!', timeout: 3000});
            });
        });

        updateTouchGrid(touchGrid, touchGrid.get(0).getContext('2d'));
    }

    function updateTouchGrid(touchGrid, context, width, height) {
        var touchGridSize = getTouchGridSize(layoutMode, parseFloat(youtubePlayerVideo.css('width')), parseFloat(youtubePlayerVideo.css('height')));

        if (touchGridSize.width === width && touchGridSize.height === height) {
            setTimeout(updateTouchGrid, 1000, touchGrid, context, width, height);
            return;
        }

        context.canvas.width = touchGridSize.width;
        context.canvas.height = touchGridSize.height;
        touchGrid.css('left', `${touchGridSize.left}%`);

        drawGrid(context, touchGridSize.width, touchGridSize.height);

        setTimeout(updateTouchGrid, 1000, touchGrid, context, touchGridSize.width, touchGridSize.height);
    }

    function setupTouchCoord(touchCoord) {
        updateTouchCoord(touchCoord);
    }

    function updateTouchCoord(touchCoord, width, height) {
        var touchGridSize = getTouchGridSize(layoutMode, parseFloat(youtubePlayerVideo.css('width')), parseFloat(youtubePlayerVideo.css('height')));

        if (touchGridSize.width === width && touchGridSize.height === height) {
            setTimeout(updateTouchCoord, 1000, touchCoord, width, height);
            return;
        }

        touchCoord.css('left', `${touchGridSize.left}%`);
        touchCoord.css('top', `${touchGridSize.height + 8}px`);

        setTimeout(updateTouchCoord, 1000, touchCoord, touchGridSize.width, touchGridSize.height);
    }

    function setupTouchGridToggle(touchGridToggle) {
        touchGridToggle.on('click', function () {
            if (touchGridToggle.find('svg').hasClass('fa-border-all')) {
                touchGridToggle.html(`<i class="fas fa-border-none"></i>`);
                touchGridToggle.attr('title', 'Show Grid');

                youtubePlayerContainer.find('#touchGrid').css('display', 'none');
                youtubePlayerContainer.find('#touchCoord').css('display', 'none');

                GM_setValue('displayTouchGrid', false);
            } else {
                touchGridToggle.html(`<i class="fas fa-border-all"></i>`);
                touchGridToggle.attr('title', 'Hide Grid');

                youtubePlayerContainer.find('#touchGrid').css('display', 'inherit');
                youtubePlayerContainer.find('#touchCoord').css('display', 'inherit');

                GM_setValue('displayTouchGrid', true);
            }

            updateTouchGridToggle(touchGridToggle);
        });

        updateTouchGridToggle(touchGridToggle);
    }

    function updateTouchGridToggle(touchGridToggle) {
        var touchGridToggleSvg = touchGridToggle.find('svg');

        if (touchGridToggleSvg.length === 0) {
            setTimeout(updateTouchGridToggle, 1000, touchGridToggle);
            return;
        }

        touchGridToggleSvg.css('width', '50%');
        touchGridToggleSvg.css('height', '100%');
    }

    function setupTouchGridLayout(touchGridLayout) {
        touchGridLayout.on('click', function () {
            if (layoutMode.name === TOUCH_LAYOUT_NDS.name) {
                touchGridLayout.attr('title', 'Switch to NDS layout');

                layoutMode = TOUCH_LAYOUT_3DS;
                GM_setValue('layoutMode', TOUCH_LAYOUT_3DS);
                GM_notification({title: 'Touch Grid Mode', text: 'Successfully changed to 3DS layout!', timeout: 3000});
            } else {
                touchGridLayout.attr('title', 'Switch to 3DS layout');

                layoutMode = TOUCH_LAYOUT_NDS;
                GM_setValue('layoutMode', TOUCH_LAYOUT_NDS);
                GM_notification({title: 'Touch Grid Mode', text: 'Successfully changed to NDS layout!', timeout: 3000});
            }
        });

        updateTouchGridLayout(touchGridLayout);
    }

    function updateTouchGridLayout(touchGridLayout) {
        var touchGridLayoutSvg = touchGridLayout.find('svg');

        if (touchGridLayoutSvg.length === 0) {
            setTimeout(updateTouchGridLayout, 1000, touchGridLayout);
            return;
        }

        touchGridLayoutSvg.css('width', '50%');
        touchGridLayoutSvg.css('height', '100%');
    }

    function getTouchGridSize(layout, width, height) {
        var adjustedWidth = layout.bottom.width / (layout.top.width + layout.bottom.width) * width;
        var adjustedHeight = (layout.bottom.height / layout.bottom.width) * adjustedWidth;

        return {
            left: layout.top.width / (layout.top.width + layout.bottom.width) * 100,
            width: adjustedWidth,
            height: adjustedHeight,
        };
    }

    function drawGrid(context, width, height) {
        var widthStep = width / 100;
        var heightStep = height / 100;

        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.beginPath();

        for (var percentage = 0; percentage <= 100; percentage++) {
            context.moveTo(percentage * widthStep, 0);
            context.lineTo(percentage * widthStep, height);
            context.moveTo(0, percentage * heightStep);
            context.lineTo(width, percentage * heightStep);

            if (percentage % 10 === 0) {
                context.setLineDash([]);
                context.lineWidth = 0.5;
                context.stroke();
                context.beginPath();
            } else {
                context.setLineDash([1, 1]);
                context.lineWidth = 0.25;
                context.stroke();
                context.beginPath();
            }
        }
    }

    loadRequiredDomElements();
})();