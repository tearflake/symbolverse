///
Fetch files example
///

(
    REWRITE
    
    (FILE "lambda-calc.sv")
    (FILE "ski-calc.sv")
    (FILE "hilbert.sv")
    
    /entry point/
    (RULE (VAR X) (READ (EXP (\process \X))) (WRITE (EXP (compiling (lcToSki X)))))
    (RULE (VAR X) (READ (EXP (compiling X))) (WRITE (EXP (evaluating ((value (interpretSki ((X a) b))) (type (check ((X (CONST A)) (IMPL (CONST A) (CONST B))))))))))
    (RULE (VAR X) (READ (EXP (evaluating X))) (WRITE (EXP \X)))
)

