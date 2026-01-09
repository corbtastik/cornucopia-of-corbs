---
title: "Keyword Search vs Vector Search in MongoDB Atlas"
date: 2026-01-09
tags: ["tutorial", "atlas", "mongodb", "AI", "vector-search", "text-search"]
description: "Feel the Difference — Keyword Search vs Vector Search in MongoDB Atlas"
---

# Keyword Search vs Vector Search in MongoDB Atlas

In this post, we’re gonna run a side-by-side search spin-off in MongoDB Atlas:

* [Atlas Search](https://www.mongodb.com/docs/atlas/atlas-search/operators-collectors/text/) (keyword / full-text) using the `text` operator (scored by [BM25](https://en.wikipedia.org/wiki/Okapi_BM25) by default).
* [Atlas Vector Search](https://www.mongodb.com/docs/atlas/atlas-vector-search/vector-search-stage/) (semantic / meaning-based) using the [`$vectorSearch` aggregation stage](https://www.mongodb.com/docs/manual/reference/operator/aggregation/vectorsearch/) ([nearest-neighbor](https://en.wikipedia.org/wiki/Nearest_neighbor_search) search over embeddings).

> The goal isn’t to “replace” text search. It’s to experience, hands-on, **why** vector search is different.

* **[Keyword search](https://learn.mongodb.com/learn/course/search-fundamentals/) answers**: _“Which documents contain these words?”_ (BM25-style ranking). 
* **[Vector search](https://www.mongodb.com/docs/atlas/atlas-vector-search/vector-search-overview/) answers**: _“Which documents are most similar in meaning?”_ (closest vectors).

To keep this truly _“Hello World”_ and fast to reproduce, we’ll use Atlas’s sample dataset ([`sample_mflix`](https://www.mongodb.com/docs/atlas/sample-data/sample-mflix/)) which includes an embedded_movies collection designed for [vector search experiments](https://www.mongodb.com/docs/atlas/atlas-vector-search/tutorials/vector-search-quick-start/).

---

## Prerequisites

### Accounts + cloud setup

* A [MongoDB Atlas account](https://cloud.mongodb.com) and a project.
* An Atlas cluster you can connect to (Free Tier / Flex is fine for this tutorial). 

### Local tools

* Git (to clone the repo / commit your changes)
* `mongosh` (MongoDB Shell) or MongoDB Compass

### Atlas data + indexes we’ll create

* Load Atlas Sample Dataset → `sample_mflix` database, including `embedded_movies`
* We will create:
  * A Search (text) index for keyword search using the `text` operator (BM25 scoring by default).
  * A Vector Search index so `$vectorSearch` can run.

### Optional (nice to haves)

* Node.js (if you want a tiny “demo app” wrapper around the queries later).
* Atlas CLI (not required for this, but handy once you automate)

---