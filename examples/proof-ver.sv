///
Propositional logic proof verifier

Verifying proofs in propositional logic is the process of checking whether a given sequence of
statements, starting from axioms and applying inference rules, correctly leads to a target formula
(the theorem). This task is computationally efficient and belongs to the class P (polynomial time),
as it involves a straightforward syntactic verification. Each step in the proof is checked to
ensure it follows logically from the previous steps according to the rules of the chosen proof
system. Since the structure and rules of propositional logic are well-defined and finite, verifying
the correctness of a proof requires only a linear or polynomial number of operations relative to
the length of the proof. This makes proof verification significantly easier than finding a proof,
which can involve an exponential search through potential derivations.

-------------------------------------------------------------
To use this verifier, assume or apply these rules
-------------------------------------------------------------
(Ax1 (impl A (impl B A)))
(Ax2 (impl (impl A (impl B C)) (impl (impl A B) (impl A C))))
(Apply (impl A B) A)
-------------------------------------------------------------
///

(
    REWRITE
    
    /workflow/
    (RULE (VAR A) (READ (EXP (\verify \A))) (WRITE (EXP (proofCheck A))))
    (RULE (VAR x) (READ (EXP (UNBOUND x))) (WRITE (EXP x)))
    (RULE (VAR A) (READ (EXP (proofChecked A))) (WRITE (EXP (\"The proof is correctly stated, proved theorem is:" \A))))
    
    /verifier/
    (
        REWRITE
        
        (RULE (VAR A) (READ (EXP (\proofCheck \A))) (WRITE (EXP (proofChecking\ A))))
        
        /tokenizing/
        (RULE (READ (EXP Ax1)) (WRITE (EXP Ax1\)))
        (RULE (READ (EXP Ax2)) (WRITE (EXP Ax2\)))
        (RULE (READ (EXP Apply)) (WRITE (EXP Apply\)))
        (RULE (READ (EXP impl)) (WRITE (EXP impl\)))
        
        /terminal formulas/
        (RULE (VAR x) (READ (EXP x)) (WRITE (EXP (typed\ x\ terminal\ bool\))))
        (
            RULE
            (VAR A B)
            (READ (EXP (impl\ (typed\ A\ terminal\ bool\) (typed\ B\ terminal\ bool\))))
            (WRITE (EXP (typed\ (impl\ A\ B\) terminal\ bool\)))
        )

        /axioms/
        (
            RULE
            (VAR A B)
            (READ (EXP (Ax1\ (typed\ (impl\ A\ (impl\ B\ A\)) terminal\ bool\))))
            (WRITE (EXP (typed\ (impl\ A\ (impl\ B\ A\)) step\ bool\)))
        )
        (
            RULE
            (VAR A B C)
            (READ (EXP (Ax2\ (typed\ (impl\ (impl\ A\ (impl\ B\ C\)) (impl\ (impl\ A\ B\) (impl\ A\ C\))) terminal\ bool\))))
            (WRITE (EXP (typed\ (impl\ (impl\ A\ (impl\ B\ C\)) (impl\ (impl\ A\ B\) (impl\ A\ C\))) step\ bool\)))
        )
        
        /modus ponens/
        (
            RULE
            (VAR A B)
            (READ (EXP (Apply\ (typed\ (impl\ A\ B\) step\ bool\) (typed\ A\ step\ bool\))))
            (WRITE (EXP (typed\ B\ step\ bool\)))
        )

        (RULE (VAR A) (READ (EXP (proofChecking\ (typed\ A\ step\ bool\)))) (WRITE (EXP (\proofChecked \A))))
        (RULE (VAR A) (READ (EXP (proofChecking\ A\))) (WRITE (EXP \\"Proof verification syntax error")))
    )
)

