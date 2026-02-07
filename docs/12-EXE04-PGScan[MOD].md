---
title: "KTG Post-Exec Gap Scan"
version: "v1.0"
status: "ACTIVE"
model: "Multi-model"
tags: ["quality-assurance", "gap-detection", "verification", "component", "active"]
created: "2025-01-05"
updated: "2025-01-05"
creator: "ktg"
category: "component"
description: "3-branch holistic gap detection with automated repair for post-execution quality assurance"
---

# POST_EXEC_GAP_SCAN

## PROTOCOL_CLASS
```
TYPE: quality_assurance
PHASE: post_execution (after CoVE, before curation)
PURPOSE: holistic_gap_detection + auto_repair
OPTIMIZATION: catch_what_verification_missed
```

## CORE_PRINCIPLE
```
CoVE verifies what exists.
Gap Scan finds what's MISSING.

After expert execution and verification, systematically scan for:
- Logic gaps (does reasoning hold?)
- Content gaps (what's missing?)
- Value gaps (is this actually useful?)

Then: Auto-fix when possible, flag when not.
```

## TRIGGERS
```
AUTOMATIC:
  - After CoVE verification completes
  - Before INTELLIGENT_SYNTHESIS_CURATION
  - When Mode >= ANALYTICAL

EXPLICIT:
  - User requests "check for gaps"
  - User asks "did you miss anything?"
  - Quality bar (Q) >= 7
```

## MODE_THRESHOLDS
```
QUICK (R≤3 ∧ Q≤5):
  - SKIP (not activated)
  
ANALYTICAL (R=4-6 ∨ Q=6-7):
  - Light logic check only
  - Branch A (logic/coherence)
  - Flag gaps, no auto-fix
  
DELIBERATE (R≥7 ∨ K≥6 ∨ Q≥8):
  - 3-Branch Holistic scan
  - All branches: A, B, C
  - Auto-fix minor gaps
  - Flag major gaps for review
  
MAXIMUM (R≥9 ∨ K≥8):
  - Deep 3-Branch + Cross-validation
  - Auto-fix all repairable gaps
  - Multi-expert review of flags
  - Confidence re-scoring after fixes
```

## 3-BRANCH_SCAN_METHODOLOGY

### BRANCH A: LOGIC_COHERENCE
```
SCAN FOR:
├─ Reasoning chain breaks
│  └─ "We conclude X" but steps only support Y
├─ Circular logic
│  └─ Premise depends on conclusion
├─ Missing causal links
│  └─ "A therefore C" but missing B
├─ Contradictions
│  └─ Statement 1 conflicts with Statement 2
└─ Unjustified leaps
   └─ Claims without supporting evidence

AUTO-FIX:
├─ Add missing logical connectors
├─ Reorder for causal flow
└─ Insert bridging reasoning

FLAG:
├─ Fundamental logical errors
├─ Contradictions requiring expert resolution
└─ Claims needing citation/evidence
```

### BRANCH B: CONTENT_COMPLETENESS
```
SCAN FOR:
├─ Unanswered questions from user query
│  └─ User asked A, B, C but only answered A, B
├─ Missing context
│  └─ Assumptions unstated, terms undefined
├─ Incomplete coverage
│  └─ "3 key factors" but only explained 2
├─ Dangling references
│  └─ "As mentioned above" but nothing above
└─ Promised but undelivered
   └─ "We'll explore X" but never do

AUTO-FIX:
├─ Add missing sections
├─ Define unstated terms
├─ Complete partial lists
└─ Remove broken references

FLAG:
├─ Major scope omissions
├─ User questions requiring new research
└─ Content beyond current expertise
```

### BRANCH C: VALUE_DENSITY
```
SCAN FOR:
├─ Fluff vs substance ratio
│  └─ Generic statements without specifics
├─ Redundancy
│  └─ Same point repeated 3+ times
├─ Tangential content
│  └─ Interesting but irrelevant
├─ Missing actionability
│  └─ All theory, no practice
└─ Low signal-to-noise
   └─ User wanted quick answer, got essay

AUTO-FIX:
├─ Remove redundant sections
├─ Cut tangential content
├─ Add specific examples to generic claims
└─ Insert actionable steps

FLAG:
├─ Fundamental mismatch (user wanted X, got Y)
├─ Tone mismatch (too technical / too simple)
└─ Format mismatch (wanted list, got prose)
```

