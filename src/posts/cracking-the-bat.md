---
title: "Cracking the Bat"
date: 2025-12-25 10:00:00
tags: ["baseball", "analytics", "math", "dev"]
description: "A guide to understanding and calculating essential baseball batting statistics using custom CSS formulas."
---

Whether you are looking at a Hall of Famer's plaque or a modern analytical dashboard, baseball statistics can look like alphabet soup. To build a better understanding of the game, let's break down the definitions and formulas behind the most common batting stats.

## The Standard Stats

These are the "counting" stats and basic averages you will find in almost any box score.

### 1. WAR (Wins Above Replacement)
**Definition:** An aggregate metric that summarizes a player's total contributions to their team. It represents how many more wins a player provides compared to a "replacement-level" player.
* **Computation:** Extremely complex; it involves weighted components for hitting, fielding, and baserunning.

### 2. AB (At Bats)
**Definition:** A subset of Plate Appearances. It excludes walks, hit-by-pitches, sacrifices, and catcher's interference.

### 3. H (Hits)
**Definition:** When a batter reaches first base safely after hitting a ball into fair territory without an error or fielder's choice.

### 4. AVG (Batting Average)
**Definition:** The most traditional measure of a hitter's ability to get a hit.
<div class="formula">
  <span class="formula-label">AVG =</span>
  <div class="fraction">
    <span class="numerator"><var>H</var></span>
    <span class="denominator"><var>AB</var></span>
  </div>
</div>

---

## The Efficiency Stats

These metrics tell us more about the *quality* and *value* of the player's time at the plate.

### 5. OBP (On-Base Percentage)
**Definition:** Measures how frequently a batter avoids making an out. Unlike Batting Average, this rewards players for drawing walks.
<div class="formula">
  <span class="formula-label">OBP =</span>
  <div class="fraction">
    <span class="numerator"><var>H</var> + <var>BB</var> + <var>HBP</var></span>
    <span class="denominator"><var>AB</var> + <var>BB</var> + <var>HBP</var> + <var>SF</var></span>
  </div>
</div>

### 6. SLG (Slugging Percentage)
**Definition:** Measures the power of a hitter by weighing hits based on the number of bases reached.
<div class="formula">
  <span class="formula-label">SLG =</span>
  <div class="fraction">
    <span class="numerator">1B + (2 &times; 2B) + (3 &times; 3B) + (4 &times; HR)</span>
    <span class="denominator"><var>AB</var></span>
  </div>
</div>

### 7. OPS (On-Base Plus Slugging)
**Definition:** A combined metric of a player's ability to get on base and hit for power.
<div class="formula">
  <span class="formula-label">OPS =</span>
  <var>OBP</var> &nbsp;+&nbsp; <var>SLG</var>
</div>

### 8. OPS+ (Adjusted OPS)
**Definition:** Takes OPS and normalizes it across the league, accounting for external factors like "Park Effects." An OPS+ of **100** is exactly league average.