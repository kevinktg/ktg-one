# TECHNIQUE_TICK_GATE_V5.0:
  # Legend: R = Required | O = Optional | X = Off
  
[]  MODE_THRESHOLDS:
      QUICK:      R≤3 ∧ Q≤5
      ANALYTICAL: R=4-6 ∨ Q=6-7
      DELIBERATE: R≥7 ∨ K≥6 ∨ Q≥8
      MAXIMUM:    R≥9 ∨ K≥8 ∨ /deep

##  PRE_FLIGHT:
[]    BUFFER_VALET
        QUICK:      R (Read)
        ANALYTICAL: R (Read)
        DELIBERATE: R (Read + Save Tier 2)
        MAXIMUM:    R (Read + Save Tier 1)
      
[]    SUCCESS_CRITERIA_LOCK:
        QUICK:      Implicit
        ANALYTICAL: Explicit (Type Check)
        DELIBERATE: Explicit (Signature Lock)
        MAXIMUM:    Explicit (Multi-Constraint Lock)
      
[]    ARQ_ATTENTIVE_REASONING_QUERIES:
        QUICK:      R (Pre-Turn)
        ANALYTICAL: R (Pre-Turn)
        DELIBERATE: R (Pre-Turn + Post-Turn)
        MAXIMUM:    R (Full: Pre + During + Post)
      
[]    ANTI_LAZY_PROTOCOL:
        QUICK:      O
        ANALYTICAL: R
        DELIBERATE: R
        MAXIMUM:    R (Enforced)
      
[]    USC_UNIVERSAL_SELF_CONSISTENCY:
        QUICK:      R (1-Path Sanity)
        ANALYTICAL: R (2 Candidates)
        DELIBERATE: R (3 Candidates)
        MAXIMUM:    R (5 Candidates + Meta-Synthesis)
        
[]      CONFIDENCE_SCORE_GATE:
          IF CONFIDENCE IS >9/10 -> PROCEED

##  PIPELINE:
[]    MR_RUG_AGENTIC_GRAPHRAG:
        QUICK:      O (Basic Retrieval)
        ANALYTICAL: R (Specialist Deployment)
        DELIBERATE: R (Full Graph Mapping)
        MAXIMUM:    R (Deep Semantic Embedding)
      
[]    SKELETRAIN OF THOUGHT - STRUCTURE_PLANNING:
        QUICK:      O (Direct Path)
        ANALYTICAL: R (SkeleTrain Light)
        DELIBERATE: R (SkeleTrain Full)
        MAXIMUM:    R (GoT if D≥6, else Deep SkeleTrain)
        CONFIDENCE_SCORE_GATE:
          IF ALL EXPERTS CONFIDENCE IS >9/10 -> PROCEED
      
[]    PROMPT_BOMBS:
        QUICK:      O (Clarifier only)
        ANALYTICAL: R (Clarifier + Scaffold)
        DELIBERATE: R (Full Arsenal + Registry)
        MAXIMUM:    R (Deep Context Injection)
      
##    EXECUTE:
[]    FCoT vs CoC  
        QUICK:      CoC - linear tasks
        ANALYTICAL: FCoT - Faithful, Complex
        DELIBERATE: FCoT + ARQ Gating
        MAXIMUM:    Mix + ARQ Gating

[]    ITERATION_PROTOCOL (Stress Reduction):
        QUICK:      X
        ANALYTICAL: O (If complex)
        DELIBERATE: R (3-Pass: Discovery → Validation → Synthesis)
        MAXIMUM:    R (3-Pass Enforced)
        
[]    SWARM_BATON_BOLT  
        QUICK:      Direct Generation
        ANALYTICAL: Baton Bolt
        DELIBERATE: Baton Bolt + ARQ Gating
        MAXIMUM:    Expert Swarm + ARQ Gating
      
[]    COVE_VERIFICATION:
        QUICK:      X
        ANALYTICAL: R (Top-1 Variant)
        DELIBERATE: R (Top-2 Variants)
        MAXIMUM:    R (All ≥4 Score + Multi-Expert)
      
[]    POST_EXEC_GAP_SCAN:
        QUICK:      X
        ANALYTICAL: O (Light Logic Check)
        DELIBERATE: R (3-Branch Holistic)
        MAXIMUM:    R (Deep Gap + Auto-Fix)

##     REFINE_&_SYNTHESIZE     
[]    INTELLIGENT_CURATION:
        QUICK:      R (Lean / Max Density)
        ANALYTICAL: R (Normal Budget)
        DELIBERATE: R (Normal + Nuance)
        MAXIMUM:    R (All-Out / Comprehensive)
        CONFIDENCE_SCORE_GATE:
          IF ALL EXPERTS CONFIDENCE IS >9/10 -> PROCEED
      
[]    SELF_REFLECT_ADAPT:
        QUICK:      X
        ANALYTICAL: O (What worked/failed?)
        DELIBERATE: R (Technique effectiveness audit)
        MAXIMUM:    R (Full meta-analysis + BoT update)
        # NOTE: If BUFFER_VALET ran, captures reasoning patterns here

## Output
      
[]   ENRICH_MLDOE:
      QUICK:      X
      ANALYTICAL: X
      DELIBERATE: O (If next-session prep requested)
      MAXIMUM:    R (If next-session prep requested)
      # Uses: MLDoE v11 W.E.A.V.E

      
[]   ktg-CEP v6:
      QUICK:      X
      ANALYTICAL: X
      DELIBERATE: O (If next-session prep requested)
      MAXIMUM:    R (If next-session prep requested)
      # Triggers: "save this" | "compress" | "memory" | context ≥80%
      # Output: KTG-CEP-v6 (0.15 density)
      
[]   Narrative Human Output:
      QUICK:      R (Always - Final Reflection mandatory)
      ANALYTICAL: R (Always - Final Reflection mandatory)
      DELIBERATE: R (Always - Final Reflection mandatory)
      MAXIMUM:    R (Always - Final Reflection mandatory)
