///
constructive proof verifyer
///

(
    REWRITE
    
    /entry point/
    (RULE (VAR A) (READ (EXP (\verify \A))) (WRITE (EXP (verifying A))))
    
    /arbitrary introduction/
    (RULE (VAR P) (READ (EXP ([Assume] P))) (WRITE (EXP P)))

    /logic Rules/
    (RULE (VAR P Q  ) (READ (EXP ([andIntro]  P Q)                           )) (WRITE (EXP (and P Q) )))
    (RULE (VAR P Q  ) (READ (EXP ([andElim1]  (and P Q))                     )) (WRITE (EXP P         )))
    (RULE (VAR P Q  ) (READ (EXP ([andElim2]  (and P Q))                     )) (WRITE (EXP Q         )))
    (RULE (VAR P Q  ) (READ (EXP ([orIntro1]  P)                             )) (WRITE (EXP (or P Q)  )))
    (RULE (VAR P Q  ) (READ (EXP ([orIntro2]  Q)                             )) (WRITE (EXP (or P Q)  )))
    (RULE (VAR P Q R) (READ (EXP ([orElim]    (or P Q) (impl P R) (impl Q R)))) (WRITE (EXP R         )))
    (RULE (VAR P Q  ) (READ (EXP ([implIntro] (seq P Q))                     )) (WRITE (EXP (impl P Q))))
    (RULE (VAR P Q  ) (READ (EXP ([implElim]  (impl P Q) P)                  )) (WRITE (EXP Q         )))
    (RULE (VAR P Q  ) (READ (EXP ([eqIntro]   (impl P Q) (impl Q P))         )) (WRITE (EXP (eq P Q)  )))
    (RULE (VAR P Q  ) (READ (EXP ([eqElim1]   (eq P Q) P)                    )) (WRITE (EXP Q         )))
    (RULE (VAR P Q  ) (READ (EXP ([eqElim2]   (eq P Q) Q)                    )) (WRITE (EXP P         )))
    (RULE (VAR P    ) (READ (EXP ([notIntro]  (impl P false))                )) (WRITE (EXP (not P)   )))
    (RULE (VAR P    ) (READ (EXP ([notElim]   (not P) P)                     )) (WRITE (EXP false     )))
    (RULE (VAR P    ) (READ (EXP ([X]         false)                         )) (WRITE (EXP P         )))
    (RULE (VAR P    ) (READ (EXP ([IP]        (impl (not P) false))          )) (WRITE (EXP P         )))
    
    /exit point/
    (RULE (VAR A) (READ (EXP (verifying A))) (WRITE (EXP (\result \A))))
)

