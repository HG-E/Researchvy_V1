-- ──────────────────────────────────────────────────────────────────────────────
-- 015_seed_level1_modules4to7.sql
-- Seeds Level 1 modules 4–7 (21 lessons).
-- Requires 014_seed_level1_course.sql to have run first.
-- IDEMPOTENT: safe to re-run.
-- ──────────────────────────────────────────────────────────────────────────────

DO $$
DECLARE
  v_course UUID;
  v_m4 UUID;
  v_m5 UUID;
  v_m6 UUID;
  v_m7 UUID;
BEGIN

SELECT id INTO v_course FROM courses WHERE slug = 'research-identity';
IF v_course IS NULL THEN
  RAISE EXCEPTION 'Course research-identity not found. Run 014_seed_level1_course.sql first.';
END IF;

-- ════════════════════════════════════════════════════════════════════════════
-- MODULE 4 — ORCID
-- ════════════════════════════════════════════════════════════════════════════
IF NOT EXISTS (SELECT 1 FROM modules WHERE course_id = v_course AND position = 4) THEN
  INSERT INTO modules (course_id, title, description, position) VALUES (
    v_course,
    'ORCID — The 30-Minute Setup That Connects Your Research Identity Everywhere, Forever',
    'Create and configure your ORCID iD, link it to every major platform, and add it to your CV, email signature, and grant applications.',
    4
  );
END IF;
SELECT id INTO v_m4 FROM modules WHERE course_id = v_course AND position = 4;

-- M4 · L1 — FREE PREVIEW
INSERT INTO lessons (module_id, title, slug, lesson_type, content_md, position, is_free_preview, is_published)
VALUES (v_m4,
  'What ORCID Is, Why It Exists, and Why Not Having One Is a Career Risk',
  'what-orcid-is-career-risk',
  'article',
$lc$
## Lesson Aim
Understand the problem ORCID was built to solve, why funders are making it mandatory, and why not having one is increasingly a career liability.

## Learning Outcomes
By the end of this lesson, you will be able to:
- Explain the researcher attribution problem that led to ORCID being created
- Name the major funders requiring ORCID for grant applications
- Describe how ORCID functions differently from Scopus and Google Scholar

---

## The Problem ORCID Solves

Academic publishing has an identity problem. A researcher named "A. Johnson" may be any of hundreds of researchers globally. When she changes her name, moves institutions, or publishes across disciplines, databases lose track of her. Papers get misattributed. Citation counts fragment. Career records become unreliable.

ORCID (Open Researcher and Contributor ID) solves this with a simple idea: give every researcher a **permanent, unique 16-digit identifier** — like a passport number for your research identity.

That identifier — your ORCID iD — does not change when you change your name, your institution, your country, or your discipline. It follows you, and everything published under it follows you.

## Why Funders Are Making It Mandatory

As of 2025, the following major funding bodies require or strongly recommend ORCID iDs in grant applications:

- **NIH** (USA) — required in biosketches for all applications
- **NSF** (USA) — required for principal investigators
- **Wellcome Trust** (UK/Global) — required at submission
- **EU Horizon Europe** — required for all named researchers
- **TETFUND** (Nigeria) — increasingly expected in competitive grants
- **NRF** (South Africa) — required in researcher profiles

This list grows every year. Researchers without an ORCID iD are increasingly filtered out at submission, not during review.

## ORCID vs Scopus vs Google Scholar

| Platform | What it is | Who controls it |
|---|---|---|
| ORCID | Your identity layer — a permanent ID | You |
| Scopus | A database of indexed papers | Elsevier |
| Google Scholar | A search engine for academic work | Google |

The key distinction: Scopus and Google Scholar are databases controlled by corporations. ORCID is your identifier — controlled by you, portable everywhere.

---

## Your Action Step
Search orcid.org to check whether an ORCID record already exists in your name. (Some institutions register iDs on behalf of their researchers.) If one exists, note the iD. If not, you will create it in the next lesson.

## Key Takeaway
ORCID is the one piece of scholarly infrastructure you fully own. Every other platform is a database that may change its policies. Your ORCID iD is yours permanently.
$lc$,
  1, TRUE, TRUE
) ON CONFLICT (module_id, slug) DO NOTHING;

-- M4 · L2
INSERT INTO lessons (module_id, title, slug, lesson_type, content_md, position, is_free_preview, is_published)
VALUES (v_m4,
  'Your ORCID Setup — 30 Minutes That Connect Everything',
  'orcid-setup-30-minutes',
  'article',
$lc$
## Lesson Aim
Create and configure a complete, correctly set-up ORCID profile with the right visibility settings and a full publication import.

## Learning Outcomes
By the end of this lesson, you will be able to:
- Create an ORCID account with optimal visibility settings
- Import your publication list from Scopus, CrossRef, and Google Scholar in a single process
- Understand the difference between public, trusted parties, and private visibility settings

---

## Step 1: Create Your ORCID Account

1. Go to **orcid.org/register**
2. Use your institutional email address if possible (it creates a verifiable link to your institution)
3. Enter your name exactly as it appears in your publications
4. Choose a strong password

**Important:** Do not create a second ORCID if one already exists for you. ORCID allows only one iD per person. If a duplicate exists, use ORCID's duplicate account process.

## Step 2: Set Visibility Correctly

ORCID has three visibility levels:
- **Everyone (public)** — visible to anyone, including search engines
- **Trusted parties** — visible to platforms you have authorised (Scopus, CrossRef, etc.)
- **Only me (private)** — visible only to you

**Recommended defaults:**
- Name, keywords, biography → **Everyone**
- Works (publications) → **Everyone**
- Employment and education → **Everyone**
- Funding → **Everyone**
- Personal email → **Only me**

A public ORCID profile that cannot be found by search engines defeats the purpose of having one.

## Step 3: Import Your Publications

The fastest way to populate your works list:

1. In your ORCID profile, click *Works → Add Works → Search and link*
2. Authorise **Scopus - Elsevier** — this imports all papers Scopus has attributed to you
3. Authorise **CrossRef Metadata Search** — this catches papers with DOIs not yet in Scopus
4. Review all suggested works and confirm only those that are genuinely yours

After import, check the total count against your known publication list and manually add anything missing using *Add Works → Add manually*.

---

## Your Action Step
Create your ORCID account or claim an existing one, set your visibility to public, and run the Scopus + CrossRef import. Complete this before proceeding to Lesson 3.

## Key Takeaway
Your ORCID setup is a 30-minute investment that pays compound returns for the rest of your career. Do it once, do it correctly, and every platform you connect to it benefits permanently.
$lc$,
  2, FALSE, TRUE
) ON CONFLICT (module_id, slug) DO NOTHING;

