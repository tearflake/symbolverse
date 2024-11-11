///
infinite bit binary number addition
///

(
    REWRITE

    /both numbers single digits/
    (RULE           (READ (EXP (\binAdd       \0     \0))) (WRITE (EXP                                \0)))
    (RULE           (READ (EXP (\binAdd       \0     \1))) (WRITE (EXP                                \1)))
    (RULE           (READ (EXP (\binAdd       \1     \0))) (WRITE (EXP                                \1)))
    (RULE           (READ (EXP (\binAdd       \1     \1))) (WRITE (EXP (                          \1 \0))))
    
    /first number multiple digits, second number single digit/
    (RULE (VAR A  ) (READ (EXP (\binAdd  (\A \0)     \0))) (WRITE (EXP (                          \A \0))))
    (RULE (VAR A  ) (READ (EXP (\binAdd  (\A \0)     \1))) (WRITE (EXP (                          \A \1))))
    (RULE (VAR A  ) (READ (EXP (\binAdd  (\A \1)     \0))) (WRITE (EXP (                          \A \1))))
    (RULE (VAR A  ) (READ (EXP (\binAdd  (\A \1)     \1))) (WRITE (EXP (             (\binAdd \1 \A) \0))))
    
    /first number single digit, second number multiple digits/
    (RULE (VAR B  ) (READ (EXP (\binAdd      \0 (\B \0)))) (WRITE (EXP (                          \B \0))))
    (RULE (VAR B  ) (READ (EXP (\binAdd      \0 (\B \1)))) (WRITE (EXP (                          \B \1))))
    (RULE (VAR B  ) (READ (EXP (\binAdd      \1 (\B \0)))) (WRITE (EXP (                          \B \1))))
    (RULE (VAR B  ) (READ (EXP (\binAdd      \1 (\B \1)))) (WRITE (EXP (             (\binAdd \1 \B) \0))))
    
    /both numbers multiple digits/
    (RULE (VAR A B) (READ (EXP (\binAdd (\A \0) (\B \0)))) (WRITE (EXP (             (\binAdd \A \B) \0))))
    (RULE (VAR A B) (READ (EXP (\binAdd (\A \0) (\B \1)))) (WRITE (EXP (             (\binAdd \A \B) \1))))
    (RULE (VAR A B) (READ (EXP (\binAdd (\A \1) (\B \0)))) (WRITE (EXP (             (\binAdd \A \B) \1))))
    (RULE (VAR A B) (READ (EXP (\binAdd (\A \1) (\B \1)))) (WRITE (EXP ((\binAdd \1 (\binAdd \A \B)) \0))))
)

