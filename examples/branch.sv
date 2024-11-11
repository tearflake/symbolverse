///
branching choice
///

(
    REWRITE
    
    (
        RULE
        (VAR X Y)
        (READ (EXP (\iff \true \X \Y)))
        (WRITE (EXP \X))
    )
    (
        RULE
        (VAR X Y)
        (READ (EXP (\iff \false \X \Y)))
        (WRITE (EXP \Y))
    )
)

