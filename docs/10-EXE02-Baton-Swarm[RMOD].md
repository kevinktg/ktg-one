---
title: "Ktg Baton Swarm"
version: "v25"
status: "ACTIVE"
model: "Multi-model"
tags: ["baton", "swarm", "execution", "component", "ktg-directive", "active"]
created: "2025-11-22"
updated: "2025-11-22"
creator: "ktg"
category: "component"
description: "Baton Passing / Expert Swarm - Phase 7a/7b"
---

# BATON PASSING / EXPERT SWARM
**Phase 7a/7b of KTG-DIRECTIVE v25 | Context: Node elaboration execution**

## PURPOSE
Two execution styles for elaborating structure nodes: Sequential (Baton) or Parallel (Swarm).

## 7a. BATON_PASSING (Sequential)
Sequential node elaboration; experts pass enriched context.

**Execution:**
- At each node: Pre-ARQ → Elaborate → Post-ARQ (≥0.9) → Handoff
- Observers note gaps, potential bombs for final pass
- Compound: Baton^n × ARQ^n per transit
- USC≥3 → parallel baton chains; choose best

**Use when:** Nodes have dependencies, need sequential build-up

## 7b. EXPERT_SWARM (Parallel)
Parallel node elaboration; all experts see structure.

**Execution:**
- Each expert: Pre-ARQ → Execute on assigned nodes → Post-ARQ (≥0.9)
- Simultaneous perfection of all nodes
- Compound: (Baton^n) × (ARQ^n) across experts
- All experts aware of full structure

**Use when:** Nodes are independent, need parallel speed

## MODE REQUIREMENTS
- QUICK: X (no baton/swarm)
- ANALYTICAL: O (single baton chain)
- DELIBERATE: R (baton OR small swarm)
- MAXIMUM: R (full swarm and/or multi-baton)

## DECISION LOGIC
- If nodes have dependencies → Baton Passing
- If nodes are independent → Expert Swarm
- If complex + time-critical → Hybrid (swarm with baton handoffs)

## TOKEN OVERHEAD
- Baton: ~20% tokens, sequential quality build-up
- Swarm: ~25% tokens, parallel quality multiplication

## OUTPUT TO NEXT PHASE
Elaborated nodes with expert contributions → Phase 8 (Reasoning Execution)

