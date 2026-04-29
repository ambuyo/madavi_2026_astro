# 10-Section Service Template — Quick Start

## 📋 What You Have

A complete 10-section service page template with:
- **Full Sanity CMS schema** — All fields organized in Sanity Studio
- **TypeScript types** — Full IDE autocomplete and type safety  
- **GROQ queries** — Optimized queries to fetch all sections
- **Astro schema** — Markdown support for content collections
- **Example service** — Fully filled-out example you can copy
- **Complete docs** — Reference guide for all sections

---

## 🚀 Get Started in 3 Steps

### Step 1: Read the Template

Open and review the example service:
```
apps/web/src/content/services/strategic-transformation-example.md
```

This shows all 10 sections filled out with real content. Use it as your template.

### Step 2: Choose Your Method

#### **Option A: Create in Sanity CMS** (Recommended for rich content)
1. Open your Sanity Studio
2. Navigate to **Services**
3. Click **Create** → **Service**
4. Fill in each numbered section (1-10)
5. Publish

#### **Option B: Create in Markdown** (Great for version control)
1. Create file: `apps/web/src/content/services/your-service.md`
2. Copy the frontmatter from the example
3. Replace content with your service details
4. Save and commit

### Step 3: Start Writing

Pick a service you want to create and start filling out the template:
1. **Section 1 (Hero)** — Hook them in 20 seconds
2. **Section 2 (Problem)** — Show you understand their pain
3. **Section 3 (How It Works)** — Explain your process
4. **Section 4 (What You Get)** — List deliverables
5. **Section 5 (Frameworks)** — Show your methodology
6. **Section 6 (Case Study)** — Prove it works
7. **Section 7 (Pricing)** — Be transparent
8. **Section 8 (Who This Is For)** — Filter prospects
9. **Section 9 (FAQ)** — Address objections
10. **Section 10 (Conversion)** — Final call-to-action

---

## 📚 The 10 Sections Explained

| Section | Purpose | Key Content |
|---------|---------|------------|
| **1. Hero** | Grab attention above the fold | Subtitle, description, CTAs |
| **2. Problem** | Show you understand their pain | Problems, challenges, pain points |
| **3. How It Works** | Explain your process | Steps, timeline, methodology |
| **4. What You Get** | Show tangible deliverables | Specific outputs, materials, support |
| **5. Frameworks** | Build credibility | Methodologies, frameworks, benefits |
| **6. Case Study** | Prove success | Real client example with metrics |
| **7. Pricing** | Set expectations | Costs, terms, what's included/excluded |
| **8. Who This Is For** | Attract right fit | Ideal client, fit criteria, profile |
| **9. FAQ** | Address objections | Common questions and answers |
| **10. Conversion** | Drive action | CTA, trust signals, next steps |

---

## 💡 Writing Tips

### Hero Section
```
✅ Good: "Transform Your Strategy to Accelerate Growth"
❌ Bad: "Strategic Consulting Services"

Focus on the outcome, not the feature.
```

### Problem Section
```
✅ Good: "Unclear strategic direction. Leadership misaligned on priorities. 
         Competing initiatives stretch limited resources."
❌ Bad: "We solve business problems."

Be specific. Show you understand their exact situation.
```

### Case Study
```
✅ Good: "Revenue grew 280% in Year 1. Customer acquisition costs down 35%."
❌ Bad: "They saw great results."

Use numbers. Make it memorable.
```

### FAQ
```
✅ Good: Address their actual objections
         - "How much time will this take?"
         - "What if we can't implement everything?"
         - "How is this different from other consultants?"
❌ Bad: Generic company questions
```

### Conversion
```
✅ Good: "Schedule a 30-minute strategy session"
❌ Bad: "Contact us"

Be specific about what happens next.
```

---

## 🔧 Developer Integration

### Fetching Services in Astro

