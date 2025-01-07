///
Lambda calculus to SKI compiler
///

(
    REWRITE
    
    /workflow/
    (RULE (VAR A) (READ (EXP (\lc \A))) (WRITE (EXP (parseLc A))))
    (RULE (VAR A) (READ (EXP (parsedLc A))) (WRITE (EXP (compileToSKI A))))
    (RULE (VAR A) (READ (EXP (compiledToSKI A))) (WRITE (EXP \A)))

    /parser/
    (
        REWRITE
        
        (RULE (VAR A) (READ (EXP (\parseLc \A))) (WRITE (EXP (parsingLc\ A))))

        (RULE (READ (EXP lmbd)) (WRITE (EXP (token\ lmbd\))))
        
        (RULE (VAR x) (READ (EXP x)) (WRITE (EXP (typeOf\ x\ (var\ term\)))))
        (
            RULE
            (VAR x M ANY)
            (READ (EXP ((token\ lmbd\) (typeOf\ x\ (var\ term\)) (typeOf\ M\ (ANY\ term\)))))
            (WRITE (EXP (typeOf\ (lmbd\ x\ M\) (abs\ term\))))
        )
        (
            RULE
            (VAR M N ANY1 ANY2)
            (READ (EXP ((typeOf\ M\ (ANY1\ term\)) (typeOf\ N\ (ANY2\ term\)))))
            (WRITE (EXP (typeOf\ (M\ N\) (app\ term\))))
        )
        
        (RULE (VAR A ANY) (READ (EXP (parsingLc\ (typeOf\ A\ (ANY\ term\))))) (WRITE (EXP (\parsedLc \A))))
        (RULE (VAR A) (READ (EXP (parsingLc\ A\))) (WRITE (EXP \\"lambda calculus syntax error")))
    )
    
    /compiler/
    (
        REWRITE
        
        (RULE (VAR A) (READ (EXP (\compileToSKI \A))) (WRITE (EXP (compilingToSKI A))))
        
        (RULE (VAR x) (READ (EXP (lmbd x x))) (WRITE (EXP I)))
        (RULE (VAR x E1 E2) (READ (EXP (lmbd x (E1 E2)))) (WRITE (EXP ((S (lmbd x E1)) (lmbd x E2)))))
        (RULE (VAR x y) (READ (EXP (lmbd x y))) (WRITE (EXP (K y))))
        
        (RULE (VAR A) (READ (EXP (compilingToSKI A))) (WRITE (EXP (\compiledToSKI \A))))
    )
)

