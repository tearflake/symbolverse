///
Fetch files example
///

(
    REWRITE
    
    /entry point/
    (RULE (VAR A) (READ (EXP (\process \A))) (WRITE (EXP (processing (interpretSKI (lcToSKI A))))))
    (RULE (VAR A) (READ (EXP (processing A))) (WRITE (EXP \A)))
    
    (FETCH "lambda-calc.sv")
    (FETCH "ski-calc.sv")
)

