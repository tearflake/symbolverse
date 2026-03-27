examples = {
"arith":
`
/*
    computing pack
*/

(GRAMMAR
    (RULE START calc)
    
    (RULE calc (LIST "add" elems))
    (RULE calc (LIST "mul" elems))
    (RULE calc (RUN decNum))
    
    (RULE elems (LIST calc elems))
    (RULE elems ())
    
    (COMPUTE
        (NAME decNum)
        (GRAMMAR
            (RULE START digits)
            
            (RULE digits (ATOM digit digits))
            (RULE digits (ATOM digit ()))
            
            (RULE digit "1")
            (RULE digit "2")
            (RULE digit "3")
            (RULE digit "4")
            (RULE digit "5")
            (RULE digit "6")
            (RULE digit "7")
            (RULE digit "8")
            (RULE digit "9")
            (RULE digit "0"))))
`,
"arith-input":
`
(mul (add 111 222 333) 222 111)
`,

"list":
`
/*
    list of atoms
*/

(GRAMMAR
    (RULE START atoms)
   
    (RULE atoms (LIST atom atoms))
    (RULE atoms (LIST atom ()))
    
    (RULE atom ATOMIC))
`,
"list-input":
`
(foo bar baz)
`,

"pairlist": 
`
/*
    nested lists
*/

(GRAMMAR
    (RULE START (LIST "pairlist" pairs))
    
    (RULE pairs (LIST pair pairs))
    (RULE pairs (LIST pair ()))
    
    (RULE pair (LIST "pair" (LIST atom (LIST atom ()))))
    (RULE atom ATOMIC))
`,
"pairlist-input":
`
(pairlist
    (pair foo bar)
    (pair alpha beta)
    (pair one two))
`,

"bintree":
`
/*
    custom atoms and computing section
*/

(GRAMMAR
    (RULE START binTree)
    
    (RULE binTree (LIST "bintree" (LIST binTree (LIST binTree ()))))
    (RULE binTree (LIST "leaf" (LIST (RUN binNum) ())))

    (COMPUTE
        (NAME binNum)
        (GRAMMAR
            (RULE START digits)
            
            (RULE digits (ATOM digit digits))
            (RULE digits (ATOM digit ()))
            
            (RULE digit "0")
            (RULE digit "1"))))
`,
"bintree-input":
`
(bintree
    (bintree
        (leaf 01)
        (leaf 10))
        
    (leaf 11))
`,

"bootstrap": `
/*
    symbolmatch bootstrapped
*/

(GRAMMAR
    (RULE START grammar)
    
    (RULE grammar (LIST "GRAMMAR" elements))
    
    (RULE elements (LIST element elements))
    (RULE elements (LIST element ()))
    
    (RULE element
        (LIST "RULE"
            (LIST ATOMIC
                (LIST metaExp
                    ()))))
    
    (RULE element
        (LIST "COMPUTE"
            (LIST (LIST "NAME" (LIST ATOMIC ()))
                (LIST grammar
                    ()))))
    
    (RULE metaExp
        (LIST "LIST"
            (LIST metaExp
                (LIST metaExp
                    ()))))
                    
    (RULE metaExp metaAtom)
         
    (RULE metaAtom
        (LIST "ATOM"
            (LIST ATOMIC
                (LIST metaAtom
                    ()))))
                    
    (RULE metaAtom atomic)
    
    (RULE atomic (LIST "RUN" (LIST ATOMIC ())))
    (RULE atomic ATOMIC)
    (RULE atomic ()))
`,
"bootstrap-input": `
(GRAMMAR
    (RULE START "Hello computer!"))
`,

"prose":
`
/*
    symbolprose
*/

(GRAMMAR
    (RULE START graph)

    (RULE graph (LIST "GRAPH" elements))
    
    (RULE elements (LIST element elements))
    (RULE elements (LIST element ()))
    
    (RULE element
        (LIST "EDGE"
            (LIST (LIST "SOURCE" (LIST ATOMIC ()))
                (LIST instr
                    (LIST (LIST "TARGET" (LIST ATOMIC ()))
                        ())))))
                        
    (RULE element
        (LIST "EDGE"
            (LIST (LIST "SOURCE" (LIST ATOMIC ()))
                (LIST (LIST "TARGET" (LIST ATOMIC ()))
                    ()))))
                    
    (RULE element
        (LIST "COMPUTE"
            (LIST (LIST "NAME" (LIST ATOMIC ()))
                (LIST graph
                    ()))))
    
    (RULE instr (LIST "INSTR" instructions))
    
    (RULE instructions (LIST instruction instructions))
    (RULE instructions (LIST instruction ()))
    
    (RULE instruction (LIST "TEST" (LIST ANY (LIST ANY ()))))
    (RULE instruction (LIST "ASGN" (LIST ATOMIC (LIST ANY ())))))
`,
"prose-input":
`
(GRAPH
    (EDGE
        (SOURCE BEGIN)
        (INSTR (ASGN RESULT "Hello world!"))
        (TARGET END)))
`,

"verse":
`
/*
    symbolverse
*/

(GRAMMAR
    (RULE START ruleset)

    (RULE ruleset (LIST "REWRITE" elements))

    (RULE elements (LIST element elements))
    (RULE elements (LIST element ()))

    (RULE element
        (LIST "RULE"
            (LIST (LIST "READ" (LIST ANY ()))
                (LIST (LIST "WRITE" (LIST ANY ()))
                    ()))))
    
    (RULE element
        (LIST "COMPUTE"
            (LIST (LIST "NAME" (LIST ATOMIC ()))
                (LIST ruleset
                    ())))))
`,
"verse-input":
`
(REWRITE
    (RULE (READ "Hello computer!") (WRITE "Hello world!")))
`,

"ski":
`
/*
    SKI calculus
*/

(GRAMMAR
    (RULE START skiExpr)

    (RULE skiExpr (LIST skiExpr (LIST skiExpr ())))
    (RULE skiExpr "S")
    (RULE skiExpr "K")
    (RULE skiExpr "I"))
`,
"ski-input":
`
((S K) K)
`,

"lmbd":
`
/*
    lambda calculus
*/

(GRAMMAR
    (RULE START lmbdExpr)

    (RULE lmbdExpr (LIST "lmbd" (LIST ATOMIC (LIST lmbdExpr ()))))
    (RULE lmbdExpr (LIST lmbdExpr (LIST lmbdExpr ())))
    (RULE lmbdExpr ATOMIC))
`,

"lmbd-input":
`
(((lmbd x (lmbd y (y x))) a) b)
`
}

