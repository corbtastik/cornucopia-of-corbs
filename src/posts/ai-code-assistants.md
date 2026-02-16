---
title: "AI Code Assistants"
date: 2026-02-16
tags: ["ai", "genai", "copilot", "mongodb", "software-engineering", "mit"]
description: "Reshaping Skills, Reducing Toil, and the Risks We're Not Ready For"
---

## Recurring Themes

- **The skill shift is from writing code to evaluating code.** As AI handles more of the routine output, the developer's value moves upstream into design, architecture, and critical review. We're becoming orchestrators rather than typists, and that demands deeper conceptual knowledge, not less.

- **Productivity gains don't always mean less work, it often means higher expectations.** Studies show AI can speed up coding tasks by 35-55%, but the real question is what happens with that reclaimed time. Organizations tend to expect more output rather than fewer hours.

- **AI mistakes are differently distributed than human mistakes, and that's the real danger.** AI-generated bugs are confident, plausible, and harder to catch. In safety-critical domains this isn't just an inconvenience, it's potentially catastrophic. Over-reliance without verification is the core risk.

---

## How will AI assistants reshape the skills developers need?

The core shift is from writing code to evaluating code. Developers will need stronger skills in system design, architecture, and critical review rather than syntax memorization. The ability to precisely articulate intent through prompts becomes essential. Debugging and understanding AI-generated code requires deeper conceptual knowledge, not less. Developers who thrive will be those who can orchestrate AI tools while maintaining a strong mental model of what correct, secure, and performant code looks like.

This isn't just speculation, it's already showing up in data. Gartner predicts that by 2027, [80% of the engineering workforce will need to upskill](https://www.gartner.com/en/newsroom/press-releases/2024-10-03-gartner-says-generative-ai-will-require-80-percent-of-engineering-workforce-to-upskill-through-2027) to keep pace with generative AI, with a new "AI engineer" role emerging that blends software engineering, data science, and ML skills. The [2025 Stack Overflow Developer Survey](https://survey.stackoverflow.co/2025/ai/) backs this up — 84% of developers are now using or planning to use AI tools, yet trust in AI accuracy has actually *fallen*, with only 29% saying they somewhat trust AI output. That gap between adoption and trust tells us where the new skill requirement lives: not in writing code, but in knowing when AI-generated code is wrong.

Meanwhile, the [Microsoft Research study on Copilot](https://arxiv.org/abs/2302.06590) (Peng et al., 2023) found that developers completed tasks 55.8% faster with AI assistance, but the gains were largest for less experienced developers. This suggests AI is compressing the skill floor while raising the ceiling for those who can critically evaluate what it produces.

---

## Could AI assistants reduce manual coding by up to 40%?

40% is plausible for boilerplate-heavy work, for example CRUD operations, configuration, standard patterns. For novel algorithm design, complex debugging, or system architecture, the reduction is much smaller. The more interesting question is what developers do with reclaimed time. Ideally, they focus on design, testing, and user experience. Realistically, organizations may simply expect more output. The reduction isn't uniform across domains: web development sees massive gains, while embedded systems or cryptography see far less.

The data supports the 40% figure, at least for certain task categories. [McKinsey's study](https://www.mckinsey.com/capabilities/tech-and-ai/our-insights/unleashing-developer-productivity-with-generative-ai) of 40 developers found a 35-45% reduction in task completion time for code generation and 45-50% for documentation. GitHub CEO Thomas Dohmke has stated that [Copilot now writes an average of 46% of code](https://www.freethink.com/robots-ai/github-copilot) in files where it's enabled, reaching 61% for Java. A [larger field study](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4945566) across Microsoft, Accenture, and a Fortune 100 company (Cui, Demirer et al., 2024) found a 26% increase in completed pull requests, with junior developers seeing 21-40% output improvements.

Where I've seen this firsthand is with database query languages like MongoDB's MQL. Writing aggregation pipelines, lookup stages, and filter expressions is exactly the kind of structured, pattern-heavy work where AI shines. In my own projects, I built an [MCP](http://en.wikipedia.org/wiki/Model_Context_Protocol) app that takes natural language and converts it directly into MongoDB MQL statements. For example, a user can type:

> "Show me total revenue by plan type, joining billing with customers and plans"

And the AI generates the corresponding aggregation pipeline:

```json
[
  {
    "$lookup": {
      "from": "customers",
      "localField": "customerId",
      "foreignField": "_id",
      "as": "customer"
    }
  },
  { "$unwind": "$customer" },
  {
    "$lookup": {
      "from": "plans",
      "localField": "customer.planId",
      "foreignField": "_id",
      "as": "plan"
    }
  },
  { "$unwind": "$plan" },
  {
    "$group": {
      "_id": "$plan.type",
      "totalRevenue": { "$sum": "$amount" }
    }
  },
  { "$sort": { "totalRevenue": -1 } }
]
```

That pipeline would take a developer several minutes to write by hand, perhaps longer, referencing docs, getting the `$lookup` syntax right, remembering to `$unwind` after each join. With AI, it's seconds. This is the kind of toil reduction that actually hits the 40% mark or higher. The developer's job shifts from remembering MQL syntax to validating that the pipeline logic is correct and the joins make sense for the data model. That's a meaningful reduction in manual coding, but it still requires someone who understands what the query *should* do.

---

## How do AI coding mistakes affect safety-critical systems?

AI-generated code in medical devices, avionics, or financial systems could be catastrophic if errors slip through. The problem isn't that AI makes more mistakes than humans, it's that AI mistakes are *differently distributed* and harder to anticipate. A human developer rarely hallucinates a plausible-looking but functionally wrong algorithm. Safety-critical domains need formal verification, extensive testing, and regulatory frameworks that account for AI-assisted development. The current regulatory landscape is not prepared for this shift.

There's also the emerging threat of package hallucination. A [study headed to USENIX Security 2025](https://arxiv.org/abs/2406.10279) found that across 2.23 million code samples from 16 LLMs, nearly 20% referenced hallucinated (nonexistent) packages, and 58% of those hallucinated names repeated across queries, making them exploitable via supply chain attacks. In a medical or aviation context, a hallucinated dependency that gets "[slopsquatted](https://en.wikipedia.org/wiki/Slopsquatting)" by a malicious actor isn't a theoretical risk, it's an attack vector.

## Conclusion

AI code assistants are fundamentally changing what it means to be a developer. The skill set is shifting from writing code to evaluating it, productivity is increasing but so are expectations, and the mistakes AI introduces are subtle enough to be genuinely dangerous in the wrong context.

These three threads point to the same conclusion:

> AI isn't replacing developers, it's raising the bar for what developers need to know.

AI tools eliminate toil, but they don't eliminate the need for judgment. As these assistants become standard across industry, developers who succeed won't be ones who write the most code, they'll be ones who understand it well enough to know when AI got it wrong.
