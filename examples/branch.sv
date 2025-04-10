
///
branching choice
///

(
    REWRITE
    
    /if function/
    (
        RULE
        (VAR A B)
        (READ (\iff \true \A \B))
        (WRITE \A)
    )
    (
        RULE
        (VAR A B)
        (READ (\iff \false \A \B))
        (WRITE \B)
    )
    
    /equality predicate/
    (
        RULE
        (VAR A)
        (READ (\eq \A \A))
        (WRITE \true)
    )
    (
        RULE
        (VAR A B)
        (READ (\eq \A \B))
        (WRITE \false)
    )
    
    ///
    Boolean algebra
    ///
    
    /truth table for `not` operator/
    (RULE (READ (\not \true )) (WRITE \false))
    (RULE (READ (\not \false)) (WRITE \true ))
    
    /truth table for `and` operator/
    (RULE (READ (\and \true  \true )) (WRITE \true ))
    (RULE (READ (\and \true  \false)) (WRITE \false))
    (RULE (READ (\and \false \true )) (WRITE \false))
    (RULE (READ (\and \false \false)) (WRITE \false))
    
    /truth table for `or` operator/
    (RULE (READ (\or \true  \true )) (WRITE \true ))
    (RULE (READ (\or \true  \false)) (WRITE \true ))
    (RULE (READ (\or \false \true )) (WRITE \true ))
    (RULE (READ (\or \false \false)) (WRITE \false))
)

