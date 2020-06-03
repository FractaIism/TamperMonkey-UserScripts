// ==UserScript==
// @name         IoTTalk Delete Device
// @namespace    Fractalism
// @version      0.1
// @description  Makes deleting multiple similar devices in IoTTalk faster
// @author       Fractalism
// @match        http*://*.iottalk.tw/list_all
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

	send_delete = function(url) {
        $.ajax({
            url: url,
            type: 'DELETE',
            success: function(result) {
                alert('Device with MAC address ' + url.substr(1) + ' has been deleted successfully.');
            },
			error: function(jqXHR, textStatus, errorThrown) {
				alert('Error encountered\n\ntextStatus: ' + textStatus + '\nerrorThrown: ' + errorThrown);
			}
        });
		event.preventDefault(); // don't scroll to top after deleting
    }

})();