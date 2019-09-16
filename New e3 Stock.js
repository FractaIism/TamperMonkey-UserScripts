// ==UserScript==
// @name         New e3 Stock
// @namespace    Fractalism
// @version      0.0
// @author       Fractalism
// @match        https://e3new.nctu.edu.tw/local/courseextension/userlist.php?*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    let tb=document.getElementsByTagName('tbody')[1];
    var rep=setInterval(()=>{
        if(tb.children[0].innerText){
            mainloop(tb);
        }
    },200);

    function mainloop(tb){
        clearInterval(rep);
        for(let record of tb.children){
            let txt=record.firstElementChild.innerText;
            let name=txt.substr(0,txt.indexOf(' '));
            let href="https://www.facebook.com/search/top/?q="+name;
            let a_tag=record.children[0].children[0].children[0];
            a_tag.href=href;
            a_tag.target="_blank";
            a_tag.style="color: black; text-shadow: 0px 0px 4px violet";
        }
    }
})();