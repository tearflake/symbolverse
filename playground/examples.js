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

    (RULE (READ (\\hello \\machine)) (WRITE (\\hello \\world)))
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

    (RULE (VAR Name) (READ (\\greet \\Name)) (WRITE (\\hello \\Name)))
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

    (RULE (READ (\\isGood \\girl)) (WRITE (\\makeToy \\doll)))
    (RULE (READ (\\isGood \\boy) ) (WRITE (\\makeToy \\car) ))
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
        (READ  (\\isDoing \\Name \\drivingRocket))
        (WRITE (\\isTitled \\Name \\astronaut)   )
    )
    (
        RULE
        (VAR Name)
        (READ  (\\isDoing \\Name \\healingPeople))
        (WRITE (\\isTitled \\Name \\doctor)      )
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

    (RULE (READ (\\sunIs \\rising) ) (WRITE (itIs morning)  ))
    (RULE (READ (\\sunIs \\falling)) (WRITE (itIs afternoon)))

    (RULE (READ (itIs morning)  ) (WRITE (shadowsLean west)))
    (RULE (READ (itIs afternoon)) (WRITE (shadowsLean east)))

    (RULE (READ (shadowsLean west)) (WRITE (\\shadowsDo \\shrink)))
    (RULE (READ (shadowsLean east)) (WRITE (\\shadowsDo \\expand)))
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
        (READ  (\\orbitsAround \\P1 \\P2) )
        (WRITE (attractsMoreThan P2 P1))
    )
    (
        RULE
        (VAR P1 P2)
        (READ  (attractsMoreThan P1 P2))
        (WRITE (\\weightsMoreThan \\P1 \\P2))
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
    (RULE (VAR Fruit) (READ (\\plantSeed \\Fruit)) (WRITE (plantingSeed Fruit)))
    
    /exit point/
    (RULE (VAR Fruit) (READ (fruitGrowing Fruit)) (WRITE (\\fruitGrows \\Fruit)))
    
    (
        REWRITE
        
        (RULE (VAR Fruit) (READ (\\plantingSeed \\Fruit)) (WRITE (treeForms Fruit)     ))
        (RULE (VAR Fruit) (READ (treeForms Fruit)     ) (WRITE (blooms Fruit)        ))
        (RULE (VAR Fruit) (READ (blooms Fruit)        ) (WRITE (getsPollinated Fruit)))
        (RULE (VAR Fruit) (READ (getsPollinated Fruit)) (WRITE (\\fruitGrowing \\Fruit)))
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
        (READ  (\\Who \\met \\Whom \\at \\Where))
        (WRITE (funMeeting Who Whom Where) )
    )
    
    /exit point/
    (
        RULE
        (VAR Char1 Char2 Site)
        (READ  (funMeeting Char1 Char2 Site)         )
        (WRITE (\\Char1 \\and \\Char2 \\hadPartyAt \\Site))
    )
    
    (
        REWRITE
        (RULE (READ \\bug1) (WRITE \\ladybug  ))
        (RULE (READ \\bug2) (WRITE \\butterfly))
        (RULE (READ \\bug3) (WRITE \\bee      ))
    )

    (
        REWRITE
        (RULE (READ \\place1) (WRITE \\orchard))
        (RULE (READ \\place2) (WRITE \\meadow ))
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
    (RULE (VAR a) (READ (\\headA \\a)) (WRITE (HEADA \\a)))
    (RULE (VAR a) (READ (\\tailA \\a)) (WRITE (TAILA \\a)))
    (RULE (VAR h t) (READ (\\consA \\h \\t)) (WRITE (CONSA \\h \\t)))
    
    /sub-list/
    (RULE (VAR A) (READ (\\headL \\A)) (WRITE (HEADL \\A)))
    (RULE (VAR A) (READ (\\tailL \\A)) (WRITE (TAILL \\A)))
    (RULE (VAR H T) (READ (\\consL \\H \\T)) (WRITE (CONSL \\H \\T)))
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
        (READ (\\iff \\true \\A \\B))
        (WRITE \\A)
    )
    (
        RULE
        (VAR A B)
        (READ (\\iff \\false \\A \\B))
        (WRITE \\B)
    )
    
    /equality predicate/
    (
        RULE
        (VAR A)
        (READ (\\eq \\A \\A))
        (WRITE \\true)
    )
    (
        RULE
        (VAR A B)
        (READ (\\eq \\A \\B))
        (WRITE \\false)
    )
    
    ///
    Boolean algebra
    ///
    
    /truth table for \`not\` operator/
    (RULE (READ (\\not \\true )) (WRITE \\false))
    (RULE (READ (\\not \\false)) (WRITE \\true ))
    
    /truth table for \`and\` operator/
    (RULE (READ (\\and \\true  \\true )) (WRITE \\true ))
    (RULE (READ (\\and \\true  \\false)) (WRITE \\false))
    (RULE (READ (\\and \\false \\true )) (WRITE \\false))
    (RULE (READ (\\and \\false \\false)) (WRITE \\false))
    
    /truth table for \`or\` operator/
    (RULE (READ (\\or \\true  \\true )) (WRITE \\true ))
    (RULE (READ (\\or \\true  \\false)) (WRITE \\true ))
    (RULE (READ (\\or \\false \\true )) (WRITE \\true ))
    (RULE (READ (\\or \\false \\false)) (WRITE \\false))
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
    (RULE (VAR A) (READ (\\natNum \\A)) (WRITE (computedBin (decToBin (splitNum A)))))
    (RULE (VAR A) (READ (computedBin A)) (WRITE (computedDec (joinNum (binToDec A)))))
    (RULE         (READ (computedDec neg)) (WRITE \\"Natural number error"))
    (RULE (VAR A) (READ (computedDec A)) (WRITE \\A))

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
    (RULE (VAR A) (READ (\\interpretSki \\A)) (WRITE (interpretingSki A)))
    
    /combinators/
    (RULE (VAR X) (READ (I X)) (WRITE X))
    (RULE (VAR X Y) (READ ((K X) Y)) (WRITE X))
    (RULE (VAR X Y Z) (READ (((S X) Y) Z)) (WRITE ((X Z) (Y Z))))
    
    /exit point/
    (RULE (VAR A) (READ (interpretingSki A)) (WRITE \\A))
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

Converting lambda calculus expressions to SKI combinator calculus involves eliminating variables
by expressing functions solely in terms of the combinators S, K, and I. This process
systematically replaces abstractions and applications using transformation rules, such as
translating λx.x to I, λx.E (when x is not free in E) to K E, and λx.(E1 E2) to S (λx.E1) (λx.E2).
This allows computation to be represented without variable binding.
///

(
    REWRITE
    
    /entry point/
    (RULE (VAR A) (READ (\\lcToSki \\A)) (WRITE (compilingToSki A)))
    
    /LC to SKI compiler/
    (RULE (VAR x) (READ (lmbd x x)) (WRITE I))
    (RULE (VAR x E1 E2) (READ (lmbd x (E1 E2))) (WRITE ((S (lmbd x E1)) (lmbd x E2))))
    (RULE (VAR x y) (READ (lmbd x y)) (WRITE (K y)))
    
    /exit point/
    (RULE (VAR A) (READ (compilingToSki A)) (WRITE \\A))
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
(CONST A) = (const A)
(IMPL A B) = (impl A B)
AxmI = (impl A A)
AxmK = (impl A (impl B A))
AxmS = (impl (impl A (impl B C)) (impl (impl A B) (impl A C)))
(Apply (impl A B) A) = B
--------------------------------------------------------------
\`\`\`
///

(
    REWRITE
    
    /entry point/
    (RULE (VAR A) (READ (\\check \\A)) (WRITE (proofChecking A)))
    
    /constant types/
    (
        RULE
        (VAR A)
        (READ (CONST A))
        (WRITE (typed (const A)))
    )
    (
        RULE
        (VAR A B)
        (READ (IMPL (typed A) (typed B)))
        (WRITE (typed (impl A B)))
    )
    
    /axioms/
    (
        RULE
        (VAR A B)
        (READ AxmI)
        (WRITE (typed (impl A A)))
    )
    (
        RULE
        (VAR A B)
        (READ AxmK)
        (WRITE (typed (impl A (impl B A))))
    )
    (
        RULE
        (VAR A B C)
        (READ AxmS)
        (WRITE (typed (impl (impl A (impl B C)) (impl (impl A B) (impl A C)))))
    )
    
    /modus ponens/
    (
        RULE
        (VAR A B)
        (
            READ
            (
                Apply
                (typed (impl A B))
                (typed A)
            )
        )
        (
            WRITE
            (typed B)
        )
    )
    
    /exit point/
    (RULE (VAR A) (READ (proofChecking (typed A))) (WRITE \\A))
    (RULE (VAR A) (READ (proofChecking A)) (WRITE \\"Proof checking error"))
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
            (
                Apply
                (
                    Apply
                    AxmS
                    (
                        Apply
                        AxmK
                        (
                            Apply
                            AxmS
                            AxmI
                        )
                    )
                )
                AxmK
            )
            (CONST A)
        )
        (IMPL (CONST A) (CONST B))
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

