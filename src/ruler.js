// ruler.js
// (c) tearflake, 2025
// MIT License

var Ruler = (
    function (obj) {
        return {
            resetVarIdx: obj.resetVarIdx,
            unify: obj.unify,
            subst: obj.subst,
            usubst: obj.usubst,
            getMaxLvl: obj.getMaxLvl,
            getMinLvl: obj.getMinLvl,
            getLvl: obj.getLvl,
            levelShift: obj.levelShift,
            levelSplit: obj.levelSplit
        };
    }
) (
    (function () {
        "use strict";
        
        var varIdx = 0;
        var resetVarIdx = function () {
            varIdx = 0;
        }
        
        var prepareVars = function (vars) {
            var v = [];
            if (vars) {
                for (var i = 0; i < vars.length; i++) {
                    v[vars[i]] = null;
                }
            }
                
            return v;
        }
        
        var getNextWhole = function (tokens, idx) {
            var parens = 0;
            if (tokens[idx] === "(") {
                do {
                    if (tokens[idx] === "(") {
                        parens++;
                    }
                    else if (tokens[idx] === ")") {
                        parens--;
                    }
                    idx++;
                } while (parens > 0)
                
                return idx;
            }
            else {
                return idx + 1;
            }
        }
        
        var isEqual = function (tokW, fromW, toW, tokR, fromR, toR, vars, uvars) {
            for (var i = fromW, j = fromR; i < tokW.length && j < tokR.length; i++, j++) {
                var idxW = i;
                var idxR = j;
                
                if (tokR[idxR] === "(" && levelSplit (tokR[idxR + 1]).atom === "FREEVAR" && tokR[idxR + 2] !== "(" && tokR[idxR + 2] !== ")" && tokR[idxR + 3] === ")") {
                    var idxToW = getNextWhole (tokW, i);
                    var idxToR = getNextWhole (tokR, j);  
                    if (!uunify (tokR, idxR, idxToR, tokW, idxW, idxToW, vars, uvars)) {
                        return false;
                    }

                    i = idxToW - 1;
                    j = idxToR - 1;
                }
                else if (tokW[idxW] === "(" && levelSplit (tokW[idxW + 1]).atom === "FREEVAR" && tokW[idxW + 2] !== "(" && tokW[idxW + 2] !== ")" && tokW[idxW + 3] === ")") {
                    var idxToW = getNextWhole (tokW, i);
                    var idxToR = getNextWhole (tokR, j);  
                    if (!uunify (tokW, idxW, idxToW, tokR, idxR, idxToR, vars, uvars)) {
                        return false;
                    }

                    i = idxToW - 1;
                    j = idxToR - 1;
                }
                else if (tokW[i] !== tokR[j]) {
                    break;
                }
            }
            
            return (i === toW && j === toR);
        }
        
        var uunify = function (tokW, idxW, idxWEnd, tokR, idxR, idxREnd, vars, uvars) {
            var lsW = levelSplit (tokW[idxW + 2])
            var tokWEsc = lsW.esc;
            var tokWName = lsW.atom;
            
            var idxRStart = idxR;
            idxR = getNextWhole (tokR, idxR);
            idxW = idxW + 4;
            
            if (uvars[tokWName] === undefined && !uvars.hasOwnProperty(tokWName)) {
                if (tokWName.charAt (0) === tokWName.charAt(0).toLowerCase () && tokR[idxRStart] === '(') {
                    return false;
                }
                
                var range = tokR.slice (idxRStart, idxR);
                var max = getMaxLvl (range, 0, range.length, []);
                var min = getMinLvl (range, 0, range.length, []);
                if (max !== -Infinity && (max !== tokWEsc || min !== tokWEsc)) {
                    return false;
                }

                uvars[tokWName] = levelShift (range, -tokWEsc);
                
                for (var i in vars) {
                    if (vars[i] !== null && vars[i] !== undefined) {
                        vars[i] = usubst (vars[i], uvars);
                    }
                }
            }
            else if (uvars[tokWName] !== undefined && uvars.hasOwnProperty(tokWName)) {
                var shifted = levelShift (uvars[tokWName], tokWEsc)
                if (!isEqual (shifted, 0, shifted.length, tokR, idxRStart, idxR, vars, uvars)) {
                    return false;
                }
            }
            
            return true;
        }
        
        var unify = function (tokW, fromW, toW, tokR, fromR, toR, level, vars) {
            var idxW = fromW, idxR = fromR, idxWStart, idxRStart, uvars;
            
            vars = prepareVars (vars);
            uvars = [];
            while (idxW < toW && idxR < toR) {
                if (typeof tokR[idxR] === 'string' && tokR[idxR] !== "(" && tokR[idxR] !== ")") {
                    var lsR = levelSplit (tokR[idxR]);
                    var tokREsc = lsR.esc;
                    var tokRName = lsR.atom;
                }
                else {
                    var tokRName = "";
                }
                
                if (vars[tokRName] === null && vars.hasOwnProperty(tokRName)) {
                    idxWStart = idxW;
                    idxW = getNextWhole (tokW, idxW);
                    if (tokRName.charAt (0) === tokRName.charAt(0).toLowerCase () && tokW[idxWStart] === '(') {
                        return false;
                    }
                    
                    var range = tokW.slice (idxWStart, idxW);
                    var max = getMaxLvl (range, 0, range.length, []);
                    var min = getMinLvl (range, 0, range.length, []);
                    if (max !== -Infinity && (max !== tokREsc || min !== tokREsc)) {
                        return false;
                    }
                    
                    vars[tokRName] = usubst (levelShift (range, -tokREsc), uvars);
                    idxR++;
                }
                else if (vars[tokRName] !== undefined && vars.hasOwnProperty(tokRName)) {
                    idxWStart = idxW;
                    idxW = getNextWhole (tokW, idxW);
                    var shifted = levelShift (vars[tokRName], tokREsc)
                    if (!isEqual (tokW, idxWStart, idxW, shifted, 0, shifted.length, vars, uvars)) {
                        return false;
                    }

                    idxR++;
                }
                else if (idxW > 0 && tokW[idxW] === "(" && levelSplit (tokW[idxW + 1]).atom === "FREEVAR" && tokW[idxW + 2] !== "(" && tokW[idxW + 2] !== ")" && tokW[idxW + 3] === ")") {
                    if (!uunify (tokW, idxW, null, tokR, idxR, null, vars, uvars)) {
                        return false;
                    }
                    
                    idxR = getNextWhole (tokR, idxR);
                    idxW = idxW + 4;
                }
                else if (tokW[idxW] !== tokR[idxR]) {
                    return false;
                }
                else {
                    idxW++
                    idxR++;
                }
            }

            if (idxW === toW && idxR === toR) {
                return {vars: vars, uvars: uvars};
            }
            else {
                return false;
            }
        }
        
        var subst = function (tok, vars) {
            var idx = 0, result = [], uvar = false;
            
            while (idx < tok.length) {
                var spl = levelSplit (tok[idx]);
                if (vars.hasOwnProperty(spl.atom) && vars[spl.atom]) {
                    result = [...result, ...levelShift (vars[spl.atom], spl.esc)];
                }
                else if (vars.hasOwnProperty(spl.atom) && vars[spl.atom] === null) {
                    var spl = levelSplit (tok[idx]);
                    var indexed = spl.atom + "[" + varIdx + "]" //+ "-" + varIdx
                    if (spl.esc > 0) {
                        indexed = indexed + "\\".repeat (spl.esc);
                        var ub = "FREEVAR" + "\\".repeat (spl.esc);
                    }
                    else {
                        indexed = "\\".repeat (-spl.esc) + indexed;
                        var ub = "\\".repeat (-spl.esc) + "FREEVAR";
                    }

                    result = [...result, "(", ub, indexed, ")"];
                    uvar = true;
                }
                else {
                    result = [...result, tok[idx]];
                }
                idx++
            }
            
            if (uvar) {
                varIdx++;
            }
            
            return result;
        }
        
        var usubst = function (tok, vars, item) {
            var idx = 0, idx1 = 0, result = [];
            
            while (idx < tok.length) {
                if (idx < tok.length - 2) {
                    var spl = levelSplit (tok[idx + 2]);
                    
                    if (vars.hasOwnProperty(spl.atom) && vars[spl.atom] && tok[idx] === "(" && levelSplit (tok[idx + 1]).atom === "FREEVAR" && levelSplit (tok[idx + 2]).atom === spl.atom && tok[idx + 3] === ")") {
                        result = [...result, ...levelShift (vars[spl.atom], spl.esc)];
                        idx += 4;
                        idx1++;
                        if (item) {
                            if (Number.isInteger (item.idxW) && item.idxW >= idx1) {
                                item.idxW += -4 + vars[spl.atom].length;
                            }
                            if (Number.isInteger (item.fromW) && item.fromW >= idx1) {
                                item.fromW += -4 + vars[spl.atom].length;
                            }
                            if (Number.isInteger (item.toW) && item.toW >= idx1) {
                                item.toW += -4 + vars[spl.atom].length;
                            }
                        }
                    }
                    else {
                        result = [...result, tok[idx]];
                        idx++;
                        idx1++;
                    }
                }
                else {
                    result = [...result, tok[idx]];
                    idx++;
                    idx1++
                }
            }
            
            return result;
        }
        
        var levelShift = function (tok, level) {
            var idx = 0,result = [];
            
            while (idx < tok.length) {
                var str = tok[idx];
                if (str !== "(" && str !== ")" /*&&
                    (str !== "ATOMIC" && str !== "COMPOUND" && str !== "ANY")*/
                ) {
                    for (var curLevelL = 0; curLevelL < str.length && str.charAt(curLevelL) === "\\"; curLevelL++);
                    if ("\\".repeat (str.length) !== str) {
                        for (var curLevelR = 0; str.length - curLevelR - 1 > 0 && str.charAt(str.length - curLevelR - 1) === "\\"; curLevelR++);
                    }
                    else {
                        var curLevelR = 0;
                    }
                    
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

                    var strMid = str.substring (curLevelL, str.length - curLevelR);
                    var strLft = lft > 0 ? "\\".repeat (lft): "";
                    var strRgt = rgt > 0 ? "\\".repeat (rgt): "";
                    
                    str = strLft + strMid + strRgt;
                }
                
                result.push (str);
                idx++;
            }
            
            return result;
        }

        var getMaxLvl = function (tok, from, to, vars) {
            var result = -Infinity;
            if (Array.isArray (tok)) {
                for (var i = from; i < tok.length; i++) {
                    if (tok[i] !== "(" && tok[i] !== ")") {
                        result = Math.max (result, getLvl (tok[i], vars));
                    }
                }
                
                return result;
            }
        }
        
        var getMinLvl = function (tok, from, to, vars) {
            var result = Infinity;
            if (Array.isArray (tok)) {
                for (var i = from; i < tok.length; i++) {
                    if (tok[i] !== "(" && tok[i] !== ")") {
                        result = Math.min (result, getLvl (tok[i], vars));
                    }
                }
                
                return result;
            }
        }
        
        var getLvl = function (str, vars) {
            if (vars === undefined) vars  = [];
            if (/*str !== "ATOMIC" && str !== "COMPOUND" && str !== "ANY" &&*/ str !== undefined /*&& vars.indexOf (str) === -1*/){
                for (var curLevelL = 0; curLevelL < str.length && str.charAt(curLevelL) === "\\"; curLevelL++);
                for (var curLevelR = 0; str.length - curLevelR - 1 > 0 && str.charAt(str.length - curLevelR - 1) === "\\"; curLevelR++);
                
                return curLevelL > 0 ? -curLevelL : curLevelR;
            }
            else {
                return -Infinity ;
            }
        }
        
        var levelSplit = function (atom) {
            var vEsc, vAtm;
            
            if (atom === undefined) {
                return {esc: -Infinity, atom: undefined};
            }
            else {
                vEsc = Ruler.getLvl (atom);
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
            resetVarIdx: resetVarIdx,
            unify: unify,
            subst: subst,
            usubst: usubst,
            getMaxLvl: getMaxLvl,
            getMinLvl: getMinLvl,
            getLvl: getLvl,
            levelShift: levelShift,
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

