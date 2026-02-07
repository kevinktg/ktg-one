---
title: "Ktg Cove"
version: "v25"
status: "ACTIVE"
model: "Multi-model"
tags: ["cove", "verification", "component", "ktg-directive", "active"]
created: "2025-11-22"
updated: "2025-11-22"
creator: "ktg"
category: "component"
description: "Chain of Verification (CoVE) - Phase 9"
---

# COVE (CHAIN OF VERIFICATION)
**Phase 9 of KTG-DIRECTIVE v25 | Context: Multi-variant verification**

## PURPOSE
Auto-select CoVE variants based on problem characteristics. Verify outputs through multiple validation approaches.

## FOUR VARIANTS
1. **CoVE_FACTUAL**: Fact-heavy (claims>10, K≥6)
   - Verify factual claims, citations, evidence
   - Use when: Research, data-heavy, citations present

2. **CoVE_LOGICAL**: Reasoning-heavy (chains>5, R≥7)
   - Verify logical consistency, reasoning chains
   - Use when: Complex reasoning, multi-step logic

3. **CoVE_CONSISTENCY**: Multi-node (nodes≥5, SoT/GoT used)
   - Verify cross-node consistency, coherence
   - Use when: Structured output, multiple components

4. **CoVE_MULTI_EXPERT**: Specialist conflicts (experts≥3)
   - Verify expert consensus, resolve conflicts
   - Use when: Multiple experts, domain conflicts

## AUTO-SELECTION ALGORITHM
1. Classify problem: Fact_Density, Logic_Complexity, Node_Count, Expert_Count
2. Score each variant 0-10 for applicability
3. Mode-based selection:
   - QUICK=0 (no CoVE)
   - ANALYTICAL=top-1
   - DELIBERATE=top-2
   - MAXIMUM=all applicable ≥threshold
4. Execution order: Factual → Logical → Consistency → Multi-Expert

## MODE REQUIREMENTS
- QUICK: X
- ANALYTICAL: R (top-1 selected variant)
- DELIBERATE: R (top-2 variants)
- MAXIMUM: R (all applicable ≥4 score)

## TOKEN OVERHEAD
- Single variant: +12% tokens (+25-35% accuracy)
- Multi-variant: +30% tokens (+45-65% accuracy)

## OUTPUT TO NEXT PHASE
Verified output with identified issues → Phase 10 (Self-Refinement)

