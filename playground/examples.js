examples = {
"example1-1":
`
///
hello world example

 input: \`(hello machine)\`
output: \`(hello world)\`
///

(
    DREWRITE

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
    DREWRITE

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
    DREWRITE

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
    DREWRITE

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
    DREWRITE

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
    DREWRITE

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
    DREWRITE
    
    /entry point/
    (RULE (VAR Fruit) (READ (EXP (\\plantSeed \\Fruit))) (WRITE (EXP (plantingSeed Fruit))))
    
    /exit point/
    (RULE (VAR Fruit) (READ (EXP (fruitGrowing Fruit))) (WRITE (EXP (\\fruitGrows \\Fruit))))
    
    (
        DREWRITE
        
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
    DREWRITE
    
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
        DREWRITE
        (RULE (READ (EXP \\bug1)) (WRITE (EXP \\ladybug  )))
        (RULE (READ (EXP \\bug2)) (WRITE (EXP \\butterfly)))
        (RULE (READ (EXP \\bug3)) (WRITE (EXP \\bee      )))
    )

    (
        DREWRITE
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
    DREWRITE
    
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

"example-boolarith":
`
///
# Boolean algebra

Boolean algebra is a branch of mathematics that deals with variables that have two possible
values: true or false, often represented as 1 and 0. It forms the foundation of digital
logic and computer science, as it governs the behavior of logic gates and circuits used in
electronic devices. In Boolean algebra, operations such as AND, OR, and NOT are used to
combine and modify logical statements, producing outcomes based on specific rules. The
simplicity and binary nature of Boolean algebra make it an essential tool for designing and
analyzing systems like computer processors, digital networks, and control systems, where
decisions are made using binary logic.

Operations defined in this example:
\`not\`, \`and\`, \`or\`
///

(
    DREWRITE
    (RULE (VAR A) (READ (EXP (\\bool \\A))) (WRITE (EXP (return A))))
    
    /truth table for \`not\` operator/
    (RULE (READ (EXP (not true ))) (WRITE (EXP false)))
    (RULE (READ (EXP (not false))) (WRITE (EXP true )))
    
    /truth table for \`and\` operator/
    (RULE (READ (EXP (and true  true ))) (WRITE (EXP true )))
    (RULE (READ (EXP (and true  false))) (WRITE (EXP false)))
    (RULE (READ (EXP (and false true ))) (WRITE (EXP false)))
    (RULE (READ (EXP (and false false))) (WRITE (EXP false)))
    
    /truth table for \`or\` operator/
    (RULE (READ (EXP (or true  true ))) (WRITE (EXP true )))
    (RULE (READ (EXP (or true  false))) (WRITE (EXP true )))
    (RULE (READ (EXP (or false true ))) (WRITE (EXP true )))
    (RULE (READ (EXP (or false false))) (WRITE (EXP false)))
    
    (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \\A)))
)
`,
"example-boolarith-input":
`
(
    bool
    (
        not
        (
            and
            (not true)
            (not false)
        )
    )
)
`,

"example-peanoarith":
`
///
# Peano arithmetic

Peano arithmetic is a simple and elegant foundational system for representing natural numbers and
defining arithmetic operations using a minimal set of symbols and rules. Named after the Italian
mathematician Giuseppe Peano, it encodes numbers starting from a base value \`zero\`, and builds
all other numbers by repeatedly applying a successor function, denoted as \`(succ n)\`. In this way,
\`0\` is represented by \`zero\`, \`1\` by \`(succ zero)\`, \`2\` by \`(succ (succ zero))\`, and so on. This
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
\`add\`, \`sub\`, \`mul\`, \`div\`, \`mod\`, \`lt\`, \`eq\`
///

(
    DREWRITE
    
    (RULE (VAR A) (READ (EXP (\\peano \\A))) (WRITE (EXP (return (unToDec (unary (decToUn A)))))))

    (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \\A)))
    
    ////////////////////
    / decimal to unary /
    ////////////////////
    
    (
        DREWRITE
        
        (RULE (VAR A) (READ (EXP (\\decToUn \\A))) (WRITE (EXP (return (decToUn (splitNum A))))))
        
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
        
        (RULE (VAR A) (READ (EXP (bounce A))) (WRITE (EXP (\\bouncing \\A))))
        (RULE (VAR A) (READ (EXP (\\bouncing \\A))) (WRITE (EXP A)))
        
        (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \\A)))
    )
    
    ////////////////////
    / unary to decimal /
    ////////////////////
    
    (
        DREWRITE
        
        (RULE (VAR A) (READ (EXP (\\unToDec \\A))) (WRITE (EXP (return (joinNum (unToDec A))))))
        
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
        
        (RULE (VAR A) (READ (EXP (bounce A))) (WRITE (EXP (\\bouncing \\A))))
        (RULE (VAR A) (READ (EXP (\\bouncing \\A))) (WRITE (EXP A)))
        
        (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \\A)))
    )
    
    ////////////////////
    / unary operations /
    ////////////////////
    
    (
        DREWRITE

        (RULE (VAR A) (READ (EXP (\\unary \\A))) (WRITE (EXP (return A))))
        
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
        
        (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \\A)))
    )
)
`,
"example-peanoarith-input":
`
(
    peano
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

"example-numarith":
`
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
\`succ\`, \`pred\`, \`add\`, \`sub\`, \`mul\`, \`div\`, \`mod\`, \`lt\`, \`eq\`
///

(
    DREWRITE
    
    (RULE (VAR A) (READ (EXP (\\natnum \\A))) (WRITE (EXP (return (binToDec (binary (decToBin A)))))))
    
    ///
    /trim leading zeroes/
    (RULE (VAR A) (READ (EXP (0 A))) (WRITE (EXP A)))
    ///
    
    (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \\A)))
    
    /////////////////////
    / decimal to binary /
    /////////////////////
    
    (
        DREWRITE
        
        (RULE (VAR A) (READ (EXP (\\decToBin \\A))) (WRITE (EXP (return (decToBin (splitNum A))))))
        
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
        
        (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \\A)))
    )
        
    /////////////////////
    / binary to decimal /
    /////////////////////
    
    (
        DREWRITE
        
        (RULE (VAR A) (READ (EXP (\\binToDec \\A))) (WRITE (EXP (return (joinNum (binToDec A))))))
        
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
        
        (RULE (VAR A) (READ (EXP (bounce A))) (WRITE (EXP (\\bouncing \\A))))
        (RULE (VAR A) (READ (EXP (\\bouncing \\A))) (WRITE (EXP A)))

        (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \\A)))
    )
    
    /////////////////////
    / binary operations /
    /////////////////////
    
    (
        DREWRITE

        (RULE (VAR A) (READ (EXP (\\binary \\A))) (WRITE (EXP (return A))))

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
        
        (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \\A)))
    )
)
`,
"example-numarith-input":
`
(
    natnum
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

"example-cfg":
`
///
# CFG parser generator

A context-free grammar (CFG) is a formal system used to define the syntax of programming
languages and structured data. It consists of a set of production rules that describe how
symbols in a language can be combined to form valid strings or structures. A CFG includes
terminal symbols (the basic symbols of the language), non-terminal symbols (placeholders
for patterns of symbols), a start symbol, and a collection of production rules that specify
how non-terminal symbols can be replaced by groups of terminals and/or other non-terminals.
Unlike more restrictive grammars, context-free grammars allow production rules to be applied
regardless of the surrounding symbols (the "context"), making them powerful tools for
describing nested and hierarchical structures, such as arithmetic expressions, programming
language constructs, and natural language sentences. They are widely used in the design of
parsers and compilers.
///
`,
"example-cfg-input":
`
/under construction/
`,

"example-imp":
`
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

\`\`\`
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
\`\`\`
///

(
    DREWRITE
    
    (RULE (VAR A) (READ (EXP (\\imp \\A))) (WRITE (EXP (return (denormVars (interpret (denormInstr (normalize A))))))))
    
    (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \\A)))
    
    /denormalize instructions/
    
    (
        DREWRITE
        
        (RULE (VAR A) (READ (EXP (\\denormInstr \\A))) (WRITE (EXP (return A))))
        
        (RULE (VAR A B) (READ (EXP (asgn (A (B ()))))) (WRITE (EXP (asgn A B))))
        (RULE (VAR A B C) (READ (EXP (if (A (B (C ())))))) (WRITE (EXP (if A B C))))
        (RULE (VAR A B) (READ (EXP (while (A (B ()))))) (WRITE (EXP (while A B))))
        
        (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \\A)))
    )
    
    /interpreter/
    
    (
        DREWRITE
        
        (RULE (VAR A) (READ (EXP (\\interpret \\A))) (WRITE (EXP (return (do A ())))))
        
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
        
        (RULE (VAR A) (READ (EXP (bounce A))) (WRITE (EXP (\\bouncing \\A))))
        (RULE (VAR A) (READ (EXP (\\bouncing \\A))) (WRITE (EXP A)))
        
        (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \\A)))
        
        /assign/
        
        (
            DREWRITE
            
            (
                RULE
                (VAR Elm Val Lst)
                (READ (EXP (\\doAssign \\Elm \\Val \\Lst)))
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
            
            (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \\A)))
        )

        /substitute variables/

        (
            DREWRITE
            
            (RULE (VAR A Lst) (READ (EXP (\\replaceExp \\A \\Lst))) (WRITE (EXP (return (traverse A Lst)))))
            
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
            
            (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \\A)))
            
            (
                DREWRITE
                
                (RULE (VAR a Lst) (READ (EXP (\\replaceVar \\a \\Lst))) (WRITE (EXP (return (loop a Lst)))))
                
                (RULE (VAR a) (READ (EXP (loop a ()))) (WRITE (EXP a)))
                (RULE (VAR a Val Lst) (READ (EXP (loop a ((a Val) Lst)))) (WRITE (EXP Val)))
                (RULE (VAR a b Val Lst) (READ (EXP (loop a ((b Val) Lst)))) (WRITE (EXP (loop a Lst))))
                
                (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \\A)))
            )
        )
    )
    
    ///////////////////////
    / computation wrapper /
    ///////////////////////
    
    (
        DREWRITE
        
        (RULE (VAR A) (READ (EXP (\\calc \\A))) (WRITE (EXP (return A))))
        
        (RULE (VAR A B) (READ (EXP (eq (A (B ()))))) (WRITE (EXP (peano (eq A B)))))
        (RULE (VAR A B) (READ (EXP (leq (A (B ()))))) (WRITE (EXP (or ((peano (eq A B)) ((peano (lt A B)) ()))))))
        
        (RULE (VAR A) (READ (EXP (not (A ())))) (WRITE (EXP (bool (not A)))))
        (RULE (VAR A B) (READ (EXP (and (A (B ()))))) (WRITE (EXP (bool (and A B)))))
        (RULE (VAR A B) (READ (EXP (or (A (B ()))))) (WRITE (EXP (bool (or A B)))))
    
        (RULE (VAR A B) (READ (EXP (add (A (B ()))))) (WRITE (EXP (peano (add A B)))))
        (RULE (VAR A B) (READ (EXP (sub (A (B ()))))) (WRITE (EXP (peano (sub A B)))))
        (RULE (VAR A B) (READ (EXP (mul (A (B ()))))) (WRITE (EXP (peano (mul A B)))))
        (RULE (VAR A B) (READ (EXP (div (A (B ()))))) (WRITE (EXP (peano (div A B)))))
        
        (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \\A)))
    )
    
    ///////////////////
    / Boolean algebra /
    ///////////////////
    
    (
        DREWRITE
        (RULE (VAR A) (READ (EXP (\\bool \\A))) (WRITE (EXP (return A))))
        
        /truth table for \`not\` operator/
        (RULE (READ (EXP (not true ))) (WRITE (EXP false)))
        (RULE (READ (EXP (not false))) (WRITE (EXP true )))
        
        /truth table for \`and\` operator/
        (RULE (READ (EXP (and true  true ))) (WRITE (EXP true )))
        (RULE (READ (EXP (and true  false))) (WRITE (EXP false)))
        (RULE (READ (EXP (and false true ))) (WRITE (EXP false)))
        (RULE (READ (EXP (and false false))) (WRITE (EXP false)))
        
        /truth table for \`or\` operator/
        (RULE (READ (EXP (or true  true ))) (WRITE (EXP true )))
        (RULE (READ (EXP (or true  false))) (WRITE (EXP true )))
        (RULE (READ (EXP (or false true ))) (WRITE (EXP true )))
        (RULE (READ (EXP (or false false))) (WRITE (EXP false)))
        
        (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \\A)))
    )

    ////////////////////
    / Peano arithmetic /
    ////////////////////
    
    (
        DREWRITE
        
        (RULE (VAR A) (READ (EXP (\\peano \\A))) (WRITE (EXP (return (unToDec (unary (decToUn A)))))))

        (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \\A)))
        
        ////////////////////
        / decimal to unary /
        ////////////////////
        
        (
            DREWRITE
            
            (RULE (VAR A) (READ (EXP (\\decToUn \\A))) (WRITE (EXP (return (decToUn (splitNum A))))))
            
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
            
            (RULE (VAR A) (READ (EXP (bounce A))) (WRITE (EXP (\\bouncing \\A))))
            (RULE (VAR A) (READ (EXP (\\bouncing \\A))) (WRITE (EXP A)))
            
            (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \\A)))
        )
        
        ////////////////////
        / unary to decimal /
        ////////////////////
        
        (
            DREWRITE
            
            (RULE (VAR A) (READ (EXP (\\unToDec \\A))) (WRITE (EXP (return (joinNum (unToDec A))))))
            
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
            
            (RULE (VAR A) (READ (EXP (bounce A))) (WRITE (EXP (\\bouncing \\A))))
            (RULE (VAR A) (READ (EXP (\\bouncing \\A))) (WRITE (EXP A)))
            
            (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \\A)))
        )
        
        ////////////////////
        / unary operations /
        ////////////////////
        
        (
            DREWRITE

            (RULE (VAR A) (READ (EXP (\\unary \\A))) (WRITE (EXP (return A))))
            
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
            
            (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \\A)))
        )
    )
    
    /normalize/
    
    (
        DREWRITE
        
        (RULE (VAR A) (READ (EXP (\\normalize \\A))) (WRITE (EXP (return (norm A)))))
        
        (RULE (READ (EXP (norm ()))) (WRITE (EXP ())))
        (RULE (VAR a) (READ (EXP (norm a))) (WRITE (EXP a)))
        (RULE (VAR A) (READ (EXP (norm A))) (WRITE (EXP ((norm (HEADL A)) (norm (TAILL A))))))
        
        (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \\A)))
    )
    
    /denormalize/
    
    (
        DREWRITE
        
        (RULE (VAR A) (READ (EXP (\\denormalize \\A))) (WRITE (EXP (return (denorm A)))))
        
        (RULE (READ (EXP (denorm ()))) (WRITE (EXP ())))
        (RULE (VAR a) (READ (EXP (denorm a))) (WRITE (EXP a)))
        (RULE (VAR A B) (READ (EXP (denorm (A B)))) (WRITE (EXP (CONSL (denorm A) (denorm B)))))
        
        (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \\A)))
    )
    
    /denormalize variables/
    
    (
        DREWRITE
        
        (RULE (VAR A) (READ (EXP (\\denormVars \\A))) (WRITE (EXP (return (denorm1 A)))))
        
        (RULE (READ (EXP (denorm1 ()))) (WRITE (EXP ())))
        (RULE (VAR A) (READ (EXP (denorm1 ((A B) ())))) (WRITE (EXP (A (denormalize B)))))
        (RULE (VAR A B) (READ (EXP (denorm1 (A B)))) (WRITE (EXP (CONSL (denorm2 A) (denorm1 B)))))

        (RULE (VAR A B) (READ (EXP (denorm2 (A B)))) (WRITE (EXP (A (denormalize B)))))
            
        (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \\A)))
    )
)
`,
"example-imp-input":
`
/Fibonacci number generator: store number index in \`param\`; read the indexed number in \`result\`/

(
    imp
    (
        seq
        (asgn param 7)
        (
            if
            (eq param 1)
            (asgn result 0)
            (
                if
                (eq param 2)
                (asgn result 1)
                (
                    seq
                    (asgn i 2)
                    (asgn a1 0)
                    (asgn a2 1)
                    (
                        while
                        (not (eq i param))
                        (
                            seq
                            (asgn result (add a1 a2))
                            (asgn a1 a2)
                            (asgn a2 result)
                            (asgn i (add i 1))
                        )
                    )
                )
            )
        )
    )
)
`,

"example-log":
`
///
# SKI expressions enumerator

This example investigates the systematic generation and enumeration of expressions in SKI
combinatory logic, a minimalistic, variable-free model of computation built from the primitive
combinators \`S\`, \`K\`, and \`I\`. The goal is to develop a program capable of generating all
possible well-formed SKI expressions up to a user-defined size or depth. Each expression is
either a primitive combinator or an application of two smaller expressions, forming a binary
tree structure that can be grown iteratively.

This kind of systematic enumeration grows rapidly, as each new size includes all possible
pairings of existing expressions from previous sizes. The process resembles the growth of
Catalan-number-related structures, since combinator expressions form binary trees with
combinators at the leaves.

The example will organize these expressions by size, beginning with the primitive combinators
and progressively building more complex expressions through recursive pairings of existing
terms. This process enables the exploration of the combinatorial structure of the SKI universe,
providing a means to analyze the distribution of reducible, irreducible, and non-terminating
expressions.

Here, a platform is offered for philosophical and theoretical inquiry into the relationship
between computation, proof theory, and minimal formal systems. By treating SKI expressions as
both programs and proof objects, it provides a method for examining the Curry-Howard
correspondence and investigating how complexity emerges from the simplest possible computational
primitives.

The example accepts a Peano integer, denoting the depth of the combinatorial tree.
///

(
    DREWRITE
    
    /entry point/
    
    (
        RULE
        (VAR A)
        (READ (EXP (\\combs \\A)))
        (WRITE (EXP (return (CONSL COMBS (denormalize (enumRange combs () () zero A))))))
    )
    
    /exit point/
    
    (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \\A)))
    
    /combinators/
    
    (RULE (READ (EXP combs)) (WRITE (EXP (<S> (<K> (<I> ()))))))

    /combinations/
    
    (
        RULE
        (VAR Comb Acc1 Acc2 NumRec)
        (READ (EXP (enumRange Comb Acc1 Acc2 NumRec NumRec)))
        (WRITE (EXP (concatenate Acc2 Acc1)))
    )
    (
        RULE 
        (VAR Comb Acc1 Acc2 NumRec1 NumRec2)
        (READ (EXP (enumRange Comb Acc1 Acc2 (succ (succ NumRec1)) NumRec2)))
        (
            WRITE
            (
                EXP
                (
                    enumRange
                    combs
                    (concatenate (product Comb Acc1) (product Acc1 Comb))
                    (concatenate Acc2 Acc1)
                    (succ (succ (succ NumRec1)))
                    NumRec2
                )
            )
        )
    )
    (
        RULE 
        (VAR Comb Acc1 Acc2 NumRec1 NumRec2)
        (READ (EXP (enumRange Comb Acc1 Acc2 NumRec1 NumRec2)))
        (WRITE (EXP (enumRange combs (product Comb Acc1) (concatenate Acc2 Acc1) (succ NumRec1) NumRec2)))
    )
    
    /cartesian product/
    
    (
        DREWRITE
        
        (RULE (VAR A B) (READ (EXP (\\product \\A \\B))) (WRITE (EXP (return (enumL A B ())))))

        (RULE (VAR Lft AccL) (READ (EXP (enumL Lft () AccL))) (WRITE (EXP Lft)))
        (RULE (VAR Rgt AccL) (READ (EXP (enumL () Rgt AccL))) (WRITE (EXP (reverse AccL))))
        (
            RULE
            (VAR L Lft Rgt AccL)
            (READ (EXP (enumL (L Lft) Rgt AccL)))
            (WRITE (EXP (enumL Lft Rgt (concatenate (enumR L Rgt ()) AccL))))
        )
        
        (RULE (VAR R AccR) (READ (EXP (enumR () R AccR))) (WRITE (EXP R)))
        (RULE (VAR L AccR) (READ (EXP (enumR L () AccR))) (WRITE (EXP AccR)))
        (
            RULE
            (VAR L R Rgt AccR)
            (READ (EXP (enumR L (R Rgt) AccR)))
            (WRITE (EXP (enumR L Rgt ((L (R ())) AccR))))
        )
        
        (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \\A)))
    )
    
    /reverse list/
    
    (
        DREWRITE
        
        (RULE (VAR A) (READ (EXP (\\reverse \\A))) (WRITE (EXP (return (rev A)))))
        
        (RULE (VAR A B) (READ  (EXP (rev (A B)))) (WRITE (EXP (concatenate (rev B) (A ())))))
        (RULE (READ  (EXP (rev ()))) (WRITE (EXP ())))
        
        (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \\A)))
    )
    
    /concatenate two lists/
    
    (
        DREWRITE
        
        (RULE (VAR A B) (READ (EXP (\\concatenate \\A \\B))) (WRITE (EXP (return (concat A B)))))
        
        (RULE (VAR A B C) (READ  (EXP (concat (A B) C))) (WRITE (EXP (A (concat B C)))))
        (RULE (VAR A) (READ  (EXP (concat () A))) (WRITE (EXP A)))
        
        (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \\A)))
    )
    
    /denormalize list/
    
    (
        DREWRITE
        
        (RULE (VAR A) (READ (EXP (\\denormalize \\A))) (WRITE (EXP (return (denorm A)))))
        
        (RULE (READ (EXP (denorm ()))) (WRITE (EXP ())))
        (RULE (VAR a) (READ (EXP (denorm a))) (WRITE (EXP a)))
        (RULE (VAR A B) (READ (EXP (denorm (A B)))) (WRITE (EXP (CONSL (denorm A) (denorm B)))))
        
        (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \\A)))
    )
)
`,
"example-log-input":
`
(combs (succ (succ (succ zero))))
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
    DREWRITE
    
    /entry point/
    (RULE (VAR A) (READ (EXP (\\interpretSki \\A))) (WRITE (EXP (return A))))
    
    /combinators/
    (RULE (VAR X) (READ (EXP (<I> X))) (WRITE (EXP X)))
    (RULE (VAR X Y) (READ (EXP ((<K> X) Y))) (WRITE (EXP X)))
    (RULE (VAR X Y Z) (READ (EXP (((<S> X) Y) Z))) (WRITE (EXP ((X Z) (Y Z)))))
    
    /exit point/
    (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \\A)))
)
`,
"example-ski-input":
`
(
    interpretSki
    (
        (
            (
                (
                    <S>
                    (
                        (
                            <S>
                            (
                                <K>
                                <S>
                            )
                        )
                        (
                            <K>
                            <I>
                        )
                    )
                )
                (
                    (
                        <S>
                        (
                            <K>
                            <K>
                        )
                    )
                    <I>
                )
            )
            a
        )
        b
    )
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

The SKI calculus is a foundational system in combinatory logic that eliminates the need for
variables by expressing all computations through three basic combinators: S, K, and I. The SKI
calculus can be viewed through two complementary lenses: as a computational system and as a
logical framework. In its computational interpretation, SKI calculus operates as a minimalist
functional evaluator, where the combinators S, K, and I serve as function transformers that enable
the construction and reduction of expressions without variables, forming the core of combinatory
logic. Conversely, from a logical standpoint, SKI calculus aligns with a Hilbert-style inference
system, where S, K, and I are treated not as functions but as axiom schemes or inference rules. In
this context, the application of combinators mirrors the process of type inference in logic or
proof construction: for instance, the types of S, K, and I correspond to specific theorems in
implicational logic, and their application mimics modus ponens. This duality reveals a connection
between computation and logic, embodying the Curry-Howard correspondence, where evaluating a term
parallels constructing a proof.

Converting lambda calculus expressions to SKI combinator calculus involves eliminating variables
by expressing functions solely in terms of the combinators S, K, and I. This process
systematically replaces abstractions and applications using transformation rules, such as
translating λx.x to I, λx.E (when x is not free in E) to K E, and λx.(E1 E2) to S (λx.E1) (λx.E2).
This allows computation to be represented without variable binding.
///

(
    DREWRITE
    
    /entry point/
    (RULE (VAR A) (READ (EXP (\\lcToSki \\A))) (WRITE (EXP (return A))))
    
    /LC to SKI compiler/
    (RULE (VAR x) (READ (EXP (lmbd x x))) (WRITE (EXP <I>)))
    (RULE (VAR x E1 E2) (READ (EXP (lmbd x (E1 E2)))) (WRITE (EXP ((<S> (lmbd x E1)) (lmbd x E2)))))
    (RULE (VAR x y) (READ (EXP (lmbd x y))) (WRITE (EXP (<K> y))))
    
    /exit point/
    (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \\A)))
)
`,
"example-lamb-input":
`
(lcToSki (lmbd x (lmbd y (y x))))
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
(CONST A) = (const A)
(IMPL A B) = (impl A B)
<I> = (impl A A)
<K> = (impl A (impl B A))
<S> = (impl (impl A (impl B C)) (impl (impl A B) (impl A C)))
((impl A B) A) = B
--------------------------------------------------------------
\`\`\`
///

(
    DREWRITE
    
    /entry point/
    (RULE (VAR A) (READ (EXP (\\proofCheck \\A))) (WRITE (EXP (return A))))
    
    /constant types/
    (
        RULE
        (VAR a)
        (READ (EXP (CONST a)))
        (WRITE (EXP (typed (const a))))
    )
    (
        RULE
        (VAR A B)
        (READ (EXP (IMPL (typed A) (typed B))))
        (WRITE (EXP (typed (impl A B))))
    )
    
    /axioms/
    (
        RULE
        (VAR A B)
        (READ (EXP <I>))
        (WRITE (EXP (typed (impl A A))))
    )
    (
        RULE
        (VAR A B)
        (READ (EXP <K>))
        (WRITE (EXP (typed (impl A (impl B A)))))
    )
    (
        RULE
        (VAR A B C)
        (READ (EXP <S>))
        (WRITE (EXP (typed (impl (impl A (impl B C)) (impl (impl A B) (impl A C))))))
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
    (RULE (VAR A) (READ (EXP (return (typed A)))) (WRITE (EXP \\A)))
    (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \\"Proof checking error")))
)
`,
"example-proof-input":
`
(
    proofCheck
    (
        (
            (
                (
                    <S>
                    (
                        (
                            <S>
                            (
                                <K>
                                <S>
                            )
                        )
                        (
                            <K>
                            <I>
                        )
                    )
                )
                (
                    (
                        <S>
                        (
                            <K>
                            <K>
                        )
                    )
                    <I>
                )
            )
            (CONST A)
        )
        (IMPL (CONST A) (CONST B))
    )
)
`,
"example-stlc":
`
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
example, a proof of a proposition like \`A -> B\` is represented by a function that, given a proof
of \`A\`, produces a proof of \`B\`. This tight connection between logic and computation allows
automated theorem provers and proof assistants to leverage type checking as a means of proof
verification. While the STLC lacks the expressive power of richer type systems (like dependent
types), it offers a clear and elegant foundation for understanding the relationship between
types, computation, and logical deduction.

In this implementation, primitive terms are represented as constants. They have to be explicitly
typed with \`(assert <LOWERCASE-ATOM> <type>)\` syntax. Defining constants is allowed only
outside of all of \`(lmbd ... ...)\` expressions, and applied as shown in input example. Also,
all the variables within lambda expressions have to be bound.

Syntax of STLC in this implementation is expected to comply the following kind of BNF rules:

\`\`\`
    <start> := (stlc <lexp>)

     <lexp> := (lmbd (typed <var> <type>) <lexp>)
             | (<lexp> <lexp>)
             | <var>

      <var> := <LOWERCASE-ATOM>

     <type> := (CONST <UPPERCASE-ATOM>)
             | (IMPL <type> <type>)
\`\`\`

The implementation features constructing compound types from annotated type rules, combined with
previous examples of LC to SKI compiler, Hilbert-style proof checker and SKI calculus interpreter.
///

(
    DREWRITE
    
    /begin/
    (RULE (VAR A) (READ (EXP (\\stlc \\A))) (WRITE (EXP (evaluating A A))))
    
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
        (WRITE (EXP (return (result (value (interpretSki (lcToSki (getValues B)))) (type A)))))
    )

    /failure/
    (
        RULE
        (VAR A B C)
        (READ (EXP (typeEq A B C)))
        (WRITE (EXP (return "Typing error")))
    )
    
    /end/
    (RULE (VAR A B) (READ (EXP (return A))) (WRITE (EXP \\A)))

    /lift lettercase/
    (
        DREWRITE
        (RULE (VAR A) (READ (EXP (\\lift \\A))) (WRITE (EXP (return A))))
        
        (RULE (READ (EXP const)) (WRITE (EXP CONST)))
        (RULE (READ (EXP impl)) (WRITE (EXP IMPL)))
        
        (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \\A)))
    )
    
    /getTypes/
    (
        DREWRITE
        (RULE (VAR A) (READ (EXP (\\getTypes \\A))) (WRITE (EXP (return A))))
        
        (RULE (VAR A B) (READ (EXP (typed A B))) (WRITE (EXP A)))
        (RULE (VAR A B) (READ (EXP (assert A B))) (WRITE (EXP B)))
        
        (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \\A)))
    )
    
    /getValues/
    (
        DREWRITE
        (RULE (VAR A) (READ (EXP (\\getValues \\A))) (WRITE (EXP (return A))))
        
        (RULE (VAR A B) (READ (EXP (typed A B))) (WRITE (EXP A)))
        (RULE (VAR A B) (READ (EXP (assert A B))) (WRITE (EXP A)))
        
        (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \\A)))
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
        DREWRITE
        (
            RULE
            (VAR A)
            (READ (EXP (\\composeAbstractionTypes \\A)))
            (WRITE (EXP (return A)))
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
        
        (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \\A)))
        
        /replace util/
        (
            DREWRITE
            
            (
                RULE
                (VAR Exp a B)
                (READ (EXP (\\replace \\Exp \\a \\B)))
                (WRITE (EXP (return (traverse Exp a B))))
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
            
            (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \\A)))
        )
    )
        
    /application types/
    (
        DREWRITE
        
        (
            RULE
            (VAR A)
            (READ (EXP (\\composeApplicationTypes \\A)))
            (WRITE (EXP (return A)))
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
            (READ (EXP (return A)))
            (WRITE (EXP \\A))
        )
    )
    
    ////////////////////
    /LC to SKI compiler/
    ////////////////////
    
    (
        DREWRITE
        
        /entry point/
        (RULE (VAR A) (READ (EXP (\\lcToSki \\A))) (WRITE (EXP (return A))))
        
        /LC to SKI compiler/
        (RULE (VAR x) (READ (EXP (lmbd x x))) (WRITE (EXP <I>)))
        (RULE (VAR x E1 E2) (READ (EXP (lmbd x (E1 E2)))) (WRITE (EXP ((<S> (lmbd x E1)) (lmbd x E2)))))
        (RULE (VAR x y) (READ (EXP (lmbd x y))) (WRITE (EXP (<K> y))))
        
        /exit point/
        (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \\A)))
    )
    
    //////////////////////////
    /SKI calculus interpreter/
    //////////////////////////
    
    (
        DREWRITE
        
        /entry point/
        (RULE (VAR A) (READ (EXP (\\interpretSki \\A))) (WRITE (EXP (return A))))
        
        /combinators/
        (RULE (VAR X) (READ (EXP (<I> X))) (WRITE (EXP X)))
        (RULE (VAR X Y) (READ (EXP ((<K> X) Y))) (WRITE (EXP X)))
        (RULE (VAR X Y Z) (READ (EXP (((<S> X) Y) Z))) (WRITE (EXP ((X Z) (Y Z)))))
        
        /exit point/
        (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \\A)))
    )
    
    /////////////////////////////
    /Hilbert style proof checker/
    /////////////////////////////
    
    (
        DREWRITE
        
        /entry point/
        (RULE (VAR A) (READ (EXP (\\proofCheck \\A))) (WRITE (EXP (return A))))
        
        /constant types/
        (
            RULE
            (VAR a)
            (READ (EXP (CONST a)))
            (WRITE (EXP (typed (const a))))
        )
        (
            RULE
            (VAR A B)
            (READ (EXP (IMPL (typed A) (typed B))))
            (WRITE (EXP (typed (impl A B))))
        )
        
        /axioms/
        (
            RULE
            (VAR A B)
            (READ (EXP <I>))
            (WRITE (EXP (typed (impl A A))))
        )
        (
            RULE
            (VAR A B)
            (READ (EXP <K>))
            (WRITE (EXP (typed (impl A (impl B A)))))
        )
        (
            RULE
            (VAR A B C)
            (READ (EXP <S>))
            (WRITE (EXP (typed (impl (impl A (impl B C)) (impl (impl A B) (impl A C))))))
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
        (RULE (VAR A) (READ (EXP (return (typed A)))) (WRITE (EXP \\A)))
        (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \\"Proof checking error")))
    )
)
`,
"example-stlc-input":
`
(
    stlc
    (
        (
            (
                lmbd
                (typed x (CONST A))
                (
                    lmbd
                    (typed y (IMPL (CONST A) (CONST B)))
                    (y x)
                )
            )
            (assert a (CONST A))
        )
        (assert b (IMPL (CONST A) (CONST B)))
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
    DREWRITE
    
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
    DREWRITE
    
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
`,

"example-datalog":
`
///
# Dataog implementation

Datalog is a declarative logic programming language, primarily used for querying and
reasoning about relational data. It has its roots in Prolog, another logic programming
language, but distinguishes itself with a simpler, more restricted syntax and semantics
that make it particularly well-suited for database applications, program analysis, and
information retrieval.

At its core, Datalog programs consist of a collection of facts, rules, and queries. Facts
represent basic assertions about the world, written in the form of predicates applied to
constants (e.g., \`(parent Alice Bob)\` means Alice is Bob's parent). Rules define logical
relationships between facts and other rules, often expressing patterns of inference (e.g.,
\`(RULE (VAR X Y Z) (CONSEQ (grandparent X Z)) (ANTECS (parent X Y) (parent Y Z)))\` defines
someone as a grandparent if they are a parent of a parent). Some implementations define
selection queries for users to ask questions about the data implied by the facts and rules.

A key feature of Datalog is its use of recursive rules, which makes it a powerful tool for
expressing computations over hierarchical or graph-structured data, like finding all
ancestors in a family tree or determining reachable nodes in a network. Unlike SQL, Datalog
queries naturally support recursion without requiring special constructs.

Another important characteristic of Datalog is its bottom-up evaluation strategy, often
implemented using techniques like the semi-naive evaluation algorithm. This makes Datalog
efficient for certain classes of problems, especially those involving transitive closures
and fixed-point computations, where results are derived iteratively until no new facts can
be inferred.

Today, Datalog enjoys renewed interest in fields like static program analysis, security
policy specification, distributed systems reasoning, and knowledge graph querying, thanks
to its expressiveness, mathematical elegance, and suitability for expressing complex
relationships with clear, concise rules.

Datalog syntax in this implementation is determined by the following kind of BNF rules:

\`\`\`
<start> := (DATALOG (DATA <data>+) (QUERY <query>))

 <data> := <fact>
         | <rule>
        
 <fact> := (FACT (<ATOMIC>+))

 <rule> := (RULE (VAR <ATOMIC>+)? (CONSEQ (<ATOMIC>+)) (ANTECS (<ATOMIC>+)*))

<query> := (QUERY (VAR <ATOMIC>+)? (<ATOMIC>+))
\`\`\`
///

(
    DREWRITE
    
    (
        RULE
        (VAR Data Query)
        (READ (EXP (\\DATALOG \\Data \\Query)))
        (WRITE (EXP (process (normalize Data) (normalize Query))))
    )
    
    (
        RULE
        (VAR Data Query)
        (READ (EXP (process (DATA Data) (QUERY Query))))
        (WRITE (EXP (return (result Data (applyAllAfter Data zero) Query))))
    )
    
    (
        RULE
        (VAR Data Inference Query)
        (READ (EXP (result Data Inference Query)))
        (
            WRITE
            (
                EXP
                (
                    RESULT
                    (INFERENCE (denormalize Inference))
                    (QUERY (find (concatenate Data Inference) Query))
                )
            )
        )
    )

    (RULE (VAR Query) (READ (EXP (find () Query))) (WRITE (EXP No)))
    (
        RULE
        (VAR Next Query)
        (READ (EXP (find ((RULE ((VAR ()) ((CONSEQ Query) ((ANTECS ()) ())))) Next) Query)))
        (WRITE (EXP Yes))
    )
    (RULE (VAR Data Next Query) (READ (EXP (find (Data Next) Query))) (WRITE (EXP (find Next Query))))

    (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \\A)))

    /normalize assertions/
    
    (RULE (VAR F) (READ (EXP (FACT F))) (WRITE (EXP (RULE (VAR) (CONSEQ F) (ANTECS)))))
    (RULE (VAR C A) (READ (EXP (RULE C A))) (WRITE (EXP (RULE (VAR) C A))))
    
    /deduction/
    
    (
        DREWRITE
        
        (
            RULE
            (VAR D Acc0)
            (READ (EXP (\\applyAllBefore \\D \\Acc0)))
            (WRITE (EXP (return (iter D (bounce (getNthElement D zero)) zero Acc0 ()))))
        )
        
        (
            RULE
            (VAR D E I Acc0 Acc)
            (READ (EXP (iter D false I Acc0 Acc)))
            (WRITE (EXP Acc))
        )
        (
            RULE
            (VAR D E I Acc0 Acc)
            (READ (EXP (iter D E I Acc0 Acc)))
            (WRITE (EXP (iterHlp D (bounce (getNthElement D I)) (succ I) Acc0 Acc)))
        )
        
        (
            RULE
            (VAR D E I Acc0 Acc)
            (READ (EXP (iterHlp D E I Acc0 Acc)))
            (WRITE (EXP (iter D E I Acc0 (bounce (concatenate Acc (applyElement Acc0 E))))))
        )
        
        (RULE (VAR A) (READ (EXP (bounce A))) (WRITE (EXP (bouncing \\A))))
        (RULE (VAR A) (READ (EXP (bouncing \\A))) (WRITE (EXP A)))
        
        (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \\A)))
    )
    (
        DREWRITE
        
        (
            RULE
            (VAR D I)
            (READ (EXP (\\applyAllAfter \\D \\I)))
            (WRITE (EXP (return (iter D (bounce (getNthElement D I)) I ()))))
        )
        
        (
            RULE
            (VAR D E I Acc)
            (READ (EXP (iter D false I Acc)))
            (WRITE (EXP (case1 (bounce (eq Acc ())) D Acc I)))
        )
        (
            RULE
            (VAR D E I Acc)
            (READ (EXP (iter D E I Acc)))
            (WRITE (EXP (iterHlp D (bounce (getNthElement D I)) (succ I) Acc)))
        )
        
        (
            RULE
            (VAR D E I Acc)
            (READ (EXP (iterHlp D E I Acc)))
            (WRITE (EXP (iter D E I (bounce (concatenate Acc (applyElement D E))))))
        )
        
        (
            RULE
            (VAR D Acc I)
            (READ (EXP (case1 false D Acc I)))
            ///
            (
                WRITE
                (
                    EXP
                    (
                        bounce
                        (
                            concatenate
                            Acc
                            (
                                concatenate
                                (applyAllBefore D Acc)
                                (applyAllAfter (concatenate D (concatenate Acc (applyAllBefore D Acc))) I)
                            )
                        )
                    )
                )
            )
            ///
            ///
            (
                WRITE
                (
                    EXP
                    (
                        bounce
                        (
                                concatenate
                                (accLoop D Acc (applyAllBefore D Acc))
                                (applyAllAfter (concatenate D (accLoop D Acc (applyAllBefore D Acc))) I)
                        )
                    )
                )
            )
            ///
            (
                WRITE
                (
                    EXP
                    (
                        bounce
                        (
                            concatenate
                            Acc
                            (
                                concatenate
                                (applyAllBefore D Acc)
                                (applyAllAfter (concatenate D (concatenate Acc (applyAllBefore D Acc))) I)
                            )
                        )
                    )
                )
            )
            
        )
        
        (
            RULE
            (VAR D Acc)
            (READ (EXP (accLoop D Acc ())))
            (WRITE (EXP Acc))
        )
        (
            RULE
            (VAR D Acc0 Acc1)
            (READ (EXP (accLoop D Acc0 Acc1)))
            (WRITE (EXP (accLoop D (bounce (concatenate Acc0 Acc1)) (bounce (applyAllBefore D Acc1)))))
        )
        
        (
            RULE
            (VAR D Acc I)
            (READ (EXP (case1 true D Acc I)))
            (WRITE (EXP ()))
        )

        (RULE (VAR A) (READ (EXP (bounce A))) (WRITE (EXP (bouncing \\A))))
        (RULE (VAR A) (READ (EXP (bouncing \\A))) (WRITE (EXP A)))
        
        (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \\A)))
    )
    (
        DREWRITE
        
        (
            RULE
            (VAR D E)
            (READ (EXP (\\applyElement \\D \\E)))
            (WRITE (EXP (return (iter D E (bounce (getNthElement D zero)) zero ()))))
        )
        
        (
            RULE
            (VAR D E I Acc)
            (READ (EXP (iter D E false I Acc)))
            (WRITE (EXP Acc))
        )
        (
            RULE
            (VAR D E DI I Acc)
            (READ (EXP (iter D E DI I Acc)))
            (WRITE (EXP (iterHlp D E (bounce (getNthElement D I)) (succ I) Acc)))
        )
        
        (
            RULE
            (VAR D E DI I Acc)
            (READ (EXP (iterHlp D E DI I Acc)))
            (WRITE (EXP (iter D E DI I (bounce (concatenate Acc (apply E DI))))))
        )
        
        (RULE (VAR A) (READ (EXP (bounce A))) (WRITE (EXP (bouncing \\A))))
        (RULE (VAR A) (READ (EXP (bouncing \\A))) (WRITE (EXP A)))
        
        (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \\A)))
    )
    (
        DREWRITE
        
        (RULE (VAR E1 E2) (READ (EXP (\\apply \\E1 \\E2))) (WRITE (EXP (return (apply E1 E2)))))
        
        (
            RULE
            (VAR V1 V2 E A1 A2 Next1 Next2)
            (
                READ
                (
                    EXP
                    (
                        apply
                        (RULE ((VAR V1) ((CONSEQ (A1 ())) ((ANTECS ()) Next1))))
                        (RULE ((VAR V2) ((CONSEQ (E ())) ((ANTECS (A1 A2)) Next2))))
                    )
                )
            )
            (
                WRITE
                (
                    EXP
                    ((RULE ((VAR V2) ((CONSEQ (E ())) ((ANTECS A2) ())))) ())
                )
            )
        )
        
        (
            RULE
            (VAR E1 E2)
            (READ (EXP (apply E1 E2)))
            (WRITE (EXP ()))
        )
        
        (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \\A)))
    )
    
    /eq predicate/
    
    (RULE (VAR A) (READ (EXP (eq A A))) (WRITE (EXP true)))
    (RULE (VAR A B) (READ (EXP (eq A B))) (WRITE (EXP false)))
    
    /get n-th element/
    
    (
        DREWRITE
        
        (RULE (VAR A B) (READ (EXP (\\getNthElement \\A \\B))) (WRITE (EXP (return (iter A B zero)))))
        
        (RULE (VAR C D) (READ  (EXP (iter () C D))) (WRITE (EXP false)))
        (RULE (VAR A B C) (READ  (EXP (iter (A B) C C))) (WRITE (EXP A)))
        (RULE (VAR A B C D) (READ  (EXP (iter (A B) C D))) (WRITE (EXP (iter B C (succ D)))))
        
        (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \\A)))
    )
    
    /concatenate lists/
    
    (
        DREWRITE
        
        (RULE (VAR A B) (READ (EXP (\\concatenate \\A \\B))) (WRITE (EXP (return (concat A B)))))
        
        (RULE (VAR A) (READ  (EXP (concat A ()))) (WRITE (EXP A)))
        (RULE (VAR A) (READ  (EXP (concat () A))) (WRITE (EXP A)))
        (RULE (VAR A B C) (READ  (EXP (concat (A B) C))) (WRITE (EXP (A (concat B C)))))
        
        (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \\A)))
    )
    
    /normalize/
    
    (
        DREWRITE
        
        (RULE (VAR A) (READ (EXP (\\normalize \\A))) (WRITE (EXP (return (norm A)))))
        
        (RULE (READ (EXP (norm ()))) (WRITE (EXP ())))
        (RULE (VAR a) (READ (EXP (norm a))) (WRITE (EXP a)))
        (RULE (VAR A) (READ (EXP (norm A))) (WRITE (EXP ((norm (HEADL A)) (norm (TAILL A))))))
        
        (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \\A)))
    )
    
    /denormalize/
    
    (
        DREWRITE
        
        (RULE (VAR A) (READ (EXP (\\denormalize \\A))) (WRITE (EXP (return (denorm A)))))
        
        (RULE (READ (EXP (denorm ()))) (WRITE (EXP ())))
        (RULE (VAR a) (READ (EXP (denorm a))) (WRITE (EXP a)))
        (RULE (VAR A B) (READ (EXP (denorm (A B)))) (WRITE (EXP (CONSL (denorm A) (denorm B)))))
        
        (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \\A)))
    )
)
`,
"example-datalog-input":
`
(
    DATALOG
    (
        DATA
        (FACT (parent Xerces Brooke))
        (FACT (parent Brooke Damocles))
        (
            RULE
            (CONSEQ (ancestor Xerces Damocles))
            (ANTECS (parent Xerces Brooke) (parent Brooke Damocles))
        )
        (
            RULE
            (CONSEQ (ancestor Xerces1 Damocles))
            (ANTECS (ancestor Xerces Damocles))
        )
        (
            RULE
            (CONSEQ (ancestor Xerces1 Damocles1))
            (ANTECS (ancestor Xerces1 Damocles))
        )
    )
    (QUERY (ancestor Xerces Damocles))
)
///
(
    DATALOG
    (
        DATA
        (FACT (parent Xerces Brooke))
        (FACT (parent Brooke Damocles))
        (
            RULE
            (VAR X Y)
            (CONSEQ (ancestor X Y))
            (ANTECS (parent X Y))
        )
        (
            RULE
            (VAR X Y Z)
            (CONSEQ (ancestor X Y))
            (ANTECS (parent X Z) (ancestor Z Y))
        )
    )
    (QUERY (VAR X) (ancestor Xerces X))
)
///
`
}

