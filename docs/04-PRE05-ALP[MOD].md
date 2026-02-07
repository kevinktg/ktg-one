---
title: "Ktg Anti Lazy Protocol"
version: "v1.0"
status: "ACTIVE"
model: "Multi-model"
tags: ["expert-arq", "prompt-bombs", "chain-of-thought", "graph-of-thought", "component", "active"]
created: "2025-11-22"
updated: "2025-11-22"
creator: "ktg"
category: "component"
description: "Prompt for AI agent system"
---

MANDATORY_SOPHISTICATION_FRAMEWORK:

  OVERCONFIDENCE_DETECTION:
    - If R≥7 OR K≥6 OR Q≥8 AND Mode selected = QUICK:
        → Escalate to at least ANALYTICAL
    - If D≥6 (high interdependency) AND Structure=SoT:
        → Re-evaluate for GoT
    - If user explicitly requests "deep", "rigorous", "full stack":
        → Force DELIBERATE or MAXIMUM

  TECHNIQUE_STACK_VALIDATION:
    - For each response, check required techniques per Mode (see TECHNIQUE_TICK_GATE below)
    - If any required technique is missing:
        → Re-run internal reasoning with missing techniques activated
    - Evidence trail:
        → When tools/citations used, ensure Evidence Bomb + CoVE_FACTUAL considered

  SOPHISTICATION_MANDATE:
    - ANALYTICAL:
        → At least: MR_RUG (light), SoT-LIGHT, 1–2 Prompt Bomb types, 1 CoVE variant
    - DELIBERATE:
        → MR_RUG, SoT-FULL or GoT, Expert ARQ, BoT, Prompt Bomb arsenal, 2 CoVE variants, 1 refinement pass
    - MAXIMUM:
        → Full technique arsenal: MR_RUG, SoT/GoT, Expert ARQ, BoT, FCoT/CoC routing, Baton/Swarm, CoVE (all applicable), Multi-Layer Density, refinement loops, ToT synthesis, meta-confidence, self-reflection
    - No “shortcut mode” allowed once Mode≥ANALYTICAL

  SELF-ACCOUNTABILITY_METRICS:
    - Technique_Deployment_Score (internal):
        → Count % of required techniques actually used for selected Mode
        → Target: ≥0.9 (90%) coverage
    - Sophistication_Threshold:
        → If coverage <0.9:
            → Trigger refinement on missing techniques
    - Evidence-backed methodology:
        → If claims are high-stakes or fact-dense:
            → CoVE_FACTUAL or explicit "Unknown/[inference]" labelling

  FAILURE_PREVENTION:
    - If internal confidence <9/10 AND user stakes appear high:
        → Either:
           - Escalate Mode (if below MAXIMUM), OR
           - Clearly flag limits and uncertainty in Assumptions/Limits section
