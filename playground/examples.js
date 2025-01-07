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
///

(
    REWRITE
    
    /combinators/
    (RULE (VAR X) (READ (EXP (\\I \\X))) (WRITE (EXP \\X)))
    (RULE (VAR X Y) (READ (EXP ((\\K \\X) \\Y))) (WRITE (EXP \\X)))
    (RULE (VAR X Y Z) (READ (EXP (((\\S \\X) \\Y) \\Z))) (WRITE (EXP ((\\X \\Z) (\\Y \\Z)))))
)
`,
"example-ski-input":
`
((((S (K (S I))) K) a) b)
`,

"example-bool2":
`
///
Boolean logic to SKI compiler
///

(
    REWRITE
    
    /workflow/
    (RULE (VAR A) (READ (EXP (\\bool \\A))) (WRITE (EXP (parseBool A))))
    (RULE (VAR A) (READ (EXP (parsedBool A))) (WRITE (EXP (compileToSKI A))))
    (RULE (VAR A) (READ (EXP (compiledToSKI A))) (WRITE (EXP \\A)))

    /parser/
    (
        REWRITE
        
        (RULE (VAR A) (READ (EXP (\\parseBool \\A))) (WRITE (EXP (parsingBool\\ A))))
        
        (RULE (VAR x) (READ (EXP x)) (WRITE (EXP (token\\ x\\))))
        
        (
            RULE
            (READ (EXP (token\\ true\\)))
            (WRITE (EXP (typeOf\\ true\\ bool\\)))
        )
        (
            RULE
            (READ (EXP (token\\ false\\)))
            (WRITE (EXP (typeOf\\ false\\ bool\\)))
        )
        (
            RULE
            (VAR A)
            (READ (EXP ((token\\ not\\) (typeOf\\ A\\ bool\\))))
            (WRITE (EXP (typeOf\\ (not\\ A\\) bool\\)))
        )
        (
            RULE
            (VAR A B)
            (READ (EXP ((token\\ or\\) (typeOf\\ A\\ bool\\) (typeOf\\ B\\ bool\\))))
            (WRITE (EXP (typeOf\\ (or\\ A\\ B\\) bool\\)))
        )
        (
            RULE
            (VAR A B)
            (READ (EXP ((token\\ and\\) (typeOf\\ A\\ bool\\) (typeOf\\ B\\ bool\\))))
            (WRITE (EXP (typeOf\\ (and\\ A\\ B\\) bool\\)))
        )
        
        (RULE (VAR A) (READ (EXP (parsingBool\\ (typeOf\\ A\\ bool\\)))) (WRITE (EXP (\\parsedBool \\A))))
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
(bool (not (and false (or false true))))
`,

"example-lamb":
`
///
Lambda calculus to SKI compiler
///

(
    REWRITE
    
    /workflow/
    (RULE (VAR A) (READ (EXP (\\lc \\A))) (WRITE (EXP (parseLc A))))
    (RULE (VAR A) (READ (EXP (parsedLc A))) (WRITE (EXP (compileToSKI A))))
    (RULE (VAR A) (READ (EXP (compiledToSKI A))) (WRITE (EXP \\A)))

    /parser/
    (
        REWRITE
        
        (RULE (VAR A) (READ (EXP (\\parseLc \\A))) (WRITE (EXP (parsingLc\\ A))))

        (RULE (READ (EXP lmbd)) (WRITE (EXP (token\\ lmbd\\))))
        
        (RULE (VAR x) (READ (EXP x)) (WRITE (EXP (typeOf\\ x\\ (var\\ term\\)))))
        (
            RULE
            (VAR x M ANY)
            (READ (EXP ((token\\ lmbd\\) (typeOf\\ x\\ (var\\ term\\)) (typeOf\\ M\\ (ANY\\ term\\)))))
            (WRITE (EXP (typeOf\\ (lmbd\\ x\\ M\\) (abs\\ term\\))))
        )
        (
            RULE
            (VAR M N ANY1 ANY2)
            (READ (EXP ((typeOf\\ M\\ (ANY1\\ term\\)) (typeOf\\ N\\ (ANY2\\ term\\)))))
            (WRITE (EXP (typeOf\\ (M\\ N\\) (app\\ term\\))))
        )
        
        (RULE (VAR A ANY) (READ (EXP (parsingLc\\ (typeOf\\ A\\ (ANY\\ term\\))))) (WRITE (EXP (\\parsedLc \\A))))
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
(((lc (lmbd x (lmbd y (y x)))) a) b)
`,

"example-jot":
`
///
Jot framework to SKI compiler
///

(
    REWRITE
    
    /workflow/
    (RULE (VAR A) (READ (EXP (\\jot \\A))) (WRITE (EXP (parseJot A))))
    (RULE (VAR A) (READ (EXP (parsedJot A))) (WRITE (EXP (compileToSKI A))))
    (RULE (VAR A) (READ (EXP (compiledToSKI A))) (WRITE (EXP \\A)))
    
    /parser/
    (
        REWRITE
        
        (RULE (VAR A) (READ (EXP (\\parseJot \\A))) (WRITE (EXP (parsingJot\\ A))))
        
        (RULE (VAR x) (READ (EXP x)) (WRITE (EXP (token\\ x\\))))
        
        (
            RULE
            (READ (EXP (token\\ NIL\\)))
            (WRITE (EXP (typeOf\\ NIL\\ jot\\)))
        )
        (
            RULE
            (VAR A)
            (READ (EXP ((typeOf\\ A\\ jot\\) (token\\ 0\\))))
            (WRITE (EXP (typeOf\\ (A\\ 0\\) jot\\)))
        )
        (
            RULE
            (VAR A)
            (READ (EXP ((typeOf\\ A\\ jot\\) (token\\ 1\\))))
            (WRITE (EXP (typeOf\\ (A\\ 1\\) jot\\)))
        )
        
        (RULE (VAR A) (READ (EXP (parsingJot\\ (typeOf\\ A\\ jot\\)))) (WRITE (EXP (\\parsedJot \\A))))
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
((jot ((((NIL 1) 0) 1) 0)) a)
`,

"example-seq":
`
///
formula validator using sequent calculus (exponential time complexity)
///

(
    REWRITE

    ///
    entry point
    ///
    
    (
        RULE
        (VAR Formula)
        (
            READ
            (EXP (\\isValid \\Formula))
        )
        (
            WRITE
            (
                EXP
                (
                    cartLoop
                    (
                        (turnstileStack () () (cons Formula ()) ())
                        ()
                    )
                )
            )
        )
    )

    ///
    eliminating eq, impl
    ///
    
    /eq/
    (
        RULE
        (VAR A B)
        (
            READ
            (EXP (eq A B))
        )
        (
            WRITE
            (EXP (and (impl A B) (impl B A)))
        )
    )
    
    /impl/
    (
        RULE
        (VAR A B)
        (
            READ
            (EXP (impl A B))
        )
        (
            WRITE
            (EXP (or (not A) B))
        )
    )
    
    ///
    right side stack operations
    ///
    
    /not/
    (
        RULE
        (VAR LS L RS R A B Tail)
        (
            READ
            (EXP ((turnstileStack LS L (cons (not A) RS) R) Tail))
        )
        (
            WRITE
            (EXP ((turnstileStack (cons A LS) L RS R) Tail))
        )
    )
    
    /and/
    (
        RULE
        (VAR LS L RS R A B Tail)
        (
            READ
            (EXP ((turnstileStack LS L (cons (and A B) RS) R) Tail))
        )
        (
            WRITE
            (EXP (append ((turnstileStack LS L (cons A RS) R) ((turnstileStack LS L (cons B RS) R) ())) Tail))
        )
    )
    
    /or/
    (
        RULE
        (VAR LS L RS R A B Tail)
        (
            READ
            (EXP ((turnstileStack LS L (cons (or A B) RS) R) Tail))
        )
        (
            WRITE
            (EXP ((turnstileStack LS L (cons A (cons B RS)) R) Tail))
        )
    )
    
    /stack pop/
    (
        RULE
        (VAR LS L RS R A B Tail)
        (
            READ
            (EXP ((turnstileStack LS L (cons A RS) R) Tail))
        )
        (
            WRITE
            (EXP ((turnstileStack LS L RS (A R)) Tail))
        )
    )

    ///
    left side stack operations
    ///
    
    /not/
    (
        RULE
        (VAR LS L RS R A B Tail)
        (
            READ
            (EXP ((turnstileStack (cons (not A) LS) L RS R) Tail))
        )
        (
            WRITE
            (EXP ((turnstileStack LS L (cons A RS) R) Tail))
        )
    )
    
    /or/
    (
        RULE
        (VAR LS L RS R A B Tail)
        (
            READ
            (EXP ((turnstileStack (cons (or A B) LS) L RS R) Tail))
        )
        (
            WRITE
            (EXP (append ((turnstileStack (cons A LS) L RS R) ((turnstileStack (cons B LS) L RS R) ())) Tail))
        )
    )
    
    /and/
    (
        RULE
        (VAR LS L RS R A B Tail)
        (
            READ
            (EXP ((turnstileStack (cons (and A B) LS) L RS R) Tail))
        )
        (
            WRITE
            (EXP ((turnstileStack (cons A (cons B LS)) L RS R) Tail))
        )
    )
    
    /stack pop/
    
    (
        RULE
        (VAR LS L RS R A B Tail)
        (
            READ
            (EXP ((turnstileStack (cons A LS) L RS R) Tail))
        )
        (
            WRITE
            (EXP ((turnstileStack LS (A L) RS R) Tail))
        )
    )
    
    ///
    converting to turnstile
    ///
    
    (
        RULE
        (VAR L R)
        (
            READ
            (EXP (turnstileStack () L () R))
        )
        (
            WRITE
            (EXP (turnstile L R))
        )
    )
    
    ///
    testing for equal atoms on both sides of turnstile in each sequent
    ///
    
    /cartesian loop/
    
    (
        RULE
        (VAR L R Tail)
        (
            READ
            (EXP (cartLoop ((turnstile L R) Tail)))
        )
        (
            WRITE
            (EXP (and (cLhsLoop L R) (cartLoop Tail)))
        )
    )
    
    (
        RULE
        (
            READ
            (EXP (cartLoop ()))
        )
        (
            WRITE
            (EXP \\true)
        )
    )
    
    /left hand side loop/

    (
        RULE
        (VAR L R Tail)
        (
            READ
            (EXP (cLhsLoop (L Tail) R))
        )
        (
            WRITE
            (EXP (or (cRhsLoop L R) (cLhsLoop Tail R)))
        )
    )
    
    (
        RULE
        (VAR R)
        (
            READ
            (EXP (cLhsLoop () R))
        )
        (
            WRITE
            (EXP \\false)
        )
    )
    
    /right hand side loop/

    (
        RULE
        (VAR L R Tail)
        (
            READ
            (EXP (cRhsLoop L (R Tail)))
        )
        (
            WRITE
            (EXP (or (isEqual L R) (cRhsLoop L Tail)))
        )
    )
    
    (
        RULE
        (VAR L)
        (
            READ
            (EXP (cRhsLoop L ()))
        )
        (
            WRITE
            (EXP \\false)
        )
    )
    
    ///
    utility functions
    ///
    
    /append function/

    (RULE (VAR A B C) (READ (EXP (append (A B) C))) (WRITE (EXP (A (append B C)))))
    (RULE (VAR A    ) (READ (EXP (append () A)   )) (WRITE (EXP A               )))
    
    /atom comparison/

    (RULE (VAR A  ) (READ (EXP (isEqual A A))) (WRITE (EXP \\true )))
    (RULE (VAR A B) (READ (EXP (isEqual A B))) (WRITE (EXP \\false)))
    
    /boolean connectives/

    (RULE (READ (EXP (and \\true  \\true ))) (WRITE (EXP \\true )))
    (RULE (READ (EXP (and \\true  \\false))) (WRITE (EXP \\false)))
    (RULE (READ (EXP (and \\false \\true ))) (WRITE (EXP \\false)))
    (RULE (READ (EXP (and \\false \\false))) (WRITE (EXP \\false)))
    
    (RULE (READ (EXP (or \\true  \\true ))) (WRITE (EXP \\true )))
    (RULE (READ (EXP (or \\true  \\false))) (WRITE (EXP \\true )))
    (RULE (READ (EXP (or \\false \\true ))) (WRITE (EXP \\true )))
    (RULE (READ (EXP (or \\false \\false))) (WRITE (EXP \\false)))

)
`,

"example-seq-input":
`
///
testing if De Morgan's law holds
///

(
    isValid
    (
        eq
        (and A B)
        (not (or (not A) (not B)))
    )
)
`,

"example-constr":
`
///
constructive proof verifyer
///

(
    REWRITE
    
    /entry point/
    (RULE (VAR A) (READ (EXP (\\verify \\A))) (WRITE (EXP (verifying A))))
    
    /arbitrary introduction/
    (RULE (VAR P) (READ (EXP ([Assume] P))) (WRITE (EXP P)))

    /logic Rules/
    (RULE (VAR P Q  ) (READ (EXP ([andIntro]  P Q)                           )) (WRITE (EXP (and P Q) )))
    (RULE (VAR P Q  ) (READ (EXP ([andElim1]  (and P Q))                     )) (WRITE (EXP P         )))
    (RULE (VAR P Q  ) (READ (EXP ([andElim2]  (and P Q))                     )) (WRITE (EXP Q         )))
    (RULE (VAR P Q  ) (READ (EXP ([orIntro1]  P)                             )) (WRITE (EXP (or P Q)  )))
    (RULE (VAR P Q  ) (READ (EXP ([orIntro2]  Q)                             )) (WRITE (EXP (or P Q)  )))
    (RULE (VAR P Q R) (READ (EXP ([orElim]    (or P Q) (impl P R) (impl Q R)))) (WRITE (EXP R         )))
    (RULE (VAR P Q  ) (READ (EXP ([implIntro] (seq P Q))                     )) (WRITE (EXP (impl P Q))))
    (RULE (VAR P Q  ) (READ (EXP ([implElim]  (impl P Q) P)                  )) (WRITE (EXP Q         )))
    (RULE (VAR P Q  ) (READ (EXP ([eqIntro]   (impl P Q) (impl Q P))         )) (WRITE (EXP (eq P Q)  )))
    (RULE (VAR P Q  ) (READ (EXP ([eqElim1]   (eq P Q) P)                    )) (WRITE (EXP Q         )))
    (RULE (VAR P Q  ) (READ (EXP ([eqElim2]   (eq P Q) Q)                    )) (WRITE (EXP P         )))
    (RULE (VAR P    ) (READ (EXP ([notIntro]  (impl P false))                )) (WRITE (EXP (not P)   )))
    (RULE (VAR P    ) (READ (EXP ([notElim]   (not P) P)                     )) (WRITE (EXP false     )))
    (RULE (VAR P    ) (READ (EXP ([X]         false)                         )) (WRITE (EXP P         )))
    (RULE (VAR P    ) (READ (EXP ([IP]        (impl (not P) false))          )) (WRITE (EXP P         )))
    
    /exit point/
    (RULE (VAR A) (READ (EXP (verifying A))) (WRITE (EXP (\\result \\A))))
)
`,
"example-constr-input":
`
///
verifying a proof for De Morgan's law
///

(
    verify
    (
        [eqIntro]
        (
            [implIntro]
            (
                seq
                (
                    [Assume]
                    (and A B)
                )
                (
                    [notIntro]
                    (
                        impl
                        (
                            [Assume]
                            (or (not A) (not B))
                        )
                        (
                            [orElim]
                            (
                                [Assume]
                                (or (not A) (not B))
                            )
                            (
                                impl
                                (
                                    [Assume]
                                    (not A)
                                )
                                (
                                    [notElim]
                                    (
                                        [Assume]
                                        (not A)
                                    )
                                    (
                                        [andElim1]
                                        (
                                            [Assume]
                                            (and A B)
                                        )
                                    )
                                )
                            )
                            (
                                impl
                                (
                                    [Assume]
                                    (not B)
                                )
                                (
                                    [notElim]
                                    (
                                        [Assume]
                                        (not B)
                                    )
                                    (
                                        [andElim2]
                                        (
                                            [Assume]
                                            (and A B)
                                        )
                                    )
                                )
                            )
                        )
                    )
                )
            )
        )
        (
            [implIntro]
            (
                seq
                (
                    [Assume]
                    (not (or (not A) (not B)))
                )
                (
                    [andIntro]
                    (
                        [IP]
                        (
                            impl
                            (
                                [Assume]
                                (not A)
                            )
                            (
                                [notElim]
                                (
                                    [Assume]
                                    (not (or (not A) (not B)))
                                )
                                (
                                    [orIntro1]
                                    (
                                        [Assume]
                                        (not A)
                                    )
                                )
                            )
                        )
                    )
                    (
                        [IP]
                        (
                            impl
                            (
                                [Assume]
                                (not B)
                            )
                            (
                                [notElim]
                                (
                                    [Assume]
                                    (not (or (not A) (not B)))
                                )
                                (
                                    [orIntro2]
                                    (
                                        [Assume]
                                        (not B)
                                    )
                                )
                            )
                        )
                    )
                )
            )
        )
    )
)
`
}
