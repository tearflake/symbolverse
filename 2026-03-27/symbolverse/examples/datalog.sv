
///
# Datalog implementation

Datalog is a declarative logic programming language, primarily used for querying and
reasoning about relational data. It has its roots in Prolog, another logic programming
language, but distinguishes itself with a simpler, more restricted syntax and semantics
that make it particularly well-suited for database applications, program analysis, and
information retrieval.

At its core, Datalog programs consist of a collection of facts, rules, and queries. Facts
represent basic assertions about the world, written in the form of rules with head, but
without body (e.g., `(RULE (HEAD (parent Alice Bob)) (BODY))` means Alice is Bob's
parent). Rules define logical relationships between facts and other rules, often expressing
patterns of inference (e.g., `(RULE (VAR X Y Z) (HEAD (grandparent X Z)) (BODY (parent X Y)
(parent Y Z)))` defines someone as a grandparent if they are a parent of a parent). Some
implementations (like the one presented here) define selection queries for users to ask
questions about the data implied by the facts and rules.

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

```
<start> := (DATALOG (DATA <rule>+) (QUERY <query>))

 <rule> := (RULE (VAR <ATOMIC>+)? (HEAD (<ATOMIC>+)) (BODY (<ATOMIC>+)*))

<query> := (QUERY (<ATOMIC>+))
```
///

