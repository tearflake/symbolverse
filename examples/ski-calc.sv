///
SKI calculus interpreter
///

(
    REWRITE
    
    /combinators/
    (RULE (VAR x) (READ (EXP (\I x))) (WRITE (EXP x)))
    (RULE (VAR x y) (READ (EXP ((\K x) y))) (WRITE (EXP x)))
    (RULE (VAR x y z) (READ (EXP (((\S x) y) z))) (WRITE (EXP ((x z) (y z)))))
)