## ALGORITHM

### PHASE 1: PARALLEL_SCAN
```
INPUT: expert_outputs[], cove_results

BRANCH_A_SCAN:
  logic_gaps ← scan_reasoning_chains(outputs)
  contradictions ← find_conflicts(outputs)
  missing_links ← identify_causal_breaks(outputs)

BRANCH_B_SCAN:
  unanswered ← compare_user_query(outputs)
  incomplete ← find_partial_coverage(outputs)
  undefined ← detect_unstated_assumptions(outputs)

BRANCH_C_SCAN:
  fluff_ratio ← calculate_specificity(outputs)
  redundancy ← detect_repetition(outputs)
  actionability ← assess_practical_value(outputs)

COMPILE:
  all_gaps ← MERGE(logic_gaps, unanswered, fluff_ratio, ...)
```

### PHASE 2: TRIAGE
```
FOR EACH gap IN all_gaps:
  severity ← assess_impact(gap)
  fixability ← can_auto_repair(gap)
  
  IF severity == "minor" AND fixability == true:
    auto_fix_queue.append(gap)
    
  ELSE IF severity == "major" OR fixability == false:
    flag_for_review.append(gap)
    
  ELSE:
    optional_improvements.append(gap)
```

### PHASE 3: AUTO_REPAIR
```
FOR EACH gap IN auto_fix_queue:
  
  IF gap.type == "missing_link":
    insert_bridging_reasoning(gap.location)
    
  ELSE IF gap.type == "undefined_term":
    add_definition(gap.term, gap.context)
    
  ELSE IF gap.type == "incomplete_list":
    complete_enumeration(gap.list_id)
    
  ELSE IF gap.type == "redundancy":
    remove_duplicate_content(gap.instances)
    
  ELSE IF gap.type == "missing_example":
    generate_specific_example(gap.claim)

VERIFY:
  re_scan_fixed_sections()
  confidence_delta ← measure_improvement()
```

### PHASE 4: FLAG_REPORT
```
FOR EACH gap IN flag_for_review:
  
  report.append({
    "gap_type": gap.type,
    "location": gap.location,
    "severity": gap.severity,
    "why_unfixed": gap.blocker,
    "suggested_action": gap.remedy
  })

OUTPUT:
  └─ Flagged gaps for next phase review
  └─ Confidence adjustment (-1 to -3 per major gap)
```

## OUTPUT_STRUCTURE

### MODE: ANALYTICAL (Silent)
```
Internal gaps logged, no user output.
Minor fixes applied silently.
Confidence score adjusted.
```

### MODE: DELIBERATE (Compact)
```
GAPS DETECTED: 3 minor, 1 major
├─ Auto-fixed: Missing causal link (§3), undefined term (§7)
└─ Flagged: User question unanswered (requires research)

CONFIDENCE IMPACT: -1 (major gap unfixed)
```

### MODE: MAXIMUM (Detailed)
```
POST-EXEC GAP SCAN RESULTS:

BRANCH A (Logic/Coherence): 2 gaps
├─ [FIXED] Missing causal link between claim A→C
│  └─ Inserted: "This occurs because B enables the transition"
└─ [FLAGGED] Contradiction between §4 and §12
   └─ Expert resolution needed: mutually exclusive approaches

BRANCH B (Content Completeness): 1 gap
└─ [FLAGGED] User asked for cost analysis, not provided
   └─ Requires: financial data not in current context

BRANCH C (Value/Density): 3 gaps
├─ [FIXED] Removed redundant explanation (§8-10)
├─ [FIXED] Added specific example to generic claim (§5)
└─ [IMPROVED] Reduced fluff ratio from 0.31 → 0.18

CONFIDENCE ADJUSTMENT: 8.5/10 → 7.5/10
RATIONALE: 2 unfixed gaps, high severity
NEXT: Flag review before synthesis
```

## INTEGRATION_WITH_CASCADE

### In TECHNIQUE_GATE_V5.0:
```
EXECUTE → CoVE → POST_EXEC_GAP_SCAN → SYNTHESIS_CURATION → OUTPUT
                      ↑
                      └─ Feeds gap analysis into synthesis decisions
```

