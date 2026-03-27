
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

<expression> := <IDENTIFIER>
              | <NUMBER>
              | <ATOM>
              | <LIST>
              | (add <number> <number>)
              | (sub <number> <number>)
              | (mul <number> <number>)
              | (div <number> <number>)
              | (prepend <expression> <LIST>)
              | (append <LIST> <expression>)

   <boolean> := true
              | false
              | (eq <number> <number>)
              | (leq <number> <number>)
              | (not <boolean>)
              | (and <boolean> <boolean>)
              | (or <boolean> <boolean>)
```
///

(
    REWRITE
    
    (RULE (VAR A) (READ (EXP (\imp \A))) (WRITE (EXP (return (denormalize (getVar result (interpret (denormInstr (normalize A)))))))))

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
        
        (RULE (VAR A B Vars) (READ (EXP (do (while A B) Vars))) (WRITE (EXP (whlf (bounce (calc (replaceExp A Vars))) A B Vars))))
        (RULE (VAR A B Vars) (READ (EXP (whlf true A B Vars))) (WRITE (EXP (do (while A B) (do B Vars)))))
        (RULE (VAR A B Vars) (READ (EXP (whlf false A B Vars))) (WRITE (EXP Vars)))
        
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
        
        (RULE (VAR A B) (READ (EXP (eq (A (B ()))))) (WRITE (EXP (natnum (eq A B)))))
        (RULE (VAR A B) (READ (EXP (leq (A (B ()))))) (WRITE (EXP (or ((natnum (eq A B)) ((natnum (lt A B)) ()))))))
        
        (RULE (VAR A) (READ (EXP (not (A ())))) (WRITE (EXP (bool (not A)))))
        (RULE (VAR A B) (READ (EXP (and (A (B ()))))) (WRITE (EXP (bool (and A B)))))
        (RULE (VAR A B) (READ (EXP (or (A (B ()))))) (WRITE (EXP (bool (or A B)))))
    
        (RULE (VAR A B) (READ (EXP (add (A (B ()))))) (WRITE (EXP (natnum (add A B)))))
        (RULE (VAR A B) (READ (EXP (sub (A (B ()))))) (WRITE (EXP (natnum (sub A B)))))
        (RULE (VAR A B) (READ (EXP (mul (A (B ()))))) (WRITE (EXP (natnum (mul A B)))))
        (RULE (VAR A B) (READ (EXP (div (A (B ()))))) (WRITE (EXP (natnum (div A B)))))
        
        (RULE (VAR A B) (READ (EXP (prepend (A (B ()))))) (WRITE (EXP (A B))))
        (RULE (VAR A B C) (READ (EXP (append ((A B) (C ()))))) (WRITE (EXP (A (append (B (C ())))))))
        (RULE (VAR A) (READ (EXP (append (() (A ()))))) (WRITE (EXP (A ()))))
        
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

    /////////////////////////////
    / natural number arithmetic /
    /////////////////////////////
    
    (
        REWRITE
        
        (RULE (VAR A) (READ (EXP (\natnum \A))) (WRITE (EXP (return (binToDec (binary (decToBin A)))))))
        
        (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \A)))
        
        /////////////////////
        / decimal to binary /
        /////////////////////
        
        (
            REWRITE
            
            (RULE (VAR A) (READ (EXP (\decToBin \A))) (WRITE (EXP (return (decToBin (splitNum A))))))
            
            /constant/

            (RULE (READ (EXP ten)) (WRITE (EXP (((1 0) 1) 0))))
            
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
            
            (RULE (VAR X) (READ (EXP (decToBin (succ X)))) (WRITE (EXP (binAdd (decToBin X) 1))))
            (RULE (VAR X) (READ (EXP (decToBin (pred X)))) (WRITE (EXP (binSub (decToBin X) 1))))

            (RULE (VAR X Y) (READ (EXP (decToBin (add X Y)))) (WRITE (EXP (binAdd (decToBin X) (decToBin Y)))))
            (RULE (VAR X Y) (READ (EXP (decToBin (sub X Y)))) (WRITE (EXP (binSub (decToBin X) (decToBin Y)))))
            (RULE (VAR X Y) (READ (EXP (decToBin (mul X Y)))) (WRITE (EXP (binMul (decToBin X) (decToBin Y)))))
            (RULE (VAR X Y) (READ (EXP (decToBin (div X Y)))) (WRITE (EXP (binDiv (decToBin X) (decToBin Y)))))
            (RULE (VAR X Y) (READ (EXP (decToBin (mod X Y)))) (WRITE (EXP (binMod (decToBin X) (decToBin Y)))))
            
            (RULE (VAR X Y) (READ (EXP (decToBin (eq X Y)))) (WRITE (EXP (binEq (decToBin X) (decToBin Y)))))
            (RULE (VAR X Y) (READ (EXP (decToBin (lt X Y)))) (WRITE (EXP (binLt (decToBin X) (decToBin Y)))))
        
            /error/
            
            (RULE (VAR a) (READ (EXP (decToBin false))) (WRITE (EXP false)))

            /convert digit/
            
            (RULE (READ (EXP (decToBin 0))) (WRITE (EXP             0)))
            (RULE (READ (EXP (decToBin 1))) (WRITE (EXP             1)))
            (RULE (READ (EXP (decToBin 2))) (WRITE (EXP         (1 0))))
            (RULE (READ (EXP (decToBin 3))) (WRITE (EXP         (1 1))))
            (RULE (READ (EXP (decToBin 4))) (WRITE (EXP     ((1 0) 0))))
            (RULE (READ (EXP (decToBin 5))) (WRITE (EXP     ((1 0) 1))))
            (RULE (READ (EXP (decToBin 6))) (WRITE (EXP     ((1 1) 0))))
            (RULE (READ (EXP (decToBin 7))) (WRITE (EXP     ((1 1) 1))))
            (RULE (READ (EXP (decToBin 8))) (WRITE (EXP (((1 0) 0) 0))))
            (RULE (READ (EXP (decToBin 9))) (WRITE (EXP (((1 0) 0) 1))))
            
            /convert number/
            (
                RULE
                (VAR A b)
                (READ (EXP (decToBin (A b))))
                (WRITE (EXP (binAdd (binMul (decToBin A) ten) (decToBin b))))
            )
            
            (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \A)))
        )
            
        /////////////////////
        / binary to decimal /
        /////////////////////
        
        (
            REWRITE
            
            (RULE (VAR A) (READ (EXP (\binToDec \A))) (WRITE (EXP (return (joinNum (binToDec A))))))
            
            /constant/

            (RULE (READ (EXP ten)) (WRITE (EXP (((1 0) 1) 0))))

            /join digits/
            
            (RULE (VAR a) (READ (EXP (joinNum a))) (WRITE (EXP a)))
            (RULE (VAR a b) (READ (EXP (joinNum a b))) (WRITE (EXP (PREPENDA a b))))
            (RULE (VAR A b) (READ (EXP (joinNum (A b)))) (WRITE (EXP (PREPENDA (joinNum A) b))))

            /convert bool/
            
            (RULE (READ (EXP (binToDec true))) (WRITE (EXP true)))
            (RULE (READ (EXP (binToDec false))) (WRITE (EXP false)))

            /convert digit/
            
            /single-digit/
            (RULE (READ (EXP (binToDec             0))) (WRITE (EXP 0)))
            (RULE (READ (EXP (binToDec             1))) (WRITE (EXP 1)))
            (RULE (READ (EXP (binToDec         (1 0)))) (WRITE (EXP 2)))
            (RULE (READ (EXP (binToDec         (1 1)))) (WRITE (EXP 3)))
            (RULE (READ (EXP (binToDec     ((1 0) 0)))) (WRITE (EXP 4)))
            (RULE (READ (EXP (binToDec     ((1 0) 1)))) (WRITE (EXP 5)))
            (RULE (READ (EXP (binToDec     ((1 1) 0)))) (WRITE (EXP 6)))
            (RULE (READ (EXP (binToDec     ((1 1) 1)))) (WRITE (EXP 7)))
            (RULE (READ (EXP (binToDec (((1 0) 0) 0)))) (WRITE (EXP 8)))
            (RULE (READ (EXP (binToDec (((1 0) 0) 1)))) (WRITE (EXP 9)))
            
            /convert number/
            (
                RULE
                (VAR A)
                (READ (EXP (binToDec A)))
                (WRITE (EXP (binToDecHelper A (bounce (binary (binDiv A ten))))))
            )
            (
                RULE
                (VAR A B)
                (READ (EXP (binToDecHelper A B)))
                (WRITE (EXP ((binToDec B) (binToDec (bounce (binary (binSub A (binMul B ten))))))))
            )
            
            (RULE (VAR A) (READ (EXP (bounce A))) (WRITE (EXP (\bouncing \A))))
            (RULE (VAR A) (READ (EXP (\bouncing \A))) (WRITE (EXP A)))

            (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \A)))
        )
        
        /////////////////////
        / binary operations /
        /////////////////////
        
        (
            REWRITE

            (RULE (VAR A) (READ (EXP (\binary \A))) (WRITE (EXP (return A))))

            ///
            binary number addition
            ///
            
            /error/
            (RULE (VAR A) (READ (EXP (binAdd false A))) (WRITE (EXP false)))
            (RULE (VAR A) (READ (EXP (binAdd A false))) (WRITE (EXP false)))
            
            /both numbers single digits/
            (RULE           (READ (EXP (binAdd     0     0))) (WRITE (EXP                           0)))
            (RULE           (READ (EXP (binAdd     0     1))) (WRITE (EXP                           1)))
            (RULE           (READ (EXP (binAdd     1     0))) (WRITE (EXP                           1)))
            (RULE           (READ (EXP (binAdd     1     1))) (WRITE (EXP (                      1 0))))
            
            /first number multiple digits, second number single digit/
            (RULE (VAR A  ) (READ (EXP (binAdd (A 0)     0))) (WRITE (EXP (                      A 0))))
            (RULE (VAR A  ) (READ (EXP (binAdd (A 0)     1))) (WRITE (EXP (                      A 1))))
            (RULE (VAR A  ) (READ (EXP (binAdd (A 1)     0))) (WRITE (EXP (                      A 1))))
            (RULE (VAR A  ) (READ (EXP (binAdd (A 1)     1))) (WRITE (EXP (           (binAdd 1 A) 0))))
            
            /first number single digit, second number multiple digits/
            (RULE (VAR B  ) (READ (EXP (binAdd     0 (B 0)))) (WRITE (EXP (                      B 0))))
            (RULE (VAR B  ) (READ (EXP (binAdd     0 (B 1)))) (WRITE (EXP (                      B 1))))
            (RULE (VAR B  ) (READ (EXP (binAdd     1 (B 0)))) (WRITE (EXP (                      B 1))))
            (RULE (VAR B  ) (READ (EXP (binAdd     1 (B 1)))) (WRITE (EXP (           (binAdd 1 B) 0))))
            
            /both numbers multiple digits/
            (RULE (VAR A B) (READ (EXP (binAdd (A 0) (B 0)))) (WRITE (EXP (           (binAdd A B) 0))))
            (RULE (VAR A B) (READ (EXP (binAdd (A 0) (B 1)))) (WRITE (EXP (           (binAdd A B) 1))))
            (RULE (VAR A B) (READ (EXP (binAdd (A 1) (B 0)))) (WRITE (EXP (           (binAdd A B) 1))))
            (RULE (VAR A B) (READ (EXP (binAdd (A 1) (B 1)))) (WRITE (EXP ((binAdd 1 (binAdd A B)) 0))))
            
            ///
            binary number subtraction
            ///
            
            /error/
            (RULE (VAR A) (READ (EXP (binSub false A))) (WRITE (EXP false)))
            (RULE (VAR A) (READ (EXP (binSub A false))) (WRITE (EXP false)))
            
            /both numbers single digits/
            (RULE           (READ (EXP (binSub     0     0))) (WRITE (EXP                           0)))
            (RULE           (READ (EXP (binSub     0     1))) (WRITE (EXP                       false)))
            (RULE           (READ (EXP (binSub     1     0))) (WRITE (EXP                           1)))
            (RULE           (READ (EXP (binSub     1     1))) (WRITE (EXP                           0)))
            
            /first number multiple digits, second number single digit/
            (RULE (VAR A  ) (READ (EXP (binSub (A 0)     0))) (WRITE (EXP (                      A 0))))
            (RULE (VAR A  ) (READ (EXP (binSub (A 0)     1))) (WRITE (EXP (           (binSub A 1) 1))))
            (RULE (VAR A  ) (READ (EXP (binSub (A 1)     0))) (WRITE (EXP (                      A 1))))
            (RULE (VAR A  ) (READ (EXP (binSub (A 1)     1))) (WRITE (EXP (                      A 0))))
            
            /first number single digit, second number multiple digits/
            (RULE (VAR B  ) (READ (EXP (binSub     0 (B 0)))) (WRITE (EXP (           (binSub 0 B) 0))))
            (RULE (VAR B  ) (READ (EXP (binSub     0 (B 1)))) (WRITE (EXP                       false)))
            (RULE (VAR B  ) (READ (EXP (binSub     1 (B 0)))) (WRITE (EXP (           (binSub 0 B) 1))))
            (RULE (VAR B  ) (READ (EXP (binSub     1 (B 1)))) (WRITE (EXP (           (binSub 0 B) 0))))
            
            /both numbers multiple digits/
            (RULE (VAR A B) (READ (EXP (binSub (A 0) (B 0)))) (WRITE (EXP (           (binSub A B) 0))))
            (RULE (VAR A B) (READ (EXP (binSub (A 0) (B 1)))) (WRITE (EXP ((binSub (binSub A 1) B) 1))))
            (RULE (VAR A B) (READ (EXP (binSub (A 1) (B 0)))) (WRITE (EXP (           (binSub A B) 1))))
            (RULE (VAR A B) (READ (EXP (binSub (A 1) (B 1)))) (WRITE (EXP (           (binSub A B) 0))))
            
            /reducing negative number/
            (RULE (VAR A) (READ (EXP (       false A))) (WRITE (EXP false)))
            (RULE (VAR A) (READ (EXP (binSub false A))) (WRITE (EXP false)))
            
            ///
            binary number multiplication
            ///
            
            /error/
            (RULE (VAR A) (READ (EXP (binMul false A))) (WRITE (EXP false)))
            (RULE (VAR A) (READ (EXP (binMul A false))) (WRITE (EXP false)))

            /multiplication/
            (RULE (VAR A B) (READ (EXP (binMul A     0))) (WRITE (EXP                           0)))
            (RULE (VAR A B) (READ (EXP (binMul A     1))) (WRITE (EXP                           A)))
            (RULE (VAR A B) (READ (EXP (binMul A (B 0)))) (WRITE (EXP            (binMul (A 0) B))))
            (RULE (VAR A B) (READ (EXP (binMul A (B 1)))) (WRITE (EXP (binAdd A (binMul (A 0) B)))))
            
            ///
            binary number division
            ///
            
            /trim leading zeroes/
            (RULE (VAR A) (READ (EXP (0 A))) (WRITE (EXP A)))

            /error/
            (RULE (VAR A) (READ (EXP (binDiv false A))) (WRITE (EXP false)))
            (RULE (VAR A) (READ (EXP (binDiv A false))) (WRITE (EXP false)))
            (RULE (VAR X) (READ (EXP (binDiv X 0))) (WRITE (EXP false)))
            
            /division/
            (RULE (VAR N D) (READ (EXP (binDiv N D))) (WRITE (EXP (binDivHelper1 0 0 (0 (insideOut N)) D))))
            
            (
                RULE
                (VAR Q R x N D)
                (READ (EXP (binDivHelper1 Q R (endian x) D)))
                (WRITE (EXP (binDivHelperEnd (binLt (R x) D) Q)))
            )
            (
                RULE
                (VAR Q R x N D)
                (READ (EXP (binDivHelper1 Q R (endian x N) D)))
                (WRITE (EXP (binDivHelper2 (binLt (R x) D) Q (R x) N D)))
            )
            (
                RULE
                (VAR Q R N D)
                (READ (EXP (binDivHelper2 true Q R N D)))
                (WRITE (EXP (binDivHelper1 (Q 0) R N D)))
            )
            (
                RULE
                (VAR ANY Q R N D)
                (READ (EXP (binDivHelper2 ANY Q R N D)))
                (WRITE (EXP (binDivHelper1 (Q 1) (binSub R D) N D)))
            )

            (
                RULE
                (VAR Q)
                (READ (EXP (binDivHelperEnd true Q)))
                (WRITE (EXP (Q 0)))
            )
            (
                RULE
                (VAR ANY Q)
                (READ (EXP (binDivHelperEnd ANY Q)))
                (WRITE (EXP (Q 1)))
            )
            
            (
                RULE
                (VAR A B C)
                (READ (EXP (insideOut ((A B) C))))
                (WRITE (EXP (insideOut (A (endian B C)))))
            )
            (
                RULE
                (VAR a)
                (READ (EXP (insideOut a)))
                (WRITE (EXP (endian a)))
            )
            (
                RULE
                (VAR a B)
                (READ (EXP (insideOut (a B))))
                (WRITE (EXP (endian a B)))
            )
            (
                RULE
                (VAR a b)
                (READ (EXP (endian a b)))
                (WRITE (EXP (endian a (endian b))))
            )
            
            ///
            binary number reminder
            ///
            
            (
                RULE
                (VAR A B)
                (READ (EXP (binMod A B)))
                (WRITE (EXP (binSub A (binMul (binDiv A B) B))))
            )
            
            ///
            less than predicate
            ///
            
            (RULE (VAR A B) (READ (EXP (binLt A B))) (WRITE (EXP (ltHlp (binSub A B)))))
            (RULE           (READ (EXP (ltHlp false))) (WRITE (EXP true)))
            (RULE (VAR A  ) (READ (EXP (ltHlp A))) (WRITE (EXP false)))
            
            ///
            equality predicate
            ///
            
            (RULE (VAR A B) (READ (EXP (binEq A B))) (WRITE (EXP (eqHlp (binSub A B)))))
            (RULE           (READ (EXP (eqHlp 0))) (WRITE (EXP true)))
            (RULE (VAR A  ) (READ (EXP (eqHlp A))) (WRITE (EXP false)))
            
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
        (RULE (VAR A B) (READ (EXP (denorm (A B)))) (WRITE (EXP (PREPENDL (denorm A) (denorm B)))))
        
        (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \A)))
    )
    
    /get variable/
    
    (
        REWRITE
        
        (RULE (VAR var Lst) (READ (EXP (\getVar \var \Lst))) (WRITE (EXP (return (getVar var Lst)))))
        
        (RULE (VAR name Value Lst) (READ (EXP (getVar name ((name Value) Lst)))) (WRITE (EXP Value)))
        (RULE (VAR name1 name2 Value Lst) (READ (EXP (getVar name1 ((name2 Value) Lst)))) (WRITE (EXP (getVar name1 Lst))))
        (RULE (VAR name) (READ (EXP (getVar name ()))) (WRITE (EXP ())))

        (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \A)))
    )
)

