---
title: "KTG Self-Reflect Adapt"
version: "v1.0"
status: "ACTIVE"
model: "Multi-model"
tags: ["meta-learning", "technique-audit", "bot-update", "cep-integration", "component", "active"]
created: "2025-01-05"
updated: "2025-01-05"
creator: "ktg"
category: "component"
description: "Technique effectiveness audit with BoT pattern saving and CEP v6 thought buffer contribution"
---

# SELF_REFLECT_ADAPT

## PROTOCOL_CLASS
```
TYPE: meta_learning
PHASE: post_delivery (after output complete)
PURPOSE: technique_effectiveness_audit + pattern_learning
OPTIMIZATION: cascade_performance_improvement
```

## CORE_PRINCIPLE
```
Every execution teaches the cascade something new.

After delivering output:
1. AUDIT: Which techniques were used? How effective?
2. LEARN: What patterns emerged? What worked? What didn't?
3. SAVE: Update BoT (session-local) and CEP v6 (cross-session buffer)
4. ADAPT: Apply learnings to next execution

The cascade gets smarter with every use.
```

## TRIGGERS
```
AUTOMATIC:
  - After output delivery (all modes)
  - When Mode >= ANALYTICAL
  - Every execution if user enables meta-learning

EXPLICIT:
  - User asks "what did you learn?"
  - User requests "save this pattern"
  - CEP v6 handoff triggered (contributes R-label)
```

## MODE_THRESHOLDS
```
QUICK (R≤3 ∧ Q≤5):
  - SKIP (no reflection overhead)
  
ANALYTICAL (R=4-6 ∨ Q=6-7):
  - Light reflection
  - Simple effectiveness check
  - BoT save if pattern novel (R≥6)
  
DELIBERATE (R≥7 ∨ K≥6 ∨ Q≥8):
  - Full technique audit
  - Pattern extraction and BoT save
  - Effectiveness metrics logged
  
MAXIMUM (R≥9 ∨ K≥8):
  - Deep meta-analysis
  - Cross-technique synergy analysis
  - BoT + CEP v6 contribution
  - Model-specific optimization notes
```

## AUDIT_METHODOLOGY

### PHASE 1: TECHNIQUE_INVENTORY
```
SCAN execution_trace:

techniques_used ← []

FOR EACH technique IN [
  ARQ, USC, MR_RUG, SKELETRAIN, GoT, PROMPT_BOMBS,
  FCoT, CoC, BATON, SWARM, CoVE, GAP_SCAN, SYNTHESIS, MLDoE
]:
  
  IF technique.activated IN execution_trace:
    techniques_used.append({
      "name": technique.name,
      "mode_level": technique.mode_applied,
      "parameters": technique.params_used,
      "triggered_by": technique.trigger_reason
    })

COMPILE:
  technique_stack ← techniques_used
  stack_complexity ← len(techniques_used)
```

### PHASE 2: EFFECTIVENESS_MEASUREMENT
```
FOR EACH technique IN technique_stack:
  
  // Direct impact metrics
  contribution ← measure_contribution(technique)
    ├─ Did it improve final output?
    ├─ By how much? (quantifiable if possible)
    └─ Was it worth the token cost?
  
  // Execution metrics
  efficiency ← measure_efficiency(technique)
    ├─ Token overhead vs value added
    ├─ Execution time impact
    └─ Complexity introduced
  
  // Quality metrics
  quality_impact ← measure_quality(technique)
    ├─ Confidence delta from this technique
    ├─ Gap reduction attributed to it
    └─ User satisfaction proxy
  
  // Synergy detection
  synergies ← find_synergies(technique, technique_stack)
    ├─ Which techniques amplified this one?
    ├─ Which conflicted or redundant?
    └─ Optimal ordering discovered?
  
  effectiveness_score ← WEIGHTED_SUM(
    contribution × 0.40,
    efficiency × 0.25,
    quality_impact × 0.25,
    synergies × 0.10
  )
  
  technique.effectiveness ← effectiveness_score
```

