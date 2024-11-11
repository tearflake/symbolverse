// sexpression.js
// (c) tearflake, 2024
// MIT License

"use strict"

var Sexpression = (
    function (obj) {
        return {
            parse: obj.parse,
            getNode: obj.getNode,
            normalizeSexpr: obj.normalizeSexpr,
            denormalizeSexpr: obj.denormalizeSexpr,
            denormalizeIndexes: obj.denormalizeIndexes,
            stringify: obj.stringify
        };
    }
) (
    (function () {
        var err = [];
        //err[0] = "'\\t' character not allowed error";
        //err[1] = "'\\u000B' character not allowed error";
        err[2] = "Expected end of S-expression error";
        err[3] = "Unexpected end of S-expression error";
        err[4] = "Unicode string syntax error";
        err[5] = "Unexpected end of line error";
        err[6] = "Block not terminated error";
        err[7] = "Unresolved block error";
        err[8] = "Expected whitespace error";
        err[9] = "Expected newline error";
        err[10] = "Expected atom error";
        
        var parse = function (text) {
            var m = createMatrix (text);
            var p = parseMatrix (m);
            return p;
        }
        
        var createMatrix = function (text) {
            var m, i;
            
            text = text.replaceAll ("\r\n", "\n").replaceAll ("\t", "    ").replaceAll ("\u000B", "");
            m = text.split ("\n");
            for (i = 0; i < m.length; i++) {
                m[i] = m[i].split ("");
            }
            
            return m;
        }
        
        var parseMatrix = function (m, verbose) {
            var x, y, pos, i, esc, tmpPos, stack, currChar, currAtom, val;
            
            y = 0;
            x = 1;
            pos = [0, 0];
            esc = 0;
            stack = [];
            while (pos[y] < m.length) {
                currChar = m[pos[y]][pos[x]];
                if (currChar === '/' || currChar === ' ' || currChar === undefined) {
                    if (esc > 0) {
                        return {err: err[10], pos: {y: tmpPos[y], x: tmpPos[x]}};
                    }
                    
                    tmpPos = skipWhitespace (m, pos[y], pos[x]);
                    if (tmpPos.err) {
                        return tmpPos;
                    }
                    
                    if (m[tmpPos[y]] === undefined) {
                        tmpPos[y] = m.length - 1;
                        tmpPos[x] = 0;
                        while (m[tmpPos[y]] && m[tmpPos[y]][tmpPos[x]] !== undefined) {
                            tmpPos[x]++;
                        }
                        
                        return {err: err[3], pos: {y: tmpPos[y], x: tmpPos[x]}};
                    }
                    
                    pos = tmpPos;
                }
                else if (currChar === '\\') {
                    for (i = pos[x]; m[pos[y]][i] === "\\"; i++) {
                        esc++;
                    }
                    pos[x] = i;
                }
                else if (currChar === '(') {
                    if (esc > 0) {
                        return {err: err[10], pos: {y: tmpPos[y], x: tmpPos[x]}};
                    }

                    if (verbose) {
                        stack.push ({val: [], pos: {y: pos[y], x: pos[x]}});
                    }
                    else {
                        stack.push ([]);
                    }
                    
                    pos[x]++;
                }
                else if (currChar === ')') {
                    if (esc > 0) {
                        return {err: err[10], pos: {y: tmpPos[y], x: tmpPos[x]}};
                    }

                    pos[x]++;
                    if (stack.length > 1) {
                        if (verbose) {
                            stack[stack.length - 2].val.push (stack[stack.length - 1]);
                        }
                        else {
                            stack[stack.length - 2].push (stack[stack.length - 1]);
                        }
                        stack.pop ();
                    }
                    else {
                        val = stack[stack.length - 1];
                        break;
                    }
                }
                else if ('"'.indexOf (currChar) > -1) {
                    currAtom = getBlock (m, pos, currChar);
                    if (currAtom.err) {
                        return currAtom;
                    }
                    else {
                        var start = [pos[y], pos[x] - esc];
                        pos[y] = currAtom.pos[y];
                        pos[x] = currAtom.pos[x];
                        if (stack.length > 0) {
                            if (verbose) {
                                stack[stack.length - 1].push ({val: "\\".repeat(esc) + currAtom.val, pos: {y: pos[y], x: pos[x]}});
                            }
                            else {
                                stack[stack.length - 1].push ("\\".repeat(esc) + currAtom.val);
                            }
                            esc = 0;
                            if (m[pos[y]][pos[x]] === undefined) {
                                pos[y]++;
                                pos[x] = 0;
                            }
                        }
                        else {
                            val = "\\".repeat(esc) + currAtom.val;
                            esc = 0;
                            break;
                        }
                    }
                }
                else if (' ()"/'.indexOf (currChar) === -1 && currChar !== undefined) {
                    currAtom = "";
                    var start = {y: pos[y], x: pos[x] - esc};
                    while (' ()"/\\'.indexOf (currChar) === -1 && currChar !== undefined) {
                        currAtom += currChar;
                        pos[x]++;
                        currChar = m[pos[y]][pos[x]];
                    }

                    if (stack.length > 0) {
                        if (verbose) {
                            stack[stack.length - 1].val.push ({val: "\\".repeat(esc) + currAtom, pos: start});
                        }
                        else {
                            stack[stack.length - 1].push ("\\".repeat(esc) + currAtom);
                        }
                        esc = 0;
                    }
                    else {
                        val = "\\".repeat(esc) + currAtom;
                        esc = 0;
                        break;
                    }
                }
            }
            
            pos = skipWhitespace (m, pos[y], pos[x]);
            if (pos.err) {
                return pos;
            }
            
            if (pos[y] < m.length && m[pos[y]][pos[x]] !== undefined) {
                return {err: err[2], pos: {y: pos[y], x: pos[x]}};
            }
            else {
                return val;
            }
        }
        
        var skipWhitespace = function (m, row, col) {
            var pos, x, y, i, j, k, currAtom;
            
            y = 0;
            x = 1;
            pos = [row, col];
            while (pos[y] < m.length) {
                while (m[pos[y]][pos[x]] === " ") {
                    pos[x]++;
                    if (m[pos[y]][pos[x]] === undefined) {
                        break;
                    }
                }
                
                if (m[pos[y]][pos[x]] === '/') {
                    currAtom = getBlock (m, pos, '/');
                    if (currAtom.err) {
                        return currAtom;
                    }
                    else {
                        pos[y] = currAtom.pos[y];
                        pos[x] = currAtom.pos[x];
                    }
                }
                else if (m[pos[y]][pos[x]] !== undefined) {
                    break;
                }
                else {
                    pos[x] = 0;
                    pos[y]++;
                }
            }
            
            return [pos[y], pos[x]];
        }
        
        var getBlock = function (m, pos, bound) {
            var i, j, ws, numBounds1 = 0, numBounds2, x = 1, y = 0, currAtom = "", val;
            var pos0 = [pos[y], pos[x]];
            var pos1 = [pos[y], pos[x]];
            if ('"/'.indexOf (bound) > -1) {
                i = pos1[x];
                numBounds1 = 0;
                while (m[pos1[y]][i] === bound) {
                    i++;
                    numBounds1++;
                }
                
                if (numBounds1 === 1 || numBounds1 % 2 === 0) {
                    currAtom = bound;
                    pos1[x]++;
                    while (m[pos1[y]][pos1[x]] !== undefined && m[pos1[y]][pos1[x]] !== bound) {
                        currAtom += m[pos1[y]][pos1[x]];
                        pos1[x]++;
                        if (m[pos1[y]][pos1[x]] === '\\') {
                            currAtom += m[pos1[y]][pos1[x]];
                            pos1[x]++;
                            currAtom += m[pos1[y]][pos1[x]];
                            pos1[x]++;
                        }
                    }
                    
                    if (m[pos1[y]][pos1[x]] === bound) {
                        currAtom += m[pos1[y]][pos1[x]];
                        if (bound === '"') {
                            try {
                                val = JSON.parse(currAtom).replaceAll ("\\", "&bsol;");
                            }
                            catch {
                                return {err: err[4], pos: {y: pos1[y], x: pos1[x]}};
                            }
                        }
                        else {
                            val = currAtom;
                        }
                        
                        return {pos: [pos1[y], pos1[x] + 1], val: val};
                    }
                    else {
                        return {err: err[5], pos: {y: pos1[y], x: pos1[x]}};
                    }
                }
                else {
                    i = pos1[x] + numBounds1;
                    while (true) {
                        if (m[pos1[y]][i] === undefined) {
                            break;
                        }
                        else if (m[pos1[y]][i] !== " ") {
                            return {err: err[9], pos: {y: pos[y], x: i}};
                        }

                        i++;
                    }
                    
                    ws = 0;
                    while (m[pos1[y]][ws] === " ") {
                        ws++;
                    }
                    
                    pos1[y]++;
                    pos1[x] = ws;
                    while (pos1[y] < m.length) {
                        for (i = 0; i < ws; i++) {
                            if (m[pos1[y]][i] !== " " && m[pos1[y]][i] !== undefined) {
                                //return {err: err[8], pos: {y: pos1[y], x: i}};
                                return {err: err[6], pos: {y: pos0[y], x: pos0[x]}};
                            }
                        }
                        
                        if (m[pos1[y]][ws] === bound) {
                            i = ws;
                            numBounds2 = 0;
                            while (m[pos1[y]][i] === bound) {
                                i++;
                                numBounds2++;
                            }
                            
                            if (numBounds1 === numBounds2) {
                                break;
                            }
                        }
                        
                        pos1[y]++;
                    }
                    
                    if (pos1[y] < m.length) {
                        return {pos: [pos1[y], pos1[x] + numBounds2], val: extractBlock (m, {begin: [pos0[y], ws], end: [pos1[y], ws + numBounds2]}).replaceAll ("\\", "&bsol;")};
                    }
                    else {
                        return {err: err[6], pos: {y: pos[y], x: pos[x]}};
                    }
                }
            }
        }
        
        var extractBlock = function (m, bounds) {
            var i, j, x = 1, y = 0, currChar, val = "";
            var pos = bounds.begin;
            for (i = pos[y] + 1; i < bounds.end[y]; i++) {
                for (j = pos[x]; m[i][j] !== undefined; j++) {
                    val += m[i][j];
                }
                
                val += "\n";
            }
            
            return val;
        }
        
        var getNode = function (text, path) {
            if (path.length === 0) {
                return {err: "Top node error", pos: skipWhitespace(text, 0).pos};
            }
            else {
                var expr = parseMatrix (createMatrix(text), true);
                while (path.length > 0) {
                    if (Array.isArray (expr.val)) {
                        if (expr.val[path[0]] !== undefined) {
                            expr = expr.val[path[0]];
                            path.shift ();
                        }
                        else {
                            return {err: "syntax error", found: "missing list element(s)", pos: expr.pos};
                        }
                    }
                    else {
                        return {err: "syntax error", found: "atom", pos: expr.pos};
                    }
                }
                
                return {err: "syntax error", found: Array.isArray (expr.val) ? (expr.val.length === 0 ? "empty " : "") + "list" : '"' + expr.val + '"', pos: expr.pos};
            }
        };
        
        var normalizeSexpr = function (expr) {
            if (Array.isArray (expr)) {
                var lastExpr = [];
                for (var i = expr.length - 1; i >= 0; i--) {
                    lastExpr = [normalizeSexpr (expr[i]), lastExpr];
                }
                
                return lastExpr;
            }
            else {
                return expr;
            }
        };
        
        var denormalizeSexpr = function (expr) {
            if (!Array.isArray(expr)) {
                return expr;
            }
            else {
                var dnm = [];
                while (expr.length === 2) {
                    dnm.push (denormalizeSexpr (expr[0]))
                    expr = expr[1];
                }
                
                return dnm;
            }
        }
        
        var denormalizeIndexes = function (nm) {
            var dnm = [];
            var idx = 0;
            for (var i = 0; i < nm.length; i++) {
                if (nm[i] === 0) {
                    dnm.push (idx);
                    idx = 0;
                }
                else {
                    idx++;
                }
            }
            
            if (idx > 0) {
                dnm.push (idx);
            }
            
            return dnm;
        };
        
        function stringify (node, indent) {
            if (indent === undefined) {
                indent = ""
            }
            
            if (typeof node === "string") {
                return quoteIfNecessary (node) + "\n";
            }
            
            var str = ""
            str += indent + "(" + "\n";
            
            for (var i = 0; i < node.length; i++) {
                if (Array.isArray (node[i])) {
                    str += stringify (node[i], indent + "    ");
                }
                else {
                    var part
                    if (node[i] === undefined) {
                        part = "UNDEFINED";
                    }
                    else if (node[i] === true) {
                        part = "TRUE";
                    }
                    else if (node [i] === null) {
                        part = "NIL";
                    }
                    else {
                        part = quoteIfNecessary (node[i]);
                    }
                    
                    str += indent + "    " + part + "\n";
                }
            }
            
            str += indent + ")" + "\n";

            return str;
        }
        
        function quoteIfNecessary (str) {
            var quoted = false;
            for (var i = 0; i < str.length; i++) {
                if ('() \t\n\r'.indexOf (str.charAt (i)) > -1) {
                    quoted = true;
                    break;
                }
            }
            
            for (var i = 0; i < str.length && str.charAt(i) === "\\"; i++);
            for (var j = i; j < str.length && str.charAt(j) !== "\\"; j++);
            
            if (quoted || str.indexOf ("&bsol;") > -1) {
                return str.substring(0, i) + JSON.stringify(str.substring(i, j).replaceAll ("&bsol;", "\\")) + str.substring(j, str.length);
            }
            else {
                return str;
            }
        }

        return {
            parse: parse,
            getNode: getNode,
            normalizeSexpr: normalizeSexpr,
            denormalizeSexpr: denormalizeSexpr,
            denormalizeIndexes: denormalizeIndexes,
            stringify: stringify
        }
    }) ()
);

var isNode = new Function ("try {return this===global;}catch(e){return false;}");

if (isNode ()) {
    // begin of Node.js support

    module.exports = Sexpression;
    
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

