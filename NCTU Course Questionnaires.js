// ==UserScript==
// @name         NCTU Course Questionnaires
// @namespace    Fractalism
// @version      0.0
// @description  Autofill course questionnaires
// @author       Fractalism
// @match        http*://course.nctu.edu.tw/TeachPoll/question.asp
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
	// parameters
		let part1ans = 3; // default answer for part 1 of questionnaire, values: 1~5 from left to right
		let part2ans = {20: 1, 21: 2, 22: 3, 23: 1, 24: 2}; // specific answers for part 2 of questionnaire, values: 1~X from left to right
	//

	let parts = document.querySelectorAll('table.stripeMe');
	Array.from(parts).forEach( (part, part_index) => {
		let rows = part.getElementsByTagName('tr');
		Array.from(rows).forEach( (row, row_index) => {
			let buttons = row.querySelectorAll('input[type=radio]');
			let button;
			switch(part_index) {
				case 0:
					button = buttons[part1ans-1];
					break;
				case 1:
					button = buttons[part2ans[(row_index+1)/3-1+20]-1];
					break;
			}
			if(button) {
				button.checked = true;
			}
		})
	})
	window.scrollTo(0, document.body.scrollHeight);
	document.querySelector('input[name=qCode]').focus();
})();