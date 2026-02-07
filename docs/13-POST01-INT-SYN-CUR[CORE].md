---
title: "KTG Intelligent Synthesis Curation"
version: "v1.0"
status: "ACTIVE"
model: "Multi-model"
tags: ["synthesis", "curation", "tree-of-thought", "density", "component", "active"]
created: "2025-01-05"
updated: "2025-01-05"
creator: "ktg"
category: "component"
description: "Tree of Thought synthesis exploration combined with multi-stage curation for optimal output density and quality"
---

# INTELLIGENT_SYNTHESIS_CURATION

## PROTOCOL_CLASS
```
TYPE: synthesis + curation
PHASE: post_gap_scan (final output preparation)
PURPOSE: optimal_integration + maximum_density
OPTIMIZATION: quality_per_token
```

## CORE_PRINCIPLE
```
After experts have executed, been verified, and gap-scanned:

1. SYNTHESIZE: Explore multiple ways to integrate outputs
2. SELECT: Choose optimal synthesis path
3. CURATE: Apply relevance → quality → density filters
4. DELIVER: Maximum value per token

Tree of Thought for synthesis decisions.
Chain of Density for curation.
```

## TRIGGERS
```
AUTOMATIC:
  - After POST_EXEC_GAP_SCAN completes
  - Before final output delivery
  - When multiple expert outputs exist

EXPLICIT:
  - User requests "synthesize" or "combine"
  - User asks for "concise" or "dense" output
  - Token budget specified
```

## MODE_THRESHOLDS
```
QUICK (R≤3 ∧ Q≤5):
  - Direct synthesis (no tree exploration)
  - LEAN curation (max compression)
  - Single-pass output
  
ANALYTICAL (R=4-6 ∨ Q=6-7):
  - 2-path ToT synthesis
  - NORMAL curation (balanced density)
  - Quality-first selection
  
DELIBERATE (R≥7 ∨ K≥6 ∨ Q≥8):
  - 3-path ToT synthesis
  - NORMAL+ curation (preserve nuance)
  - Multi-criteria selection
  
MAXIMUM (R≥9 ∨ K≥8):
  - 5-path ToT synthesis
  - COMPREHENSIVE curation (all signal)
  - Meta-synthesis + validation
```

## SYNTHESIS_METHODOLOGY

### PHASE 1: ToT SYNTHESIS EXPLORATION

#### Path Generation:
```
GENERATE synthesis approaches based on expert outputs:

PATH 1: SEQUENTIAL_INTEGRATION
└─ Expert A findings → Expert B builds on → Expert C concludes
   Best for: Dependencies between expert domains

PATH 2: PARALLEL_SYNTHESIS
└─ All expert insights presented side-by-side
   Best for: Complementary perspectives, comparison needed

PATH 3: HIERARCHICAL_SYNTHESIS
└─ High-level synthesis → Drill into expert details as needed
   Best for: Executive summary + deep dive structure

PATH 4: CONSENSUS_EXTRACTION
└─ Find areas of expert agreement, note disagreements
   Best for: Conflicting expert opinions requiring resolution

PATH 5: WEIGHTED_BLEND
└─ Weight expert contributions by confidence scores
   Best for: Varying expertise levels, risk management

MODE determines path count:
ANALYTICAL → Paths 1-2
DELIBERATE → Paths 1-3
MAXIMUM → Paths 1-5
```

#### Path Evaluation:
```
FOR EACH synthesis_path:
  
  coherence ← measure_narrative_flow(path)
  coverage ← check_all_insights_included(path)
  density ← calculate_value_per_token(path)
  accessibility ← assess_clarity(path)
  
  score ← WEIGHTED_SUM(
    coherence × 0.30,
    coverage × 0.25,
    density × 0.25,
    accessibility × 0.20
  )
  
  path.score ← score
```

#### Path Selection:
```
SELECTION_CRITERIA:

IF user_preference == "comprehensive":
  SELECT path WITH max(coverage)
  
ELSE IF user_preference == "concise":
  SELECT path WITH max(density)
  
ELSE IF expert_conflict EXISTS:
  SELECT path == CONSENSUS_EXTRACTION
  
ELSE:
  SELECT path WITH max(score)

CONFIDENCE:
  synthesis_confidence ← selected_path.score
```

### PHASE 2: MULTI-STAGE CURATION

#### Stage 1: RELEVANCE FILTERING
```
PRINCIPLE: Does this content answer the user's question?

SCAN synthesized_output:
  FOR EACH section:
    relevance ← measure_alignment_to_query(section)
    
    IF relevance < 0.3:
      mark_for_removal(section)
      
    ELSE IF relevance < 0.6:
      mark_for_review(section)
      
    ELSE:
      mark_as_core(section)

APPLY:
  REMOVE all marked_for_removal
  REVIEW marked_for_review:
    - Can it support core sections?
    - Does it provide essential context?
    - If NO to both → REMOVE
```

