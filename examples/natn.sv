
///
operations on natural numbers: `add`, `sub`, `mul`, `div`
///

(
    REWRITE
    
    /workflow/
    (RULE (VAR A) (READ (\natNum \A)) (WRITE (computedBin (decToBin (splitNum A)))))
    (RULE (VAR A) (READ (computedBin A)) (WRITE (computedDec (joinNum (binToDec A)))))
    (RULE         (READ (computedDec neg)) (WRITE \"Natural number error"))
    (RULE (VAR A) (READ (computedDec A)) (WRITE \A))

    /trim leading zeroes/
    (RULE (VAR A) (READ (0 A)) (WRITE A))
        
    ////////////////
    / split number /
    ////////////////
    
    (RULE (VAR X Y) (READ (splitNum (add X Y))) (WRITE (add (splitNum X) (splitNum Y))))
    (RULE (VAR X Y) (READ (splitNum (sub X Y))) (WRITE (sub (splitNum X) (splitNum Y))))
    (RULE (VAR X Y) (READ (splitNum (mul X Y))) (WRITE (mul (splitNum X) (splitNum Y))))
    (RULE (VAR X Y) (READ (splitNum (div X Y))) (WRITE (div (splitNum X) (splitNum Y))))
    
    (RULE (VAR a) (READ (splitNum a)) (WRITE (splitNum (HEADA a) (TAILA a))))
    (RULE (VAR A b) (READ (splitNum A NIL)) (WRITE A))
    (RULE (VAR A b) (READ (splitNum A b)) (WRITE (splitNum (A (HEADA b)) (TAILA b))))
    
    ///////////////
    / join number /
    ///////////////
    
    (RULE (VAR a) (READ (joinNum a)) (WRITE a))
    (RULE (VAR a b) (READ (joinNum a b)) (WRITE (CONSA a b)))
    (RULE (VAR A b) (READ (joinNum (A b))) (WRITE (CONSA (joinNum A) b)))

    /////////////////////////
    / expression conversion /
    /////////////////////////
    
    (RULE (VAR X Y) (READ (decToBin (add X Y))) (WRITE (binAdd (decToBin X) (decToBin Y))))
    (RULE (VAR X Y) (READ (decToBin (sub X Y))) (WRITE (binSub (decToBin X) (decToBin Y))))
    (RULE (VAR X Y) (READ (decToBin (mul X Y))) (WRITE (binMul (decToBin X) (decToBin Y))))
    (RULE (VAR X Y) (READ (decToBin (div X Y))) (WRITE (binDiv (decToBin X) (decToBin Y))))

    /////////////////////
    / number conversion /
    /////////////////////
    
    /constant/
    (RULE (READ ten) (WRITE (((1 0) 1) 0)))
    
    ///
    decimal to binary
    ///
    
    /negative numbers/
    (RULE (VAR a) (READ (decToBin neg)) (WRITE neg))

    /single-digit/
    (RULE (READ (decToBin 0)) (WRITE             0))
    (RULE (READ (decToBin 1)) (WRITE             1))
    (RULE (READ (decToBin 2)) (WRITE         (1 0)))
    (RULE (READ (decToBin 3)) (WRITE         (1 1)))
    (RULE (READ (decToBin 4)) (WRITE     ((1 0) 0)))
    (RULE (READ (decToBin 5)) (WRITE     ((1 0) 1)))
    (RULE (READ (decToBin 6)) (WRITE     ((1 1) 0)))
    (RULE (READ (decToBin 7)) (WRITE     ((1 1) 1)))
    (RULE (READ (decToBin 8)) (WRITE (((1 0) 0) 0)))
    (RULE (READ (decToBin 9)) (WRITE (((1 0) 0) 1)))
    
    /multi-digit/
    (
        RULE
        (VAR A b)
        (READ (decToBin (A b)))
        (WRITE (binAdd (binMul (decToBin A) ten) (decToBin b)))
    )
    
    ///
    binary to decimal
    ///
    
    /negative numbers/
    (RULE (VAR A) (READ (binToDec neg)) (WRITE neg))

    /single-digit/
    (RULE (READ (binToDec             0)) (WRITE 0))
    (RULE (READ (binToDec             1)) (WRITE 1))
    (RULE (READ (binToDec         (1 0))) (WRITE 2))
    (RULE (READ (binToDec         (1 1))) (WRITE 3))
    (RULE (READ (binToDec     ((1 0) 0))) (WRITE 4))
    (RULE (READ (binToDec     ((1 0) 1))) (WRITE 5))
    (RULE (READ (binToDec     ((1 1) 0))) (WRITE 6))
    (RULE (READ (binToDec     ((1 1) 1))) (WRITE 7))
    (RULE (READ (binToDec (((1 0) 0) 0))) (WRITE 8))
    (RULE (READ (binToDec (((1 0) 0) 1))) (WRITE 9))
    
    /multi-digit/
    (
        RULE
        (VAR A)
        (READ (binToDec A))
        (WRITE (binToDecHelper A (binDiv A ten)))
    )
    (
        RULE
        (VAR A B)
        (READ (binToDecHelper A B))
        (WRITE ((binToDec B) (binToDec (binSub A (binMul B ten)))))
    )
    
    /////////////////////////////
    / binary numbers arithmetic /
    /////////////////////////////
    
    ///
    binary number addition
    ///
    
    /negative values/
    (RULE (VAR A) (READ (binAdd neg A)) (WRITE neg))
    (RULE (VAR A) (READ (binAdd A neg)) (WRITE neg))
    
    /both numbers single digits/
    (RULE           (READ (binAdd     0     0)) (WRITE                           0))
    (RULE           (READ (binAdd     0     1)) (WRITE                           1))
    (RULE           (READ (binAdd     1     0)) (WRITE                           1))
    (RULE           (READ (binAdd     1     1)) (WRITE (                      1 0)))
    
    /first number multiple digits, second number single digit/
    (RULE (VAR A  ) (READ (binAdd (A 0)     0)) (WRITE (                      A 0)))
    (RULE (VAR A  ) (READ (binAdd (A 0)     1)) (WRITE (                      A 1)))
    (RULE (VAR A  ) (READ (binAdd (A 1)     0)) (WRITE (                      A 1)))
    (RULE (VAR A  ) (READ (binAdd (A 1)     1)) (WRITE (           (binAdd 1 A) 0)))
    
    /first number single digit, second number multiple digits/
    (RULE (VAR B  ) (READ (binAdd     0 (B 0))) (WRITE (                      B 0)))
    (RULE (VAR B  ) (READ (binAdd     0 (B 1))) (WRITE (                      B 1)))
    (RULE (VAR B  ) (READ (binAdd     1 (B 0))) (WRITE (                      B 1)))
    (RULE (VAR B  ) (READ (binAdd     1 (B 1))) (WRITE (           (binAdd 1 B) 0)))
    
    /both numbers multiple digits/
    (RULE (VAR A B) (READ (binAdd (A 0) (B 0))) (WRITE (           (binAdd A B) 0)))
    (RULE (VAR A B) (READ (binAdd (A 0) (B 1))) (WRITE (           (binAdd A B) 1)))
    (RULE (VAR A B) (READ (binAdd (A 1) (B 0))) (WRITE (           (binAdd A B) 1)))
    (RULE (VAR A B) (READ (binAdd (A 1) (B 1))) (WRITE ((binAdd 1 (binAdd A B)) 0)))
    
    ///
    binary number subtraction
    ///
    
    /negative values/
    (RULE (VAR A) (READ (binSub neg A)) (WRITE neg))
    (RULE (VAR A) (READ (binSub A neg)) (WRITE neg))
    
    /both numbers single digits/
    (RULE           (READ (binSub     0     0)) (WRITE                           0))
    (RULE           (READ (binSub     0     1)) (WRITE                         neg))
    (RULE           (READ (binSub     1     0)) (WRITE                           1))
    (RULE           (READ (binSub     1     1)) (WRITE                           0))
    
    /first number multiple digits, second number single digit/
    (RULE (VAR A  ) (READ (binSub (A 0)     0)) (WRITE (                      A 0)))
    (RULE (VAR A  ) (READ (binSub (A 0)     1)) (WRITE (           (binSub A 1) 1)))
    (RULE (VAR A  ) (READ (binSub (A 1)     0)) (WRITE (                      A 1)))
    (RULE (VAR A  ) (READ (binSub (A 1)     1)) (WRITE (                      A 0)))
    
    /first number single digit, second number multiple digits/
    (RULE (VAR B  ) (READ (binSub     0 (B 0))) (WRITE (           (binSub 0 B) 0)))
    (RULE (VAR B  ) (READ (binSub     0 (B 1))) (WRITE                         neg))
    (RULE (VAR B  ) (READ (binSub     1 (B 0))) (WRITE (           (binSub 0 B) 1)))
    (RULE (VAR B  ) (READ (binSub     1 (B 1))) (WRITE (           (binSub 0 B) 0)))
    
    /both numbers multiple digits/
    (RULE (VAR A B) (READ (binSub (A 0) (B 0))) (WRITE (           (binSub A B) 0)))
    (RULE (VAR A B) (READ (binSub (A 0) (B 1))) (WRITE ((binSub (binSub A 1) B) 1)))
    (RULE (VAR A B) (READ (binSub (A 1) (B 0))) (WRITE (           (binSub A B) 1)))
    (RULE (VAR A B) (READ (binSub (A 1) (B 1))) (WRITE (           (binSub A B) 0)))
    
    /reducing negative number/
    (RULE (VAR A) (READ (       neg A)) (WRITE neg))
    (RULE (VAR A) (READ (binSub neg A)) (WRITE neg))
    
    ///
    binary number multiplication
    ///
    
    /negative values/
    (RULE (VAR A) (READ (binMul neg A)) (WRITE neg))
    (RULE (VAR A) (READ (binMul A neg)) (WRITE neg))

    /multiplication/
    (RULE (VAR A B) (READ (binMul A     0)) (WRITE                           0))
    (RULE (VAR A B) (READ (binMul A     1)) (WRITE                           A))
    (RULE (VAR A B) (READ (binMul A (B 0))) (WRITE            (binMul (A 0) B)))
    (RULE (VAR A B) (READ (binMul A (B 1))) (WRITE (binAdd A (binMul (A 0) B))))
    
    ///
    binary number division
    ///
    
    /negative values/
    (RULE (VAR A) (READ (binDiv neg A)) (WRITE neg))
    (RULE (VAR A) (READ (binDiv A neg)) (WRITE neg))
    
    /division/
    (RULE (VAR X) (READ (binDiv X 0)) (WRITE neg))
    
    (RULE (VAR N D) (READ (binDiv N D)) (WRITE (binDivHelper1 0 0 (0 (insideOut N)) D)))
    
    (
        RULE
        (VAR Q R x N D)
        (READ (binDivHelper1 Q R (endian x) D))
        (WRITE (binDivHelperEnd (binCmp (R x) D) Q))
    )
    (
        RULE
        (VAR Q R x N D)
        (READ (binDivHelper1 Q R (endian x N) D))
        (WRITE (binDivHelper2 (binCmp (R x) D) Q (R x) N D))
    )
    (
        RULE
        (VAR Q R N D)
        (READ (binDivHelper2 lt Q R N D))
        (WRITE (binDivHelper1 (Q 0) R N D))
    )
    (
        RULE
        (VAR ANY Q R N D)
        (READ (binDivHelper2 ANY Q R N D))
        (WRITE (binDivHelper1 (Q 1) (binSub R D) N D))
    )

    (
        RULE
        (VAR Q)
        (READ (binDivHelperEnd lt Q))
        (WRITE (Q 0))
    )
    (
        RULE
        (VAR ANY Q)
        (READ (binDivHelperEnd ANY Q))
        (WRITE (Q 1))
    )
    
    (
        RULE
        (VAR A B C)
        (READ (insideOut ((A B) C)))
        (WRITE (insideOut (A (endian B C))))
    )
    (
        RULE
        (VAR a)
        (READ (insideOut a))
        (WRITE (endian a))
    )
    (
        RULE
        (VAR a B)
        (READ (insideOut (a B)))
        (WRITE (endian a B))
    )
    (
        RULE
        (VAR a b)
        (READ (endian a b))
        (WRITE (endian a (endian b)))
    )
    
    ///
    binary number comparison
    ///
    
    /both numbers single digits/
    (RULE           (READ (binCmp     0     0)) (WRITE                eq))
    (RULE           (READ (binCmp     0     1)) (WRITE                lt))
    (RULE           (READ (binCmp     1     0)) (WRITE                gt))
    (RULE           (READ (binCmp     1     1)) (WRITE                eq))
    
    /first number multiple digits, second number single digit/
    (RULE (VAR A  ) (READ (binCmp (A 0)     0)) (WRITE ((binCmp A 0) eq)))
    (RULE (VAR A  ) (READ (binCmp (A 0)     1)) (WRITE ((binCmp A 0) lt)))
    (RULE (VAR A  ) (READ (binCmp (A 1)     0)) (WRITE ((binCmp A 0) gt)))
    (RULE (VAR A  ) (READ (binCmp (A 1)     1)) (WRITE ((binCmp A 0) eq)))
    
    /first number single digit, second number multiple digits/
    (RULE (VAR B  ) (READ (binCmp     0 (B 0))) (WRITE ((binCmp 0 B) eq)))
    (RULE (VAR B  ) (READ (binCmp     0 (B 1))) (WRITE ((binCmp 0 B) lt)))
    (RULE (VAR B  ) (READ (binCmp     1 (B 0))) (WRITE ((binCmp 0 B) gt)))
    (RULE (VAR B  ) (READ (binCmp     1 (B 1))) (WRITE ((binCmp 0 B) eq)))
    
    /both numbers multiple digits/
    (RULE (VAR A B) (READ (binCmp (A 0) (B 0))) (WRITE ((binCmp A B) eq)))
    (RULE (VAR A B) (READ (binCmp (A 0) (B 1))) (WRITE ((binCmp A B) lt)))
    (RULE (VAR A B) (READ (binCmp (A 1) (B 0))) (WRITE ((binCmp A B) gt)))
    (RULE (VAR A B) (READ (binCmp (A 1) (B 1))) (WRITE ((binCmp A B) eq)))
    
    /reduce to final value/
    (RULE (VAR N) (READ (gt N)) (WRITE gt))
    (RULE (VAR N) (READ (lt N)) (WRITE lt))
    (RULE (VAR N) (READ (eq N)) (WRITE N))
)

