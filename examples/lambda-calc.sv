///
Lambda calculus to SKI compiler
///

(
    REWRITE
    (RULE (VAR A) (READ (EXP (\lc \A))) (WRITE (EXP (parseLc A))))
    (RULE (VAR A) (READ (EXP (parsedLc A))) (WRITE (EXP (compileToSKI A))))
    (RULE (VAR A) (READ (EXP (compiledToSKI A))) (WRITE (EXP \A)))

    (
        REWRITE /parser/
        
        (RULE (READ (EXP \typeOf)) (WRITE (EXP \_typeOf)))
        (RULE (VAR A) (READ (EXP (\parseLc \A))) (WRITE (EXP (parsingLc A))))

        (RULE (READ (EXP a)) (WRITE (EXP (typeOf a\ (var term)))))
        (RULE (READ (EXP b)) (WRITE (EXP (typeOf b\ (var term)))))
        (RULE (READ (EXP c)) (WRITE (EXP (typeOf c\ (var term)))))
        (RULE (READ (EXP d)) (WRITE (EXP (typeOf d\ (var term)))))
        (RULE (READ (EXP e)) (WRITE (EXP (typeOf e\ (var term)))))
        (RULE (READ (EXP f)) (WRITE (EXP (typeOf f\ (var term)))))
        (RULE (READ (EXP g)) (WRITE (EXP (typeOf g\ (var term)))))
        (RULE (READ (EXP h)) (WRITE (EXP (typeOf h\ (var term)))))
        (RULE (READ (EXP i)) (WRITE (EXP (typeOf i\ (var term)))))
        (RULE (READ (EXP j)) (WRITE (EXP (typeOf j\ (var term)))))
        (RULE (READ (EXP k)) (WRITE (EXP (typeOf k\ (var term)))))
        (RULE (READ (EXP l)) (WRITE (EXP (typeOf l\ (var term)))))
        (RULE (READ (EXP m)) (WRITE (EXP (typeOf m\ (var term)))))
        (RULE (READ (EXP n)) (WRITE (EXP (typeOf n\ (var term)))))
        (RULE (READ (EXP o)) (WRITE (EXP (typeOf o\ (var term)))))
        (RULE (READ (EXP p)) (WRITE (EXP (typeOf p\ (var term)))))
        (RULE (READ (EXP q)) (WRITE (EXP (typeOf q\ (var term)))))
        (RULE (READ (EXP r)) (WRITE (EXP (typeOf r\ (var term)))))
        (RULE (READ (EXP s)) (WRITE (EXP (typeOf s\ (var term)))))
        (RULE (READ (EXP t)) (WRITE (EXP (typeOf t\ (var term)))))
        (RULE (READ (EXP u)) (WRITE (EXP (typeOf u\ (var term)))))
        (RULE (READ (EXP v)) (WRITE (EXP (typeOf v\ (var term)))))
        (RULE (READ (EXP w)) (WRITE (EXP (typeOf w\ (var term)))))
        (RULE (READ (EXP x)) (WRITE (EXP (typeOf x\ (var term)))))
        (RULE (READ (EXP y)) (WRITE (EXP (typeOf y\ (var term)))))
        (RULE (READ (EXP z)) (WRITE (EXP (typeOf z\ (var term)))))
        (
            RULE
            (VAR X M ANY)
            (READ (EXP (lmbd (typeOf X (var term)) (typeOf M (ANY term)))))
            (WRITE (EXP (typeOf (lmbd\ X M) (abs term))))
        )
        (
            RULE
            (VAR M N ANY1 ANY2)
            (READ (EXP ((typeOf M (ANY1 term)) (typeOf N (ANY2 term)))))
            (WRITE (EXP (typeOf (M N) (app term))))
        )
        
        (RULE (VAR A B) (READ (EXP (parsingLc (typeOf A B)))) (WRITE (EXP (\parsedLc \\A))))
        (RULE (VAR A) (READ (EXP (parsingLc A))) (WRITE (EXP \\"lambda calculus syntax error")))
    )
    
    (
        REWRITE
        
        (RULE (VAR A) (READ (EXP (\compileToSKI \A))) (WRITE (EXP (compilingToSKI A))))
        
        (RULE (VAR x) (READ (EXP (lmbd x x))) (WRITE (EXP I)))
        (RULE (VAR x E1 E2) (READ (EXP (lmbd x (E1 E2)))) (WRITE (EXP ((S (lmbd x E1)) (lmbd x E2)))))
        (RULE (VAR x y) (READ (EXP (lmbd x y))) (WRITE (EXP (K y))))
        
        (RULE (VAR A) (READ (EXP (compilingToSKI A))) (WRITE (EXP (\compiledToSKI \A))))
    )
)

