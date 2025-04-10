///
Fetch files example
///

(
    REWRITE
    
    (FILE "lambda-calc.sv")
    (FILE "ski-calc.sv")
    
    /entry point/
    (RULE (VAR A) (READ (\process \A)) (WRITE (processing (interpretSki (lcToSki A)))))
    (RULE (VAR A) (READ (processing A)) (WRITE \A))
)

