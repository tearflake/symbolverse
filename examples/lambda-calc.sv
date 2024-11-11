///
lambda calculus
///

(
    REWRITE
    
    /lambda terms/
    (RULE (VAR x) (READ (EXP (\lmbd \x \x))) (WRITE (EXP \I)))
    (RULE (VAR x E1 E2) (READ (EXP (\lmbd \x (\E1 \E2)))) (WRITE (EXP ((\S (\lmbd \x \E1)) (\lmbd \x \E2)))))
    (RULE (VAR x y) (READ (EXP (\lmbd \x \y))) (WRITE (EXP (\K \y))))

    /combinators/
    (RULE (VAR x) (READ (EXP (\I \x))) (WRITE (EXP \x)))
    (RULE (VAR x y) (READ (EXP ((\K \x) \y))) (WRITE (EXP \x)))
    (RULE (VAR x y z) (READ (EXP (((\S \x) \y) \z))) (WRITE (EXP ((\x \z) (\y \z)))))
)