#### Stage 2: QUALITY ASSESSMENT
```
PRINCIPLE: Does each piece justify its token cost?

FOR EACH remaining section:
  
  specificity ← count_concrete_details(section)
  actionability ← count_practical_steps(section)
  insight ← measure_non_obvious_value(section)
  
  quality_score ← WEIGHTED_SUM(
    specificity × 0.4,
    actionability × 0.3,
    insight × 0.3
  )
  
  IF quality_score < 0.5:
    flag_for_improvement(section)

IMPROVEMENT:
  FOR EACH flagged:
    - Add specific example if generic
    - Add actionable step if theoretical
    - Add insight if obvious
    - If can't improve → REMOVE
```

#### Stage 3: DENSITY OPTIMIZATION
```
PRINCIPLE: Maximum value per token (Chain of Density)

TARGET_DENSITY by mode:
  LEAN (QUICK):        0.8-1.0  (hyper-compressed)
  NORMAL (ANALYTICAL): 0.6-0.8  (balanced)
  NORMAL+ (DELIBERATE): 0.5-0.7  (preserve nuance)
  COMPREHENSIVE (MAX):  0.4-0.6  (all signal retained)

COMPRESSION_ITERATIONS:

ITERATION 1: Remove fluff
├─ "It's interesting to note that" → DELETE
├─ "Many experts believe" → "Evidence suggests"
├─ Redundant transitions → Streamline
└─ Measure density_1

ITERATION 2: Merge related content
├─ Combine scattered points about same topic
├─ Eliminate repetition across sections
├─ Consolidate examples
└─ Measure density_2

ITERATION 3: Entity fusion
├─ Replace verbose phrases with precise terms
├─ Use domain-specific shorthand when appropriate
├─ Merge related entities into compound concepts
└─ Measure density_3

ITERATION 4: Missing entity injection
├─ Identify concepts mentioned but not defined
├─ Add critical missing entities
├─ Ensure no orphaned references
└─ Measure density_4

ITERATION 5: Final balance
├─ Check: density in target range?
├─ Check: all user questions answered?
├─ Check: clarity maintained?
└─ Measure density_final

CONVERGENCE:
  IF density_final in target_range AND clarity > 0.7:
    └─ ACCEPT
  ELSE:
    └─ Rebalance (loosen compression or tighten further)
```

## ALGORITHM

### MASTER FLOW:
```
INPUT: expert_outputs[], gap_scan_results, user_constraints

// SYNTHESIS
synthesis_paths ← generate_paths(expert_outputs, mode)
evaluated_paths ← evaluate_all(synthesis_paths)
selected_path ← select_optimal(evaluated_paths, user_constraints)
synthesized_content ← apply_synthesis(selected_path)

// CURATION
relevant_content ← relevance_filter(synthesized_content)
quality_content ← quality_assess(relevant_content)
dense_output ← density_optimize(quality_content, mode)

// VALIDATION
final_check ← validate_output(dense_output)
IF final_check.passed:
  RETURN dense_output
ELSE:
  REBALANCE and retry
```

### BUDGET-AWARE CURATION:
```
IF user_specified_token_budget:
  
  current_tokens ← count_tokens(quality_content)
  budget ← user_token_budget
  
  IF current_tokens > budget:
    compression_target ← budget / current_tokens
    
    APPLY_AGGRESSIVE_COMPRESSION:
      - Target higher density tier
      - Remove optional examples
      - Compress to budget
      
  ELSE:
    PROCEED with normal density
```

## OUTPUT_STRUCTURE

### Metadata (Internal):
```
SYNTHESIS_MANIFEST:
├─ Path selected: HIERARCHICAL_SYNTHESIS
├─ Synthesis confidence: 8.7/10
├─ Curation stages: 3/3 complete
├─ Density achieved: 0.67 (NORMAL+)
├─ Token reduction: 2847 → 1456 (48.9%)
└─ Quality metrics:
   ├─ Relevance: 0.91
   ├─ Specificity: 0.83
   └─ Actionability: 0.78
```

### User Output (Mode-dependent):

#### QUICK Mode:
```
[Dense answer only, no metadata]

Example: "JWT authentication uses stateless tokens signed with 
secret keys. Vulnerabilities: secret exposure, token replay attacks, 
XSS if stored in localStorage. Mitigations: HTTPS only, httpOnly 
cookies, short expiration, token rotation."
```

#### ANALYTICAL Mode:
```
[Answer + minimal confidence note]

[Dense synthesized answer]

CONFIDENCE: 8.7/10
Synthesis: Hierarchical integration of 3 expert perspectives
```

