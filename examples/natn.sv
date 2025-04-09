
///
operations on natural numbers: `add`, `sub`, `mul`, `div`
///

(
    REWRITE
    
    /workflow/
    (RULE (VAR A) (READ (EXP (\natNum \A))) (WRITE (EXP (computedBin (decToBin (splitNum A))))))
    (RULE (VAR A) (READ (EXP (computedBin A))) (WRITE (EXP (computedDec (joinNum (binToDec A))))))
    (RULE         (READ (EXP (computedDec neg))) (WRITE (EXP \"Natural number error")))
    (RULE (VAR A) (READ (EXP (computedDec A))) (WRITE (EXP \A)))

    /trim leading zeroes/
    (RULE (VAR A) (READ (EXP (0 A))) (WRITE (EXP A)))
    
    ////////////////
    / split number /
    ////////////////
    
    (RULE (VAR X Y) (READ (EXP (splitNum (add X Y)))) (WRITE (EXP (add (splitNum X) (splitNum Y)))))
    (RULE (VAR X Y) (READ (EXP (splitNum (sub X Y)))) (WRITE (EXP (sub (splitNum X) (splitNum Y)))))
    (RULE (VAR X Y) (READ (EXP (splitNum (mul X Y)))) (WRITE (EXP (mul (splitNum X) (splitNum Y)))))
    (RULE (VAR X Y) (READ (EXP (splitNum (div X Y)))) (WRITE (EXP (div (splitNum X) (splitNum Y)))))
    
    (RULE (VAR a) (READ (EXP (splitNum a))) (WRITE (EXP (splitNum (HEADA a) (TAILA a)))))
    (RULE (VAR A b) (READ (EXP (splitNum A NIL))) (WRITE (EXP A)))
    (RULE (VAR A b) (READ (EXP (splitNum A b))) (WRITE (EXP (splitNum (A (HEADA b)) (TAILA b)))))
    
    ///////////////
    / join number /
    ///////////////
    
    (RULE (VAR a) (READ (EXP (joinNum a))) (WRITE (EXP a)))
    (RULE (VAR a b) (READ (EXP (joinNum a b))) (WRITE (EXP (CONSA a b))))
    (RULE (VAR A b) (READ (EXP (joinNum (A b)))) (WRITE (EXP (CONSA (joinNum A) b))))

    /////////////////////////
    / expression conversion /
    /////////////////////////
    
    (RULE (VAR X Y) (READ (EXP (decToBin (add X Y)))) (WRITE (EXP (binAdd (decToBin X) (decToBin Y)))))
    (RULE (VAR X Y) (READ (EXP (decToBin (sub X Y)))) (WRITE (EXP (binSub (decToBin X) (decToBin Y)))))
    (RULE (VAR X Y) (READ (EXP (decToBin (mul X Y)))) (WRITE (EXP (binMul (decToBin X) (decToBin Y)))))
    (RULE (VAR X Y) (READ (EXP (decToBin (div X Y)))) (WRITE (EXP (binDiv (decToBin X) (decToBin Y)))))

    /////////////////////
    / number conversion /
    /////////////////////
    
    /constant/
    (RULE (READ (EXP ten)) (WRITE (EXP (((1 0) 1) 0))))
    
    ///
    decimal to binary
    ///
    
    /negative numbers/
    (RULE (VAR a) (READ (EXP (decToBin neg))) (WRITE (EXP neg)))

    /single-digit/
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
    
    /multi-digit/
    (
        RULE
        (VAR A b)
        (READ (EXP (decToBin (A b))))
        (WRITE (EXP (binAdd (binMul (decToBin A) ten) (decToBin b))))
    )
    
    ///
    binary to decimal
    ///
    
    /negative numbers/
    (RULE (VAR A) (READ (EXP (binToDec neg))) (WRITE (EXP neg)))

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
    
    /multi-digit/
    (
        RULE
        (VAR A)
        (READ (EXP (binToDec A)))
        (WRITE (EXP (binToDecHelper A (binDiv A ten))))
    )
    (
        RULE
        (VAR A B)
        (READ (EXP (binToDecHelper A B)))
        (WRITE (EXP ((binToDec B) (binToDec (binSub A (binMul B ten))))))
    )
    
    /////////////////////////////
    / binary numbers arithmetic /
    /////////////////////////////
    
    ///
    binary number addition
    ///
    
    /negative values/
    (RULE (VAR A) (READ (EXP (binAdd neg A))) (WRITE (EXP neg)))
    (RULE (VAR A) (READ (EXP (binAdd A neg))) (WRITE (EXP neg)))
    
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
    
    /negative values/
    (RULE (VAR A) (READ (EXP (binSub neg A))) (WRITE (EXP neg)))
    (RULE (VAR A) (READ (EXP (binSub A neg))) (WRITE (EXP neg)))
    
    /both numbers single digits/
    (RULE           (READ (EXP (binSub     0     0))) (WRITE (EXP                           0)))
    (RULE           (READ (EXP (binSub     0     1))) (WRITE (EXP                         neg)))
    (RULE           (READ (EXP (binSub     1     0))) (WRITE (EXP                           1)))
    (RULE           (READ (EXP (binSub     1     1))) (WRITE (EXP                           0)))
    
    /first number multiple digits, second number single digit/
    (RULE (VAR A  ) (READ (EXP (binSub (A 0)     0))) (WRITE (EXP (                      A 0))))
    (RULE (VAR A  ) (READ (EXP (binSub (A 0)     1))) (WRITE (EXP (           (binSub A 1) 1))))
    (RULE (VAR A  ) (READ (EXP (binSub (A 1)     0))) (WRITE (EXP (                      A 1))))
    (RULE (VAR A  ) (READ (EXP (binSub (A 1)     1))) (WRITE (EXP (                      A 0))))
    
    /first number single digit, second number multiple digits/
    (RULE (VAR B  ) (READ (EXP (binSub     0 (B 0)))) (WRITE (EXP (           (binSub 0 B) 0))))
    (RULE (VAR B  ) (READ (EXP (binSub     0 (B 1)))) (WRITE (EXP                         neg)))
    (RULE (VAR B  ) (READ (EXP (binSub     1 (B 0)))) (WRITE (EXP (           (binSub 0 B) 1))))
    (RULE (VAR B  ) (READ (EXP (binSub     1 (B 1)))) (WRITE (EXP (           (binSub 0 B) 0))))
    
    /both numbers multiple digits/
    (RULE (VAR A B) (READ (EXP (binSub (A 0) (B 0)))) (WRITE (EXP (           (binSub A B) 0))))
    (RULE (VAR A B) (READ (EXP (binSub (A 0) (B 1)))) (WRITE (EXP ((binSub (binSub A 1) B) 1))))
    (RULE (VAR A B) (READ (EXP (binSub (A 1) (B 0)))) (WRITE (EXP (           (binSub A B) 1))))
    (RULE (VAR A B) (READ (EXP (binSub (A 1) (B 1)))) (WRITE (EXP (           (binSub A B) 0))))
    
    /reducing negative number/
    (RULE (VAR A) (READ (EXP (       neg A))) (WRITE (EXP neg)))
    (RULE (VAR A) (READ (EXP (binSub neg A))) (WRITE (EXP neg)))
    
    ///
    binary number multiplication
    ///
    
    /negative values/
    (RULE (VAR A) (READ (EXP (binMul neg A))) (WRITE (EXP neg)))
    (RULE (VAR A) (READ (EXP (binMul A neg))) (WRITE (EXP neg)))

    /multiplication/
    (RULE (VAR A B) (READ (EXP (binMul A     0))) (WRITE (EXP                           0)))
    (RULE (VAR A B) (READ (EXP (binMul A     1))) (WRITE (EXP                           A)))
    (RULE (VAR A B) (READ (EXP (binMul A (B 0)))) (WRITE (EXP            (binMul (A 0) B))))
    (RULE (VAR A B) (READ (EXP (binMul A (B 1)))) (WRITE (EXP (binAdd A (binMul (A 0) B)))))
    
    ///
    binary number division
    ///
    
    /negative values/
    (RULE (VAR A) (READ (EXP (binDiv neg A))) (WRITE (EXP neg)))
    (RULE (VAR A) (READ (EXP (binDiv A neg))) (WRITE (EXP neg)))
    
    /division/
    (RULE (VAR X) (READ (EXP (binDiv X 0))) (WRITE (EXP neg)))
    
    (RULE (VAR N D) (READ (EXP (binDiv N D))) (WRITE (EXP (binDivHelper1 0 0 (0 (insideOut N)) D))))
    
    (
        RULE
        (VAR Q R x N D)
        (READ (EXP (binDivHelper1 Q R (endian x) D)))
        (WRITE (EXP (binDivHelperEnd (binCmp (R x) D) Q)))
    )
    (
        RULE
        (VAR Q R x N D)
        (READ (EXP (binDivHelper1 Q R (endian x N) D)))
        (WRITE (EXP (binDivHelper2 (binCmp (R x) D) Q (R x) N D)))
    )
    (
        RULE
        (VAR Q R N D)
        (READ (EXP (binDivHelper2 lt Q R N D)))
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
        (READ (EXP (binDivHelperEnd lt Q)))
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
    binary number comparison
    ///
    
    /both numbers single digits/
    (RULE           (READ (EXP (binCmp     0     0))) (WRITE (EXP                eq)))
    (RULE           (READ (EXP (binCmp     0     1))) (WRITE (EXP                lt)))
    (RULE           (READ (EXP (binCmp     1     0))) (WRITE (EXP                gt)))
    (RULE           (READ (EXP (binCmp     1     1))) (WRITE (EXP                eq)))
    
    /first number multiple digits, second number single digit/
    (RULE (VAR A  ) (READ (EXP (binCmp (A 0)     0))) (WRITE (EXP ((binCmp A 0) eq))))
    (RULE (VAR A  ) (READ (EXP (binCmp (A 0)     1))) (WRITE (EXP ((binCmp A 0) lt))))
    (RULE (VAR A  ) (READ (EXP (binCmp (A 1)     0))) (WRITE (EXP ((binCmp A 0) gt))))
    (RULE (VAR A  ) (READ (EXP (binCmp (A 1)     1))) (WRITE (EXP ((binCmp A 0) eq))))
    
    /first number single digit, second number multiple digits/
    (RULE (VAR B  ) (READ (EXP (binCmp     0 (B 0)))) (WRITE (EXP ((binCmp 0 B) eq))))
    (RULE (VAR B  ) (READ (EXP (binCmp     0 (B 1)))) (WRITE (EXP ((binCmp 0 B) lt))))
    (RULE (VAR B  ) (READ (EXP (binCmp     1 (B 0)))) (WRITE (EXP ((binCmp 0 B) gt))))
    (RULE (VAR B  ) (READ (EXP (binCmp     1 (B 1)))) (WRITE (EXP ((binCmp 0 B) eq))))
    
    /both numbers multiple digits/
    (RULE (VAR A B) (READ (EXP (binCmp (A 0) (B 0)))) (WRITE (EXP ((binCmp A B) eq))))
    (RULE (VAR A B) (READ (EXP (binCmp (A 0) (B 1)))) (WRITE (EXP ((binCmp A B) lt))))
    (RULE (VAR A B) (READ (EXP (binCmp (A 1) (B 0)))) (WRITE (EXP ((binCmp A B) gt))))
    (RULE (VAR A B) (READ (EXP (binCmp (A 1) (B 1)))) (WRITE (EXP ((binCmp A B) eq))))
    
    /reduce to final value/
    (RULE (VAR N) (READ (EXP (gt N))) (WRITE (EXP gt)))
    (RULE (VAR N) (READ (EXP (lt N))) (WRITE (EXP lt)))
    (RULE (VAR N) (READ (EXP (eq N))) (WRITE (EXP N)))
)

