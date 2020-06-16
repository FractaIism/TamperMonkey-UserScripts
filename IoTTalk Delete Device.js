// ==UserScript==
// @name         IoTTalk Delete Device
// @namespace    Fractalism
// @version      1.0
// @description  Delete multiple devices in IoTTalk using regular expressions
// @author       Fractalism
// @match        http*://*.iottalk.tw/list_all
// @grant        none
// ==/UserScript==

(function () {
	'use strict';

	// make find-and-delete UI
	var mydiv = document.createElement('div');
	mydiv.innerHTML = `
		<form action='javascript:void(0)'>
			<span>Find and delete</span><br>
			<input type='text' id='find-d_name'><br>
			<button id='search-delete'>Search-Delete</button>
			<button id='hint-message' disabled><b>?</b></button>
		</form>
	`;
	mydiv.style.position = 'fixed';
	mydiv.style.top = '20px'; // pixels
	mydiv.style.right = '20px'; // pixels
	mydiv.style.backgroundColor = 'white';
	mydiv.style.border = '1px black solid';
	mydiv.style.padding = '5px 15px 5px 15px';
	mydiv.style.borderRadius = '10px';

	document.body.appendChild(mydiv);

	var SearchButton = document.createElement('button');
	var DeleteButton = document.createElement('button');
	SearchButton.id = 'search-btn';
	DeleteButton.id = 'delete-btn';
	SearchButton.innerText = 'Search';
	DeleteButton.innerText = 'Delete';
	SearchButton.onclick = find_devices;
	DeleteButton.onclick = delete_devices;
	SearchButton.setAttribute('default', true);
	DeleteButton.setAttribute('default', true);

	document.getElementById('search-delete').replaceWith(SearchButton);

	var HintButton = document.getElementById('hint-message');
	HintButton.style.position = 'absolute';
	HintButton.style.bottom = '10px';
	HintButton.style.right = '25px';
	HintButton.style.width = '1.5em';
	HintButton.style.height = '1.5em';
	HintButton.style.border = '1.5px black solid';
	HintButton.style.borderRadius = '50%';
	HintButton.style.color = 'black';
	HintButton.style.backgroundColor = 'white';
	HintButton.style.padding = '0px';
	HintButton.title = 'Hint: Type part of the d_name or use a regex, check the console for results.';

	var CancelButton = document.createElement('button');
	CancelButton.innerText = 'Cancel';
	CancelButton.onclick = function () {
		window.device_matches = [];
		DeleteButton.replaceWith(SearchButton);
		CancelButton.replaceWith(HintButton);
	}

	var mystyle = document.createElement('style');
	mystyle.innerHTML = `
		div * {text-align: center; margin: 5px 0px 5px 0px;}
		button {font-family: Arial, Helvetica, sans-serif;}
	`; // apply to everything inside div

	document.head.appendChild(mystyle);


	// modify send_delete function for one-by-one deletions without refreshing page
	window.send_delete = send_delete_single;

	function send_delete_single(url) {
		$.ajax({
			url: url,
			type: 'DELETE',
			success: (result) => alert(`Device with MAC address ${url.substr(1)} deleted successfully.`),
			error: (jqXHR, textStatus, errorThrown) => alert(`Error deleting ${url.substr(1)}\ntextStatus: ${textStatus}\nerrorThrown: ${errorThrown}`)
		});
		event.preventDefault(); // don't scroll to top after deleting
	}

	// for batch deletions (send output to console instead)
	function send_delete_batch(url) {
		$.ajax({
			url: url,
			type: 'DELETE',
			success: (result) => console.log(`Device with MAC address ${url.substr(1)} deleted successfully.`),
			error: (jqXHR, textStatus, errorThrown) => console.log(`Error deleting ${url.substr(1)}\ntextStatus: ${textStatus}\nerrorThrown: ${errorThrown}`)
		});
		event.preventDefault();
	}


	// functionality
	function find_devices() {
		var d_name = document.getElementById('find-d_name').value;
		console.log('Search d_name: ' + d_name);
		var walker = document.createTreeWalker(document.body.firstElementChild, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
		var index, node, Nodes = [],
			matches = [];
		while (node = walker.nextNode()) {
			Nodes.push(node);
		}
		for ([index, node] of Nodes.entries()) {
			if (node.nodeType == node.TEXT_NODE && node.nodeValue.search(RegExp(`d_name: .*${d_name}`, 'i')) != -1) {
				matches.push([node, Nodes[index - 5]]); // text node and link to delete device
			}
		}
		console.log(`Found ${matches.length} devices`);
		for (let i = 0; i < matches.length; ++i) {
			console.log(`Match ${i+1}:`);
			console.log(matches[i][0]);
			console.log(matches[i][1]);
		}
		window.device_matches = matches;
		SearchButton.replaceWith(DeleteButton);
		HintButton.replaceWith(CancelButton);
		document.getElementById('find-d_name').focus();
	}

	function delete_devices() {
		var matches = window.device_matches;
		if (!confirm(`Delete all ${matches.length} matched devices?`)) return;
		window.send_delete = send_delete_batch;
		var index, match;
		for ([index, match] of matches.entries()) {
			console.log(`Deleting match ${index+1}`);
			match[1].click();
		}
		window.send_delete = send_delete_single;
		DeleteButton.replaceWith(SearchButton);
		CancelButton.replaceWith(HintButton);
	}

})();