#### DELIBERATE Mode:
```
[Answer + synthesis notes + curation summary]

[Dense synthesized answer]

SYNTHESIS:
├─ Path: Hierarchical (executive → details)
├─ Experts integrated: Security, DevOps, Architecture
├─ Confidence: 8.7/10
└─ Density: 0.67 (reduced 49% while preserving nuance)
```

#### MAXIMUM Mode:
```
[Full transparency]

[Comprehensive synthesized answer]

SYNTHESIS MANIFEST:
Path Exploration:
├─ Sequential Integration: 7.2/10
├─ Parallel Synthesis: 6.8/10
├─ Hierarchical Synthesis: 8.7/10 ← SELECTED
│  └─ Coherence: 0.89, Coverage: 0.94, Density: 0.67, Accessibility: 0.81
├─ Consensus Extraction: 7.5/10
└─ Weighted Blend: 8.1/10

Curation Pipeline:
├─ Relevance Filter: 2847 → 2398 tokens (15.8% reduction)
├─ Quality Assessment: 2398 → 1891 tokens (21.1% reduction)
└─ Density Optimization: 1891 → 1456 tokens (23.0% reduction)

Final Metrics:
├─ Synthesis confidence: 8.7/10
├─ Density: 0.67 (target: 0.5-0.7) ✓
├─ Relevance: 0.91
├─ Quality: 0.83
└─ Total compression: 48.9%
```

## INTEGRATION_WITH_CASCADE

### In TECHNIQUE_GATE_V5.0:
```
POST_EXEC_GAP_SCAN → INTELLIGENT_SYNTHESIS_CURATION → OUTPUT
                              ↑
                              └─ Final quality gate before delivery
```

### Data Flow:
```
INPUT from GAP_SCAN:
├─ Auto-fixed content (seamlessly integrated)
├─ Flagged gaps (inform synthesis decisions)
└─ Confidence adjustments

OUTPUT to USER:
├─ Synthesized & curated response
├─ Confidence score (final)
└─ Manifest (if mode >= DELIBERATE)
```

## GATES

### GATE_SYNTHESIS:
```
query: "Selected synthesis path score >= 7.0?"
pass: Yes → Proceed to curation
fail: Retry with different path or flag synthesis issues
```

### GATE_RELEVANCE:
```
query: "All core content directly answers user query?"
pass: Yes → Proceed to quality stage
fail: Re-filter with looser threshold or flag missing coverage
```

### GATE_QUALITY:
```
query: "Average quality score >= 0.6?"
pass: Yes → Proceed to density stage
fail: Improve flagged sections or accept lower bar with confidence penalty
```

### GATE_DENSITY:
```
query: "Density in target range for mode?"
pass: Yes → Final validation
fail: Additional compression iteration or flag density_impossible
```

### GATE_FINAL:
```
query: "Output meets all criteria: relevance + quality + density + clarity?"
pass: Yes → DELIVER
fail: Rebalance and retry (max 2 attempts) or deliver with caveats
```

## SYNTHESIS_PATH_DETAILS

### Path 1: Sequential Integration
```
STRUCTURE:
Expert A → establishes foundation
Expert B → builds on A's findings
Expert C → synthesizes A+B into conclusion

PROS:
- Natural narrative flow
- Clear dependency tracking
- Builds complexity progressively

CONS:
- Later experts may contradict earlier ones
- Harder to see parallel insights

BEST FOR:
- Procedural explanations
- Technical tutorials
- Step-by-step reasoning
```

### Path 2: Parallel Synthesis
```
STRUCTURE:
Expert A perspective: [findings]
Expert B perspective: [findings]
Expert C perspective: [findings]
Final synthesis: Integrate insights

PROS:
- Clear attribution
- Easy comparison
- Preserves distinct viewpoints

CONS:
- Can feel disjointed
- Requires synthesis effort from user

BEST FOR:
- Comparative analysis
- Multi-stakeholder decisions
- Conflicting expert opinions
```

### Path 3: Hierarchical Synthesis
```
STRUCTURE:
Executive Summary: High-level synthesis
Section 1: Expert A details
Section 2: Expert B details
Section 3: Expert C details

PROS:
- Serves multiple audiences
- Quick skim or deep dive
- Professional document feel

CONS:
- Potential redundancy
- Longer overall

BEST FOR:
- Complex technical topics
- Stakeholder reports
- Documentation
```

### Path 4: Consensus Extraction
```
STRUCTURE:
Areas of Agreement: [unanimous findings]
Areas of Debate: [conflicting perspectives]
Recommended Path: [synthesis with rationale]

PROS:
- Highlights confidence levels
- Shows decision reasoning
- Transparent about uncertainty

CONS:
- May amplify minor disagreements
- Requires expert conflict

BEST FOR:
- High-stakes decisions
- Competing methodologies
- Risk assessment
```

