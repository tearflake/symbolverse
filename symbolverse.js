// symbolverse.js
// (c) tearflake, 2024
// MIT License

"use strict";

var isNode = new Function ("try {return this===global;}catch(e){return false;}");

if (isNode ()) {
    // begin of Node.js support
    
    var path = require('path');
    var Rewriter = require ("./src/rewriter.js");
    
    var Files = {
        open: function (fileName) {
            const fs = require('fs');
            try { 
                return fs.readFileSync (fileName); 
                
            } catch (error) { 
                return false;
            } 
        },
        
        save: function (fileName, contents) {
            const fs = require('fs');
            try { 
                fs.writeFileSync (fileName, contents); 
                return true;
                
            } catch (error) { 
                return false;
            } 
        },
    };

    function exitSucc () {
        console.log ("Success.");
        process.exit (0);
    }

    function exitFail () {
        console.log ("Failure.");
        process.exit (1);
    }

    async function main(fRules, fInput, fOutput) {
        "use strict";

        console.log ("Symbolverse v" + require('./package.json').version);
        var fr = Files.open (fRules);
        if (fr === false) {
            console.log ('Error reading rules, file: "' + fRules + '"');
            exitFail ();
        }
        else {
            var tm = Date.now ();
            var strRules = fr.toString();
            process.stdout.write("Compiling rules... ");
            var arrRules = await Rewriter.compile (strRules, path.resolve (fRules), undefined, undefined, Files);
            if (arrRules.err) {
                console.log ('Error compiling rules');
                console.log (arrRules.err);
                console.log ('In file: "' + path.resolve (arrRules.file ? arrRules.file : fRules) + '", pos: (' + (arrRules.pos.y + 1) + ', ' + (arrRules.pos.x + 1) + ')');
                exitFail ();
            }
            else {
                console.log (((Date.now () - tm) / 1000).toFixed(3) + "s");
                var fi = Files.open (fInput);
                if (fi === false) {
                    console.log ('Error reading input file: "' + fInput + '"');
                    exitFail ();
                }
                else {
                    var tm = Date.now ();
                    var strInput = fi.toString();
                    process.stdout.write("Rewriting input... ")
                    var arrOutput = Rewriter.rewrite (arrRules, strInput);
                    
                    if (arrOutput.err) {
                        console.log ('Error rewriting input');
                        console.log (arrOutput.err);
                        console.log ('In file: ' + fInput + ",pos: (" + (rules.pos.y + 1) + ", " + (rules.pos.x + 1) + ")");
                        exitFail ();
                    }
                    else {
                        console.log (((Date.now () - tm) / 1000).toFixed(3) + "s");
                        
                        if (fOutput !== undefined) {
                            if (!Files.save (fOutput, Rewriter.stringify (arrOutput))) {
                                console.log ('Error writing output file: "' + fOutput + '"');
                                exitFail ();
                            }
                            else {
                                exitSucc ();
                            }
                        }
                        else {
                            console.log ("Success.");
                            console.log ("");
                            console.log ("Output:");
                            console.log (Rewriter.stringify (arrOutput));
                            process.exit (0);
                        }
                    }
                }
            }
        }
    }
    
    function escapeRegExp(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }

    function replaceAll(str, match, replacement){
       return str.replace(new RegExp(escapeRegExp(match), 'g'), ()=>replacement);
    }

    if(typeof String.prototype.replaceAll === "undefined") {
        String.prototype.replaceAll = function (match, replace) {return replaceAll (this.valueOf (), match, replace);};
    }
    
    if (require.main === module) {
        // called directly
        
        var args = process.argv.slice(2);
        if (args.length < 2 || args.length > 3) {
            console.log ("Symbolverse v" + require('./package.json').version);
            console.log ("");
            console.log ("Usage: symbolverse <rules-file> <input-file>");
            console.log ("       symbolverse <rules-file> <input-file> <output-file>");
            console.log ("");
        }
        else if (args.length === 2) {
            main (args[0], args[1], undefined);
        }
        else if (args.length === 3) {
            main (args[0], args[1], args[2]);
        }
    }
    else {
        // required as a module
        
        module.exports = Rewriter;

    }
    
    // end of Node.js support
}
else {
    (() => {
        var fullfn = document.currentScript.src;
        var path = fullfn.substring(0, fullfn.lastIndexOf('/')) + "/src/";
        
        var script = document.createElement('script')
        script.src = path + "sexpression.js"
        document.body.appendChild(script);
        
        var script = document.createElement('script')
        script.src = path + "parser.js"
        document.body.appendChild(script);
        
        var script = document.createElement('script')
        script.src = path + "rewriter.js"
        document.body.appendChild(script);
        
        var script = document.createElement('script')
        script.src = path + "ruler.js"
        document.body.appendChild(script);
    })()        
}

