
///
# Natural numbers

Natural numbers are the set of positive, whole numbers used for counting and ordering. They
begin with 1, 2, 3, and so on, extending infinitely without any fractions or decimals. In
mathematics, natural numbers are fundamental for basic arithmetic operations such as addition,
subtraction, multiplication, and division (except by zero). Some definitions (like this one)
also include zero in the set of natural numbers, depending on the context. These numbers play
an essential role in everyday life, from counting objects to organizing data, and form the
foundation for more advanced areas of mathematics like number theory and algebra.

Defined operations:
`succ`, `pred`, `add`, `sub`, `mul`, `div`, `mod`, `lt`, `eq`
///

(
    REWRITE
    
    (RULE (VAR A) (READ (EXP (\natnum \A))) (WRITE (EXP (return (binToDec (binary (decToBin A)))))))
    
    ///
    /trim leading zeroes/
    (RULE (VAR A) (READ (EXP (0 A))) (WRITE (EXP A)))
    ///
    
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
        (RULE (VAR a b) (READ (EXP (joinNum a b))) (WRITE (EXP (CONSA a b))))
        (RULE (VAR A b) (READ (EXP (joinNum (A b)))) (WRITE (EXP (CONSA (joinNum A) b))))

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

