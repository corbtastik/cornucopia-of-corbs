---
title: "Atlas Online Archive: Cost & Usage"
date: 2026-01-12
tags: ["atlas", "mongodb", "online-archive"]
description: "MongoDB Atlas Online Archive — Cost Estimate & Usage Modeling"
---

## **TL;DR; (Quick Read)**

- **MongoDB Atlas Online Archive** moves “cold” data out of your primary cluster into lower-cost object storage **while keeping it queryable**: [https://www.mongodb.com/docs/atlas/online-archive/](https://www.mongodb.com/docs/atlas/online-archive/)
- This estimate models **10 TB** of archived data and provides **annual costs** for **US East (N. Virginia)** and **South America (São Paulo)**.
- **Total cost = Storage + Query Processing + (potential) Network Egress**
  - **Storage** is the predictable baseline (GB-days). For 10 TB it’s roughly:
    - **~$5.9K/year (US East)**
    - **~$10.5K/year (São Paulo)**
  - **Query Processing** is billed at **$5 per TB processed** (i.e., **TB scanned**), **not** “per query.” Well-filtered, date-bounded queries keep this low:
    - **Light:** ~$120/year (2 TB processed/month)
    - **Moderate:** ~$1,200/year (20 TB processed/month)
    - **Heavy:** ~$12,000/year (200 TB processed/month)
- **Network egress** is a **cloud-provider charge** (not MongoDB). It’s usually **minimal** when reporting runs **in the same cloud region** as Atlas, and it becomes material when results are pulled **to on-prem**, exported in bulk, or moved cross-region: [https://www.mongodb.com/docs/atlas/billing/data-transfer-costs/](https://www.mongodb.com/docs/atlas/billing/data-transfer-costs/)
- The tables use **Small/Medium/Large egress ranges** to illustrate this uncertainty. The **Atlas billing dashboard + invoice** are the source of truth for final costs.

---

## **Introduction**

This document provides a practical, experience-based overview of **[MongoDB Atlas Online Archive](https://www.mongodb.com/docs/atlas/online-archive/)** and a set of **cost estimates** for archiving approximately **10 TB of data**.

The goal is to:

* Explain how Online Archive pricing works in plain terms  
* Provide **storage, query, and egress estimates** for two regions  
* Show how costs change under **Light / Moderate / Heavy** usage patterns  
* Call out where costs are predictable vs. usage-driven  
* Highlight scenarios where **[network egress](https://www.mongodb.com/docs/atlas/billing/data-transfer-costs/)** may apply

> All numbers below are estimates intended for planning and comparison purposes. Final costs depend on actual usage patterns.

---

## **What is MongoDB Atlas Online Archive?**

Atlas Online Archive allows you to transparently move infrequently accessed (“cold”) data from your primary Atlas cluster into low-cost cloud object storage, while still keeping the data **queryable using standard MongoDB queries**. See: **[Online Archive Overview](https://www.mongodb.com/docs/atlas/online-archive/overview/)**.

From an application or reporting perspective:

* Hot data stays in the Atlas cluster  
* Archived data lives in object storage  
* Queries can span both without changing application logic

Online Archive is commonly used for:

* Reporting and analytics on historical data  
* Compliance and audit lookbacks  
* Cost optimization for large datasets

---

## **Pricing Components (What You Pay For)**

Online Archive pricing has **three main components** (details: **[Online Archive Billing](https://www.mongodb.com/docs/atlas/billing/online-archive/)**):

### **1\. Archive Storage (GB-days)**

* Charged based on **how much data is stored** and **how long**  
* Billed as **$/GB-day**, varies by region  
* This is the **most predictable** cost

### **2\. Query Processing Rate**

**Query Processing Rate** is the cost charged when queries run against archived data (implemented via **[Atlas Data Federation](https://www.mongodb.com/docs/atlas/data-federation/)**; cost model described in **[Data Federation Billing](https://www.mongodb.com/docs/atlas/billing/data-federation/)**).

**Definition (plain English):**  
You are billed based on **how much archived data MongoDB has to read/scan** to answer a query — **not** how much data is returned.

* **Rate:** $5 per TB processed (see **[Online Archive Billing](https://www.mongodb.com/docs/atlas/billing/online-archive/)** and **[Data Federation Billing](https://www.mongodb.com/docs/atlas/billing/data-federation/)**)  
* **Minimum:** 10 MB processed per query (see **[Online Archive Billing](https://www.mongodb.com/docs/atlas/billing/online-archive/)**)  
* Applies whenever archived data is queried (filters, aggregations, reports)

**Example:**

* Query scans 200 GB of archived data → 0.2 TB × $5 \= **$1**  
* Query scans 10 TB of archived data → **$50**

**Key control lever:**  
Well-filtered, date-bounded queries keep this cost very low. Broad historical scans increase it linearly.

### **3\. Network Egress (Cloud Provider Charge)**

Network egress is **not a MongoDB charge**.  
It is charged by the underlying cloud provider when data **leaves the Atlas cloud boundary**.

Egress generally applies when:

* Data is returned to **on-prem systems**  
* Data is exported to files (CSV, Parquet, etc.)  
* Queries cross regions or clouds  
* Large result sets are downloaded externally

> If reporting tools run **in the same cloud and region**, egress is often minimal or near zero.

---

## **Assumptions Used in This Estimate**

* Total archived data: **10 TB (10,240 GB)**  
* Archive type: **Standard (non-time-series)**  
* Pricing modeled for:  
  * **US East (N. Virginia)**  
  * **South America (São Paulo)**  
* Query Processing tiers (TB processed per month):  
  * **Light:** 2 TB / month  
  * **Moderate:** 20 TB / month  
  * **Heavy:** 200 TB / month  
* Egress modeled as annual **ranges** due to cloud/provider variability

---

## **How to read the annual cost tables**

All columns in the tables are **annual USD cost estimates** for a **10 TB Online Archive** deployment, with usage modeled at different levels. The tables show costs broken into:

1. **Storage Cost (Annual USD)**  
2. **Query Processing Cost (Annual USD)**  
3. **Network Egress (Annual USD, Range)** *(provider-dependent, so shown as a range)*  
4. **Total Annual Cost Estimate (USD, Range)**

### **Universal assumptions used in calculations**

* **Archive size:** 10 TB \= **10,240 GB**  
* **Annualization:** **365 days/year** and **12 months/year**  
* Costs shown are **estimates** for planning; actual invoices vary by usage, provider, destination, and transfer patterns (see **[Online Archive Billing](https://www.mongodb.com/docs/atlas/billing/online-archive/)** and **[Atlas Data Transfer Costs](https://www.mongodb.com/docs/atlas/billing/data-transfer-costs/)**).

> **Important:** These figures are directional estimates based on published unit rates and assumed usage patterns. Actual billed amounts depend on configured archive criteria, data shape/compression, query selectivity, and the cloud provider’s networking rates and routing (including private connectivity vs. public internet). **The invoice and Atlas billing dashboard are the source of truth**.

---

## **1\) Storage Cost (Annual USD)**

### **What the number represents**

**Annual cost to store 10TB in Online Archive** (regardless of queries).

### **Unit in table header**

**Storage Cost (Annual USD)**

### **How it’s calculated**

Online Archive storage is billed on **GB-days** (see **[Online Archive Billing](https://www.mongodb.com/docs/atlas/billing/online-archive/)**):

**Storage Cost (Annual) \= (Archive GB) × (Rate $/GB-day) × (365)**

### **Example calculation (10TB, US East / N. Virginia)**

* Archive GB \= 10,240  
* Rate \= 0.001578 $/GB-day  
* Annual cost \= 10,240 × 0.001578 × 365 ≈ **$5,898/year**

*(São Paulo uses a different $/GB-day rate, so the same formula yields a higher annual storage cost.)*

---

## **2\) Query Processing Cost (Annual USD)**

### **What the number represents**

**Annual MongoDB charge for processing archived data during queries.**  
This is **not the number of queries**. It’s the **annual $ cost** derived from how much archived data is scanned/processed (see **[Online Archive Billing](https://www.mongodb.com/docs/atlas/billing/online-archive/)** and **[Data Federation Billing](https://www.mongodb.com/docs/atlas/billing/data-federation/)**).

### **Unit in table header**

**Query Processing Cost (Annual USD)**

### **Why it’s intentionally not “queries per X”**

MongoDB does **not** bill Online Archive by “number of queries.”  
 It bills by **how much archived data is processed (scanned/read)**, because:

* One query can scan **10 MB**  
* Another query can scan **10 TB**  
* Counting queries would be misleading

### **How it’s calculated**

MongoDB charges:

* **$5 per TB processed**  
* **10 MB minimum processed per query**

For modeling, we estimate **TB processed per month**, then annualize:

**Query Processing Cost (Annual) \= (TB processed/month) × 12 × ($5/TB)**

### **Usage levels used in the tables**

* **Light:** 2 TB processed/month  
* **Moderate:** 20 TB processed/month  
* **Heavy:** 200 TB processed/month

### **Example calculations**

* **Light:** 2 TB/month × 12 × $5 \= **$120/year**  
* **Moderate:** 20 TB/month × 12 × $5 \= **$1,200/year**  
* **Heavy:** 200 TB/month × 12 × $5 \= **$12,000/year**

### **Cost factors (what drives TB processed)**

* Whether queries are **bounded by the archive partition key** (often a date; see **[Online Archive Overview](https://www.mongodb.com/docs/atlas/online-archive/overview/)**)  
* Whether reports do broad “all-time” scans vs narrow time windows  
* Partitioning strategy and query patterns (tight filters reduce scanning)

---

## **3\) Network Egress (Annual USD, Range)**

### **What the number represents**

**Cloud provider network charge** for data transferred **out of** the Atlas environment. This is **not a MongoDB fee**. It depends on:

* Cloud provider (AWS/Azure/GCP)  
* Region  
* Destination (same-region vs cross-region vs internet/on-prem)  
* Transfer method and networking setup (peering/private endpoints vs public internet)

See: **[Atlas Data Transfer Costs](https://www.mongodb.com/docs/atlas/billing/data-transfer-costs/)**.

### **Unit in table header**

**Network Egress (Annual USD, Range)**

### **Why it’s a range**

Without knowing the cloud provider + destination architecture, egress can’t be a single reliable number. The tables provide **small/medium/large annual ranges** as planning placeholders.

### **Egress levels used in the tables (illustrative)**

* **Small:** 100 GB/month exported/returned externally  
* **Medium:** 1 TB/month exported/returned externally

* **Large:** 10 TB/month exported/returned externally

### **Annual egress ranges used in the tables (illustrative)**

* **Small:** **$60–$180/year**  
* **Medium:** **$600–$1,800/year**  
* **Large:** **$6,000–$18,000/year**

Important: If reporting and apps run **in the same cloud and region** (with private networking), egress may be **minimal**. Egress risk rises when data is routinely pulled to on-prem or exported in bulk.

### **Practical examples of when egress occurs**

1. **On-prem BI** (Tableau/Power BI server on-prem) querying Atlas and pulling large result sets → cloud-to-on-prem transfer.  
2. **Bulk exports** (monthly CSV/Parquet extracts from archived data) downloaded to laptops or internal file shares.  
3. **Cross-region reporting** (Atlas in US East; reporting app in São Paulo or Europe) → inter-region egress.  
4. **Downstream data lake pipelines** pulling archive results into another platform/account/region.

---

## **Annual Cost Estimates — US East (N. Virginia)**

**Storage rate:** $0.001578 per GB-day  
**Storage-only baseline:** **\~$5,898 / year**

| Usage Level | Storage Cost (Annual USD) | Query Processing Cost (Annual USD) | Network Egress (Annual USD, Range) | Total Annual Cost Estimate (USD, Range) |
| ----- | -----: | -----: | -----: | -----: |
| Light \+ Small | $5,898 | $120 | $60–$180 | **$6,078–$6,198** |
| Light \+ Medium | $5,898 | $120 | $600–$1,800 | **$6,618–$7,818** |
| Light \+ Large | $5,898 | $120 | $6,000–$18,000 | **$12,018–$24,018** |
| Moderate \+ Small | $5,898 | $1,200 | $60–$180 | **$7,158–$7,278** |
| Moderate \+ Medium | $5,898 | $1,200 | $600–$1,800 | **$7,698–$8,898** |
| Moderate \+ Large | $5,898 | $1,200 | $6,000–$18,000 | **$13,098–$25,098** |
| Heavy \+ Small | $5,898 | $12,000 | $60–$180 | **$17,958–$18,078** |
| Heavy \+ Medium | $5,898 | $12,000 | $600–$1,800 | **$18,498–$19,698** |
| Heavy \+ Large | $5,898 | $12,000 | $6,000–$18,000 | **$23,898–$35,898** |

---

## **Annual Cost Estimates — South America (São Paulo)**

**Storage rate:** $0.002798 per GB-day  
**Storage-only baseline:** **\~$10,457 / year**

| Usage Level | Storage Cost (Annual USD) | Query Processing Cost (Annual USD) | Network Egress (Annual USD, Range) | Total Annual Cost Estimate (USD, Range) |
| ----- | -----: | -----: | -----: | -----: |
| Light \+ Small | $10,457 | $120 | $60–$180 | **$10,637–$10,757** |
| Light \+ Medium | $10,457 | $120 | $600–$1,800 | **$11,177–$12,377** |
| Light \+ Large | $10,457 | $120 | $6,000–$18,000 | **$16,577–$28,577** |
| Moderate \+ Small | $10,457 | $1,200 | $60–$180 | **$11,717–$11,837** |
| Moderate \+ Medium | $10,457 | $1,200 | $600–$1,800 | **$12,257–$13,457** |
| Moderate \+ Large | $10,457 | $1,200 | $6,000–$18,000 | **$17,657–$29,657** |
| Heavy \+ Small | $10,457 | $12,000 | $60–$180 | **$22,517–$22,637** |
| Heavy \+ Medium | $10,457 | $12,000 | $600–$1,800 | **$23,057–$24,257** |
| Heavy \+ Large | $10,457 | $12,000 | $6,000–$18,000 | **$28,457–$40,457** |

---

## **When Network Egress Typically Applies (Examples)**

Egress charges commonly occur when:

* Reporting tools run **on-prem** and pull large result sets  
* Archived data is exported to files (CSV / Parquet) for downstream systems  
* Queries cross **regions or clouds**  
* Large historical datasets are downloaded by analysts or scripts

Egress is often minimal when:

* Applications and BI tools run in the **same cloud and region**  
* Queries return **aggregated metrics** instead of raw rows

---

## **Summary & Key Takeaways**

* **Archive storage is inexpensive and predictable**  
  * \~$5.9K/year (US East) or \~$10.5K/year (São Paulo) for 10 TB  
* **Query Processing Rate ($5/TB processed)** is the primary usage-based cost driver  
* **Egress costs depend entirely on architecture and data movement patterns**  
* Most teams land in **Light–Moderate query ranges** when queries are date-bounded and well-filtered  
* Broad historical scans and large exports are the main cost risk — and can be managed with design guardrails

This model provides a realistic planning baseline. With more detail on reporting frequency, query patterns, and where reporting tools run, the estimates can be further tightened.

---

## Appendix Q&A

## Does running reports against Online Archive impact the live Atlas cluster?

### Short answer
**Not in the way most people worry about.**  
Queries that read archived data are executed through **Atlas Data Federation**, not by consuming CPU, memory, or disk I/O on the Atlas cluster’s database nodes.

Reference:
- Atlas Data Federation overview: [https://www.mongodb.com/docs/atlas/data-federation/](https://www.mongodb.com/docs/atlas/data-federation/)
- Online Archive overview: [https://www.mongodb.com/docs/atlas/online-archive/](https://www.mongodb.com/docs/atlas/online-archive/)

### What happens
- Archived data lives in **Online Archive** (cloud object storage), not on the cluster’s local disks.
- Queries that touch archived data are executed by the **Data Federation query engine**, which operates outside the cluster’s data-bearing nodes.

### What *can* touch the cluster
If a query spans **both hot (live) data and archived data**:
- The **hot portion** of the query runs on the Atlas cluster (just like any normal query).
- The **archived portion** runs through Data Federation.
- Results are merged transparently before being returned.

Practical implication:
- Heavy historical reporting against Online Archive is designed to **avoid starving transactional workloads** on the live cluster.

> “Archived-data reporting runs through Data Federation, so it doesn’t burn the live cluster’s CPU the way hot data scans do.”

---

## How does data move from the live MongoDB cluster to Online Archive?

### Short answer
**You define the archive rule; Atlas moves the data automatically.**

Reference:
- Configure Online Archive: [https://www.mongodb.com/docs/atlas/online-archive/configure-online-archive/](https://www.mongodb.com/docs/atlas/online-archive/configure-online-archive/)

### How it works
1. You configure an Online Archive on a collection and define **archiving criteria** (commonly date-based, such as `createdAt` or `eventTime`).
2. Atlas continuously evaluates data in the background.
3. Documents that meet the criteria are:
   - Copied into Online Archive
   - Removed from the hot tier
4. The process is:
   - Online
   - Incremental
   - Fully managed by Atlas

Important characteristics:
- No application changes required
- No downtime
- Archiving runs continuously, not as a one-time batch
- Archived data is compressed and optimized for cost

> “You define the rule; Atlas handles the movement.”

---

## Can you run a query across both the live cluster and Online Archive?

### Yes — this is a core capability.

Reference:
- Online Archive overview: [https://www.mongodb.com/docs/atlas/online-archive/](https://www.mongodb.com/docs/atlas/online-archive/)
- Atlas Data Federation overview: [https://www.mongodb.com/docs/atlas/data-federation/](https://www.mongodb.com/docs/atlas/data-federation/)

### How it works
Online Archive is exposed as a **logical extension of your collections**. A single query can span:
- Hot data in the Atlas cluster
- Archived data in Online Archive

MongoDB automatically routes:
- Hot reads to the cluster
- Archive reads to Data Federation

### Conceptual example
```js
db.events.find({
  eventTime: { $gte: ISODate("2022-01-01") }
})
```

If recent data is hot and older data is archived:
* Recent documents are read from the cluster
* Older documents are read from Online Archive
* Results are merged transparently

### Why this matters
* No separate query language
* No ETL just to query history
* Existing reports can continue to work without modification

> “It’s one query, one namespace — MongoDB handles where the data lives.”

---

## Practical considerations
* Archived data is optimized for throughput and cost, not ultra-low-latency transactional access.
* Query Processing cost is driven by how much archived data is scanned, not by query count.
* Best practices:
  - Always filter on the archive partition key (usually a date)
  - Avoid unbounded “all-time” scans
  - Aggregate early where possible

## **Reference links**

1. **Atlas Online Archive Billing (includes $5/TB processed + 10MB minimum; notes transfer considerations)**  
   [https://www.mongodb.com/docs/atlas/billing/online-archive/](https://www.mongodb.com/docs/atlas/billing/online-archive/  )
2. **Atlas Data Federation Billing (explains “data processed” billing at $5/TB and how scanning drives cost)**  
   [https://www.mongodb.com/docs/atlas/billing/data-federation/](https://www.mongodb.com/docs/atlas/billing/data-federation/)
3. **Atlas Data Transfer Costs (transfer/egress varies by provider/region/source/destination; invoices are source of truth)**  
   [https://www.mongodb.com/docs/atlas/billing/data-transfer-costs/](https://www.mongodb.com/docs/atlas/billing/data-transfer-costs/)
4. **Online Archive Overview (what Online Archive is and how it works conceptually)**  
   [https://www.mongodb.com/docs/atlas/online-archive/overview/](https://www.mongodb.com/docs/atlas/online-archive/overview/)
5. **MongoDB Pricing Page (entry point for Online Archive pricing tables by region)**  
   [https://www.mongodb.com/pricing](https://www.mongodb.com/pricing)
6. **Atlas Data Federation (overview of the feature underpinning archive querying)**  
   [https://www.mongodb.com/docs/atlas/data-federation/](https://www.mongodb.com/docs/atlas/data-federation/)
