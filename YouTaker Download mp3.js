// ==UserScript==
// @name         YouTaker Download mp3
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  Provide download link for YouTaker music (right click "Download link" right under the video -> "Save As", remember to give it a proper name!)
// @author       Fractalism
// @match        http*://www.youtaker.com/video/*
// @grant        none
// @updateURL    https://github.com/FractaIism/TamperMonkey-UserScripts/blob/master/YouTaker%20Download%20mp3.js
// ==/UserScript==

(function() {
    'use strict';

    var text_replace = document.getElementById("kdd").firstChild
    var kdd_style = document.createElement("style")
    kdd_style.innerHTML = `
    #kdd {
        background-color: black;
        border: 1px solid black;
        border-radius: 5px;
        padding: 3px 5px 3px 5px;
        color: darkseagreen;
    }`
    document.head.appendChild(kdd_style)
    if(typeof musicfile === "undefined") {
        text_replace.innerHTML = "Could not find music file"
        return
    }
    text_replace.href = musicfile
    text_replace.innerHTML = "Download link"
})();
