
///
# STLC implementation

The simply typed lambda calculus (STLC) is a foundational formal system in the study of logic,
programming languages, and theorem proving. It extends the untyped lambda calculus by associating
types with expressions, ensuring that only well-formed function applications are permitted. In
this system, each term has a type, and functions explicitly declare the type of their arguments
and results. This typing discipline prevents many forms of nonsensical expressions that are
possible in the untyped system, such as applying a boolean to a number. As a result, the STLC
forms a robust framework for representing and manipulating proofs as computational objects.

In theorem proving, especially in systems based on the Curry-Howard correspondence, the STLC
serves as a means to encode logical propositions as types and proofs as terms. Under this
correspondence, proving a theorem is equivalent to constructing a term of a given type. For
example, a proof of a proposition like `A -> B` is represented by a function that, given a proof
of  `A`, produces a proof of `B`. This tight connection between logic and computation allows
automated theorem provers and proof assistants to leverage type checking as a means of proof
verification. While the STLC lacks the expressive power of richer type systems (like dependent
types), it offers a clear and elegant foundation for understanding the relationship between
types, computation, and logical deduction.

In this implementation, primitive terms are represented as constants. They have to be explicitly
typed with `(assert <LOWERCASE-LETTER> <type>)` syntax. Defining constants is allowed only
outside of all of `(lmbd ... ...)` expressions, and applied as shown in input example. Also,
all the variables within lambda expressions have to be bound.

Syntax of STLC in this implementation is expected to follow the following kind of BNF rules:

```
    <start> := stlc <lexp>

     <lexp> := (lmbd (typed <var> <type>) <lexp>)
             | (<lexp> <lexp>)
             | <var>

      <var> := <LOWERCASE-LETTER>

     <type> := (CONST <UPPERCASE-LETTER>)
             | (IMPL <type> <type>)
```

The implementation features constructing compound types from annotated type rules, combined with
previous examples of LC to SKI compiler, Hilbert-style proof checker and SKI calculus interpreter.
///

(
    REWRITE
    
    /begin/
    (RULE (VAR A) (READ (EXP (\stlc \A))) (WRITE (EXP (evaluating A A))))
    
    /type check/
    (
        RULE
        (VAR A B)
        (READ (EXP (evaluating A B)))
        (WRITE (EXP (typeEq (composeTypes A) (lift (proofCheck (lcToSki (getTypes A)))) B)))
    )

    /success/
    (
        RULE
        (VAR A B)
        (READ (EXP (typeEq A A B)))
        (WRITE (EXP (finish (result (value (interpretSki (lcToSki (getValues B)))) (type A)))))
    )

    /failure/
    (
        RULE
        (VAR A B C)
        (READ (EXP (typeEq A B C)))
        (WRITE (EXP (finish "Typing error")))
    )
    
    /end/
    (RULE (VAR A B) (READ (EXP (finish A))) (WRITE (EXP \A)))

    /lift/
    (
        REWRITE
        (RULE (VAR A) (READ (EXP (\lift \A))) (WRITE (EXP (lifting A))))
        
        (RULE (READ (EXP const)) (WRITE (EXP CONST)))
        (RULE (READ (EXP impl)) (WRITE (EXP IMPL)))
        
        (RULE (VAR A) (READ (EXP (lifting A))) (WRITE (EXP \A)))
    )
    
    /getTypes/
    (
        REWRITE
        (RULE (VAR A) (READ (EXP (\getTypes \A))) (WRITE (EXP (gettingTypes A))))
        
        (RULE (VAR A B) (READ (EXP (typed A B))) (WRITE (EXP A)))
        (RULE (VAR A B) (READ (EXP (assert A B))) (WRITE (EXP B)))
        
        (RULE (VAR A) (READ (EXP (gettingTypes A))) (WRITE (EXP \A)))
    )
    
    /getValues/
    (
        REWRITE
        (RULE (VAR A) (READ (EXP (\getValues \A))) (WRITE (EXP (gettingValues A))))
        
        (RULE (VAR A B) (READ (EXP (typed A B))) (WRITE (EXP A)))
        (RULE (VAR A B) (READ (EXP (assert A B))) (WRITE (EXP A)))
        
        (RULE (VAR A) (READ (EXP (gettingValues A))) (WRITE (EXP \A)))
    )
    
    ///////////////////////////
    /composing annotated types/
    ///////////////////////////
    
    (
        RULE
        (VAR A)
        (READ (EXP (composeTypes A)))
        (WRITE (EXP (composeApplicationTypes (composeAbstractionTypes A))))
    )
    
    /abstraction types/
    (
        REWRITE
        (
            RULE
            (VAR A)
            (READ (EXP (\composeAbstractionTypes \A)))
            (WRITE (EXP (composingAbstractionTypes A)))
        )
        
        (
            RULE
            (VAR x M ParameterType)
            (
                READ
                (
                    EXP
                    (
                        lmbd
                        (typed x ParameterType)
                        M
                    )
                )
            )
            (
                WRITE
                (
                    EXP
                    (IMPL ParameterType (replace M x ParameterType))
                )
            )
        )
        
        (
            RULE
            (VAR A ResultType)
            (
                READ
                (
                    EXP
                    (assert A ResultType)
                )
            )
            (
                WRITE
                (
                    EXP
                    ResultType
                )
            )
        )
        
        (RULE (VAR A) (READ (EXP (composingAbstractionTypes A))) (WRITE (EXP \A)))
        
        /replace util/
        (
            REWRITE
            
            (
                RULE
                (VAR Exp a B)
                (READ (EXP (\replace \Exp \a \B)))
                (WRITE (EXP (replacing (traverse Exp a B))))
            )
            
            (RULE (VAR a1 B   ) (READ (EXP (traverse a1 a1 B))) (WRITE (EXP B)))
            (RULE (VAR a1 a2 B) (READ (EXP (traverse a1 a2 B))) (WRITE (EXP a1)))
            
            (
                RULE
                (VAR L R A B)
                (READ (EXP (traverse (L R) A B)))
                (WRITE (EXP ((traverse L A B) (traverse R A B))))
            )
            (
                RULE
                (VAR L R A B)
                (READ (EXP (traverse (IMPL L R) A B)))
                (WRITE (EXP (IMPL (traverse L A B) (traverse R A B))))
            )
            
            (RULE (VAR A) (READ (EXP (replacing A))) (WRITE (EXP \A)))
        )
    )
        
    /application types/
    (
        REWRITE
        
        (
            RULE
            (VAR A)
            (READ (EXP (\composeApplicationTypes \A)))
            (WRITE (EXP (composingApplicationTypes A)))
        )
        
        (
            RULE
            (VAR A B)
            (READ (EXP ((IMPL A B) A)))
            (WRITE (EXP B))
        )
        
        (
            RULE
            (VAR A)
            (READ (EXP (composingApplicationTypes A)))
            (WRITE (EXP \A))
        )
    )
    
    (FILE "lambda-calc.sv")
    (FILE "ski-calc.sv")
    (FILE "hilbert.sv")
)