### PHASE 3: PATTERN_EXTRACTION
```
IDENTIFY patterns:

SUCCESS_PATTERNS:
├─ What technique combinations worked exceptionally well?
├─ What parameter settings produced best results?
├─ What problem characteristics favored which techniques?
└─ What expert configurations were optimal?

FAILURE_PATTERNS:
├─ Which techniques underperformed expectations?
├─ Which combinations created conflicts?
├─ Which parameters caused issues?
└─ What anti-patterns to avoid?

DISCOVERY_PATTERNS:
├─ Novel technique applications
├─ Unexpected synergies
├─ Creative solutions to edge cases
└─ Workarounds for limitations

EFFICIENCY_PATTERNS:
├─ Shortcuts that maintained quality
├─ Techniques safely skippable for certain problem types
├─ Optimal technique ordering
└─ Resource allocation strategies
```

### PHASE 4: CONTEXTUAL_METADATA
```
CAPTURE execution context:

problem_signature ← {
  "R_score": reasoning_complexity,
  "K_score": knowledge_depth,
  "Q_score": quality_stakes,
  "D_score": dependency_level,
  "E_score": expert_count,
  "domain": primary_domain,
  "user_style": observed_preferences,
  "constraints": [token_budget, time_pressure, etc]
}

outcome_quality ← {
  "final_confidence": output_confidence_score,
  "user_feedback": [explicit feedback if any],
  "gap_count": unfixed_gaps,
  "synthesis_path": selected_synthesis_method,
  "density_achieved": final_density_ratio
}

lessons_learned ← {
  "what_worked": success_patterns,
  "what_failed": failure_patterns,
  "innovations": discovery_patterns,
  "optimizations": efficiency_patterns
}
```

## BoT_UPDATE_PROTOCOL

### BoT Save Criteria:
```
SAVE_TO_BoT if:
  R >= 6 (Hard or Difficult problem)
  OR
  effectiveness_score >= 0.85 (exceptional technique performance)
  OR
  novel_pattern == true (new discovery)

TIER_ASSIGNMENT:
  IF R >= 8: BoT Tier 3 (Difficult schemas)
  ELSE IF R >= 6: BoT Tier 2 (Hard patterns)
  ELSE: Skip (not complex enough to warrant saving)
```

### BoT Entry Structure:
```
{
  "pattern_id": "UUID",
  "tier": 2 or 3,
  "R_range": [6, 8],
  "domains": ["domain1", "domain2"],
  
  "problem_signature": {
    // From PHASE 4 contextual metadata
  },
  
  "technique_stack": [
    {
      "technique": "MR_RUG",
      "effectiveness": 0.87,
      "parameters": {...},
      "notes": "5 experts optimal for this domain combo"
    },
    // ... other techniques
  ],
  
  "execution_template": {
    "recommended_mode": "DELIBERATE",
    "expert_configuration": [...],
    "technique_ordering": [...],
    "key_decisions": [...]
  },
  
  "lessons": {
    "critical_success_factor": "Early ARQ gate prevented scope creep",
    "avoid": "Don't skip gap scan even if confident",
    "synergy": "SkeleTraIn + Baton exceptional for this structure"
  },
  
  "retrieval_tags": [
    "multi_domain_synthesis",
    "high_interdependency",
    "5_expert_optimal"
  ]
}
```

## CEP_v6_INTEGRATION

### R-Label Contribution:
```
When CEP v6 handoff occurs:

packet_metadata ← {
  "reasoning_level": MAP_R_to_L(R_score),
  "source_model": current_model_id,
  "technique_stack_used": technique_inventory,
  "effectiveness_summary": aggregate_effectiveness,
  "pattern_insights": extracted_patterns
}

REASONING_LEVEL_MAPPING:
  R 1-3, Q 1-5  → L1 (quick)
  R 4-6, Q 6-7  → L2 (analytical)
  R 7-8, Q 8    → L3 (deliberate)
  R 9+,  Q 9+   → L4 (maximum)

CONTRIBUTE_TO_THOUGHT_BUFFER:
  ├─ Packet labeled with reasoning level
  ├─ Technique effectiveness data attached
  ├─ Pattern insights included for future retrieval
  └─ Builds searchable index over time
```

