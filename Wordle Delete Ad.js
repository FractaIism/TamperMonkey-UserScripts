// ==UserScript==
// @name         Wordle Delete Ad
// @namespace    https://github.com/FractaIism/TamperMonkey-UserScripts
// @version      0.1
// @description  Delete ad from Wordle
// @author       Fractalism
// @match        https://www.nytimes.com/games/wordle/index.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nytimes.com
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';
	let interval_id = setInterval( () => {
		let ad = document.querySelector('.place-ad')
		if (ad) {
			ad.remove();
			clearInterval(interval_id);
		} else {
			console.log('ad not found');
		}
	}, 100);
	setTimeout( () => clearInterval(interval_id), 60000)
})();