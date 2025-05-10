
///
# IMP interpreter

IMP is a simple, foundational framework often used to illustrate the principles of imperative
programming in programming language theory and formal semantics. It stands for Imperative language,
and typically includes a minimal set of constructs such as variable assignments, sequential
composition, conditional statements, and while loops. Despite its simplicity, IMP captures the
essential features of imperative programming, where programs are viewed as sequences of commands
that modify a program’s state. It serves as a useful model for teaching operational and
denotational semantics, allowing researchers and students to formally reason about program
behavior, correctness, and transformations in a structured yet approachable way.

This example expects input in the following BNF:

```
   <program> := (imp <statement>)

 <statement> := <assignment>
              | <sequence>
              | <if>
              | <while>
              | skip

<assignment> := (assign <IDENTIFIER> <expression>)

  <sequence> := (seq <statement>+)

        <if> := (if <boolean> <statement> <statement>)

     <while> := (while <boolean> <statement>)

<expression> := <NUMBER>
              | <IDENTIFIER>
              | (add <expression> <expression>)
              | (sub <expression> <expression>)
              | (mul <expression> <expression>)
              | (div <expression> <expression>)

   <boolean> := true
              | false
              | (eq <expression> <expression>)
              | (leq <expression> <expression>)
              | (not <boolean>)
              | (and <boolean> <boolean>)
              | (or <boolean> <boolean>)
```
///

