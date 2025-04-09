
///
# LC to SKI compiler

Lambda calculus (LC) is a formal system in mathematical logic and computer science for expressing
computation based on function abstraction and application. It uses variable binding and
substitution to define functions and apply them to arguments. The core components are variables,
function definitions (lambda abstractions, e.g., λx.x), and function applications (e.g., (λx.x)y).
Lambda calculus serves as a foundation for functional programming languages and provides a
framework for studying computation, recursion, and the equivalence of algorithms. Its simplicity
and expressiveness make it a cornerstone of theoretical computer science.
///

(
    REWRITE
    
    /entry point/
    (RULE (VAR A) (READ (EXP (\lcToSki \A))) (WRITE (EXP (compilingToSki A))))
    
    /LC to SKI compiler/
    (RULE (VAR x) (READ (EXP (lmbd x x))) (WRITE (EXP I)))
    (RULE (VAR x E1 E2) (READ (EXP (lmbd x (E1 E2)))) (WRITE (EXP ((S (lmbd x E1)) (lmbd x E2)))))
    (RULE (VAR x y) (READ (EXP (lmbd x y))) (WRITE (EXP (K y))))
    
    /exit point/
    (RULE (VAR A) (READ (EXP (compilingToSki A))) (WRITE (EXP \A)))
)

