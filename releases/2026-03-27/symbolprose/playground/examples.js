examples = {
"echo":
`
(GRAPH
   (EDGE
        (SOURCE BEGIN)
        (INSTR
            (ASGN x PARAMS)
            (ASGN RESULT x))
            
        (TARGET END)))
`,
"echo-input":
`
xyz
`,

"ping-pong":
`
(GRAPH
   (EDGE
        (SOURCE BEGIN)
        (INSTR
            (TEST PARAMS "ping")
            (ASGN RESULT "pong"))
            
        (TARGET END)))
`,
"ping-pong-input":
`
ping
`,

"hi-bye":
`
(GRAPH
    (EDGE
        (SOURCE BEGIN)
        (INSTR
            (TEST PARAMS "hi")
            (ASGN RESULT "greeting"))
            
        (TARGET END))

    (EDGE
        (SOURCE BEGIN)
        (INSTR
            (TEST PARAMS "bye")
            (ASGN RESULT "farewell"))
            
        (TARGET END))

    (EDGE
        (SOURCE BEGIN)
        (INSTR (ASGN RESULT "unknown"))
        (TARGET END)))
`,
"hi-bye-input":
`
hi
`,

"foo-bar":
`
(GRAPH

    // Step 1: Load input
    (EDGE
        (SOURCE BEGIN)
        (INSTR (ASGN x PARAMS))
        (TARGET check))

    // Step 2: Check for foo
    (EDGE
        (SOURCE check)
        (INSTR (TEST x "foo"))
        (TARGET match-foo))

    // Step 3: Check for bar
    (EDGE
        (SOURCE check)
        (INSTR (TEST x "bar"))
        (TARGET match-bar))

    // Step 4: Fallback if no match
    (EDGE
        (SOURCE check)
        (TARGET fallback))

    // Step 5: Match case foo
    (EDGE (SOURCE match-foo)
        (INSTR (ASGN RESULT "alpha"))
        (TARGET END))

    // Step 6: Match case bar
    (EDGE
        (SOURCE match-bar)
        (INSTR (ASGN RESULT "beta"))
        (TARGET END))

    // Step 7: Default case
    (EDGE
        (SOURCE fallback)
        (INSTR (ASGN RESULT "unknown"))
        (TARGET END)))
`,
"foo-bar-input":
`
foo
`,
"reverse":
`
(GRAPH

    // Load Input and initialize accumulator
    (EDGE
        (SOURCE BEGIN)
        (INSTR
            (ASGN input PARAMS)
            (ASGN acc ()))
            
        (TARGET loop))

    // Loop condition: if input is ()
    (EDGE
        (SOURCE loop)
        (INSTR (TEST input ()))
        (TARGET done)) // go to done
    
    // Fallback: Process one element
    (EDGE
        (SOURCE loop)
        (INSTR
            (ASGN head (RUN stdlib ("first" input)))
            (ASGN tail (RUN stdlib ("rest" input)))
            (ASGN acc (RUN stdlib ("prepend" head acc)))
            (ASGN input tail))
            
        (TARGET loop)) // Continue looping

    // Final step: store reversed RESULT
    (EDGE
        (SOURCE done)
        (INSTR (ASGN RESULT acc))
        (TARGET END)))
`,
"reverse-input":
`
(1 2 3 4)
`,

"is-element-of":
`
(GRAPH

    // Load variables
    (EDGE
        (SOURCE BEGIN)
        (INSTR
            (ASGN element (RUN stdlib ("nth" "0" PARAMS)))
            (ASGN list    (RUN stdlib ("nth" "1" PARAMS))))
            
        (TARGET loop))
    
    // Loop condition: if input is ()
    (EDGE
        (SOURCE loop)
        (INSTR
            (TEST list ())
            (ASGN RESULT "false"))
            
        (TARGET END)) // done
    
    // Loop condition: if element is found
    (EDGE
        (SOURCE loop)
        (INSTR
            (TEST element (RUN stdlib ("first" list)))
            (ASGN RESULT "true"))
            
        (TARGET END)) // done
    
    // Fallback: process next element in list
    (EDGE
        (SOURCE loop)
        (INSTR (ASGN list (RUN stdlib ("rest" list))))
        (TARGET loop))) // Continue looping
`,
"is-element-of-input":
`
(2 (1 2 3 4))
`,

"factorial":
`
(GRAPH
    (COMPUTE
        (NAME fact)
        (GRAPH
            
            // Base case: if PARAMS == 0 -> return 1
            (EDGE
                (SOURCE BEGIN)
                (INSTR
                    (TEST PARAMS "0")
                    (ASGN RESULT "1"))
                    
                (TARGET END))

            // Recursive case
            (EDGE
                (SOURCE BEGIN)
                (INSTR
                    (ASGN n PARAMS)
                    (ASGN n1 (RUN stdlib ("sub" n "1")))
                    (ASGN rec (RUN fact n1))
                    (ASGN RESULT (RUN stdlib ("mul" n rec))))
                    
                (TARGET END))))

    // Top-level call
    (EDGE
        (SOURCE BEGIN)
        (INSTR (ASGN RESULT (RUN fact PARAMS)))
        (TARGET END)))
`,
"factorial-input":
`
5
`,

"fib":
`
(GRAPH
    (COMPUTE
        (NAME fib)
        (GRAPH
            
            // fib(0) -> 0
            (EDGE
                (SOURCE BEGIN)
                (INSTR
                    (TEST PARAMS "0")
                    (ASGN RESULT "0"))
                    
                (TARGET END))

            // fib(1) -> 1
            (EDGE
                (SOURCE BEGIN)
                (INSTR
                    (TEST PARAMS "1")
                    (ASGN RESULT "1"))
                    
                (TARGET END))

            // fib(n) -> fib(n - 1) + fib(n - 2)
            (EDGE
                (SOURCE BEGIN)
                (INSTR
                    (ASGN n1 "0")
                    (ASGN n2 "1")
                    (ASGN i "1"))
                    
                (TARGET loop))

            (EDGE
                (SOURCE loop)
                (INSTR
                    (TEST i PARAMS)
                    (ASGN RESULT n3))
                    
                (TARGET END))

            (EDGE
                (SOURCE loop)
                (INSTR
                    (ASGN n3 (RUN stdlib ("add" n1 n2)))
                    (ASGN n1 n2)
                    (ASGN n2 n3)
                    (ASGN i (RUN stdlib ("add" i "1"))))
                    
                (TARGET loop))))

    // Top-level call
    (EDGE
        (SOURCE BEGIN)
        (INSTR (ASGN RESULT (RUN fib PARAMS)))
        (TARGET END)))
`,
"fib-input":
`
120
`,

"bool":
`
/*
    Boolean Calculator
    
    supported operations on numbers: \`lt\`, \`leq\`, \`eq\`, \`geq\`, \`gt\`
    supported operations on booleans: \`and\`, \`or\`, \`not\`
*/

(GRAPH
    (COMPUTE
        (NAME bool)
        (GRAPH
            (EDGE
                (SOURCE BEGIN)
                (INSTR
                    (ASGN fun (RUN stdlib ("first" PARAMS)))
                    (ASGN arg (RUN stdlib ("rest" PARAMS))))
                    
                (TARGET calc))

            /*
                dispatcher
            */
            
            (EDGE
                (SOURCE calc)
                (INSTR
                    (TEST fun "and"))
                    
                (TARGET calcAnd))
            
            (EDGE
                (SOURCE calc)
                (INSTR
                    (TEST fun "or"))
                    
                (TARGET calcOr))
            
            (EDGE
                (SOURCE calc)
                (INSTR
                    (TEST fun "not"))
                    
                (TARGET calcNot))
            
            (EDGE
                (SOURCE calc)
                (INSTR
                    (TEST fun "lt"))
                    
                (TARGET calcLt))
            
            (EDGE
                (SOURCE calc)
                (INSTR
                    (TEST fun "leq"))
                    
                (TARGET calcLeq))
            
            (EDGE
                (SOURCE calc)
                (INSTR
                    (TEST fun "eq"))
                    
                (TARGET calcEq))
            
            (EDGE
                (SOURCE calc)
                (INSTR
                    (TEST fun "geq"))
                    
                (TARGET calcGeq))
            
            (EDGE
                (SOURCE calc)
                (INSTR
                    (TEST fun "gt"))
                    
                (TARGET calcGt))
            
            (EDGE
                (SOURCE calc)
                (INSTR
                    (ASGN RESULT "ERROR: Unsupported operation"))
                    
                (TARGET END))
            
            /*
                and
            */
            
            (EDGE
                (SOURCE calcAnd)
                (INSTR
                    (ASGN res "true"))
                    
                (TARGET andLoop))

            (EDGE
                (SOURCE andLoop)
                (INSTR
                    (TEST arg ())
                    (ASGN RESULT res))
                    
                (TARGET END))

            (EDGE
                (SOURCE andLoop)
                (INSTR
                    (TEST (RUN stdlib ("first" arg)) "true")
                    (ASGN arg (RUN stdlib ("rest" arg))))
                    
                (TARGET andLoop))

            (EDGE
                (SOURCE andLoop)
                (INSTR
                    (TEST (RUN stdlib ("first" arg)) "false")
                    (ASGN RESULT "false"))
                    
                (TARGET END))

            (EDGE
                (SOURCE andLoop)
                (INSTR
                    (ASGN
                        arg
                        (RUN
                            stdlib
                            ("prepend"
                                (RUN bool (RUN stdlib ("first" arg)))
                                (RUN stdlib ("rest" arg))))))
                                
                (TARGET andLoop))

            /*
                or
            */
            
            (EDGE
                (SOURCE calcOr)
                (INSTR
                    (ASGN res "false"))
                    
                (TARGET orLoop))

            (EDGE
                (SOURCE orLoop)
                (INSTR
                    (TEST arg ())
                    (ASGN RESULT res))
                    
                (TARGET END))
            
            (EDGE
                (SOURCE orLoop)
                (INSTR
                    (TEST (RUN stdlib ("first" arg)) "false")
                    (ASGN arg (RUN stdlib ("rest" arg))))
                    
                (TARGET orLoop))

            (EDGE
                (SOURCE orLoop)
                (INSTR
                    (TEST (RUN stdlib ("first" arg)) "true")
                    (ASGN RESULT "true"))
                    
                (TARGET END))

            (EDGE
                (SOURCE orLoop)
                (INSTR
                    (ASGN
                        arg
                        (RUN
                            stdlib
                            ("prepend"
                                (RUN bool (RUN stdlib ("first" arg)))
                                (RUN stdlib ("rest" arg))))))
                                
                (TARGET orLoop))

            /*
                not
            */
            
            (EDGE
                (SOURCE calcNot)
                (INSTR
                    (TEST arg ("false"))
                    (ASGN RESULT "true"))
                    
                (TARGET END))

            (EDGE
                (SOURCE calcNot)
                (INSTR
                    (TEST arg ("true"))
                    (ASGN RESULT "false"))
                    
                (TARGET END))

            (EDGE
                (SOURCE calcNot)
                (INSTR
                    (ASGN arg ((RUN bool (RUN stdlib ("first" arg))))))
                    
                (TARGET calcNot))
            
            /*
                leq
            */
                
            (EDGE
                (SOURCE calcLeq)
                (INSTR
                    (ASGN
                        RESULT
                        (RUN
                            stdlib
                            ("leq"
                                (RUN stdlib ("nth" 0 arg))
                                (RUN stdlib ("nth" 1 arg))))))
                (TARGET END))

            /*
                gt
            */
                
            (EDGE
                (SOURCE calcGt)
                (INSTR
                    (ASGN
                        RESULT
                        (RUN
                            bool
                            ("not"
                                ("leq"
                                    (RUN stdlib ("nth" 0 arg))
                                    (RUN stdlib ("nth" 1 arg)))))))
                                    
                (TARGET END))


            /*
                lt
            */
                
            (EDGE
                (SOURCE calcLt)
                (INSTR
                    (ASGN
                        RESULT
                        (RUN
                            bool
                            ("not"
                                ("leq"
                                    (RUN stdlib ("nth" 1 arg))
                                    (RUN stdlib ("nth" 0 arg)))))))
                                    
                (TARGET END))

            /*
                geq
            */
                
            (EDGE
                (SOURCE calcGeq)
                (INSTR
                    (ASGN
                        RESULT
                        (RUN
                            bool
                            ("leq"
                                (RUN stdlib ("nth" 1 arg))
                                (RUN stdlib ("nth" 0 arg))))))
                                
                (TARGET END))

            /*
                eq
            */
                
            (EDGE
                (SOURCE calcEq)
                (INSTR
                    (ASGN
                        RESULT
                        (RUN
                            bool
                            ("and"
                                ("leq"
                                    (RUN stdlib ("nth" 0 arg))
                                    (RUN stdlib ("nth" 1 arg)))
                                    
                                ("leq"
                                    (RUN stdlib ("nth" 1 arg))
                                    (RUN stdlib ("nth" 0 arg)))))))
                                    
                (TARGET END))))

    // Top-level call
    (EDGE
        (SOURCE BEGIN)
        (INSTR (ASGN RESULT (RUN bool PARAMS)))
        (TARGET END)))
`,
"bool-input":
`
(and
    (or
        false
        (gt 10 5)
        (not true))
        
    (eq 5 5))
`,

"num":
`
/*
    Numeric Calculator
    
    supported operations: \`add\`, \`sub\`, \`mul\`, \`div\`, \`pow\`
*/

(GRAPH
    (COMPUTE
        (NAME num)
        (GRAPH
            (EDGE
                (SOURCE BEGIN)
                (INSTR
                    (ASGN fun (RUN stdlib ("first" PARAMS)))
                    (ASGN arg (RUN stdlib ("rest" PARAMS))))
                    
                (TARGET calc))

            /*
                dispatcher
            */
            
            (EDGE
                (SOURCE calc)
                (INSTR
                    (TEST fun "add"))
                    
                (TARGET calcAdd))
            
            (EDGE
                (SOURCE calc)
                (INSTR
                    (TEST fun "sub"))
                    
                (TARGET calcSub))
            
            (EDGE
                (SOURCE calc)
                (INSTR
                    (TEST fun "mul"))
                    
                (TARGET calcMul))
            
            (EDGE
                (SOURCE calc)
                (INSTR
                    (TEST fun "div"))
                    
                (TARGET calcDiv))
            
            (EDGE
                (SOURCE calc)
                (INSTR
                    (TEST fun "pow"))
                    
                (TARGET calcPow))
            
            (EDGE
                (SOURCE calc)
                (INSTR
                    (ASGN RESULT "ERROR: Unsupported operation"))
                    
                (TARGET END))
            
            /*
                "add"
            */
            
            (EDGE
                (SOURCE calcAdd)
                (INSTR
                    (ASGN res "0"))
                    
                (TARGET addLoop))

            (EDGE
                (SOURCE addLoop)
                (INSTR
                    (TEST arg ())
                    (ASGN RESULT res))
                    
                (TARGET END))

            (EDGE
                (SOURCE addLoop)
                (INSTR
                    (ASGN tmp (RUN stdlib ("first" arg)))
                    (TEST (RUN stdlib ("isatom" tmp)) "true")
                    (ASGN res (RUN stdlib ("add" res tmp)))
                    (ASGN arg (RUN stdlib ("rest" arg))))
                    
                (TARGET addLoop))

            (EDGE
                (SOURCE addLoop)
                (INSTR
                    (ASGN tmp (RUN stdlib ("first" arg)))
                    (ASGN res (RUN stdlib ("add" res (RUN num tmp))))
                    (ASGN arg (RUN stdlib ("rest" arg))))
                    
                (TARGET addLoop))
            
            /*
                "sub"
            */
            
            (EDGE
                (SOURCE calcSub)
                (INSTR
                    (ASGN res (RUN stdlib ("first" arg)))
                    (ASGN arg (RUN stdlib ("rest" arg))))
                    
                (TARGET subLoop))

            (EDGE
                (SOURCE subLoop)
                (INSTR
                    (TEST arg ())
                    (ASGN RESULT res))
                    
                (TARGET END))

            (EDGE
                (SOURCE subLoop)
                (INSTR
                    (ASGN tmp (RUN stdlib ("first" arg)))
                    (TEST (RUN stdlib ("isatom" tmp)) "true")
                    (ASGN res (RUN stdlib ("sub" res tmp)))
                    (ASGN arg (RUN stdlib ("rest" arg))))
                    
                (TARGET subLoop))

            (EDGE
                (SOURCE subLoop)
                (INSTR
                    (ASGN tmp (RUN stdlib ("first" arg)))
                    (ASGN res (RUN stdlib ("sub" res (RUN num tmp))))
                    (ASGN arg (RUN stdlib ("rest" arg))))
                    
                (TARGET subLoop))
            
            /*
                "mul"
            */
            
            (EDGE
                (SOURCE calcMul)
                (INSTR
                    (ASGN res "1"))
                    
                (TARGET mulLoop))

            (EDGE
                (SOURCE mulLoop)
                (INSTR
                    (TEST arg ())
                    (ASGN RESULT res))
                    
                (TARGET END))

            (EDGE
                (SOURCE mulLoop)
                (INSTR
                    (ASGN tmp (RUN stdlib ("first" arg)))
                    (TEST (RUN stdlib ("isatom" tmp)) "true")
                    (ASGN res (RUN stdlib ("mul" res tmp)))
                    (ASGN arg (RUN stdlib ("rest" arg))))
                    
                (TARGET mulLoop))

            (EDGE
                (SOURCE mulLoop)
                (INSTR
                    (ASGN tmp (RUN stdlib ("first" arg)))
                    (ASGN res (RUN stdlib ("mul" res (RUN num tmp))))
                    (ASGN arg (RUN stdlib ("rest" arg))))
                    
                (TARGET mulLoop))
            
            /*
                "div"
            */
            
            (EDGE
                (SOURCE calcDiv)
                (INSTR
                    (ASGN res (RUN stdlib ("first" arg)))
                    (ASGN arg (RUN stdlib ("rest" arg))))
                    
                (TARGET divLoop))

            (EDGE
                (SOURCE divLoop)
                (INSTR
                    (TEST arg ())
                    (ASGN RESULT res))
                    
                (TARGET END))

            (EDGE
                (SOURCE divLoop)
                (INSTR
                    (ASGN tmp (RUN stdlib ("first" arg)))
                    (TEST (RUN stdlib ("isatom" tmp)) "true")
                    (ASGN res (RUN stdlib ("div" res tmp)))
                    (ASGN arg (RUN stdlib ("rest" arg))))
                    
                (TARGET divLoop))

            (EDGE
                (SOURCE divLoop)
                (INSTR
                    (ASGN tmp (RUN stdlib ("first" arg)))
                    (ASGN res (RUN stdlib ("div" res (RUN num tmp))))
                    (ASGN arg (RUN stdlib ("rest" arg))))
                    
                (TARGET divLoop))

            /*
                "pow"
            */
            
            (EDGE
                (SOURCE calcPow)
                (INSTR
                    (ASGN res (RUN stdlib ("first" arg)))
                    (ASGN arg (RUN stdlib ("rest" arg)))
                    (TEST (RUN stdlib ("isatom" res)) "true"))
                    
                (TARGET powLoop))

            (EDGE
                (SOURCE calcPow)
                (INSTR
                    (ASGN res (RUN num res)))
                    
                (TARGET powLoop))

            (EDGE
                (SOURCE powLoop)
                (INSTR
                    (TEST arg ())
                    (ASGN RESULT res))
                    
                (TARGET END))

            (EDGE
                (SOURCE powLoop)
                (INSTR
                    (ASGN tmp (RUN stdlib ("first" arg)))
                    (TEST (RUN stdlib ("isatom" tmp)) "true")
                    (ASGN res (RUN stdlib ("pow" res tmp)))
                    (ASGN arg (RUN stdlib ("rest" arg))))
                    
                (TARGET powLoop))

            (EDGE
                (SOURCE powLoop)
                (INSTR
                    (ASGN tmp (RUN stdlib ("first" arg)))
                    (ASGN res (RUN stdlib ("pow" res (RUN num tmp))))
                    (ASGN arg (RUN stdlib ("rest" arg))))
                    
                (TARGET powLoop))))

    // Top-level call
    (EDGE
        (SOURCE BEGIN)
        (INSTR (ASGN RESULT (RUN num PARAMS)))
        (TARGET END)))
`,
"num-input":
`
(pow
    (add
        2
        (mul
            3
            (div
                8
                4))

        (sub
            4
            -3))

    2)
`
}

