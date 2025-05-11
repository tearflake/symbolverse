
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

<assignment> := (asgn <IDENTIFIER> <expression>)

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
        
        (RULE (VAR A B) (READ (EXP (asgn (A (B ()))))) (WRITE (EXP (asgn A B))))
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
        
        (RULE (VAR A B Vars) (READ (EXP (do (asgn A B) Vars))) (WRITE (EXP (bounce (calc (doAssign A B Vars))))))
        
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
    
    ///////////////////////
    / computation wrapper /
    ///////////////////////
    
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
    
    ///////////////////
    / Boolean algebra /
    ///////////////////
    
    (
        REWRITE
        (RULE (VAR A) (READ (EXP (\bool \A))) (WRITE (EXP (return A))))
        
        /truth table for `not` operator/
        (RULE (READ (EXP (not true ))) (WRITE (EXP false)))
        (RULE (READ (EXP (not false))) (WRITE (EXP true )))
        
        /truth table for `and` operator/
        (RULE (READ (EXP (and true  true ))) (WRITE (EXP true )))
        (RULE (READ (EXP (and true  false))) (WRITE (EXP false)))
        (RULE (READ (EXP (and false true ))) (WRITE (EXP false)))
        (RULE (READ (EXP (and false false))) (WRITE (EXP false)))
        
        /truth table for `or` operator/
        (RULE (READ (EXP (or true  true ))) (WRITE (EXP true )))
        (RULE (READ (EXP (or true  false))) (WRITE (EXP true )))
        (RULE (READ (EXP (or false true ))) (WRITE (EXP true )))
        (RULE (READ (EXP (or false false))) (WRITE (EXP false)))
        
        (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \A)))
    )

    ////////////////////
    / Peano arithmetic /
    ////////////////////
    
    (
        REWRITE
        
        (RULE (VAR A) (READ (EXP (\peano \A))) (WRITE (EXP (return (unToDec (unary (decToUn A)))))))

        (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \A)))
        
        ////////////////////
        / decimal to unary /
        ////////////////////
        
        (
            REWRITE
            
            (RULE (VAR A) (READ (EXP (\decToUn \A))) (WRITE (EXP (return (decToUn (splitNum A))))))
            
            /constant/
            
            (RULE (READ (EXP ten)) (WRITE (EXP (unSucc (unSucc (unSucc (unSucc (unSucc (unSucc (unSucc (unSucc (unSucc (unSucc zero)))))))))))))
            
            /split number/
            
            (RULE (VAR X) (READ (EXP (splitNum (succ X)))) (WRITE (EXP (succ (splitNum X)))))
            (RULE (VAR X) (READ (EXP (splitNum (pred X)))) (WRITE (EXP (pred (splitNum X)))))
        
            (RULE (VAR X Y) (READ (EXP (splitNum (add X Y)))) (WRITE (EXP (add (splitNum X) (splitNum Y)))))
            (RULE (VAR X Y) (READ (EXP (splitNum (sub X Y)))) (WRITE (EXP (sub (splitNum X) (splitNum Y)))))
            (RULE (VAR X Y) (READ (EXP (splitNum (mul X Y)))) (WRITE (EXP (mul (splitNum X) (splitNum Y)))))
            (RULE (VAR X Y) (READ (EXP (splitNum (div X Y)))) (WRITE (EXP (div (splitNum X) (splitNum Y)))))
            (RULE (VAR X Y) (READ (EXP (splitNum (mod X Y)))) (WRITE (EXP (mod (splitNum X) (splitNum Y)))))
            
            (RULE (VAR X Y) (READ (EXP (splitNum (eq X Y)))) (WRITE (EXP (eq (splitNum X) (splitNum Y)))))
            (RULE (VAR X Y) (READ (EXP (splitNum (lt X Y)))) (WRITE (EXP (lt (splitNum X) (splitNum Y)))))
            
            (RULE (VAR a) (READ (EXP (splitNum a))) (WRITE (EXP (splitNum (HEADA a) (TAILA a)))))
            (RULE (VAR A b) (READ (EXP (splitNum A NIL))) (WRITE (EXP A)))
            (RULE (VAR A b) (READ (EXP (splitNum A b))) (WRITE (EXP (splitNum (A (HEADA b)) (TAILA b)))))
            
            /convert function/
            
            (RULE (VAR X) (READ (EXP (decToUn (succ X)))) (WRITE (EXP (unSucc (decToUn X)))))
            (RULE (VAR X) (READ (EXP (decToUn (pred X)))) (WRITE (EXP (unPred (decToUn X)))))
            
            (RULE (VAR X Y) (READ (EXP (decToUn (add X Y)))) (WRITE (EXP (unAdd (decToUn X) (decToUn Y)))))
            (RULE (VAR X Y) (READ (EXP (decToUn (sub X Y)))) (WRITE (EXP (unSub (decToUn X) (decToUn Y)))))
            (RULE (VAR X Y) (READ (EXP (decToUn (mul X Y)))) (WRITE (EXP (unMul (decToUn X) (decToUn Y)))))
            (RULE (VAR X Y) (READ (EXP (decToUn (div X Y)))) (WRITE (EXP (unDiv (decToUn X) (decToUn Y)))))
            (RULE (VAR X Y) (READ (EXP (decToUn (mod X Y)))) (WRITE (EXP (unMod (decToUn X) (decToUn Y)))))
            
            (RULE (VAR X Y) (READ (EXP (decToUn (lt X Y)))) (WRITE (EXP (unLt (decToUn X) (decToUn Y)))))
            (RULE (VAR X Y) (READ (EXP (decToUn (eq X Y)))) (WRITE (EXP (unEq (decToUn X) (decToUn Y)))))
        
            /convert digit/
            
            (RULE (READ (EXP (decToUn 0))) (WRITE (EXP zero)))
            (RULE (READ (EXP (decToUn 1))) (WRITE (EXP (unSucc zero))))
            (RULE (READ (EXP (decToUn 2))) (WRITE (EXP (unSucc (unSucc zero)))))
            (RULE (READ (EXP (decToUn 3))) (WRITE (EXP (unSucc (unSucc (unSucc zero))))))
            (RULE (READ (EXP (decToUn 4))) (WRITE (EXP (unSucc (unSucc (unSucc (unSucc zero)))))))
            (RULE (READ (EXP (decToUn 5))) (WRITE (EXP (unSucc (unSucc (unSucc (unSucc (unSucc zero))))))))
            (RULE (READ (EXP (decToUn 6))) (WRITE (EXP (unSucc (unSucc (unSucc (unSucc (unSucc (unSucc zero)))))))))
            (RULE (READ (EXP (decToUn 7))) (WRITE (EXP (unSucc (unSucc (unSucc (unSucc (unSucc (unSucc (unSucc zero))))))))))
            (RULE (READ (EXP (decToUn 8))) (WRITE (EXP (unSucc (unSucc (unSucc (unSucc (unSucc (unSucc (unSucc (unSucc zero)))))))))))
            (RULE (READ (EXP (decToUn 9))) (WRITE (EXP (unSucc (unSucc (unSucc (unSucc (unSucc (unSucc (unSucc (unSucc (unSucc zero))))))))))))
            
            /convert number/
            
            (
                RULE
                (VAR A b)
                (READ (EXP (decToUn (A b))))
                (WRITE (EXP (bounce (unary (unAdd (unMul (decToUn A) ten) (decToUn b))))))
            )
            
            (RULE (VAR A) (READ (EXP (bounce A))) (WRITE (EXP (\bouncing \A))))
            (RULE (VAR A) (READ (EXP (\bouncing \A))) (WRITE (EXP A)))
            
            (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \A)))
        )
        
        ////////////////////
        / unary to decimal /
        ////////////////////
        
        (
            REWRITE
            
            (RULE (VAR A) (READ (EXP (\unToDec \A))) (WRITE (EXP (return (joinNum (unToDec A))))))
            
            /constant/
            
            (RULE (READ (EXP ten)) (WRITE (EXP (unSucc (unSucc (unSucc (unSucc (unSucc (unSucc (unSucc (unSucc (unSucc (unSucc zero)))))))))))))
            
            /join digits/
            
            (RULE (VAR a) (READ (EXP (joinNum a))) (WRITE (EXP a)))
            (RULE (VAR a b) (READ (EXP (joinNum a b))) (WRITE (EXP (CONSA a b))))
            (RULE (VAR A b) (READ (EXP (joinNum (A b)))) (WRITE (EXP (CONSA (joinNum A) b))))
            
            /convert bool/
            
            (RULE (READ (EXP (unToDec true))) (WRITE (EXP true)))
            (RULE (READ (EXP (unToDec false))) (WRITE (EXP false)))
            
            /convert digit/
            
            (RULE (READ (EXP (unToDec zero))) (WRITE (EXP 0)))
            (RULE (READ (EXP (unToDec (unSucc zero)))) (WRITE (EXP 1)))
            (RULE (READ (EXP (unToDec (unSucc (unSucc zero))))) (WRITE (EXP 2)))
            (RULE (READ (EXP (unToDec (unSucc (unSucc (unSucc zero)))))) (WRITE (EXP 3)))
            (RULE (READ (EXP (unToDec (unSucc (unSucc (unSucc (unSucc zero))))))) (WRITE (EXP 4)))
            (RULE (READ (EXP (unToDec (unSucc (unSucc (unSucc (unSucc (unSucc zero)))))))) (WRITE (EXP 5)))
            (RULE (READ (EXP (unToDec (unSucc (unSucc (unSucc (unSucc (unSucc (unSucc zero))))))))) (WRITE (EXP 6)))
            (RULE (READ (EXP (unToDec (unSucc (unSucc (unSucc (unSucc (unSucc (unSucc (unSucc zero)))))))))) (WRITE (EXP 7)))
            (RULE (READ (EXP (unToDec (unSucc (unSucc (unSucc (unSucc (unSucc (unSucc (unSucc (unSucc zero))))))))))) (WRITE (EXP 8)))
            (RULE (READ (EXP (unToDec (unSucc (unSucc (unSucc (unSucc (unSucc (unSucc (unSucc (unSucc (unSucc zero)))))))))))) (WRITE (EXP 9)))
            
            /convert number/
            
            (
                RULE
                (VAR A B)
                (READ (EXP (unToDec A)))
                (WRITE (EXP ((unToDec (bounce (unary (unDiv A ten)))) (unToDec (bounce (unary (unMod A ten)))))))
            )
            
            (RULE (VAR A) (READ (EXP (bounce A))) (WRITE (EXP (\bouncing \A))))
            (RULE (VAR A) (READ (EXP (\bouncing \A))) (WRITE (EXP A)))
            
            (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \A)))
        )
        
        ////////////////////
        / unary operations /
        ////////////////////
        
        (
            REWRITE

            (RULE (VAR A) (READ (EXP (\unary \A))) (WRITE (EXP (return A))))
            
            (RULE (READ (EXP (unPred zero))) (WRITE (EXP zero)))
            (RULE (VAR X) (READ (EXP (unPred (unSucc X)))) (WRITE (EXP X)))
            
            (RULE (VAR Y) (READ (EXP (unAdd zero Y))) (WRITE (EXP Y)))
            (RULE (VAR X Y) (READ (EXP (unAdd (unSucc X) Y))) (WRITE (EXP (unSucc (unAdd X Y)))))
            
            (RULE (VAR X) (READ (EXP (unSub X zero))) (WRITE (EXP X)))
            (RULE (VAR Y) (READ (EXP (unSub zero Y))) (WRITE (EXP zero)))
            (RULE (VAR X Y) (READ (EXP (unSub (unSucc X) (unSucc Y)))) (WRITE (EXP (unSub X Y))))
            
            (RULE (VAR Y) (READ (EXP (unMul zero Y))) (WRITE (EXP zero)))
            (RULE (VAR X Y) (READ (EXP (unMul (unSucc X) Y))) (WRITE (EXP (unAdd Y (unMul X Y)))))
            
            (RULE (VAR X Y) (READ (EXP (unDiv X Y))) (WRITE (EXP (unDivHelper (unLt X Y) X Y))))
            (RULE (VAR X Y) (READ (EXP (unDivHelper true X Y))) (WRITE (EXP zero)))
            (RULE (VAR X Y) (READ (EXP (unDivHelper false X Y))) (WRITE (EXP (unSucc (unDiv (unSub X Y) Y)))))
            
            (RULE (VAR X Y) (READ (EXP (unMod X Y))) (WRITE (EXP (unModHelper (unLt X Y) X Y))))
            (RULE (VAR X Y) (READ (EXP (unModHelper true X Y))) (WRITE (EXP X)))
            (RULE (VAR X Y) (READ (EXP (unModHelper false X Y))) (WRITE (EXP (unMod (unSub X Y) Y))))
            
            (RULE (READ (EXP (unLt zero zero))) (WRITE (EXP false)))
            (RULE (VAR Y) (READ (EXP (unLt zero (unSucc Y)))) (WRITE (EXP true)))
            (RULE (VAR X) (READ (EXP (unLt (unSucc X) zero))) (WRITE (EXP false)))
            (RULE (VAR X Y) (READ (EXP (unLt (unSucc X) (unSucc Y)))) (WRITE (EXP (unLt X Y))))
            
            (RULE (READ (EXP (unEq zero zero))) (WRITE (EXP true)))
            (RULE (VAR Y) (READ (EXP (unEq zero (unSucc Y)))) (WRITE (EXP false)))
            (RULE (VAR X) (READ (EXP (unEq (unSucc X) zero))) (WRITE (EXP false)))
            (RULE (VAR X Y) (READ (EXP (unEq (unSucc X) (unSucc Y)))) (WRITE (EXP (unEq X Y))))
            
            (RULE (VAR A) (READ (EXP (if true A B))) (WRITE (EXP A)))
            (RULE (VAR A) (READ (EXP (if false A B))) (WRITE (EXP B)))
            
            (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \A)))
        )
    )
    
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

