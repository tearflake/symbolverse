
///
# LC to SKI compiler

Lambda calculus (LC) is a formal system in mathematical logic and computer science for expressing
computation based on function abstraction and application. It uses variable binding and
substitution to define functions and apply them to arguments. The core components are variables,
function definitions (lambda abstractions, e.g., λx.x), and function applications (e.g., (λx.x)y).
Lambda calculus serves as a foundation for functional programming languages and provides a
framework for studying computation, recursion, and the equivalence of algorithms. Its simplicity
and expressiveness make it a cornerstone of theoretical computer science.

The SKI calculus is a foundational system in combinatory logic that eliminates the need for
variables by expressing all computations through three basic combinators: S, K, and I. The SKI
calculus can be viewed through two complementary lenses: as a computational system and as a
logical framework. In its computational interpretation, SKI calculus operates as a minimalist
functional evaluator, where the combinators S, K, and I serve as function transformers that enable
the construction and reduction of expressions without variables, forming the core of combinatory
logic. Conversely, from a logical standpoint, SKI calculus aligns with a Hilbert-style inference
system, where S, K, and I are treated not as functions but as axiom schemes or inference rules. In
this context, the application of combinators mirrors the process of type inference in logic or
proof construction: for instance, the types of S, K, and I correspond to specific theorems in
implicational logic, and their application mimics modus ponens. This duality reveals a connection
between computation and logic, embodying the Curry-Howard correspondence, where evaluating a term
parallels constructing a proof.

Converting lambda calculus expressions to SKI combinator calculus involves eliminating variables
by expressing functions solely in terms of the combinators S, K, and I. This process
systematically replaces abstractions and applications using transformation rules, such as
translating λx.x to I, λx.E (when x is not free in E) to K E, and λx.(E1 E2) to S (λx.E1) (λx.E2).
This allows computation to be represented without variable binding.
///

(
    REWRITE
    
    /entry point/
    (RULE (VAR A) (READ (EXP (\lcToSki \A))) (WRITE (EXP (compilingToSki A))))
    
    /LC to SKI compiler/
    (RULE (VAR x) (READ (EXP (lmbd x x))) (WRITE (EXP cI)))
    (RULE (VAR x E1 E2) (READ (EXP (lmbd x (E1 E2)))) (WRITE (EXP ((cS (lmbd x E1)) (lmbd x E2)))))
    (RULE (VAR x y) (READ (EXP (lmbd x y))) (WRITE (EXP (cK y))))
    
    /exit point/
    (RULE (VAR A) (READ (EXP (compilingToSki A))) (WRITE (EXP \A)))
)

