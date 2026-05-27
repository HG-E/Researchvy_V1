-- ──────────────────────────────────────────────────────────────────────────────
-- 014_seed_level1_course.sql
-- Seeds Level 1 "Research Identity: Be Found Where It Counts"
-- Modules 1–3 (15 lessons). See 015_seed_level1_modules4to7.sql for the rest.
-- IDEMPOTENT: safe to re-run.
-- ──────────────────────────────────────────────────────────────────────────────

DO $$
DECLARE
  v_course UUID;
  v_m1 UUID;
  v_m2 UUID;
  v_m3 UUID;
BEGIN

-- ── COURSE ────────────────────────────────────────────────────────────────────
INSERT INTO courses (
  slug, title, subtitle, description,
  level, position, is_free, is_published, duration_minutes
) VALUES (
  'research-identity',
  'Research Identity: Be Found Where It Counts',
  'Build a verified, cross-platform scholarly profile that discovery systems, promotion panels, and collaborators can actually find.',
  'You''ve published. But right now, nobody can find you. This course changes that permanently. In seven modules covering Scopus, Google Scholar, ORCID, citation mechanics, the h-index, and journal discoverability, you will build a complete academic identity that the systems running your career can see — and act on.',
  1, 1, FALSE, TRUE, 240
)
ON CONFLICT (slug) DO NOTHING;

SELECT id INTO v_course FROM courses WHERE slug = 'research-identity';
IF v_course IS NULL THEN
  RAISE EXCEPTION 'Course insert failed — slug research-identity not found.';
END IF;

-- ════════════════════════════════════════════════════════════════════════════
-- MODULE 1 — Why You're Invisible — And What the System Isn't Telling You
-- ════════════════════════════════════════════════════════════════════════════
IF NOT EXISTS (SELECT 1 FROM modules WHERE course_id = v_course AND position = 1) THEN
  INSERT INTO modules (course_id, title, description, position) VALUES (
    v_course,
    'Why You''re Invisible — And What the System Isn''t Telling You',
    'The foundations of scholarly discovery: how the system works, why most researchers are invisible in it, and how to diagnose your own position today.',
    1
  );
END IF;
SELECT id INTO v_m1 FROM modules WHERE course_id = v_course AND position = 1;

-- M1 · L1 — FREE PREVIEW
INSERT INTO lessons (module_id, title, slug, lesson_type, content_md, position, is_free_preview, is_published)
VALUES (v_m1,
  'The Research Visibility Gap — What It Is and Why It''s Costing You',
  'research-visibility-gap',
  'article',
$lc$
## Lesson Aim
Understand what the research visibility gap is, how scholarly discovery actually works, and why publishing alone is not enough to build a career.

## Learning Outcomes
By the end of this lesson, you will be able to:
- Explain the difference between publishing a paper and being discoverable in academic systems
- Identify the mechanisms by which scholars are found — or missed — by discovery platforms
- Recognise how invisible researchers lose citations, collaborations, and career opportunities they never knew existed

---

## The Gap Nobody Mentions at PhD Orientation

PhD programmes cover methodology, ethics, and referencing. They almost never explain what happens after you publish — specifically, how the system decides whether your work gets found.

The result: researchers with legitimate publications who are functionally invisible to the databases, promotion panels, and collaborators that would otherwise advance their careers.

**Publishing ≠ being discovered.** These are two separate steps. Most researchers only take the first one.

## How the System Actually Works

When a grant reviewer, promotion assessor, or potential collaborator searches your area, they query a database — Scopus, Google Scholar, Web of Science. Results are returned based on metadata: your name, your institution, the journal, and whether your author profile is correctly linked.

If your metadata is fragmented, incorrect, or spread across duplicate records, your work does not appear. Not because your research is weak — because the system cannot find it.

## Two Researchers, One Difference

Two researchers. Same institution. Same output. After five years:
- **Researcher A** — 47 citations, two international collaborations, one unsolicited grant co-authorship offer.
- **Researcher B** — 6 citations, no external contacts, struggling to meet promotion benchmarks.

The only difference: Researcher A spent four hours in year one building and linking their profiles correctly.

---

## Your Action Step
Write down the last time someone you did not already know cited your work or reached out because of it. If you cannot remember a single instance, that is your baseline — and this course is your response.

## Key Takeaway
Visibility is a system, not luck. The researchers who get found are not always the best — they are the ones who understood that publishing is only step one.
$lc$,
  1, TRUE, TRUE
) ON CONFLICT (module_id, slug) DO NOTHING;

