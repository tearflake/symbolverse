///
remove element from list
///

(
    REWRITE
    
    (
        RULE
        (VAR A B C)
        (READ  (EXP (\remove \A (\A \C))))
        (WRITE (EXP (\remove \A \C)    ))
    )
    
    (
        RULE
        (VAR A B C D)
        (READ  (EXP (\remove \A (\B \C))))
        (WRITE (EXP (B (\remove \A \C))))
    )
    
    (
        RULE
        (VAR A)
        (READ  (EXP (\remove \A ())))
        (WRITE (EXP ()             ))
    )
)

