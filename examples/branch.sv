
///
branching choice
///

(
    REWRITE
    
    /if function/
    (
        RULE
        (VAR A B)
        (READ (EXP (\iff \true \A \B)))
        (WRITE (EXP \A))
    )
    (
        RULE
        (VAR A B)
        (READ (EXP (\iff \false \A \B)))
        (WRITE (EXP \B))
    )
    
    /equality predicate/
    (
        RULE
        (VAR A)
        (READ (EXP (\eq \A \A)))
        (WRITE (EXP \true))
    )
    (
        RULE
        (VAR A B)
        (READ (EXP (\eq \A \B)))
        (WRITE (EXP \false))
    )
    
    ///
    Boolean algebra
    ///
    
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
)

