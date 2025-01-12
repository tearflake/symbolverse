///
Logic proof to SKI compiler

Compiling an implicational propositional logic proof to an SKI calculus involves translating each
logical step of the proof into a corresponding SKI combinator. In implicational logic, the axioms
(such as `P -> (Q -> P)` and `(P -> (Q -> R)) -> ((P -> Q) -> (P -> R))`) are represented by simple
combinators like K (which ignores its second argument) and S (which applies a function to two
arguments). Each application of these combinators directly encodes the logical structure of the
proof in SKI calculus. For instance, the proof of an implication such as `P -> (Q -> P)` would be
represented by the K combinator. By systematically replacing axioms and applying inference rules,
the entire proof can be reduced to a sequence of SKI combinators, yielding a program that is both
a valid logical proof and an interpretable functional program in SKI calculus.

Such programs in SKI calculus offer several key advantages:

- Deterministic Behavior: They are based on constructive proofs, which ensure that the program's
  execution follows a well-defined, predictable path, avoiding non-determinism.
  
- Termination Guarantee: Since constructive proofs inherently avoid infinite recursion or
  contradiction, SKI programs derived from them are guaranteed to terminate.
  
- Type Safety: The translation from constructive logic to SKI ensures that the program is type-safe,
  corresponding directly to logical propositions, which guarantees correct usage of types.
  
- Correctness: These programs are grounded in a formal proof structure, making them reliable and
  correct by construction.
  
- Reproducibility: Each step in the program corresponds to a logical step in the proof, ensuring that
  the program can be reproduced and verified based on the original proof.

In essence, SKI programs constructed from theorems are reliable, predictable, and verifiable due to
their foundation in constructive logic and formal reasoning.

