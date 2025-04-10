
///
SKI calculus interpreter

SKI calculus is a combinatory logic system used in mathematical logic and computer science to model
computation without the need for variables. It uses three basic combinators: S, K, and I. The K
combinator (Kxy = x) discards its second argument, the I combinator (Ix = x) returns its argument,
and the S combinator (Sxyz = xz(yz)) applies its first argument to its third argument and the
result of applying the second argument to the third. Through combinations of these three primitives,
any computation can be encoded, making SKI calculus a foundation for understanding computation
theory.
///

(
    REWRITE
    
    /entry point/
    (RULE (VAR A) (READ (\interpretSki \A)) (WRITE (interpretingSki A)))
    
    /combinators/
    (RULE (VAR X) (READ (I X)) (WRITE X))
    (RULE (VAR X Y) (READ ((K X) Y)) (WRITE X))
    (RULE (VAR X Y Z) (READ (((S X) Y) Z)) (WRITE ((X Z) (Y Z))))
    
    /exit point/
    (RULE (VAR A) (READ (interpretingSki A)) (WRITE \A))
)

