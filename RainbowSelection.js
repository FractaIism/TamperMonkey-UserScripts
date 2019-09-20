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
// @description Adapted from Shadow Selection by Anveshak. Create custom dynamic text shadows for highlighted text.
// @namespace   Fractalism
// @include     *
// @version     0.0.2
// @license MIT
// @copyright   2019, Anveshak
// @icon        http://oi63.tinypic.com/142f1tx.jpg
// @updateURL   https://raw.githubusercontent.com/FractaIism/TamperMonkey-UserScripts/master/RainbowSelection.js
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

    document.head.appendChild(style);

    // Parameters
    // browser: Firefox=1, Chrome=2, WebKit=3, Other=4, or use -1 to try them all
    // shadow_count: number of text shadows to apply
    // x_offset, y_offset: relative position of each text shadow in pixels, stored as array (right and down are the positive directions)
    // blur: blur radius of each shadow
    // color: initial color of each shadow in RGBA, where 0<=R,G,B<=255 and 0<=A<=1
    // algorithm: algorithm to use for updating text shadows (enclosed within a function for technical reasons)
    // exec_interval: update text shadows every x milliseconds
    const browser = 2
    const shadow_count = 1
    const x_offset = [0]
    const y_offset = [0]
    const blur     = [5]
    const color    = [{R:0,G:255,B:255,A:1}]
    const algorithm = function() {
        continuous_cycle(["F640EA","21F9F2","1DF616","EFF616","F62C16"], 10) // change algorithm here (including arguments)
    }
    const exec_interval = 200

    // Algorithms

    // Fluorescence:
    // RGB(0,0,0) -> RGB(255,0,0) -> RGB(255,255,0) -> RGB(255,255,255) -> RGB(0,255,255) -> RGB(0,0,255) -> RGB(0,0,0) -> start over
    // Note: Made for single shadow
    var fluorescence = function def_algo(delta = 20) {
        // Initialize static variables upon first execution
        if(typeof def_algo.mode === "undefined") {
            def_algo.mode = 1
            def_algo.delta = delta // step size
        }

        for(let i = 0; i < shadow_count; ++i) {
            let colors = shadow_list[i].color
            switch(def_algo.mode) {
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

    // Discrete Cyclic:
    // Cycle between red, green, and blue
    // Note: Made for single shadow
    var discrete_cyclic = function() {
        for(let i = 0; i < shadow_count; ++i) {
            let colors = shadow_list[i].color
            if(colors.R) {
                colors.R = 0
                colors.G = 255
            }else if(colors.G){
                colors.G = 0
                colors.B = 255
            }else{
                colors.B = 0
                colors.R = 255
            }
        }
    }

    // Randomize:
    // Assign random color coordinates
    // Note: Made for single shadow
    var randomize = function(use_alpha = false) {
        for(let i = 0; i < shadow_count; ++i) {
            let colors = shadow_list[i].color
            colors.R = Math.floor(Math.random() * 256)
            colors.G = Math.floor(Math.random() * 256)
            colors.B = Math.floor(Math.random() * 256)
            if(use_alpha){
                colors.A = Math.random()
            }
        }
    }

    // Orbit:
    // Shadows orbit around the letters counterclockwise
    // counterclockwise dir: 0=left 1=down 2=right 3=up
    // clockwise dir: 4=right 5=down 6=left 7=up
    // Note: Initial x,y offsets must be nonzero
    // Note: Currently the only one made for multiple shadows
    var orbit = function orb(counterclockwise = true) {
        if(typeof orb.star === "undefined") {
            orb.star = []
            for(let i = 0; i < shadow_count; ++i){
                let star = shadow_list[i]
                orb.star[i] = ({
                    x_max: (star.x_offset > 0) ? (star.x_offset) : (-star.x_offset),
                    y_max: (star.y_offset > 0) ? (star.y_offset) : (-star.y_offset),
                    dir: (counterclockwise)
                    ? ((star.x_offset > 0) ? ((star.y_offset > 0) ? (0) : (3)) : ((star.y_offset > 0) ? (1) : (2)))
                    : ((star.x_offset > 0) ? ((star.y_offset > 0) ? (4) : (5)) : ((star.y_offset > 0) ? (7) : (6)))
                })
            }
        }

        for(let i = 0; i < shadow_count; ++i) {
            var shadow = shadow_list[i]
            var star = orb.star[i]
            if(i==0) console.log(star.dir)
            switch(star.dir) {
                case 0: case 6: // left
                    (shadow.x_offset > -star.x_max) ? (--shadow.x_offset) : (++star.dir, --i)
                    break
                case 1: case 5: // down
                    (shadow.y_offset < star.y_max) ? (++shadow.y_offset) : (++star.dir, --i)
                    break
                case 2: case 4: // right
                    (shadow.x_offset < star.x_max) ? (++shadow.x_offset) : (++star.dir, --i)
                    break
                case 3: case 7: // up, direction loopback
                    (shadow.y_offset > -star.y_max) ? (--shadow.y_offset) : (star.dir -= 3, --i)
                    break
            }
        }
    }

    // Continuous cycle:
    // Cycle between any set of hex-specified colors smoothly (or set stages=1 for a discrete effect)
    // Note: Specify at least two colors
    // Note: Made for single shadow
    var continuous_cycle = function cont_cycle(color_list = ["ff0000", "00ff00", "0000ff"], stages = 10) {
        function toRGB(color_code) {
            var color={R:0, G:0, B:0}
            color.R = parseInt("0x" + color_code.substr(0,2))
            color.G = parseInt("0x" + color_code.substr(2,2))
            color.B = parseInt("0x" + color_code.substr(4,2))
            return color
        }

        if(typeof cont_cycle.src_color === "undefined") {
            cont_cycle.dst_index = 1
            cont_cycle.src_color = toRGB(color_list[0])
            cont_cycle.dst_color = toRGB(color_list[1])
            cont_cycle.step = [ (cont_cycle.dst_color.R - cont_cycle.src_color.R) / stages,
                                (cont_cycle.dst_color.G - cont_cycle.src_color.G) / stages,
                                (cont_cycle.dst_color.B - cont_cycle.src_color.B) / stages ]
            cont_cycle.stage = 0
        }
        
        shadow_list[0].color.R = cont_cycle.src_color.R + Math.round(cont_cycle.stage * cont_cycle.step[0])
        shadow_list[0].color.G = cont_cycle.src_color.G + Math.round(cont_cycle.stage * cont_cycle.step[1])
        shadow_list[0].color.B = cont_cycle.src_color.B + Math.round(cont_cycle.stage * cont_cycle.step[2])
        ++cont_cycle.stage

        if(cont_cycle.stage == stages) {
            cont_cycle.src_color = cont_cycle.dst_color
            cont_cycle.dst_index = (cont_cycle.dst_index == color_list.length - 1) ? (0) : (cont_cycle.dst_index + 1)
            cont_cycle.dst_color = toRGB(color_list[cont_cycle.dst_index])
            cont_cycle.step=[   (cont_cycle.dst_color.R - cont_cycle.src_color.R) / stages,
                                (cont_cycle.dst_color.G - cont_cycle.src_color.G) / stages,
                                (cont_cycle.dst_color.B - cont_cycle.src_color.B) / stages ]
            cont_cycle.stage=0
        }
    }

    // Main program
    var shadow = function(x_offset, y_offset, blur, color) {
        return {
            x_offset: x_offset,
            y_offset: y_offset,
            blur: blur,
            color: color
        }
    }
    var shadow_list = []
    for(let i = 0; i < shadow_count; ++i) {
        shadow_list.push(shadow(x_offset[i], y_offset[i], blur[i], color[i]))
    }
    var update_shadows = function() {
        algorithm()
        var shadow_str = ""
        for(let i = 0; i < shadow_count; ++i){
            if(i > 0) shadow_str += ","
            shadow_str += shadow_list[i].x_offset + "px "
            shadow_str += shadow_list[i].y_offset + "px "
            shadow_str += shadow_list[i].blur + "px "
            shadow_str += `rgba(${shadow_list[i].color.R}, ${shadow_list[i].color.G}, ${shadow_list[i].color.B}, ${shadow_list[i].color.A})`
        }
        var style_str = ""
        if(browser == 1 || browser == -1) { // Firefox
            style_str += `::-moz-selection { color: #000; background: none repeat scroll 100% 0% transparent; text-shadow: ${shadow_str};}
                          a::selection { color: #000; background: none repeat scroll 0% 0% transparent; text-shadow: ${shadow_str};}`
        }
        if(browser == 2 || browser == -1) { // Chrome
            style_str += `::selection { color: #000; background: none repeat scroll 0% 0% transparent; text-shadow: ${shadow_str};}
                          input::selection { color: #3356C6; background: none repeat scroll 0% 0% transparent;}
                          a::selection { color: #000; background: none repeat scroll 0% 0% transparent; text-shadow: ${shadow_str};}"`
        }
        if(browser == 3 || browser == -1) { // WebKit
            style_str += `::-webkit-selection { color: #000; background: none repeat scroll 0% 0% transparent; text-shadow: ${shadow_str};}
                          a::selection { color: #000; background: none repeat scroll 0% 0% transparent; text-shadow: ${shadow_str};}`
        }
        if(browser == 4 || browser == -1) { // Other
            style_str += `::-ms-selection { color: #000; background: none repeat scroll 0% 0% transparent; text-shadow: ${shadow_str};}
                          a::selection { color: #000; background: none repeat scroll 0% 0% transparent; text-shadow: ${shadow_str};}
                          ::-o-selection { color: #000; background: none repeat scroll 0% 0% transparent; text-shadow: ${shadow_str};}
                          a::selection { color: #000; background: none repeat scroll 0% 0% transparent; text-shadow: ${shadow_str};}`
        }
        style.innerHTML = style_str
    }

    // Let the party begin
    setInterval(update_shadows, exec_interval)

})()
