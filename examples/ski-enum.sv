
///
# SKI expressions enumerator

This example investigates the systematic generation and enumeration of expressions in SKI
combinatory logic, a minimalistic, variable-free model of computation built from the primitive
combinators `S`, `K`, and `I`. The goal is to develop a program capable of generating all
possible well-formed SKI expressions up to a user-defined size or depth. Each expression is
either a primitive combinator or an application of two smaller expressions, forming a binary
tree structure that can be grown iteratively.

This kind of systematic enumeration grows rapidly, as each new size includes all possible
pairings of existing expressions from previous sizes. The process resembles the growth of
Catalan-number-related structures, since combinator expressions form binary trees with
combinators at the leaves.

The example will organize these expressions by size, beginning with the primitive combinators
and progressively building more complex expressions through recursive pairings of existing
terms. This process enables the exploration of the combinatorial structure of the SKI universe,
providing a means to analyze the distribution of reducible, irreducible, and non-terminating
expressions.

Here, a platform is offered for philosophical and theoretical inquiry into the relationship
between computation, proof theory, and minimal formal systems. By treating SKI expressions as
both programs and proof objects, it provides a method for examining the Curry-Howard
correspondence and investigating how complexity emerges from the simplest possible computational
primitives.

The example accepts a Peano integer, denoting the depth of the combinatorial tree.
///

(
    REWRITE
    
    /entry point/
    
    (
        RULE
        (VAR A)
        (READ (EXP (\combs \A)))
        (WRITE (EXP (return (CONSL COMBS (denormalize (enumRange combs () () zero A))))))
    )
    
    /exit point/
    
    (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \A)))
    
    /combinators/
    
    (RULE (READ (EXP combs)) (WRITE (EXP (<S> (<K> (<I> ()))))))

    /combinations/
    
    (
        RULE
        (VAR Comb Acc1 Acc2 NumRec)
        (READ (EXP (enumRange Comb Acc1 Acc2 NumRec NumRec)))
        (WRITE (EXP (concatenate Acc2 Acc1)))
    )
    (
        RULE 
        (VAR Comb Acc1 Acc2 NumRec1 NumRec2)
        (READ (EXP (enumRange Comb Acc1 Acc2 (succ (succ NumRec1)) NumRec2)))
        (
            WRITE
            (
                EXP
                (
                    enumRange
                    combs
                    (concatenate (product Comb Acc1) (product Acc1 Comb))
                    (concatenate Acc2 Acc1)
                    (succ (succ (succ NumRec1)))
                    NumRec2
                )
            )
        )
    )
    (
        RULE 
        (VAR Comb Acc1 Acc2 NumRec1 NumRec2)
        (READ (EXP (enumRange Comb Acc1 Acc2 NumRec1 NumRec2)))
        (WRITE (EXP (enumRange combs (product Comb Acc1) (concatenate Acc2 Acc1) (succ NumRec1) NumRec2)))
    )
    
    /cartesian product/
    
    (
        REWRITE
        
        (RULE (VAR A B) (READ (EXP (\product \A \B))) (WRITE (EXP (return (enumL A B ())))))

        (RULE (VAR Lft AccL) (READ (EXP (enumL Lft () AccL))) (WRITE (EXP Lft)))
        (RULE (VAR Rgt AccL) (READ (EXP (enumL () Rgt AccL))) (WRITE (EXP (reverse AccL))))
        (
            RULE
            (VAR L Lft Rgt AccL)
            (READ (EXP (enumL (L Lft) Rgt AccL)))
            (WRITE (EXP (enumL Lft Rgt (concatenate (enumR L Rgt ()) AccL))))
        )
        
        (RULE (VAR R AccR) (READ (EXP (enumR () R AccR))) (WRITE (EXP R)))
        (RULE (VAR L AccR) (READ (EXP (enumR L () AccR))) (WRITE (EXP AccR)))
        (
            RULE
            (VAR L R Rgt AccR)
            (READ (EXP (enumR L (R Rgt) AccR)))
            (WRITE (EXP (enumR L Rgt ((L (R ())) AccR))))
        )
        
        (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \A)))
    )
    
    /reverse list/
    
    (
        REWRITE
        
        (RULE (VAR A) (READ (EXP (\reverse \A))) (WRITE (EXP (return (rev A)))))
        
        (RULE (VAR A B) (READ  (EXP (rev (A B)))) (WRITE (EXP (concatenate (rev B) (A ())))))
        (RULE (READ  (EXP (rev ()))) (WRITE (EXP ())))
        
        (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \A)))
    )
    
    /concatenate two lists/
    
    (
        REWRITE
        
        (RULE (VAR A B) (READ (EXP (\concatenate \A \B))) (WRITE (EXP (return (concat A B)))))
        
        (RULE (VAR A B C) (READ  (EXP (concat (A B) C))) (WRITE (EXP (A (concat B C)))))
        (RULE (VAR A) (READ  (EXP (concat () A))) (WRITE (EXP A)))
        
        (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \A)))
    )
    
    /denormalize list/
    
    (
        REWRITE
        
        (RULE (VAR A) (READ (EXP (\denormalize \A))) (WRITE (EXP (return (denorm A)))))
        
        (RULE (READ (EXP (denorm ()))) (WRITE (EXP ())))
        (RULE (VAR a) (READ (EXP (denorm a))) (WRITE (EXP a)))
        (RULE (VAR A B) (READ (EXP (denorm (A B)))) (WRITE (EXP (CONSL (denorm A) (denorm B)))))
        
        (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \A)))
    )
)