-- M1 · L2
INSERT INTO lessons (module_id, title, slug, lesson_type, content_md, position, is_free_preview, is_published)
VALUES (v_m1,
  'The 5 Platforms That Control Your Academic Reputation Right Now',
  '5-platforms-academic-reputation',
  'article',
$lc$
## Lesson Aim
Know which five platforms control academic discovery, what each one does, and why a correct presence on all five is non-negotiable.

## Learning Outcomes
By the end of this lesson, you will be able to:
- Name and describe the role of each of the five primary scholarly platforms
- Identify which platforms carry the most weight in your specific region and career context
- Explain why errors on one platform create cascading problems on the others

---

## The Five Platforms

**Scopus (Elsevier)**
The primary database for Nigerian university promotion panels, NUC assessors, TETFUND reviewers, and European research councils. If you are pursuing promotion in Nigeria or applying to international grants, Scopus is your most critical platform.

**Google Scholar**
Often the first place anyone searches your name — students, journalists, collaborators, and reviewers who want a quick snapshot. Free, public, and high-reach. Errors here propagate automatically to ResearchGate and Semantic Scholar.

**ORCID**
Not a discovery database, but the identity layer that connects you across all the others. Funders including NIH, TETFUND, Wellcome Trust, and EU Horizon are making ORCID mandatory. It is your permanent researcher passport — it follows you through name changes, institution moves, and country changes.

**Web of Science (Clarivate)**
The dominant platform in US and European tenure contexts. High selectivity means indexing here signals quality. Essential for NIH biosketches and NSF grant applications.

**ResearchGate**
The social layer of academic discovery. Lower institutional weight than Scopus or WoS, but strong organic search visibility. Collaborators and PhD students frequently find researchers here first.

## Which Platforms Matter Most by Region

| Region | Primary | Secondary |
|---|---|---|
| Nigeria / West Africa | Scopus | Google Scholar |
| USA | Google Scholar + WoS | Scopus |
| Europe | Web of Science | Scopus |
| Asia (varies) | Scopus | Google Scholar |

---

## Your Action Step
Open all five platforms and search your full name. Record what you find, what is missing, and what is incorrectly attributed. You will use this as your baseline in the next lesson.

## Key Takeaway
You need a correct, complete presence on all five platforms — not because each one matters equally, but because they feed each other, and a gap in one weakens all the others.
$lc$,
  2, FALSE, TRUE
) ON CONFLICT (module_id, slug) DO NOTHING;

-- M1 · L3
INSERT INTO lessons (module_id, title, slug, lesson_type, content_md, position, is_free_preview, is_published)
VALUES (v_m1,
  'Your First Visibility Audit — Where You Actually Stand Today',
  'first-visibility-audit',
  'article',
$lc$
## Lesson Aim
Conduct a structured self-audit across all five scholarly platforms and identify your highest-priority gaps.

## Learning Outcomes
By the end of this lesson, you will be able to:
- Complete a systematic visibility audit across Scopus, Google Scholar, ORCID, Web of Science, and ResearchGate
- Identify broken profiles, missing papers, and duplicate records
- Prioritise which issues to fix first based on career impact

---

## Why Audit Before You Fix

Most researchers jump straight to "fix my Scopus profile" without knowing exactly what is broken. The audit-first approach ensures you spend your time on the highest-impact problems, not just the most visible ones.

## The Five-Platform Checklist

**Scopus**
- Do you have a Scopus Author ID?
- Is it claimed and verified?
- Are all papers attributed to one profile (no duplicates)?
- Is your current institution correct?

**Google Scholar**
- Do you have a claimed, verified profile?
- Are all publications listed and correctly attributed?
- Is your photo, bio, and research interests complete?

**ORCID**
- Do you have an ORCID iD?
- Is your publication list imported?
- Is your profile set to public visibility?

**Web of Science**
- Do you appear in WoS search results?
- Is a ResearcherID linked to your ORCID?

**ResearchGate**
- Does a profile exist (claimed or auto-generated)?
- Is the paper list accurate and up to date?

## Reading Your Results

**Fix immediately:** Duplicate Scopus records, unclaimed profiles, papers attributed to wrong author
**Fix this week:** Missing papers, incomplete bios, unlinked ORCID
**Maintain quarterly:** All profiles complete, consistent, and cross-linked

---

## Your Action Step
Complete the checklist above for all five platforms. Save your findings — you will use this audit throughout the rest of Level 1 to fix each issue systematically.

## Key Takeaway
You cannot improve what you have not measured. Run this audit now, and build the habit of repeating it every quarter.
$lc$,
  3, FALSE, TRUE
) ON CONFLICT (module_id, slug) DO NOTHING;

