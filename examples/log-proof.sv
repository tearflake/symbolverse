///
Logic proof to SKI compiler

The Curry-Howard correspondence establishes a profound connection between logic and computation,
where logical propositions correspond to types, and constructive proofs correspond to programs.
By compiling a logic proof into SKI calculus, we're essentially transforming a constructive proof
of a theorem into an executable program. Each step in the proof corresponds to a combinator or a
combination of combinators, and the resulting SKI expression is guaranteed to be correct by
construction because the program adheres to the logical structure of the proof.

Compiling an implicational propositional logic proof to an SKI calculus involves translating each
logical step of the proof into a corresponding SKI combinator. In implicational logic, the axioms
(such as `P -> (Q -> P)` and `(P -> (Q -> R)) -> ((P -> Q) -> (P -> R))`) are represented by
simple combinators like K (which ignores its second argument) and S (which applies a function to
two arguments). Each application of these combinators directly encodes the logical structure of the
proof in SKI calculus. For instance, the proof of an implication such as `P -> (Q -> P)` would be
represented by the K combinator. By systematically replacing Axioms and applying inference rules,
the entire proof can be reduced to a sequence of SKI combinators, yielding a program that is both
a valid logical proof and an interpretable functional program in SKI calculus.

Programs in SKI calculus offer several key advantages:

- Deterministic Behavior: They are based on constructive proofs, which ensure
  that the program's execution follows a well-defined, predictable path, avoiding
  non-determinism.
  
- Termination Guarantee: Since constructive proofs inherently avoid infinite
  recursion or contradiction, SKI programs derived from them are guaranteed to
  terminate.
  
- Type Safety: The translation from constructive logic to SKI ensures that the
  program is type-safe, corresponding directly to logical propositions, which
  guarantees correct usage of types.
  
- Correctness: These programs are grounded in a formal proof structure, making
  them reliable and correct by construction.
  
- Reproducibility: Each step in the program corresponds to a logical step in the
  proof, ensuring that the program can be reproduced and verified based on the
  original proof.

In essence, SKI programs are reliable, predictable, and verifiable due to their foundation in
constructive logic and formal reasoning.

Instructions for testing the compiler:

--------------------------------------------------------------
To verify and compile a proof, assume or apply these rules
--------------------------------------------------------------
(AxmI (impl A A))
(AxmK (impl A (impl B A)))
(AxmS (impl (impl A (impl B C)) (impl (impl A B) (impl A C))))
(Apply (impl A B) A)
--------------------------------------------------------------
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
        (RULE (READ (EXP AxmI)) (WRITE (EXP AxmI\)))
        (RULE (READ (EXP AxmK)) (WRITE (EXP AxmK\)))
        (RULE (READ (EXP AxmS)) (WRITE (EXP AxmS\)))
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
                        AxmI\
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
                        AxmK\
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
                        AxmS\
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
        
        /modus ponens/
        (
            RULE
            (VAR A B)
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

        (RULE (VAR Type Proof) (READ (EXP (proofChecking\ (typed\ Type\ step\ bool\) Proof\))) (WRITE (EXP (\proofChecked \Proof))))
        (RULE (VAR Type Proof) (READ (EXP (proofChecking\ Type\ Proof\))) (WRITE (EXP (\\"Proof verification syntax error:" \\Type))))
    )

    /compiler/
    (
        REWRITE

        (RULE (VAR A) (READ (EXP (\compileToSKI \A))) (WRITE (EXP (compilingToSKI A))))

        (RULE (VAR A B) (READ (EXP (Apply A B))) (WRITE (EXP (A B))))
        (RULE (VAR ANY) (READ (EXP (AxmI ANY))) (WRITE (EXP I)))
        (RULE (VAR ANY) (READ (EXP (AxmK ANY))) (WRITE (EXP K)))
        (RULE (VAR ANY) (READ (EXP (AxmS ANY))) (WRITE (EXP S)))

        (RULE (VAR A) (READ (EXP (compilingToSKI A))) (WRITE (EXP (\compiledToSKI \A))))
    )
)

