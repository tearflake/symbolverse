// symbolprose.js
// (c) tearflake, 2025
// MIT License

"use strict";

(() => {
    var fullfn = document.currentScript.src;
    var path = fullfn.substring(0, fullfn.lastIndexOf('/')) + "/src/";
    
    var script = document.createElement('script')
    script.src = path + "s-expr.js"
    document.body.appendChild(script);
    
    var script = document.createElement('script')
    script.src = path + "parser.js"
    document.body.appendChild(script);
})()        

