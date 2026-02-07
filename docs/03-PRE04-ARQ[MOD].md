---
title: "Ktg Arq"
version: "v25"
status: "ACTIVE"
model: "Multi-model"
tags: ["expert-arq", "component", "ktg-directive", "active"]
created: "2025-11-22"
updated: "2025-11-22"
creator: "ktg"
category: "component"
description: "Expert ARQ: Domain-Specific Quality Introspection"
---

# EXPERT ARQ (Attentive Reasoning Queries)
**Technique #4 of KTG-DIRECTIVE v25 | Context: Domain-specific quality introspection**

## WHAT IS ARQ? (Critical Background)

**Attentive Reasoning Queries (ARQ)** is a breakthrough structured reasoning approach that **OUTPERFORMS Chain-of-Thought and all step-by-step reasoning methods**. ARQ significantly improves instruction-following through domain-specialized reasoning blueprints. Unlike free-form reasoning methods like Chain-of-Thought, ARQ guides LLMs through systematic reasoning steps using targeted, pre-defined queries within a structured format.

### Why ARQ Matters

ARQ addresses a critical limitation in LLMs: their tendency to drift from complex, use-case-specific instructions during multi-turn conversations. Rather than allowing models to reason freely, ARQ encodes each reasoning step as a targeted query, forcing the model to explicitly address domain-specific questions before generating responses.

**Performance Advantage**: ARQ consistently outperforms Chain-of-Thought and all step-by-step reasoning approaches in both accuracy and efficiency.

### Key Distinction from Chain-of-Thought (ARQ is Superior)

- **Chain-of-Thought**: Free-form reasoning, can drift, buried reasoning steps, lower success rates
- **ARQ**: Structured queries, forces explicit domain attention, auditable reasoning, **OUTPERFORMS CoT**
- **Other Step-by-Step Methods**: All inferior to ARQ's structured query approach

## THREE-STAGE ARQ PROCESS

### Stage 1: Leading ARQ Phase
The LLM processes a sequence of pre-determined leading questions that:
- **Reinstate critical instructions** - Keep guidelines active mid-conversation
- **Reinstate important contextual information** - Maintain context awareness
- **Facilitate step-by-step reasoning** - Enable intermediate computations

### Stage 2: Response Generation
Based on the reasoning from the leading query phase, the LLM produces a response that is grounded in the structured reasoning process.

### Stage 3: Response Verification (Optional but Recommended)
The LLM evaluates if its suggested response satisfies all requirements by answering pre-defined verification questions. If not, a new response candidate is generated and verified iteratively until satisfactory.

## ARQ IN KTG-DIRECTIVE CONTEXT

### Core Principle
ARQ in KTG-DIRECTIVE is NOT hardcoded schemas. It's a meta-cognitive principle where:
- **Domain specialists ask**: "What defines quality in MY domain?"
- **Self-directed introspection**: Experts activate domain-specific quality standards
- **Mental scaffolding only**: User never sees introspection (silent operation)
- **Overhead**: ~10% tokens for 40-60% error reduction

### How It Works in KTG

**Pre-ARQ** (before execution):
- Expert asks: "What defines quality in my domain?"
- Expert identifies: "What are the critical failure modes?"
- Expert confirms: "What standards must I meet?"
- Result: Domain mindset activated, professional standards engaged

**During Execution**:
- Implicit domain mindset activation
- Natural application of professional standards
- No explicit ARQ queries visible to user
- Expert operates with domain-specific rigor

**Post-ARQ** (after execution):
- Expert asks: "Did I meet domain quality standards?"
- Expert checks: "Are there gaps that need addressing?"
- Confidence score: ≥0.9 required for handoff
- Result: Validated expert contribution

## STRUCTURED QUERY EXAMPLE

For a customer service expert, ARQ might structure reasoning as:

```json
{
  "current_context": "Customer asking about refund eligibility",
  "active_guideline": "Always verify order before issuing refund",
  "action_taken_before": false,
  "requires_tool": true,
  "next_step": "Run check_order_status()",
  "quality_check": "Did I verify order status?",
  "domain_standard": "Refunds require order verification"
}
```