-- M4 · L3
INSERT INTO lessons (module_id, title, slug, lesson_type, content_md, position, is_free_preview, is_published)
VALUES (v_m4,
  'Connecting ORCID to Scopus, Web of Science, and Your Institution',
  'connecting-orcid-scopus-wos',
  'article',
$lc$
## Lesson Aim
Link your ORCID iD to Scopus, Web of Science, and your institutional systems to create a synchronised, self-updating research identity.

## Learning Outcomes
By the end of this lesson, you will be able to:
- Link your ORCID to your Scopus Author Profile for bidirectional sync
- Connect ORCID to your Web of Science ResearcherID
- Submit your ORCID to your institutional repository or HR system

---

## Linking ORCID to Scopus

1. Log in to your **Scopus Author Profile**
2. Click *Edit profile* → look for the ORCID section
3. Click *Connect to ORCID* — you will be redirected to ORCID to authorise the connection
4. Authorise Scopus as a trusted party

Once connected, Scopus and ORCID sync automatically. New papers indexed in Scopus appear in your ORCID works list. Your ORCID iD appears on your Scopus profile — visible to anyone viewing it.

## Connecting to Web of Science (ResearcherID)

Web of Science uses a separate identifier called **ResearcherID** (now integrated into the Publons platform). To link it to ORCID:

1. Go to **webofscience.com** and sign in (or create a free account)
2. In your profile, find *ResearcherID* and click *Connect to ORCID*
3. Authorise the connection

This links your WoS citation data to your ORCID, making both more complete.

## Connecting to Your Institution

Many universities and research institutions maintain staff research profiles that can be linked to ORCID. The process varies by institution, but typically:

1. Log in to your institutional staff/researcher portal
2. Look for *Research profile*, *ORCID integration*, or *Publications import*
3. Enter your ORCID iD and authorise the connection

If your institution does not yet have direct ORCID integration, add your ORCID iD manually to your staff profile page.

---

## Your Action Step
Connect your ORCID to Scopus and Web of Science today. Then check your institutional researcher portal and add your ORCID iD there.

## Key Takeaway
Each platform you connect to ORCID reduces the manual work of maintaining your research identity. The connections are permanent — you set them once and they update automatically.
$lc$,
  3, FALSE, TRUE
) ON CONFLICT (module_id, slug) DO NOTHING;

-- M4 · L4
INSERT INTO lessons (module_id, title, slug, lesson_type, content_md, position, is_free_preview, is_published)
VALUES (v_m4,
  'ORCID on Your CV, Email Signature, LinkedIn, and Grant Applications',
  'orcid-cv-email-grants',
  'article',
$lc$
## Lesson Aim
Add your ORCID iD to every document and platform where it creates professional credibility and enables discovery.

## Learning Outcomes
By the end of this lesson, you will be able to:
- Format your ORCID iD correctly for CVs, grant applications, and email signatures
- Explain what grant reviewers look for when they check your ORCID link
- Use ORCID to make name changes and institution changes invisible to citation systems

---

## The Standard ORCID Format

The correct citation format for your ORCID iD is the full URL:

```
https://orcid.org/0000-0000-0000-0000
```

Never use just the 16-digit number alone — the URL format is machine-readable, clickable, and unambiguous.

## Where to Add It

**Academic CV**
Add your ORCID iD below your name and institutional affiliation, immediately after your email address. It signals to any reviewer that your publication record is verifiable with one click.

**Email signature**
Format: `ORCID: https://orcid.org/0000-0000-0000-0000`
Keep it on a separate line for visibility.

**Grant applications**
Most funder systems now have a dedicated ORCID field — enter your full URL. If there is no dedicated field, add it in your biosketch or researcher statement.

**LinkedIn profile**
Add it in the *Websites* section of your profile with the label "ORCID Profile." This makes your publication record verifiable to non-academic audiences.

## What Grant Reviewers Check

When a NIH, Wellcome, or Horizon reviewer clicks your ORCID link, they expect to see:
- A complete, current list of publications
- Funding history (if any)
- Employment history matching your application

An ORCID profile with only 2 works when your CV claims 20 papers sends a negative signal. Keep your ORCID works list as complete as your CV.

## ORCID Survives Name and Institution Changes

If you change your name (marriage, preference, legal change) or move institutions, your ORCID iD does not change. Your old publications retain their link to you. Systems that rely on ORCID continue attributing work to you correctly — even if your name in past publications differs from your current name.

---

## Your Action Step
Update your academic CV, email signature, and LinkedIn profile with your ORCID URL today. If you have a grant application in progress, locate the ORCID field and complete it.

## Key Takeaway
Adding your ORCID iD to your professional documents costs ten minutes and signals to every reviewer that your research record is complete, verified, and professionally maintained.
$lc$,
  4, FALSE, TRUE
) ON CONFLICT (module_id, slug) DO NOTHING;

-- M4 · L5
INSERT INTO lessons (module_id, title, slug, lesson_type, content_md, position, is_free_preview, is_published)
VALUES (v_m4,
  'ORCID + LinkedIn — The Collaboration That Makes Both More Powerful',
  'orcid-linkedin-sync',
  'article',
$lc$
## Lesson Aim
Connect ORCID to LinkedIn so your publication record appears on your professional profile and updates automatically.

## Learning Outcomes
By the end of this lesson, you will be able to:
- Display your ORCID publications directly on your LinkedIn profile
- Explain the credibility signal this creates for industry and non-academic audiences
- Set up automated sync so new publications appear without manual updating

---

## Why LinkedIn Matters for Researchers

LinkedIn has over one billion users. It is where industry partners, consultants, policy makers, and international collaborators search for expertise. Researchers who have no LinkedIn presence — or a thin, unverified one — are invisible to this entire audience.

Connecting ORCID to LinkedIn turns your academic publication record into a verifiable, public-facing professional credential. It tells a non-academic stakeholder: this person's research output is real, verified, and documented.

## Connecting ORCID to LinkedIn

LinkedIn does not have a native ORCID sync, but you can surface your research visibility effectively:

**Step 1: Add your ORCID URL to your profile**
Go to LinkedIn profile → *Contact info → Websites* → Add your ORCID URL with the label "Research Profile."

**Step 2: Add publications to the Featured section**
LinkedIn's *Featured* section supports links. Add direct links to your 3–5 most important papers (via DOI link or journal page). Use the paper title as the link text.

**Step 3: Add publications to the Publications section**
Under *Add profile section → Accomplishments → Publications*, add your key papers. Include the DOI link and ORCID-sourced citation.

**Step 4 (optional): Use a third-party sync tool**
Services like *Publons* and *ResearchGate* can partially automate keeping your LinkedIn publications section updated.

## The Credibility Signal

A LinkedIn profile with a verified ORCID link and specific publication listings tells a reviewer:
- This researcher has verifiable, peer-reviewed output
- Their record is transparent and maintained
- They present their academic identity professionally

---

## Your Action Step
Add your ORCID URL to your LinkedIn contact info today. Then add your three most important papers to the Featured or Publications section.

## Key Takeaway
Your ORCID iD is your bridge between the academic world and the professional world. Displaying it on LinkedIn makes your research credible to audiences who would otherwise have no way to verify it.
$lc$,
  5, FALSE, TRUE
) ON CONFLICT (module_id, slug) DO NOTHING;


-- ════════════════════════════════════════════════════════════════════════════
-- MODULE 5 — How Citations Actually Work
-- ════════════════════════════════════════════════════════════════════════════
IF NOT EXISTS (SELECT 1 FROM modules WHERE course_id = v_course AND position = 5) THEN
  INSERT INTO modules (course_id, title, description, position) VALUES (
    v_course,
    'How Citations Actually Work — And Why You''re Getting Less Than You Deserve',
    'Understand the full citation journey from publication to reference list, the discoverability factors that determine citation velocity, and the writing strategies that get papers found and cited.',
    5
  );
END IF;
SELECT id INTO v_m5 FROM modules WHERE course_id = v_course AND position = 5;

