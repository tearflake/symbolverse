
///
# LC to SKI compiler

Lambda calculus (LC) is a formal system in mathematical logic and computer science for expressing
computation based on function abstraction and application. It uses variable binding and
substitution to define functions and apply them to arguments. The core components are variables,
function definitions (lambda abstractions, e.g., λx.x), and function applications (e.g., (λx.x)y).
Lambda calculus serves as a foundation for functional programming languages and provides a
framework for studying computation, recursion, and the equivalence of algorithms. Its simplicity
and expressiveness make it a cornerstone of theoretical computer science.

Converting lambda calculus expressions to SKI combinator calculus involves eliminating variables
by expressing functions solely in terms of the combinators S, K, and I. This process
systematically replaces abstractions and applications using transformation rules, such as
translating λx.x to I, λx.E (when x is not free in E) to K E, and λx.(E1 E2) to S (λx.E1) (λx.E2).
This allows computation to be represented without variable binding.
///

(
    REWRITE
    
    /entry point/
    (RULE (VAR A) (READ (\lcToSki \A)) (WRITE (compilingToSki A)))
    
    /LC to SKI compiler/
    (RULE (VAR x) (READ (lmbd x x)) (WRITE I))
    (RULE (VAR x E1 E2) (READ (lmbd x (E1 E2))) (WRITE ((S (lmbd x E1)) (lmbd x E2))))
    (RULE (VAR x y) (READ (lmbd x y)) (WRITE (K y)))
    
    /exit point/
    (RULE (VAR A) (READ (compilingToSki A)) (WRITE \A))
)

