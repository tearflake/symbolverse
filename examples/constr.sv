///
constructive proof verifyer
///

(
    REWRITE
    
    /logic rules/
    (RULE (VAR a b) (READ (EXP (\[andIntro] a b))                                  ) (WRITE (EXP (\and a b)) ))
    (RULE (VAR a b) (READ (EXP (\[andElim1] (\and a b)))                           ) (WRITE (EXP a)          ))
    (RULE (VAR a b) (READ (EXP (\[andElim2] (\and a b)))                           ) (WRITE (EXP b)          ))
    (RULE (VAR a b) (READ (EXP (\[orIntro1] a))                                    ) (WRITE (EXP (\or a b))  ))
    (RULE (VAR a b) (READ (EXP (\[orIntro2] b))                                    ) (WRITE (EXP (\or a b))  ))
    (RULE (VAR a b) (READ (EXP (\[orElim] (\or a b) (\seq a False) (\seq b False)))) (WRITE (EXP False)      ))
    (RULE (VAR a b) (READ (EXP (\[implIntro] (\seq a b)))                          ) (WRITE (EXP (\impl a b))))
    (RULE (VAR a b) (READ (EXP (\[implElim] (\impl a b) a))                        ) (WRITE (EXP b)          ))
    (RULE (VAR a b) (READ (EXP (\[eqIntro] (\impl a b) (\impl b a)))               ) (WRITE (EXP (\eq a b))  ))
    (RULE (VAR a b) (READ (EXP (\[eqElim1] (\eq a b) a))                           ) (WRITE (EXP b)          ))
    (RULE (VAR a b) (READ (EXP (\[eqElim2] (\eq a b) b))                           ) (WRITE (EXP a)          ))
    (RULE (VAR a)   (READ (EXP (\[notIntro] (\seq a False)))                       ) (WRITE (EXP (\not a))   ))
    (RULE (VAR a)   (READ (EXP (\[notElim] (\not a) a))                            ) (WRITE (EXP False)      ))
    (RULE (VAR a)   (READ (EXP (\[X] False))                                       ) (WRITE (EXP a)          ))
    (RULE (VAR a)   (READ (EXP (\[IP] (\seq (\not a) False)))                      ) (WRITE (EXP a)          ))

    (RULE (VAR a) (READ (EXP (\[Assume] a))) (WRITE (EXP a)))
)

