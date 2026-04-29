-- Run this in your Vercel Postgres / Neon database console
CREATE TABLE IF NOT EXISTS page_content (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '',
  section TEXT NOT NULL DEFAULT 'hero',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS work_entries (
  id SERIAL PRIMARY KEY,
  year TEXT NOT NULL,
  org TEXT NOT NULL,
  role TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  stat TEXT,
  link TEXT,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS research_entries (
  id SERIAL PRIMARY KEY,
  year TEXT NOT NULL,
  title TEXT NOT NULL,
  authors TEXT NOT NULL,
  journal TEXT NOT NULL,
  doi TEXT,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  excerpt TEXT,
  image_url TEXT,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed default page content
INSERT INTO page_content (key, value, section) VALUES
  ('hero_title', 'Esther<br /><em>Feldman</em>', 'hero'),
  ('hero_eyebrow', 'Researcher &amp; Founder', 'hero'),
  ('hero_description', '<strong>Organizational psychologist, policy architect, and health-tech founder.</strong> Building AI tools that make health information accessible to everyone — from Amsterdam trauma centres to Los Angeles startups.', 'hero'),
  ('about_intro', 'Making health information accessible to everyone — from Amsterdam trauma centres to Los Angeles startups.', 'about'),
  ('about_body', 'Esther Feldman is an organizational psychologist and health researcher based in Los Angeles. Her work spans national mental health policy, oncology research, and health technology — connecting rigorous academic research with real-world impact.', 'about'),
  ('about_education', 'M.Sc. Work & Organizational Psychology\nVrije Universiteit Amsterdam\n\nB.Sc. Psychology\nErasmus University Rotterdam', 'about'),
  ('about_location', 'Los Angeles, California', 'about'),
  ('about_languages', 'Dutch · English · Russian · French · Spanish · Catalan', 'about'),
  ('about_focus', 'Mental health policy · Oncology research · Health technology', 'about')
ON CONFLICT (key) DO NOTHING;

-- Seed work entries
INSERT INTO work_entries (year, org, role, description, stat, link, sort_order) VALUES
  ('2025–', 'Collabiora', 'Co-Founder', 'Co-founded health navigation platform Collabiora, helping patients and researchers navigate health information.', 'Health Tech', 'collabiora.com', 0),
  ('2023–', 'ARQ National Psychotrauma Centre', 'Policy Advisor & Researcher', 'Lead policy architect for Dutch national mental health initiatives. Developed national psychosocial support guidelines for 200,000+ uniformed personnel. Secured €200,000 grant from the Dutch Ministry of Justice (2024).', 'National Policy', NULL, 1),
  ('2021–22', 'Radboudumc', 'Scientific Researcher, Oncology', 'Pioneered Patient-Reported Outcomes research methodology across 13 Dutch hospitals. Conducted 100+ in-depth interviews; results published in leading scientific journals.', '13 Hospitals', NULL, 2),
  ('2019–21', 'Netherlands Cancer Institute', 'Junior Researcher', 'Built and launched SYMPRO-Lung, an e-health web app for lung cancer patient symptom tracking. Designed PRO frameworks for prostate and rectal cancer clinical trials.', 'e-Health', NULL, 3);

-- Seed research entries
INSERT INTO research_entries (year, title, authors, journal, doi, sort_order) VALUES
  ('2024', 'Using a modified Delphi procedure to select a PRO-CTCAE-based subset for patient-reported symptomatic toxicity monitoring in rectal cancer patients', 'Geurts, Y.M., Peters, F., Feldman, E., et al.', 'Quality of Life Research', '10.1007/s11136-024-03767-0', 0),
  ('2023', 'Selecting a PRO-CTCAE-based subset for patient-reported symptom monitoring in prostate cancer patients: A modified Delphi procedure', 'Feldman, E., Pos, F.J., Smeenk, R.J., et al.', 'ESMO Open', '10.1016/j.esmoop.2022.100775', 1),
  ('2021', 'SYMPRO-Lung: Study protocol for a stepped-wedge randomised controlled trial', 'Feldman, E., et al.', 'BMJ Open', '10.1136/bmjopen-2021-052494', 2),
  ('2020', 'SYMPRO-Lung: Symptom monitoring with patient-reported outcomes among lung cancer patients in the Netherlands', 'Feldman, E., et al.', 'Annals of Oncology', '10.1016/j.annonc.2020.08.1436', 3);
