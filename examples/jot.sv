///
Jot framework to SKI compiler

The Jot computational framework is an esoteric minimalist programming language designed to encode
and execute programs using only binary sequences (0s and 1s). Based on the SKI combinatory logic,
Jot translates these sequences into SKI expressions, eliminating the need for variables or explicit
syntax. Each binary sequence represents a unique program or function, and computation is performed
through application of these encoded combinators. Its extreme simplicity makes Jot a theoretical
tool for exploring the foundations of computation and the relationship between binary encoding and
functional programming.
///

(
    REWRITE
    
    /workflow/
    (RULE (VAR A) (READ (EXP (\jotToSKI \A))) (WRITE (EXP (parseJot A))))
    (RULE (VAR A) (READ (EXP (parsedJot A))) (WRITE (EXP (compileToSKI A))))
    (RULE (VAR A) (READ (EXP (compiledToSKI A))) (WRITE (EXP \A)))
    
    /parser/
    (
        REWRITE
        
        (RULE (VAR A) (READ (EXP (\parseJot \A))) (WRITE (EXP (parsingJot\ A))))
        
        (RULE (VAR x) (READ (EXP x)) (WRITE (EXP (token\ x\))))
        
        (
            RULE
            (READ (EXP (token\ NIL\)))
            (WRITE (EXP (typed\ NIL\ jot\)))
        )
        (
            RULE
            (VAR A)
            (READ (EXP ((typed\ A\ jot\) (token\ 0\))))
            (WRITE (EXP (typed\ (A\ 0\) jot\)))
        )
        (
            RULE
            (VAR A)
            (READ (EXP ((typed\ A\ jot\) (token\ 1\))))
            (WRITE (EXP (typed\ (A\ 1\) jot\)))
        )
        
        (RULE (VAR A) (READ (EXP (parsingJot\ (typed\ A\ jot\)))) (WRITE (EXP (\parsedJot \A))))
        (RULE (VAR A) (READ (EXP (parsingJot\ A\))) (WRITE (EXP \\"jot syntax error")))
    )
    
    /compiler/
    (
        REWRITE

        (RULE (VAR A) (READ (EXP (\compileToSKI \A))) (WRITE (EXP (compilingToSKI A))))

        (RULE (VAR W) (READ (EXP (W 0))) (WRITE (EXP ((W S) K))))
        (RULE (VAR W) (READ (EXP (W 1))) (WRITE (EXP (S (K W)))))
        (RULE (READ (EXP NIL)) (WRITE (EXP I)))

        (RULE (VAR A) (READ (EXP (compilingToSKI A))) (WRITE (EXP (\compiledToSKI \A))))
    )
)

