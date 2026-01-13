---
title: "Atlas Online Archive: Cost & Usage"
date: 2026-01-12
tags: ["atlas", "mongodb", "online-archive"]
description: "MongoDB Atlas Online Archive — Cost Estimate & Usage Modeling"
---

## **Introduction**

This document provides a practical, experience-based overview of [**MongoDB Atlas Online Archive**](https://www.mongodb.com/docs/atlas/online-archive/) and a set of **cost estimates** for archiving approximately **10 TB of data**.

The goal is to:

* Explain how Online Archive pricing works in plain terms  
* Provide **storage, query, and egress estimates** for two regions  
* Show how costs change under **Light / Moderate / Heavy** usage patterns  
* Call out where costs are predictable vs. usage-driven  
* Highlight scenarios where [**network egress**](https://www.mongodb.com/docs/atlas/billing/data-transfer-costs/) may apply

> All numbers below are estimates intended for planning and comparison purposes. Final costs depend on actual usage patterns.

---

## **What is MongoDB Atlas Online Archive?**

Atlas Online Archive allows you to transparently move infrequently accessed (“cold”) data from your primary Atlas cluster into low-cost cloud object storage, while still keeping the data **queryable using standard MongoDB queries**. See: [**Online Archive Overview**](https://www.mongodb.com/docs/atlas/online-archive/overview/).

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

Online Archive pricing has **four main components** (details: [**Online Archive Billing**](https://www.mongodb.com/docs/atlas/billing/online-archive/)):

### **1\. Archive Storage (GB-days)**

* Charged based on **how much data is stored** and **how long**  
* Billed as **$/GB-day**, varies by region  
* This is the **most predictable** cost

### **2\. Query Processing Rate**

**Query Processing Rate** is the cost charged when queries run against archived data (implemented via [**Atlas Data Federation**](https://www.mongodb.com/docs/atlas/data-federation/); cost model described in [**Data Federation Billing**](https://www.mongodb.com/docs/atlas/billing/data-federation/)).

**Definition (plain English):**  
You are billed based on **how much archived data MongoDB has to read/scan** to answer a query — **not** how much data is returned.

* **Rate:** $5 per TB processed (see [**Online Archive Billing**](https://www.mongodb.com/docs/atlas/billing/online-archive/) and [**Data Federation Billing**](https://www.mongodb.com/docs/atlas/billing/data-federation/))  
* **Minimum:** 10 MB processed per query (see [**Online Archive Billing**](https://www.mongodb.com/docs/atlas/billing/online-archive/))  
* Applies whenever archived data is queried (filters, aggregations, reports)

**Example:**

* Query scans 200 GB of archived data → 0.2 TB × $5 \= **$1**  
* Query scans 10 TB of archived data → **$50**

> **Key control lever:**  
> Well-filtered, date-bounded queries keep this cost very low. Broad historical scans increase it linearly.

### **3\. Archival Access Charges**

* Small per-GB charge based on **how much archived data is accessed/returned** (see [**Online Archive Billing**](https://www.mongodb.com/docs/atlas/billing/online-archive/))  
* Typically negligible unless very large volumes are returned regularly

### **4\. Network Egress (Cloud Provider Charge)**

> **Note**: Network egress is **not a MongoDB charge**.  
> It is charged by the underlying cloud provider when data **leaves the Atlas cloud boundary**. See: [**Atlas Data Transfer Costs**](https://www.mongodb.com/docs/atlas/billing/data-transfer-costs/).

Egress generally applies when:

* Data is returned to **on-prem systems**  
* Data is exported to files (CSV, Parquet, etc.)  
* Queries cross regions or clouds  
* Large result sets are downloaded externally

If reporting tools run **in the same cloud and region**, egress is often minimal or near zero.

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
* Archival Access tiers (GB accessed per month):  
  * **Small:** 100 GB  
  * **Medium:** 1 TB  
  * **Large:** 10 TB  
* Egress modeled as annual **ranges** due to cloud/provider variability (see [**Atlas Data Transfer Costs**](https://www.mongodb.com/docs/atlas/billing/data-transfer-costs/))

---

## **How to read the annual cost tables**

All columns in the tables are **annual USD cost estimates** for a **10 TB Online Archive** deployment, with usage modeled at different levels. The tables show costs broken into:

1. **Storage Cost (Annual USD)**  
2. **Query Processing Cost (Annual USD)**  
3. **Archival Access Cost (Annual USD)**  
4. **Network Egress (Annual USD, Range)** *(provider-dependent, so shown as a range)*  
5. **Total Annual Cost Estimate (USD, Range)**

### **Universal assumptions used in calculations**

* **Archive size:** 10 TB \= **10,240 GB**  
* **Annualization:** **365 days/year** and **12 months/year**  
* Costs shown are **estimates** for planning; actual invoices vary by usage, provider, destination, and transfer patterns (see [**Online Archive Billing**](https://www.mongodb.com/docs/atlas/billing/online-archive/) and [**Atlas Data Transfer Costs**](https://www.mongodb.com/docs/atlas/billing/data-transfer-costs/)).

---

## **Storage Cost (Annual USD)**

### **What the number represents**

**Annual cost to store 10TB in Online Archive** (regardless of queries).

### **Unit in table header**

**Storage Cost (Annual USD)**

### **How it’s calculated**

Online Archive storage is billed on **GB-days** (see [**Online Archive Billing**](https://www.mongodb.com/docs/atlas/billing/online-archive/)):

**Storage Cost (Annual) \= (Archive GB) × (Rate $/GB-day) × (365)**

### **Example calculation (10TB, US East / N. Virginia)**

* Archive GB \= 10,240  
* Rate \= 0.001578 $/GB-day  
* Annual cost \= 10,240 × 0.001578 × 365 ≈ **$5,898/year**

*(São Paulo uses a different $/GB-day rate, so the same formula yields a higher annual storage cost.)*

---

## **Query Processing Cost (Annual USD)**

### **What the number represents**

**Annual MongoDB charge for processing archived data during queries.**  
This is **not the number of queries**. It’s the **annual $ cost** derived from how much archived data is scanned/processed (see [**Online Archive Billing**](https://www.mongodb.com/docs/atlas/billing/online-archive/) and [**Data Federation Billing**](https://www.mongodb.com/docs/atlas/billing/data-federation/)).

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

* Whether queries are **bounded by the archive partition key** (often a date; see [**Online Archive Overview**](https://www.mongodb.com/docs/atlas/online-archive/overview/))  
* Whether reports do broad “all-time” scans vs narrow time windows  
* Partitioning strategy and query patterns (tight filters reduce scanning)

---

## **Archival Access Cost (Annual USD)**

### **What the number represents**

A small additional charge based on **how much archived data is accessed/returned** (modeled as **GB accessed per month**; see [**Online Archive Billing**](https://www.mongodb.com/docs/atlas/billing/online-archive/)).

### **Unit in table header**

**Archival Access Cost (Annual USD)**

### **How it’s calculated**

**Archival Access Cost (Annual) \= (GB accessed/month) × 12 × (Rate $/GB)**

### **Access levels used in the tables**

* **Small:** 100 GB/month accessed/returned  
* **Medium:** 1 TB/month \= 1,024 GB/month  
* **Large:** 10 TB/month \= 10,240 GB/month

### **Example calculations (US East, $0.0009/GB)**

* Small: 100 × 12 × 0.0009 \= **$1.08/year**  
* Medium: 1,024 × 12 × 0.0009 \= **$11.06/year**  
* Large: 10,240 × 12 × 0.0009 \= **$110.59/year**

*(São Paulo uses a different $/GB rate, so the same formula yields slightly different values.)*

> Practical note: Archival Access is typically small compared to Storage and Query Processing unless very large amounts are returned regularly.

---

## **Network Egress (Annual USD, Range)**

### **What the number represents**

**Cloud provider network charge** for data transferred **out of** the Atlas environment. This is **not a MongoDB fee**. It depends on:

* Cloud provider (AWS/Azure/GCP)  
* Region  
* Destination (same-region vs cross-region vs internet/on-prem)  
* Transfer method and networking setup (peering/private endpoints vs public internet)

See: [**Atlas Data Transfer Costs**](https://www.mongodb.com/docs/atlas/billing/data-transfer-costs/).

### **Unit in table header**

**Network Egress (Annual USD, Range)**

### **Why it’s a range**

Without knowing the cloud provider \+ destination architecture, egress can’t be a single reliable number. The tables provide **small/medium/large annual ranges** as planning placeholders.

### **Egress levels used in the tables (illustrative)**

* **Small:** 100 GB/month exported/returned externally  
* **Medium:** 1 TB/month exported/returned externally  
* **Large:** 10 TB/month exported/returned externally

### **Annual egress ranges used in the tables (illustrative)**

* **Small:** **$60–$180/year**  
* **Medium:** **$600–$1,800/year**  
* **Large:** **$6,000–$18,000/year**

> Important: If reporting and apps run **in the same cloud and region** (with private networking), egress may be **minimal**. Egress risk rises when data is routinely pulled to on-prem or exported in bulk.

### **Practical examples of when egress occurs**

1. **On-prem BI** (Tableau/Power BI server on-prem) querying Atlas and pulling large result sets → cloud-to-on-prem transfer.  
2. **Bulk exports** (monthly CSV/Parquet extracts from archived data) downloaded to laptops or internal file shares.  
3. **Cross-region reporting** (Atlas in US East; reporting app in São Paulo or Europe) → inter-region egress.  
4. **Downstream data lake pipelines** pulling archive results into another platform/account/region.

---

## **Annual Cost Estimates — US East (N. Virginia)**

**Storage rate:** $0.001578 per GB-day  
**Storage-only baseline:** **\~$5,898 / year**

| Usage Level | Storage Cost (Annual USD) | Query Processing Cost (Annual USD) | Archival Access Cost (Annual USD) | Network Egress (Annual USD, Range) | Total Annual Cost Estimate (USD, Range) |
| ----- | ----- | ----- | ----- | ----- | ----- |
| Light \+ Small | $5,898 | $120 | $1 | $60–$180 | **$6,079–$6,199** |
| Light \+ Medium | $5,898 | $120 | $11 | $600–$1,800 | **$6,629–$7,829** |
| Light \+ Large | $5,898 | $120 | $111 | $6,000–$18,000 | **$12,129–$24,129** |
| Moderate \+ Small | $5,898 | $1,200 | $1 | $60–$180 | **$7,159–$7,279** |
| Moderate \+ Medium | $5,898 | $1,200 | $11 | $600–$1,800 | **$7,709–$8,909** |
| Moderate \+ Large | $5,898 | $1,200 | $111 | $6,000–$18,000 | **$13,209–$25,209** |
| Heavy \+ Small | $5,898 | $12,000 | $1 | $60–$180 | **$17,959–$18,079** |
| Heavy \+ Medium | $5,898 | $12,000 | $11 | $600–$1,800 | **$18,509–$19,709** |
| Heavy \+ Large | $5,898 | $12,000 | $111 | $6,000–$18,000 | **$24,009–$36,009** |

---

## **Annual Cost Estimates — South America (São Paulo)**

**Storage rate:** $0.002798 per GB-day  
**Storage-only baseline:** **\~$10,457 / year**

| Usage Level | Storage Cost (Annual USD) | Query Processing Cost (Annual USD) | Archival Access Cost (Annual USD) | Network Egress (Annual USD, Range) | Total Annual Cost Estimate (USD, Range) |
| ----- | ----- | ----- | ----- | ----- | ----- |
| Light \+ Small | $10,457 | $120 | $2 | $60–$180 | **$10,639–$10,759** |
| Light \+ Medium | $10,457 | $120 | $17 | $600–$1,800 | **$11,194–$12,394** |
| Light \+ Large | $10,457 | $120 | $172 | $6,000–$18,000 | **$16,749–$28,749** |
| Moderate \+ Small | $10,457 | $1,200 | $2 | $60–$180 | **$11,719–$11,839** |
| Moderate \+ Medium | $10,457 | $1,200 | $17 | $600–$1,800 | **$12,274–$13,474** |
| Moderate \+ Large | $10,457 | $1,200 | $172 | $6,000–$18,000 | **$17,829–$29,829** |
| Heavy \+ Small | $10,457 | $12,000 | $2 | $60–$180 | **$22,519–$22,639** |
| Heavy \+ Medium | $10,457 | $12,000 | $17 | $600–$1,800 | **$23,074–$24,274** |
| Heavy \+ Large | $10,457 | $12,000 | $172 | $6,000–$18,000 | **$28,629–$40,629** |

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
* **Archival Access charges are typically very small**  
* **Egress costs depend entirely on architecture and data movement patterns**  
* Most teams land in **Light–Moderate query ranges** when queries are date-bounded and well-filtered  
* Broad historical scans and large exports are the main cost risk — and can be managed with design guardrails

This model provides a realistic planning baseline. With more detail on reporting frequency, query patterns, and where reporting tools run, the estimates can be further tightened.