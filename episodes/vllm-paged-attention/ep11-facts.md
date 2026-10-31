# EP 11 facts — PagedAttention / vLLM

Every figure that goes on screen must appear here with its source. Nothing in
this episode is estimated, rounded for effect, or remembered.

**Primary sources**
- Kwon, Li, Zhuang, Sheng, Zheng, Yu, Gonzalez, Zhang, Stoica —
  *Efficient Memory Management for Large Language Model Serving with
  PagedAttention*, **SOSP 2023**. arXiv:2309.06180
- vLLM launch post, 20 June 2023 — https://vllm.ai/blog/2023-06-20-vllm

## The cost of one token

| Fact | Value | Source |
|---|---|---|
| KV cache for a SINGLE token, OPT-13B | **800 KB** | paper §3 |
| …how it's derived | 2 (key + value) × 2 (K and V vectors) × 5120 (hidden) × 40 (layers) × 2 bytes (FP16) | paper §3, quoted |
| KV cache for one sequence, LLaMA-13B | **up to 1.7 GB** | blog |

## The memory map (13B model, 40GB A100)

| Slice | Share | Source |
|---|---|---|
| Model parameters (static) | **~65%** | paper Fig. 1 |
| KV cache (dynamic, across requests) | **~30%** | paper Fig. 1 |
| Activations (ephemeral) | **~5%** | paper Fig. 1 |

Derived, safe to state as arithmetic: 13B parameters × 2 bytes (FP16) = 26 GB,
which is the ~65% above on a 40 GB card.

## The waste

| Fact | Value | Source |
|---|---|---|
| KV cache memory actually holding token states, existing systems | **20.4% – 38.2%** | paper Fig. 2 |
| …i.e. wasted | **60% – 80%** | blog, paper |
| Waste under PagedAttention | **under 4%** | blog |

**The three sources of waste** (paper Fig. 3) — this is the episode's spine:
1. **Reserved** — space held for tokens the request has not generated yet.
2. **Internal fragmentation** — over-provisioned to the *maximum* sequence
   length, not the actual one.
3. **External fragmentation** — gaps between differently-sized allocations.

## The payoff

| Fact | Value | Source |
|---|---|---|
| Throughput vs FasterTransformer and Orca (SOTA), same latency | **2 – 4×** | paper abstract |
| Throughput vs HuggingFace Transformers | **up to 24×** | blog |
| Throughput vs HuggingFace TGI | **up to 3.5×** | blog |
| Memory saved by sharing (parallel sampling / beam search) | **up to 55%** | blog |
| Throughput gain from that sharing | **up to 2.2×** | blog |
| LMSYS Vicuna serving: GPUs required | **cut by 50%** | blog |
| LMSYS traffic served | **30K requests/day average, 60K peak** | blog |

## Wording rules for this episode

- "Up to 24×" is **against HuggingFace Transformers**, which is not a serving
  system. Against the state of the art it is **2–4×**. Say which one, every
  time — the honest number is the one that makes the episode trustworthy.
- PagedAttention is an *attention kernel* that reads non-contiguous KV blocks.
  vLLM is the *serving system* built on it. Don't use the names interchangeably.
- The OS analogy is the paper's own framing ("inspired by the classical virtual
  memory and paging techniques in operating systems"), not a liberty.