-- M5 · L1 — FREE PREVIEW
INSERT INTO lessons (module_id, title, slug, lesson_type, content_md, position, is_free_preview, is_published)
VALUES (v_m5,
  'The Citation Journey — From Your Paper to Someone Else''s Reference List',
  'citation-journey',
  'article',
$lc$
## Lesson Aim
Understand the complete journey a citation takes from the moment your paper is published to the moment it appears in another researcher's reference list and in your metrics.

## Learning Outcomes
By the end of this lesson, you will be able to:
- Describe the four stages of the citation journey
- Explain why there is typically a 6–18 month delay before citations appear in Scopus
- Identify why some papers accumulate citations quickly while others remain uncited for years

---

## Stage 1: Publication

Your paper is accepted and published by the journal. At this point, it exists in the publisher's system. It does not yet exist in any discovery database.

## Stage 2: Indexing

The publisher submits your paper's metadata (title, authors, abstract, keywords, DOI) to indexing services like Scopus, Web of Science, and CrossRef. This process typically takes **4–12 weeks** from publication. Google Scholar may index faster, often within days, by crawling the web.

Until your paper is indexed, it cannot be found by database search — and cannot be cited by researchers who rely on database searches to find related work.

## Stage 3: Discovery

Another researcher is writing a paper in your area. They search a database, find your paper, read it, and decide it is relevant to their work.

The key word is *find*. If your paper's title is unclear, if the abstract does not contain the keywords they searched, or if the paper is behind a paywall they cannot access — they will not find it, regardless of its quality.

## Stage 4: Citation and Metric Update

The researcher cites your paper. Their paper is published. Scopus indexes the new paper, recognises the citation to yours, and updates your citation count. This final step can take **6–18 months** from the time your paper was first published.

## Why Some Papers Get Cited Fast and Others Sit Dormant

Papers that accumulate citations quickly have:
- Titles that directly match search queries researchers use
- Abstracts that contain the right keywords
- Open access status that removes the paywall barrier
- Publication in high-readership, well-indexed journals
- Subject matter that addresses a current, active question in the field

These are not accidents — they are choices you make during the writing and submission process.

---

## Your Action Step
Pick your most recent paper. Check: (1) Is it fully indexed in Scopus and Google Scholar? (2) Does the title contain the exact keywords a peer would search? (3) Is it open access or behind a paywall? Record what you find.

## Key Takeaway
Citations do not happen to good papers — they happen to findable ones. Understanding the journey is the first step to designing for it.
$lc$,
  1, TRUE, TRUE
) ON CONFLICT (module_id, slug) DO NOTHING;

-- M5 · L2
INSERT INTO lessons (module_id, title, slug, lesson_type, content_md, position, is_free_preview, is_published)
VALUES (v_m5,
  'Why Strong Research Gets Ignored — and Weaker Papers Get Cited More',
  'why-strong-research-gets-ignored',
  'article',
$lc$
## Lesson Aim
Understand the discoverability factors that determine citation velocity and learn how presentation, framing, and journal choice affect whether your paper gets found and cited.

## Learning Outcomes
By the end of this lesson, you will be able to:
- Identify the four main discoverability factors that drive citation velocity
- Explain how title construction, abstract writing, and keyword selection function as citation strategy
- Describe how journal prestige and open access status affect how quickly a paper is cited

---

## The Uncomfortable Truth

Bibliometric research consistently shows that quality of research and number of citations correlate weakly. Many rigorously conducted, genuinely important studies go uncited for years. Meanwhile, papers with provocative titles, clear practical implications, and open access publication accumulate citations rapidly.

This is not unfair — it is a systems problem. Understanding the system is how you fix it.

## Discoverability Factor 1: Title

Your title is the primary signal to a search algorithm and to a human researcher scanning results. A title that:
- Contains the exact terms researchers search for
- Clearly states the subject and scope
- Avoids unnecessary jargon or clever wordplay

...will be found and clicked more than a title that does not.

**Weak title:** *An investigation of the role of metadata in academic visibility systems*
**Stronger title:** *How Metadata Errors Reduce Citation Counts in Scopus and Google Scholar: A Cross-Platform Analysis*

## Discoverability Factor 2: Abstract

Search databases index your abstract as well as your title. Every sentence in your abstract is searchable metadata. Write an abstract that:
- States your research question in the first sentence
- Uses the specific terminology your target readers search for
- States your main finding clearly (not "results will be discussed")
- Includes geographic or disciplinary context if relevant

## Discoverability Factor 3: Open Access Status

Studies consistently show that open access papers receive 25–50% more citations than equivalent paywalled papers. If your institution has an open access repository, depositing a post-print there is legal for most journals and significantly increases reach.

## Discoverability Factor 4: Journal Readership and Indexing

Publishing in a high-impact journal matters — but so does publishing in a journal that your actual target audience reads. A Q1 journal read by 200 specialists and a Q2 journal read by 4,000 practitioners may have very different citation outcomes depending on your research context.

---

## Your Action Step
Review the titles and abstracts of your three most-cited papers and your three least-cited papers. Identify the specific differences in title clarity, keyword presence, and abstract directness. What would you change today if you were writing them again?

## Key Takeaway
You cannot change the quality of past research — but you can change how discoverable it is. And you can write every future paper with discoverability designed in from the start.
$lc$,
  2, FALSE, TRUE
) ON CONFLICT (module_id, slug) DO NOTHING;

-- M5 · L3
INSERT INTO lessons (module_id, title, slug, lesson_type, content_md, position, is_free_preview, is_published)
VALUES (v_m5,
  'Reference Formats and Metadata Errors That Kill Your Discoverability',
  'reference-formats-metadata-errors',
  'article',
$lc$
## Lesson Aim
Identify the specific metadata and formatting errors that prevent citations from being attributed to you correctly and learn to write consistently across all publications.

## Learning Outcomes
By the end of this lesson, you will be able to:
- Identify the name and affiliation formatting errors that cause citation misattribution
- Write your author name consistently across all publications and platforms
- Format institutional affiliations in the way that maximises correct indexing

---

## Why Metadata Matters More Than Most Researchers Realise

When Scopus or Web of Science indexes a new paper, it tries to match the authors listed to existing Author Profiles. It does this algorithmically, using name, affiliation, and co-author patterns.

If your name appears differently than in previous publications, the system may create a new Author Profile — splitting your citation count and fragmenting your record.

## The Name Consistency Problem

These are all the same researcher, but Scopus may treat them as different people:
- *C. Okafor*
- *Chukwuemeka Okafor*
- *C.E. Okafor*
- *Okafor, C.*
- *Okafor, Chukwuemeka Emeka*

**The fix:** Choose one form of your name — ideally the one used in your most-cited existing papers — and use it identically on every future submission. Instruct your co-authors to cite you using this exact form in their reference lists.

## Affiliation Formatting

Affiliations also affect indexing. These should not be considered equivalent by a researcher submitting papers:
- *University of Lagos*
- *UNILAG*
- *Department of Biochemistry, University of Lagos, Nigeria*

The most complete, standardised form — full institution name, city, country — is the most reliably indexed. Use it on every submission.

## DOI and Reference List Errors

When you cite another researcher's work, errors in your reference list can prevent that citation from being attributed to them:
- Incorrect journal name
- Wrong volume/issue number
- Author name misspelling
- Missing DOI

These errors make your citation invisible to the author you cited — and affect their metrics. Apply the same precision to how you cite others as to how you present yourself.

---

## Your Action Step
Review your last three published papers. Check the author name form used in each. If it differs across papers, decide on your canonical form now and use it consistently on all future submissions.

## Key Takeaway
Your scholarly identity is only as consistent as the metadata you submit with your papers. Name consistency and correct affiliation formatting are not pedantic details — they are the foundation of an attributable career record.
$lc$,
  3, FALSE, TRUE
) ON CONFLICT (module_id, slug) DO NOTHING;

