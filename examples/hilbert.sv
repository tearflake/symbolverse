
///
# Hilbert style proof checker

The Hilbert-style proof system is a formal deductive framework used in mathematical logic and
proof theory. It is named after David Hilbert, who pioneered formal approaches to mathematics
in the early 20th century. This system is designed to formalize reasoning by providing a small
set of axioms and inference rules that allow the derivation of theorems. In its essence, the
Hilbert-style proof system is minimalistic, relying on a few foundational logical axioms and a
single or limited number of inference rules, such as modus ponens (if `A` and `A -> B` are
true, then `B` is true).

One of the defining features of the Hilbert system is its flexibility and generality. It is
used to represent a variety of logical systems, including propositional logic. Proofs in this
system consist of sequences of formulas, where each formula is either an axiom or derived from
previous formulas using inference rules. While highly structured, the system is often
criticized for being less intuitive and less efficient compared to more modern proof systems
like natural deduction or sequent calculus. Despite this, the Hilbert-style proof system
remains foundational in logic due to its simplicity and role in formalizing the foundations of
mathematics. It serves as a cornerstone for understanding logical derivation and the
relationships between axiomatic systems.

Hilbert-style proof systems can be applied to type checking in programming by leveraging their
formal structure to verify the correctness of type assignments in a program. In type theory,
types can be seen as logical propositions, and well-typed programs correspond to proofs of these
propositions. By encoding typing rules as axioms and inference rules within a Hilbert-style
framework, the process of type checking becomes equivalent to constructing a formal proof that
a given program adheres to its type specification. While this approach is conceptually elegant,
it can be inefficient for practical programming languages due to the system’s minimalistic
nature, requiring explicit proofs for even simple derivations. However, it provides a
foundational theoretical basis for understanding type systems and their connection to logic,
particularly in frameworks like the Curry-Howard correspondence, which bridges formal logic and
type theory.

## Instructions for using the proof checker:

```
--------------------------------------------------------------
To compose a proof, use these rules
--------------------------------------------------------------
AxmI = (impl A A)
AxmK = (impl A (impl B A))
AxmS = (impl (impl A (impl B C)) (impl (impl A B) (impl A C)))
(Apply (impl A B) A) = B
--------------------------------------------------------------
```
///

(
    REWRITE
    
    /workflow/
    (RULE (VAR A) (READ (EXP (\check \A))) (WRITE (EXP (proofCheck A))))
    (RULE (VAR A) (READ (EXP (proofChecked A))) (WRITE (EXP \A)))
    
    /proof checker/
    (
        REWRITE
        
        /entry point/
        (RULE (VAR A) (READ (EXP (\proofCheck \A))) (WRITE (EXP (proofChecking A))))
        
        /axioms/
        (
            RULE
            (VAR A B)
            (
                READ
                (EXP AxmI)
            )
            (
                WRITE
                (EXP (typed (impl A A)))
            )
        )
        (
            RULE
            (VAR A B)
            (
                READ
                (EXP AxmK)
            )
            (
                WRITE
                (EXP (typed (impl A (impl B A))))
            )
        )
        (
            RULE
            (VAR A B C)
            (
                READ
                (EXP AxmS)
            )
            (
                WRITE
                (EXP (typed (impl (impl A (impl B C)) (impl (impl A B) (impl A C)))))
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
                        Apply
                        (typed (impl A B))
                        (typed A)
                    )
                )
            )
            (
                WRITE
                (
                    EXP
                    (typed B)
                )
            )
        )
        
        /exit point/
        (RULE (VAR A) (READ (EXP (proofChecking (typed A)))) (WRITE (EXP (\proofChecked \A))))
        (RULE (VAR A) (READ (EXP (proofChecking A))) (WRITE (EXP \\"Proof checking error")))
    )
)

