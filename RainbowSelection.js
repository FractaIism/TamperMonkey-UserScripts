/**
  The MIT License (MIT)

  Copyright (c) 2019 Anveshak

  Permission is hereby granted, free of charge, to any person obtaining a copy of
  this software and associated documentation files (the "Software"), to deal in
  the Software without restriction, including without limitation the rights to
  use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
  the Software, and to permit persons to whom the Software is furnished to do so,
  subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
  FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
  COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
  IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
  CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
**/

// ==UserScript==
// @name        Rainbow Selection
// @author      Anveshak, Fractalism
// @description Adapted from Shadow Selection by Anveshak. Create dynamic text shadows for highlighted text using built-in algorithms or perhaps write your own!
// @include     *
// @version     0.0.0
// @license MIT
// @copyright   2019, Anveshak
// @icon        http://oi63.tinypic.com/142f1tx.jpg
// ==/UserScript==

(function(){
    'use strict';
    var style=document.createElement("style");

//For Firefox (Gecko) Browser
    style.innerHTML = "  ::-moz-selection { color: #000; background: none repeat scroll 100% 0% transparent;text-shadow: 0px 0px 2px #0048FF;} a::selection { color: #000; background: none repeat scroll 0% 0% transparent;text-shadow: 2px 2px 2px #0048FF;}";
//For Chrome (Blink) Browser
    style.innerHTML += " ::selection { color: #000; background: none repeat scroll 0% 0% transparent;text-shadow: 2px 0px 2px #0048FF;}  input::selection { color: #3356C6; background: none repeat scroll 0% 0% transparent;} a::selection { color: #000; background: none repeat scroll 0% 0% transparent;text-shadow: 2px 0px 2px #0048FF;}";
//For WebKit Browser
    style.innerHTML += " ::-webkit-selection { color: #000; background: none repeat scroll 0% 0% transparent;text-shadow: 0px 0px 2px #0048FF;} a::selection { color: #000; background: none repeat scroll 0% 0% transparent;text-shadow: 2px 2px 2px #0048FF;}";
//For Other Browsers
    style.innerHTML += " ::-ms-selection { color: #000; background: none repeat scroll 0% 0% transparent;text-shadow: 0px 0px 2px #0048FF;} a::selection { color: #000; background: none repeat scroll 0% 0% transparent;text-shadow: 2px 2px 2px #0048FF;}";
    style.innerHTML += " ::-o-selection { color: #000; background: none repeat scroll 0% 0% transparent;text-shadow: 0px 0px 2px #0048FF;} a::selection { color: #000; background: none repeat scroll 0% 0% transparent;text-shadow: 2px 2px 2px #0048FF;}";

    document.body.appendChild(style);

    // Parameters
    // shadow_count: number of text shadows to apply
    // x_offset, y_offset: relative position of each text shadow in pixels, stored as array (right and down are the positive directions)
    // blur: blur radius of each shadow
    // algorithm: algorithm to use for updating text shadows (enclosed within a function for technical reasons)
    // exec_interval: update text shadows every x milliseconds
    const shadow_count = 1
    const x_offset = [0]
    const y_offset = [0]
    const blur     = [5]
    const algorithm = function() {
        default_algorithm() // change algorithm here
    }
    const exec_interval = 100

    // Algorithms
    // Please store algorithm-specific variables as static variables as in the default algorithm

    // Default algorithm:
    // RGB(0,0,0) -> RGB(255,0,0) -> RGB(255,255,0) -> RGB(255,255,255) -> RGB(0,255,255) -> RGB(0,0,255) -> RGB(0,0,0) -> start over
    var default_algorithm = function def_algo() {
        // Initialize static variables upon first execution
        if(typeof def_algo.mode === "undefined") {
            def_algo.mode = 1
            def_algo.delta = 15 // change amount per cycle
        }
        for(var i = 0; i < shadow_count; ++i) {
            let colors = shadow_list[i].color
            switch(def_algo.mode){
            case 1:
              (colors.R < 255) ? (colors.R = Math.min(colors.R + def_algo.delta, 255)) : (++def_algo.mode)
              break;
            case 2:
              (colors.G < 255) ? (colors.G = Math.min(colors.G + def_algo.delta, 255)) : (++def_algo.mode)
              break;
            case 3:
              (colors.B < 255) ? (colors.B = Math.min(colors.B + def_algo.delta, 255)) : (++def_algo.mode)
              break;
            case 4:
              (colors.R > 0) ? (colors.R = Math.max(colors.R - def_algo.delta, 0)) : (++def_algo.mode)
              break;
            case 5:
              (colors.G > 0) ? (colors.G = Math.max(colors.G - def_algo.delta, 0)) : (++def_algo.mode)
              break;
            case 6:
              (colors.B > 0) ? (colors.B = Math.max(colors.B - def_algo.delta, 0)) : (def_algo.mode = 1)
              break;
            }
        }
    }

    // Main program
    var shadow = function(x_offset, y_offset, blur) {
        return {
            x_offset: x_offset,
            y_offset: y_offset,
            blur: blur,
            color: {R:0, G:0, B:0, A:1.0}
        }
    }
    var shadow_list = []
    for(var i = 0; i < shadow_count; ++i) {
      shadow_list.push(shadow(x_offset[i], y_offset[i], blur[i]))
    }
    // Deprecated function, converts number into hex color code
    // var hex_adjust = function(n) {
    //  var hex = n.toString(16)
    //      var pad = "0".repeat(6 - hex.length)
    //     return "#" + pad + hex
    // }
    var update_shadows = function() {
      algorithm()
      var shadow_str = ""
      for(var i = 0; i < shadow_count; ++i){
        if(i > 0) shadow_str += ","
        shadow_str += shadow_list[i].x_offset + "px "
        shadow_str += shadow_list[i].y_offset + "px "
        shadow_str += shadow_list[i].blur + "px "
        shadow_str += `rgba(${shadow_list[i].color.R}, ${shadow_list[i].color.G}, ${shadow_list[i].color.B}, ${shadow_list[i].color.A})`
      }
      style.innerHTML = `
      ::selection { color: #000; background: none repeat scroll 0% 0% transparent;text-shadow: ${shadow_str};}
      input::selection { color: #3356C6; background: none repeat scroll 0% 0% transparent;}
      a::selection { color: #000; background: none repeat scroll 0% 0% transparent;text-shadow: ${shadow_str};}";
        `
    }
    setInterval(update_shadows, exec_interval)
})()