-- M5 · L4
INSERT INTO lessons (module_id, title, slug, lesson_type, content_md, position, is_free_preview, is_published)
VALUES (v_m5,
  'Writing Titles and Abstracts That Get Found, Read, and Cited',
  'writing-titles-abstracts-for-citations',
  'article',
$lc$
## Lesson Aim
Apply specific, evidence-based writing strategies for titles and abstracts that increase the discoverability and citation rate of your papers.

## Learning Outcomes
By the end of this lesson, you will be able to:
- Apply a tested title formula that balances searchability with academic credibility
- Structure an abstract that serves both human readers and indexing algorithms
- Select 5 keywords using the strategy used by highly cited researchers

---

## The Title Formula

The most consistently cited academic papers use titles in one of two structures:

**Structure A — Descriptive Precision**
*[Subject] + [Method or Scope] + [Finding or Contribution]*
Example: *Scopus Author Profile Errors and Their Effect on Citation Attribution: A Cross-Institutional Analysis*

**Structure B — Question or Tension**
*[The Gap or Problem]: [What This Paper Addresses]*
Example: *Why Researchers Go Uncited: Metadata Errors as a Hidden Barrier to Academic Visibility*

Both structures tell a search algorithm and a human reader exactly what the paper is about, using the terms the field actually uses.

**Avoid:** Clever wordplay, unexplained acronyms in the title, vague terms like "a study of" or "an investigation into."

## Abstract Structure for Discovery

A discovery-optimised abstract follows this structure:
1. **Context** (1–2 sentences): What problem or gap does this paper address?
2. **Method** (1–2 sentences): How did you investigate it?
3. **Findings** (2–3 sentences): What did you find? State results explicitly.
4. **Implications** (1–2 sentences): What does this mean for the field or practice?

Every sentence should contain natural-language terms that researchers in your field would type into a search engine. Your findings section should state what you found — not that "findings will be discussed."

## The 5-Keyword Strategy

Your paper's keywords are directly indexed by Scopus, WoS, and CrossRef. Select keywords that:
1. Appear verbatim in your abstract
2. Represent the specific sub-field (not just the broad discipline)
3. Match the terminology used in the most-cited papers in your area
4. Include geographic or methodological specificity if relevant
5. Avoid keywords already covered by your title (wasted indexing space)

---

## Your Action Step
Rewrite the title and keywords for your most recent paper using the structures above. If the paper is not yet published, apply this before submission. If it is published, note what you would change — and apply it to the next one.

## Key Takeaway
The writing choices that make a paper easy to find are learnable, applicable before submission, and have no trade-off with academic quality. There is no reason not to apply them.
$lc$,
  4, FALSE, TRUE
) ON CONFLICT (module_id, slug) DO NOTHING;

-- M5 · L5
INSERT INTO lessons (module_id, title, slug, lesson_type, content_md, position, is_free_preview, is_published)
VALUES (v_m5,
  'Collaborative Citations, Self-Citation, and the Ethical Lines',
  'collaborative-citations-ethics',
  'article',
$lc$
## Lesson Aim
Understand what constitutes legitimate citation practice, how to ethically reference your own prior work, and how to build citation relationships through genuine academic collaboration.

## Learning Outcomes
By the end of this lesson, you will be able to:
- Distinguish between legitimate citation practice and citation manipulation
- Reference your own prior work appropriately without appearing self-promotional
- Build citation relationships through genuine academic collaboration and engagement

---

## The Landscape of Citation Practice

Citations are both scholarly acknowledgement and career currency. This dual role creates pressure that, for some researchers, leads to manipulative practices. Understanding where the lines are — and why they exist — helps you build your citation record with integrity.

## Legitimate Practice

**Citing your own prior work** is entirely appropriate when:
- The cited paper provides essential background or methodology for the current paper
- The citation demonstrates how the current paper extends or builds on previous findings
- The connection is direct and substantive — not incidental

**Co-author citation networks** — citing the work of researchers you collaborate with — is legitimate when the cited work is genuinely relevant. Collaboration and mutual citation are normal features of active research networks.

**Review articles** — writing a systematic or narrative review in your field — legitimately cites many papers including your own prior work. Review articles are also among the most highly cited paper types.

## Practices That Cross the Line

**Excessive self-citation** — inflating your citation count by citing your own papers where they are not substantively relevant — is detectable by journal editors and review committees and damages your reputation more than it helps your metrics.

**Citation cartels** — formal or informal agreements among groups of researchers to cite each other's work regardless of relevance — are increasingly detected by journal impact factor audits and can result in retraction and institutional investigation.

**Coercive citation** — editors or reviewers who demand citations to their own work as a condition of publication — is an ethical violation. If you encounter this, document it and report to the journal's publisher.

## Building Citation Relationships Legitimately

The most sustainable way to build citations is through genuine engagement:
- Present your work at conferences where potential citers gather
- Respond substantively to researchers working in your area
- Write papers that directly address questions raised in the existing literature
- Make your work open access wherever possible

---

## Your Action Step
Review your last published paper's reference list. For each self-citation, ask: would a reviewer immediately understand why this paper is cited here? If not, consider whether the citation is fully justified.

## Key Takeaway
A citation record built on genuine relevance is permanent and compounding. A citation record built on manipulation is fragile, detectable, and ultimately costs more than it gains.
$lc$,
  5, FALSE, TRUE
) ON CONFLICT (module_id, slug) DO NOTHING;


-- ════════════════════════════════════════════════════════════════════════════
-- MODULE 6 — The h-Index Explained
-- ════════════════════════════════════════════════════════════════════════════
IF NOT EXISTS (SELECT 1 FROM modules WHERE course_id = v_course AND position = 6) THEN
  INSERT INTO modules (course_id, title, description, position) VALUES (
    v_course,
    'The h-Index Explained — What That Single Number Means for Your Promotion, Grants, and Career',
    'Understand how the h-index is calculated, why it varies across platforms, what score you need for your specific career context, and the ethical strategies for growing it.',
    6
  );
END IF;
SELECT id INTO v_m6 FROM modules WHERE course_id = v_course AND position = 6;

