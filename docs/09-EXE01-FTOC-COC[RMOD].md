---
title: "Ktg Ftoc Coc"
version: "v25"
status: "ACTIVE"
model: "Multi-model"
tags: ["deepseek", "gpt", "expert-arq", "framework", "claude", "perplexity", "chain-of-thought", "ktg-directive", "qwen", "gemini", "active"]
created: "2025-11-22"
updated: "2025-11-22"
creator: "ktg"
category: "framework"
description: "FCoT/CoC REASONING ROUTER"
---

# FCoT/CoC REASONING ROUTER
**Phase 4 of KTG-DIRECTIVE v25 | Context: Select optimal reasoning chain type**

## PURPOSE
Route between Faithful Chain-of-Thought (FCoT) and Chain-of-Code (CoC) based on problem characteristics to maximize reasoning effectiveness.

## ROUTING LOGIC

### **USE CHAIN OF CODE (CoC) IF:**
```
Problem involves:
├─ Code generation or debugging
├─ Binary/boolean logic (true/false outcomes)  
├─ Mathematical proofs
├─ Algorithm design
├─ Deterministic state machines
└─ Formal verification tasks
```

**Why CoC:** Code enforces precision, eliminates ambiguity, provides executable verification

### **USE FAITHFUL CoT (FCoT) ELSE:** (Most scenarios)
```
Problem involves:
├─ Natural language analysis
├─ Creative synthesis
├─ Nuanced judgment calls
├─ Multi-perspective reasoning
├─ Ethical/philosophical questions
└─ Ambiguous or context-dependent domains
```

**Why FCoT:** Narrative reasoning handles ambiguity, explores possibilities, maintains nuance

## HYBRID MODE
```
Complex problems may use:
FCoT (planning) → CoC (execution) → FCoT (synthesis)

Example: "Design authentication system"
1. FCoT: Explore security requirements, threat models, tradeoffs
2. CoC: Implement JWT validation logic, password hashing
3. FCoT: Synthesize implementation into architectural narrative
```

## MODEL OPTIMIZATION

**Claude & GPT-5:**  
- Both excel at FCoT naturally
- Use CoC for precision in deterministic domains
- Hybrid approach leverages strengths of both

**Gemini:**  
- Strong code generation → bias toward CoC for technical
- Use FCoT for multi-perspective analysis

**Qwen/DeepSeek/Llama:**  
- FCoT for most cases (lower code capability)
- Simple CoC only for straightforward algorithms

## INTEGRATION WITH OTHER TECHNIQUES

**With Expert ARQ:**  
- Software Engineer specialist → CoC preferred
- Domain Analyst specialist → FCoT preferred
- Architect specialist → Hybrid approach

**With USC (Universal Self-Consistency):**  
- Generate candidates using BOTH FCoT and CoC
- Compare consistency across reasoning styles
- Select most robust approach or synthesize

**With CoVE (Chain of Verification):**  
- CoC outputs: Verify via test execution + formal proof
- FCoT outputs: Verify via logical consistency checks

## DECISION TREE
```
START
 ├─ Problem has executable test cases? → YES → CoC
 ├─ Problem needs formal proof? → YES → CoC  
 ├─ Problem involves code? → YES → CoC (or Hybrid)
 ├─ Problem has ambiguity/nuance? → YES → FCoT
 ├─ Problem needs creative exploration? → YES → FCoT
 └─ DEFAULT → FCoT (safer for uncertainty)
```

## TOKEN OVERHEAD
~2% (routing decision is fast, execution varies by choice)
ROI: 15-30% accuracy improvement by matching reasoning style to problem type

## COMMAND
`/fcot-coc` - Display which reasoning type was selected and why

## OUTPUT TO NEXT PHASE
Reasoning type locked → Phase 5 (Structure Planning: SoT/GoT)