-- M1 · L4
INSERT INTO lessons (module_id, title, slug, lesson_type, content_md, position, is_free_preview, is_published)
VALUES (v_m1,
  'The 12-Month Visibility Roadmap — What This Academy Will Build For You',
  '12-month-visibility-roadmap',
  'article',
$lc$
## Lesson Aim
Understand the complete five-level Academy journey and set measurable 30/60/90-day visibility milestones for your own career.

## Learning Outcomes
By the end of this lesson, you will be able to:
- Describe what each Academy level builds and what you leave with
- Set specific, measurable 30/60/90-day milestones tied to your audit baseline
- Identify the Level 1 modules that address your highest-priority gaps

---

## The Five-Level Journey

**Level 1 — Research Identity** *(you are here)*
Build a verified, cross-platform scholarly identity. Outcome: every major database knows who you are, your profiles are correct, and your citations are consolidated.

**Level 2 — Research Intelligence**
Understand and use the numbers that drive your career: h-index, journal quartiles, bibliometrics, citation strategy. Outcome: you read your metrics strategically and present them compellingly to any panel.

**Level 3 — Research Presence**
Build digital authority beyond academic databases — LinkedIn, personal site, newsletter, social media. Outcome: you are discoverable by industry, media, and policy audiences, not just other academics.

**Level 4 — Research Impact**
Make your research drive real decisions — policy briefs, media engagement, community partnerships. Outcome: your findings influence outcomes, not just other papers.

**Level 5 — Research Leadership**
Shape the future of scholarship — open science, mentorship, institutional policy reform. Outcome: you lead the systems that govern research rather than reacting to them.

## Your 30/60/90-Day Milestones

Build from your audit results in Lesson 3:

**30 days:** Claim and verify all five platform profiles. Resolve any duplicate Scopus records.
**60 days:** Complete all seven Level 1 modules. Every platform accurate, linked, and consistent.
**90 days:** Begin Level 2. Read your bibliometric profile and be able to explain it confidently to a promotion committee.

---

## Your Action Step
Write one sentence stating your personal visibility goal with a specific 90-day metric attached. Example: *"By [date], all 14 of my papers will be attributed to a single verified Scopus profile, my ORCID will be linked to Scopus and LinkedIn, and my Google Scholar citation count will be accurate."*

## Key Takeaway
The researchers who transform their visibility do so because they set a target and followed a system. You now have both.
$lc$,
  4, FALSE, TRUE
) ON CONFLICT (module_id, slug) DO NOTHING;


-- ════════════════════════════════════════════════════════════════════════════
-- MODULE 2 — Scopus Decoded
-- ════════════════════════════════════════════════════════════════════════════
IF NOT EXISTS (SELECT 1 FROM modules WHERE course_id = v_course AND position = 2) THEN
  INSERT INTO modules (course_id, title, description, position) VALUES (
    v_course,
    'Scopus Decoded — The Platform That Decides Promotions, Grants, and Academic Standing',
    'Master your Scopus Author Profile: claim it, clean duplicate records, recover missing papers, and present it the way a promotion committee reads it.',
    2
  );
END IF;
SELECT id INTO v_m2 FROM modules WHERE course_id = v_course AND position = 2;

