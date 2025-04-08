///
Fetch files example
///

(
    REWRITE
    
    (FETCH "lambda-calc.sv")
    (FETCH "ski-calc.sv")
    
    /entry point/
    (RULE (VAR A) (READ (EXP (\process \A))) (WRITE (EXP (processing (interpretSki (lcToSki A))))))
    (RULE (VAR A) (READ (EXP (processing A))) (WRITE (EXP \A)))
)

