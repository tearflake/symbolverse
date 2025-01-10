///
Boolean logic to SKI compiler

Boolean logic is a branch of mathematics and logic that deals with true or false values, often
represented as 1 (true) and 0 (false). It uses basic operators such as AND (conjunction), OR
(disjunction), and NOT (negation) to manipulate these values. More complex operations, like XOR
(exclusive OR) and NAND, are derived from these basics. Boolean logic is foundational in digital
circuits, computer programming, and search algorithms, as it provides the rules for decision-making
and data processing based on binary conditions.
///

(
    REWRITE
    
    /workflow/
    (RULE (VAR A) (READ (EXP (\boolToSKI \A))) (WRITE (EXP (parseBool A))))
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
            (WRITE (EXP (typed\ true\ bool\)))
        )
        (
            RULE
            (READ (EXP (token\ false\)))
            (WRITE (EXP (typed\ false\ bool\)))
        )
        (
            RULE
            (VAR A)
            (READ (EXP ((token\ not\) (typed\ A\ bool\))))
            (WRITE (EXP (typed\ (not\ A\) bool\)))
        )
        (
            RULE
            (VAR A B)
            (READ (EXP ((token\ or\) (typed\ A\ bool\) (typed\ B\ bool\))))
            (WRITE (EXP (typed\ (or\ A\ B\) bool\)))
        )
        (
            RULE
            (VAR A B)
            (READ (EXP ((token\ and\) (typed\ A\ bool\) (typed\ B\ bool\))))
            (WRITE (EXP (typed\ (and\ A\ B\) bool\)))
        )
        
        (RULE (VAR A) (READ (EXP (parsingBool\ (typed\ A\ bool\)))) (WRITE (EXP (\parsedBool \A))))
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