-- M6 · L1 — FREE PREVIEW
INSERT INTO lessons (module_id, title, slug, lesson_type, content_md, position, is_free_preview, is_published)
VALUES (v_m6,
  'What the h-Index Actually Measures — and What It Doesn''t',
  'what-h-index-measures',
  'article',
$lc$
## Lesson Aim
Understand the h-index formula, what it measures about your research output, and where its limitations lie — so you can use it strategically and explain it accurately.

## Learning Outcomes
By the end of this lesson, you will be able to:
- Define the h-index and calculate it manually from a simple citation list
- Explain what the h-index measures and what it deliberately does not measure
- Describe the difference between h-index and total citation count as career signals

---

## The Definition in Plain English

Your h-index is **h** when you have published **h** papers that have each been cited at least **h** times.

**Example:** If you have published 30 papers, but only 8 of them have each been cited 8 or more times, your h-index is 8 — regardless of how many total citations your other 22 papers have received.

A researcher with h-index 8 has demonstrated **consistent citation impact across at least 8 papers**. This is what the h-index measures: not peak impact, not total volume — but sustained, distributed impact.

## What the h-Index Measures

- **Consistency** — you need multiple papers with sustained citations, not one outlier
- **Breadth** — a single paper with 500 citations gives you an h-index of at most 1 (from that paper alone)
- **Longevity** — it increases over time as older papers continue accumulating citations

## What It Does NOT Measure

- Quality of individual papers
- Breakthrough significance of a single discovery
- Relevance to policy or practice
- Output in fields where citation rates are inherently low (humanities, clinical practice)

A young researcher 3 years post-PhD with 12 papers and h=4 may be performing far better than their raw number suggests. A senior researcher with h=12 in a high-volume citation field may be below average for their stage.

## h-Index vs Total Citations

| Metric | Measures | Use case |
|---|---|---|
| h-index | Consistent, distributed impact | Promotion panels, grant committees |
| Total citations | Peak reach and influence of best work | Media, public-facing profiles |
| i10-index | Number of papers with 10+ citations | Supplementary career evidence |

---

## Your Action Step
Find your current h-index on Scopus and Google Scholar. Note if they differ (they will — the next lesson explains why). Write down your h-index, total citations, and document count on all platforms you have profiles on.

## Key Takeaway
The h-index rewards consistency. The researchers it advantages most are those who build a sustained body of cited work — not those who chase one high-profile paper.
$lc$,
  1, TRUE, TRUE
) ON CONFLICT (module_id, slug) DO NOTHING;

-- M6 · L2
INSERT INTO lessons (module_id, title, slug, lesson_type, content_md, position, is_free_preview, is_published)
VALUES (v_m6,
  'Why Your h-Index Differs Across Scopus, Google Scholar, and Web of Science',
  'h-index-differs-across-platforms',
  'article',
$lc$
## Lesson Aim
Understand why the same researcher has different h-index scores on different platforms and know which score to cite in which professional context.

## Learning Outcomes
By the end of this lesson, you will be able to:
- Explain the three reasons h-index scores vary across databases
- Identify which platform h-index to cite for a Nigerian promotion dossier, a US grant application, and a European tenure file
- Avoid the common mistake of presenting inconsistent or inflated h-index figures

---

## Why the Scores Differ

Every researcher with profiles on multiple databases has multiple h-index scores. This is not an error — it reflects fundamental differences in how each database is built.

**Coverage difference:** Google Scholar indexes a much wider range of sources — including preprints, theses, conference proceedings, and grey literature — that Scopus and WoS do not. This typically gives Google Scholar a higher citation count and often a higher h-index.

**Indexing scope:** Scopus covers approximately 27,000 journals. WoS covers approximately 21,000. The journals covered overlap but are not identical. A paper published in a journal indexed by Scopus but not WoS will not contribute to your WoS h-index.

**Citation coverage:** Even for papers indexed by all three, the citing papers they recognise differ. WoS may index the citing paper while Scopus does not, and vice versa.

## Which Score to Use Where

| Context | Recommended platform | Reason |
|---|---|---|
| Nigerian university promotion dossier | Scopus | Standard required by most Nigerian institutions and NUC |
| US NIH biosketch | Google Scholar or Scopus | Both accepted; include both |
| US NSF grant | Google Scholar + WoS | NSF reviewers often use both |
| European ERC / Horizon application | Scopus or WoS | Both widely recognised |
| Nigerian TETFUND grant | Scopus | Explicitly referenced in most guidelines |

## The Transparency Rule

When presenting your h-index in any professional document, always state the source and date:

*"h-index: 9 (Scopus, as of June 2026)"*

This prevents confusion when reviewers check and find a different number on another platform. It also demonstrates that you understand your own metrics — a mark of professional research management.

---

## Your Action Step
Note your h-index on Scopus, Google Scholar, and Web of Science. Record the date. Decide which to lead with in your next grant application or promotion file based on the table above.

## Key Takeaway
Multiple h-index scores are normal and expected. Knowing which one to present and how to frame it is a mark of metric literacy — and metric literacy is a career skill.
$lc$,
  2, FALSE, TRUE
) ON CONFLICT (module_id, slug) DO NOTHING;

-- M6 · L3
INSERT INTO lessons (module_id, title, slug, lesson_type, content_md, position, is_free_preview, is_published)
VALUES (v_m6,
  'What Score You Actually Need — By Region, Career Stage, and Discipline',
  'h-index-benchmarks-by-region',
  'article',
$lc$
## Lesson Aim
Use accurate, context-specific benchmarks to assess your h-index realistically and understand what growth target is appropriate for your next career milestone.

## Learning Outcomes
By the end of this lesson, you will be able to:
- Identify realistic h-index benchmarks for Nigerian academic promotion ranks
- Describe the h-index expectations in US tenure review and NIH biosketch contexts
- Apply the principle of field-normalised benchmarking to avoid misleading comparisons

---

## There Is No Universal "Good" h-Index

A physicist with h=15 may be well below average for a full professor. A humanities scholar with h=6 may be performing exceptionally. A clinical researcher with h=20 may be ordinary in their subspecialty.

The h-index is only meaningful in context. Comparisons must be:
- **Same field** (citation rates differ dramatically by discipline)
- **Same career stage** (h-index grows with career length, not just quality)
- **Same database** (Scopus vs Google Scholar comparisons are not equivalent)

## Nigerian University Promotion Benchmarks

These are approximate expectations. Your institution and discipline may vary — always check your specific promotion criteria documentation.

| Rank | Typical Scopus h-index expectation |
|---|---|
| Lecturer II → Lecturer I | h = 1–3, minimum 2–3 Scopus papers |
| Lecturer I → Senior Lecturer | h = 3–6, minimum 5–8 Scopus papers |
| Senior Lecturer → Reader/Associate Professor | h = 6–10, minimum 10–15 Scopus papers |
| Reader → Professor | h = 10–15+, minimum 15–20 Scopus papers |

These benchmarks are rising as Nigerian universities align with international standards. Researchers promoted with lower scores five years ago may find their numbers are below current expectations for the next step.

## US Tenure and Grant Benchmarks

US benchmarks vary significantly by institution type and field:

| Context | Approximate expectation |
|---|---|
| Assistant Professor (STEM, research university, 5 years) | h = 8–15 |
| Associate Professor (STEM, research university) | h = 12–20 |
| NIH R01 competitive application | h ≥ 10 strongly preferred |
| NSF career award applicant | h = 5–12 depending on field |

## European Benchmarks

European Research Council (ERC) Starting Grant applicants: typically h = 5–12 in STEM fields. Consolidator Grant: h = 10–20. These are minimum competitive ranges, not guarantees.

---

## Your Action Step
Find the promotion criteria documentation for your institution (or the grant guidelines for your next application target). Identify the specific h-index expectations stated or implied. Compare your current score to the next milestone — that gap is your strategic target.

## Key Takeaway
Benchmarking yourself correctly requires knowing your field, your career stage, and your regional context. A number without context is just a number — with context, it is a strategy.
$lc$,
  3, FALSE, TRUE
) ON CONFLICT (module_id, slug) DO NOTHING;

