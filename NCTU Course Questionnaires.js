// ==UserScript==
// @name         NCTU Course Questionnaires
// @namespace    https://github.com/FractaIism/TamperMonkey-UserScripts
// @version      1.0
// @description  Autofill course questionnaires
// @author       Fractalism
// @match        http*://course.nctu.edu.tw/TeachPoll/question.asp
// @grant        none
// ==/UserScript==

(function () {
	'use strict';
	// parameter set 1 (used when randomize == false)
	let part1_ans = 3; // default answer for part 1 of questionnaire, values: 1~5 from left to right
	let part2_ans = 2; // default answer for part 2 of questionnaire, values: 1~X from left to right (default to 1 if option not available)
	let default_ans = 2; // if there are more than two parts

	// parameter set 2 (used when randomize == true)
	const randomize = true; // generate random answers for each question
	const ans_prob = Object.freeze({
		1: 10,
		2: 30,
		3: 50,
		4: 5,
		5: 1,
	}); //relative probability of each answer appearing if randomize is set (will be normalized so the sum of probabilities is 1). If a choice is not present, it will be ignored and normalization will be carried out with only the remaining choices.



	let parts = document.querySelectorAll('table.stripeMe');
	Array.from(parts).forEach((part, part_index) => {
		let rows = part.getElementsByTagName('tr');
		Array.from(rows).forEach((row, row_index) => {
			let buttons = row.querySelectorAll('input[type=radio]');
			if (buttons.length == 0) return;
			buttons[getAns(part_index, buttons.length) - 1].checked = true;
		})
	});

	// check all checkboxes
	Array.from(document.querySelectorAll('input[type=checkbox]')).forEach((item) => {
		item.checked = true
	});
	// manually solve captcha
	window.scrollTo(0, document.body.scrollHeight);
	document.querySelector('input[name=qCode]').focus();



	// opt_len: number of options
	function getAns(part_index, opt_len) {
		if (randomize) {
			let prob = Object.assign({}, ans_prob); // make a copy
			for (let i = opt_len + 1; i <= 5; ++i) {
				prob[i] = 0; // for nonexistent options, probability = 0
			}
			let cmf = normalize(prob);
			let rnd = Math.random(); // random float in [0,1)
			let choice;
			for (let i = 1; i <= 5; ++i) {
				if (rnd < cmf[i]) {
					choice = i;
					break;
				}
			}
			return choice;
		} else {
			if (part_index == 0) return part1_ans;
			else if (part_index == 1) return part2_ans;
			else return default_ans;
		}
	}

	// get non-normalized pmf and return normalized cmf
	// pmf: probability mass function
	// cmf: cumulative mass function
	function normalize(massfunc) {
		// calculate the sum of numbers in pmf to normalize it
		let pmf = Object.assign({}, massfunc); // javascript uses call by sharing for object arguments, so copy object using Object.assign
		let sum = 0;
		for (let i in pmf) {
			sum += pmf[i];
		}
		// normalize pmf and convert to cmf
		let cmf = {};
		for (let i = 1; i <= 5; ++i) {
			pmf[i] /= sum;
			cmf[i] = i == 1 ? pmf[i] : cmf[i - 1] + pmf[i];
		}
		return cmf;
	}

})();
