// ruler.js
// (c) tearflake, 2024
// MIT License

var Ruler = (
    function (obj) {
        return {
            resetVarIdx: obj.resetVarIdx,
            unify: obj.unify,
            subst: obj.subst,
            getMaxLvl: obj.getMaxLvl,
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

        var isEqual = function (tokW, fromW, toW, tokR, fromR, toR, uvars) {
            for (var i = fromW, j = fromR; i < tokW.length; i++, j++) {
                if (backVar (tokW, i, tokR, j, uvars)) {
                    j = getNextWhole (tokR, j);
                    i = i + 4;
                }
                else if (tokW[i] !== tokR[j]) {
                    break;
                }
            }
            
            return (i === toW);
        }
        
        var backVar = function (tokW, idxW, tokR, idxR, uvars) {
            if (idxW > 0 && tokW[idxW] === "(" && tokW[idxW + 1] === "UVAR" && tokW[idxW + 2] !== "(" && tokW[idxW + 2] !== ")" && tokW[idxW + 3] === ")") {
                var lsW = levelSplit (tokW[idxW + 2])
                var tokWEsc = lsW.esc;
                var tokWName = lsW.atom;
                
                var idxRStart = idxR;
                idxR = getNextWhole (tokR, idxR);
                idxW = idxW + 4;
                
                if (!uvars.hasOwnProperty(tokWName)) {
                    uvars[tokWName] = levelShift (tokR.slice (idxRStart, idxR), -tokWEsc);
                }
                else {
                    var shifted = levelShift (uvars[tokWName], tokWEsc)
                    if (!isEqual (tokR, idxRStart, idxR, shifted, 0, shifted.length, uvars)) {
                        return false;
                    }
                }
                
                return true;
            }
            
            return false;
        }

        var unify = function (tokW, fromW, toW, tokR, fromR, toR, vars) {
            var idxW = fromW, idxR = fromR, idxWStart, idxRStart, uvars = [];
            
            vars = prepareVars (vars);
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
                    vars[tokRName] = levelShift (tokW.slice (idxWStart, idxW), -tokREsc);
                    idxR++;
                }
                else if (vars[tokRName] !== undefined && vars.hasOwnProperty(tokRName)) {
                    idxWStart = idxW;
                    idxW = getNextWhole (tokW, idxW);
                    var shifted = levelShift (vars[tokRName], tokREsc)
                    if (!isEqual (tokW, idxWStart, idxW, shifted, 0, shifted.length, uvars)) {
                        return false;
                    }

                    idxR++;
                }
                else if (idxW > 0 && tokW[idxW] === "(" && tokW[idxW + 1] === "UVAR" && tokW[idxW + 2] !== "(" && tokW[idxW + 2] !== ")" && tokW[idxW + 3] === ")") {
                    if (!backVar (tokW, idxW, tokR, idxR, uvars)) {
                        return false;
                    }
                    else {
                        idxR = getNextWhole (tokR, idxR);
                        idxW = idxW + 4;
                    }
                }
                else if (tokW[idxW] !== tokR[idxR]) {
                    return false;
                }
                else {
                    idxW++
                    idxR++;
                }
            }
            
            for (var i in vars) {
                if (vars[i] !== null && vars[i] !== undefined) {
                    subst (vars[i], uvars);
                }
            }
            
            if (idxW === toW && idxR === toR) {
                return vars;
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
                    var indexed = spl.atom + "-" + varIdx
                    if (spl.esc > 0) {
                        indexed = indexed + "\\".repeat (spl.esc);
                    }
                    else {
                        indexed = "\\".repeat (-spl.esc) + indexed;
                    }

                    result = [...result, "(", "UVAR", indexed, ")"];
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
        
        var levelShift = function (tok, level) {
            var idx = 0,result = [];
            
            while (idx < tok.length) {
                var str = tok[idx];
                if (str !== "(" && str !== ")" &&
                    (str !== "ATOMIC" && str !== "COMPOUND" && str !== "ANY")
                ) {
                    for (var curLevelL = 0; curLevelL < str.length && str.charAt(curLevelL) === "\\"; curLevelL++);
                    for (var curLevelR = 0; str.length - curLevelR - 1 > 0 && str.charAt(str.length - curLevelR - 1) === "\\"; curLevelR++);
                    
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
        
        var getLvl = function (str, vars) {
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
            getMaxLvl: getMaxLvl,
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

