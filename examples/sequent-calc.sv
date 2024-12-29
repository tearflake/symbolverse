///
formula validator using sequent calculus (exponential time complexity)
///

(
    REWRITE

    ///
    entry point
    ///
    
    (
        RULE
        (VAR Formula)
        (
            READ
            (EXP (\isValid \Formula))
        )
        (
            WRITE
            (
                EXP
                (
                    cartLoop
                    (
                        (turnstyleStack () () (cons Formula ()) ())
                        ()
                    )
                )
            )
        )
    )

    ///
    eliminating eq, impl
    ///
    
    /eq/
    (
        RULE
        (VAR A B)
        (
            READ
            (EXP (eq A B))
        )
        (
            WRITE
            (EXP (and (impl A B) (impl B A)))
        )
    )
    
    /impl/
    (
        RULE
        (VAR A B)
        (
            READ
            (EXP (impl A B))
        )
        (
            WRITE
            (EXP (or (not A) B))
        )
    )
    
    ///
    right side stack operations
    ///
    
    /not/
    (
        RULE
        (VAR LS L RS R A B Tail)
        (
            READ
            (EXP ((turnstyleStack LS L (cons (not A) RS) R) Tail))
        )
        (
            WRITE
            (EXP ((turnstyleStack (cons A LS) L RS R) Tail))
        )
    )
    
    /and/
    (
        RULE
        (VAR LS L RS R A B Tail)
        (
            READ
            (EXP ((turnstyleStack LS L (cons (and A B) RS) R) Tail))
        )
        (
            WRITE
            (EXP (append ((turnstyleStack LS L (cons A RS) R) ((turnstyleStack LS L (cons B RS) R) ())) Tail))
        )
    )
    
    /or/
    (
        RULE
        (VAR LS L RS R A B Tail)
        (
            READ
            (EXP ((turnstyleStack LS L (cons (or A B) RS) R) Tail))
        )
        (
            WRITE
            (EXP ((turnstyleStack LS L (cons A (cons B RS)) R) Tail))
        )
    )
    
    /stack pop/
    (
        RULE
        (VAR LS L RS R A B Tail)
        (
            READ
            (EXP ((turnstyleStack LS L (cons A RS) R) Tail))
        )
        (
            WRITE
            (EXP ((turnstyleStack LS L RS (A R)) Tail))
        )
    )

    ///
    left side stack operations
    ///
    
    /not/
    (
        RULE
        (VAR LS L RS R A B Tail)
        (
            READ
            (EXP ((turnstyleStack (cons (not A) LS) L RS R) Tail))
        )
        (
            WRITE
            (EXP ((turnstyleStack LS L (cons A RS) R) Tail))
        )
    )
    
    /or/
    (
        RULE
        (VAR LS L RS R A B Tail)
        (
            READ
            (EXP ((turnstyleStack (cons (or A B) LS) L RS R) Tail))
        )
        (
            WRITE
            (EXP (append ((turnstyleStack (cons A LS) L RS R) ((turnstyleStack (cons B LS) L RS R) ())) Tail))
        )
    )
    
    /and/
    (
        RULE
        (VAR LS L RS R A B Tail)
        (
            READ
            (EXP ((turnstyleStack (cons (and A B) LS) L RS R) Tail))
        )
        (
            WRITE
            (EXP ((turnstyleStack (cons A (cons B LS)) L RS R) Tail))
        )
    )
    
    /stack pop/
    
    (
        RULE
        (VAR LS L RS R A B Tail)
        (
            READ
            (EXP ((turnstyleStack (cons A LS) L RS R) Tail))
        )
        (
            WRITE
            (EXP ((turnstyleStack LS (A L) RS R) Tail))
        )
    )
    
    ///
    converting to turnstyle
    ///
    
    (
        RULE
        (VAR L R)
        (
            READ
            (EXP (turnstyleStack () L () R))
        )
        (
            WRITE
            (EXP (turnstyle L R))
        )
    )
    
    ///
    testing for equal atoms on both sides of turnstyle in each sequent
    ///
    
    /cartesian loop/
    
    (
        RULE
        (VAR L R Tail)
        (
            READ
            (EXP (cartLoop ((turnstyle L R) Tail)))
        )
        (
            WRITE
            (EXP (and (cLhsLoop L R) (cartLoop Tail)))
        )
    )
    
    (
        RULE
        (
            READ
            (EXP (cartLoop ()))
        )
        (
            WRITE
            (EXP \true)
        )
    )
    
    /left hand side loop/

    (
        RULE
        (VAR L R Tail)
        (
            READ
            (EXP (cLhsLoop (L Tail) R))
        )
        (
            WRITE
            (EXP (or (cRhsLoop L R) (cLhsLoop Tail R)))
        )
    )
    
    (
        RULE
        (VAR R)
        (
            READ
            (EXP (cLhsLoop () R))
        )
        (
            WRITE
            (EXP \false)
        )
    )
    
    /right hand side loop/

    (
        RULE
        (VAR L R Tail)
        (
            READ
            (EXP (cRhsLoop L (R Tail)))
        )
        (
            WRITE
            (EXP (or (isEqual L R) (cRhsLoop L Tail)))
        )
    )
    
    (
        RULE
        (VAR L)
        (
            READ
            (EXP (cRhsLoop L ()))
        )
        (
            WRITE
            (EXP \false)
        )
    )
    
    ///
    utility functions
    ///
    
    /append function/

    (RULE (VAR A B C) (READ (EXP (append (A B) C))) (WRITE (EXP (A (append B C)))))
    (RULE (VAR A    ) (READ (EXP (append () A)   )) (WRITE (EXP A               )))
    
    /atom comparison/

    (RULE (VAR A  ) (READ (EXP (isEqual A A))) (WRITE (EXP \true )))
    (RULE (VAR A B) (READ (EXP (isEqual A B))) (WRITE (EXP \false)))
    
    /boolean connectives/

    (RULE (READ (EXP (and \true  \true ))) (WRITE (EXP \true )))
    (RULE (READ (EXP (and \true  \false))) (WRITE (EXP \false)))
    (RULE (READ (EXP (and \false \true ))) (WRITE (EXP \false)))
    (RULE (READ (EXP (and \false \false))) (WRITE (EXP \false)))
    
    (RULE (READ (EXP (or \true  \true ))) (WRITE (EXP \true )))
    (RULE (READ (EXP (or \true  \false))) (WRITE (EXP \true )))
    (RULE (READ (EXP (or \false \true ))) (WRITE (EXP \true )))
    (RULE (READ (EXP (or \false \false))) (WRITE (EXP \false)))

)