-- M6 · L4
INSERT INTO lessons (module_id, title, slug, lesson_type, content_md, position, is_free_preview, is_published)
VALUES (v_m6,
  'The Legal, Ethical Strategies for Growing Your h-Index in the Next 12 Months',
  'growing-h-index-ethically',
  'article',
$lc$
## Lesson Aim
Apply evidence-based, ethical strategies for increasing your h-index over the next 12 months — through publication strategy, collaboration, and visibility improvements.

## Learning Outcomes
By the end of this lesson, you will be able to:
- Select the publication types most likely to contribute to h-index growth
- Apply altmetric and early citation velocity strategies to new papers
- Distinguish between ethical h-index growth and citation manipulation

---

## How the h-Index Actually Grows

Your h-index grows when a paper you have published reaches the citation threshold of your current h-index. To move from h=6 to h=7, you need a paper that accumulates at least 7 citations. This has two implications:

1. **New papers** — to grow your h-index, you need to publish papers that will be widely cited
2. **Existing papers** — papers near your h threshold (h papers with h-1 citations) are your fastest growth path if they receive one or two more citations

## Strategy 1: Target Papers Near Your h Threshold

Find the papers in your profile that currently have h-1 citations (e.g., if your h-index is 6, papers with 5 citations). These need only one more citation to advance your h-index. Prioritise making them visible: share them at conferences, include them in your email signature, ensure they are open access.

## Strategy 2: Choose High-Impact Publication Types

**Review articles** — systematic and narrative reviews are cited at 3–5× the rate of original research papers. One well-placed review in your area can move your h-index more than three original papers.

**Methodological papers** — papers introducing or evaluating a method get cited by every researcher who uses that method. Highly leveraged if you have a methodological contribution.

**Collaborative papers** — co-authoring with researchers who have larger networks exposes your work to their citation ecosystem.

## Strategy 3: Early Citation Velocity

Papers cited in their first year tend to continue accumulating citations longer. Accelerate early discovery by:
- Posting a preprint before journal publication
- Presenting at a conference timed close to publication
- Sharing the paper on ResearchGate and SSRN on publication day
- Notifying researchers working on directly related topics (a brief, professional email)

---

## Your Action Step
Identify your three papers nearest to your current h-index threshold. Check whether each is open access, listed on all your profiles, and has been shared at a recent conference or on social media. Make any missing step happen this week.

## Key Takeaway
h-index growth is not accidental and it is not manufactured — it is the result of publishing the right types of work in the right places and making sure those papers can be found.
$lc$,
  4, FALSE, TRUE
) ON CONFLICT (module_id, slug) DO NOTHING;

-- M6 · L5
INSERT INTO lessons (module_id, title, slug, lesson_type, content_md, position, is_free_preview, is_published)
VALUES (v_m6,
  'h-Index for the Nigerian Promotion Dossier — What to Include and How to Present It',
  'h-index-nigerian-promotion-dossier',
  'article',
$lc$
## Lesson Aim
Present your bibliometric data correctly in a Nigerian university promotion file — using the format, supporting evidence, and contextualisation that strengthens your case with non-specialist review committees.

## Learning Outcomes
By the end of this lesson, you will be able to:
- Format h-index and citation data correctly for a Nigerian promotion dossier
- Explain h-index discrepancies to non-specialist review committee members
- Identify the supporting documents that strengthen your metrics presentation

---

## What Nigerian Promotion Committees Look At

Nigerian university promotion reviews — at most institutions governed by the NUC framework — assess research output through a combination of:
1. Number of publications in Scopus-indexed journals
2. Citation count (from Scopus)
3. h-index (from Scopus)
4. Journal quality (quartile, impact factor)
5. Recency of publications

The committee typically contains members from your field and members who are not specialists. Your presentation must be clear to both groups.

## The Standard Presentation Format

Include this section in your promotion application under *Research Output and Impact*:

```
Bibliometric Summary (Scopus, [Month Year])
──────────────────────────────────────────
Total publications (Scopus-indexed):  [n]
Total citations:                      [n]
h-index:                              [n]
i10-index:                            [n]

Google Scholar (for completeness)
──────────────────────────────────
Total citations:                      [n]
h-index:                              [n]
```

Always state the database and date. Always include the Google Scholar figures as supplementary (they are typically higher and show your broader reach).

## Explaining Discrepancies

If committee members notice your Google Scholar h-index is higher than your Scopus h-index, have a one-sentence explanation ready:

*"Google Scholar indexes a wider range of sources including preprints and conference papers, which is why its citation count and h-index are higher. Scopus represents peer-reviewed journal publications only, which is the standard used for institutional assessment."*

## Supporting Documents to Attach

1. A Scopus author profile screenshot (dated)
2. A list of all Scopus-indexed publications (title, journal, year, Q-ranking, citation count)
3. Any Web of Science or ORCID data as supplementary evidence

---

## Your Action Step
Download a screenshot of your current Scopus Author Profile and prepare your bibliometric summary table using the format above. Keep it updated — you will use it in every grant application and promotion file from now on.

## Key Takeaway
Presenting your metrics correctly and confidently — with sourced data and clear framing — distinguishes you from candidates who let the numbers speak without context. Numbers without framing leave the interpretation to the committee.
$lc$,
  5, FALSE, TRUE
) ON CONFLICT (module_id, slug) DO NOTHING;

-- M6 · L6
INSERT INTO lessons (module_id, title, slug, lesson_type, content_md, position, is_free_preview, is_published)
VALUES (v_m6,
  'h-Index for the US Tenure File and NIH/NSF Biosketch',
  'h-index-us-tenure-nih-biosketch',
  'article',
$lc$
## Lesson Aim
Present your bibliometric data correctly for US academic tenure review and for NIH and NSF grant biosketches and project narratives.

## Learning Outcomes
By the end of this lesson, you will be able to:
- Format bibliometric data for a US tenure and promotion file
- Complete the NIH biosketch research output section to highlight impact effectively
- Frame your h-index and citation data for NSF Intellectual Merit and Broader Impacts criteria

---

## US Tenure Review: How Bibliometric Data Is Used

US tenure review at research universities is more contextualised than in many Nigerian institutions. Committees expect to see:
- Total publications in peer-reviewed journals
- Proportion in top-tier or leading journals in the field
- Citation count with context (compared to field norms at similar career stage)
- h-index as one indicator of sustained impact — not the sole metric

The American approach is more narrative: you explain your metrics, not just present them. The tenure statement includes a section where you interpret your output.

**Framing example:** *"My research program has produced 18 peer-reviewed publications, accumulating 247 citations (h-index: 9, Google Scholar) over six years. This citation rate is above the median for assistant professors in [field] at this career stage, reflecting the rapid uptake of my findings on X in the broader research community."*

## NIH Biosketch: Research Output Section (Section C)

NIH biosketches allow you to list up to 15 publications. Select papers that:
- Are most directly relevant to the proposed project
- Demonstrate your productivity and citation impact in the area
- Show collaborative breadth (co-authors from different institutions)

You may also include a personal statement that contextualises your productivity and impact. Mention your h-index, total citations, and total publications here — briefly and with source attribution.

## NSF: Intellectual Merit and Broader Impacts

NSF grant applications require you to address both criteria:

**Intellectual Merit** — your citation record is evidence here. A high h-index and well-cited papers in leading journals support your claim to substantive scholarly contribution.

**Broader Impacts** — your ResearchGate downloads, Altmetric scores, and any policy or media engagement demonstrate reach beyond the academic literature. These are increasingly valued.

---

## Your Action Step
If you are within 18 months of a tenure review or grant application, draft the one-paragraph bibliometric narrative described above. Adapt the framing example to your own data and field context.

## Key Takeaway
US review systems reward researchers who can contextualise their metrics intelligently. The ability to say "here is what my numbers mean and why they reflect genuine impact" is a distinguishing competency.
$lc$,
  6, FALSE, TRUE
) ON CONFLICT (module_id, slug) DO NOTHING;


