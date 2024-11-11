///
append two lists
///

(
    REWRITE
    
    (
        RULE
        (VAR A B C)
        (READ  (EXP (\append (\A \B) \C)))
        (WRITE (EXP (\A (\append \B \C))))
    )
    
    (
        RULE
        (VAR A)
        (READ  (EXP (\append () \A)))
        (WRITE (EXP \A             ))
    )
)