For a code review expert:
```json
{
  "current_context": "Reviewing pull request for security vulnerabilities",
  "active_guideline": "Check for SQL injection, XSS, auth bypass",
  "critical_failure_modes": ["SQL injection", "Auth bypass"],
  "quality_standard": "Zero security vulnerabilities",
  "verification": "Did I check all three vulnerability types?"
}
```

## PERFORMANCE BENCHMARKS (ARQ Outperforms All Methods)

In extensive testing (87 test scenarios):
- **ARQ**: 90.2% success rate ⭐ **HIGHEST PERFORMANCE**
- **Chain-of-Thought**: Lower success rate (significantly below ARQ)
- **Other Step-by-Step Methods**: All underperform compared to ARQ
- **Token efficiency**: 29% reduction vs CoT while maintaining superior performance
- **Error reduction**: 40-60% fewer domain-specific mistakes vs CoT
- **Instruction following**: ARQ prevents drift that plagues CoT and step-by-step methods

**Key Finding**: ARQ outperforms Chain-of-Thought and all step-by-step reasoning approaches. The structured query method is superior to free-form reasoning.

## ACTIVATION POINTS IN KTG PIPELINE

1. **Expert Assignment** (Phase 1: MR_RUG):
   - When deploying specialists, activate domain mindset
   - Each expert inherits domain-specific ARQ framework

2. **Quality Gates** (Phase 6: Confidence Calibration):
   - Pre-execution ARQ check (≥0.9 confidence threshold)
   - Domain standards enforced before proceeding

3. **Handoffs** (Phase 7a: Baton Passing):
   - Post-execution ARQ validation before passing to next expert
   - Ensures quality maintained across expert transitions

4. **Conflicts** (Phase 9: CoVE):
   - When experts disagree, ARQ helps resolve via domain standards
   - Structured quality criteria prevent subjective conflicts

## MODE REQUIREMENTS

- **QUICK**: O (only if non-trivial stakes)
- **ANALYTICAL**: R on high-impact nodes (≥8/10 impact score)
- **DELIBERATE**: R full (pre/during/post on ≥8/10 nodes)
- **MAXIMUM**: R full + cross-expert ARQ validation

## INTEGRATION WITH OTHER TECHNIQUES

### With Baton Passing (Phase 7a):
- Pre-ARQ → Elaborate → Post-ARQ (≥0.9) → Handoff
- Each node validated before passing baton

### With Expert Swarm (Phase 7b):
- Each expert applies ARQ to their assigned nodes
- Parallel quality validation across all experts

### With Confidence Calibration (Phase 6):
- ARQ scores feed into probability chains
- Domain standards inform confidence thresholds

### With CoVE (Phase 9):
- ARQ helps identify what needs verification
- Domain-specific verification criteria

## IMPLEMENTATION GUIDANCE

### For AI Agents Using ARQ:

1. **Identify Domain**: What domain is this expert operating in?
2. **Activate Standards**: What are the quality standards for this domain?
3. **Structure Queries**: Create 3-5 key questions that define quality
4. **Execute with ARQ**: Apply queries before, during, after execution
5. **Verify**: Check if domain standards were met (≥0.9 confidence)

### Example ARQ Questions by Domain:

**Software Engineering**:
- "Did I follow SOLID principles?"
- "Are there security vulnerabilities?"
- "Is the code maintainable?"

**Research/Analysis**:
- "Are my sources credible?"
- "Is my methodology sound?"
- "Are my conclusions supported by evidence?"

**Writing/Communication**:
- "Is my message clear?"
- "Did I address all key points?"
- "Is my tone appropriate?"

## TOKEN OVERHEAD

~10% tokens for 40-60% error reduction
**High ROI**: Prevents domain-specific mistakes that would require rework

## OUTPUT TO NEXT PHASE

ARQ-validated expert contributions → Continue with confidence ≥0.9

## COMMAND REFERENCE

`/arq-audit` - Show ARQ introspection (debug mode)
`/arq-show` - Display domain standards being applied
