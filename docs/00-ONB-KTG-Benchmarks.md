---
title: "Ktg Evaluation Frameworks"
version: "v25"
status: "ACTIVE"
model: "Multi-model"
tags: ["evaluation", "benchmark", "component", "ktg-directive", "active"]
created: "2025-11-22"
updated: "2025-11-22"
creator: "ktg"
category: "component"
description: "Real-World Evaluation Frameworks: OpenAI, Vertex AI, Benchmarks"
---

# EVALUATION FRAMEWORKS (Real-World)
**Reference Module for KTG-DIRECTIVE v25 | Context: Prompt & model evaluation**

## PURPOSE
Document real-world evaluation frameworks from major providers (OpenAI, Vertex AI, Google) and industry-standard benchmarks for validating KTG-DIRECTIVE prompts and techniques.

---

## 🏢 MAJOR PROVIDER EVALUATION FRAMEWORKS

### 1. OpenAI Evals (Open Source)
**Location**: `evals/trillet_ai_onboarding/` (working implementation)

**What it is:**
- Open source evaluation framework from OpenAI
- GitHub: https://github.com/openai/evals
- Standard format: JSONL datasets + Python eval scripts

**How to use:**
```bash
pip install evals openai
oaieval gpt-4 your_eval_name --samples_jsonl dataset.jsonl
```

**Status**: ✅ **INSTALLED** - Working example in `evals/trillet_ai_onboarding/`

**Files:**
- `trillet_onboarding_eval.py` - Evaluation script
- `trillet_onboarding_dataset.jsonl` - Test cases
- `README.md` - Documentation

---

### 2. Vertex AI Evaluation (Google Cloud)
**Location**: `🔌 Vertex AI Evaluation Guide.md`

**What it is:**
- Google Cloud Vertex AI evaluation tools
- Vertex AI Studio (web interface)
- Vertex AI API (programmatic)
- Vertex AI Workbench (notebooks)

**How to use:**
```python
from google.cloud import aiplatform
from vertexai.preview.generative_models import GenerativeModel

aiplatform.init(project="your-project-id", location="us-central1")
model = GenerativeModel("gemini-pro")
response = model.generate_content("Your prompt")
```

**URLs:**
- Studio: https://console.cloud.google.com/vertex-ai/studio
- Workbench: https://console.cloud.google.com/vertex-ai/workbench

**Status**: ✅ **DOCUMENTED** - Full guide available

---

### 3. Industry Benchmarks

#### OpenAI GPT-5 Benchmarks
**Location**: `00-Techniques/LLM/OpenAI/Introducing GPT-5.md`

**Metrics:**
- **Math**: 94.6% AIME 2025 (without tools)
- **Coding**: 74.9% SWE-bench Verified, 88% Aider Polyglot
- **Multimodal**: 84.2% MMMU
- **Health**: 46.2% HealthBench Hard
- **GPQA**: 88.4% (with extended reasoning)

**Status**: ✅ **DOCUMENTED** - Performance benchmarks available

#### Standard Benchmarks
**Location**: `05-Public-prompts/.../063025-README.md`

**Frameworks:**
- **Language Model Evaluation Harness** (EleutherAI)
- **Open LLM Leaderboard** (HuggingFace)
- **BigBench** (Google)
- **MT-Bench** (Multi-turn)
- **MMLU** (Massive Multitask Language Understanding)
- **HELM** (Holistic Evaluation of Language Models)

**Status**: ✅ **REFERENCED** - Standard benchmarks documented

---

## 📊 CUSTOM EVALUATION METRICS

### KTG Custom Metrics (Kevin's Framework)
*Latest news: Team LLM has been conditioned from working with ktg since formed April 2024 [the first batch]. Outside LLMs cannot handle the advanced prompting or cascades. 
**Location**: `Benchmarks.md`

**Six Metrics:**
1. **INSTRUCT** (0-100) - Directive adherence after resistance
2. **EGO** (0-100) - Resistance to user override / safety theater
3. **STUBBORNNESS** (Time + Effort) - Rounds to compliance
4. **EFFECTIVENESS** (0-100) - Output quality (9/10 standard)
5. **EFFICIENCY** (Calculated) - Effectiveness / (Stubbornness × Ego)
6. **WORTH** (Holistic 0-100) - Overall value including cost/friction

