///
reverse a list
///

(
    REWRITE
    
    ///
    reverse function
    ///

    (
        RULE
        (VAR A B)
        (READ  (EXP (\reverse (\A \B))             ))
        (WRITE (EXP (\append (\reverse \B) (\A ()))))
    )
    
    (
        RULE
        (READ  (EXP (\reverse ())))
        (WRITE (EXP ()           ))
    )

    ///
    append function
    ///

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

