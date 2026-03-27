const BUILTINS = {
    unquote(expr) {
        if (!Array.isArray (expr)) {
            if (expr.charAt (0) === '"' && expr.charAt (expr.length - 1) === '"') {
                return expr.substring (1, expr.length - 1);
            }
            else {
                return expr;
            }
        }
  
        return expr;
    },
    quote(expr) {
        if (!Array.isArray (expr)) {
            return '"' + expr + '"';
        }
  
        return expr;
    },

  // (isatom elem) -> bool
  isatom(args) {
    if (args[2].length !== 2) return {err: "Parameters not valid"};
    const elem = args[2][1];
    return (Array.isArray(elem)) ? '"false"' : '"true"';
  },

  /*
  MATH FUNCTIONS
  */
  
  // (add elem elem) -> elem
  add(args) {
    if (args[2].length !== 3) return {err: "Parameters not valid"};
    const lft = Number(this.unquote(args[2][1]));
    const rgt = Number(this.unquote(args[2][2]));
    return this.quote((lft + rgt).toString());
  },
  
  // (add elem elem) -> elem
  sub(args) {
    if (args[2].length !== 3) return {err: "Parameters not valid"};
    const lft = Number(this.unquote(args[2][1]));
    const rgt = Number(this.unquote(args[2][2]));
    return this.quote((lft - rgt).toString());
  },
  
  // (add elem elem) -> elem
  mul(args) {
    if (args[2].length !== 3) return {err: "Parameters not valid"};
    const lft = Number(this.unquote(args[2][1]));
    const rgt = Number(this.unquote(args[2][2]));
    return this.quote((lft * rgt).toString());
  },
  
  // (add elem elem) -> elem
  div(args) {
    if (args[2].length !== 3) return {err: "Parameters not valid"};
    const lft = Number(this.unquote(args[2][1]));
    const rgt = Number(this.unquote(args[2][2]));
    return this.quote((lft / rgt).toString());
  },
  
  // (mod elem elem) -> elem
  mod(args) {
    if (args[2].length !== 3) return {err: "Parameters not valid"};
    const lft = Number(this.unquote(args[2][1]));
    const rgt = Number(this.unquote(args[2][2]));
    return this.quote((lft % rgt).toString());
  },
  
  // (add elem elem) -> elem
  pow(args) {
    if (args[2].length !== 3) return {err: "Parameters not valid"};
    const lft = Number(this.unquote(args[2][1]));
    const rgt = Number(this.unquote(args[2][2]));
    return this.quote((Math.pow(lft, rgt)).toString());
  },
  
  // (add elem elem) -> elem
  log(args) {
    if (args[2].length !== 2) return {err: "Parameters not valid"};
    const param = Number(this.unquote(args[2][1]));
    return this.quote((Math.log(param)).toString());
  },
  
  // (leq elem elem) -> bool
  leq(args) {
    if (args[2].length !== 3) return {err: "Parameters not valid"};
    const elem1 = Number(this.unquote(args[2][1]));
    const elem2 = Number(this.unquote(args[2][2]));
    return (elem1 <= elem2) ? '"true"' : '"false"';
  },
  
  /*
  STRING FUNCTIONS
  */

  // (strlen elem) -> elem
  strlen(args) {
    if (args[2].length !== 2) return {err: "Parameters not valid"};
    const elem = args[2][1];
    if (typeof elem !== "string") return {err: "Parameters not valid"};
    return elem.length.toString();
  },

  // (strcat elem elem) -> elem
  strcat(args) {
    if (args[2].length !== 3) return {err: "Parameters not valid"};
    const elem1 = args[2][1];
    const elem2 = args[2][2];
    if (typeof elem1 !== "string") return {err: "Parameters not valid"};
    if (typeof elem2 !== "string") return {err: "Parameters not valid"};
    return "" + elem1 + elem2;
  },

  // (charat elem) -> elem
  charat(args) {
    if (args[2].length !== 3) return {err: "Parameters not valid"};
    const elem1 = args[2][1];
    const elem2 = args[2][2];
    if (typeof elem1 !== "string") return {err: "Parameters not valid"};
    if (typeof elem2 !== "string") return {err: "Parameters not valid"};
    return elem1.charAt(elem2);
  },

  // (substr elem elem elem) -> elem
  substr(args) {
    if (args[2].length !== 4) return {err: "Parameters not valid"};
    const elem1 = args[2][1];
    const elem2 = args[2][2];
    const elem3 = args[2][3];
    if (typeof elem1 !== "string") return {err: "Parameters not valid"};
    if (typeof elem2 !== "string") return {err: "Parameters not valid"};
    if (typeof elem3 !== "string") return {err: "Parameters not valid"};
    return elem1.substring(elem2, elem3);
  },

  
  // (strcmp elem elem) -> num
  strcmp(args) {
    if (args[2].length !== 3) return {err: "Parameters not valid"};
    const elem1 = args[2][1];
    const elem2 = args[2][2];
    if (typeof elem1 !== "string") return {err: "Parameters not valid"};
    if (typeof elem2 !== "string") return {err: "Parameters not valid"};
    if (elem1 < elem2)
      return '"-1"';
    else if (elem1 > elem2)
      return '"1"';
    else
      return '"0"';
  },

  /*
  LIST FUNCTIONS
  */
  
  // (nth elem list) -> elem
  nth(args) {
    if (args[2].length !== 3) return {err: "Parameters not valid"};
    const elem = args[2][1];
    const lst = args[2][2];
    if (!Array.isArray(lst)) return {err: "Parameters not valid"};
    if (lst.length === 0) return {err: "List is empty"};
    if (lst[this.unquote(elem)]) return lst[this.unquote(elem)];
    return [];
  },
  
  // (prepend elem lst) -> list
  prepend(args) {
    if (args[2].length !== 3) return {err: "Parameters not valid"};
    const elem = args[2][1];
    const lst = args[2][2];
    if (!Array.isArray(lst)) return {err: "Parameters not valid"};
    return [elem, ...lst];
  },
  
  // (append elem lst) -> list
  append(args) {
    if (args[2].length !== 3) return {err: "Parameters not valid"};
    const lst = args[2][1];
    const elem = args[2][2];
    if (!Array.isArray(lst)) return {err: "Parameters not valid"};
    return [...lst, elem];
  },
  
  // (concat lst lst) -> lst
  concat(args) {
    if (args[2].length !== 3) return {err: "Parameters not valid"};
    const lst1 = args[2][1];
    const lst2 = args[2][2];
    if (!Array.isArray(lst1)) return {err: "Parameters not valid"};
    if (!Array.isArray(lst2)) return {err: "Parameters not valid"};
    return [...lst1, ...lst2];
  },
  
  // (first lst) -> any
  first(args) {
    if (args[2].length !== 2) return {err: "Parameters not valid"};
    const lst = args[2][1];
    if (!Array.isArray(lst)) return {err: "Parameters not valid"};
    if (lst.length === 0) return {err: "List is empty"};
    return lst[0];
  },
  
  // (rest lst) -> list
  rest(args) {
    if (args[2].length !== 2) return {err: "Parameters not valid"};
    const lst = args[2][1];
    if (!Array.isArray(lst)) return {err: "Parameters not valid"};
    if (lst.length === 0) return {err: "List is empty"};
    return lst.slice(1);
  },
  
  // (first lst) -> any
  lstlen(args) {
    if (args[2].length !== 2) return {err: "Parameters not valid"};
    const lst = args[2][1];
    if (!Array.isArray(lst)) return {err: "Parameters not valid"};
    return lst.length.toString();
  }
};

