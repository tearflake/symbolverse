///
Boolean logic to SKI compiler
///

(
    REWRITE
    
    /workflow/
    (RULE (VAR A) (READ (EXP (\bool \A))) (WRITE (EXP (parseBool A))))
    (RULE (VAR A) (READ (EXP (parsedBool A))) (WRITE (EXP (compileToSKI A))))
    (RULE (VAR A) (READ (EXP (compiledToSKI A))) (WRITE (EXP \A)))

    /parser/
    (
        REWRITE
        
        (RULE (VAR A) (READ (EXP (\parseBool \A))) (WRITE (EXP (parsingBool\ A))))
        
        (RULE (VAR x) (READ (EXP x)) (WRITE (EXP (token\ x\))))
        
        (
            RULE
            (READ (EXP (token\ true\)))
            (WRITE (EXP (typeOf\ true\ bool\)))
        )
        (
            RULE
            (READ (EXP (token\ false\)))
            (WRITE (EXP (typeOf\ false\ bool\)))
        )
        (
            RULE
            (VAR A)
            (READ (EXP ((token\ not\) (typeOf\ A\ bool\))))
            (WRITE (EXP (typeOf\ (not\ A\) bool\)))
        )
        (
            RULE
            (VAR A B)
            (READ (EXP ((token\ or\) (typeOf\ A\ bool\) (typeOf\ B\ bool\))))
            (WRITE (EXP (typeOf\ (or\ A\ B\) bool\)))
        )
        (
            RULE
            (VAR A B)
            (READ (EXP ((token\ and\) (typeOf\ A\ bool\) (typeOf\ B\ bool\))))
            (WRITE (EXP (typeOf\ (and\ A\ B\) bool\)))
        )
        
        (RULE (VAR A) (READ (EXP (parsingBool\ (typeOf\ A\ bool\)))) (WRITE (EXP (\parsedBool \A))))
        (RULE (VAR A) (READ (EXP (parsingBool\ A\))) (WRITE (EXP \\"bool syntax error")))
    )
    
    /compiler/
    (
        REWRITE

        (RULE (VAR A) (READ (EXP (\compileToSKI \A))) (WRITE (EXP (compilingToSKI A))))

        (RULE (READ (EXP true)) (WRITE (EXP K)))
        (RULE (READ (EXP false)) (WRITE (EXP (S K))))
        
        (RULE (VAR A) (READ (EXP (not A))) (WRITE (EXP ((A false) true))))
        (RULE (VAR A B) (READ (EXP (or A B))) (WRITE (EXP ((A true) B))))
        (RULE (VAR A B) (READ (EXP (and A B))) (WRITE (EXP ((A B) false))))
        
        (RULE (VAR A) (READ (EXP (compilingToSKI A))) (WRITE (EXP (\compiledToSKI \A))))
    )
)

