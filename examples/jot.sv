///
Jot framework to SKI compiler
///

(
    REWRITE
    
    /workflow/
    (RULE (VAR A) (READ (EXP (\jot \A))) (WRITE (EXP (parseJot A))))
    (RULE (VAR A) (READ (EXP (parsedJot A))) (WRITE (EXP (compileToSKI A))))
    (RULE (VAR A) (READ (EXP (compiledToSKI A))) (WRITE (EXP \A)))

    (
        REWRITE /parser/
        
        (RULE (READ (EXP \typeOf)) (WRITE (EXP \_typeOf)))
        (RULE (VAR A) (READ (EXP (\parseJot \A))) (WRITE (EXP (parsingJot A))))
        
        (
            RULE
            (READ (EXP NIL))
            (WRITE (EXP (typeOf NIL\ jot)))
        )
        (
            RULE
            (VAR A)
            (READ (EXP ((typeOf A jot) 0)))
            (WRITE (EXP (typeOf (A 0\) jot)))
        )
        (
            RULE
            (VAR A)
            (READ (EXP ((typeOf A jot) 1)))
            (WRITE (EXP (typeOf (A 1\) jot)))
        )
        
        (RULE (VAR A) (READ (EXP (parsingJot (typeOf A jot)))) (WRITE (EXP (\parsedJot \\A))))
        (RULE (VAR A) (READ (EXP (parsingJot A))) (WRITE (EXP \\"jot syntax error")))
    )
    
    (
        REWRITE /compiler/

        (RULE (VAR A) (READ (EXP (\compileToSKI \A))) (WRITE (EXP (compilingToSKI A))))

        (RULE (VAR W) (READ (EXP (W 0))) (WRITE (EXP ((W S) K))))
        (RULE (VAR W) (READ (EXP (W 1))) (WRITE (EXP (S (K W)))))
        (RULE (READ (EXP NIL)) (WRITE (EXP I)))

        (RULE (VAR A) (READ (EXP (compilingToSKI A))) (WRITE (EXP (\compiledToSKI \A))))
    )
)

