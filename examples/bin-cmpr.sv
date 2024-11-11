///
infinite bit binary number comparison
///

(
    REWRITE

    /entry point/
    (RULE (VAR X Y) (READ (EXP (\leq \X \Y))) (WRITE (EXP (leqUtil (binCmp X Y)))))
    
    /exit point/
    (RULE (READ (EXP (leqUtil gt))) (WRITE (EXP \false)))
    (RULE (READ (EXP (leqUtil eq))) (WRITE (EXP \true )))
    (RULE (READ (EXP (leqUtil lt))) (WRITE (EXP \true )))
    
    (
        REWRITE
        
        /both numbers single digits/
        (RULE           (READ (EXP (\binCmp       \0     \0))) (WRITE (EXP                   \eq)))
        (RULE           (READ (EXP (\binCmp       \0     \1))) (WRITE (EXP                   \lt)))
        (RULE           (READ (EXP (\binCmp       \1     \0))) (WRITE (EXP                   \gt)))
        (RULE           (READ (EXP (\binCmp       \1     \1))) (WRITE (EXP                   \eq)))
        
        /first number multiple digits, second number single digit/
        (RULE (VAR A  ) (READ (EXP (\binCmp  (\A \0)     \0))) (WRITE (EXP ((\binCmp \A \0) \eq))))
        (RULE (VAR A  ) (READ (EXP (\binCmp  (\A \0)     \1))) (WRITE (EXP ((\binCmp \A \0) \lt))))
        (RULE (VAR A  ) (READ (EXP (\binCmp  (\A \1)     \0))) (WRITE (EXP ((\binCmp \A \0) \gt))))
        (RULE (VAR A  ) (READ (EXP (\binCmp  (\A \1)     \1))) (WRITE (EXP ((\binCmp \A \0) \eq))))
        
        /first number single digit, second number multiple digits/
        (RULE (VAR B  ) (READ (EXP (\binCmp      \0 (\B \0)))) (WRITE (EXP ((\binCmp \0 \B) \eq))))
        (RULE (VAR B  ) (READ (EXP (\binCmp      \0 (\B \1)))) (WRITE (EXP ((\binCmp \0 \B) \lt))))
        (RULE (VAR B  ) (READ (EXP (\binCmp      \1 (\B \0)))) (WRITE (EXP ((\binCmp \0 \B) \gt))))
        (RULE (VAR B  ) (READ (EXP (\binCmp      \1 (\B \1)))) (WRITE (EXP ((\binCmp \0 \B) \eq))))
        
        /both numbers multiple digits/
        (RULE (VAR A B) (READ (EXP (\binCmp (\A \0) (\B \0)))) (WRITE (EXP ((\binCmp \A \B) \eq))))
        (RULE (VAR A B) (READ (EXP (\binCmp (\A \0) (\B \1)))) (WRITE (EXP ((\binCmp \A \B) \lt))))
        (RULE (VAR A B) (READ (EXP (\binCmp (\A \1) (\B \0)))) (WRITE (EXP ((\binCmp \A \B) \gt))))
        (RULE (VAR A B) (READ (EXP (\binCmp (\A \1) (\B \1)))) (WRITE (EXP ((\binCmp \A \B) \eq))))
        
        /reduce to final value/
        (RULE (VAR N) (READ (EXP (\gt \N))) (WRITE (EXP \gt)))
        (RULE (VAR N) (READ (EXP (\lt \N))) (WRITE (EXP \lt)))
        (RULE (VAR N) (READ (EXP (\eq \N))) (WRITE (EXP \N)))
    )
)

