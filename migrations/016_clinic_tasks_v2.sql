-- 016_clinic_tasks_v2.sql
-- Replace the original 6-session DVC tasks with the new 5-module structure:
-- Module 1: ORCID · Module 2: LinkedIn · Module 3: WordPress
-- Bonus A (Module 4): Indexing · Bonus B (Module 5): Publishing Strategy

DELETE FROM clinic_session_tasks WHERE clinic_slug = 'digital-visibility-clinic';

-- ═══════════════════════════════════════════════════════════════════════════════
-- Module 1 — ORCID: Your Research Passport
-- ═══════════════════════════════════════════════════════════════════════════════
INSERT INTO clinic_session_tasks (clinic_slug, session_number, task_order, title, description, task_type) VALUES
('digital-visibility-clinic', 1, 1, 'Register or reclaim your ORCID iD',
 'Go to orcid.org. Create a new ORCID iD if you do not have one, or log in and verify your existing one. Your iD follows the format: 0000-0000-0000-0000. If you find duplicate profiles for your name, note them — you will address this in the next task.',
 'action'),
('digital-visibility-clinic', 1, 2, 'Resolve any duplicate ORCID profiles',
 'Search orcid.org for your name. If more than one ORCID profile exists for you (common after institutional moves or name changes), contact ORCID support to merge or close the duplicates. One canonical iD per researcher is the rule.',
 'action'),
('digital-visibility-clinic', 1, 3, 'Import all your publications into ORCID',
 'In your ORCID profile, use "Add works → Search & link" to import publications from Scopus, Crossref, PubMed, or your institutional repository. Import all published work and verify that titles, authors, and publication years are correct.',
 'action'),
('digital-visibility-clinic', 1, 4, 'Connect your institutional email and employer record',
 'In ORCID settings, add your current institutional email address and mark it as a trusted source. Then add your current institution as your employer in the Employment section, creating the verified link between your iD and your institution.',
 'action'),
('digital-visibility-clinic', 1, 5, 'Link ORCID to Google Scholar and Scopus',
 'In your Google Scholar profile settings, add your ORCID iD. In Scopus, claim your Author ID and add your ORCID in the profile editor. Then set all sections of your ORCID profile to public visibility so all linked platforms can verify it.',
 'action'),
('digital-visibility-clinic', 1, 6, 'Write your ORCID biography and make your profile fully public',
 'Write a 3–4 sentence researcher biography in your ORCID profile. Include your discipline, institutional affiliation, main research focus, and one key achievement. Set every section of your ORCID profile to public visibility.',
 'action');

-- ═══════════════════════════════════════════════════════════════════════════════
-- Module 2 — LinkedIn: Your Global Academic Presence
-- ═══════════════════════════════════════════════════════════════════════════════
INSERT INTO clinic_session_tasks (clinic_slug, session_number, task_order, title, description, task_type) VALUES
('digital-visibility-clinic', 2, 1, 'Rewrite your LinkedIn headline for discoverability',
 'Your headline is the most visible text on your profile. Write a new headline that includes your academic title, your research specialisation, and your institution. Do not just paste your job title — write for the person searching for an expert in your area.',
 'action'),
('digital-visibility-clinic', 2, 2, 'Rewrite your About section for an academic audience',
 'Write a LinkedIn About section of 150–250 words. Include: what you research and why it matters, your key outputs (publications, grants, projects), your institutional home, and how to reach you. First person, active voice, no jargon.',
 'action'),
('digital-visibility-clinic', 2, 3, 'Build your Featured section with key academic outputs',
 'Add 3–5 items to your LinkedIn Featured section. Prioritise: your most important paper (with DOI link), your ORCID profile URL, a conference presentation or project, and any press or media coverage of your work.',
 'action'),
('digital-visibility-clinic', 2, 4, 'Update your Skills with research-relevant keywords',
 'Add at least 10 skills to your LinkedIn profile focused on your research domain, methods, and tools. Include both broad terms (e.g. "Research Methods") and specific ones relevant to your discipline. Ask 3 colleagues to endorse your top skills.',
 'action'),
('digital-visibility-clinic', 2, 5, 'Connect with 20 academics in your field',
 'Send connection requests to: 5 colleagues at your institution, 5 researchers at other Nigerian universities in your discipline, 5 researchers from other African countries, and 5 researchers globally. Add a personalised note to each request.',
 'action'),
('digital-visibility-clinic', 2, 6, 'Draft and publish your first research LinkedIn post',
 'Write and publish a LinkedIn post about your research. Options: share a key finding from a recent paper, reflect on a conference, explain a concept to a non-specialist, or share a useful resource for researchers in your field. Aim for 150–250 words.',
 'action');

-- ═══════════════════════════════════════════════════════════════════════════════
-- Module 3 — WordPress: Your Permanent Academic Home
-- ═══════════════════════════════════════════════════════════════════════════════
INSERT INTO clinic_session_tasks (clinic_slug, session_number, task_order, title, description, task_type) VALUES
('digital-visibility-clinic', 3, 1, 'Register your academic domain name',
 'Choose and register a domain for your academic website. Ideal formats: yourfullname.com, yourname.org, or yournameresearch.com. The domain should be your name — not your institution — so it stays with you throughout your career. Avoid hyphens or numbers.',
 'action'),
('digital-visibility-clinic', 3, 2, 'Set up WordPress hosting and install WordPress',
 'Choose a hosting provider with one-click WordPress installation. Install WordPress on your domain. Log in to your WordPress dashboard and confirm the site is live. Store your admin URL and credentials securely.',
 'action'),
