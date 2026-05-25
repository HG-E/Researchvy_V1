-- 009_clinic_tasks.sql
-- E-learning task system for the Digital Visibility Clinic
-- Three tables: task definitions, admin session unlocks, participant completion

-- ── Task definitions ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS clinic_session_tasks (
  id             UUID     PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_slug    TEXT     NOT NULL,
  session_number SMALLINT NOT NULL,
  task_order     SMALLINT NOT NULL,
  title          TEXT     NOT NULL,
  description    TEXT,
  task_type      TEXT     NOT NULL DEFAULT 'action'
                   CHECK (task_type IN ('action', 'reflection')),
  UNIQUE (clinic_slug, session_number, task_order)
);

ALTER TABLE clinic_session_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tasks_public_read" ON clinic_session_tasks FOR SELECT USING (true);

-- ── Admin session unlocks ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS clinic_session_unlocks (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_slug    TEXT        NOT NULL,
  cohort_id      TEXT        NOT NULL,
  session_number SMALLINT    NOT NULL,
  unlocked_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  unlocked_by    TEXT,
  UNIQUE (clinic_slug, cohort_id, session_number)
);

ALTER TABLE clinic_session_unlocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "unlocks_public_read" ON clinic_session_unlocks FOR SELECT USING (true);

-- ── Participant task completion ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS participant_task_progress (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id      UUID        NOT NULL REFERENCES clinic_session_tasks(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reflection   TEXT,
  UNIQUE (user_id, task_id)
);

ALTER TABLE participant_task_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "progress_own_read"   ON participant_task_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "progress_own_insert" ON participant_task_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "progress_own_update" ON participant_task_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "progress_own_delete" ON participant_task_progress FOR DELETE USING (auth.uid() = user_id);


-- ═══════════════════════════════════════════════════════════════════════════════
-- SEED: Task definitions for the Digital Visibility Clinic (6 sessions)
-- ═══════════════════════════════════════════════════════════════════════════════

-- Session 1 — Visibility Foundations
INSERT INTO clinic_session_tasks (clinic_slug, session_number, task_order, title, description, task_type) VALUES
('digital-visibility-clinic', 1, 1, 'Complete your Visibility Audit',
 'List every place your research currently appears online: Google Scholar, ORCID, ResearchGate, Academia.edu, your institutional profile, and any others. Note which profiles are complete and which are missing or outdated.',
 'action'),
('digital-visibility-clinic', 1, 2, 'Record your baseline metrics',
 'Find and write down your current h-index (from Google Scholar), total citation count, and number of indexed publications. Save this — you will compare it to your Week 6 numbers to measure your transformation.',
 'action'),
('digital-visibility-clinic', 1, 3, 'Identify your top 3 profile gaps',
 'Based on your audit, list the 3 most important platforms where your profile is incomplete or missing. Rank them by how much fixing them would improve your discoverability.',
 'action'),
('digital-visibility-clinic', 1, 4, 'Write your visibility challenge reflection',
 'In 2–3 sentences, describe your single biggest scholarly visibility challenge right now. Be specific — not "I am not visible enough" but rather "My publications are not indexed in Scopus because..."',
 'reflection'),
('digital-visibility-clinic', 1, 5, 'Set your 3 clinic goals',
 'Write 3 specific, measurable visibility goals you want to achieve by the end of this clinic. Each should be verifiable — for example: "Have a complete, verified ORCID profile with all my publications linked by Week 3."',
 'reflection');

-- Session 2 — Digital Identity Systems
INSERT INTO clinic_session_tasks (clinic_slug, session_number, task_order, title, description, task_type) VALUES
('digital-visibility-clinic', 2, 1, 'Set up or verify your ORCID iD',
 'Go to orcid.org. Create a new ORCID iD if you do not have one, or log in and verify your existing one. Add your institutional email and connect it to your university. Your ORCID iD should be in the format: 0000-0000-0000-0000.',
 'action'),
('digital-visibility-clinic', 2, 2, 'Add your key publications to ORCID',
 'In your ORCID profile, add your 5 most important publications using the "Add works" feature. Use DOI import for accuracy. Verify that titles, authors, and publication years are correct.',
 'action'),
('digital-visibility-clinic', 2, 3, 'Complete your Google Scholar profile',
 'Log in to Google Scholar. Ensure you have: a professional photo, your current institution, a verified institutional email, correct research interest keywords, and all your publications claimed — not just auto-suggested.',
 'action'),
('digital-visibility-clinic', 2, 4, 'Locate and claim your Scopus Author ID',
 'Go to scopus.com and search for your name. Find your Scopus Author profile and use the "I am this author" feature to claim it. If you have duplicate profiles, submit a merge request.',
 'action'),
('digital-visibility-clinic', 2, 5, 'Run a name consistency check',
 'Check that your name appears identically across Google Scholar, ORCID, Scopus, Web of Science, and your institutional staff page. Note any variations (initials, middle names, maiden names) and decide on your one canonical name.',
 'action'),
('digital-visibility-clinic', 2, 6, 'Take your before/after baseline screenshots',
 'Take a screenshot of each of your 4 main profiles (Google Scholar, ORCID, Scopus, institutional page) as they look right now. Save them in a folder. You will compare these to your Week 6 state to see your full transformation.',
 'action');

-- Session 3 — Discoverability Optimisation
INSERT INTO clinic_session_tasks (clinic_slug, session_number, task_order, title, description, task_type) VALUES
('digital-visibility-clinic', 3, 1, 'Build your keyword research list',
 'Generate 8–10 keywords your target audience (researchers, students, funders, journalists) would use to find your work. Include: your main topic, methodology, geographic focus (if relevant), and interdisciplinary terms.',
 'action'),
('digital-visibility-clinic', 3, 2, 'Update your Google Scholar keywords',
 'Log in to Google Scholar and update your profile keywords using your researched list. Use the most specific and searchable terms. Avoid overly broad terms like "science" or "education."',
 'action'),
('digital-visibility-clinic', 3, 3, 'Audit your top 3 papers for Open Access',
 'Check your 3 most-cited papers. Are they freely available? If not, investigate whether you can legally post a preprint or accepted manuscript to an open repository (PubMed Central, arXiv, AfricArXiv, Zenodo, or your institutional repository). Take one concrete action.',
 'action'),
('digital-visibility-clinic', 3, 4, 'Review your publication metadata',
 'Look at the titles, abstracts, and keywords of your last 3 published papers. Do they include the keywords researchers in your field actually search for? Write down what you would change if writing them today.',
 'reflection'),
('digital-visibility-clinic', 3, 5, 'Identify a high-visibility journal in your field',
 'Find one journal in your discipline with strong indexing (Scopus Q1/Q2, Web of Science), a good CiteScore, and active reach. Write down why it is discoverable and whether it is a realistic target for your next submission.',
 'action');

-- Session 4 — Citation Intelligence
INSERT INTO clinic_session_tasks (clinic_slug, session_number, task_order, title, description, task_type) VALUES
('digital-visibility-clinic', 4, 1, 'Run your full citation analysis',
 'In Google Scholar, go to your profile and sort papers by citation count. Record your top 5 most-cited papers: their titles, citation counts, publication years, and journals. Save this as a simple table.',
 'action'),
('digital-visibility-clinic', 4, 2, 'Identify your citation patterns',
 'Looking at your top 5 cited papers, what do they have in common? Consider topic, methodology, journal type, co-authors, year, and whether they are Open Access. Write 3–4 sentences on what you observe.',
 'reflection'),
('digital-visibility-clinic', 4, 3, 'Compare your h-index across databases',
 'Check your h-index on Google Scholar, Scopus, and Web of Science (if accessible). Record all three values. If they differ significantly, investigate why — it often reveals indexing gaps or unclaimed publications.',
 'action'),
('digital-visibility-clinic', 4, 4, 'Build your research network map',
 'Identify 5 active researchers in your field whose work intersects with yours. Find them on Google Scholar and ORCID. Note their most-cited topics and one paper of theirs you should read.',
 'action'),
('digital-visibility-clinic', 4, 5, 'Write a citation improvement action plan',
 'Choose your most important but least-cited paper. Write one specific action you will take in the next 30 days to improve its visibility: open repository posting, conference presentation, blog post, or ResearchGate upload.',
 'reflection');

-- Session 5 — Research Communication
INSERT INTO clinic_session_tasks (clinic_slug, session_number, task_order, title, description, task_type) VALUES
('digital-visibility-clinic', 5, 1, 'Write a 150-word lay summary',
 'In exactly 150 words, explain your most recent published paper to a non-specialist. Imagine explaining it to an intelligent friend outside your field. No jargon, no acronyms, no passive voice. Clear, direct language only.',
 'reflection'),
('digital-visibility-clinic', 5, 2, 'Draft 3 audience-specific posts',
 'Write 3 posts (max 280 characters each) presenting the same research finding to: (1) a peer researcher, (2) a final-year undergraduate, (3) a journalist or policy maker. Notice how language must change across audiences.',
 'reflection'),
('digital-visibility-clinic', 5, 3, 'Sketch a visual abstract concept',
 'For your most important paper, sketch a simple visual abstract — a graphic that communicates the key finding with minimal text. A rough annotated sketch or bullet-point concept is enough. It does not need to be polished.',
 'action'),
('digital-visibility-clinic', 5, 4, 'Find the policy relevance of your research',
 'Identify one policy document, government initiative, UN goal, national strategy, or public issue that your research directly informs. Write 2 sentences connecting your findings to that real-world problem.',
 'reflection'),
('digital-visibility-clinic', 5, 5, 'Find one public engagement opportunity',
 'Search for one podcast, newsletter, media outlet, conference session, or public forum where your research would be relevant and welcome. Write down: the name, the audience, how you would pitch your work, and the submission or contact details.',
 'action');

-- Session 6 — Strategic Positioning & Impact
INSERT INTO clinic_session_tasks (clinic_slug, session_number, task_order, title, description, task_type) VALUES
('digital-visibility-clinic', 6, 1, 'Complete your 12-Month Visibility Roadmap',
 'Write your personal visibility plan for the next 12 months. Include: platforms you will maintain monthly, publications you will make Open Access, conferences to attend, collaborations to pursue, and one public engagement activity. Be specific with timelines.',
 'reflection'),
('digital-visibility-clinic', 6, 2, 'Compare Week 1 vs Week 6 metrics',
 'Go back to your Session 1 baseline: h-index, citation count, indexed publications. Check your current numbers and calculate the change. Also compare your before/after profile screenshots. Write down every improvement — even small ones count.',
 'action'),
('digital-visibility-clinic', 6, 3, 'Identify 3 collaboration targets',
 'Choose 3 specific researchers, institutions, or groups you will actively seek to collaborate with in the next year. For each: explain why the collaboration makes sense, what you bring to it, and how you will make contact.',
 'reflection'),
('digital-visibility-clinic', 6, 4, 'Write your updated researcher bio',
 'Write a new researcher bio — maximum 100 words. Include: your name, institution, research focus, one key achievement, and your scholarly identity as you now understand it. This bio should be ready to paste into any profile or publication.',
 'reflection'),
('digital-visibility-clinic', 6, 5, 'Write your transformation reflection',
 'In one paragraph, describe your single biggest transformation from this clinic. What did you understand, fix, or begin that you were not doing before? What will you do differently as a researcher going forward?',
 'reflection'),
('digital-visibility-clinic', 6, 6, 'Submit your completion declaration',
 'By completing this task you confirm that you attended all 6 live sessions and completed the weekly task sets. Your certificate of completion will be reviewed and issued by the Researchvy team within 3 business days.',
 'action');
