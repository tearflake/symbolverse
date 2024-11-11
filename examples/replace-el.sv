///
replace element in list
///

(
    REWRITE
    
    (
        RULE
        (VAR A B C D)
        (READ  (EXP (\replace \A \B (\A \D))))
        (WRITE (EXP (\B (\replace \A \B \D))))
    )
    
    (
        RULE
        (VAR A B C D)
        (READ  (EXP (\replace \A \B (\C \D))))
        (WRITE (EXP (\C (\replace \A \B \D))))
    )
    
    (
        RULE
        (VAR A B)
        (READ  (EXP (\replace \A \B ())))
        (WRITE (EXP ()               ))
    )
)