(
    REWRITE
    
    (
        RULE
        (VAR Data Query)
        (READ (EXP (\DATALOG \Data \Query)))
        (WRITE (EXP (return (process (applyFactsToRules (split (normalize Data))) (normalize Query)))))
    )
    (
        RULE
        (VAR Facts Query)
        (READ (EXP (process Facts (QUERY (Query ())))))
        (
            WRITE
            (
                EXP
                (
                    (denormalize (FACTS Facts))
                    (denormalize (ANSWER (find Facts Query)))
                )
            )
        )
    )
        
    (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \A)))

    /split between facts and rules/
    
    (
        REWRITE
        
        (
            RULE
            (VAR Data)
            (READ (EXP (\split (\DATA \Data))))
            (WRITE (EXP (return (splitHlp Data () ()))))
        )
        (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \A)))
        
        (
            RULE
            (VAR Head Body Acc1 Acc2)
            (READ (EXP (splitHlp () Acc1 Acc2)))
            (WRITE (EXP ((FACTS Acc1) (RULES Acc2))))
        )
        (
            RULE
            (VAR Head Body Next Acc1 Acc2)
            (READ (EXP (splitHlp ((RULE ((HEAD (Head ())) ((BODY ()) ()))) Next) Acc1 Acc2)))
            (WRITE (EXP (splitHlp Next (Head Acc1) Acc2)))
        )
        (
            RULE
            (VAR Head Vars Body Next Acc1 Acc2)
            (READ (EXP (splitHlp ((RULE ((VAR Vars) ((HEAD (Head ())) ((BODY ()) ())))) Next) Acc1 Acc2)))
            (WRITE (EXP (splitHlp Next (Head Acc1) Acc2)))
        )
        (
            RULE
            (VAR Head Body Next Acc1 Acc2)
            (READ (EXP (splitHlp ((RULE ((HEAD (Head ())) ((BODY Body) ()))) Next) Acc1 Acc2)))
            (WRITE (EXP (splitHlp Next Acc1 ((RULE (VAR ())(HEAD Head) (BODY Body)) Acc2))))
        )
        (
            RULE
            (VAR Vars Head Body Next Acc1 Acc2)
            (READ (EXP (splitHlp ((RULE ((VAR Vars) ((HEAD (Head ())) ((BODY Body) ())))) Next) Acc1 Acc2)))
            (WRITE (EXP (splitHlp Next Acc1 ((RULE (VAR Vars) (HEAD Head) (BODY Body)) Acc2))))
        )
    )
        
    /apply facts to rules/
    
    (
        REWRITE
        
        (
            RULE
            (VAR Facts Rules)
            (READ (EXP (\applyFactsToRules ((\FACTS \Facts) (\RULES \Rules)))))
            (WRITE (EXP (return (applyFactsToRules ((FACTS Facts) (RULES Rules))))))
        )
        (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \A)))
        
        /main rules loop/
        
        (
            RULE
            (VAR Facts Rules)
            (READ (EXP (applyFactsToRules ((FACTS Facts) (RULES Rules)))))
            (WRITE (EXP (loopRules Facts Rules Rules ())))
        )
        (
            RULE
            (VAR Facts AllRules)
            (READ (EXP (loopRules Facts () AllRules ())))
            (WRITE (EXP Facts))
        )
        (
            RULE
            (VAR Facts RuleEl Rules AllRules)
            (READ (EXP (loopRules Facts (RuleEl Rules) AllRules ())))
            (WRITE (EXP (addIfNotElement (applyFactsToRule Facts RuleEl Facts ()) Facts (RuleEl Rules) AllRules)))
        )
        (
            RULE
            (VAR El Facts RuleEl Rules AllRules)
            (READ (EXP (addIfNotElement false Facts (RuleEl Rules) AllRules)))
            (WRITE (EXP (loopRules Facts Rules AllRules ())))
        )
        (
            RULE
            (VAR El Facts Rules AllRules Stack)
            (READ (EXP (addIfNotElement (El Stack) Facts Rules AllRules)))
            (WRITE (EXP (addHlp (exists El Facts) Stack El Facts Rules AllRules)))
        )
        (
            RULE
            (VAR El Facts Rules AllRules Stack)
            (READ (EXP (addHlp false Stack El Facts Rules AllRules)))
            (WRITE (EXP (loopRules (El Facts) AllRules AllRules ())))
        )
        (
            RULE
            (VAR Vars Head Body El Facts RuleEl Rules AllRules Stack BodyElSt FactsSt PrevVarsSt)
            (READ (EXP (addHlp true ((BodyElSt FactsSt PrevVarsSt) Stack) El Facts ((RULE (VAR Vars) (HEAD Head) (BODY Body)) Rules) AllRules)))
            (WRITE (EXP (addIfNotElement (applyFactsToRule FactsSt (RULE (VAR PrevVarsSt) (HEAD Head) (BODY (BodyElSt ()))) Facts Stack) Facts ((RULE (VAR Vars) (HEAD Head) (BODY Body)) Rules) AllRules)))
        )
        
        /return Head or try backtracking or return false/
        
        (
            RULE
            (VAR Facts Vars Head AllFacts Stack)
            (READ (EXP (applyFactsToRule Facts (RULE (VAR Vars) (HEAD Head) (BODY ())) AllFacts Stack)))
            (WRITE (EXP ((substVars Head Vars Vars) Stack)))
        )
        (
            RULE
            (VAR Vars Head Body AllFacts Stack BodyElSt FactsSt PrevVarsSt)
            (READ (EXP (applyFactsToRule () (RULE (VAR Vars) (HEAD Head) (BODY Body)) AllFacts ((BodyElSt FactsSt PrevVarsSt) Stack))))
            (WRITE (EXP (applyFactsToRule FactsSt (RULE (VAR PrevVarsSt) (HEAD Head) (BODY (BodyElSt Body))) AllFacts Stack)))
        )
        (
            RULE
            (VAR Vars Head Body AllFacts)
            (READ (EXP (applyFactsToRule () (RULE (VAR Vars) (HEAD Head) (BODY Body)) AllFacts ())))
            (WRITE (EXP false))
        )
        
        /try to unify/
        
        (
            RULE
            (VAR FactEl Facts Vars Head BodyEl Body AllFacts Stack)
            (READ (EXP (applyFactsToRule (FactEl Facts) (RULE (VAR Vars) (HEAD Head) (BODY (BodyEl Body))) AllFacts Stack)))
            (WRITE (EXP (applyFactsToRuleHlp (FactEl Facts) (RULE (VAR (unify FactEl Vars BodyEl)) (HEAD Head) (BODY (BodyEl Body))) AllFacts Vars Stack)))
        )
        (
            RULE
            (VAR FactEl Facts Vars Head Body AllFacts OldVars Stack)
            (READ (EXP (applyFactsToRuleHlp (FactEl Facts) (RULE (VAR false) (HEAD Head) (BODY Body)) AllFacts OldVars Stack)))
            (WRITE (EXP (applyFactsToRule Facts (RULE (VAR OldVars) (HEAD Head) (BODY Body)) AllFacts Stack)))
        )
        (
            RULE
            (VAR FactsEl Facts Vars Head BodyEl Body AllFacts OldVars Stack)
            (READ (EXP (applyFactsToRuleHlp (FactsEl Facts) (RULE (VAR Vars) (HEAD Head) (BODY (BodyEl Body))) AllFacts OldVars Stack)))
            (WRITE (EXP (applyFactsToRule AllFacts (RULE (VAR Vars) (HEAD Head) (BODY Body)) AllFacts ((BodyEl Facts OldVars) Stack))))
        )
        
        /unification/
        
        (
            REWRITE
            
            (
                RULE
                (VAR FactEl BodyEl Vars)
                (READ (EXP (\unify \FactEl \Vars \BodyEl)))
                (WRITE (EXP (return (loopBodyEl FactEl Vars BodyEl))))
            )
            (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \A)))
        
            /unify list of atoms/
        
            (
                RULE
                (VAR FactElFst FactElRest BodyElFst BodyElRest Vars)
                (READ (EXP (loopBodyEl () Vars ())))
                (WRITE (EXP Vars))
            )
            (
                RULE
                (VAR FactElFst FactElRest BodyElFst BodyElRest Vars)
                (READ (EXP (loopBodyEl (FactElFst FactElRest) Vars (BodyElFst BodyElRest))))
                (WRITE (EXP (loopBodyElHlp (unifyAtom FactElFst Vars BodyElFst) FactElRest Vars BodyElRest)))
            )
            (
                RULE
                (VAR FactElFst FactElRest BodyElFst BodyElRest Vars)
                (READ (EXP (loopBodyElHlp false FactElRest Vars BodyElRest)))
                (WRITE (EXP false))
            )
            (
                RULE
                (VAR NewVars FactElRest BodyElRest Vars)
                (READ (EXP (loopBodyElHlp NewVars FactElRest Vars BodyElRest)))
                (WRITE (EXP (loopBodyEl FactElRest NewVars BodyElRest)))
            )
            
            /unify atom/
            
            (
                RULE
                (VAR AtomF AtomB Vars)
                (READ (EXP (unifyAtom AtomF Vars AtomB)))
                (WRITE (EXP (loopVars AtomF Vars AtomB Vars)))
            )
            
            /test vars/
            
            (
                RULE
                (VAR AtomF AtomB AllVars)
                (READ (EXP (loopVars AtomF () AtomB AllVars)))
                (WRITE (EXP (testConst AtomF AtomB AllVars)))
            )
            (
                RULE
                (VAR AtomF AtomB Vars AllVars)
                (READ (EXP (loopVars AtomF (AtomB Vars) AtomB AllVars)))
                (WRITE (EXP (setVar AllVars AtomB AtomF)))
            )
            (
                RULE
                (VAR AtomF AtomB Vars AllVars)
                (READ (EXP (loopVars AtomF ((AtomB AtomF) Vars) AtomB AllVars)))
                (WRITE (EXP AllVars))
            )
            (
                RULE
                (VAR AtomF AtomB VarsEl Vars AllVars)
                (READ (EXP (loopVars AtomF (VarsEl Vars) AtomB AllVars)))
                (WRITE (EXP (loopVars AtomF Vars AtomB AllVars)))
            )
            
            /test constant/
            (
                RULE
                (VAR Atom Atom Vars OldVars)
                (READ (EXP (testConst Atom Atom OldVars)))
                (WRITE (EXP OldVars))
            )
            (
                RULE
                (VAR AtomF AtomB Vars OldVars)
                (READ (EXP (testConst AtomF AtomB OldVars)))
                (WRITE (EXP false))
            )
            
            /set var/
            
            (
                RULE
                (VAR Vars Name Value)
                (READ (EXP (setVar () Name Value)))
                (WRITE (EXP ((Name Value) ())))
            )
            (
                RULE
                (VAR Vars Name Value)
                (READ (EXP (setVar (Name Vars) Name Value)))
                (WRITE (EXP ((Name Value) Vars)))
            )
            (
                RULE
                (VAR Vars Name Value)
                (READ (EXP (setVar ((Name Value) Vars) Name Value)))
                (WRITE (EXP ((Name Value) Vars)))
            )
            (
                RULE
                (VAR NameV ValueV Vars Name Value)
                (READ (EXP (setVar (NameV Vars) Name Value)))
                (WRITE (EXP (NameV (setVar Vars Name Value))))
            )
            (
                RULE
                (VAR NameV ValueV Vars Name Value)
                (READ (EXP (setVar ((NameV ValueV) Vars) Name Value)))
                (WRITE (EXP ((NameV ValueV) (setVar Vars Name Value))))
            )
        )
        
        /subst vars/
        
        (
            RULE
            (VAR Vars AllVars)
            (READ (EXP (substVars () Vars AllVars)))
            (WRITE (EXP ()))
        )
        (
            RULE
            (VAR BodyPart BodyEl VarEl Vars AllVars)
            (READ (EXP (substVars (BodyPart BodyEl) () AllVars)))
            (WRITE (EXP (BodyPart (substVars BodyEl AllVars AllVars))))
        )
        (
            RULE
            (VAR BodyPart BodyEl VarVal Vars AllVars)
            (READ (EXP (substVars (BodyPart BodyEl) ((BodyPart VarVal) Vars) AllVars)))
            (WRITE (EXP (VarVal (substVars BodyEl AllVars AllVars))))
        )
        (
            RULE
            (VAR BodyEl VarEl Vars AllVars)
            (READ (EXP (substVars BodyEl (VarEl Vars) AllVars)))
            (WRITE (EXP (substVars BodyEl Vars AllVars)))
        )
    
        /exists/
        
        (
            REWRITE
            
            (RULE (VAR A B) (READ (EXP (\exists \A \B))) (WRITE (EXP (return (exists A B)))))
            
            (RULE (VAR A) (READ (EXP (exists A ()))) (WRITE (EXP false)))
            (RULE (VAR A B) (READ (EXP (exists A (A B)))) (WRITE (EXP true)))
            (RULE (VAR A B C) (READ (EXP (exists A (B C)))) (WRITE (EXP (exists A C))))
            
            (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \A)))
        )
    )
    
    (
        RULE
        (VAR Query)
        (READ (EXP (find () Query)))
        (WRITE (EXP No))
    )
    (
        RULE
        (VAR Facts Query)
        (READ (EXP (find (Query Facts) Query)))
        (WRITE (EXP Yes))
    )
    (
        RULE
        (VAR FactEl Facts Query)
        (READ (EXP (find (FactEl Facts) Query)))
        (WRITE (EXP (find Facts Query)))
    )

    /normalize & denormalize/
    
    (
        REWRITE
        
        (RULE (VAR A) (READ (EXP (\normalize \A))) (WRITE (EXP (return (norm A)))))
        
        (RULE (READ (EXP (norm ()))) (WRITE (EXP ())))
        (RULE (VAR a) (READ (EXP (norm a))) (WRITE (EXP a)))
        (RULE (VAR A) (READ (EXP (norm A))) (WRITE (EXP ((norm (HEADL A)) (norm (TAILL A))))))
        
        (RULE (VAR A) (READ (EXP (\denormalize \A))) (WRITE (EXP (return (denorm A)))))
        
        (RULE (READ (EXP (denorm ()))) (WRITE (EXP ())))
        (RULE (VAR a) (READ (EXP (denorm a))) (WRITE (EXP a)))
        (RULE (VAR A B) (READ (EXP (denorm (A B)))) (WRITE (EXP (PREPENDL (denorm A) (denorm B)))))
        
        (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \A)))
    )
)

