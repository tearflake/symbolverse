
///
# LC to SKI compiler

Lambda calculus (LC) is a formal system in mathematical logic and computer science for expressing
computation based on function abstraction and application. It uses variable binding and
substitution to define functions and apply them to arguments. The core components are variables,
function definitions (lambda abstractions, e.g., λx.x), and function applications (e.g., (λx.x)y).
Lambda calculus serves as a foundation for functional programming languages and provides a
framework for studying computation, recursion, and the equivalence of algorithms. Its simplicity
and expressiveness make it a cornerstone of theoretical computer science.
///

(
    REWRITE
    
    /workflow/
    (RULE (VAR A) (READ (EXP (\lcToSki \A))) (WRITE (EXP (parseLc A))))
    (RULE (VAR A) (READ (EXP (parsedLc A))) (WRITE (EXP (compileToSki A))))
    (RULE (VAR A) (READ (EXP (compiledToSki A))) (WRITE (EXP \A)))

    /parser/
    (
        REWRITE
        
        (RULE (VAR A) (READ (EXP (\parseLc \A))) (WRITE (EXP (parsingLc\ A))))
        
        /tokenizing/
        (RULE (READ (EXP lmbd)) (WRITE (EXP lmbd\)))
        
        /parsing/
        (RULE (VAR x) (READ (EXP x)) (WRITE (EXP (typed\ x\ var\))))
        (
            RULE
            (VAR x M ANY)
            (READ (EXP (lmbd\ (typed\ x\ var\) (typed\ M\ ANY\))))
            (WRITE (EXP (typed\ (lmbd\ x\ M\) abs\)))
        )
        (
            RULE
            (VAR M N ANY1 ANY2)
            (READ (EXP ((typed\ M\ ANY1\) (typed\ N\ ANY2\))))
            (WRITE (EXP (typed\ (M\ N\) app\)))
        )
        
        (RULE (VAR A ANY) (READ (EXP (parsingLc\ (typed\ A\ ANY\)))) (WRITE (EXP (\parsedLc \A))))
        /(RULE (VAR A) (READ (EXP (parsingLc\ A\))) (WRITE (EXP \\"lambda calculus syntax error")))/
    )
    
    /compiler/
    (
        REWRITE
        
        (RULE (VAR A) (READ (EXP (\compileToSki \A))) (WRITE (EXP (compilingToSki A))))
        
        (RULE (VAR x) (READ (EXP (lmbd x x))) (WRITE (EXP I)))
        (RULE (VAR x E1 E2) (READ (EXP (lmbd x (E1 E2)))) (WRITE (EXP ((S (lmbd x E1)) (lmbd x E2)))))
        (RULE (VAR x y) (READ (EXP (lmbd x y))) (WRITE (EXP (K y))))
        
        (RULE (VAR A) (READ (EXP (compilingToSki A))) (WRITE (EXP (\compiledToSki \A))))
    )
)