-- ════════════════════════════════════════════════════════════════════════════
-- MODULE 7 — How Journals and Databases Find Your Research
-- ════════════════════════════════════════════════════════════════════════════
IF NOT EXISTS (SELECT 1 FROM modules WHERE course_id = v_course AND position = 7) THEN
  INSERT INTO modules (course_id, title, description, position) VALUES (
    v_course,
    'How Journals and Databases Find — or Completely Lose — Your Research',
    'Understand the full paper lifecycle from acceptance to indexed to discovered, choose journals for maximum discoverability, and use preprints and open repositories to extend your reach.',
    7
  );
END IF;
SELECT id INTO v_m7 FROM modules WHERE course_id = v_course AND position = 7;

-- M7 · L1 — FREE PREVIEW
INSERT INTO lessons (module_id, title, slug, lesson_type, content_md, position, is_free_preview, is_published)
VALUES (v_m7,
  'The Journey of a Published Paper — From Acceptance to Indexed to Discovered',
  'journey-published-paper-to-indexed',
  'article',
$lc$
## Lesson Aim
Trace the full lifecycle of a published paper and understand where delays, failures, and permanent losses occur — so you can prevent them.

## Learning Outcomes
By the end of this lesson, you will be able to:
- Describe the five stages of a paper's lifecycle from journal acceptance to researcher discovery
- Explain average indexing timelines for Scopus, WoS, and Google Scholar
- Identify the points where a paper can be permanently lost from discovery systems

---

## Stage 1: Acceptance and Final Submission

Your paper is accepted by the journal. You submit the final version with all author names, affiliations, and metadata exactly as you want them to appear in all future databases. This is your last point of control over metadata — once published, errors are difficult to correct.

**Common mistake:** Using abbreviated name forms, wrong institutional name, or outdated affiliation in the final submission. These errors persist across every database that indexes the paper.

## Stage 2: Publisher Processing and DOI Assignment

The publisher typsets the paper and assigns a **DOI** (Digital Object Identifier). The DOI is a permanent link — it is what all databases use to identify your specific paper. Without a DOI, indexing is unreliable.

**Timeline:** Typically 1–4 weeks after acceptance.

## Stage 3: Indexer Notification

The publisher submits metadata to Scopus, Web of Science, CrossRef, and PubMed (if applicable). CrossRef receives metadata for DOI registration. Scopus and WoS receive it through publisher agreements.

**Timeline:** 2–8 weeks after publication.

## Stage 4: Database Indexing

Scopus and WoS process the metadata and decide whether to index the paper. For journals they already cover, this is largely automatic. For new journals or issues, it involves human review.

**Timeline:** 4–12 weeks after publication for established indexed journals.

## Stage 5: Author Profile Attribution

Scopus attempts to match the paper to an existing Author Profile. If your profile is correctly set up and verified, the paper is attributed immediately. If you have a duplicate record or inconsistent name, the paper may go to a second profile or remain unattributed.

**Timeline:** Usually concurrent with indexing, but may require manual correction.

---

## Your Action Step
For your most recently published paper, trace exactly where it is in this lifecycle. Is it fully indexed in Scopus and WoS? Is it attributed to your verified Author Profile? If not, which stage is the blockage?

## Key Takeaway
Every stage of the indexing lifecycle is a point where your paper can be delayed, misattributed, or permanently lost from discovery. Understanding the stages is what allows you to intervene.
$lc$,
  1, TRUE, TRUE
) ON CONFLICT (module_id, slug) DO NOTHING;

-- M7 · L2
INSERT INTO lessons (module_id, title, slug, lesson_type, content_md, position, is_free_preview, is_published)
VALUES (v_m7,
  'Why Some Papers Vanish After Publication (and How to Prevent It)',
  'why-papers-vanish-after-publication',
  'article',
$lc$
## Lesson Aim
Identify the journal-level and process-level factors that cause published papers to disappear from discovery databases — and take preventive action before submitting future work.

## Learning Outcomes
By the end of this lesson, you will be able to:
- Identify the three journal-level factors that cause papers to go unindexed or be de-listed
- Check a journal's indexing status before submitting a paper
- Describe what actions to take if a published paper is not appearing in major databases

---

## Three Reasons Papers Vanish

**Reason 1: The journal is indexed but not for this subject category.**
Scopus and WoS index journals by subject area. A paper published in a journal that covers multiple fields may not be indexed for the specific subject classification your paper belongs to. This is rare but causes significant confusion.

**Reason 2: The journal was de-listed after your paper was published.**
Scopus and WoS periodically review and remove journals that no longer meet quality standards. If a journal you published in is de-listed, papers published during its indexed period may be retained — or may disappear. Check regularly.

**Reason 3: The journal was predatory and was never legitimately indexed.**
Some journals falsely claim Scopus or WoS indexing. If you published in one and the paper does not appear in these databases, the indexing claim was almost certainly false. This is a critical issue to resolve before any promotion application.

## How to Check a Journal's Indexing Status

**Before submission:**
- Scopus: search the journal title at scopus.com/sources
- Web of Science: use the Master Journal List at mjl.clarivate.com
- Look for the journal's exact name — predatory journals often use names similar to legitimate ones

**After publishing:**
- Search the paper title directly in Scopus and WoS
- If it does not appear after 3 months, contact the journal and request their indexing verification documentation

## If a Published Paper Is Not Appearing

1. Confirm the journal is legitimately indexed (see above)
2. Check whether the paper has a valid DOI — search the DOI at doi.org
3. If the DOI resolves but the paper is not in Scopus, contact Scopus support with the DOI and publication details
4. If the journal was never indexed, there is no recovery path — focus on preventing this for future papers

---

## Your Action Step
Check every paper on your CV against the Scopus journal list. Identify any papers published in journals not currently on the Scopus list. Understand why — delisted, never indexed, or subject classification issue.

## Key Takeaway
The indexing status of your journal is your responsibility to verify — before submission, not after. One publication in a non-indexed journal is a recoverable mistake. A pattern of them is a career obstacle.
$lc$,
  2, FALSE, TRUE
) ON CONFLICT (module_id, slug) DO NOTHING;