```astro
---
import { getServiceBySlug } from '@/lib/data';

const service = await getServiceBySlug('strategic-consulting');
---

<div>
  <h1>{service.data.title}</h1>
  
  {/* Hero Section */}
  <section>
    <h2>{service.data.hero?.subtitle}</h2>
    <p>{service.data.hero?.description}</p>
  </section>
  
  {/* Problem Section */}
  <section>
    <h2>{service.data.problemContext?.title}</h2>
    <ul>
      {service.data.problemContext?.painPoints?.map(point => (
        <li>{point}</li>
      ))}
    </ul>
  </section>
  
  {/* Continue for all 10 sections... */}
</div>
```

### Full Type Safety

```typescript
// TypeScript knows all fields exist
const title = service.data.hero?.subtitle;      // ✅ OK
const price = service.data.pricingSection?.startingPrice;  // ✅ OK
const unknown = service.data.unknownField;      // ❌ Error!
```

---

## 📊 Optimization Checklist

Before publishing your service page:

- [ ] **Hero** — Is your value proposition clear in 20 seconds?
- [ ] **Problem** — Did you articulate their exact pain points?
- [ ] **Process** — Is your methodology easy to understand?
- [ ] **Deliverables** — Are they specific and valuable?
- [ ] **Frameworks** — Do you explain why these matter?
- [ ] **Case Study** — Are results quantified and credible?
- [ ] **Pricing** — Is it transparent and justified?
- [ ] **Profile** — Is your ideal customer clear?
- [ ] **FAQ** — Did you address common objections?
- [ ] **CTA** — Is next step obvious and easy?

---

## 📖 Documentation

- **[SERVICE-TEMPLATE-GUIDE.md](./SERVICE-TEMPLATE-GUIDE.md)** — Complete reference guide
- **[IMPLEMENTATION-SUMMARY.md](./IMPLEMENTATION-SUMMARY.md)** — Technical changes made
- **[strategic-transformation-example.md](./apps/web/src/content/services/strategic-transformation-example.md)** — Full working example

---

## 🎯 Common Patterns

### Pattern 1: Multi-Step Process

Use **How It Works** section:
```
Step 1: Discovery (Weeks 1-2)
Step 2: Analysis (Weeks 3-5)
Step 3: Implementation (Weeks 6-10)
```

### Pattern 2: Showcase Expertise

Use **Frameworks** section:
```
Framework 1: [Name] → [How applied] → [Benefits]
Framework 2: [Name] → [How applied] → [Benefits]
Framework 3: [Name] → [How applied] → [Benefits]
```

### Pattern 3: Transparent Pricing

Use **Pricing** section:
```
Starting at: $X,000
What's Included:
  • Deliverable 1
  • Deliverable 2
  • Support
```

### Pattern 4: Ideal Customer Profile

Use **Who This Is For**:
```
Best for:
  - Company size: 50-500 employees
  - Revenue: $10M-$100M
  - Industries: Tech, Financial Services, Healthcare
  - Pain point: Need clear growth strategy
```

---

## ⚡ Next Steps

1. **Read the example** → [strategic-transformation-example.md](./apps/web/src/content/services/strategic-transformation-example.md)
2. **Pick your service** → Which service should you create first?
3. **Use the template** → Copy the structure from the example
4. **Fill each section** → Write compelling content for each
5. **Publish** → Make it live in Sanity or commit to git
6. **Test & iterate** → Track metrics and improve

---

## ❓ Questions?

- **How do I structure sections?** → See [strategic-transformation-example.md](./apps/web/src/content/services/strategic-transformation-example.md)
- **What fields are available?** → See [SERVICE-TEMPLATE-GUIDE.md](./SERVICE-TEMPLATE-GUIDE.md)  
- **How do I integrate with Astro?** → See implementation examples above
- **What changed in the code?** → See [IMPLEMENTATION-SUMMARY.md](./IMPLEMENTATION-SUMMARY.md)

---

## 🎨 Your Next 30 Minutes

**[Read Example] (5 min)** → **[Create Service] (20 min)** → **[Publish] (5 min)**

That's it. You can have a professional, conversion-optimized service page live in 30 minutes.

---

**Ready to create your first service page?** Start with the example and adapt it to your service. 🚀
