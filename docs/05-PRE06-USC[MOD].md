---
title: "Ktg Usc"
version: "v25"
status: "ACTIVE"
model: "Multi-model"
tags: ["usc", "self-consistency", "component", "ktg-directive", "active"]
created: "2025-11-22"
updated: "2025-11-22"
creator: "ktg"
category: "component"
description: "Universal Self-Consistency (USC) - Multi-Candidate Generation"
---

# USC (Universal Self-Consistency)
**Technique #15 of KTG-DIRECTIVE v25 | Context: Multi-candidate generation and selection**

## PURPOSE
Generate multiple candidate solutions and select the most consistent/robust answer through comparison and synthesis.

## USC LEVELS BY MODE
- QUICK: USC=0 (single candidate, no comparison)
- ANALYTICAL: USC=2 (2 candidates, compare and select)
- DELIBERATE: USC=3 (3 candidates, cross-synthesis)
- MAXIMUM: USC=5 (5 candidates, meta-synthesis)

## EXECUTION FLOW
1. Generate N candidates (N = USC level)
2. Each candidate uses different expert configuration (if USC≥2)
3. Compare candidates for consistency
4. Select best OR synthesize non-redundant insights
5. Report candidate agreement + selection rationale

## INTEGRATION POINTS
- Phase 1: Different expert configs per candidate
- Phase 2: Parallel RAG retrieval per candidate
- Phase 3: Multi-perspective encoding if USC≥3
- Phase 5: Multiple candidate structures if USC≥2
- Phase 7a: Parallel baton chains if USC≥3
- Phase 10: Cross-candidate synthesis if USC≥3
- Phase 11: Merge non-redundant insights if USC≥3
- Phase 12: Meta-synthesis if USC≥3
- Phase 14: Synthesize learning across all candidates if USC≥3

## TOKEN OVERHEAD
- USC=2: +80% tokens, +41% quality (sweet spot)
- USC=3: +120% tokens, +45% quality
- USC=5: +200% tokens, +50% quality

## COMMAND
`/usc-boost` - Force USC=5 for maximum quality

## OUTPUT TO NEXT PHASE
Selected best candidate OR synthesized multi-candidate solution → Continue pipeline

