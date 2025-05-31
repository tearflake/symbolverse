
///
# Peano arithmetic

Peano arithmetic is a simple and elegant foundational system for representing natural numbers and
defining arithmetic operations using a minimal set of symbols and rules. Named after the Italian
mathematician Giuseppe Peano, it encodes numbers starting from a base value `zero`, and builds
all other numbers by repeatedly applying a successor function, denoted as `(succ n)`. In this way,
`0` is represented by `zero`, `1` by `(succ zero)`, `2` by `(succ (succ zero))`, and so on. This
unary representation is conceptually simple and especially well-suited to systems like term rewriting
systems and formal proofs, where computation and reasoning are carried out by pattern matching and
rule application.

Peano arithmetic also defines basic arithmetic operations like addition, subtraction, multiplication,
and comparison through recursive rules based on these representations. For example, addition can be
expressed as: adding zero to a number yields the number itself, and adding the successor of a number
is equivalent to taking the successor of the sum. Though Peano arithmetic is not efficient for
practical computations (since numbers grow linearly with their value), its simplicity makes it ideal
for exploring the foundations of arithmetic, proving properties of numbers, and implementing symbolic
computations in systems like term rewriting systems, logic programming, and proof assistants. It
elegantly captures the essence of natural numbers and their behavior using nothing more than zero,
succ, and recursive definitions.

Operations defined in this example:
`succ`, `pred`, `add`, `sub`, `mul`, `div`, `mod`, `lt`, `eq`
///

(
    DREWRITE
    
    (RULE (VAR A) (READ (EXP (\peano \A))) (WRITE (EXP (return (unToDec (unary (decToUn A)))))))

    (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \A)))
    
    ////////////////////
    / decimal to unary /
    ////////////////////
    
    (
        DREWRITE
        
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
        DREWRITE
        
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
        DREWRITE

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

