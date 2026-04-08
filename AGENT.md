# AGENT.md — Pixide Icons

## 1. Project Overview

Pixide Icons is a **direct fork of Lucide** with an additional pixelization pipeline.

The goal is NOT to redesign an icon library from scratch.
The goal is to:

* fully reuse Lucide’s architecture
* stay compatible with its ecosystem
* add a transformation layer to generate pixel-style icons

Pixide must behave like Lucide from a developer perspective, while offering a different visual output.

---

## 2. Core Principles

1. **Lucide is the upstream source of truth**

   * All icons originate from Lucide
   * The project must stay syncable with upstream

2. **This is a fork, not a rewrite**

   * Use Git to track Lucide
   * Do not manually copy-paste code
   * Preserve structure and tooling

3. **Pixelization is a transformation layer**

   * Icons are converted, not manually recreated
   * Manual fixes are allowed but minimized

4. **Developer experience must remain identical**

   * Same import patterns
   * Same usage in frameworks (React, Vue, etc.)
   * Compatible with ecosystems like shadcn

---

## 3. Repository Strategy (Git-Based Fork)

### 3.1 Upstream Integration

The project MUST integrate Lucide using Git:

```bash
git remote add upstream https://github.com/lucide-icons/lucide.git
git fetch upstream
git merge upstream/main
```

---

### 3.2 Requirements

* Keep a clean history
* Allow future upstream merges
* Avoid breaking changes in structure

---

### 3.3 Directory Layout

```id="u4n2x1"
pixide-icons/
├── upstream/                 # optional mirror or reference
├── packages/
│   ├── core/
│   ├── react/
│   ├── vue/
│   └── cli/
├── icons/
│   ├── original/
│   ├── pixel/
│   └── refined/
├── converter/
├── playground/
└── scripts/
```

---

## 4. Forking Lucide

### 4.1 Objectives

* Reuse Lucide’s build system
* Reuse icon generation logic
* Reuse framework integrations

---

### 4.2 Required Actions

Agent must:

1. Clone Lucide repository

2. Configure upstream remote

3. Copy or reuse:

   * icon sources
   * build scripts
   * package structure

4. Rename packages:

   * `lucide-react` → `pixide-react`
   * `lucide-vue` → `pixide-vue`

---

### 4.3 Critical Constraint

Generated packages MUST remain compatible with existing usage patterns:

```tsx
import { Camera } from "pixide-react"
```

Must work identically to Lucide in:

* React apps
* Vue apps
* component libraries (e.g. shadcn)

---

## 5. Pixel Conversion Pipeline

### 5.1 Purpose

Convert Lucide SVG icons into pixel-style icons automatically.

---

### 5.2 Processing Steps

#### 1. Parse SVG

* Extract paths
* Convert commands to absolute

#### 2. Normalize

* Remove transforms
* Normalize viewport (16x16 or 24x24)

#### 3. Simplify geometry

* Reduce points
* Remove unnecessary detail

#### 4. Grid quantization

```id="n8x2p4"
snap(x) = round(x / grid) * grid
```

* grid size must be configurable

---

#### 5. Stroke to fill conversion

* Replace strokes with filled shapes
* Use consistent thickness

---

#### 6. Curve removal

* Convert curves to straight segments

---

#### 7. SVG reconstruction

* Integer coordinates only
* Prefer simple shapes

---

### 5.3 Output Format

```id="m2p8z1"
{
  name: string,
  svg: string,
  status: "auto" | "needs-review" | "refined"
}
```

---

## 6. Quality Scoring System

### 6.1 Purpose

Automatically detect icons that require manual correction.

---

### 6.2 Metrics

* pixel density
* symmetry
* complexity
* visual consistency

---

### 6.3 Decision Rule

```id="c7x9w2"
if score < threshold:
    status = "needs-review"
```

---

## 7. Workflow

```id="q1p9x2"
1. sync upstream Lucide
2. extract SVG → icons/original
3. run converter → icons/pixel
4. run scoring
5. auto-approve valid icons → refined
6. flag others → needs-review
7. manual correction via playground
8. generate packages
```

---

## 8. Playground (Manual Editing Tool)

### 8.1 Purpose

Allow fast manual refinement of generated icons.

---

### 8.2 Features

* side-by-side comparison (original vs pixel)
* basic SVG editing
* grid-based editing
* save to `/icons/refined`

---

## 9. Package Generation

### 9.1 Objective

Generate framework-specific packages identical to Lucide.

---

### 9.2 API Requirements

Must support:

```tsx
<Camera size={16} color="black" />
```

---

### 9.3 Differences from Lucide

* No `strokeWidth`
* Use `fill` instead of `stroke`

---

### 9.4 Packages

* pixide-core
* pixide-react
* pixide-vue

---

### 9.5 Generation Script

```bash
generate-icons --input icons/refined --output packages/react
```

---

## 10. CLI

### 10.1 Commands

```bash
pixide sync
pixide convert
pixide score
pixide build
pixide preview
pixide fix <icon>
```

---

## 11. Compatibility Requirements

Pixide MUST be usable in:

* React
* Vue
* existing Lucide-based projects
* UI libraries like shadcn

---

## 12. Development Strategy

### 12.1 Phases

1. Fork Lucide via Git
2. Ensure baseline build works
3. Implement conversion pipeline
4. Test on a small icon subset (~20)
5. Generate React package
6. Add scoring system
7. Build playground
8. Scale to full icon set

---

### 12.2 Work Distribution

* 70–80% automated
* 20–30% manual refinement

---

## 13. Critical Constraints

* Do not break Lucide structure
* Maintain upstream compatibility
* Enforce strict grid alignment
* Ensure visual consistency

---

## 14. Summary

Pixide Icons is:

* a Git-based fork of Lucide
* extended with a pixel conversion pipeline
* maintaining full compatibility with existing integrations
* supported by tooling for automation and refinement

It must be built as:

> an extension layer on top of Lucide, not a replacement.