(
    REWRITE
    
    (RULE (VAR A) (READ (EXP (\imp \A))) (WRITE (EXP (return (denormVars (interpret (denormInstr (normalize A))))))))
    
    (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \A)))
    
    /denormalize instructions/
    
    (
        REWRITE
        
        (RULE (VAR A) (READ (EXP (\denormInstr \A))) (WRITE (EXP (return A))))
        
        (RULE (VAR A B) (READ (EXP (assign (A (B ()))))) (WRITE (EXP (assign A B))))
        (RULE (VAR A B C) (READ (EXP (if (A (B (C ())))))) (WRITE (EXP (if A B C))))
        (RULE (VAR A B) (READ (EXP (while (A (B ()))))) (WRITE (EXP (while A B))))
        
        (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \A)))
    )
    
    /interpreter/
    
    (
        REWRITE
        
        (RULE (VAR A) (READ (EXP (\interpret \A))) (WRITE (EXP (return (do A ())))))
        
        (RULE (VAR Vars) (READ (EXP (do skip Vars))) (WRITE (EXP Vars)))

        (RULE (VAR Vars) (READ (EXP (do (seq ()) Vars))) (WRITE (EXP Vars)))
        (RULE (VAR A B Vars) (READ (EXP (do (seq (A B)) Vars))) (WRITE (EXP (do (seq B) (do A Vars)))))
        
        (RULE (VAR A B Vars) (READ (EXP (do (assign A B) Vars))) (WRITE (EXP (bounce (calc (doAssign A B Vars))))))
        
        (RULE (VAR A B C Vars) (READ (EXP (do (if A B C) Vars))) (WRITE (EXP (iff (bounce (calc (replaceExp A Vars))) B C Vars))))
        (RULE (VAR B C Vars) (READ (EXP (iff true B C Vars))) (WRITE (EXP (do B Vars))))
        (RULE (VAR B C Vars) (READ (EXP (iff false B C Vars))) (WRITE (EXP (do C Vars))))
        
        (RULE (VAR A B Vars) (READ (EXP (do (while A B) Vars))) (WRITE (EXP (whif (bounce (calc (replaceExp A Vars))) A B Vars))))
        (RULE (VAR A B Vars) (READ (EXP (whif true A B Vars))) (WRITE (EXP (do (while A B) (do B Vars)))))
        (RULE (VAR A B Vars) (READ (EXP (whif false A B Vars))) (WRITE (EXP Vars)))
        
        (RULE (VAR A) (READ (EXP (bounce A))) (WRITE (EXP (\bouncing \A))))
        (RULE (VAR A) (READ (EXP (\bouncing \A))) (WRITE (EXP A)))
        
        (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \A)))
        
        /assign/
        
        (
            REWRITE
            
            (
                RULE
                (VAR Elm Val Lst)
                (READ (EXP (\doAssign \Elm \Val \Lst)))
                (WRITE (EXP (return (replace Elm Val Lst Lst))))
            )
            
            (
                RULE
                (VAR Elm Val Lst LstAll)
                (READ (EXP (replace Elm Val () LstAll)))
                (WRITE (EXP ((Elm (replaceExp Val LstAll)) ())))
            )
            (
                RULE
                (VAR Elm Val1 Val2 Lst LstAll)
                (READ (EXP (replace Elm Val1 ((Elm Val2) Lst) LstAll)))
                (WRITE (EXP ((Elm (replaceExp Val1 LstAll)) Lst)))
            )
            (
                RULE
                (VAR Elm1 Val1 Elm2 Val2 Lst LstAll)
                (READ (EXP (replace Elm1 Val1 ((Elm2 Val2) Lst) LstAll)))
                (WRITE (EXP ((Elm2 Val2) (replace Elm1 Val1 Lst LstAll))))
            )
            
            (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \A)))
        )

        /substitute variables/

        (
            REWRITE
            
            (RULE (VAR A Lst) (READ (EXP (\replaceExp \A \Lst))) (WRITE (EXP (return (traverse A Lst)))))
            
            (
                RULE
                (VAR a Lst)
                (READ (EXP (traverse a Lst)))
                (WRITE (EXP (replaceVar a Lst)))
            )
            (
                RULE
                (VAR Lst)
                (READ (EXP (traverse () Lst)))
                (WRITE (EXP ()))
            )
            (
                RULE
                (VAR L R Lst)
                (READ (EXP (traverse (L R) Lst)))
                (WRITE (EXP ((traverse L Lst) (traverse R Lst))))
            )
            
            (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \A)))
            
            (
                REWRITE
                
                (RULE (VAR a Lst) (READ (EXP (\replaceVar \a \Lst))) (WRITE (EXP (return (loop a Lst)))))
                
                (RULE (VAR a) (READ (EXP (loop a ()))) (WRITE (EXP a)))
                (RULE (VAR a Val Lst) (READ (EXP (loop a ((a Val) Lst)))) (WRITE (EXP Val)))
                (RULE (VAR a b Val Lst) (READ (EXP (loop a ((b Val) Lst)))) (WRITE (EXP (loop a Lst))))
                
                (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \A)))
            )
        )
    )
    
    /computation wrapper/
    
    (
        REWRITE
        
        (RULE (VAR A) (READ (EXP (\calc \A))) (WRITE (EXP (return A))))
        
        (RULE (VAR A B) (READ (EXP (eq (A (B ()))))) (WRITE (EXP (peano (eq A B)))))
        (RULE (VAR A B) (READ (EXP (leq (A (B ()))))) (WRITE (EXP (or ((peano (eq A B)) ((peano (lt A B)) ()))))))
        
        (RULE (VAR A) (READ (EXP (not (A ())))) (WRITE (EXP (bool (not A)))))
        (RULE (VAR A B) (READ (EXP (and (A (B ()))))) (WRITE (EXP (bool (and A B)))))
        (RULE (VAR A B) (READ (EXP (or (A (B ()))))) (WRITE (EXP (bool (or A B)))))
    
        (RULE (VAR A B) (READ (EXP (add (A (B ()))))) (WRITE (EXP (peano (add A B)))))
        (RULE (VAR A B) (READ (EXP (sub (A (B ()))))) (WRITE (EXP (peano (sub A B)))))
        (RULE (VAR A B) (READ (EXP (mul (A (B ()))))) (WRITE (EXP (peano (mul A B)))))
        (RULE (VAR A B) (READ (EXP (div (A (B ()))))) (WRITE (EXP (peano (div A B)))))
        
        (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \A)))
    )
    
    (FILE "bool.sv")
    (FILE "peano.sv")

    /normalize/
    
    (
        REWRITE
        
        (RULE (VAR A) (READ (EXP (\normalize \A))) (WRITE (EXP (return (norm A)))))
        
        (RULE (READ (EXP (norm ()))) (WRITE (EXP ())))
        (RULE (VAR a) (READ (EXP (norm a))) (WRITE (EXP a)))
        (RULE (VAR A) (READ (EXP (norm A))) (WRITE (EXP ((norm (HEADL A)) (norm (TAILL A))))))
        
        (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \A)))
    )
    
    /denormalize/
    
    (
        REWRITE
        
        (RULE (VAR A) (READ (EXP (\denormalize \A))) (WRITE (EXP (return (denorm A)))))
        
        (RULE (READ (EXP (denorm ()))) (WRITE (EXP ())))
        (RULE (VAR a) (READ (EXP (denorm a))) (WRITE (EXP a)))
        (RULE (VAR A B) (READ (EXP (denorm (A B)))) (WRITE (EXP (CONSL (denorm A) (denorm B)))))
        
        (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \A)))
    )
    
    /denormalize variables/
    
    (
        REWRITE
        
        (RULE (VAR A) (READ (EXP (\denormVars \A))) (WRITE (EXP (return (denorm1 A)))))
        
        (RULE (READ (EXP (denorm1 ()))) (WRITE (EXP ())))
        (RULE (VAR A) (READ (EXP (denorm1 ((A B) ())))) (WRITE (EXP (A (denormalize B)))))
        (RULE (VAR A B) (READ (EXP (denorm1 (A B)))) (WRITE (EXP (CONSL (denorm2 A) (denorm1 B)))))

        (RULE (VAR A B) (READ (EXP (denorm2 (A B)))) (WRITE (EXP (A (denormalize B)))))
            
        (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \A)))
    )
)

