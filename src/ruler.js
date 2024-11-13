// ruler.js
// (c) tearflake, 2024
// MIT License

var Ruler = (
    function (obj) {
        return {
            arrayMatch: obj.arrayMatch,
            getVars: obj.getVars,
            substVars: obj.substVars,
            levelOut: obj.levelOut,
            getLevel: obj.getLevel,
            getMaxLevel: obj.getMaxLevel,
            levelSplit: obj.levelSplit
        };
    }
) (
    (function () {
        "use strict";

        var getVars = function (vars, varIndex) {
            if (varIndex !== undefined) {
                var vi = "_" + varIndex;
            }
            else {
                var vi = "";
            }

            if (vars.length > 0) {
                var v = [];
                for (var i = 0; i < vars.length; i++) {
                    v[vars[i] + vi] = null;
                }
                
                return v;
            }
            else {
                return null;
            }
        }
        
        var arrayMatch = function (arr1, arr2, vars1, vars2, varIndex) {
            var stack = [[arr1, arr2]], item, result;
            var vi, arr1Name, arr2Name, arr1Esc, arr2Esc;
                
            if (varIndex !== undefined) {
                vi = "_" + varIndex;
            }
            else {
                vi = "";
            }
            
            result = undefined;
            while (stack.length > 0) {
                item = stack.pop ()
                if (result !== false) {
                    arr1 = item[0];
                    arr2 = item[1];
                    
                    if (typeof arr1 === 'string') {
                        var spl1 = levelSplit (arr1);
                        arr1Esc = spl1.esc;
                        arr1Name = spl1.atom;
                    }
                    else {
                        arr1Name = undefined;
                        arr1Esc = 0;
                    }

                    if (typeof arr2 === 'string') {
                        var spl2 = levelSplit (arr2);
                        arr2Esc = spl2.esc;
                        arr2Name = spl2.atom;
                    }
                    else {
                        arr2Name = undefined;
                        arr2Esc = 0;
                    }

                    if (Array.isArray (arr1) && Array.isArray (arr2)) {
                        if (arr1.length === arr2.length) {
                            for (var i = 0; i < arr1.length; i++) {
                                stack.push ([arr1[i], arr2[i]]);
                            }
                            
                            result = undefined;
                            continue;
                        }
                    }
                    else if (
                        (vars1 && typeof arr1 === 'string' && vars1[arr1Name] === null && vars1.hasOwnProperty(arr1Name)) &&
                        (vars2 && typeof arr2 === 'string' && vars2[arr2Name + vi] === null && vars2.hasOwnProperty(arr2Name + vi))
                    ) {
                        vars2[arr2Name + vi] = levelOut (arr1, [], arr1Esc - arr2Esc);
                        result = true;
                        continue;
                    }
                    else if (vars1 && typeof arr1 === 'string' && vars1[arr1Name] === null && vars1.hasOwnProperty(arr1Name)) {
                        vars1[arr1Name] = (arr2 === true ? null : arr2);
                        result = true;
                        continue;
                    }
                    else if (vars2 && typeof arr2 === 'string' && vars2[arr2Name + vi] === null && vars2.hasOwnProperty(arr2Name + vi)) {
                        vars2[arr2Name + vi] = levelOut (arr1, [], -arr2Esc);
                        result = true;
                        continue;
                    }
                    else if (vars1 && typeof arr2 === 'string' && vars1[arr2Name] === null && vars1.hasOwnProperty(arr2Name)) {
                        vars1[arr2Name] = arr1;
                        result = true;
                        continue;
                    }
                    else if (
                        (vars2 && typeof arr2 === 'string' && vars2[arr2Name + vi] !== undefined && vars2.hasOwnProperty(arr2Name + vi)) &&
                        (vars1 && typeof arr1 === 'string' && vars1[arr1Name] !== undefined && vars1.hasOwnProperty(arr1Name))
                    ) {
                        stack.push ([vars1[arr1Name], levelOut (vars2[arr2Name + vi], [], arr2Esc)])
                        result = undefined;
                        continue;
                    }
                    else if (vars2 && typeof arr2 === 'string' && vars2[arr2Name + vi] !== undefined && vars2.hasOwnProperty(arr2Name + vi)) {
                        stack.push ([arr1, levelOut (vars2[arr2Name + vi], [], arr2Esc)])
                        result = undefined;
                        continue;
                    }
                    else if (vars1 && typeof arr1 === 'string' && vars1[arr1Name] !== undefined && vars1.hasOwnProperty(arr1Name)) {
                        stack.push ([vars1[arr1Name], arr2])
                        result = undefined;
                        continue;
                    }
                    
                    result = (arr1 === true || arr2 === true || arr1 === arr2);
                    continue;
                }
                else {
                    return false;
                }
            }
            
            return true;
        }
        
        var substVars = function (vars, arr, varIndex) {
            var stack = [{atom: arr}], item, ret, atom, list = [];
            var vi = "_" + varIndex;
            if (!arr) {
                return null;
            }
            else if (!vars) {
                return arr;
            }
            else {
                while (stack.length > 0) {
                    item = stack.pop ()
                    if (item.atom) {
                        arr = item.atom;
                        if (Array.isArray (arr)) {
                            stack.push ({list: list});
                            list = []
                            for (var i = arr.length - 1; i >= 0; i--) {
                                stack.push ({atom: arr[i]});
                            }
                        }
                        else {
                            var spl = levelSplit (arr);
                            if (varIndex !== undefined) {
                                if (vars.hasOwnProperty(spl.atom + vi) && vars[spl.atom + vi]) {
                                    ret = levelOut (vars[spl.atom + vi], [], spl.esc)
                                }
                                else if (vars.hasOwnProperty(spl.atom + vi) && vars[spl.atom + vi] === null) {
                                    ret = levelOut (spl.atom + vi, [], spl.esc)
                                }
                                else {
                                    ret = arr;
                                }
                            } else {
                                if (vars.hasOwnProperty(spl.atom) && vars[spl.atom]) {
                                    ret = levelOut (vars[spl.atom], [], spl.esc)
                                }
                                else {
                                    ret = arr;
                                }
                            }
                            
                            list.push (ret)
                        }
                    }
                    else {
                        item.list.push (list)
                        list = item.list;
                    }
                }
            }

            return list[0];
        }
        
        var levelOut = function (arr, vars, level) {
            var stack = [{atom: arr}], item, result, atom, list = [];
            if (arr === undefined) return arr;
            if (vars === undefined) vars  = [];
            while (stack.length > 0) {
                item = stack.pop ()
                if (item.atom) {
                    arr = item.atom;
                    if (!Array.isArray (arr)) {
                        if (arr !== "ATOMIC" && arr !== "COMPOUND" && arr !== "ANY" && arr !== undefined /*&& vars.indexOf (arr) === -1*/){
                            for (var curLevelL = 0; curLevelL < arr.length && arr.charAt(curLevelL) === "\\"; curLevelL++);
                            for (var curLevelR = 0; arr.length - curLevelR - 1 > 0 && arr.charAt(arr.length - curLevelR - 1) === "\\"; curLevelR++);
                            
                            var lft = curLevelL;
                            var rgt = curLevelR;
                            if (level > 0) {
                                for (var i = 0; i < level; i++) {
                                    if (lft > 0) {
                                        lft--;
                                    }
                                    else {
                                        rgt++;
                                    }
                                }
                            }
                            else {
                                for (var i = 0; i > level; i--) {
                                    if (rgt > 0) {
                                        rgt--;
                                    }
                                    else {
                                        lft++;
                                    }
                                }
                            }

                            var strMid = arr.substring (curLevelL, arr.length - curLevelR);
                            var strLft = lft > 0 ? "\\".repeat (lft): "";
                            var strRgt = rgt > 0 ? "\\".repeat (rgt): "";
                            
                            result = strLft + strMid + strRgt;
                        }
                        else {
                            result = arr;
                        }
                        list.push (result)
                    }
                    else {
                        stack.push ({list: list});
                        list = []
                        for (var i = arr.length - 1; i >= 0; i--) {
                            stack.push ({atom: arr[i]});
                        }
                    }
                }
                else {
                    item.list.push (list)
                    list = item.list;
                }
            }
            
            return list[0];
        }
        
        var getLevel = function (str, vars) {
            if (vars === undefined) vars  = [];
            if (str !== "ATOMIC" && str !== "COMPOUND" && str !== "ANY" && str !== undefined && vars.indexOf (str) === -1){
                for (var curLevelL = 0; curLevelL < str.length && str.charAt(curLevelL) === "\\"; curLevelL++);
                for (var curLevelR = 0; str.length - curLevelR - 1 > 0 && str.charAt(str.length - curLevelR - 1) === "\\"; curLevelR++);
                
                return curLevelL > 0 ? -curLevelL : curLevelR;
            }
            else {
                return -Infinity ;
            }
        }
        
        var getMaxLevel = function (arr, vars) {
            var stack = [arr], item;
            var result = -Infinity;
            while (stack.length > 0) {
                item = stack.pop ()
                if (!Array.isArray (item)) {
                    result = Math.max (result, getLevel (item, vars));
                }
                else {
                    for (var i = 0; i < item.length; i++) {
                        stack.push (item[i]);
                    }
                }
            }
            
            return result;
        }
        
        var levelSplit = function (atom) {
            var vEsc, vAtm;
            
            if (atom === undefined) {
                return {esc: -Infinity, atom: undefined};
            }
            else {
                vEsc = Ruler.getLevel (atom);
                if (vEsc < 0) {
                    vAtm = atom.substring (-vEsc, atom.length);
                }
                else {
                    vAtm = atom.substring (0, atom.length - vEsc);
                }
                
                return {esc: vEsc, atom: vAtm};
            }
        }

        return {
            arrayMatch: arrayMatch,
            getVars: getVars,
            substVars: substVars,
            levelOut: levelOut,
            getLevel: getLevel,
            getMaxLevel: getMaxLevel,
            levelSplit: levelSplit
        }
    }) ()
);

var isNode = new Function ("try {return this===global;}catch(e){return false;}");

if (isNode ()) {
    // begin of Node.js support

    module.exports = Ruler;
    
    function escapeRegExp(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }

    function replaceAll(str, match, replacement){
       return str.replace(new RegExp(escapeRegExp(match), 'g'), ()=>replacement);
    }

    if(typeof String.prototype.replaceAll === "undefined") {
        String.prototype.replaceAll = function (match, replace) {return replaceAll (this.valueOf (), match, replace);};
    }

    // end of Node.js support
}