-- M7 · L3
INSERT INTO lessons (module_id, title, slug, lesson_type, content_md, position, is_free_preview, is_published)
VALUES (v_m7,
  'Choosing Journals for Discoverability — Not Just Prestige',
  'choosing-journals-for-discoverability',
  'article',
$lc$
## Lesson Aim
Apply a multi-factor journal selection framework that balances indexing quality, audience reach, open access policy, and subject fit — not just impact factor or prestige.

## Learning Outcomes
By the end of this lesson, you will be able to:
- Identify the criteria beyond impact factor that determine how many people will find your paper
- Apply a five-factor journal selection framework to any paper
- Use journal finder tools to build a ranked shortlist before writing

---

## The Impact Factor Trap

Researchers are trained to maximise impact factor. This leads to a common mistake: publishing in a high-prestige journal with limited readership in your specific area — and a lower-prestige journal with a larger, more directly relevant audience would have generated more citations and more real-world impact.

Journal selection should be multi-factor, not single-metric.

## The Five-Factor Framework

**Factor 1: Scopus/WoS indexing**
Non-negotiable for career purposes. Confirm the journal is currently indexed before investing time in a submission.

**Factor 2: Subject fit**
Is this journal read by the researchers who would cite your paper? A good fit means your paper surfaces in the right search results.

**Factor 3: Open access policy**
Can readers in Nigeria, Africa, or lower-income countries access your paper without an institutional subscription? Open access expands your potential citation audience dramatically.

**Factor 4: Geographic readership**
Who reads this journal? If your work is relevant to Nigerian or African contexts and the journal's readership is primarily North American, your audience fit is poor regardless of prestige.

**Factor 5: Indexing trajectory**
Is the journal's CiteScore growing or declining? Publishing in an ascending journal offers an early-mover advantage — your paper accumulates citations as the journal gains readers.

## Journal Finder Tools

- **Elsevier Journal Finder** (journalfinder.elsevier.com) — paste your abstract, receive ranked Elsevier journal suggestions
- **Springer Journal Suggester** (journalsuggester.springer.com) — similar functionality for Springer journals
- **JANE** (Jane.biosemantics.org) — cross-publisher, based on abstract similarity to published papers

---

## Your Action Step
For your next paper in preparation, use at least two of the journal finder tools above. Build a shortlist of five journals. Evaluate each against the five factors. Select your primary target and two fallbacks before you begin writing.

## Key Takeaway
Journal selection is a strategic decision, not a prestige-seeking exercise. The right journal for your paper is the one most likely to put it in front of the researchers who will find it valuable — and cite it.
$lc$,
  3, FALSE, TRUE
) ON CONFLICT (module_id, slug) DO NOTHING;

-- M7 · L4
INSERT INTO lessons (module_id, title, slug, lesson_type, content_md, position, is_free_preview, is_published)
VALUES (v_m7,
  'Keywords, Metadata, and Titles — The Academic SEO Nobody Teaches',
  'keywords-metadata-academic-seo',
  'article',
$lc$
## Lesson Aim
Apply the keyword and metadata optimisation principles used by highly cited researchers to ensure your papers surface at the top of database search results.

## Learning Outcomes
By the end of this lesson, you will be able to:
- Explain how database search algorithms rank paper results
- Apply a keyword strategy that positions your paper for maximum discovery
- Distinguish between academic writing and academic discovery writing

---

## Why "Academic SEO" Is Not a Compromise

SEO (search engine optimisation) has a reputation as a marketing technique. In academic publishing, the same principles apply — but the goal is not to game search engines, it is to ensure that the correct audience finds your work.

A paper with perfectly designed research that uses unexplained jargon, an oblique title, and no keywords matching the field's search vocabulary is invisible to the researchers it should be reaching. That is a loss for the field, not just for your citation count.

## How Database Algorithms Rank Results

Scopus and WoS search algorithms weight these fields in roughly this order:
1. **Title** (highest weight)
2. **Keywords** (high weight)
3. **Abstract** (medium-high weight)
4. **Author keywords** (medium weight)
5. **Full text** (lower weight, varies by platform)

Your title and keywords are the two highest-leverage places to ensure discoverability.

## The Keyword Strategy

**Step 1:** Before writing your keyword list, search your core topic in Scopus and note the keywords used in the five most-cited papers in your area. These are the terms the field recognises.

**Step 2:** Use a combination of:
- **Broad field terms** (e.g., "bibliometrics", "scholarly communication")
- **Specific method or topic terms** (e.g., "h-index", "author profile", "citation analysis")
- **Geographic/contextual specificity** (e.g., "sub-Saharan Africa", "Nigerian higher education")

**Step 3:** Avoid keywords that duplicate your title. Use the 5–8 keyword slots to extend your discoverability, not repeat it.

## Title Optimisation Revisited

For discovery specifically:
- Lead with the most searched concept, not the most sophisticated concept
- Use the exact term the community uses — not a synonym you prefer
- If your paper could be described in two ways (technical and accessible), consider which version of the title your most important potential citers would search for

---

## Your Action Step
For your next paper, before writing the final title, search your core topic in Scopus and note what terms appear most frequently in the titles of your top 10 search results. Ensure at least two of those terms appear in your title or keywords.

## Key Takeaway
Academic SEO is not about gaming the system — it is about making sure the system can find you. The researchers who write for discovery are found. The ones who write only for their committee are not.
$lc$,
  4, FALSE, TRUE
) ON CONFLICT (module_id, slug) DO NOTHING;

-- M7 · L5
INSERT INTO lessons (module_id, title, slug, lesson_type, content_md, position, is_free_preview, is_published)
VALUES (v_m7,
  'Preprints, Repositories, and Open Archives That Extend Your Reach for Free',
  'preprints-repositories-open-archives',
  'article',
$lc$
## Lesson Aim
Use preprint servers and institutional repositories to expand the reach of your research before and after journal publication — legally, at no cost, with measurable citation benefit.

## Learning Outcomes
By the end of this lesson, you will be able to:
- Describe the function and differences between major preprint servers (arXiv, bioRxiv, SSRN, AfricArXiv)
- Deposit your post-print in an institutional or subject repository legally under your publisher agreement
- Explain how repository deposits affect citation count and Altmetric score

---

## What Preprint Servers Are

A preprint is a version of your paper posted publicly before or during peer review. Preprint servers allow any researcher to read your work — with no paywall — from the moment you post it.

Major servers by field:
- **arXiv** (arxiv.org) — physics, mathematics, computer science, quantitative biology
- **bioRxiv / medRxiv** (biorxiv.org / medrxiv.org) — biology and health sciences
- **SSRN** (ssrn.com) — social sciences, economics, law
- **AfricArXiv** (africarxiv.org) — African research across all disciplines; particularly relevant for Nigerian and African researchers seeking continental and global reach
- **EarthArXiv / ESSOAr** — earth, environmental, and space sciences

## The Citation Benefit

Research by Piwowar and colleagues (2018) found that open access papers receive, on average, 18% more citations than equivalent paywalled papers. For researchers in regions with limited institutional access (including most Nigerian universities), the effect is larger — papers they cannot access, they cannot cite.

Posting a preprint and depositing in an open repository removes this barrier for your work.

## Legal Open Access: The Post-Print Route

Most publishers — including Elsevier, Springer, Wiley, and Taylor & Francis — allow authors to deposit the **accepted manuscript** (your final peer-reviewed version, before journal typesetting) in an institutional or subject repository, typically after an embargo period of 6–12 months.

**How to check:** Visit **Sherpa Romeo** (sherpa.ac.uk/romeo) and search your journal name. It shows exactly what version you can deposit and where.

## Altmetric Score

Altmetric (altmetric.com) tracks online attention to your papers — news coverage, social media mentions, policy document citations, and repository downloads. A higher Altmetric score increasingly appears on grant applications and is used by some institutions as a Broader Impact indicator. Repository deposits and preprint posts contribute to this score.

---

## Your Action Step
Search your most important paper on Sherpa Romeo. Note what post-print deposit rights you have. If an institutional repository is available at your institution, deposit the accepted manuscript today.

## Key Takeaway
Open access is not a compromise — it is a citation strategy. Every paper you make freely accessible to the global research community is a paper that more researchers can find, read, and cite.
$lc$,
  5, FALSE, TRUE
) ON CONFLICT (module_id, slug) DO NOTHING;


END;
$$;
