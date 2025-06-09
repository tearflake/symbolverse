// s-expr.js
// (c) tearflake, 2025
// MIT License

"use strict"

var Sexpr = (
    function (obj) {
        return {
            parse: obj.parse,
            getNode: obj.getNode,
            normalizeSexpr: obj.normalizeSexpr,
            denormalizeSexpr: obj.denormalizeSexpr,
            denormalizeIndexes: obj.denormalizeIndexes,
            flatten: obj.flatten,
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
        err[5] = "Block not terminated error";
        err[6] = "Block not terminated error";
        err[7] = "Unresolved block error";
        err[8] = "Expected whitespace error";
        err[9] = "Expected newline error";
        err[10] = "Incorrect escaping error";
        err[11] = "Can not use reserved character '*'";
        
        var parse = function (text) {
            var m = createMatrix (text);
            var p = parseMatrix ([], m.l, m.m);
            return p;
        }
        
        var createMatrix = function (text) {
            var l, m, i;
            
            l = [];
            text = text.replaceAll ("\r\n", "\n").replaceAll ("\t", "    ").replaceAll ("\u000B", "");
            m = text.split ("\n");
            for (i = 0; i < m.length; i++) {
                l[i] = m[i].length;
                m[i] = m[i].split ("");
            }
            
            return {l: l, m: m};
        }
        
        var fixPos = function (pos, m) {
            return pos;
            /*
            var y = 0;
            var x = 1;
            pos = [pos.y, pos.x];
            var line = ""
            for (var i = 0; i < m[pos[y]].length; i++) {
                line += m[pos[y]][i];
            }
            
            var dist = 0;
            for (var i = 0; i < pos[x]; i++) {
                if (line.substr (i, 5) === '&and;') {
                    dist += 2;
                    i += 4;
                }
                else if (line.substr (i, 4) === '&or;') {
                    dist += 2;
                    i += 3;
                }
                else if (line.substr (i, 4) === '&sl;') {
                    dist += 1;
                    i += 3;
                }
                else if (line.substr (i, 4) === '&bs;') {
                    dist += 1;
                    i += 3;
                }
                else {
                    dist += 1;
                }
            }
            
            return {y: pos[y], x: dist};
            */
        }
        
        var parseMatrix = function (b, l, m, verbose) {
            var x, y, pos, i, tmpPos, stack, currChar, currAtom, val;
            
            y = 0;
            x = 1;
            pos = [0, 0];
            stack = [];
            while (pos[y] < m.length) {
                while (b[0] && b[0][2] < pos[y]) {
                    b.shift ();
                }

                pos[x] = skipExistingBlock (b, pos[y], pos[x]);
                currChar = m[pos[y]][pos[x]];
                if (currChar === '/' || currChar === ' ' || currChar === undefined) {
                    tmpPos = skipWhitespace (l, m, b, pos[y], pos[x]);
                    if (tmpPos.err) {
                        return {err: tmpPos.err, pos: fixPos (tmpPos.pos, m)};
                    }
                    
                    if (m[tmpPos[y]] === undefined) {
                        tmpPos[y] = m.length - 1;
                        tmpPos[x] = 0;
                        while (m[tmpPos[y]] && m[tmpPos[y]][tmpPos[x]] !== undefined) {
                            tmpPos[x]++;
                        }
                        
                        return {err: err[3], pos: fixPos ({y: tmpPos[y], x: tmpPos[x]}, m)};
                    }
                    
                    pos = tmpPos;
                }
                else if (currChar === '(') {
                    if (verbose) {
                        stack.push ({val: [], pos: {y: pos[y], x: pos[x]}});
                    }
                    else {
                        stack.push ([]);
                    }
                    
                    pos[x]++;
                }
                else if (currChar === ')') {
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
                        if (verbose) {
                            val = stack[stack.length - 1];
                        }
                        else {
                            val = stack[stack.length - 1];
                        }
                        break;
                    }
                }
                else if (' /()'.indexOf (currChar) === -1 && currChar !== undefined) {
                    var start = {y: pos[y], x: pos[x]};
                    var escaped = "";
                    while (currChar === '\\') {
                        escaped += currChar;
                        pos[x]++;
                        currChar = m[pos[y]][pos[x]];
                    }
                    
                    if (currChar === '"') {
                        currAtom = getBlock (b, l, m, pos, currChar);
                        if (currAtom.err) {
                            return {err: currAtom.err, pos: fixPos (currAtom.pos, m)};
                        }
                        else {
                            b.push (currAtom.rect);
                            pos[y] = currAtom.rect[0];
                            pos[x] = currAtom.rect[3];
                            currChar = m[pos[y]][pos[x]];
                            var end = {y: pos[y], x: pos[x]};
                            if (currAtom.val === "") {
                                currAtom.val = "NIL"
                            }
                            
                            if (escaped.length > 0) {
                                if (currChar === '\\') {
                                    return {err: err[10], pos: fixPos (start, m)};
                                }
                                else {
                                    currAtom = escaped + currAtom.val;
                                }
                            }
                            else {
                                while (currChar === '\\') {
                                    escaped += currChar;
                                    pos[x]++;
                                    currChar = m[pos[y]][pos[x]];
                                }
                                
                                currAtom = currAtom.val + escaped;
                            }
                        }
                    }
                    else {
                        currAtom = escaped;
                        br1: while (' /()"'.indexOf (currChar) === -1 && currChar !== undefined) {
                            if (currChar === '*') {
                                return {err: err[11], pos: fixPos ({y: pos[y], x: pos[x]}, m)};
                            }
                            currAtom += currChar;
                            pos[x]++;
                            currChar = m[pos[y]][pos[x]];
                            
                            for (i = 0; i < b.length; i++) {
                                if (pos[y] >= b[i][0] && pos[x] >= b[i][1] && pos[y] <= b[i][2] && pos[x] <= b[i][3]) {
                                    break br1;
                                }
                            }
                        }
                        
                        if (currAtom.charAt (0) === "\\" && currAtom.charAt (currAtom.length - 1) === "\\") {
                            return {err: err[10], pos: fixPos (start, m)};
                        }
                    }

                    if (stack.length > 0) {
                        if (verbose) {
                            stack[stack.length - 1].val.push ({val: currAtom, pos: start});
                        }
                        else {
                            stack[stack.length - 1].push (currAtom);
                        }
                    }
                    else {
                        if (verbose) {
                            val = {val: currAtom, pos: start}
                        }
                        else {
                            val = currAtom;
                        }
                        break;
                    }
                }
            }
            
            pos = skipWhitespace (l, m, b, pos[y], pos[x]);
            if (pos.err) {
                return {err: pos.err, pos: fixPos (pos.pos, m)};
            }
            
            if (pos[y] < m.length && m[pos[y]][pos[x]] !== undefined) {
                return {err: err[2], pos: fixPos ({y: pos[y], x: pos[x]}, m)};
            }
            else {
                return val;
            }
        }
        
        var skipWhitespace = function (l, m, b, row, col) {
            var pos, x, y, i, j, k, currAtom;
            
            y = 0;
            x = 1;
            pos = [row, col];
            while (pos[y] < m.length) {
                pos[x] = skipExistingBlock (b, pos[y], pos[x]);
                while (m[pos[y]][pos[x]] === " ") {
                    pos[x]++;
                    pos[x] = skipExistingBlock (b, pos[y], pos[x]);
                    if (m[pos[y]][pos[x]] === undefined) {
                        break;
                    }
                }
                
                if (m[pos[y]][pos[x]] === '/') {
                    currAtom = getBlock (b, l, m, pos, '/');
                    if (currAtom.err) {
                        return currAtom;
                    }
                    else {
                        b.push (currAtom.rect);
                        pos[y] = currAtom.rect[0];
                        pos[x] = currAtom.rect[3];
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
        
        var getBlock = function (b, l, m, pos, bound) {
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
                    var instr = false;
                    while (m[pos1[y]][pos1[x]] !== undefined && ((m[pos1[y]][pos1[x]] !== bound) || instr)) {
                        currAtom += m[pos1[y]][pos1[x]];
                        pos1[x]++;
                        if (bound === '/' && m[pos1[y]][pos1[x]] === '"') {
                            instr = !instr;
                        }
                        if (m[pos1[y]][pos1[x] - 1] === '\\' && bound ==='"') {
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
                                return {err: err[4], pos: {y: pos0[y], x: pos0[x]}};
                            }
                        }
                        else {
                            val = currAtom;
                        }
                        
                        return {rect: [pos0[y], pos0[x], pos1[y], pos1[x] + 1], val: val};
                    }
                    else {
                        return {err: err[5], pos: {y: pos0[y], x: pos0[x]}};
                    }
                }
                else {
                    pos1[y]++;
                    br1: while (pos1[y] < m.length) {
                        while (m[pos1[y]][pos1[x]] !== " " && m[pos1[y]][pos1[x]] !== bound) {
                            pos1[y]++;
                            if (pos1[y] >= m.length) {
                                break br1;
                            }
                        }
                        
                        while (m[pos1[y]][pos1[x]] === " ") {
                            pos1[x]++;
                        }
                        
                        i = pos1[x];
                        numBounds2 = 0;
                        while (m[pos1[y]][i] === bound) {
                            i++;
                            numBounds2++;
                        }
                        
                        if (numBounds1 === numBounds2) {
                            pos1[x] += numBounds2;
                            break;
                        }
                        
                        pos1[y]++;
                        pos1[x] = pos[x];
                    }
                    
                    if (pos1[y] < m.length) {
                        for (i = pos0[x] + numBounds1; i < pos1[x]; i++) {
                            if (m[pos0[y]][i] !== " " && m[pos0[y]][i] !== undefined) {
                                return {err: err[8], pos: {y: pos0[y], x: i}};
                            }
                        }
                        return {rect: [pos0[y], pos0[x], pos1[y], pos1[x]], val: extractBlock (b, m, [pos0[y] + 1, pos0[x], pos1[y] - 1, pos1[x]]).replaceAll ("\\", "&bsol;")};
                    }
                    else {
                        return {err: err[6], pos: {y: pos[y], x: pos[x]}};
                    }
                }
            }
        }
        
        var extractBlock = function (b, m, rect) {
            var x = 1, y = 0, currChar, val = "";
            var pos = [rect[0], rect[1]];
            while (pos[y] <= rect[2]) {
                //pos[x] = skipExistingBlock (b, pos[y], pos[x]);
                currChar = m[pos[y]][pos[x]]
                if (currChar !== undefined) {
                    val += currChar;
                }
                
                pos[x]++;
                
                if (pos[x] === rect[3] || m[pos[y]][pos[x]] === undefined) {
                    val += "\n";
                    pos[x] = rect[1];
                    pos[y]++;
                }
            }
            
            return val;
        }
        
        var skipExistingBlock = function (b, i, j) {
            var k, x, y, pos;
            x = 1;
            y = 0;
            pos = [i, j];
            for (k = 0; k < b.length; k++) {
                if (pos[y] >= b[k][0] && pos[x] >= b[k][1] && pos[y] <= b[k][2] && pos[x] <= b[k][3]) {
                    pos[x] = Math.max (b[k][3], pos[x]);
                }
            }
            
            return pos[x];
        }
        
        /*
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
        */
        
        var getNode = function (text, path) {
            text = text.replaceAll ('&amp;', '&').replaceAll ('&sl;', '/'). replaceAll ('&bs;', '\\');
            var x = 1, y = 0;
            if (path.length === 0) {
                var m = createMatrix(text);
                var pos = skipWhitespace(m.l, m.m, [], 0, 0);
                return {err: "Top node error", pos: {y: pos[y], x: pos[x]}};
            }
            else {
                var m = createMatrix(text);
                var expr = parseMatrix ([], m.l, m.m, true);
                while (path.length > 0) {
                    if (Array.isArray (expr.val)) {
                        if (expr.val[path[0]] !== undefined) {
                            expr = expr.val[path[0]];
                            path.shift ();
                        }
                        else {
                            return {err: "Syntax error", found: "missing list element(s)", pos: expr.pos};
                        }
                    }
                    else {
                        return {err: "Syntax error", found: "atom", pos: expr.pos};
                    }
                }
                
                return {err: "Syntax error", found: Array.isArray (expr.val) ? (expr.val.length === 0 ? "empty " : "") + "list" : quoteIfNecessary (expr.val), pos: expr.pos};
            }
        };
        
        var normalizeSexpr = function (expr) {
            var stack = [], item;
            var car = expr, cdr = [];
            stack.push ({car: expr});
            while (stack.length > 0) {
                item = stack.pop ();
                if (item.car !== undefined) {
                    car = item.car;
                    if (Array.isArray (car)) {
                        stack.push ({cdr: cdr})
                        cdr = [];
                        for (var i = 0;  i < car.length; i++) {
                            stack.push ({car: car[i]})
                        }
                    }
                    else {
                        cdr = [car, cdr];
                    }
                }
                else {
                    car = cdr;
                    cdr = [car, item.cdr];
                }
            }
            
            return car;
        };
        
        var denormalizeSexpr = function (expr) {
            var stack = [], item;
            var atom = expr, list = [];
            stack.push ({atom: expr});
            while (stack.length > 0) {
                item = stack.pop ();
                if (item.atom) {
                    var atom = item.atom;
                    if (!Array.isArray(atom)) {
                        list.unshift (atom);
                    }
                    else {
                        stack.push ({list: list});
                        list = [];
                        while (atom.length === 2) {
                            stack.push ({atom: atom[0]});
                            atom = atom[1];
                        }
                    }
                }
                else {
                    item.list.unshift (list);
                    list = item.list;
                }
            }
            
            return list[0];
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
        
        var flatten = function (arr) {
            var result = [], stack = [arr], item, i;
            
            if (arr === undefined) {
                return [];
            }
            
            while (stack.length > 0) {
                item = stack.pop ();
                if (item.arr) {
                    result.push (")");
                }
                else if (Array.isArray (item)) {
                    result.push ("(");
                    stack.push ({arr: true});
                    for (i = item.length - 1; i >= 0 ; i--) {
                        stack.push (item[i]);
                    }
                }
                else {
                    result.push (quoteIfNecessary (item));
                }
            }
            
            return (result);
        }

        function stringify (node) {
            const stack = [{ node, indent: "", index: 0, result: "" }];
            let output = "";

            while (stack.length > 0) {
                const current = stack.pop();
                const { node, indent, index, result } = current;

                if (index === 0) {
                    if (typeof node === "string") {
                        output += indent + quoteIfNecessary (node) + "\n";
                        continue;
                    }
                    output += indent + "(\n";
                }

                let i = index;
                for (; i < node.length; i++) {
                    if (Array.isArray (node[i])) {
                        stack.push ({ node, indent, index: i + 1, result });
                        stack.push ({ node: node[i], indent: indent + "    ", index: 0, result: "" });
                        break;
                    }
                    else {
                        let part;
                        if (node[i] === undefined) {
                            part = "UNDEFINED";
                        }
                        else if (node[i] === true) {
                            part = "TRUE";
                        }
                        else if (node[i] === null) {
                            part = "NIL";
                        }
                        else {
                            part = quoteIfNecessary (node[i]);
                        }
                        output += indent + "    " + part + "\n";
                    }
                }

                if (i === node.length) {
                    output += indent + ")\n";
                }
            }

            //return output.replaceAll ('&and;', '/\\').replaceAll('&or;', '\\/').replaceAll ('&sl;', '/'). replaceAll ('&bs;', '\\');
            return output;
        }

        function quoteIfNecessary (str) {
            var quoted = false;
            for (var i = 0; i < str.length; i++) {
                if (str === "" || '/() \t\n\r'.indexOf (str.charAt (i)) > -1) {
                    quoted = true;
                    break;
                }
            }
            
            if ("\\".repeat (str.length) === str) {
                return str + 'NIL';
            }
            else if (quoted || str.indexOf ("&bsol;") > -1) {
                for (var i = 0; i < str.length && str.charAt(i) === "\\"; i++);
                for (var j = i; j < str.length && str.charAt(j) !== "\\"; j++);
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
            stringify: stringify,
            flatten: flatten
        }
    }) ()
);

var isNode = new Function ("try {return this===global;}catch(e){return false;}");

if (isNode ()) {
    // begin of Node.js support

    module.exports = Sexpr;
    
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

