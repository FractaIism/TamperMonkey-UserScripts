// ==UserScript==
// @name         TorrentDay Improved Table
// @namespace    Fractalism
// @version      0.0
// @description  Make the table better
// @author       Fractalism
// @match        http*://www.torrentday.com/peers*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var thtd = document.querySelectorAll('th, td');

    for(let cell of thtd) {
        cell.style.textAlign = 'center';
    }

    var table = document.getElementsByTagName('table')[0];
    table.border = 1;
    table.style.border = '1px solid white';
})();