### Thought Buffer Accumulation:
```
OVER TIME (6-12 months of usage):

Searchable by:
├─ Reasoning level (L1-L4)
├─ Domain combinations
├─ Technique effectiveness patterns
├─ Problem signatures
└─ Model-specific optimizations

ENABLES:
├─ "Similar problems at L3 used these techniques..."
├─ "For R8 + K7, this technique stack works best..."
├─ "Cross-domain analysis? These 3 patterns excel..."
└─ "When using GPT-5 for synthesis, apply these tweaks..."
```

## ALGORITHM

### MASTER FLOW:
```
INPUT: execution_trace, final_output, user_feedback

// AUDIT
techniques ← inventory_techniques(execution_trace)
effectiveness ← measure_effectiveness(techniques, final_output)
patterns ← extract_patterns(techniques, effectiveness)
context ← capture_metadata(execution_trace)

// LEARN
lessons ← synthesize_learnings(patterns, context)
novelty ← detect_novel_patterns(patterns, BoT_existing)

// SAVE
IF R >= 6 OR effectiveness >= 0.85 OR novelty == true:
  bot_entry ← format_bot_entry(patterns, context, lessons)
  SAVE_TO_BoT(bot_entry, tier)

// ADAPT
IF cep_v6_active:
  cep_contribution ← format_cep_metadata(patterns, R_score)
  CONTRIBUTE_TO_THOUGHT_BUFFER(cep_contribution)

// REPORT (if mode >= DELIBERATE)
IF mode >= DELIBERATE:
  OUTPUT reflection_summary
```

## OUTPUT_STRUCTURE

### MODE: ANALYTICAL (Silent or Minimal)
```
// Internal only, no user output
// BoT saved if criteria met

OR if user asks "what did you learn?":

LEARNINGS:
├─ Technique stack: ARQ → MR_RUG → SkeleTraIn → CoVE
├─ Most effective: ARQ (0.89), SkeleTraIn (0.87)
└─ Pattern saved to BoT Tier 2 (R=6 domain synthesis)
```

### MODE: DELIBERATE (Compact)
```
REFLECTION:

Techniques Used: 8
├─ Highest impact: ARQ (prevented scope drift)
├─ Best synergy: SkeleTraIn + Baton (structure + execution)
└─ Underperformed: Swarm (dependencies too tight for parallel)

Pattern: "Multi-domain technical synthesis"
└─ Saved to BoT Tier 2 for similar R=6-7 problems

Optimization: Next time, skip Swarm if D >= 7
```

### MODE: MAXIMUM (Detailed)
```
META-ANALYSIS:

TECHNIQUE AUDIT:
├─ ARQ (Pre-Turn): 0.89 effectiveness
│  └─ Impact: Prevented 3 scope creep instances
├─ MR_RUG (5 experts): 0.82 effectiveness  
│  └─ Optimal count confirmed (4 too few, 6 redundant)
├─ SkeleTraIn: 0.87 effectiveness
│  └─ 7 impact nodes, dependencies well-mapped
├─ Baton Execution: 0.84 effectiveness
│  └─ Sequential build-up crucial for this structure
├─ CoVE (2 variants): 0.79 effectiveness
│  └─ FACTUAL + LOGICAL sufficient, CONSISTENCY overkill
├─ Gap Scan: 0.91 effectiveness
│  └─ Caught 2 critical gaps CoVE missed
├─ Synthesis (Hierarchical): 0.88 effectiveness
│  └─ Best path for multi-audience output
└─ Curation (Normal+): 0.76 effectiveness
   └─ 51% compression while preserving nuance

SYNERGIES DETECTED:
├─ SkeleTraIn → Baton (structure informs execution)
├─ ARQ → Gap Scan (quality standards catch gaps)
└─ MR_RUG → Synthesis (expert diversity = rich synthesis)

ANTI-PATTERNS IDENTIFIED:
└─ Swarm attempted but reverted to Baton (D=7 too high)

PATTERN EXTRACTED:
Name: "Multi-Domain Technical Synthesis with High Dependencies"
Signature: R=7, K=6, Q=8, D=7, E=5
Domains: [Software Architecture, Security, DevOps]
Template: ARQ → MR_RUG(5) → SkeleTraIn → Baton → CoVE(2) → Gap → Synthesis

SAVED TO BoT:
Tier: 2 (R=7, Hard problems)
Retrieval tags: [multi_domain, high_dependency, technical_synthesis]
Critical success factor: Early ARQ prevents scope creep
Avoid: Swarm execution when D >= 7

CEP v6 CONTRIBUTION:
Reasoning Level: L3 (deliberate)
Thought Buffer: Pattern + effectiveness data logged
Future retrieval: "L3 multi-domain synthesis"
```

