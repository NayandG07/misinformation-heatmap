# Experimental Model & Fact-Checking Upgrades

This document outlines the planned future upgrades for the Misinformation Heatmap system, specifically targeting the reduction of false positives on verified news and the enhancement of the core ML models.

## Current Limitations Identified
1. **Fact-Checking False Positives**: The current `_check_against_fact_checkers` logic uses a hardcoded dictionary of debunked claims and relies on naive keyword matching. This leads to verified news (e.g., from authentic sources) being incorrectly tagged with "False Claim" UI elements simply because they share keywords (like location names) with known fake news.
2. **Synthetic Training Data**: The ensemble ML models (in `advanced_ml_classifier.py`) currently train on a mix of synthetic data generated via code and a small static CSV. This restricts the model's ability to accurately classify nuanced real-world news articles.

## Planned Architecture Upgrades

### 1. Real-World Dataset Integration
- **HuggingFace `datasets` Integration**: We plan to replace the synthetic data generation in `train_model.py` with large-scale, open-source fake news datasets (e.g., `WELFake` which contains 72,000+ real and fake articles, or the ISOT dataset).
- **IndicBERT Fine-Tuning**: The `EnhancedIndicBERTProcessor` will be fine-tuned on this expanded dataset with optimized hyperparameters (batch size, epochs, learning rate) for improved convergence.
- **Ensemble Classifier Update**: The `advanced_ml_classifier.py` pipeline (TF-IDF + Random Forest / Gradient Boosting) will be hooked into the new real-world data pipeline.

### 2. Live Fact-Check API Replacement
- **Google Fact Check Tools API**: We plan to integrate the Google Fact Check Explorer API (`https://factchecktools.googleapis.com/v1alpha1/claims:search`) to replace the hardcoded `debunked_claims` dictionary.
- **Semantic Checking**: Instead of naive keyword overlaps, the system will use semantic matching or API queries based on the core claim of the ingested article.
- **LLM Fallback (Optional)**: If API keys are unavailable, we will explore using an LLM (like Gemini or GPT-4) to semantically verify claims against known facts, or rely strictly on the upgraded ML model's confidence scores.

### 3. UI Logic Refinement
- **Conditional Rendering**: In `frontend/assets/js/components/ui.js`, the "Why is it misinformation?" (False Claim / Actual Fact) split view will be updated to render **only** when `classification === 'fake'`.
- **Verified News State**: A new positive UI state will be implemented for verified articles, clearly stating: *"Verified Analysis: This article comes from authenticated sources and shows no significant linguistic markers of misinformation."*