-------------------------------------------------------------
To verify and compile a proof, assume or apply these rules
-------------------------------------------------------------
(AxI (impl A A))
(AxK (impl A (impl B A)))
(AxS (impl (impl A (impl B C)) (impl (impl A B) (impl A C))))
(AxB (impl (impl B C) (impl (impl A B) (impl A C))))
(AxC (impl (impl A (impl B C)) (impl B (impl A C))))
(AxW (impl (impl A (impl A B)) (impl A B))
(Apply (impl A B) A)
-------------------------------------------------------------
///

(
    REWRITE
    
    /workflow/
    (RULE (VAR A) (READ (EXP (\proofToSKI \A))) (WRITE (EXP (proofCheck A))))
    (RULE (VAR A) (READ (EXP (proofChecked A))) (WRITE (EXP (compileToSKI A))))
    (RULE (VAR A) (READ (EXP (compiledToSKI A))) (WRITE (EXP \A)))
    
    /proof verifier/
    (
        REWRITE
        
        (RULE (VAR A) (READ (EXP (\proofCheck \A))) (WRITE (EXP (proofChecking\ A A\))))
        
        /tokenizing/
        (RULE (READ (EXP AxI)) (WRITE (EXP AxI\)))
        (RULE (READ (EXP AxK)) (WRITE (EXP AxK\)))
        (RULE (READ (EXP AxS)) (WRITE (EXP AxS\)))
        (RULE (READ (EXP AxB)) (WRITE (EXP AxB\)))
        (RULE (READ (EXP AxC)) (WRITE (EXP AxC\)))
        (RULE (READ (EXP AxW)) (WRITE (EXP AxW\)))
        (RULE (READ (EXP Apply)) (WRITE (EXP Apply\)))
        (RULE (READ (EXP impl)) (WRITE (EXP impl\)))
        
        /terminal formulas/
        (
            RULE
            (VAR x)
            (
                READ
                (
                    EXP
                    x
                )
            )
            (
                WRITE
                (
                    EXP
                    (typed\ x\ terminal\ bool\)
                )
            )
        )
        (
            RULE
            (VAR A B)
            (
                READ
                (
                    EXP
                    (
                        impl\
                        (typed\ A\ terminal\ bool\)
                        (typed\ B\ terminal\ bool\)
                    )
                )
            )
            (
                WRITE
                (
                    EXP
                    (typed\ (impl\ A\ B\) terminal\ bool\)
                )
            )
        )

        /axioms/
        (
            RULE
            (VAR A B)
            (
                READ
                (
                    EXP
                    (
                        AxI\
                        (
                            typed\
                            (impl\ A\ A\)
                            terminal\
                            bool\
                        )
                    )
                )
            )
            (
                WRITE
                (
                    EXP
                    (
                        typed\
                        (impl\ A\ A\)
                        step\
                        bool\
                    )
                )
            )
        )
        (
            RULE
            (VAR A B)
            (
                READ
                (
                    EXP
                    (
                        AxK\
                        (
                            typed\
                            (impl\ A\ (impl\ B\ A\))
                            terminal\
                            bool\
                        )
                    )
                )
            )
            (
                WRITE
                (
                    EXP
                    (
                        typed\
                        (impl\ A\ (impl\ B\ A\))
                        step\
                        bool\
                    )
                )
            )
        )
        (
            RULE
            (VAR A B C)
            (
                READ
                (
                    EXP
                    (
                        AxS\
                        (
                            typed\
                            (impl\ (impl\ A\ (impl\ B\ C\)) (impl\ (impl\ A\ B\) (impl\ A\ C\)))
                            terminal\
                            bool\
                        )
                    )
                )
            )
            (
                WRITE
                (
                    EXP
                    (
                        typed\
                        (impl\ (impl\ A\ (impl\ B\ C\)) (impl\ (impl\ A\ B\) (impl\ A\ C\)))
                        step\
                        bool\
                    )
                )
            )
        )
        
        /utility axioms/
        (
            RULE
            (VAR A B C)
            (
                READ
                (
                    EXP
                    (
                        AxB\
                        (
                            typed\
                            (impl\ (impl\ B\ C\) (impl\ (impl\ A\ B\) (impl\ A\ C\)))
                            terminal\
                            bool\
                        )
                    )
                )
            )
            (
                WRITE
                (
                    EXP
                    (
                        typed\
                        (impl\ (impl\ B\ C\) (impl\ (impl\ A\ B\) (impl\ A\ C\)))
                        step\
                        bool\
                    )
                )
            )
        )
        (
            RULE
            (VAR A B C)
            (
                READ
                (
                    EXP
                    (
                        AxC\
                        (
                            typed\
                            (impl\ (impl\ A\ (impl\ B\ C\)) (impl\ B\ (impl\ A\ C\)))
                            terminal\
                            bool\
                        )
                    )
                )
            )
            (
                WRITE
                (
                    EXP
                    (
                        typed\
                        (impl (impl\ A\ (impl\ B\ C\)) (impl\ B\ (impl\ A\ C\)))
                        step\
                        bool\
                    )
                )
            )
        )
        (
            RULE
            (VAR A B C)
            (
                READ
                (
                    EXP
                    (
                        AxW\
                        (
                            typed\
                            (impl\ (impl\ A\ (impl\ A\ B\)) (impl\ A\ B\))
                            terminal\
                            bool\
                        )
                    )
                )
            )
            (
                WRITE
                (
                    EXP
                    (
                        typed\
                        (impl (impl\ A\ (impl\ A\ B\)) (impl\ A\ B\))
                        step\
                        bool\
                    )
                )
            )
        )
        
        /modus ponens/
        (
            RULE
            (VAR A B Original)
            (
                READ
                (
                    EXP
                    (
                        Apply\
                        (typed\ (impl\ A\ B\) step\ bool\)
                        (typed\ A\ step\ bool\)
                    )
                )
            )
            (
                WRITE
                (
                    EXP
                    (typed\ B\ step\ bool\)
                )
            )
        )

        (RULE (VAR A B) (READ (EXP (proofChecking\ (typed\ A\ step\ bool\) B\))) (WRITE (EXP (\proofChecked \B))))
        (RULE (VAR ANY1 ANY2) (READ (EXP (proofChecking\ ANY1\ ANY2\))) (WRITE (EXP \\"Proof verification syntax error")))
    )

    /compiler/
    (
        REWRITE

        (RULE (VAR A) (READ (EXP (\compileToSKI \A))) (WRITE (EXP (compilingToSKI A))))

        (RULE (VAR A B) (READ (EXP (Apply A B))) (WRITE (EXP (A B))))
        (RULE (VAR ANY) (READ (EXP (AxI ANY))) (WRITE (EXP I)))
        (RULE (VAR ANY) (READ (EXP (AxK ANY))) (WRITE (EXP K)))
        (RULE (VAR ANY) (READ (EXP (AxS ANY))) (WRITE (EXP S)))
        (RULE (VAR ANY) (READ (EXP (AxB ANY))) (WRITE (EXP ((S (K S)) K))))
        (RULE (VAR ANY) (READ (EXP (AxC ANY))) (WRITE (EXP ((S ((S (K ((S (K S)) K))) S)) (K K)))))
        (RULE (VAR ANY) (READ (EXP (AxW ANY))) (WRITE (EXP ((S S) (S K)))))

        (RULE (VAR A) (READ (EXP (compilingToSKI A))) (WRITE (EXP (\compiledToSKI \A))))
    )
)