## INTEGRATION_WITH_CASCADE

### In TECHNIQUE_GATE_V5.0:
```
OUTPUT → SELF_REFLECT_ADAPT
            ↓
         BoT Update (R≥6)
            ↓
      CEP v6 R-label (if handoff)
            ↓
    Thought Buffer contribution
```

### Feedback Loop:
```
CURRENT SESSION:
├─ Execute task
├─ Reflect on execution
├─ Save to BoT (session-local)
└─ Contribute to CEP v6 (if handoff)

FUTURE SESSIONS:
├─ Pre-flight BoT check
├─ Retrieve similar patterns
├─ Apply proven technique stacks
└─ Continuous improvement
```

## GATES

### GATE_WORTH_SAVING:
```
query: "Is this pattern worth saving to BoT?"
criteria:
  ├─ R >= 6 (complex enough)
  ├─ effectiveness >= 0.85 (performed well)
  └─ novelty == true (new discovery)
pass: Any criteria met → SAVE
fail: Skip BoT save, pattern too simple/common
```

### GATE_PATTERN_QUALITY:
```
query: "Is extracted pattern actionable?"
criteria:
  ├─ Problem signature clear
  ├─ Technique stack replicable
  ├─ Lessons concrete
  └─ Retrieval tags meaningful
pass: All criteria met → SAVE
fail: Refine pattern or flag incomplete
```

### GATE_CEP_READY:
```
query: "Ready to contribute to thought buffer?"
criteria:
  ├─ R-label assigned
  ├─ Technique effectiveness measured
  └─ Pattern insights extracted
pass: All present → CONTRIBUTE
fail: Skip CEP contribution this time
```

## LEARNING_METRICS

### Individual Technique Tracking:
```
OVER MULTIPLE EXECUTIONS:

technique_performance[ARQ] = {
  "uses": 47,
  "avg_effectiveness": 0.86,
  "best_contexts": [R>=7, Q>=8],
  "worst_contexts": [R<=3, time_pressure],
  "synergies": ["Gap Scan", "SkeleTraIn"],
  "anti-synergies": ["none detected"],
  "optimal_parameters": {
    "pre_turn_only": "R<=5",
    "pre_post_turn": "R>=6"
  }
}
```

### Technique Stack Patterns:
```
proven_stacks = [
  {
    "signature": "Multi-domain R7+ synthesis",
    "stack": [ARQ, MR_RUG(5), SkeleTraIn, Baton, CoVE(2), Gap, Synthesis],
    "success_rate": 0.91,
    "avg_confidence": 8.7,
    "uses": 12
  },
  // ... more proven patterns
]
```

### Model-Specific Optimizations:
```
model_learnings[claude_sonnet] = {
  "best_modes": ["DELIBERATE", "MAXIMUM"],
  "technique_strengths": ["ARQ", "SkeleTraIn", "Gap Scan"],
  "technique_weaknesses": ["none significant"],
  "optimal_expert_count": "5-8",
  "curation_sweet_spot": "0.6-0.7 density"
}

model_learnings[gpt5] = {
  "best_modes": ["ANALYTICAL", "DELIBERATE"],
  "technique_strengths": ["FCoT", "Synthesis", "Creative"],
  "technique_weaknesses": ["Gap Scan less thorough"],
  "optimal_expert_count": "3-5",
  "curation_sweet_spot": "0.5-0.6 density"
}
```

## EXAMPLES