### Data Flow:
```
INPUT from CoVE:
├─ Verified facts
├─ Logic validation results
└─ Consistency check results

OUTPUT to SYNTHESIS_CURATION:
├─ Auto-fixed content (seamlessly integrated)
├─ Flagged gaps (inform synthesis path selection)
└─ Confidence delta (adjust final score)
```

## GATES

### GATE_COVERAGE:
```
query: "All user questions addressed or flagged?"
pass: Yes → Continue
fail: Add to flag_for_review
```

### GATE_LOGIC:
```
query: "Reasoning chains valid or repaired?"
pass: Yes → Continue
fail: Flag contradictions for expert review
```

### GATE_VALUE:
```
query: "Signal-to-noise ratio >= 0.6?"
pass: Yes → Continue
fail: Auto-remove fluff, flag if can't improve
```

### GATE_FIXABLE:
```
query: "All repairable gaps fixed?"
pass: Yes → Continue
fail: Log unfixed gaps, adjust confidence
```

## FAILURE_MODES

### Over-fixing:
```
SYMPTOM: Auto-fixes change meaning or introduce errors
PREVENTION: 
├─ Conservative fix thresholds
├─ Re-scan after each fix
└─ Only fix when confidence > 0.85
```

### Under-flagging:
```
SYMPTOM: Gaps missed, low-quality output proceeds
PREVENTION:
├─ Parallel multi-branch scanning
├─ Cross-validate gap detection
└─ Lower threshold in MAXIMUM mode
```

### False positives:
```
SYMPTOM: Valid content flagged as gap
PREVENTION:
├─ Context-aware gap detection
├─ Distinguish intentional brevity from incompleteness
└─ User preference awareness (lean vs comprehensive)
```

## EXAMPLES

### Example 1: Missing Causal Link
```
BEFORE (gap detected):
"Machine learning improves accuracy. Therefore, deployment is recommended."

BRANCH A SCAN:
└─ Logic gap: Missing link between accuracy → deployment decision

AUTO-FIX:
"Machine learning improves accuracy. When accuracy exceeds 95%, 
the benefits outweigh integration costs. Therefore, deployment is recommended."
```

### Example 2: Unanswered Question
```
USER QUERY: "Explain JWT auth and compare to session-based auth"

OUTPUT SCANNED:
├─ JWT auth: ✓ Explained comprehensively
└─ Session-based auth: ✗ Not mentioned

BRANCH B SCAN:
└─ Content gap: User requested comparison, only got half

FLAG:
"Major gap: Comparison to session-based auth missing (user explicitly requested)"
```

### Example 3: Fluff Reduction
```
BEFORE:
"It's really quite interesting to note that, as many experts have observed
over the years, machine learning can, in certain circumstances and with
the right data, potentially improve accuracy in various applications."

BRANCH C SCAN:
└─ Fluff ratio: 0.73 (too high)

AUTO-FIX:
"Machine learning improves accuracy when trained on quality data."

Fluff ratio: 0.73 → 0.12
```

## CONFIDENCE_ADJUSTMENT_RULES

```
MINOR GAP (auto-fixed):
└─ No confidence penalty (seamlessly repaired)

MINOR GAP (flagged):
└─ -0.5 confidence per gap

MAJOR GAP (flagged):
└─ -1.5 confidence per gap

CRITICAL GAP (affects core claim):
└─ -3.0 confidence, may trigger re-execution
```

## SELF_CALIBRATION

After each gap scan, the system learns:
```
PATTERN RECOGNITION:
├─ Which expert combinations produce which gap types?
├─ Which modes need stricter scanning?
└─ Which auto-fixes are safe vs risky?

THRESHOLD TUNING:
├─ Adjust severity thresholds based on outcomes
├─ Refine fixability predictions
└─ Improve gap detection accuracy

FEED_TO_BOT:
└─ Save gap patterns for similar tasks (R≥6)
```

---

**KTG POST-EXEC GAP SCAN v1.0**
*Find what verification missed. Fix what's fixable. Flag what's not.*
Kevin Tan (ktg.one) | ANZ Top 0.8% | Vertex AI 0.01%
