
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
`not`, `and`, `or`
///

(
    REWRITE
    (RULE (VAR A) (READ (EXP (\bool \A))) (WRITE (EXP (return A))))
    
    /truth table for `not` operator/
    (RULE (READ (EXP (not true ))) (WRITE (EXP false)))
    (RULE (READ (EXP (not false))) (WRITE (EXP true )))
    
    /truth table for `and` operator/
    (RULE (READ (EXP (and true  true ))) (WRITE (EXP true )))
    (RULE (READ (EXP (and true  false))) (WRITE (EXP false)))
    (RULE (READ (EXP (and false true ))) (WRITE (EXP false)))
    (RULE (READ (EXP (and false false))) (WRITE (EXP false)))
    
    /truth table for `or` operator/
    (RULE (READ (EXP (or true  true ))) (WRITE (EXP true )))
    (RULE (READ (EXP (or true  false))) (WRITE (EXP true )))
    (RULE (READ (EXP (or false true ))) (WRITE (EXP true )))
    (RULE (READ (EXP (or false false))) (WRITE (EXP false)))
    
    (RULE (VAR A) (READ (EXP (return A))) (WRITE (EXP \A)))
)