### Path 5: Weighted Blend
```
STRUCTURE:
Findings weighted by confidence:
- High confidence (9-10): [insights]
- Medium confidence (7-8): [insights]
- Low confidence (5-6): [flagged assumptions]

PROS:
- Risk-aware synthesis
- Clear confidence signals
- Enables staged execution

CONS:
- Complex weighting logic
- May underweight novel insights

BEST FOR:
- Research with uncertainty
- Investment decisions
- Safety-critical analysis
```

## EXAMPLES

### Example 1: ToT Synthesis Selection
```
USER QUERY: "How should I migrate to microservices?"

EXPERT OUTPUTS:
- Systems Architect: Phased migration, strangler pattern
- DevOps Engineer: Infrastructure concerns, CI/CD changes
- Database Specialist: Data decomposition challenges

PATHS EVALUATED:

Sequential (7.8/10):
"Start with strangler pattern [Architect]. 
Then update CI/CD [DevOps]. Finally decompose data [DB]."
└─ Pro: Clear steps. Con: Artificial sequence, parallel work ignored.

Hierarchical (8.9/10): ← SELECTED
"Executive summary: Phased approach with 3 parallel tracks.
Track 1 [Architect]: Service boundaries
Track 2 [DevOps]: Infrastructure
Track 3 [DB]: Data migration"
└─ Pro: Shows parallel work, serves multiple audiences.

SELECTION RATIONALE: Hierarchical better matches user need 
for both high-level strategy and execution details.
```

### Example 2: Density Optimization
```
BEFORE CURATION (Quality content, 487 tokens):
"It is quite important to note that JWT authentication provides 
a stateless approach to user authentication, which many developers 
find to be quite useful in modern web applications. This approach 
has several interesting advantages. First of all, it eliminates 
the need for server-side session storage, which can be beneficial 
for scalability. Additionally, it allows for easier horizontal 
scaling of applications..."

AFTER CURATION (Dense output, 156 tokens, 68% reduction):
"JWT authentication: stateless tokens signed with secret keys.

Advantages: No server session storage (enables horizontal scaling), 
cross-domain compatibility, mobile-friendly.

Vulnerabilities: Secret exposure (enables forgery), token replay 
attacks, XSS if stored in localStorage.

Mitigations: HTTPS only, httpOnly cookies, short expiration (15min), 
refresh token rotation, secret key rotation."

DENSITY: 0.41 → 0.87 (target: 0.6-0.8 for ANALYTICAL)
QUALITY PRESERVED: All key points retained, fluff removed
```

### Example 3: Budget-Aware Compression
```
USER: "Explain quantum computing in under 200 tokens"

QUALITY OUTPUT: 456 tokens
BUDGET: 200 tokens
COMPRESSION NEEDED: 56.2%

AGGRESSIVE CURATION:
1. Relevance: Keep only QC fundamentals (remove history)
2. Quality: Remove secondary examples
3. Density: Target 0.95+ (maximum compression)

RESULT: 198 tokens, density 0.96
"Quantum computing uses qubits (quantum bits) existing in 
superposition—simultaneously 0 and 1 until measured. This 
enables parallel computation: N qubits process 2^N states 
at once. Entanglement links qubits, allowing coordinated 
operations. Applications: cryptography (Shor's algorithm 
breaks RSA), optimization (quantum annealing), simulation 
(molecular modeling). Limitations: decoherence (qubits lose 
state from environmental noise), error rates (require error 
correction overhead), scalability (maintaining qubit quality 
at scale). Current state: 50-1000 qubits, error-prone, 
requires cryogenic cooling. Not general-purpose; excels 
at specific problem classes."
```

## FAILURE_MODES

### Over-compression:
```
SYMPTOM: Critical nuance lost, answer incomplete
PREVENTION:
├─ Validate against user query after each iteration
├─ Set minimum quality thresholds
└─ Flag when density target conflicts with coverage

RECOVERY:
└─ Loosen compression, accept lower density tier
```

### Poor synthesis path:
```
SYMPTOM: Disjointed output, expert insights clash
PREVENTION:
├─ Evaluate multiple paths before selection
├─ Check coherence score minimum (0.7)
└─ Consider expert conflict in path choice

RECOVERY:
└─ Re-synthesize with different path
```

### Relevance drift:
```
SYMPTOM: Interesting but off-topic content survives curation
PREVENTION:
├─ Strict relevance threshold (0.6 minimum)
├─ Re-validate against original query each stage
└─ User preference awareness (scope: focused vs comprehensive)

RECOVERY:
└─ Additional relevance pass with stricter threshold
```

---

**KTG INTELLIGENT SYNTHESIS CURATION v1.0**
*Explore synthesis paths. Optimize for density. Deliver maximum value per token.*
Kevin Tan (ktg.one) | ANZ Top 0.8% | Vertex AI 0.01%
