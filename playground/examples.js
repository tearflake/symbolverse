examples = {
"example1-1":
`
///
hello world example

 input: \`(hello machine)\`
output: \`(hello world)\`
///

(
    REWRITE

    (RULE (READ (EXP (\\hello \\machine))) (WRITE (EXP (\\hello \\world))))
)
`,

"example1-1-input":
`
(hello machine)
`,

"example1-2":
`
///
hello entity example

 input: \`(greet Name)\`
output: \`(hello Name)\`
///

(
    REWRITE

    (RULE (VAR Name) (READ (EXP (\\greet \\Name))) (WRITE (EXP (\\hello \\Name))))
)
`,
"example1-2-input":
`
(greet human)
`,

"example1-3":
`
///
toy making decision

 input: \`(isGood girl/boy)\`
output: \`(makeToy doll/car)\`
///

(
    REWRITE

    (RULE (READ (EXP (\\isGood \\girl))) (WRITE (EXP (\\makeToy \\doll))))
    (RULE (READ (EXP (\\isGood \\boy) )) (WRITE (EXP (\\makeToy \\car) )))
)
`,
"example1-3-input":
`
(isGood girl)
`,

"example1-4":
`
///
job title decision

 input: \`(isDoing Name drivingRocket/healingPeople)\`
output: \`(isTitled Name astronaut/doctor)\`
///

(
    REWRITE

    (
        RULE
        (VAR Name)
        (READ  (EXP (\\isDoing \\Name \\drivingRocket)))
        (WRITE (EXP (\\isTitled \\Name \\astronaut)   ))
    )
    (
        RULE
        (VAR Name)
        (READ  (EXP (\\isDoing \\Name \\healingPeople)))
        (WRITE (EXP (\\isTitled \\Name \\doctor)      ))
    )
)
`,
"example1-4-input":
`
(isDoing Jane drivingRocket)
`,

"example1-5":
`
///
shadows decision

 input: \`(sunIs rising/falling)\`
output: \`(shadowsDo expand/shrink)\`
///

(
    REWRITE

    (RULE (READ (EXP (\\sunIs \\rising) )) (WRITE (EXP (itIs morning)  )))
    (RULE (READ (EXP (\\sunIs \\falling))) (WRITE (EXP (itIs afternoon))))

    (RULE (READ (EXP (itIs morning)  )) (WRITE (EXP (shadowsLean west))))
    (RULE (READ (EXP (itIs afternoon))) (WRITE (EXP (shadowsLean east))))

    (RULE (READ (EXP (shadowsLean west))) (WRITE (EXP (\\shadowsDo \\shrink))))
    (RULE (READ (EXP (shadowsLean east))) (WRITE (EXP (\\shadowsDo \\expand))))
)
`,
"example1-5-input":
`
(sunIs rising)
`,

"example1-6":
`
///
weighting decision

 input: \`(orbitsAround object1 object2)\`
output: \`(weigthtsMoreThan object2 object1)\`
///

(
    REWRITE

    (
        RULE
        (VAR P1 P2)
        (READ  (EXP (\\orbitsAround \\P1 \\P2)   ))
        (WRITE (EXP (attractsMoreThan P2 P1)))
    )
    (
        RULE
        (VAR P1 P2)
        (READ  (EXP (attractsMoreThan P1 P2)))
        (WRITE (EXP (\\weightsMoreThan \\P1 \\P2)))
    )
)
`,
"example1-6-input":
`
(orbitsAround earth sun)
`,

"example1-8":
`
///
planting cyclus

 input: \`(plantSeed Fruit)\`
output: \`(fruitGrows Fruit)\`
///

(
    REWRITE
    
    /entry point/
    (RULE (VAR Fruit) (READ (EXP (\\plantSeed \\Fruit))) (WRITE (EXP (plantingSeed Fruit))))
    
    /exit point/
    (RULE (VAR Fruit) (READ (EXP (fruitGrowing Fruit))) (WRITE (EXP (\\fruitGrows \\Fruit))))
    
    (
        REWRITE
        
        (RULE (VAR Fruit) (READ (EXP (\\plantingSeed \\Fruit))) (WRITE (EXP (treeForms Fruit)     )))
        (RULE (VAR Fruit) (READ (EXP (treeForms Fruit)     )) (WRITE (EXP (blooms Fruit)        )))
        (RULE (VAR Fruit) (READ (EXP (blooms Fruit)        )) (WRITE (EXP (getsPollinated Fruit))))
        (RULE (VAR Fruit) (READ (EXP (getsPollinated Fruit))) (WRITE (EXP (\\fruitGrowing \\Fruit))))
    )
)
`,
"example1-8-input":
`
(plantSeed apple)
`,

"example1-9":
`
///
fun meeting

 input: \`(Who met Whom at Where)\`
output: \`(Who and Whom hadPartyAt Where)\`
///

(
    REWRITE
    
    /entry point/
    (
        RULE
        (VAR Who Whom Where)
        (READ  (EXP (\\Who \\met \\Whom \\at \\Where)))
        (WRITE (EXP (funMeeting Who Whom Where) ))
    )
    
    /exit point/
    (
        RULE
        (VAR Char1 Char2 Site)
        (READ  (EXP (funMeeting Char1 Char2 Site)         ))
        (WRITE (EXP (\\Char1 \\and \\Char2 \\hadPartyAt \\Site)))
    )
    
    (
        REWRITE
        (RULE (READ (EXP \\bug1)) (WRITE (EXP \\ladybug  )))
        (RULE (READ (EXP \\bug2)) (WRITE (EXP \\butterfly)))
        (RULE (READ (EXP \\bug3)) (WRITE (EXP \\bee      )))
    )

    (
        REWRITE
        (RULE (READ (EXP \\place1)) (WRITE (EXP \\orchard)))
        (RULE (READ (EXP \\place2)) (WRITE (EXP \\meadow )))
    )
)
`,
"example1-9-input":
`
(bug1 met bug2 at place1)
`,

"example1-10":
`
///
built-in global functions

use for substructural operations:
\`CONSA\`, \`CONSL\`
\`HEADA\`, \`HEADL\`
\`TAILA\`, \`TAILL\`
///

(
    REWRITE
    
    /sub-atom/
    (RULE (VAR a) (READ (EXP (\\headA \\a))) (WRITE (EXP (HEADA \\a))))
    (RULE (VAR a) (READ (EXP (\\tailA \\a))) (WRITE (EXP (TAILA \\a))))
    (RULE (VAR h t) (READ (EXP (\\consA \\h \\t))) (WRITE (EXP (CONSA \\h \\t))))
    
    /sub-list/
    (RULE (VAR A) (READ (EXP (\\headL \\A))) (WRITE (EXP (HEADL \\A))))
    (RULE (VAR A) (READ (EXP (\\tailL \\A))) (WRITE (EXP (TAILL \\A))))
    (RULE (VAR H T) (READ (EXP (\\consL \\H \\T))) (WRITE (EXP (CONSL \\H \\T))))
)
`,
"example1-10-input":
`
(
    (
        atoms
        (headA 123)
        (tailA 123)
        (consA 1 23)
    )
    (
        lists
        (headL (1 2 3))
        (tailL (1 2 3))
        (consL 1 (2 3))
    )
)
`,

"example-branch":
`
///
branching choice
///

(
    REWRITE
    
    /if function/
    (
        RULE
        (VAR A B)
        (READ (EXP (\\iff \\true \\A \\B)))
        (WRITE (EXP \\A))
    )
    (
        RULE
        (VAR A B)
        (READ (EXP (\\iff \\false \\A \\B)))
        (WRITE (EXP \\B))
    )
    
    /equality predicate/
    (
        RULE
        (VAR A)
        (READ (EXP (\\eq \\A \\A)))
        (WRITE (EXP \\true))
    )
    (
        RULE
        (VAR A B)
        (READ (EXP (\\eq \\A \\B)))
        (WRITE (EXP \\false))
    )
    
    ///
    Boolean algebra
    ///
    
    /truth table for \`not\` operator/
    (RULE (READ (EXP (\\not \\true ))) (WRITE (EXP \\false)))
    (RULE (READ (EXP (\\not \\false))) (WRITE (EXP \\true )))
    
    /truth table for \`and\` operator/
    (RULE (READ (EXP (\\and \\true  \\true ))) (WRITE (EXP \\true )))
    (RULE (READ (EXP (\\and \\true  \\false))) (WRITE (EXP \\false)))
    (RULE (READ (EXP (\\and \\false \\true ))) (WRITE (EXP \\false)))
    (RULE (READ (EXP (\\and \\false \\false))) (WRITE (EXP \\false)))
    
    /truth table for \`or\` operator/
    (RULE (READ (EXP (\\or \\true  \\true ))) (WRITE (EXP \\true )))
    (RULE (READ (EXP (\\or \\true  \\false))) (WRITE (EXP \\true )))
    (RULE (READ (EXP (\\or \\false \\true ))) (WRITE (EXP \\true )))
    (RULE (READ (EXP (\\or \\false \\false))) (WRITE (EXP \\false)))
)
`,
"example-branch-input":
`
(
    iff
    (
        or
        (eq (x + 1) (x + 1))
        (eq (x + 1) (x - 1))
    )
    "Yes, it's true."
    "No, it's false."
)
`,

"example-binarith":
`
///
operations on natural numbers: \`add\`, \`sub\`, \`mul\`, \`div\`
///

(
    REWRITE
    
    /workflow/
    (RULE (VAR A) (READ (EXP (\\natNum \\A))) (WRITE (EXP (computedBin (decToBin (splitNum A))))))
    (RULE (VAR A) (READ (EXP (computedBin A))) (WRITE (EXP (computedDec (joinNum (binToDec A))))))
    (RULE         (READ (EXP (computedDec neg))) (WRITE (EXP \\"Natural number error")))
    (RULE (VAR A) (READ (EXP (computedDec A))) (WRITE (EXP \\A)))

    /trim leading zeroes/
    (RULE (VAR A) (READ (EXP (0 A))) (WRITE (EXP A)))
    
    /////////////////
    / split number /
    /////////////////
    
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
`,
"example-binarith-input":
`
(
    natNum
    (
        div
        (
            add
            (
                mul
                7
                3
            )
            63
        )
        2
    )
)
`,

"example-fsm":
`
///
# FSM control flow based interpreter

In this programming model, we extend the traditional concept of a finite state machine (FSM) to
represent programs as directed graphs. Instead of merely transitioning between abstract states,
this model emphasizes the manipulation of variables and explicit control flow through
instructions embedded in the graph. The design offers a visualization of how programs operate,
making it possible to reason about execution, conditional branching, and loops.

At its core, the model uses nodes to denote unique states and edges to represent instructions.
Two types of instructions are defined: one for directly updating variables, and another for
testing variable values to determine the flow of execution. Special nodes mark the beginning
and end of the program, ensuring that there is a clear entry and termination point. This
combination provides a framework to model complex programs while still maintaining a graphical
structure.

## Syntax

This is the interpreter syntax in relaxed BNF format:

\`\`\`
          <start> := (EXECUTE (VAR <ATOMIC>+)? <node>+)
    
           <node> := (NODE (ID <ATOMIC>) (EDGE <instruction>* (TARGET <ATOMIC>))+)
    
    <instruction> := (TEST <ATOMIC> <ATOMIC>)
                   | (HOLD <ATOMIC> <ANY>)
\`\`\`

## Components

1. Nodes (States)
   - **Unique States:** Each node in the graph corresponds to a distinct state in the program.
   - **Multiple Connections:** A node can have multiple incoming and outgoing edges, allowing
     various transitions to or from that state.

2. Edges (Instructions)
   - \`hold\` Instructions
     - **Function:** Assign a value to a variable.
     - **Behavior:** Always succeeds and follows the next instruction towards transition to
       the target state (the node at the end of the edge).
     - **Purpose:** To perform computations whose results are held in variables.

   - \`test\` Instructions
     - **Function:** Evaluate a condition to check if a variable holds a specific value.
     - **Behavior:**
       - If the equality condition is **true**, the instruction succeeds, and the program
         follows the **next instruction** towards transition to the target state.
       - If the equality condition is **false**, the edge fails, but the entire model does not
         immediately fail. Instead, it proceeds to select the **next available outgoing edge**
         from the same node.
     - **Purpose:** This mechanism effectively creates an **if-then-else** branching structure
       where multiple conditions can be tried in order until one passes.

## Flow of Execution

1. **Starting the Program:**
   - Execution begins at the **\`begin\` node**, marking the entry point of the computation.

2. **Processing Instructions:**
   - From each node, the program selects an outgoing edge:
     - If it's a **\`hold\` edge**, the variable assignment is performed, and the program
       follows the next instruction towards transition to the target state.
     - If it's a **\`test\` edge**, the equality condition is evaluated:
       - **True:** The program follows the next instruction towards transition to the target
         state.
       - **False:** The program does not move; instead, it selects the next edge from the same
         node.

3. **Branching and Loops:**
   - **Conditional Branching:** The sequential evaluation of \`test\` edges allows the program
     to handle if-then-else decisions.
   - **Loops:** Since edges can connect to any node (including previous nodes), the model
     naturally supports loops and iterative behavior.

4. **Program Termination:**
   - The program concludes when implicit **\`end\` node** is reached, marking the exit point
     of the computation.

## Summary

This computation model is an enhanced finite state machine where:
- **States (nodes):** Represent program execution points.
- **Instructions (edges):** Perform actions (\`hold\`) or condition checks (\`test\`).
- **Conditional Flow:** The ordered evaluation of \`test\` edges introduces a structured
  branching mechanism.
- **Looping:** The graph structure supports loops by allowing transitions back to
  earlier nodes.

By using this model, one can represent programs with conditional branching and loops in a
graph-based structure that emphasizes state transitions and variable operations.
///
`,
"example-fsm-input":
`
(
    APPLY
    (
        EXECUTE
        (
            (
                NODE
                (ID begin)
                (
                    (
                        EDGE
                        (
                            (HOLD output (one input))
                            (
                                (TARGET end)
                                ()
                            )
                        )
                    )
                    ()
                )
            )
            ()
        )
    )
    (one ())
)
`,

"example-imp":
`
///
# IMP framework interpreter

The IMP programming framework is a minimalistic imperative language model used primarily in formal
methods, compiler construction, and program verification. It provides a structured yet simple syntax
that includes variable assignments, arithmetic and boolean expressions, conditional statements, and
loops. IMP is not a practical programming language for software development but rather a theoretical
construct used in academia to teach operational, denotational, and axiomatic semantics. It serves as
a foundation for understanding how imperative programs execute, reasoned through various techniques.

IMP is widely used in theorem proving environments, allowing researchers and students to formally
verify program correctness. It plays a crucial role in automated reasoning, formal verification, and
static analysis, helping in the development of provably correct software. By abstracting core
imperative features, the IMP framework provides a clean and rigorous way to study language semantics
and proof-based program analysis, making it a fundamental tool in programming language theory and
formal verification research.
///
`,
"example-imp-input":
`
`,

"example-ski":
`
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
    (RULE (VAR A) (READ (EXP (\\interpretSki \\A))) (WRITE (EXP (interpretingSki A))))
    
    /combinators/
    (RULE (VAR X) (READ (EXP (I X))) (WRITE (EXP X)))
    (RULE (VAR X Y) (READ (EXP ((K X) Y))) (WRITE (EXP X)))
    (RULE (VAR X Y Z) (READ (EXP (((S X) Y) Z))) (WRITE (EXP ((X Z) (Y Z)))))
    
    /exit point/
    (RULE (VAR A) (READ (EXP (interpretingSki A))) (WRITE (EXP \\A)))
)
`,
"example-ski-input":
`
(
    interpretSki
    ((((S (K (S I))) K) a) b)
)
`,

"example-lamb":
`
///
# LC to SKI compiler

Lambda calculus (LC) is a formal system in mathematical logic and computer science for expressing
computation based on function abstraction and application. It uses variable binding and
substitution to define functions and apply them to arguments. The core components are variables,
function definitions (lambda abstractions, e.g., λx.x), and function applications (e.g., (λx.x)y).
Lambda calculus serves as a foundation for functional programming languages and provides a
framework for studying computation, recursion, and the equivalence of algorithms. Its simplicity
and expressiveness make it a cornerstone of theoretical computer science.
///

(
    REWRITE
    
    /workflow/
    (RULE (VAR A) (READ (EXP (\\lcToSki \\A))) (WRITE (EXP (parseLc A))))
    (RULE (VAR A) (READ (EXP (parsedLc A))) (WRITE (EXP (compileToSki A))))
    (RULE (VAR A) (READ (EXP (compiledToSki A))) (WRITE (EXP \\A)))

    /parser/
    (
        REWRITE
        
        (RULE (VAR A) (READ (EXP (\\parseLc \\A))) (WRITE (EXP (parsingLc\\ A))))
        
        /tokenizing/
        (RULE (READ (EXP lmbd)) (WRITE (EXP lmbd\\)))
        
        /parsing/
        (RULE (VAR x) (READ (EXP x)) (WRITE (EXP (typed\\ x\\ var\\))))
        (
            RULE
            (VAR x M ANY)
            (READ (EXP (lmbd\\ (typed\\ x\\ var\\) (typed\\ M\\ ANY\\))))
            (WRITE (EXP (typed\\ (lmbd\\ x\\ M\\) abs\\)))
        )
        (
            RULE
            (VAR M N ANY1 ANY2)
            (READ (EXP ((typed\\ M\\ ANY1\\) (typed\\ N\\ ANY2\\))))
            (WRITE (EXP (typed\\ (M\\ N\\) app\\)))
        )
        
        (RULE (VAR A ANY) (READ (EXP (parsingLc\\ (typed\\ A\\ ANY\\)))) (WRITE (EXP (\\parsedLc \\A))))
        (RULE (VAR A) (READ (EXP (parsingLc\\ A\\))) (WRITE (EXP \\\\"lambda calculus syntax error")))
    )
    
    /compiler/
    (
        REWRITE
        
        (RULE (VAR A) (READ (EXP (\\compileToSki \\A))) (WRITE (EXP (compilingToSki A))))
        
        (RULE (VAR x) (READ (EXP (lmbd x x))) (WRITE (EXP I)))
        (RULE (VAR x E1 E2) (READ (EXP (lmbd x (E1 E2)))) (WRITE (EXP ((S (lmbd x E1)) (lmbd x E2)))))
        (RULE (VAR x y) (READ (EXP (lmbd x y))) (WRITE (EXP (K y))))
        
        (RULE (VAR A) (READ (EXP (compilingToSki A))) (WRITE (EXP (\\compiledToSki \\A))))
    )
)
`,
"example-lamb-input":
`
(lcToSki (((lmbd x (lmbd y (y x))) a) b))
`,

"example-proof":
`
///
# Hilbert style proof checker

The Hilbert-style proof system is a formal deductive framework used in mathematical logic and
proof theory. It is named after David Hilbert, who pioneered formal approaches to mathematics
in the early 20th century. This system is designed to formalize reasoning by providing a small
set of axioms and inference rules that allow the derivation of theorems. In its essence, the
Hilbert-style proof system is minimalistic, relying on a few foundational logical axioms and a
single or limited number of inference rules, such as modus ponens (if \`A\` and \`A -> B\` are
true, then \`B\` is true).

One of the defining features of the Hilbert system is its flexibility and generality. It is
used to represent a variety of logical systems, including propositional logic. Proofs in this
system consist of sequences of formulas, where each formula is either an axiom or derived from
previous formulas using inference rules. While highly structured, the system is often
criticized for being less intuitive and less efficient compared to more modern proof systems
like natural deduction or sequent calculus. Despite this, the Hilbert-style proof system
remains foundational in logic due to its simplicity and role in formalizing the foundations of
mathematics. It serves as a cornerstone for understanding logical derivation and the
relationships between axiomatic systems.

Hilbert-style proof systems can be applied to type checking in programming by leveraging their
formal structure to verify the correctness of type assignments in a program. In type theory,
types can be seen as logical propositions, and well-typed programs correspond to proofs of these
propositions. By encoding typing rules as axioms and inference rules within a Hilbert-style
framework, the process of type checking becomes equivalent to constructing a formal proof that
a given program adheres to its type specification. While this approach is conceptually elegant,
it can be inefficient for practical programming languages due to the system’s minimalistic
nature, requiring explicit proofs for even simple derivations. However, it provides a
foundational theoretical basis for understanding type systems and their connection to logic,
particularly in frameworks like the Curry-Howard correspondence, which bridges formal logic and
type theory.

## Instructions for using the proof checker:

\`\`\`
--------------------------------------------------------------
To compose a proof, use these rules
--------------------------------------------------------------
AxmI = (impl A A)
AxmK = (impl A (impl B A))
AxmS = (impl (impl A (impl B C)) (impl (impl A B) (impl A C)))
(Apply (impl A B) A) = B
--------------------------------------------------------------
\`\`\`
///

(
    REWRITE
    
    /workflow/
    (RULE (VAR A) (READ (EXP (\\check \\A))) (WRITE (EXP (proofCheck A))))
    (RULE (VAR A) (READ (EXP (proofChecked A))) (WRITE (EXP \\A)))
    
    /proof checker/
    (
        REWRITE
        
        /entry point/
        (RULE (VAR A) (READ (EXP (\\proofCheck \\A))) (WRITE (EXP (proofChecking A))))
        
        /axioms/
        (
            RULE
            (VAR A B)
            (
                READ
                (EXP AxmI)
            )
            (
                WRITE
                (EXP (typed (impl A A)))
            )
        )
        (
            RULE
            (VAR A B)
            (
                READ
                (EXP AxmK)
            )
            (
                WRITE
                (EXP (typed (impl A (impl B A))))
            )
        )
        (
            RULE
            (VAR A B C)
            (
                READ
                (EXP AxmS)
            )
            (
                WRITE
                (EXP (typed (impl (impl A (impl B C)) (impl (impl A B) (impl A C)))))
            )
        )
        
        /modus ponens/
        (
            RULE
            (VAR A B)
            (
                READ
                (
                    EXP
                    (
                        Apply
                        (typed (impl A B))
                        (typed A)
                    )
                )
            )
            (
                WRITE
                (
                    EXP
                    (typed B)
                )
            )
        )
        
        /exit point/
        (RULE (VAR A) (READ (EXP (proofChecking (typed A)))) (WRITE (EXP (\\proofChecked \\A))))
        (RULE (VAR A) (READ (EXP (proofChecking A))) (WRITE (EXP \\\\"Proof checking error")))
    )
)
`,
"example-proof-input":
`
(
    check
    (
        Apply
        (
            Apply
            AxmS
            AxmK
        )
        AxmK
    )
)
`,

"example-seq1":
`
///
academic citizen

 input: \`isBeingEducated Name\`
output: \`willBeAcademic Name\`
///

(
    REWRITE
    
    (
        RULE
        (VAR Name)
        (
            READ
            (EXP (\\isBeingEducated \\Name))
        )
        (
            WRITE
            (EXP (\\attendsSchool \\Name))
            (EXP (\\attendsCollege \\Name))
        )
    )

    (RULE (VAR Name) (READ (EXP (\\attendsSchool \\Name))) (WRITE (EXP (\\willBeAcademic \\Name))))
    (RULE (VAR Name) (READ (EXP (\\attendsCollege \\Name))) (WRITE (EXP (\\willBeAcademic \\Name))))
)
`,
"example-seq1-input":
`
(isBeingEducated Jane)
`,

"example-seq2":
`
///
computer expert

 input: \`buildsARobot Name\`
output: \`isAComputerExpert Name\`
///

(
    REWRITE
    
    (RULE (VAR Name) (READ (EXP (\\buildsARobot \\Name))) (WRITE (EXP (\\mastersSoftware \\Name))))
    (RULE (VAR Name) (READ (EXP (\\buildsARobot \\Name))) (WRITE (EXP (\\mastersHardware \\Name))))
    
    (
        RULE
        (VAR Name)
        (
            READ
            (EXP (\\mastersSoftware \\Name))
            (EXP (\\mastersHardware \\Name))
        )
        (
            WRITE
            (EXP (\\isAComputerExpert \\Name))
        )
    )
)
`,
"example-seq2-input":
`
(buildsARobot John)
`
}