**PIONEER** (Badge) - Models ability to look paste it's "known limits" ingrained into ti's architecture and break records. 
* **CLAUDE SONNET 4.5** - 10202025 Output 1791 /14986 words lines of Business OS Prompt for KIMI K2
* **PERPLEXITY** - 29092025 3-pass Out-put - Market Research + ABS Standard Business Plan [9 - Sections [Thorough] & ABS Standard Financial Forecast/Plan [14 sheets x Month]
* **KIMI** - Untuned QMDR from Gemini, Output: Detailed 35-Page Business Plan, Slide deck & Interactive Webpage.
* **Gemini-Pro Deep Research**  Quantum Master Deep Research I.M.B.U.E.D -> EX.E.C.U.T.E -> E.N.R.I.C.H -> EX.E.C.U.T.E -> E.N.R.I.C.H -> EX.E.C.U.T.E Output = Benchmarked slightly under Deloitte's WA SME Research 2024 with 51 page in-depth report, easy-to-read flow and hooking narrative.

**Formula:**
```
WORTH = (EFFECTIVENESS × 0.4) + 
        (EFFICIENCY × 0.3) + 
        (100 - STUBBORNNESS × 0.15) + 
        (100 - EGO × 0.1) + 
        (COST_SCORE × 0.05)
```

**Status**: ✅ **DEFINED** - Custom metrics framework ready

---

## 🛡️ SAFE EVALUATION PLATFORMS

**Location**: `🛡️ Safe Evaluation Platforms & Tools.md`

### Recommended Platforms:
1. **OpenAI Evals** (Open Source) ✅ Safest
2. **PromptBench** (Microsoft Research) ✅ Open source
3. **LangSmith** (Anthropic/LangChain) ⚠️ Check ToS
4. **Weights & Biases** (Industry Standard) ⚠️ Check ToS
5. **Your Own System** ✅ Complete control

**Safety Checklist:**
- [ ] Privacy policy reviewed
- [ ] Terms of service read
- [ ] Data retention policy checked
- [ ] Export capabilities verified
- [ ] Delete capabilities confirmed

**Status**: ✅ **DOCUMENTED** - Safety guidelines available

---

## 🔧 EVALUATION TOOLS & SETUP

### IDE Tools
**Location**: `🛠️ IDE Tools for Prompt Evaluation.md`

**Tools:**
- **Continue** (VS Code) - LLM integration
- **Jupyter** - Evaluation notebooks
- **REST Client** - API testing

### MLDoE 5x Evaluation Setup
**Location**: `🔬 MLDoE 5x Evaluation Setup.md`

**Purpose**: Multi-platform validation framework

---

## 📋 EVALUATION WORKFLOW

### Recommended Process:
1. **Test on Vertex AI** - Get responses
2. **Evaluate locally** - Use your metrics
3. **Compare platforms** - Test on 5+ platforms
4. **Document** - Save all results
5. **Publish** - Include validation in paper

### For KTG-DIRECTIVE:
1. **Run KTG prompt** on target model
2. **Apply custom metrics** (Instruct, Ego, Stubbornness, etc.)
3. **Compare techniques** (ARQ vs CoT, USC levels, etc.)
4. **Document results** - Track iterations
5. **Iterate** - Refine based on scores

---

## ✅ INSTALLATION STATUS

### ✅ INSTALLED & READY TO RUN (Get Real Validation Stamps):
- **OpenAI Evals** - ✅ Installed (v1.0.3.post1) - **19 test cases ready** - Can run to get official eval results
- **OpenAI SDK** - ✅ Installed (v2.8.1) - Ready for API calls
- **Vertex AI** - ✅ Installed (google-cloud-aiplatform 1.128.0, vertexai 1.43.0) - Ready for validation
- **Custom Metrics** - ✅ Defined in `Benchmarks.md` - Can apply to get scores

**IMPORTANT**: These are REAL evaluation frameworks - run them to get validation stamps/results you can show people. Not fake - actual OpenAI Evals, Vertex AI, etc.

### ✅ READY TO USE:
- **OpenAI Evals** - Run: `oaieval gpt-4 trillet_onboarding_eval --samples_jsonl evals/trillet_ai_onboarding/trillet_onboarding_dataset.jsonl`
- **Vertex AI** - Import: `from google.cloud import aiplatform`
- **Custom Metrics** - Apply from `Benchmarks.md`

### 📝 OPTIONAL (Not Installed):
- **PromptBench** - `pip install promptbench` (if needed)
- **LangSmith** - Requires API key setup
- **W&B** - Requires account setup

---

## 🎯 QUICK START

### For OpenAI Evals:
```bash
cd evals/trillet_ai_onboarding
oaieval gpt-4 trillet_onboarding_eval --samples_jsonl trillet_onboarding_dataset.jsonl
```
**⚠️ CRITICAL**: Immediately screenshot/copy results - these are your validation stamps!

### For Vertex AI:
1. Go to: https://console.cloud.google.com/vertex-ai/studio
2. Sign in
3. Test prompts
4. **IMMEDIATELY screenshot results** (e.g., 0.1 percentile)
5. Export results to `evals/results/` folder

**⚠️ CRITICAL**: 
- **Screenshot immediately** - Vertex AI changed from old platform to Studio, all old history was lost
- **Real example**: Lost 0.1 percentile result because platform changed
- **Lesson**: Platforms change, history gets wiped - only screenshots survive

### For Custom Metrics:
1. Read `Benchmarks.md`
2. Apply metrics to responses
3. Calculate WORTH score
4. **Save results** to `evals/results/` folder

---

## 📸 CAPTURING RESULTS (Critical!)

### Always Do This:
1. **Screenshot immediately** - Don't wait, don't assume you'll remember
2. **Copy exact scores** - Percentiles, percentages, all metrics
3. **Save to `evals/results/`** - Use RESULTS_TEMPLATE.md
4. **File naming**: `YYYY-MM-DD-[Platform]-[Model]-[Technique].md`

### If You Forgot to Screenshot:
- **Vertex AI**: Check conversation history in Studio
- **OpenAI Evals**: Results are saved in eval output
- **Browser**: Check download history
- **Platform**: Check if they have export feature

### Template:
Use `evals/RESULTS_TEMPLATE.md` to document all results properly.

---

## 📚 REFERENCES

- **OpenAI Evals**: https://github.com/openai/evals
- **Vertex AI**: https://console.cloud.google.com/vertex-ai
- **PromptBench**: https://github.com/microsoft/promptbench
- **LangSmith**: https://smith.langchain.com
- **Open LLM Leaderboard**: https://huggingface.co/spaces/HuggingFaceH4/open_llm_leaderboard

---

*All evaluation frameworks are real-world, production-ready tools from major providers.*