('digital-visibility-clinic', 3, 3, 'Install and configure an academic WordPress theme',
 'Install a clean, professional theme suited to academic use. Recommended free options: Kadence, Astra, or GeneratePress. Set your site title to your name and your tagline to your research specialisation. Upload a professional headshot as your site icon.',
 'action'),
('digital-visibility-clinic', 3, 4, 'Build your five essential academic pages',
 'Create and publish five pages: (1) About — who you are and what you research; (2) Research — your projects and current work; (3) Publications — your full list with DOI links; (4) CV — a downloadable PDF; (5) Contact — your institutional email plus links to ORCID and LinkedIn.',
 'action'),
('digital-visibility-clinic', 3, 5, 'Submit your site to Google Search Console',
 'Add your website to Google Search Console and verify ownership using the HTML tag method in WordPress. Submit your sitemap (yoursite.com/sitemap_index.xml, or generate one with the Yoast SEO plugin). This tells Google your site exists and should be indexed.',
 'action'),
('digital-visibility-clinic', 3, 6, 'Connect all three platforms: ORCID ↔ LinkedIn ↔ WordPress',
 'On your WordPress site, add your ORCID iD with a link badge and link to your LinkedIn profile. In your LinkedIn Featured section, add your website URL. In your ORCID profile, add your website in "Websites & Social Links." All three platforms should now point to each other.',
 'action');

-- ═══════════════════════════════════════════════════════════════════════════════
-- Module 4 — Indexing: Google Scholar, Scopus & WoS (Bonus A)
-- ═══════════════════════════════════════════════════════════════════════════════
INSERT INTO clinic_session_tasks (clinic_slug, session_number, task_order, title, description, task_type) VALUES
('digital-visibility-clinic', 4, 1, 'Audit and optimise your Google Scholar profile',
 'Log in to Google Scholar. Check: profile photo, institutional email verification, current institution, and research interest keywords. Review all publications — any missing or mis-attributed? Claim unclaimed papers and remove any wrongly attributed ones.',
 'action'),
('digital-visibility-clinic', 4, 2, 'Claim and complete your Scopus Author ID',
 'Search scopus.com for your name. Find your Scopus Author profile and use "I am this author" to claim it. If you have multiple Scopus profiles (common after institutional moves or name changes), submit a merge request via the Scopus Author Feedback wizard.',
 'action'),
('digital-visibility-clinic', 4, 3, 'Compare your h-index across all three databases',
 'Record your current h-index from: (1) Google Scholar, (2) Scopus, (3) Web of Science (if accessible). Write down all three values and the total citation count from each. If they differ significantly, investigate which papers are missing from which database.',
 'action'),
('digital-visibility-clinic', 4, 4, 'Set up citation alerts across all databases',
 'In Google Scholar, enable email alerts for citations of your papers and for new papers matching your keywords. In Scopus, set up Author Alerts. This way you know when your work is cited and can stay current in your field without constant manual checking.',
 'action'),
('digital-visibility-clinic', 4, 5, 'Identify your open access gaps and take one action',
 'Review your 5 most-cited papers. For any not freely available online, check whether you can legally post an accepted manuscript to an open repository: PubMed Central, AfricArXiv, Zenodo, or your institutional repository. Take at least one concrete open access action this week.',
 'action');

-- ═══════════════════════════════════════════════════════════════════════════════
-- Module 5 — Publishing Strategy for Nigerian & African Researchers (Bonus B)
-- ═══════════════════════════════════════════════════════════════════════════════
INSERT INTO clinic_session_tasks (clinic_slug, session_number, task_order, title, description, task_type) VALUES
('digital-visibility-clinic', 5, 1, 'Research 5 target journals using Scimago and Scopus',
 'Choose 5 journals in your discipline that you would realistically target for your next submission. For each, look up: their Scimago Journal Rank (SJR), CiteScore, quartile (Q1–Q4), h-index, and typical time-to-decision. Focus on journals indexed in Scopus or Web of Science.',
 'action'),
('digital-visibility-clinic', 5, 2, 'Check your target journals against predatory indicators',
 'For each of your 5 target journals, check: (1) Beall''s List of predatory journals (retracted scholars list), (2) the Cabells Predatory Reports database, (3) the DOAJ for legitimate OA journals. Any journal not indexed in Scopus, WoS, or DOAJ warrants closer investigation before submission.',
 'action'),
('digital-visibility-clinic', 5, 3, 'Upload one paper to AfricArXiv',
 'Create an account on africarxiv.org. Upload one of your published papers (check your publisher agreement for self-archiving rights — most allow accepted manuscript deposit after an embargo). Add complete metadata: abstract, keywords, discipline, and co-author details.',
 'action'),
('digital-visibility-clinic', 5, 4, 'Write your 12-month publication pipeline',
 'Plan your publication output for the next 12 months. Include: papers currently being written (with target submission months), papers under revision, planned conference submissions, and one paper you will convert to open access. Be specific with months, not just quarters.',
 'reflection'),
('digital-visibility-clinic', 5, 5, 'Write your publishing strategy reflection',
 'In one paragraph: (1) the single biggest gap in your publishing strategy that this masterclass revealed, (2) the one concrete action you will take in the next 30 days to address it, and (3) how you will measure whether your publishing visibility has improved in 6 months.',
 'reflection');