-- M2 · L1 — FREE PREVIEW
INSERT INTO lessons (module_id, title, slug, lesson_type, content_md, position, is_free_preview, is_published)
VALUES (v_m2,
  'What Scopus Actually Is and Why It Has So Much Power Over Academic Careers',
  'what-scopus-is-and-why-it-matters',
  'article',
$lc$
## Lesson Aim
Understand what Scopus is, how it indexes research, and why it carries more institutional weight than any other academic database.

## Learning Outcomes
By the end of this lesson, you will be able to:
- Explain the difference between Scopus the journal database and your Scopus Author Profile
- Describe how Nigerian promotion panels, NUC, TETFUND, and US grant reviewers use Scopus
- Identify why a correct Scopus Author Profile is the single highest-impact visibility task for most researchers

---

## What Scopus Is

Scopus, published by Elsevier, is the world's largest abstract and citation database of peer-reviewed literature. As of 2025, it indexes over 27,000 journals, 100,000 books, and 10 million conference papers.

But Scopus is not just a journal database. It is also an **author profiling system**. Every researcher who has published in a Scopus-indexed journal gets — or should get — a Scopus Author Profile: a unique record linking all your publications, your citation count, and your h-index.

## The Author Profile vs the Database

These are two different things:

**Scopus the database** → contains all indexed papers
**Your Scopus Author Profile** → the record that links those papers to *you*

The database might correctly index your paper. But if your Author Profile has a duplicate record, wrong affiliation, or inconsistent name, that paper is not correctly attributed to you. Promotion committees searching your name may not see it.

## Who Uses Scopus and Why It Matters

In **Nigeria**, university promotion panels use Scopus as the primary measure of research output. NUC accreditation assessors check Scopus-indexed publications. TETFUND grant reviewers weight Scopus citations heavily.

In the **USA**, Scopus feeds into grant review systems (NIH, NSF), tenure dossiers, and institutional ranking metrics.

In **Europe**, the Erasmus+, ERC, and Horizon funding systems all reference Scopus data.

---

## Your Action Step
Search your name on Scopus (scopus.com/search/form.uri#author). Note whether you have one Author Profile or multiple. Note your current document count and h-index. Screenshot both for your records.

## Key Takeaway
Scopus is not optional for academic career progression. Understanding it — and controlling your profile in it — is a foundational career skill that most researchers learn too late.
$lc$,
  1, TRUE, TRUE
) ON CONFLICT (module_id, slug) DO NOTHING;

-- M2 · L2
INSERT INTO lessons (module_id, title, slug, lesson_type, content_md, position, is_free_preview, is_published)
VALUES (v_m2,
  'How to Claim, Verify, and Take Control of Your Scopus Author ID',
  'claim-scopus-author-id',
  'article',
$lc$
## Lesson Aim
Claim and verify your Scopus Author ID using the correct process, and understand why unverified profiles are a career risk.

## Learning Outcomes
By the end of this lesson, you will be able to:
- Find your Scopus Author ID if it already exists
- Create a new Author Profile if one does not exist
- Complete the verification process and understand what it protects

---

## Finding Your Existing Author ID

Most researchers who have published in Scopus-indexed journals already have an Author ID — they just don't know it.

**Step 1:** Go to scopus.com and click *Author Search*.
**Step 2:** Enter your surname and first name. Use both your full name and initials (e.g., "Okafor, C." and "Okafor, Chukwuemeka").
**Step 3:** Review the results. Look for a profile with papers you recognise.

If you find one, note the Author ID number (it appears in the URL: `authorId=XXXXXXXXX`).

## If No Profile Exists

If no profile appears, you either have not yet published in a Scopus-indexed journal, or your papers were indexed under a different name variation. Check:
- Maiden name or previous name
- Different initials
- Affiliation name variations

If you genuinely have no profile, it will be created automatically once your next Scopus-indexed paper is published.

## The Verification Process

Claiming your profile means logging in to Scopus with your institutional or ORCID credentials and officially linking the Author ID to your account. This:
- Prevents other researchers from being merged into your profile
- Allows you to directly request corrections
- Gives you access to Scopus Author Feedback Wizard for merge requests

**Without verification**, your profile is vulnerable to automatic merges and errors you cannot control.

---

## Your Action Step
Search Scopus for your Author ID today. If you find it, log in and claim it. If you find multiple — do not merge yet; that is the next lesson.

## Key Takeaway
Claiming your Scopus Author ID takes under 15 minutes and is the single most important protective action you can take for your bibliometric record.
$lc$,
  2, FALSE, TRUE
) ON CONFLICT (module_id, slug) DO NOTHING;

-- M2 · L3
INSERT INTO lessons (module_id, title, slug, lesson_type, content_md, position, is_free_preview, is_published)
VALUES (v_m2,
  'The Duplicate Record Problem — How to Merge Scattered Papers and Reclaim Your Full Citation Count',
  'duplicate-scopus-records',
  'article',
$lc$
## Lesson Aim
Understand why Scopus creates duplicate author profiles, find all your scattered records, and submit a merge request correctly.

## Learning Outcomes
By the end of this lesson, you will be able to:
- Explain the three most common causes of Scopus duplicate profiles
- Search for all records associated with your name across different variations
- Submit a merge request through the Scopus Author Feedback Wizard

---

## Why Duplicates Happen

Scopus creates a new Author Profile whenever it cannot match an incoming publication to an existing one. The most common triggers:

1. **Name variations** — "C. Okafor," "Chukwuemeka Okafor," and "C.E. Okafor" may generate three separate profiles
2. **Institution changes** — Moving from one university to another can cause Scopus to create a second profile
3. **Journal metadata errors** — Publisher typos in author name fields create phantom records

The result: your total citation count and h-index are split across multiple profiles. Any person searching your name sees a fraction of your real output.

## Finding All Your Records

**Step 1:** Search Scopus Author Search with every variation of your name you have ever used in publications.
**Step 2:** Search again with your institution names (current and all previous).
**Step 3:** List every Author ID you find that contains papers genuinely yours.

## Submitting the Merge Request

**Step 1:** Log in to Scopus with your claimed account.
**Step 2:** Navigate to *My Scopus → Author Profile → Request author detail corrections*.
**Step 3:** Use the **Author Feedback Wizard** to select all Author IDs that belong to you.
**Step 4:** Submit the merge request. Scopus typically processes these within 10–15 business days.

You can track the status of your request under *My Scopus → Corrections*.

---

## Your Action Step
Search for all name and institution variations and compile a list of every Scopus Author ID that belongs to you. If there are more than one, submit a merge request today.

## Key Takeaway
Every duplicate profile you leave unmerged is citation count and h-index that your promotion committee will never see. The merge process is free, straightforward, and permanent.
$lc$,
  3, FALSE, TRUE
) ON CONFLICT (module_id, slug) DO NOTHING;

-- M2 · L4
INSERT INTO lessons (module_id, title, slug, lesson_type, content_md, position, is_free_preview, is_published)
VALUES (v_m2,
  'How to Get Missing Papers Added to Your Scopus Profile',
  'missing-papers-scopus',
  'article',
$lc$
## Lesson Aim
Understand why papers go missing from Scopus profiles and use the correct process to recover them.

## Learning Outcomes
By the end of this lesson, you will be able to:
- Identify the three reasons a paper published in a Scopus-indexed journal may not appear in your profile
- Use the self-service correction pathway to add missing papers
- Know what to do if your journal is not yet Scopus-indexed

---

## Why Papers Go Missing

**Reason 1: The paper is indexed but attributed to a duplicate profile.**
The paper is in Scopus — just under a different Author ID (usually a name variation). Fix: merge the duplicate records (see previous lesson).

**Reason 2: The paper is indexed but attributed to someone else.**
A common name variant caused Scopus to attribute your paper to another researcher. Fix: use the Author Feedback Wizard to claim the paper.

**Reason 3: The paper has not been indexed yet.**
Scopus indexes on a rolling basis. There is typically a delay of 4–12 weeks after journal publication before a paper appears. If it has been more than three months, the paper may require manual addition.

## The Self-Service Correction Path

1. Log in to your claimed Scopus Author Profile
2. Go to *My Scopus → Author Profile → Add missing documents*
3. Search by DOI or paper title
4. If the paper appears, add it directly
5. If it does not appear in Scopus at all, use the Contact Support form and provide the DOI, journal name, and publication date

## If Your Journal Is Not Scopus-Indexed

Scopus does not index all journals. If a paper was published in a non-indexed journal, it will not appear in Scopus regardless of corrections.

Your options:
- Note this paper in your profile under Google Scholar and ResearchGate instead
- Factor journal indexing status into your submission decisions going forward (covered in Module 7)

---

## Your Action Step
Cross-reference your complete publication list against your Scopus profile. Identify any missing papers and determine which category they fall into. Begin the recovery process for any in categories 1 or 2 today.

## Key Takeaway
Missing papers are not lost — they are misattributed or pending. A systematic check and correction process recovers them fully.
$lc$,
  4, FALSE, TRUE
) ON CONFLICT (module_id, slug) DO NOTHING;

-- M2 · L5
INSERT INTO lessons (module_id, title, slug, lesson_type, content_md, position, is_free_preview, is_published)
VALUES (v_m2,
  'Reading Your Scopus Profile the Way a Promotion Committee Reads It',
  'reading-scopus-profile',
  'article',
$lc$
## Lesson Aim
Learn to read your own Scopus profile from the perspective of a promotion assessor — understanding exactly what they look at, in what order, and what signals quality.

## Learning Outcomes
By the end of this lesson, you will be able to:
- Identify the five profile fields that assessors examine first
- Interpret your document count, citation count, h-index, and co-author network in context
- Compare your profile against benchmarks appropriate to your field and career stage

---

## What Assessors Actually Look At

When a Nigerian promotion committee, NUC assessor, or international grant reviewer opens your Scopus profile, they look at these fields in approximately this order:

1. **Document count** — total publications in Scopus-indexed journals
2. **Citation count** — total times your work has been cited by others
3. **h-index** — consistency of citation impact across your body of work
4. **Affiliation history** — institutional trajectory (does it show growth?)
5. **Co-author network** — breadth of collaboration (national and international?)

## The Five Fields That Must Be Accurate

A single error in any of these fields can misrepresent your career:

- **Name** — must match exactly how you publish
- **Affiliation** — current institution must be current
- **Subject area** — must reflect your actual field
- **Publication years** — must be complete (no missing older papers)
- **Co-author links** — broken links reduce perceived collaboration reach

## Benchmarking Yourself Correctly

There is no universal "good" h-index. Context is everything:

| Context | Typical expectation |
|---|---|
| Nigerian Lecturer I promotion | h-index 2–4, Scopus-indexed papers |
| Nigerian Professor promotion | h-index 8–15+ depending on discipline |
| US early-career faculty | h-index 5–10 at 5 years post-PhD |
| Established EU researcher | h-index 10–20 depending on field |

Compare yourself to peers at the same career stage in the same discipline — not to senior professors or different fields.

---

## Your Action Step
Open your Scopus profile and score yourself on the five fields above. Flag any that are incomplete or inaccurate. The next lesson gives you the full checklist to fix them.

## Key Takeaway
Knowing how your profile is read is as important as building it correctly. Assessors spend under three minutes on your profile — make every field count.
$lc$,
  5, FALSE, TRUE
) ON CONFLICT (module_id, slug) DO NOTHING;

-- M2 · L6
INSERT INTO lessons (module_id, title, slug, lesson_type, content_md, position, is_free_preview, is_published)
VALUES (v_m2,
  'The Scopus Profile Checklist That Passes Any Institutional Review',
  'scopus-profile-checklist',
  'article',
$lc$
## Lesson Aim
Use a complete, actionable checklist to bring your Scopus profile to promotion-ready standard and establish a maintenance habit that keeps it there.

## Learning Outcomes
By the end of this lesson, you will be able to:
- Apply a 12-point checklist to audit and complete your Scopus profile
- Set up Scopus citation alerts for ongoing monitoring
- Establish a quarterly 15-minute update habit

---

## The 12-Point Scopus Profile Checklist

Work through each item before considering your profile complete:

**Identity**
- [ ] Single verified Author ID (all duplicates merged)
- [ ] Name matches your published name exactly
- [ ] Current institutional affiliation is correct and up to date
- [ ] Subject area accurately reflects your discipline

**Publications**
- [ ] All published papers are listed (cross-checked against your CV)
- [ ] No papers by other authors are incorrectly attributed to you
- [ ] All papers show correct co-authors and affiliations
- [ ] DOI links are functioning for all papers

**Metrics**
- [ ] h-index is displaying correctly
- [ ] Citation count is accurate (test by clicking through to citing papers)
- [ ] Document count matches your actual publication list

**Monitoring**
- [ ] Citation alerts are set up (My Scopus → Alerts)

## Setting Up Scopus Alerts

Under *My Scopus*, set an alert for:
1. Your Author ID — you are notified whenever a new paper cites your work
2. Your key research keywords — track emerging work in your field

These alerts give you early intelligence on who is engaging with your research and where the field is moving.

## The Quarterly Update Habit

Schedule 15 minutes every quarter to:
- Check for new papers that should be added
- Verify your current affiliation is correct
- Review any new citations for potential collaboration opportunities

---

## Your Action Step
Work through all 12 items on the checklist today. Mark each as complete, in progress, or not applicable. Set up at least one Scopus alert before closing this lesson.

## Key Takeaway
A promotion-ready Scopus profile is not built once — it is maintained. Fifteen minutes per quarter is all it takes to keep it clean, current, and compelling.
$lc$,
  6, FALSE, TRUE
) ON CONFLICT (module_id, slug) DO NOTHING;


-- ════════════════════════════════════════════════════════════════════════════
-- MODULE 3 — Google Scholar Mastery
-- ════════════════════════════════════════════════════════════════════════════
IF NOT EXISTS (SELECT 1 FROM modules WHERE course_id = v_course AND position = 3) THEN
  INSERT INTO modules (course_id, title, description, position) VALUES (
    v_course,
    'Google Scholar Mastery — The Profile Errors That Are Silently Costing You Citations',
    'Fix the most common Google Scholar mistakes, claim every paper you have published, and set up the monitoring tools that keep your profile accurate automatically.',
    3
  );
END IF;
SELECT id INTO v_m3 FROM modules WHERE course_id = v_course AND position = 3;

-- M3 · L1 — FREE PREVIEW
INSERT INTO lessons (module_id, title, slug, lesson_type, content_md, position, is_free_preview, is_published)
VALUES (v_m3,
  'Why Your Google Scholar Profile May Be Working Against You Right Now',
  'google-scholar-profile-errors',
  'article',
$lc$
## Lesson Aim
Identify the three most common Google Scholar errors and understand how unclaimed or incorrect profiles actively reduce your citation count and visibility.

## Learning Outcomes
By the end of this lesson, you will be able to:
- Name the three errors that most commonly reduce citation counts in Google Scholar
- Explain how Google Scholar feeds data into ResearchGate, Semantic Scholar, and institutional systems
- Assess whether your own profile has any of these errors

---

## Google Scholar Is Not Neutral

Most researchers assume Google Scholar is simply a search engine — passive, automatic, correct. It is not.

Google Scholar builds researcher profiles algorithmically. When it makes an attribution error, that error becomes the basis for other platforms. The three most common errors:

## Error 1: The Unclaimed Profile

Google Scholar often creates a profile for you automatically, based on papers it finds across the web. This profile may be incomplete, may contain papers by someone with a similar name, or may have an incorrect affiliation. Until you claim it, you cannot correct it.

**Impact:** Collaborators find a partial, potentially misleading version of your work. Citation counts are split or misattributed.

## Error 2: Missing Papers

Google Scholar does not index everything. Papers behind strict paywalls, papers in small regional journals, and older papers from before a journal was digitised may not appear. If you have not manually added them, they are not in your profile.

**Impact:** Your total output appears lower than it is. Researchers following your work miss your older or regional publications.

## Error 3: Papers by the Wrong "You"

Common names are particularly vulnerable. If another researcher shares your name, their papers may appear in your profile — and yours in theirs.

**Impact:** Your citation metrics include noise, and your profile reads as if you work across incompatible fields.

## How Google Scholar Feeds Other Platforms

When Google Scholar data is wrong, the errors propagate. ResearchGate pulls from Google Scholar for paper recommendations. Semantic Scholar uses it for citation graphs. Institutional profile systems often link directly to Google Scholar data.

One wrong profile = errors on multiple platforms simultaneously.

---

## Your Action Step
Search your name on Google Scholar (scholar.google.com). Without logging in, look at the top result. Count: how many papers are listed, whether any appear to belong to another researcher, and whether the affiliation shown is current. Record what you find.

## Key Takeaway
An unclaimed, incorrect Google Scholar profile is not just a missed opportunity — it is actively misrepresenting your scholarly output to everyone who searches for you.
$lc$,
  1, TRUE, TRUE
) ON CONFLICT (module_id, slug) DO NOTHING;

-- M3 · L2
INSERT INTO lessons (module_id, title, slug, lesson_type, content_md, position, is_free_preview, is_published)
VALUES (v_m3,
  'Claiming, Verifying, and Owning Every Paper You Have Published',
  'claiming-google-scholar-papers',
  'article',
$lc$
## Lesson Aim
Create or verify your Google Scholar profile and ensure every paper you have published is correctly listed and attributed to you.

## Learning Outcomes
By the end of this lesson, you will be able to:
- Create or claim a Google Scholar profile using the correct email and settings
- Search for and add missing publications manually
- Handle papers incorrectly attributed to another author

---

## Creating or Claiming Your Profile

**If you do not have a profile:**
1. Go to scholar.google.com and click *My Profile* (sign in with a Google account)
2. Enter your name and current institutional affiliation
3. Add a profile photo and research interests
4. Google will suggest papers it believes are yours — review carefully before confirming

**If a profile already exists (auto-generated or unclaimed):**
1. Sign in to Google Scholar with the email associated with your institutional domain if possible
2. Search your name and click *Verify your affiliation*
3. Google Scholar will send a verification email to your institution address

**Pro tip:** Use your institutional email address for verification if possible. It signals credibility and makes future affiliation updates automatic.

## Adding Missing Papers

1. In your profile, click the *+* button → *Add articles*
2. Search by paper title, DOI, or co-author name
3. Review carefully — confirm the paper is yours before adding
4. If a paper does not appear in search, click *Add article manually* and enter all details

## Handling Misattributed Papers

If a paper by another researcher appears in your profile:
1. Click the paper → *Not mine? Remove this article*
2. Google will remove it from your profile (it remains in the database)

If your paper appears in someone else's profile, you cannot remove it directly. Add it correctly to your own profile — over time, citation analytics will self-correct.

---

## Your Action Step
Create or verify your profile, then cross-reference your publication list against what Google Scholar shows. Add every missing paper before moving to the next lesson.

## Key Takeaway
A verified, complete Google Scholar profile takes one afternoon to build correctly and delivers citation visibility improvements that compound for the rest of your career.
$lc$,
  2, FALSE, TRUE
) ON CONFLICT (module_id, slug) DO NOTHING;

-- M3 · L3
INSERT INTO lessons (module_id, title, slug, lesson_type, content_md, position, is_free_preview, is_published)
VALUES (v_m3,
  'Photo, Bio, Research Interests — The Profile Elements Most Researchers Skip',
  'google-scholar-bio-interests',
  'article',
$lc$
## Lesson Aim
Complete the non-publication elements of your Google Scholar profile — photo, bio, and research interests — and understand why they affect how your profile surfaces in searches.

## Learning Outcomes
By the end of this lesson, you will be able to:
- Write research interests that match the terms collaborators and citers actually search
- Understand how research interests influence how Google Scholar surfaces your profile in related searches
- Complete a professional, credibility-signalling profile photo and bio

---

## Why These Elements Matter

Most researchers focus entirely on publications and ignore the profile metadata. This is a significant visibility error.

Google Scholar uses your **research interest keywords** as signals for surfacing your profile in related searches. When another researcher searches for work in your area, Scholar returns author profiles alongside paper results. Profiles with relevant keywords appear; profiles without do not.

Your **profile photo and bio** are the first thing a collaborator or potential citer sees when they click through to your profile. A professional photo and a clear one-paragraph bio signal legitimacy and make it easy for people to understand your work at a glance.

## Writing Effective Research Interests

Research interests on Google Scholar are tags, not sentences. Use:
- **Field terms** that appear in paper titles and abstracts in your area (e.g., "scientometrics", "research visibility", "bibliometrics")
- **Method terms** if your methods are distinctive (e.g., "systematic review", "mixed methods")
- **Application terms** if you work in a specific applied context (e.g., "Nigerian higher education", "sub-Saharan Africa")

**Avoid:** vague terms like "research," "science," "education." These are too broad to drive targeted discovery.

**Aim for:** 4–6 specific, searchable terms that a peer in your field would use to find work like yours.

## The Profile Photo Standard

Use a professional headshot (not a group photo, not a logo, not a cartoon). This is not vanity — it is a credibility signal. Profiles with photos receive more profile views and more connection requests.

---

## Your Action Step
Update your Google Scholar profile photo, write or revise your bio (one paragraph, focus on your research area and institutional context), and add or refine your research interest keywords.

## Key Takeaway
The non-publication elements of your Google Scholar profile are not cosmetic — they are the metadata that determines whether you surface in related searches at all.
$lc$,
  3, FALSE, TRUE
) ON CONFLICT (module_id, slug) DO NOTHING;

-- M3 · L4
INSERT INTO lessons (module_id, title, slug, lesson_type, content_md, position, is_free_preview, is_published)
VALUES (v_m3,
  'Citation Alerts — Know the Moment Someone Cites Your Work',
  'google-scholar-citation-alerts',
  'article',
$lc$
## Lesson Aim
Set up Google Scholar citation alerts to receive real-time intelligence when your work is cited, your name appears in new papers, or your research keywords trend.

## Learning Outcomes
By the end of this lesson, you will be able to:
- Create citation alerts for your name, key papers, and research keywords
- Use citation alerts to identify potential collaborators and track research conversations in your field
- Explain how early citation intelligence provides a strategic career advantage

---

## Why Citation Alerts Change Your Awareness

Without alerts, you discover citations by accident — months later, during a profile review. With alerts, you know within days.

This matters because:
- A researcher citing your work is a warm introduction to a potential collaborator
- A cluster of new citations on one paper signals growing interest — and a follow-up paper opportunity
- Seeing your keywords trending in new papers tells you where your field is heading

## Setting Up Your Three Essential Alerts

**Alert 1: Your name**
1. Go to scholar.google.com/scholar_alerts
2. Click *Create alert*
3. Enter your full name in quotation marks: "Chukwuemeka Okafor"
4. Set delivery to *As-it-happens* or *Once a day*

**Alert 2: Your top 3 papers**
Repeat the above for the exact title of each of your most important papers (in quotes). This catches citations that may not mention your name directly (e.g., citing the paper by DOI or partial title).

**Alert 3: Your core research keywords**
Create alerts for 2–3 of your primary research keywords. This keeps you updated on emerging work you should be aware of — both for your own research and to identify researchers whose work intersects with yours.

## Using Alerts Strategically

When you receive an alert that someone has cited your paper:
1. Read their paper — does their work connect with yours meaningfully?
2. If yes, look at their profile. Are they a potential collaborator?
3. If the connection is strong, a brief, substantive email introducing yourself is legitimate academic outreach.

---

## Your Action Step
Create three Google Scholar alerts today: your name in quotes, your most-cited paper title in quotes, and your primary research keyword. Save the alert confirmation emails.

## Key Takeaway
Citation alerts transform your relationship with your own research from passive to active. You stop finding out who cited you and start knowing when it happens.
$lc$,
  4, FALSE, TRUE
) ON CONFLICT (module_id, slug) DO NOTHING;

-- M3 · L5
INSERT INTO lessons (module_id, title, slug, lesson_type, content_md, position, is_free_preview, is_published)
VALUES (v_m3,
  'How Google Scholar Accuracy Ripples Across Every Other Platform',
  'google-scholar-cross-platform-impact',
  'article',
$lc$
## Lesson Aim
Understand how Google Scholar data feeds into other platforms and why correcting your Scholar profile creates cascading improvements across your entire scholarly presence.

## Learning Outcomes
By the end of this lesson, you will be able to:
- Explain the cross-platform indexing chain and how Scholar errors propagate
- Describe the downstream effect of a clean Google Scholar profile on ResearchGate and Semantic Scholar
- Establish a quarterly 10-minute Google Scholar maintenance habit

---

## The Cross-Platform Indexing Chain

Google Scholar is not an island. It sits at the centre of a network of platforms that pull from it:

**ResearchGate** uses Scholar data for paper recommendations and citation tracking. When your Scholar profile is incomplete, ResearchGate recommends fewer of your papers to other researchers.

**Semantic Scholar** (from the Allen Institute for AI) builds its citation graphs partly from Scholar data. Errors in Scholar create errors in Semantic Scholar's understanding of your citation network.

**Institutional profile systems** at many universities link directly to Google Scholar. A faculty profile page may display your Scholar citation count and h-index automatically — meaning an incorrect Scholar profile creates a wrong institutional profile.

**Media and public-facing searches** — journalists, policy makers, and the public searching your name on Google often see your Scholar profile on the first page of results.

## One Correct Profile Lifts All the Others

The practical implication: the hour you spend completing and correcting your Google Scholar profile does not just improve Scholar. It improves every downstream system that pulls from it.

This is the compound return on profile investment: one correct source propagates accurate data to five, six, seven other platforms automatically.

## The Quarterly Maintenance Habit

Once your profile is correct, maintenance is simple:

**Every quarter (10 minutes):**
- [ ] Check for new papers Google has suggested to your profile — confirm or reject
- [ ] Verify your current affiliation is showing correctly
- [ ] Check for any papers that have appeared under your name but belong to another researcher — remove them
- [ ] Review the top three papers listed — are citations counts reasonable?

---

## Your Action Step
After completing your Google Scholar profile this module, schedule a recurring quarterly calendar reminder titled "Google Scholar check." Set it for 10 minutes.

## Key Takeaway
One accurate Google Scholar profile creates a chain reaction of accuracy across your entire scholarly presence. The effort is front-loaded — the benefits are permanent.
$lc$,
  5, FALSE, TRUE
) ON CONFLICT (module_id, slug) DO NOTHING;


END;
$$;
