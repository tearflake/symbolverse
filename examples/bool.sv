///
Boolean evaluator
///

(
    REWRITE
        
    /truth table for `not` operator/
    (RULE (READ (EXP (\not \true ))) (WRITE (EXP \false)))
    (RULE (READ (EXP (\not \false))) (WRITE (EXP \true )))
    
    /truth table for `and` operator/
    (RULE (READ (EXP (\and \true  \true ))) (WRITE (EXP \true )))
    (RULE (READ (EXP (\and \true  \false))) (WRITE (EXP \false)))
    (RULE (READ (EXP (\and \false \true ))) (WRITE (EXP \false)))
    (RULE (READ (EXP (\and \false \false))) (WRITE (EXP \false)))
    
    /truth table for `or` operator/
    (RULE (READ (EXP (\or \true  \true ))) (WRITE (EXP \true )))
    (RULE (READ (EXP (\or \true  \false))) (WRITE (EXP \true )))
    (RULE (READ (EXP (\or \false \true ))) (WRITE (EXP \true )))
    (RULE (READ (EXP (\or \false \false))) (WRITE (EXP \false)))
    
    /truth table for `impl` operator/
    (RULE (READ (EXP (\impl \true  \true ))) (WRITE (EXP \true )))
    (RULE (READ (EXP (\impl \true  \false))) (WRITE (EXP \false)))
    (RULE (READ (EXP (\impl \false \true ))) (WRITE (EXP \true )))
    (RULE (READ (EXP (\impl \false \false))) (WRITE (EXP \true )))
    
    /truth table for `eq` operator/
    (RULE (READ (EXP (\eq \true  \true ))) (WRITE (EXP \true )))
    (RULE (READ (EXP (\eq \true  \false))) (WRITE (EXP \false)))
    (RULE (READ (EXP (\eq \false \true ))) (WRITE (EXP \false)))
    (RULE (READ (EXP (\eq \false \false))) (WRITE (EXP \true )))
)

