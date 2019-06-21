// ==UserScript==
// @name         YouTaker Download mp3
// @namespace    http://tampermonkey.net/
// @version      0.0
// @description  Provide download link for YouTaker music
// @author       Fractalism
// @match        http*://www.youtaker.com/video/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var text_replace = document.getElementById("kdd").firstChild
    if(typeof musicfile === "undefined") {
        text_replace.innerHTML = "Could not find music file"
        return
    }
    text_replace.href = musicfile
    text_replace.innerHTML = "Download link"
})();