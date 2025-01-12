examples = {
"example-test1":
`
(
    REWRITE
    
    /entry point/
    (RULE (VAR Fruit) (READ (EXP (\\plantSeed \\Fruit))) (WRITE (EXP (plantSeed Fruit))))
    
    /exit point/
    (RULE (VAR Fruit) (READ (EXP (fruitGrows Fruit))) (WRITE (EXP (\\fruitGrows Fruit))))
    
    (
        REWRITE
        
        (RULE (VAR Fruit) (READ (EXP (\\plantSeed \\Fruit)    )) (WRITE (EXP (treeForms Fruit)     )))
        (RULE (VAR Fruit) (READ (EXP (treeForms Fruit)     )) (WRITE (EXP (blooms Fruit)        )))
    )
    
    (
        REWRITE
        
        (RULE (VAR Fruit) (READ (EXP (blooms Fruit)        )) (WRITE (EXP (getsPollinated Fruit))))
        (RULE (VAR Fruit) (READ (EXP (getsPollinated Fruit))) (WRITE (EXP (\\fruitGrows Fruit)   )))
    )
)
`,
"example-test1-input":
`
(plantSeed apple)
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
`,

"example-uvar1":
`
///
or introduction
///

(
    REWRITE
    
    (RULE (VAR A B) (READ (EXP (\\[or-intro] \\A))) (WRITE (EXP (\\or \\A \\B))))
)
`,
"example-uvar1-input":
`
([or-intro] x)
`,

"example-uvar2":
`
///
unbound variables reverse equality test
///

(
    REWRITE
    
    (RULE (READ (EXP (\\equals \\abc \\abc))) (WRITE (EXP \\true)))
)
`,
"example-uvar2-input":
`
(equals (UNBOUND A) (UNBOUND A))
`,

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

"example1-7":
`
///
world spinning decision

 input: \`(peopleAre happy/sad)\`
output: \`(stillTurns world)\`
///

(
    RULE
    (
        READ
        
        (RULE (READ happy) (WRITE mood))
        (RULE (READ sad  ) (WRITE mood))
        
        (EXP (peopleAre mood))
    )
    (
        WRITE
        
        (EXP (stillTurns object))
        
        (RULE (READ object) (WRITE world))
    )
)
`,
"example1-7-input":
`
(peopleAre happy)
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
    (RULE (VAR Fruit) (READ (EXP (\\plantSeed \\Fruit))) (WRITE (EXP (plantSeed Fruit))))
    
    /exit point/
    (RULE (VAR Fruit) (READ (EXP (fruitGrows Fruit))) (WRITE (EXP (\\fruitGrows \\Fruit))))
    
    (
        REWRITE
        
        (RULE (VAR Fruit) (READ (EXP (\\plantSeed \\Fruit)   )) (WRITE (EXP (treeForms Fruit)     )))
        (RULE (VAR Fruit) (READ (EXP (treeForms Fruit)     )) (WRITE (EXP (blooms Fruit)        )))
        (RULE (VAR Fruit) (READ (EXP (blooms Fruit)        )) (WRITE (EXP (getsPollinated Fruit))))
        (RULE (VAR Fruit) (READ (EXP (getsPollinated Fruit))) (WRITE (EXP (\\fruitGrows \\Fruit)  )))
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
animal voices

 input: \`(goes X voice)\`
output: \`(isA X dog / cat)\`
///

(
    RULE
    (
        READ
        
        (RULE (READ Milo) (WRITE name ))
        (RULE (READ Nora) (WRITE name ))
        (RULE (READ bark) (WRITE voice))
        (RULE (READ meow) (WRITE voice))

        (EXP (goes name voice))
    )
    (
        REWRITE
        
        (RULE (VAR X) (READ (goes X meow)) (WRITE (isA X cat)))
        (RULE (VAR X) (READ (goes X bark)) (WRITE (isA X dog)))
    )
    (
        WRITE
        
        (EXP (isA name living))

        (RULE (READ name  ) (WRITE Milo))
        (RULE (READ name  ) (WRITE Nora))
        (RULE (READ living) (WRITE dog ))
        (RULE (READ living) (WRITE cat ))
    )
)
`,
"example1-10-input":
`
(goes Nora meow)
`,

"example-branch":
`
///
branching choice
///

(
    REWRITE
    
    (
        RULE
        (VAR X Y)
        (READ (EXP (\\iff \\true \\X \\Y)))
        (WRITE (EXP \\X))
    )
    (
        RULE
        (VAR X Y)
        (READ (EXP (\\iff \\false \\X \\Y)))
        (WRITE (EXP \\Y))
    )
)
`,
"example-branch-input":
`
(iff true "Yes, it's true." "No, it's false.")
`,

"example-bool":
`
///
Boolean evaluator
///

(
    REWRITE
        
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
    
    /truth table for \`impl\` operator/
    (RULE (READ (EXP (\\impl \\true  \\true ))) (WRITE (EXP \\true )))
    (RULE (READ (EXP (\\impl \\true  \\false))) (WRITE (EXP \\false)))
    (RULE (READ (EXP (\\impl \\false \\true ))) (WRITE (EXP \\true )))
    (RULE (READ (EXP (\\impl \\false \\false))) (WRITE (EXP \\true )))
    
    /truth table for \`eq\` operator/
    (RULE (READ (EXP (\\eq \\true  \\true ))) (WRITE (EXP \\true )))
    (RULE (READ (EXP (\\eq \\true  \\false))) (WRITE (EXP \\false)))
    (RULE (READ (EXP (\\eq \\false \\true ))) (WRITE (EXP \\false)))
    (RULE (READ (EXP (\\eq \\false \\false))) (WRITE (EXP \\true )))
)
`,
"example-bool-input":
`
(
    eq
    (and true false)
    (not (or (not true) (not false)))
)
`,

"example-binadd":
`
///
infinite bit binary number addition
///

(
    REWRITE

    /both numbers single digits/
    (RULE           (READ (EXP (\\binAdd       \\0     \\0))) (WRITE (EXP                                \\0)))
    (RULE           (READ (EXP (\\binAdd       \\0     \\1))) (WRITE (EXP                                \\1)))
    (RULE           (READ (EXP (\\binAdd       \\1     \\0))) (WRITE (EXP                                \\1)))
    (RULE           (READ (EXP (\\binAdd       \\1     \\1))) (WRITE (EXP (                          \\1 \\0))))
    
    /first number multiple digits, second number single digit/
    (RULE (VAR A  ) (READ (EXP (\\binAdd  (\\A \\0)     \\0))) (WRITE (EXP (                          \\A \\0))))
    (RULE (VAR A  ) (READ (EXP (\\binAdd  (\\A \\0)     \\1))) (WRITE (EXP (                          \\A \\1))))
    (RULE (VAR A  ) (READ (EXP (\\binAdd  (\\A \\1)     \\0))) (WRITE (EXP (                          \\A \\1))))
    (RULE (VAR A  ) (READ (EXP (\\binAdd  (\\A \\1)     \\1))) (WRITE (EXP (             (\\binAdd \\1 \\A) \\0))))
    
    /first number single digit, second number multiple digits/
    (RULE (VAR B  ) (READ (EXP (\\binAdd      \\0 (\\B \\0)))) (WRITE (EXP (                          \\B \\0))))
    (RULE (VAR B  ) (READ (EXP (\\binAdd      \\0 (\\B \\1)))) (WRITE (EXP (                          \\B \\1))))
    (RULE (VAR B  ) (READ (EXP (\\binAdd      \\1 (\\B \\0)))) (WRITE (EXP (                          \\B \\1))))
    (RULE (VAR B  ) (READ (EXP (\\binAdd      \\1 (\\B \\1)))) (WRITE (EXP (             (\\binAdd \\1 \\B) \\0))))
    
    /both numbers multiple digits/
    (RULE (VAR A B) (READ (EXP (\\binAdd (\\A \\0) (\\B \\0)))) (WRITE (EXP (             (\\binAdd \\A \\B) \\0))))
    (RULE (VAR A B) (READ (EXP (\\binAdd (\\A \\0) (\\B \\1)))) (WRITE (EXP (             (\\binAdd \\A \\B) \\1))))
    (RULE (VAR A B) (READ (EXP (\\binAdd (\\A \\1) (\\B \\0)))) (WRITE (EXP (             (\\binAdd \\A \\B) \\1))))
    (RULE (VAR A B) (READ (EXP (\\binAdd (\\A \\1) (\\B \\1)))) (WRITE (EXP ((\\binAdd \\1 (\\binAdd \\A \\B)) \\0))))
)
`,
"example-binadd-input":
`
(
    binAdd
    (((0 0) 1) 0)
    (((0 1) 0) 1)
)
`,

"example-binadd-4bit":
`
///
4 bit binary number addition
///

(
    REWRITE

    /addWithOverflow/
    (
        RULE
        (
            VAR
            A1 B1 C1 D1
            A2 B2 C2 D2
        )
        (
            READ
            (
                EXP
                (
                    \\binAdd4
                    (((A1 B1) C1) D1)
                    (((A2 B2) C2) D2)
                )
            )
        )
        (
            WRITE 
            (
                EXP 
                (
                    \\checkOverflow
                    (
                        \\binAdd
                        ((((A1 A1) B1) C1) D1)
                        ((((A2 A2) B2) C2) D2)
                    )
                )
            )
        )
    )
    
    /truncate extra bit/
    (RULE (VAR A B C D E F) (READ (EXP (\\checkOverflow (((((A B) C) D) E) F)))) (WRITE (EXP (\\checkOverflow ((((B C) D) E) F)))))
    
    /check overflow/
    (RULE (VAR A B C D  ) (READ (EXP (\\checkOverflow ((((\\0 \\1) B) C) D)) )) (WRITE (EXP \\overflow)    ))
    (RULE (VAR A B C D  ) (READ (EXP (\\checkOverflow ((((\\1 \\0) B) C) D)) )) (WRITE (EXP \\overflow)    ))
    (RULE (VAR X A B C D) (READ (EXP (\\checkOverflow ((((X A) B) C) D))   )) (WRITE (EXP (((A B) C) D))))

    /both numbers single digits/
    (RULE           (READ (EXP (\\binAdd     \\0     \\0))) (WRITE (EXP                              \\0)))
    (RULE           (READ (EXP (\\binAdd     \\0     \\1))) (WRITE (EXP                              \\1)))
    (RULE           (READ (EXP (\\binAdd     \\1     \\0))) (WRITE (EXP                              \\1)))
    (RULE           (READ (EXP (\\binAdd     \\1     \\1))) (WRITE (EXP (                        \\1 \\0))))
    
    /first number multiple digits, second number single digit/
    (RULE (VAR A  ) (READ (EXP (\\binAdd (A \\0)     \\0))) (WRITE (EXP (                         A \\0))))
    (RULE (VAR A  ) (READ (EXP (\\binAdd (A \\0)     \\1))) (WRITE (EXP (                         A \\1))))
    (RULE (VAR A  ) (READ (EXP (\\binAdd (A \\1)     \\0))) (WRITE (EXP (                         A \\1))))
    (RULE (VAR A  ) (READ (EXP (\\binAdd (A \\1)     \\1))) (WRITE (EXP (            (\\binAdd \\1 A) \\0))))
    
    /first number single digit, second number multiple digits/
    (RULE (VAR B  ) (READ (EXP (\\binAdd     \\0 (B \\0)))) (WRITE (EXP (                         B \\0))))
    (RULE (VAR B  ) (READ (EXP (\\binAdd     \\0 (B \\1)))) (WRITE (EXP (                         B \\1))))
    (RULE (VAR B  ) (READ (EXP (\\binAdd     \\1 (B \\0)))) (WRITE (EXP (                         B \\1))))
    (RULE (VAR B  ) (READ (EXP (\\binAdd     \\1 (B \\1)))) (WRITE (EXP (            (\\binAdd \\1 B) \\0))))
    
    /both numbers multiple digits/
    (RULE (VAR A B) (READ (EXP (\\binAdd (A \\0) (B \\0)))) (WRITE (EXP (             (\\binAdd A B) \\0))))
    (RULE (VAR A B) (READ (EXP (\\binAdd (A \\0) (B \\1)))) (WRITE (EXP (             (\\binAdd A B) \\1))))
    (RULE (VAR A B) (READ (EXP (\\binAdd (A \\1) (B \\0)))) (WRITE (EXP (             (\\binAdd A B) \\1))))
    (RULE (VAR A B) (READ (EXP (\\binAdd (A \\1) (B \\1)))) (WRITE (EXP ((\\binAdd \\1 (\\binAdd A B)) \\0))))
)
`,
"example-binadd-4bit-input":
`
(
    binAdd4
    (((0 0) 1) 0)
    (((0 1) 0) 1)
)
`,

"example-bincompare":
`
///
infinite bit binary number comparison
///

(
    REWRITE

    /entry point/
    (RULE (VAR X Y) (READ (EXP (\\leq \\X \\Y))) (WRITE (EXP (leqUtil (binCmp X Y)))))
    
    /exit point/
    (RULE (READ (EXP (leqUtil gt))) (WRITE (EXP \\false)))
    (RULE (READ (EXP (leqUtil eq))) (WRITE (EXP \\true )))
    (RULE (READ (EXP (leqUtil lt))) (WRITE (EXP \\true )))
    
    (
        REWRITE
        
        /both numbers single digits/
        (RULE           (READ (EXP (\\binCmp       \\0     \\0))) (WRITE (EXP                   \\eq)))
        (RULE           (READ (EXP (\\binCmp       \\0     \\1))) (WRITE (EXP                   \\lt)))
        (RULE           (READ (EXP (\\binCmp       \\1     \\0))) (WRITE (EXP                   \\gt)))
        (RULE           (READ (EXP (\\binCmp       \\1     \\1))) (WRITE (EXP                   \\eq)))
        
        /first number multiple digits, second number single digit/
        (RULE (VAR A  ) (READ (EXP (\\binCmp  (\\A \\0)     \\0))) (WRITE (EXP ((\\binCmp \\A \\0) \\eq))))
        (RULE (VAR A  ) (READ (EXP (\\binCmp  (\\A \\0)     \\1))) (WRITE (EXP ((\\binCmp \\A \\0) \\lt))))
        (RULE (VAR A  ) (READ (EXP (\\binCmp  (\\A \\1)     \\0))) (WRITE (EXP ((\\binCmp \\A \\0) \\gt))))
        (RULE (VAR A  ) (READ (EXP (\\binCmp  (\\A \\1)     \\1))) (WRITE (EXP ((\\binCmp \\A \\0) \\eq))))
        
        /first number single digit, second number multiple digits/
        (RULE (VAR B  ) (READ (EXP (\\binCmp      \\0 (\\B \\0)))) (WRITE (EXP ((\\binCmp \\0 \\B) \\eq))))
        (RULE (VAR B  ) (READ (EXP (\\binCmp      \\0 (\\B \\1)))) (WRITE (EXP ((\\binCmp \\0 \\B) \\lt))))
        (RULE (VAR B  ) (READ (EXP (\\binCmp      \\1 (\\B \\0)))) (WRITE (EXP ((\\binCmp \\0 \\B) \\gt))))
        (RULE (VAR B  ) (READ (EXP (\\binCmp      \\1 (\\B \\1)))) (WRITE (EXP ((\\binCmp \\0 \\B) \\eq))))
        
        /both numbers multiple digits/
        (RULE (VAR A B) (READ (EXP (\\binCmp (\\A \\0) (\\B \\0)))) (WRITE (EXP ((\\binCmp \\A \\B) \\eq))))
        (RULE (VAR A B) (READ (EXP (\\binCmp (\\A \\0) (\\B \\1)))) (WRITE (EXP ((\\binCmp \\A \\B) \\lt))))
        (RULE (VAR A B) (READ (EXP (\\binCmp (\\A \\1) (\\B \\0)))) (WRITE (EXP ((\\binCmp \\A \\B) \\gt))))
        (RULE (VAR A B) (READ (EXP (\\binCmp (\\A \\1) (\\B \\1)))) (WRITE (EXP ((\\binCmp \\A \\B) \\eq))))
        
        /reduce to final value/
        (RULE (VAR N) (READ (EXP (\\gt \\N))) (WRITE (EXP \\gt)))
        (RULE (VAR N) (READ (EXP (\\lt \\N))) (WRITE (EXP \\lt)))
        (RULE (VAR N) (READ (EXP (\\eq \\N))) (WRITE (EXP \\N)))
    )
)
`,
"example-bincompare-input":
`
(
    leq
    (((0 1) 0) 1)
    (((0 1) 0) 1)
)
`,

"example-bincompare-4bit":
`
///
4 bit binary number comparison
///

(
    REWRITE

    ///
    adding
    ///
    ///
    /both numbers single digits/
    (RULE           (READ (EXP (\\binAdd     \\0     \\0))) (WRITE (EXP                              \\0)))
    (RULE           (READ (EXP (\\binAdd     \\0     \\1))) (WRITE (EXP                              \\1)))
    (RULE           (READ (EXP (\\binAdd     \\1     \\0))) (WRITE (EXP                              \\1)))
    (RULE           (READ (EXP (\\binAdd     \\1     \\1))) (WRITE (EXP (                        \\1 \\0))))
    
    /first number multiple digits, second number single digit/
    (RULE (VAR A  ) (READ (EXP (\\binAdd (A \\0)     \\0))) (WRITE (EXP (                         A \\0))))
    (RULE (VAR A  ) (READ (EXP (\\binAdd (A \\0)     \\1))) (WRITE (EXP (                         A \\1))))
    (RULE (VAR A  ) (READ (EXP (\\binAdd (A \\1)     \\0))) (WRITE (EXP (                         A \\1))))
    (RULE (VAR A  ) (READ (EXP (\\binAdd (A \\1)     \\1))) (WRITE (EXP (            (\\binAdd \\1 A) \\0))))
    
    /first number single digit, second number multiple digits/
    (RULE (VAR B  ) (READ (EXP (\\binAdd     \\0 (B \\0)))) (WRITE (EXP (                         B \\0))))
    (RULE (VAR B  ) (READ (EXP (\\binAdd     \\0 (B \\1)))) (WRITE (EXP (                         B \\1))))
    (RULE (VAR B  ) (READ (EXP (\\binAdd     \\1 (B \\0)))) (WRITE (EXP (                         B \\1))))
    (RULE (VAR B  ) (READ (EXP (\\binAdd     \\1 (B \\1)))) (WRITE (EXP (            (\\binAdd \\1 B) \\0))))
    
    /both numbers multiple digits/
    (RULE (VAR A B) (READ (EXP (\\binAdd (A \\0) (B \\0)))) (WRITE (EXP (             (\\binAdd A B) \\0))))
    (RULE (VAR A B) (READ (EXP (\\binAdd (A \\0) (B \\1)))) (WRITE (EXP (             (\\binAdd A B) \\1))))
    (RULE (VAR A B) (READ (EXP (\\binAdd (A \\1) (B \\0)))) (WRITE (EXP (             (\\binAdd A B) \\1))))
    (RULE (VAR A B) (READ (EXP (\\binAdd (A \\1) (B \\1)))) (WRITE (EXP ((\\binAdd \\1 (\\binAdd A B)) \\0))))
    
    /truncate overflow/
    (RULE (VAR A B C D E) (READ (EXP ((((A B) C) D) E))) (WRITE (EXP (((B C) D) E))))
    ///
    ///
    bitwise not
    ///

    (RULE (VAR A) (READ (EXP (\\bnot (A \\0)))) (WRITE (EXP ((\\bnot A) \\1))))
    (RULE (VAR A) (READ (EXP (\\bnot (A \\1)))) (WRITE (EXP ((\\bnot A) \\0))))
    (RULE         (READ (EXP (\\bnot     \\0))) (WRITE (EXP             \\1)))
    (RULE         (READ (EXP (\\bnot     \\1))) (WRITE (EXP             \\0)))
    
    ///
    less than zero
    ///
    
    (RULE (VAR B C D) (READ (EXP (\\ltz (((\\1 B) C) D)))) (WRITE (EXP \\true )))
    (RULE (VAR B C D) (READ (EXP (\\ltz (((\\0 B) C) D)))) (WRITE (EXP \\false)))

    ///
    less or equal
    ///
    
    /(RULE (VAR A B) (READ (EXP (\\leq A B))) (WRITE (EXP (\\ltz (\\binAdd A (\\bnot B))))))/
)
`,
"example-bincompare-4bit-input":
`
(
    leq
    (((0 1) 0) 1)
    (((0 1) 0) 1)
)
`,

"example-append":
`
///
append two lists
///

(
    REWRITE
    
    (
        RULE
        (VAR A B C)
        (READ  (EXP (\\append (\\A \\B) \\C)))
        (WRITE (EXP (\\A (\\append \\B \\C))))
    )
    
    (
        RULE
        (VAR A)
        (READ  (EXP (\\append () \\A)))
        (WRITE (EXP \\A             ))
    )
)
`,
"example-append-input":
`
(
    append
    (one (two (three (four (five ())))))
    (six (seven ()))
)
`,

"example-reverse":
`
///
reverse a list
///

(
    REWRITE
    
    ///
    reverse function
    ///

    (
        RULE
        (VAR A B)
        (READ  (EXP (\\reverse (\\A \\B))             ))
        (WRITE (EXP (\\append (\\reverse \\B) (\\A ()))))
    )
    
    (
        RULE
        (READ  (EXP (\\reverse ())))
        (WRITE (EXP ()           ))
    )

    ///
    append function
    ///

    (
        RULE
        (VAR A B C)
        (READ  (EXP (\\append (\\A \\B) \\C)))
        (WRITE (EXP (\\A (\\append \\B \\C))))
    )
    
    (
        RULE
        (VAR A)
        (READ  (EXP (\\append () \\A)))
        (WRITE (EXP \\A             ))
    )
)
`,
"example-reverse-input":
`
(reverse (one (two (three (four (five (six (seven ()))))))))
`,

"example-remove":
`
///
remove element from list
///

(
    REWRITE
    
    (
        RULE
        (VAR A B C)
        (READ  (EXP (\\remove \\A (\\A \\C))))
        (WRITE (EXP (\\remove \\A \\C)    ))
    )
    
    (
        RULE
        (VAR A B C D)
        (READ  (EXP (\\remove \\A (\\B \\C))))
        (WRITE (EXP (\\B (\\remove \\A \\C))))
    )
    
    (
        RULE
        (VAR A)
        (READ  (EXP (\\remove \\A ())))
        (WRITE (EXP ()             ))
    )
)
`,
"example-remove-input":
`
(
    remove
    five
    (one (two (three (four (five (six (seven ())))))))
)
`,

"example-replace":
`
///
replace element in list
///

(
    REWRITE
    
    (
        RULE
        (VAR A B C D)
        (READ  (EXP (\\replace \\A \\B (\\A \\D))))
        (WRITE (EXP (\\B (\\replace \\A \\B \\D))))
    )
    
    (
        RULE
        (VAR A B C D)
        (READ  (EXP (\\replace \\A \\B (\\C \\D))))
        (WRITE (EXP (\\C (\\replace \\A \\B \\D))))
    )
    
    (
        RULE
        (VAR A B)
        (READ  (EXP (\\replace \\A \\B ())))
        (WRITE (EXP ()                 ))
    )
)
`,
"example-replace-input":
`
(
    replace
    five
    kvin
    (one (two (three (four (five (six (seven ())))))))
)
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
    (RULE (VAR A) (READ (EXP (\\interpretSKI \\A))) (WRITE (EXP (interpretingSKI A))))
    
    /combinators/
    (RULE (VAR X) (READ (EXP (I X))) (WRITE (EXP X)))
    (RULE (VAR X Y) (READ (EXP ((K X) Y))) (WRITE (EXP X)))
    (RULE (VAR X Y Z) (READ (EXP (((S X) Y) Z))) (WRITE (EXP ((X Z) (Y Z)))))
    
    /exit point/
    (RULE (VAR A) (READ (EXP (interpretingSKI A))) (WRITE (EXP \\A)))
)
`,
"example-ski-input":
`
(
    interpretSKI
    ((((S (K (S I))) K) a) b)
)
`,

"example-bool2":
`
///
Boolean logic to SKI compiler

Boolean logic is a branch of mathematics and logic that deals with true or false values, often
represented as 1 (true) and 0 (false). It uses basic operators such as AND (conjunction), OR
(disjunction), and NOT (negation) to manipulate these values. More complex operations, like XOR
(exclusive OR) and NAND, are derived from these basics. Boolean logic is foundational in digital
circuits, computer programming, and search algorithms, as it provides the rules for decision-making
and data processing based on binary conditions.
///

(
    REWRITE
    
    /workflow/
    (RULE (VAR A) (READ (EXP (\\boolToSKI \\A))) (WRITE (EXP (parseBool A))))
    (RULE (VAR A) (READ (EXP (parsedBool A))) (WRITE (EXP (compileToSKI A))))
    (RULE (VAR A) (READ (EXP (compiledToSKI A))) (WRITE (EXP \\A)))

    /parser/
    (
        REWRITE
        
        (RULE (VAR A) (READ (EXP (\\parseBool \\A))) (WRITE (EXP (parsingBool\\ A))))
        
        /tokenizing/
        (RULE (VAR x) (READ (EXP x)) (WRITE (EXP (token\\ x\\))))
        
        /parsing/
        (
            RULE
            (READ (EXP (token\\ true\\)))
            (WRITE (EXP (typed\\ true\\ bool\\)))
        )
        (
            RULE
            (READ (EXP (token\\ false\\)))
            (WRITE (EXP (typed\\ false\\ bool\\)))
        )
        (
            RULE
            (VAR A)
            (READ (EXP ((token\\ not\\) (typed\\ A\\ bool\\))))
            (WRITE (EXP (typed\\ (not\\ A\\) bool\\)))
        )
        (
            RULE
            (VAR A B)
            (READ (EXP ((token\\ or\\) (typed\\ A\\ bool\\) (typed\\ B\\ bool\\))))
            (WRITE (EXP (typed\\ (or\\ A\\ B\\) bool\\)))
        )
        (
            RULE
            (VAR A B)
            (READ (EXP ((token\\ and\\) (typed\\ A\\ bool\\) (typed\\ B\\ bool\\))))
            (WRITE (EXP (typed\\ (and\\ A\\ B\\) bool\\)))
        )
        
        (RULE (VAR A) (READ (EXP (parsingBool\\ (typed\\ A\\ bool\\)))) (WRITE (EXP (\\parsedBool \\A))))
        (RULE (VAR A) (READ (EXP (parsingBool\\ A\\))) (WRITE (EXP \\\\"bool syntax error")))
    )
    
    /compiler/
    (
        REWRITE

        (RULE (VAR A) (READ (EXP (\\compileToSKI \\A))) (WRITE (EXP (compilingToSKI A))))

        (RULE (READ (EXP true)) (WRITE (EXP K)))
        (RULE (READ (EXP false)) (WRITE (EXP (S K))))
        
        (RULE (VAR A) (READ (EXP (not A))) (WRITE (EXP ((A false) true))))
        (RULE (VAR A B) (READ (EXP (or A B))) (WRITE (EXP ((A true) B))))
        (RULE (VAR A B) (READ (EXP (and A B))) (WRITE (EXP ((A B) false))))
        
        (RULE (VAR A) (READ (EXP (compilingToSKI A))) (WRITE (EXP (\\compiledToSKI \\A))))
    )
)
`,
"example-bool2-input":
`
(boolToSKI (not (and false (or false true))))
`,

"example-lamb":
`
///
Lambda calculus to SKI compiler

Lambda calculus is a formal system in mathematical logic and computer science for expressing
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
    (RULE (VAR A) (READ (EXP (\\lcToSKI \\A))) (WRITE (EXP (parseLc A))))
    (RULE (VAR A) (READ (EXP (parsedLc A))) (WRITE (EXP (compileToSKI A))))
    (RULE (VAR A) (READ (EXP (compiledToSKI A))) (WRITE (EXP \\A)))

    /parser/
    (
        REWRITE
        
        (RULE (VAR A) (READ (EXP (\\parseLc \\A))) (WRITE (EXP (parsingLc\\ A))))
        
        /tokenizing/
        (RULE (READ (EXP lmbd)) (WRITE (EXP lmbd\\)))
        
        /parsing/
        (RULE (VAR x) (READ (EXP x)) (WRITE (EXP (typed\\ x\\ (var\\ term\\)))))
        (
            RULE
            (VAR x M ANY)
            (READ (EXP (lmbd\\ (typed\\ x\\ (var\\ term\\)) (typed\\ M\\ (ANY\\ term\\)))))
            (WRITE (EXP (typed\\ (lmbd\\ x\\ M\\) (abs\\ term\\))))
        )
        (
            RULE
            (VAR M N ANY1 ANY2)
            (READ (EXP ((typed\\ M\\ (ANY1\\ term\\)) (typed\\ N\\ (ANY2\\ term\\)))))
            (WRITE (EXP (typed\\ (M\\ N\\) (app\\ term\\))))
        )
        
        (RULE (VAR A ANY) (READ (EXP (parsingLc\\ (typed\\ A\\ (ANY\\ term\\))))) (WRITE (EXP (\\parsedLc \\A))))
        (RULE (VAR A) (READ (EXP (parsingLc\\ A\\))) (WRITE (EXP \\\\"lambda calculus syntax error")))
    )
    
    /compiler/
    (
        REWRITE
        
        (RULE (VAR A) (READ (EXP (\\compileToSKI \\A))) (WRITE (EXP (compilingToSKI A))))
        
        (RULE (VAR x) (READ (EXP (lmbd x x))) (WRITE (EXP I)))
        (RULE (VAR x E1 E2) (READ (EXP (lmbd x (E1 E2)))) (WRITE (EXP ((S (lmbd x E1)) (lmbd x E2)))))
        (RULE (VAR x y) (READ (EXP (lmbd x y))) (WRITE (EXP (K y))))
        
        (RULE (VAR A) (READ (EXP (compilingToSKI A))) (WRITE (EXP (\\compiledToSKI \\A))))
    )
)
`,
"example-lamb-input":
`
(lcToSKI (lmbd x x))
`,

"example-jot":
`
///
Jot framework to SKI compiler

The Jot computational framework is an esoteric minimalist programming language designed to encode
and execute programs using only binary sequences (0s and 1s). Based on the SKI combinatory logic,
Jot translates these sequences into SKI expressions, eliminating the need for variables or explicit
syntax. Each binary sequence represents a unique program or function, and computation is performed
through application of these encoded combinators. Its extreme simplicity makes Jot a theoretical
tool for exploring the foundations of computation and the relationship between binary encoding and
functional programming.
///

(
    REWRITE
    
    /workflow/
    (RULE (VAR A) (READ (EXP (\\jotToSKI \\A))) (WRITE (EXP (parseJot A))))
    (RULE (VAR A) (READ (EXP (parsedJot A))) (WRITE (EXP (compileToSKI A))))
    (RULE (VAR A) (READ (EXP (compiledToSKI A))) (WRITE (EXP \\A)))
    
    /parser/
    (
        REWRITE
        
        (RULE (VAR A) (READ (EXP (\\parseJot \\A))) (WRITE (EXP (parsingJot\\ A))))
        
        /tokenizing/
        (RULE (VAR x) (READ (EXP x)) (WRITE (EXP (token\\ x\\))))
        
        /parsing/
        (
            RULE
            (READ (EXP (token\\ NIL\\)))
            (WRITE (EXP (typed\\ NIL\\ jot\\)))
        )
        (
            RULE
            (VAR A)
            (READ (EXP ((typed\\ A\\ jot\\) (token\\ 0\\))))
            (WRITE (EXP (typed\\ (A\\ 0\\) jot\\)))
        )
        (
            RULE
            (VAR A)
            (READ (EXP ((typed\\ A\\ jot\\) (token\\ 1\\))))
            (WRITE (EXP (typed\\ (A\\ 1\\) jot\\)))
        )
        
        (RULE (VAR A) (READ (EXP (parsingJot\\ (typed\\ A\\ jot\\)))) (WRITE (EXP (\\parsedJot \\A))))
        (RULE (VAR A) (READ (EXP (parsingJot\\ A\\))) (WRITE (EXP \\\\"jot syntax error")))
    )
    
    /compiler/
    (
        REWRITE

        (RULE (VAR A) (READ (EXP (\\compileToSKI \\A))) (WRITE (EXP (compilingToSKI A))))

        (RULE (VAR W) (READ (EXP (W 0))) (WRITE (EXP ((W S) K))))
        (RULE (VAR W) (READ (EXP (W 1))) (WRITE (EXP (S (K W)))))
        (RULE (READ (EXP NIL)) (WRITE (EXP I)))

        (RULE (VAR A) (READ (EXP (compilingToSKI A))) (WRITE (EXP (\\compiledToSKI \\A))))
    )
)
`,
"example-jot-input":
`
(jotToSKI ((((NIL 1) 0) 1) 0))
`,

"example-proof":
`
///
Logic proof to SKI compiler

Compiling an implicational propositional logic proof to an SKI calculus involves translating each
logical step of the proof into a corresponding SKI combinator. In implicational logic, the axioms
(such as \`P -> (Q -> P)\` and \`(P -> (Q -> R)) -> ((P -> Q) -> (P -> R))\`) are represented by simple
combinators like K (which ignores its second argument) and S (which applies a function to two
arguments). Each application of these combinators directly encodes the logical structure of the
proof in SKI calculus. For instance, the proof of an implication such as \`P -> (Q -> P)\` would be
represented by the K combinator. By systematically replacing axioms and applying inference rules,
the entire proof can be reduced to a sequence of SKI combinators, yielding a program that is both
a valid logical proof and an interpretable functional program in SKI calculus.

Such programs in SKI calculus offer several key advantages:

- Deterministic Behavior: They are based on constructive proofs, which ensure that the program's
  execution follows a well-defined, predictable path, avoiding non-determinism.
  
- Termination Guarantee: Since constructive proofs inherently avoid infinite recursion or
  contradiction, SKI programs derived from them are guaranteed to terminate.
  
- Type Safety: The translation from constructive logic to SKI ensures that the program is type-safe,
  corresponding directly to logical propositions, which guarantees correct usage of types.
  
- Correctness: These programs are grounded in a formal proof structure, making them reliable and
  correct by construction.
  
- Reproducibility: Each step in the program corresponds to a logical step in the proof, ensuring that
  the program can be reproduced and verified based on the original proof.

In essence, SKI programs constructed from theorems are reliable, predictable, and verifiable due to
their foundation in constructive logic and formal reasoning.

-------------------------------------------------------------
To verify and compile a proof, assume or apply these rules
-------------------------------------------------------------
(AxI (impl A A))
(AxK (impl A (impl B A)))
(AxS (impl (impl A (impl B C)) (impl (impl A B) (impl A C))))
(AxB (impl (impl B C) (impl (impl A B) (impl A C))))
(AxC (impl (impl A (impl B C)) (impl B (impl A C))))
(AxW (impl (impl A (impl A B)) (impl A B))
(Apply (impl A B) A)
-------------------------------------------------------------
///

(
    REWRITE
    
    /workflow/
    (RULE (VAR A) (READ (EXP (\\proofToSKI \\A))) (WRITE (EXP (proofCheck A))))
    (RULE (VAR A) (READ (EXP (proofChecked A))) (WRITE (EXP (compileToSKI A))))
    (RULE (VAR A) (READ (EXP (compiledToSKI A))) (WRITE (EXP \\A)))
    
    /proof verifier/
    (
        REWRITE
        
        (RULE (VAR A) (READ (EXP (\\proofCheck \\A))) (WRITE (EXP (proofChecking\\ A A\\))))
        
        /tokenizing/
        (RULE (READ (EXP AxI)) (WRITE (EXP AxI\\)))
        (RULE (READ (EXP AxK)) (WRITE (EXP AxK\\)))
        (RULE (READ (EXP AxS)) (WRITE (EXP AxS\\)))
        (RULE (READ (EXP AxB)) (WRITE (EXP AxB\\)))
        (RULE (READ (EXP AxC)) (WRITE (EXP AxC\\)))
        (RULE (READ (EXP AxW)) (WRITE (EXP AxW\\)))
        (RULE (READ (EXP Apply)) (WRITE (EXP Apply\\)))
        (RULE (READ (EXP impl)) (WRITE (EXP impl\\)))
        
        /terminal formulas/
        (
            RULE
            (VAR x)
            (
                READ
                (
                    EXP
                    x
                )
            )
            (
                WRITE
                (
                    EXP
                    (typed\\ x\\ terminal\\ bool\\)
                )
            )
        )
        (
            RULE
            (VAR A B)
            (
                READ
                (
                    EXP
                    (
                        impl\\
                        (typed\\ A\\ terminal\\ bool\\)
                        (typed\\ B\\ terminal\\ bool\\)
                    )
                )
            )
            (
                WRITE
                (
                    EXP
                    (typed\\ (impl\\ A\\ B\\) terminal\\ bool\\)
                )
            )
        )

        /axioms/
        (
            RULE
            (VAR A B)
            (
                READ
                (
                    EXP
                    (
                        AxI\\
                        (
                            typed\\
                            (impl\\ A\\ A\\)
                            terminal\\
                            bool\\
                        )
                    )
                )
            )
            (
                WRITE
                (
                    EXP
                    (
                        typed\\
                        (impl\\ A\\ A\\)
                        step\\
                        bool\\
                    )
                )
            )
        )
        (
            RULE
            (VAR A B)
            (
                READ
                (
                    EXP
                    (
                        AxK\\
                        (
                            typed\\
                            (impl\\ A\\ (impl\\ B\\ A\\))
                            terminal\\
                            bool\\
                        )
                    )
                )
            )
            (
                WRITE
                (
                    EXP
                    (
                        typed\\
                        (impl\\ A\\ (impl\\ B\\ A\\))
                        step\\
                        bool\\
                    )
                )
            )
        )
        (
            RULE
            (VAR A B C)
            (
                READ
                (
                    EXP
                    (
                        AxS\\
                        (
                            typed\\
                            (impl\\ (impl\\ A\\ (impl\\ B\\ C\\)) (impl\\ (impl\\ A\\ B\\) (impl\\ A\\ C\\)))
                            terminal\\
                            bool\\
                        )
                    )
                )
            )
            (
                WRITE
                (
                    EXP
                    (
                        typed\\
                        (impl\\ (impl\\ A\\ (impl\\ B\\ C\\)) (impl\\ (impl\\ A\\ B\\) (impl\\ A\\ C\\)))
                        step\\
                        bool\\
                    )
                )
            )
        )
        
        /utility axioms/
        (
            RULE
            (VAR A B C)
            (
                READ
                (
                    EXP
                    (
                        AxB\\
                        (
                            typed\\
                            (impl\\ (impl\\ B\\ C\\) (impl\\ (impl\\ A\\ B\\) (impl\\ A\\ C\\)))
                            terminal\\
                            bool\\
                        )
                    )
                )
            )
            (
                WRITE
                (
                    EXP
                    (
                        typed\\
                        (impl\\ (impl\\ B\\ C\\) (impl\\ (impl\\ A\\ B\\) (impl\\ A\\ C\\)))
                        step\\
                        bool\\
                    )
                )
            )
        )
        (
            RULE
            (VAR A B C)
            (
                READ
                (
                    EXP
                    (
                        AxC\\
                        (
                            typed\\
                            (impl\\ (impl\\ A\\ (impl\\ B\\ C\\)) (impl\\ B\\ (impl\\ A\\ C\\)))
                            terminal\\
                            bool\\
                        )
                    )
                )
            )
            (
                WRITE
                (
                    EXP
                    (
                        typed\\
                        (impl (impl\\ A\\ (impl\\ B\\ C\\)) (impl\\ B\\ (impl\\ A\\ C\\)))
                        step\\
                        bool\\
                    )
                )
            )
        )
        (
            RULE
            (VAR A B C)
            (
                READ
                (
                    EXP
                    (
                        AxW\\
                        (
                            typed\\
                            (impl\\ (impl\\ A\\ (impl\\ A\\ B\\)) (impl\\ A\\ B\\))
                            terminal\\
                            bool\\
                        )
                    )
                )
            )
            (
                WRITE
                (
                    EXP
                    (
                        typed\\
                        (impl (impl\\ A\\ (impl\\ A\\ B\\)) (impl\\ A\\ B\\))
                        step\\
                        bool\\
                    )
                )
            )
        )
        
        /modus ponens/
        (
            RULE
            (VAR A B Original)
            (
                READ
                (
                    EXP
                    (
                        Apply\\
                        (typed\\ (impl\\ A\\ B\\) step\\ bool\\)
                        (typed\\ A\\ step\\ bool\\)
                    )
                )
            )
            (
                WRITE
                (
                    EXP
                    (typed\\ B\\ step\\ bool\\)
                )
            )
        )

        (RULE (VAR A B) (READ (EXP (proofChecking\\ (typed\\ A\\ step\\ bool\\) B\\))) (WRITE (EXP (\\proofChecked \\B))))
        (RULE (VAR ANY1 ANY2) (READ (EXP (proofChecking\\ ANY1\\ ANY2\\))) (WRITE (EXP \\\\"Proof verification syntax error")))
    )

    /compiler/
    (
        REWRITE

        (RULE (VAR A) (READ (EXP (\\compileToSKI \\A))) (WRITE (EXP (compilingToSKI A))))

        (RULE (VAR A B) (READ (EXP (Apply A B))) (WRITE (EXP (A B))))
        (RULE (VAR ANY) (READ (EXP (AxI ANY))) (WRITE (EXP I)))
        (RULE (VAR ANY) (READ (EXP (AxK ANY))) (WRITE (EXP K)))
        (RULE (VAR ANY) (READ (EXP (AxS ANY))) (WRITE (EXP S)))
        (RULE (VAR ANY) (READ (EXP (AxB ANY))) (WRITE (EXP ((S (K S)) K))))
        (RULE (VAR ANY) (READ (EXP (AxC ANY))) (WRITE (EXP ((S ((S (K ((S (K S)) K))) S)) (K K)))))
        (RULE (VAR ANY) (READ (EXP (AxW ANY))) (WRITE (EXP ((S S) (S K)))))

        (RULE (VAR A) (READ (EXP (compilingToSKI A))) (WRITE (EXP (\\compiledToSKI \\A))))
    )
)
`,
"example-proof-input":
`
(
    proofToSKI
    (
        Apply /return type: (A -> A)/
        (
            Apply /return type: ((A -> (A -> A)) -> (A -> A))/
            (
                AxS
                (impl (impl A (impl (impl A A) A)) (impl (impl A (impl A A)) (impl A A)))
            )
            (
                AxK
                (impl A (impl (impl A A) A))
            )
        )
        (
            AxK
            (impl A (impl A A))
        )
    )
)
`,

"example-prfver":
`
///
Propositional logic proof verifier

Verifying proofs in propositional logic is the process of checking whether a given sequence of
statements, starting from axioms and applying inference rules, correctly leads to a target formula
(the theorem). This task is computationally efficient and belongs to the class P (polynomial time),
as it involves a straightforward syntactic verification. Each step in the proof is checked to
ensure it follows logically from the previous steps according to the rules of the chosen proof
system. Since the structure and rules of propositional logic are well-defined and finite, verifying
the correctness of a proof requires only a linear or polynomial number of operations relative to
the length of the proof. This makes proof verification significantly easier than finding a proof,
which can involve an exponential search through potential derivations.

-------------------------------------------------------------
To use this verifier, assume or apply these rules
-------------------------------------------------------------
(AxK (impl A (impl B A)))
(AxS (impl (impl A (impl B C)) (impl (impl A B) (impl A C))))
(Apply (impl A B) A)
-------------------------------------------------------------
///

(
    REWRITE
    
    /workflow/
    (RULE (VAR A) (READ (EXP (\\verifyProof \\A))) (WRITE (EXP (proofCheck A))))
    (
        RULE
        (VAR A)
        (READ (EXP (proofChecked A)))
        (WRITE (EXP (\\"The proof is correctly stated, proved theorem is:" \\A)))
    )
    
    /verifier/
    (
        REWRITE
        
        (RULE (VAR A) (READ (EXP (\\proofCheck \\A))) (WRITE (EXP (proofChecking\\ A))))
        
        /tokenizing/
        (RULE (READ (EXP AxK)) (WRITE (EXP AxK\\)))
        (RULE (READ (EXP AxS)) (WRITE (EXP AxS\\)))
        (RULE (READ (EXP Apply)) (WRITE (EXP Apply\\)))
        (RULE (READ (EXP impl)) (WRITE (EXP impl\\)))
        
        /terminal formulas/
        (
            RULE
            (VAR x)
            (
                READ
                (
                    EXP
                    x
                )
            )
            (
                WRITE
                (
                    EXP
                    (typed\\ x\\ terminal\\ bool\\)
                )
            )
        )
        (
            RULE
            (VAR A B)
            (
                READ
                (
                    EXP
                    (
                        impl\\
                        (typed\\ A\\ terminal\\ bool\\)
                        (typed\\ B\\ terminal\\ bool\\)
                    )
                )
            )
            (
                WRITE
                (
                    EXP
                    (typed\\ (impl\\ A\\ B\\) terminal\\ bool\\)
                )
            )
        )

        /axioms/
        (
            RULE
            (VAR A B)
            (
                READ
                (
                    EXP
                    (
                        AxK\\
                        (
                            typed\\
                            (impl\\ A\\ (impl\\ B\\ A\\))
                            terminal\\
                            bool\\
                        )
                    )
                )
            )
            (
                WRITE
                (
                    EXP
                    (
                        typed\\
                        (impl\\ A\\ (impl\\ B\\ A\\))
                        step\\
                        bool\\
                    )
                )
            )
        )
        (
            RULE
            (VAR A B C)
            (
                READ
                (
                    EXP
                    (
                        AxS\\
                        (
                            typed\\
                            (impl\\ (impl\\ A\\ (impl\\ B\\ C\\)) (impl\\ (impl\\ A\\ B\\) (impl\\ A\\ C\\)))
                            terminal\\
                            bool\\
                        )
                    )
                )
            )
            (
                WRITE
                (
                    EXP
                    (
                        typed\\
                        (impl\\ (impl\\ A\\ (impl\\ B\\ C\\)) (impl\\ (impl\\ A\\ B\\) (impl\\ A\\ C\\)))
                        step\\
                        bool\\
                    )
                )
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
                        Apply\\
                        (typed\\ (impl\\ A\\ B\\) step\\ bool\\)
                        (typed\\ A\\ step\\ bool\\)
                    )
                )
            )
            (
                WRITE
                (
                    EXP
                    (typed\\ B\\ step\\ bool\\)
                )
            )
        )

        (RULE (VAR A) (READ (EXP (proofChecking\\ (typed\\ A\\ step\\ bool\\)))) (WRITE (EXP (\\proofChecked \\A))))
        (RULE (VAR A) (READ (EXP (proofChecking\\ A\\))) (WRITE (EXP \\\\"Proof verification syntax error")))
    )
)
`,
"example-prfver-input":
`
(
    verifyProof
    (
        Apply
        (
            Apply
            (
                AxS
                (impl (impl A (impl (impl A A) A)) (impl (impl A (impl A A)) (impl A A)))
            )
            (
                AxK
                (impl A (impl (impl A A) A))
            )
        )
        (
            AxK
            (impl A (impl A A))
        )
    )
)
`,

"example-prffnd":
`
///
Propositional logic proof finder

Finding a proof from axioms in propositional logic involves constructing a logical sequence of
steps that begins with a set of axioms and uses inference rules to derive the target formula,
establishing it as a theorem. This process requires systematically exploring the space of possible
derivations, which can be vast due to the combinatorial explosion of inference sequences. The
complexity of the task stems from the potential exponential number of steps needed to find a proof
and the possibility of very long proofs, even for relatively simple formulas. Since propositional
logic is decidable, the process is guaranteed to terminate, either by successfully finding a proof
or concluding that the formula cannot be derived from the axioms. However, the worst-case time
complexity of proof search remains exponential in the size of the formula, making it a
computationally intensive task.
///

(
    REWRITE
    
    /workflow/
    (RULE (VAR A) (READ (EXP (\\findProof \\A))) (WRITE (EXP (parseFormula A))))
    (RULE (VAR A) (READ (EXP (parsedFormula A))) (WRITE (EXP (resolveProof A))))
    (RULE (VAR A) (READ (EXP (resolvedProof A))) (WRITE (EXP (\\"success:" \\A))))
    
    
    /parser/
    (
        REWRITE
        
        (RULE (VAR A) (READ (EXP (\\parseFormula \\A))) (WRITE (EXP (parsingFormula\\ A))))
        
        /tokenizing/
        (RULE (READ (EXP impl)) (WRITE (EXP impl\\)))
        
        /parsing/
        (RULE (VAR x) (READ (EXP x)) (WRITE (EXP (typed\\ x\\ bool\\))))
        (
            RULE
            (VAR A B)
            (READ (EXP (impl\\ (typed\\ A\\ bool\\) (typed\\ B\\ bool\\))))
            (WRITE (EXP (typed\\ (impl\\ A\\ B\\) bool\\)))
        )

        (RULE (VAR A) (READ (EXP (parsingFormula\\ (typed\\ A\\ bool\\)))) (WRITE (EXP (\\parsedFormula \\A))))
        (RULE (VAR A) (READ (EXP (parsingFormula\\ A\\))) (WRITE (EXP \\\\"Syntax error")))
    )

    (
        REWRITE

        (RULE (VAR A) (READ (EXP (\\resolveProof \\A))) (WRITE (EXP (resolvingProof A (((zero one) one) one)))))
        
        (RULE (VAR A N) (READ (EXP (resolvingProof A (N one)))) (WRITE (EXP (diverge newAxK newAxS (MP A N)))))
        (RULE (VAR A N) (READ (EXP (resolvingProof A zero))) (WRITE (EXP terminator)))

        /axioms/
        (
            RULE
            (VAR A B)
            (READ (EXP newAxK))
            (WRITE (EXP (AxK (impl A (impl B A)))))
        )
        (
            RULE
            (VAR A B C)
            (READ (EXP newAxS))
            (WRITE (EXP (AxS (impl (impl A (impl B C)) (impl (impl A B) (impl A C))))))
        )
        
        /modus ponens/
        (
            RULE
            (VAR A B N)
            (READ (EXP (MP B N)))
            (
                WRITE
                (
                    EXP
                    (
                        Apply
                        (resolvingProof (impl A B) N)
                        (resolvingProof A N)
                    )
                )
            )
        )
        
        (RULE (VAR A) (READ (EXP (UNBOUND A))) (WRITE (EXP A)))
    )
)
`,

"example-prffnd-input":
`
(findProof (impl A A))
`
}