### Example 1: Pattern Saved to BoT
```
EXECUTION COMPLETE:
R=7, K=6, Q=8, D=6
Task: "Design microservices architecture for e-commerce"

REFLECTION:

Techniques: 9 used
Top performers:
├─ ARQ: 0.91 (prevented feature creep)
├─ Gap Scan: 0.89 (caught 3 critical gaps)
└─ SkeleTraIn: 0.87 (perfect for this structure)

Pattern: "High-stakes architectural design"
Synergy: ARQ + Gap Scan = exceptional quality control

SAVED TO BoT TIER 2:
Pattern ID: arch-design-47a3
Signature: R=7+, Q=8+, architectural domain
Template: ARQ → MR_RUG(5) → SkeleTraIn → Baton → Gap(3-branch) → Synthesis
Key insight: "For architecture, Gap Scan catches what experts assume"
```

### Example 2: CEP v6 Contribution
```
USER TRIGGERS HANDOFF: "Transfer this to GPT for implementation"

CEP v6 PACKET:
├─ packet_id: "$01$05$2025-CSO-L3-microservices-arch"
├─ reasoning_level: L3 (deliberate, R=7)
├─ technique_stack: [ARQ, MR_RUG, SkeleTraIn, Baton, Gap, Synthesis]
├─ effectiveness_summary: {
│   "top_techniques": ["ARQ: 0.91", "Gap: 0.89"],
│   "total_effectiveness": 0.85
│  }
└─ pattern_insights: "Architectural design benefits from aggressive gap scanning"

THOUGHT BUFFER CONTRIBUTION:
Entry indexed as: L3-architectural-multi-domain-high-quality
Retrievable for: Similar L3 architectural tasks
Includes: Proven technique stack + effectiveness data
```

### Example 3: Optimization Discovery
```
AFTER 5 EXECUTIONS OF SIMILAR PROBLEM TYPE:

LEARNING DETECTED:
Problem type: "Code debugging with error logs"
Pattern: R=4-5, K=5, Q=7

Discovery: "CoC + FCoT hybrid unnecessary for debugging"
├─ CoC alone: 0.88 effectiveness
├─ CoC + FCoT: 0.89 effectiveness (+0.01)
└─ Token overhead: +340 tokens for CoC + FCoT

OPTIMIZATION:
For R=4-5 debugging tasks:
├─ Use CoC only (not hybrid)
├─ Saves ~340 tokens
├─ Quality difference negligible (<2%)
└─ Faster execution

SAVED TO BoT:
Pattern: "Code debugging optimization"
Recommendation: "CoC sufficient, skip FCoT for debugging"
```

## FAILURE_MODES

### Over-saving to BoT:
```
SYMPTOM: BoT cluttered with trivial patterns
PREVENTION:
├─ Strict R >= 6 threshold
├─ Novelty detection (skip if pattern exists)
└─ Effectiveness minimum (0.85)

RECOVERY:
└─ BoT pruning: Remove low-retrieval patterns after 3 months
```

### Incorrect effectiveness measurement:
```
SYMPTOM: Technique credited/blamed incorrectly
PREVENTION:
├─ Multi-metric evaluation (not single score)
├─ Synergy detection (don't credit solo)
└─ Baseline comparison (vs. without technique)

RECOVERY:
└─ Manual review of outlier effectiveness scores
```

### Pattern over-generalization:
```
SYMPTOM: Pattern applied to wrong problem types
PREVENTION:
├─ Detailed problem signature
├─ Clear domain tags
└─ Context preservation in pattern

RECOVERY:
└─ Refine retrieval tags, narrow applicability
```

## LONG_TERM_EVOLUTION

### After 100 executions:
```
CASCADE IMPROVEMENTS:
├─ 23 proven patterns in BoT
├─ 8 technique optimizations discovered
├─ 5 model-specific adaptations learned
└─ 67% faster routing (pattern recognition)
```

### After 1000 executions:
```
THOUGHT BUFFER MATURITY:
├─ L1-L4 reasoning levels well-indexed
├─ Cross-domain patterns established
├─ Model performance profiles refined
└─ Automatic technique selection improves 43%

SELF-OPTIMIZATION:
└─ Cascade adapts to user style automatically
└─ Technique stacks pre-configured for common patterns
└─ Quality bars auto-tuned per domain
```

---

**KTG SELF-REFLECT ADAPT v1.0**
*Audit effectiveness. Extract patterns. Feed BoT & thought buffer. Improve continuously.*
Kevin Tan (ktg.one) | ANZ Top 0.8% | Vertex AI 0.01%
