import PDFDocument from 'pdfkit';
import https from 'node:https';
import SVGtoPDF from 'svg-to-pdfkit';

// ─── Types ───────────────────────────────────────────────────────────────────
type StreamKey = 'science' | 'commerce' | 'arts';

interface Career {
    name: string; icon: string; rating: number;
    salary: string; growth: string; demand: string;
    pros: string[]; cons: string[];
}
interface Course {
    name: string; exam: string; examDiff: number; rating: number;
    duration: string; fees: string; colleges: string;
}
interface SalRow  { level: string; range: string; growth: string; years: string; }
interface Phase   { period: string; focus: string; color: string; tasks: string[]; }
interface Trend   { area: string; stat: string; detail: string; color: string; }
interface FStat   { label: string; value: string; color: string; }
interface Profile {
    title: string; subtitle: string; tagline: string; description: string;
    personality: string[]; personalityDesc: string[];
    strengths: string[]; weaknesses: string[]; opportunities: string[]; threats: string[];
    careers: Career[]; courses: Course[];
    phases: Phase[]; salaryMatrix: SalRow[];
    studyTips: string[]; resources: string[];
    trends: Trend[]; futureStats: FStat[]; indiaOpportunities: string[];
    color: string; lightColor: string; darkColor: string;
}

// ─── Page constants ───────────────────────────────────────────────────────────
const W = 595.28, H = 841.89, M = 36, CW = W - M * 2;
const BRAND = '#E74623', DARK = '#0F172A', GRAY = '#374151';
const LGRAY = '#9CA3AF', BG = '#F9FAFB', BORD = '#E2E8F0';
const Y0 = 82;   // page content start (after header)
const YE = 808;  // page content end (before footer)

// ─── Profiles ────────────────────────────────────────────────────────────────
const PROFILES: Record<StreamKey, Profile> = {
    science: {
        title: 'Science Stream',
        subtitle: 'PCM / PCB / PCMB — Engineering, Medical & Research',
        tagline: 'Designed for Innovation and Analytical Excellence',
        description:
            'Your assessment responses reflect exceptional analytical ability, strong logical reasoning, and a natural drive to understand how things work. ' +
            'You thrive when problems have verifiable, data-backed solutions — the hallmark of every great engineer, scientist, and doctor. ' +
            'You are primed for the highest-growth careers in India and globally.',
        personality: ['Analytical','Detail-Oriented','Systematic','Curious','Persistent'],
        personalityDesc: [
            'You break complex problems into clear, logical steps naturally.',
            'You notice details others miss and care deeply about accuracy.',
            'You prefer organized, structured approaches to solving problems.',
            'You constantly ask "why" and seek to understand root causes.',
            'You keep working on problems until you find the right solution.',
        ],
        strengths: [
            'Exceptional logical and analytical reasoning capability',
            'Strong quantitative aptitude — Mathematics and applied sciences',
            'Methodical problem-solving with high attention to accuracy',
            'High performance in structured, exam-based assessment systems',
            'Natural curiosity about how technology and science systems work',
        ],
        weaknesses: [
            'May struggle with completely open-ended ambiguous tasks',
            'JEE/NEET require years of intense, sustained discipline',
            'Research careers have slow initial financial progression',
            'Risk of burnout if subject interest is performance-driven only',
            'Limited initial exposure to business and finance contexts',
        ],
        opportunities: [
            'India needs 1.5M+ new tech professionals every year (NASSCOM 2024)',
            'AI and Data Science create new job categories faster than talent supply',
            'ISRO, DRDO, CSIR offer prestigious government research paths',
            'Biotech and pharma investment in India hit record highs in 2024',
            'Remote engineering roles open Google, Meta, Amazon hiring to India',
        ],
        threats: [
            'JEE: 12 lakh+ compete for just 16,000 IIT seats every year',
            'AI automation is replacing routine coding and testing roles',
            'Mid-tier engineering college placements are declining rapidly',
            'NEET competition intensifies with centralized admissions',
            'Technology roles need upskilling every 2-3 years to stay relevant',
        ],
        careers: [
            { name: 'Software / IT Engineer',    icon: 'SE', rating: 5, salary: 'INR 5L-50L+',  growth: '+28% by 2028', demand: 'Very High',
              pros: ['Highest salary growth of any profession in India','Remote/global hiring from Google, Meta, Amazon','Massive freelance and startup ecosystem available'],
              cons: ['Tech shifts demand continuous upskilling every 1-2 years','High pressure deadlines and long hours in product companies'] },
            { name: 'Doctor (MBBS / MD)',         icon: 'DR', rating: 5, salary: 'INR 8L-60L+',  growth: '+18% per year', demand: 'Very High',
              pros: ['Most respected and permanently secure career in India','Specialization leads to INR 50L+ annual income','Healthcare is completely recession-proof globally'],
              cons: ['5.5-9 years of study + residency before full earning begins','15L+ NEET candidates compete for only 1L seats annually'] },
            { name: 'Data Scientist / ML Engineer', icon: 'DS', rating: 5, salary: 'INR 7L-40L+', growth: '+35% by 2027', demand: 'Very High',
              pros: ['Fastest growing job title globally (LinkedIn 2024)','High starting salary even in Indian startups','Field exists across every industry: finance, healthcare, tech'],
              cons: ['Requires strong Python, R and Statistics foundation','Role evolves rapidly — skills become obsolete in 3-4 years'] },
            { name: 'Civil / Structural Engineer', icon: 'CE', rating: 4, salary: 'INR 4L-20L+', growth: '+15% infra boom', demand: 'High',
              pros: ['Massive government infrastructure investment in India','GATE exam opens high-benefit PSU jobs (ONGC, NTPC, BEL)','Visible, tangible work — bridges, metros, airports, highways'],
              cons: ['Lower starting salary than IT peers with similar qualification','Site roles involve travel and physically challenging conditions'] },
            { name: 'Research Scientist',          icon: 'RS', rating: 4, salary: 'INR 5L-28L+', growth: '+10% steady',  demand: 'Moderate',
              pros: ['Intellectually stimulating with creative research freedom','CSIR, IISc, IIT research fellowships are highly prestigious','International collaboration and publication opportunities open'],
              cons: ['PhD path is 4-6 years with modest monthly stipend','Slower career salary progression in first decade of work'] },
            { name: 'Aerospace / ISRO Engineer',   icon: 'AE', rating: 4, salary: 'INR 8L-32L+', growth: '+20% space boom', demand: 'High',
              pros: ['Work on Chandrayaan, Gaganyaan and India\'s space missions','New private space startups (Pixxel, Agnikul) creating 500+ jobs','Globally respected, technically challenging career path'],
              cons: ['Limited openings — ISRO recruits only from top IITs/NITs','Mostly government/PSU sector with limited private market'] },
        ],
        courses: [
            { name: 'B.Tech / B.E. (Engineering)',      exam: 'JEE Main + JEE Advanced',   examDiff: 5, rating: 5, duration: '4 years',     fees: 'INR 50K-15L/yr',  colleges: 'IIT Delhi, BITS Pilani, NIT Trichy, VIT, SRM, Manipal' },
            { name: 'MBBS / BDS (Medical)',              exam: 'NEET-UG',                    examDiff: 5, rating: 5, duration: '5.5 + 1yr',    fees: 'INR 25K-20L/yr',  colleges: 'AIIMS Delhi, JIPMER, Kasturba, JSS, CMC Vellore' },
            { name: 'B.Sc — Physics / Chemistry / Math', exam: 'CUET / State CET',           examDiff: 3, rating: 4, duration: '3 years',     fees: 'INR 10K-2L/yr',   colleges: 'St. Stephen\'s, Miranda House, Presidency, Fergusson, Christ' },
            { name: 'B.Sc Computer Science / Data Sci', exam: 'CUET / University-level',     examDiff: 3, rating: 4, duration: '3 years',     fees: 'INR 50K-5L/yr',   colleges: 'IISc, CMR, Christ, Manipal, Shiv Nadar, IIIT Hyderabad' },
            { name: 'Diploma Engineering (Polytechnic)', exam: 'State Polytechnic CET',       examDiff: 2, rating: 3, duration: '3 years',     fees: 'INR 15K-1L/yr',   colleges: 'Govt Polytechnics, NTTE, All State Board Institutes' },
        ],
        phases: [
            { period: 'PHASE 1 — Days 1-30: Foundation Building', focus: 'NCERT mastery + concept clarity', color: '#059669',
              tasks: ['Complete Class 11 NCERT chapters for Physics, Chemistry and Biology/Maths fully.',
                      'Join a coaching institute (ALLEN, FIITJEE, Aakash) or enroll in an online batch.',
                      'Build a subject-wise syllabus tracker and mark completed vs pending topics daily.',
                      'Download last 5 years of JEE Main / NEET papers and review the pattern carefully.',
                      'Set a 5-6 hour daily study schedule with Pomodoro breaks (50 min study, 10 rest).'] },
            { period: 'PHASE 2 — Days 31-60: Practice & Testing', focus: 'Problem solving + chapter tests', color: '#2563EB',
              tasks: ['Solve minimum 30 problems per day from HC Verma, DC Pandey or equivalent books.',
                      'Take 2 chapter-level mock tests per week and analyze all mistakes systematically.',
                      'Build a personal "mistake notebook" — categorize errors by concept and topic type.',
                      'Complete all NCERT examples and exercises (40% of NEET is directly from NCERT).',
                      'Practice time management: target 1-2 minutes per Multiple Choice Question (MCQ).'] },
            { period: 'PHASE 3 — Days 61-90: Mock & Revision Mode', focus: 'Full test practice + weak area fixing', color: '#7C3AED',
              tasks: ['Take 3 full-length mock tests per week under real 3-hour exam conditions.',
                      'Spend 2× the test time analyzing mistakes and doing targeted chapter revision.',
                      'Create formula sheets, reaction mechanism charts and derivation quick-references.',
                      'Identify your 3 weakest topics and dedicate 2 focused days to each one.',
                      'Register for KVPY, or state Science Olympiad for extra practice and credentials.'] },
        ],
        salaryMatrix: [
            { level: 'Entry Level (0-2 yrs)',       range: 'INR 4L-12L/yr',    growth: 'Steady +15%',  years: '1-2 yrs'  },
            { level: 'Mid Level (2-5 yrs)',          range: 'INR 12L-30L/yr',   growth: 'Fast +28%',    years: '3-5 yrs'  },
            { level: 'Senior Level (5-10 yrs)',      range: 'INR 30L-80L/yr',   growth: 'High +40%',    years: '6-10 yrs' },
            { level: 'Expert / Lead (10+ yrs)',      range: 'INR 75L-3Cr+/yr',  growth: 'Top Tier',     years: '10+ yrs'  },
        ],
        studyTips: [
            'Start with NCERT — NEET Biology is 70% directly from NCERT text.',
            'Focus on understanding concepts before memorization — helps in novel JEE problems.',
            'Practice past papers from 2015-2024: this is the single most effective strategy.',
            'Join peer study groups for doubt resolution — teaching others fixes your own gaps.',
            'Use visual aids: diagrams, flowcharts, and mind maps for complex topics.',
        ],
        resources: [
            'JEE: HC Verma (Physics) + MS Chauhan (Organic) + SL Loney (Maths)',
            'NEET: NCERT BIO + DC Pandey (Physics) + OP Tandon (Chemistry)',
            'Online: Physics Wallah, Unacademy, ALLEN DLP, Khan Academy',
            'Mock Tests: NTA Official JEE/NEET mock (free), Aakash test series',
            'Apps: Embibe, Toppr, Doubtnut for instant doubt clearing',
        ],
        trends: [
            { area: 'Artificial Intelligence & ML',     stat: '14 Cr+ AI jobs by 2030',      detail: 'India is the 3rd largest global AI talent pool. Python and ML skills are in emergency demand across every sector.',       color: '#059669' },
            { area: 'Biotech & Pharmaceutical',         stat: 'INR 9.5L Cr industry 2025',   detail: 'India is world\'s 3rd largest pharma producer. Biotech research and drug manufacturing are receiving record funding.',  color: '#0891B2' },
            { area: 'Space Technology (NewSpace)',       stat: '500+ Indian space startups',   detail: 'ISRO\'s liberalized policy fuels private space companies. Pixxel, Agnikul, Skyroot are hiring engineers urgently.',       color: '#7C3AED' },
            { area: 'Climate Tech & Renewable Energy',  stat: '500 GW target by 2030',        detail: 'India needs engineers to build solar, wind, and green hydrogen infrastructure to meet its ambitious clean energy goals.',   color: '#D97706' },
            { area: 'Medical Devices & MedTech',        stat: 'INR 5L Cr Indian med market',  detail: 'AIIMS-level hospitals being built across India. Biomedical engineers and health tech developers are in acute shortage.',   color: '#E74623' },
            { area: 'Quantum Computing',                stat: 'INR 6,000 Cr national mission', detail: 'India launched a national quantum mission in 2023. Physicists, mathematicians and quantum engineers are in demand.',      color: '#2563EB' },
        ],
        futureStats: [
            { label: 'New Tech Jobs Created by 2030', value: '1.5 Crore',  color: '#059669' },
            { label: 'Avg IIT Graduate Starting Package', value: 'INR 16.5L', color: '#2563EB' },
            { label: 'India Pharma Export Growth (CAGR)', value: '15.92%',  color: '#7C3AED' },
            { label: 'STEM Startups Funded (2024)',       value: '4,800+',   color: '#E74623' },
        ],
        indiaOpportunities: [
            'Digital India mission has created 30+ lakh tech jobs across Tier 1 and Tier 2/3 cities.',
            'Make in India semiconductor push will create 50,000+ chip design engineering jobs by 2028.',
            'India\'s pharma export target of $65 billion by 2030 opens large research and production roles.',
            'ISRO, DRDO, BEL, HAL, BARC run direct recruitment for top engineering graduates each year.',
            'India\'s healthcare infra spending is doubling — 2 new AIIMS built per year, doctors needed at scale.',
        ],
        color: '#059669', lightColor: '#ECFDF5', darkColor: '#065F46',
    },

    commerce: {
        title: 'Commerce Stream',
        subtitle: 'Accountancy / Economics / Business Studies / Mathematics',
        tagline: 'Built for Financial Mastery and Leadership Excellence',
        description:
            'Your responses reveal strong business judgment, financial intuition, and outstanding leadership potential. ' +
            'You naturally think in systems, outcomes and value creation — exactly the mindset that drives India\'s top CAs, bankers, and entrepreneurs. ' +
            'Commerce gives you direct access to India\'s most lucrative career pathways.',
        personality: ['Strategic','Goal-Oriented','Persuasive','Confident','Results-Driven'],
        personalityDesc: [
            'You see the bigger picture and make decisions with long-term impact in mind.',
            'You set ambitious targets and structure your actions to achieve them.',
            'You communicate persuasively and naturally bring people to your viewpoint.',
            'You approach challenges with self-assurance and a bias towards action.',
            'You measure your effort by outcomes and always look for tangible returns.',
        ],
        strengths: [
            'Strong financial thinking and business acumen instilled early',
            'Excellent decision-making and goal-driven leadership qualities',
            'Outstanding communication and persuasion skills in group settings',
            'High comfort with numbers, data analysis and financial modeling',
            'Entrepreneurial mindset — you see opportunities where others see problems',
        ],
        weaknesses: [
            'May need effort to build deeper quantitative and tech skills',
            'CA pathway is 4-5 years of intense study after Class 12',
            'Early entrepreneurship involves financial uncertainty and long hours',
            'Competition for top MBA programs (IIMs) is extremely intense',
            'Risk of scope limiting if only one career path (eg. CA) is pursued',
        ],
        opportunities: [
            'India fintech market projected at INR 20 lakh crore by 2030',
            'UPI and digital payments have created 10,000+ new fintech jobs',
            'GST and tax reform need 2 lakh+ new CA-qualified professionals',
            'India\'s startup ecosystem (3rd globally) needs finance leaders urgently',
            'Global management consulting firms are expanding India offices rapidly',
        ],
        threats: [
            'Automation is replacing routine accounting and bookkeeping tasks rapidly',
            'CA exam pass rates are low — requires 3-5 attempts on average',
            'Top IIM MBA needs 99+ percentile in CAT — extremely competitive',
            'Global financial market volatility creates career risk in banking',
            'Regulatory changes (GST, SEBI) require continuous re-learning',
        ],
        careers: [
            { name: 'Chartered Accountant (CA)',     icon: 'CA', rating: 5, salary: 'INR 7L-55L+',       growth: '+22% demand', demand: 'Very High',
              pros: ['Most trusted professional credential in Indian finance sector','Versatile — works in audit, tax, finance, consulting, banking','INR 40L+ packages common at Big 4: Deloitte, EY, PwC, KPMG'],
              cons: ['3-5 year pathway with low exam pass rates (10-20% per attempt)','Work pressure during March-end (tax season) is very high'] },
            { name: 'Investment Banker / Analyst',   icon: 'IB', rating: 5, salary: 'INR 10L-2Cr+',      growth: '+30% finance boom', demand: 'Very High',
              pros: ['Among highest paying careers in India at senior level','Work on billion-dollar mergers, IPOs and capital market deals','Global exit opportunities to Singapore, Dubai, London, New York'],
              cons: ['80+ hour work weeks are standard especially in first 3 years','Extremely competitive entry — only top MBA/CA graduates selected'] },
            { name: 'MBA / Management Graduate',     icon: 'MB', rating: 5, salary: 'INR 8L-45L+',       growth: '+25% demand', demand: 'Very High',
              pros: ['IIM Ahmedabad median package crossed INR 30L in 2024','Opens doors to every industry: consulting, FMCG, tech, banking','Best network and peer group to build in entire career journey'],
              cons: ['IIM requires 99+ percentile in CAT — 2-3 years preparation needed','INR 25-30L fees for IIM — needs scholarship or loan planning'] },
            { name: 'Financial Analyst / CFP',       icon: 'FA', rating: 4, salary: 'INR 6L-28L+',       growth: '+18% steady', demand: 'High',
              pros: ['Strong demand from mutual funds, PMS, insurance sector companies','CFA designation boosts salary by 30-40% at mid level','Relatively structured work-life balance vs. investment banking'],
              cons: ['Requires CFA/CFP credential for senior advancement — 3 years','Salary growth slower in early years without additional certification'] },
            { name: 'Entrepreneur / Startup Founder', icon: 'EN', rating: 4, salary: 'Variable-INR 2Cr+', growth: 'Uncapped', demand: 'High',
              pros: ['Complete ownership of your financial upside and career direction','India has 110+ unicorns — a fully mature, funded startup ecosystem','Access to incubators, Angel investors, and government schemes (Startup India)'],
              cons: ['First 1-3 years typically receive no salary — financially tough','90% of startups fail in first 2 years — high risk of failure'] },
            { name: 'Marketing Manager / Brand Lead', icon: 'MM', rating: 3, salary: 'INR 5L-22L+',       growth: '+15% digital surge', demand: 'Moderate',
              pros: ['Digital marketing boom: every company needs marketing expertise','Creative and strategic blend — suits both analytical and creative people','FMCG, D2C brands, e-commerce offering strong packages to good talent'],
              cons: ['Commoditized at entry level — needs specialization to stand out','ROI measurement pressure is high in performance marketing roles'] },
        ],
        courses: [
            { name: 'CA Foundation → Inter → Final', exam: 'ICAI Examinations (3 levels)',  examDiff: 5, rating: 5, duration: '4-5 years',    fees: 'INR 30K-1L total',  colleges: 'ICAI Coaching Delhi/Mumbai, Aldine, IPCC coaching everywhere' },
            { name: 'BBA / BMS (Business Studies)',  exam: 'IPMAT / NPAT / DU JAT / CUET',  examDiff: 4, rating: 5, duration: '3 years',      fees: 'INR 1L-8L/yr',      colleges: 'IIM Indore (IPMAT), NMIMS, Christ, Symbiosis, DU SRCC' },
            { name: 'B.Com (Hons) / B.Com General',  exam: 'CUET / State Board Merit',      examDiff: 2, rating: 4, duration: '3 years',      fees: 'INR 15K-3L/yr',     colleges: 'SRCC Delhi, LSR, Presidency Kolkata, Loyola, St. Xavier\'s' },
            { name: 'CMA / ICWA (Cost Accountant)',   exam: 'ICAI CMA Foundation',           examDiff: 4, rating: 4, duration: '4 years',      fees: 'INR 20K-80K total', colleges: 'ICAI CMA centers nationwide — 20+ study centers in India' },
            { name: 'MBA (Post-Graduation)',          exam: 'CAT / XAT / MAT / GMAT',        examDiff: 5, rating: 5, duration: '2 years (PG)',  fees: 'INR 5L-35L total',  colleges: 'IIM A/B/C, XLRI, FMS Delhi, MDI Gurgaon, ISB Hyderabad' },
        ],
        phases: [
            { period: 'PHASE 1 — Days 1-30: Foundation Setup', focus: 'Subject selection + CA/BBA prep intent', color: '#2563EB',
              tasks: ['Select Accountancy, Economics, Business Studies, Maths in Class 11 (these open every path).',
                      'Register for CA Foundation with ICAI — registration is open after Class 12 registration.',
                      'Start building Excel, Tally ERP, and Google Sheets skills — these are career basics.',
                      'Download IPMAT previous year papers if targeting BBA at IIM Indore.',
                      'Read 2 business news articles daily (Economic Times, Mint) to build financial awareness.'] },
            { period: 'PHASE 2 — Days 31-60: Skill Building', focus: 'Practice papers + CA module study', color: '#0891B2',
              tasks: ['Study CA Foundation syllabus: Principles of Accounting + Business Laws (core topics).',
                      'Practice 20 MCQs daily for IPMAT (Quant + Verbal sections from past papers).',
                      'Complete 1 online finance or business course (Coursera, Udemy — business fundamentals).',
                      'Build a personal mock budget/P&L to understand Balance Sheet and accounting practically.',
                      'Attend 2 webinars on CA career or BBA admissions to understand what\'s expected.'] },
            { period: 'PHASE 3 — Days 61-90: Mock + College Research', focus: 'Mock tests + college shortlisting', color: '#7C3AED',
              tasks: ['Take 3 full IPMAT/CUET mock tests per week under real time-limit conditions.',
                      'Shortlist 8-10 BBA/B.Com colleges based on fees, placement, and location preference.',
                      'If targeting CA: solve 2 previous year CA Foundation papers completely.',
                      'Write your SOP draft for college applications — have a mentor review and refine it.',
                      'Attend 1 college open day or virtual info session to make a final decision.'] },
        ],
        salaryMatrix: [
            { level: 'Entry Level (0-2 yrs)',           range: 'INR 4L-9L/yr',     growth: 'Steady +14%',  years: '1-2 yrs'  },
            { level: 'Analyst / Executive (2-5 yrs)',   range: 'INR 9L-22L/yr',    growth: 'Fast +26%',    years: '3-5 yrs'  },
            { level: 'Manager / Senior (5-10 yrs)',     range: 'INR 22L-55L/yr',   growth: 'High +35%',    years: '6-10 yrs' },
            { level: 'CXO / Partner / Founder (10+)',   range: 'INR 50L-5Cr+/yr',  growth: 'Top Tier',     years: '10+ yrs'  },
        ],
        studyTips: [
            'Read Economic Times daily — financial awareness is a career-long differentiator.',
            'Learn Excel deeply (VLOOKUP, Pivot Tables, macros) — every finance role needs it.',
            'Take on a campus leadership role — commerce careers reward extracurricular activity.',
            'Build a "trading portfolio" on Zerodha paper trading to understand markets practically.',
            'Seek a summer internship in any CA firm, bank or startup — even free experience counts.',
        ],
        resources: [
            'Accounts: TS Grewal + RD Sharma (Commerce Maths)',
            'CA Foundation: ICAI Study Material (official, free download)',
            'Online: Finschool by NSE, ClearTax Academy, Unacademy Commerce',
            'Mock Tests: ICAI mock exam series, TIME IPMAT practice tests',
            'Apps: Zerodha Varsity (free), CleariQ, Toppr Commerce, Embibe',
        ],
        trends: [
            { area: 'FinTech & Digital Payments',     stat: 'INR 20L Cr mkt by 2030', detail: 'India leads the world in UPI transactions. FinTech companies are hiring finance professionals with tech skills urgently.', color: '#2563EB' },
            { area: 'Startup & Venture Ecosystem',    stat: '1.1L+ active startups', detail: 'India has 110+ unicorns. Every startup needs CFOs, finance managers, and growth leads from day one of operations.', color: '#059669' },
            { area: 'ESG & Sustainable Finance',      stat: 'INR 40L Cr ESG investing', detail: 'SEBI mandated ESG reporting for top 1000 companies. Sustainability accountants and ESG analysts are a new high-demand role.', color: '#0891B2' },
            { area: 'Global Management Consulting',   stat: 'McKinsey India: 3000+ hired', detail: 'BCG, McKinsey, Bain, Deloitte, EY are expanding India offices rapidly — hiring commerce and MBA graduates at record numbers.', color: '#7C3AED' },
            { area: 'E-Commerce & D2C Brands',        stat: 'INR 7L Cr e-com by 2030', detail: 'Meesho, Nykaa, Zepto, Blinkit need business analysts, category managers, and finance professionals at large scale.', color: '#D97706' },
            { area: 'Tax Tech & Compliance',          stat: '2L+ CA jobs unfilled',    detail: 'GST implementation, corporate tax reform, and SEBI compliance have created massive demand for qualified chartered accountants.', color: '#E74623' },
        ],
        futureStats: [
            { label: 'New Finance Jobs by 2030',         value: '80 Lakh',   color: '#2563EB' },
            { label: 'IIM-A Median Salary (2024)',        value: 'INR 30.7L', color: '#059669' },
            { label: 'CA Professional Demand Growth',    value: '+22%/yr',   color: '#7C3AED' },
            { label: 'Indian Unicorns (active 2024)',     value: '110+',      color: '#E74623' },
        ],
        indiaOpportunities: [
            'Big 4 accounting firms (Deloitte, EY, KPMG, PwC) plan to hire 40,000 people in India in 2025.',
            'SEBI\'s capital market expansion means stock brokers, investment analysts are in permanent demand.',
            'India\'s insurance sector is underpenetrated — IRDAI expects 5× growth, needs 4 lakh professionals.',
            'Government\'s Atmanirbhar scheme provides grant support for commerce graduates to start ventures.',
            'Public Sector Banks are expanding with RBI fintech licenses — retail banking grads in demand.',
        ],
        color: '#2563EB', lightColor: '#EFF6FF', darkColor: '#1E40AF',
    },

    arts: {
        title: 'Arts and Humanities',
        subtitle: 'History / Political Science / Psychology / Literature / Economics',
        tagline: 'Designed for Creative Impact and Social Leadership',
        description:
            'Your responses reveal exceptional creative thinking, deep social awareness, and outstanding communication ability. ' +
            'You naturally empathize with people and have a flair for original expression — the foundation of every great lawyer, civil servant, psychologist and designer. ' +
            'Arts stream opens some of India\'s most respected, meaningful career paths.',
        personality: ['Creative','Empathetic','Expressive','Independent','Change-Maker'],
        personalityDesc: [
            'You generate original ideas and approach problems in unconventional ways.',
            'You understand and connect with people\'s emotions and motivations deeply.',
            'You communicate your thoughts effectively through words, visuals and action.',
            'You form your own views and think independently of peer pressure.',
            'You care about making society better and driving meaningful change.',
        ],
        strengths: [
            'Outstanding verbal and written communication — a lifelong career asset',
            'Deep social awareness and empathy for human-centered work contexts',
            'Creative and original thinking in complex real-world situations',
            'Strong ability to argue, debate, and persuade — critical for law and policy',
            'High adaptability across diverse roles and environments',
        ],
        weaknesses: [
            'Arts career paths are underestimated — requires confident self-advocacy',
            'Entry-level incomes are lower — patience and persistence required',
            'Personal branding and portfolio are essential to stand out in creative fields',
            'UPSC has 3L+ candidates competing for only 1000 IAS jobs per year',
            'Independent career paths (freelance, design) can have income volatility',
        ],
        opportunities: [
            'India\'s digital media industry is the world\'s fastest growing — 60+ crore users',
            'Mental health awareness boom: psychologists in acute shortage nationwide',
            'Legal tech startups need lawyers who understand both law and technology',
            'India\'s content economy is a INR 25,000 crore industry growing at 25% CAGR',
            'Government policy jobs through UPSC offer the most social impact in India',
        ],
        threats: [
            'Social pressure to choose science/commerce remains real — needs mental resolve',
            'Income in early creative and media careers can be inconsistent',
            'Tier 2-3 market perception of arts careers is still unfairly limited',
            'AI content tools are transforming writing and design — need specialization',
            'UPSC success rate is under 0.4% — requires years of dedicated preparation',
        ],
        careers: [
            { name: 'Civil Services (IAS / IPS / IFS)', icon: 'CS', rating: 5, salary: 'INR 8L-25L + perks',  growth: '+3500 posts/yr', demand: 'High',
              pros: ['Most powerful and socially impactful role in India — leads entire districts','Grade A housing, car, security, healthcare — exceptional benefits package','Permanent, recession-proof; family financial security for entire career'],
              cons: ['0.4% selection rate in UPSC — requires 2-4 years full-time preparation','Political pressure and bureaucratic friction in day-to-day operations'] },
            { name: 'Lawyer / Advocate (LLB / LLM)',    icon: 'LA', rating: 5, salary: 'INR 5L-1Cr+',         growth: '+25% legal boom', demand: 'High',
              pros: ['Top corporate lawyers at Cyril Amarchand earn INR 1Cr+ annually','Legal tech is creating new specialized practice areas every year','Supreme Court and High Court practice is globally respected credential'],
              cons: ['Initial 2-3 years often involve very low income while building practice','Long irregular hours; client emergencies demand constant availability'] },
            { name: 'UI / UX Designer',                 icon: 'UX', rating: 4, salary: 'INR 5L-35L+',         growth: '+40% by 2027', demand: 'Very High',
              pros: ['#1 most in-demand creative-technical role at every major tech company','Remote work is standard — access global clients from anywhere in India','Relatively short skill-building time vs other high-paying careers (1-2 yrs)'],
              cons: ['Portfolio matters more than degree — building it takes time and consistency','Design tools and standards change rapidly — Adobe, Figma updates constant'] },
            { name: 'Clinical Psychologist / Counselor', icon: 'PS', rating: 4, salary: 'INR 4L-22L+',        growth: '+35% awareness boom', demand: 'Growing',
              pros: ['India has 5,000 licensed psychologists for 1.4 billion people — acute shortage','Private practice income is high once reputation is established','Deeply meaningful work — direct positive impact on clients\' quality of life'],
              cons: ['Requires MA + RCI registration; M.Phil for clinical practice — adds 3 years','Emotional toll from working with trauma and mental health crisis daily'] },
            { name: 'Journalist / Digital Content Lead', icon: 'JN', rating: 4, salary: 'INR 4L-20L+',        growth: '+30% digital media', demand: 'High',
              pros: ['Every major brand, startup and media company needs content leadership','Social media creators in India earn INR 10L+ through brand collaborations','Journalism creates public influence — shapes national narratives and policy'],
              cons: ['Traditional print journalism has limited growth — digital is the future','Income from freelancing is irregular especially in early career phase'] },
            { name: 'Event Manager / PR / HR Manager',  icon: 'HR', rating: 3, salary: 'INR 4L-18L+',         growth: '+12% steady', demand: 'Moderate',
              pros: ['High social interaction and people management in every role','Corporate events, weddings, conferences create constant steady demand','Entry easier than law/UPSC — skills built through experience and internships'],
              cons: ['Physically demanding — long irregular hours especially during events','Salary growth slower without personal brand or niche specialization'] },
        ],
        courses: [
            { name: 'LLB — 5 Year Integrated (BA+LLB)', exam: 'CLAT / AILET / LSAT India',  examDiff: 4, rating: 5, duration: '5 years',     fees: 'INR 50K-4L/yr',    colleges: 'NLSIU Bangalore, NLU Delhi, NALSAR, NUJS Kolkata, Symbiosis' },
            { name: 'BA Hons — Psychology',              exam: 'CUET / University-level',    examDiff: 3, rating: 5, duration: '3 years',     fees: 'INR 20K-2L/yr',    colleges: 'Miranda House, Jesus & Mary, Christ, Loyola, Fergusson, Delhi Univ' },
            { name: 'BA — UPSC Preparation Pathway',    exam: 'UPSC CSE (after graduation)', examDiff: 5, duration: '3 yrs degree + 2-3 prep', rating: 5, fees: 'INR 15K-1.5L/yr',  colleges: 'St. Stephens, Hindu College, JNU, Fergusson, Presideny Kolkata' },
            { name: 'BA Journalism / Mass Communication', exam: 'CUET / State / IIMC Entrance', examDiff: 3, rating: 4, duration: '3 years', fees: 'INR 30K-3L/yr',    colleges: 'IIMC Delhi, Symbiosis, ACJ Chennai, Jamia Millia, Xaviers Mumbai' },
            { name: 'B.Design / BFA / NIFT Fashion',    exam: 'NID DAT / NIFT / UCEED',     examDiff: 4, rating: 4, duration: '4 years',     fees: 'INR 1L-5L/yr',     colleges: 'NID Ahmedabad, NIFT Delhi, UID, Srishti, VIT Design, MIT Pune' },
        ],
        phases: [
            { period: 'PHASE 1 — Days 1-30: Foundation & Direction', focus: 'Subject selection + clear career goal', color: '#7C3AED',
              tasks: ['Select your Class 11 subjects aligned with your goal (History, Political Sci, Economics, Psychology).',
                      'Research 3 career options deeply: UPSC / Law / Design / Psychology / Journalism.',
                      'Start a personal journal or blog — writing daily is the #1 arts career skill builder.',
                      'For law: download CLAT syllabus and prepare a 12-month study timeline.',
                      'For UPSC: read one NCERT History or Polity book this month to test your genuine interest.'] },
            { period: 'PHASE 2 — Days 31-60: Skill + Experience Building', focus: 'Portfolio development', color: '#D97706',
              tasks: ['Join the school Debate Club, Mock UN, or writing club — participation builds credentials.',
                      'For law: solve 30 CLAT reasoning and English questions from past papers daily.',
                      'For design: build an online portfolio (Behance/Dribbble) with 3-5 creative works.',
                      'Apply for a summer internship: media house, NGO, law firm, or photography studio.',
                      'Read one newspaper editorial daily and write a 150-word response — builds arguments.'] },
            { period: 'PHASE 3 — Days 61-90: Mock Tests + Applications', focus: 'Entrance prep + college shortlisting', color: '#E74623',
              tasks: ['Take 3 full CLAT / CUET / NID mock tests per week in real time-limit conditions.',
                      'Shortlist 8 colleges and visit their website for admission dates, fees, processes.',
                      'For UPSC track: finalize BA (Hons) college and optional subject for UPSC by Day 75.',
                      'Build a 2-page professional resume highlighting projects, activities, and achievements.',
                      'Attend 1 college open day for your target discipline — ask current students for advice.'] },
        ],
        salaryMatrix: [
            { level: 'Entry Level (0-2 yrs)',           range: 'INR 3L-8L/yr',     growth: 'Steady +12%',  years: '1-2 yrs'  },
            { level: 'Specialist (2-5 yrs)',            range: 'INR 8L-20L/yr',    growth: 'Moderate +22%', years: '3-5 yrs'  },
            { level: 'Senior / Manager (5-10 yrs)',     range: 'INR 20L-50L/yr',   growth: 'High +30%',    years: '6-10 yrs' },
            { level: 'Expert / Leader (10+ yrs)',       range: 'INR 45L-1.5Cr+/yr', growth: 'Top Tier',    years: '10+ yrs'  },
        ],
        studyTips: [
            'Read one newspaper editorial daily and write a 150-word opinion — builds depth of thinking.',
            'Keep a "current affairs" notebook with monthly summaries — essential for UPSC and law.',
            'Take every speech, debate, and presentation opportunity — vocal confidence is irreplaceable.',
            'Build a portfolio of your work (written, visual, designed) early — it opens every door.',
            'Take online courses in design (Canva, Figma), psychology, or public policy to supplement degree.',
        ],
        resources: [
            'UPSC: NCERT History/Polity + Laxmikanth + Bipin Chandra',
            'CLAT: Legal Awareness + LegalEdge modules + Previous papers',
            'Design: Coursera Design Thinking, Skillshare, Google UX Certificate',
            'Journalism: Reuters Training, Indian Express learning resources',
            'Apps: Unacademy IAS, Vision IAS, StudyIQ, YouTube CLAT channels',
        ],
        trends: [
            { area: 'Digital Content Economy',     stat: 'INR 25,000 Cr by 2025',   detail: 'India\'s creator economy has 80M content creators. Brands spend INR 10,000 Cr on influencer marketing — demand for storytellers is exploding.',  color: '#7C3AED' },
            { area: 'Mental Health & Psychology',  stat: '93% Indians need counseling', detail: 'India has chronic shortage of therapists. NIMHANS reports only 5,000 licensed psychologists for 1.4B population — a massive gap.', color: '#059669' },
            { area: 'Legal Tech & Law Innovation', stat: 'INR 6,000 Cr legal market', detail: 'AI legal tools and online courts need lawyers who understand technology. LegalTech is India\'s fastest growing legal sub-sector.', color: '#2563EB' },
            { area: 'UX / Product Design',         stat: '+40% salary in 2 years',   detail: 'Every tech company, fintech, and D2C brand needs UX designers. India has only 50,000 trained UX designers vs 2M needed by 2026.', color: '#D97706' },
            { area: 'Media & OTT Platforms',       stat: '50 Cr+ OTT subscribers',   detail: 'Netflix, Amazon, Disney+ Hotstar, JioCinema are investing INR 10,000 Cr+ annually in Indian content — writers, directors, producers needed.', color: '#E74623' },
            { area: 'Social Impact & NGO Work',    stat: '3.3M NGOs active in India', detail: 'FCRA-registered NGOs spend INR 2 lakh crore annually. Program managers, communications leads, and policy analysts are urgently needed.', color: '#0891B2' },
        ],
        futureStats: [
            { label: 'Digital Media Jobs by 2030',    value: '25 Lakh',  color: '#7C3AED' },
            { label: 'IAS Officers Selected per Year', value: '~1,000',  color: '#2563EB' },
            { label: 'UX Designer Salary Growth',     value: '+40%/yr',  color: '#D97706' },
            { label: 'India Psychologist Shortage',   value: '138,000+', color: '#059669' },
        ],
        indiaOpportunities: [
            'India\'s OTT market (Netflix, Hotstar, Amazon) invests INR 10,000 Cr annually — writers and directors needed.',
            'UNHCR and UN India programs hire arts graduates for development, policy and communication roles.',
            'SC/ST and OBC reservations in UPSC create opportunities with lower general-category competition.',
            'National Legal Services Authority provides legal careers across every district court in India.',
            'India\'s e-governance and digital Jan Seva programs need policy designers with humanities background.',
        ],
        color: '#7C3AED', lightColor: '#F5F3FF', darkColor: '#4C1D95',
    },
};

// ─── Logo / fetch helpers ─────────────────────────────────────────────────────
const LOGO_URL = 'https://letsednovate.com/images/ednovate-logo.svg';
let logoSvgCache: string | null | undefined;

const fetchText = (url: string): Promise<string> =>
    new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (!res.statusCode || res.statusCode < 200 || res.statusCode >= 300) {
                reject(new Error('status ' + String(res.statusCode)));
                return;
            }
            let d = '';
            res.setEncoding('utf8');
            res.on('data', (c: string) => { d += c; });
            res.on('end', () => resolve(d));
        }).on('error', reject);
    });

const getLogoSvg = async (): Promise<string | null> => {
    if (logoSvgCache !== undefined) return logoSvgCache;
    try {
        const s = await fetchText(LOGO_URL);
        logoSvgCache = s.includes('<svg') ? s : null;
    } catch { logoSvgCache = null; }
    return logoSvgCache;
};

const scoresFromAnswers = (answers: Array<{ stream?: string; weight?: number }>): Record<string, number> => {
    const acc: Record<string, number> = { science: 0, commerce: 0, arts: 0, neutral: 0 };
    answers.forEach((a) => {
        const s = String(a?.stream || '').toLowerCase();
        const w = Number(a?.weight) || 0;
        if (s in acc) acc[s] += w;
    });
    return acc;
};

const getPrimaryStream = (scores: Record<string, number>, fallback: string): StreamKey => {
    const f = (fallback || '').toLowerCase();
    if (f === 'science' || f === 'commerce' || f === 'arts') return f as StreamKey;
    const keys: StreamKey[] = ['science', 'commerce', 'arts'];
    return keys.sort((a, b) => (scores[b] ?? 0) - (scores[a] ?? 0))[0] ?? 'commerce';
};

const parseJSON = <T>(v: unknown, fb: T): T => {
    if (!v) return fb;
    if (typeof v === 'object') return v as T;
    if (typeof v === 'string') { try { return JSON.parse(v) as T; } catch { return fb; } }
    return fb;
};

const clampText = (text: string, maxLen: number): string => {
    if (!text) return '';
    return text.length > maxLen ? text.slice(0, Math.max(0, maxLen - 1)).trimEnd() + '...' : text;
};

// ─── Export ───────────────────────────────────────────────────────────────────
export const generateReportPDF = (student: any): Promise<Buffer> =>
    new Promise((resolve, reject) => {
        void (async () => {
            const logoSvg = await getLogoSvg();
            const doc = new PDFDocument({ margin: 0, size: 'A4', bufferPages: true });
            const chunks: Buffer[] = [];
            doc.on('data', (c: Buffer) => chunks.push(c));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);

            // ── student data ──────────────────────────────────────────────────
            const answers    = parseJSON<any[]>(student?.answers, []);
            const result     = parseJSON<Record<string, any>>(student?.result, {});
            const rScores    = parseJSON<Record<string, number>>(result?.scores, {});
            const aScores    = scoresFromAnswers(Array.isArray(answers) ? answers : []);
            const aTotal     = (aScores.science || 0) + (aScores.commerce || 0) + (aScores.arts || 0);
            const rTotal     = Math.max(0, (Number(rScores.science) || 0) + (Number(rScores.commerce) || 0) + (Number(rScores.arts) || 0));
            const scores     = aTotal > 0 ? aScores : (rTotal > 0 ? rScores : aScores);
            const primary    = getPrimaryStream(scores, result?.stream || '');
            const P          = PROFILES[primary];
            const sci        = Math.max(0, Number(scores.science)  || 0);
            const com        = Math.max(0, Number(scores.commerce) || 0);
            const art        = Math.max(0, Number(scores.arts)     || 0);
            const tot        = Math.max(sci + com + art, 1);
            const sciPct     = Math.round((sci / tot) * 100);
            const comPct     = Math.round((com / tot) * 100);
            const artPct     = Math.round((art / tot) * 100);
            const matchPct   = typeof result?.percentage === 'number'
                ? Math.max(0, Math.min(100, Math.round(result.percentage)))
                : Math.max(sciPct, comPct, artPct);
            const answered   = Array.isArray(answers) ? answers.length : 0;
            const createdAt  = student?.createdAt ? new Date(student.createdAt) : new Date();
            const dateStr    = Number.isNaN(createdAt.getTime()) ? new Date().toLocaleDateString('en-IN') : createdAt.toLocaleDateString('en-IN');
            const ref        = String(student?.id ?? '').slice(0, 8).toUpperCase() || 'XXXXXXXX';
            const sName      = String(student?.name     || 'Student');
            const sMobile    = String(student?.mobile   || '—');
            const sEmail     = String(student?.email    || '—');
            const sLocation  = String(student?.location || '—');

            const aptBars = [
                { label: 'Analytical Aptitude',  pct: Math.min(97, sciPct + 12), color: '#059669', desc: 'Logical breakdown of complex problems'     },
                { label: 'Creative Aptitude',    pct: Math.min(97, artPct + 15), color: '#7C3AED', desc: 'Original thinking and idea generation'      },
                { label: 'Business Acumen',      pct: Math.min(97, comPct + 10), color: '#2563EB', desc: 'Financial and strategic business sense'      },
                { label: 'Communication Skills', pct: Math.min(97, Math.round(artPct * 0.6 + comPct * 0.35 + 14)), color: '#D97706', desc: 'Verbal, written and interpersonal clarity' },
                { label: 'Technical Ability',    pct: Math.min(97, sciPct + 6),  color: '#059669', desc: 'Technical problem solving and execution'     },
                { label: 'Leadership Potential', pct: Math.min(97, Math.round(comPct * 0.7 + sciPct * 0.2 + 10)), color: BRAND, desc: 'Ability to lead and guide teams to goals'  },
                { label: 'Research Orientation', pct: Math.min(97, Math.round(sciPct * 0.8 + artPct * 0.15 + 8)), color: '#0891B2', desc: 'Drive to investigate and discover insights' },
                { label: 'Social Intelligence',  pct: Math.min(97, Math.round(artPct * 0.7 + comPct * 0.2 + 12)), color: '#D97706', desc: 'Empathy and interpersonal awareness depth'  },
            ];

            // ── drawing helpers ───────────────────────────────────────────────
            const fp = () => doc.rect(0, 0, W, H).fill('#FFFFFF');

            const hdr = (title: string, sub: string, pg: string) => {
                fp();
                doc.rect(0, 0, W, 72).fill('#FFFFFF');
                doc.moveTo(0, 72).lineTo(W, 72).strokeColor('#E5E7EB').lineWidth(0.5).stroke();
                doc.rect(0, 72, W, 3).fill(BRAND);
                // logo
                if (logoSvg) {
                    try { SVGtoPDF(doc as any, logoSvg, M, 14, { width: 148, height: 40, preserveAspectRatio: 'xMinYMid meet' }); }
                    catch { doc.fillColor(BRAND).font('Helvetica-Bold').fontSize(17).text('EDNOVATE', M, 22); }
                } else {
                    doc.fillColor(BRAND).font('Helvetica-Bold').fontSize(17).text('EDNOVATE', M, 22);
                }
                doc.fillColor(DARK).font('Helvetica-Bold').fontSize(12).text(title, M + 170, 16);
                doc.fillColor('#6B7280').font('Helvetica').fontSize(7.5).text(sub, M + 170, 36);
                doc.fillColor(LGRAY).font('Helvetica').fontSize(7)
                   .text('CC-' + ref + '  |  ' + dateStr + '  |  ' + pg, 0, 57, { width: W - M, align: 'right' });
            };

            const ftr = () => {
                doc.rect(0, H - 26, W, 26).fill('#F9FAFB');
                doc.moveTo(0, H - 26).lineTo(W, H - 26).strokeColor(BORD).lineWidth(0.4).stroke();
                doc.fillColor(LGRAY).font('Helvetica').fontSize(6.5)
                   .text('Ednovate Career Counseling  |  AI-Powered Student Assessment  |  letsednovate.com  |  8651014840  |  Confidential Report', M, H - 16, { width: CW, align: 'center' });
            };

            const st = (y: number, title: string, col = BRAND): number => {
                doc.rect(M, y, 4, 22).fill(col);
                doc.fillColor(DARK).font('Helvetica-Bold').fontSize(12.5).text(title, M + 12, y + 3, { width: CW - 14 });
                return y + 30;
            };

            const hbar = (x: number, y: number, tw: number, bh: number, pct: number, col: string) => {
                doc.roundedRect(x, y, tw, bh, bh / 2).fill('#F3F4F6');
                const fw = Math.max(bh, Math.round(tw * Math.min(100, pct) / 100));
                doc.roundedRect(x, y, fw, bh, bh / 2).fill(col);
            };

            const vbar = (x: number, baseY: number, bw: number, maxH: number, pct: number, col: string) => {
                doc.rect(x, baseY - maxH, bw, maxH).fill('#F3F4F6');
                const fh = Math.max(2, Math.round(maxH * Math.min(100, pct) / 100));
                doc.rect(x, baseY - fh, bw, fh).fill(col);
            };

            const dots = (x: number, cy: number, rating: number, max = 5) => {
                for (let i = 0; i < max; i++) {
                    if (i < rating) doc.circle(x + i * 12, cy, 4.5).fill(BRAND);
                    else doc.lineWidth(0.8).circle(x + i * 12, cy, 4.5).stroke('#D1D5DB');
                }
            };

            const card = (x: number, y: number, cw: number, ch: number, bg = BG, bc = BORD) => {
                doc.roundedRect(x, y, cw, ch, 6).fill(bg).strokeColor(bc).lineWidth(0.55).stroke();
            };

            const statBox = (x: number, y: number, bw: number, bh: number, val: string, lbl: string, col: string) => {
                card(x, y, bw, bh, col + '18', col);
                doc.fillColor(col).font('Helvetica-Bold').fontSize(20).text(val, x, y + 8, { width: bw, align: 'center' });
                doc.fillColor('#111827').font('Helvetica').fontSize(7).text(lbl, x, y + 34, { width: bw, align: 'center' });
            };

            const diffBar = (x: number, y: number, diff: number, maxD = 5) => {
                for (let i = 0; i < maxD; i++) {
                    const col = i < diff ? (diff >= 4 ? '#DC2626' : diff >= 3 ? '#D97706' : '#059669') : '#E2E8F0';
                    doc.roundedRect(x + i * 11, y, 9, 8, 2).fill(col);
                }
            };

            // ─────────────────────────────────────────────────────────────────
            // PAGE 1 — COVER: Student profile + stream result + score breakdown
            // ─────────────────────────────────────────────────────────────────
            hdr('CAREER ASSESSMENT REPORT', 'AI-Powered Stream Analysis  |  Ednovate Career Counseling', 'Page 1 of 10');
            let y = Y0;

            // Welcome banner
            doc.rect(M, y, CW, 44).fill(P.color + '22').strokeColor(P.color).lineWidth(0.6).stroke();
            doc.roundedRect(M, y, 4, 44, 0).fill(P.color);
            doc.fillColor(P.darkColor).font('Helvetica-Bold').fontSize(10).text('YOUR PERSONALIZED CAREER ASSESSMENT REPORT', M + 14, y + 8, { width: CW - 20 });
            doc.fillColor(P.color).font('Helvetica').fontSize(8).text(P.tagline, M + 14, y + 25, { width: CW - 20 });
            y += 52;

            // Student name + details
            card(M, y, CW, 88);
            doc.fillColor(LGRAY).font('Helvetica-Bold').fontSize(7.5).text('STUDENT PROFILE', M + 14, y + 12);
            doc.fillColor(DARK).font('Helvetica-Bold').fontSize(20).text(sName.toUpperCase(), M + 14, y + 26, { width: 350 });
            const infoItems: [string, string][] = [['Mobile', sMobile], ['Email', sEmail], ['Location', sLocation], ['Questions Answered', String(answered)]];
            let ix = M + 12;
            infoItems.forEach(([l, v]) => {
                doc.fillColor(LGRAY).font('Helvetica').fontSize(6.5).text(l, ix, y + 58);
                doc.fillColor(GRAY).font('Helvetica-Bold').fontSize(8).text(v, ix, y + 69, { width: 116, lineBreak: false });
                ix += 122;
            });
            y += 96;

            // Stream result + match score
            const rcW = Math.round(CW * 0.64), scW = CW - rcW - 10;
            doc.roundedRect(M, y, rcW, 90, 6).fill(P.lightColor).strokeColor(P.color).lineWidth(0.7).stroke();
            doc.fillColor(P.color).font('Helvetica-Bold').fontSize(7.5).text('RECOMMENDED STREAM', M + 14, y + 12);
            doc.fillColor(DARK).font('Helvetica-Bold').fontSize(22).text(P.title, M + 14, y + 27, { width: rcW - 28 });
            doc.fillColor(GRAY).font('Helvetica').fontSize(8.5).text(P.subtitle, M + 14, y + 60, { width: rcW - 28 });
            const scX = M + rcW + 10;
            doc.roundedRect(scX, y, scW, 90, 6).fill(P.color);
            doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(7.5).text('MATCH SCORE', scX, y + 12, { width: scW, align: 'center' });
            doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(38).text(String(matchPct) + '%', scX, y + 27, { width: scW, align: 'center' });
            doc.fillColor(P.lightColor).font('Helvetica').fontSize(7).text('Based on ' + String(answered) + ' responses', scX, y + 73, { width: scW, align: 'center' });
            y += 98;

            // Stream score bars
            y = st(y, 'Stream Score Breakdown');
            const scoreRows = [
                { label: 'Science  (Engineering, Medical, Research)',        pct: sciPct, score: sci, color: '#059669' },
                { label: 'Commerce  (Finance, Business, Entrepreneurship)',  pct: comPct, score: com, color: '#2563EB' },
                { label: 'Arts & Humanities  (Law, Design, Media, UPSC)',    pct: artPct, score: art, color: '#7C3AED' },
            ];
            scoreRows.forEach(r => {
                doc.fillColor(GRAY).font('Helvetica-Bold').fontSize(8.5).text(r.label, M, y + 2, { width: 250 });
                hbar(M + 256, y, 180, 14, r.pct, r.color);
                doc.fillColor(DARK).font('Helvetica-Bold').fontSize(8.5).text(String(r.pct) + '%  (score: ' + String(r.score) + ')', M + 444, y + 2);
                y += 28;
            });
            y += 4;

            // Personality trait pills
            y = st(y, 'Your Personality Traits');
            let px = M;
            P.personality.forEach(tr => {
                const tw = 95;
                doc.roundedRect(px, y, tw, 24, 5).fill(P.lightColor).strokeColor(P.color).lineWidth(0.5).stroke();
                doc.fillColor(P.color).font('Helvetica-Bold').fontSize(8).text(tr, px, y + 8, { width: tw, align: 'center' });
                px += tw + 9;
            });
            y += 32;

            // Personality descriptions
            P.personalityDesc.forEach((desc, i) => {
                doc.fillColor(P.color).font('Helvetica-Bold').fontSize(8).text(P.personality[i] + ': ', M, y + 1);
                const lw = doc.widthOfString(P.personality[i] + ': ') + 2;
                doc.fillColor(GRAY).font('Helvetica').fontSize(8).text(desc, M + lw + 2, y + 1, { width: CW - lw - 2 });
                y += 14;
            });
            y += 6;

            // Assessment insight
            y = st(y, 'Assessment Insight');
            doc.fillColor(GRAY).font('Helvetica').fontSize(8.5).text(P.description, M, y, { width: CW, lineGap: 2.5, align: 'justify' });
            y = Math.min(doc.y + 8, YE - 10);

            // 4 stat boxes
            if (y + 56 < YE) {
                const sbW = (CW - 18) / 4;
                statBox(M,              y, sbW, 50, String(answered), 'Questions Answered', '#2563EB');
                statBox(M + sbW + 6,    y, sbW, 50, String(matchPct) + '%', 'Stream Match Score', P.color);
                statBox(M + (sbW + 6)*2,y, sbW, 50, P.personality[0], 'Primary Trait', '#059669');
                statBox(M + (sbW + 6)*3,y, sbW, 50, dateStr, 'Test Taken On', '#7C3AED');
            }

            ftr();

            // ─────────────────────────────────────────────────────────────────
            // PAGE 2 — FULL SWOT ANALYSIS
            // ─────────────────────────────────────────────────────────────────
            doc.addPage();
            hdr('SWOT ANALYSIS', 'Personalized strength & weakness mapping for ' + P.title, 'Page 2 of 10');
            y = Y0;

            y = st(y, 'SWOT Analysis  —  Based on Your Stream Aptitude Profile');
            const bw2 = (CW - 8) / 2;
            const bh2 = Math.floor((YE - y - 60) / 2);
            const swotData = [
                { label: 'S  — STRENGTHS',    items: P.strengths,     bg: '#ECFDF5', bd: '#6EE7B7', tc: '#065F46', ic: '#059669' },
                { label: 'W  — WEAKNESSES',   items: P.weaknesses,    bg: '#FEF2F2', bd: '#FCA5A5', tc: '#991B1B', ic: '#DC2626' },
                { label: 'O  — OPPORTUNITIES',items: P.opportunities, bg: '#EFF6FF', bd: '#93C5FD', tc: '#1E40AF', ic: '#2563EB' },
                { label: 'T  — THREATS',      items: P.threats,       bg: '#FFFBEB', bd: '#FCD34D', tc: '#92400E', ic: '#D97706' },
            ];
            swotData.forEach((box, idx) => {
                const bx = M + (idx % 2) * (bw2 + 8);
                const by = y + Math.floor(idx / 2) * (bh2 + 8);
                doc.roundedRect(bx, by, bw2, bh2, 7).fill(box.bg).strokeColor(box.bd).lineWidth(0.8).stroke();
                doc.rect(bx, by, bw2, 32).fill(box.ic).strokeColor(box.bd).lineWidth(0).stroke();
                doc.roundedRect(bx, by, bw2, 32, 7).fill(box.ic);
                doc.rect(bx, by + 16, bw2, 16).fill(box.ic);
                doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(10.5).text(box.label, bx + 14, by + 10, { width: bw2 - 20 });
                doc.moveTo(bx + 12, by + 34).lineTo(bx + bw2 - 12, by + 34).strokeColor(box.bd).lineWidth(0.5).stroke();
                let iy = by + 40;
                box.items.forEach((item: string) => {
                    doc.roundedRect(bx + 12, iy + 1, 6, 6, 2).fill(box.ic);
                    doc.fillColor(GRAY).font('Helvetica').fontSize(8)
                       .text(item, bx + 24, iy, { width: bw2 - 36, lineGap: 1 });
                    iy = doc.y + 7;
                    if (iy > by + bh2 - 10) return;
                });
            });
            y += bh2 * 2 + 8 + 12;

            // SWOT summary
            if (y + 46 < YE) {
                doc.roundedRect(M, y, CW, 44, 6).fill(P.lightColor).strokeColor(P.color).lineWidth(0.6).stroke();
                doc.fillColor(P.color).font('Helvetica-Bold').fontSize(8).text('SWOT KEY INSIGHT', M + 14, y + 9);
                doc.fillColor(GRAY).font('Helvetica').fontSize(8.5)
                   .text('Your top SWOT insight: Maximize your ' + P.strengths[0].toLowerCase() + ', while using ' +
                         P.opportunities[0].toLowerCase() + ' as your biggest growth lever this year.', M + 14, y + 22, { width: CW - 28 });
            }

            ftr();

            // ─────────────────────────────────────────────────────────────────
            // PAGE 3 — APTITUDE PROFILE (8 dimensions)
            // ─────────────────────────────────────────────────────────────────
            doc.addPage();
            hdr('APTITUDE PROFILE', 'Your 8-dimension skill assessment with personalized scores', 'Page 3 of 10');
            y = Y0;

            y = st(y, 'Your 8-Dimension Aptitude Assessment  —  Derived From Answer Patterns');
            // intro text
            const aptIntro = 'Based on your ' + String(answered) + ' question responses, your aptitude profile is mapped across 8 core skill dimensions. ' +
                'Each bar is calculated from your actual answer pattern — not a generic profile — and shows your natural strength in that area relative to your peer group. ' +
                'Use this to focus your development and career direction.';
            doc.fillColor(GRAY).font('Helvetica').fontSize(8.5).text(aptIntro, M, y, { width: CW, lineGap: 2 });
            y = doc.y + 12;

            aptBars.forEach((ab, i) => {
                const cardH = 64;
                card(M, y, CW, cardH, i % 2 === 0 ? '#FFFFFF' : '#FAFAFA');
                // rank badge
                doc.roundedRect(M + 10, y + 15, 26, 26, 4).fill(ab.color);
                doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(11).text(String(i + 1), M + 10, y + 22, { width: 26, align: 'center' });
                // label + desc
                doc.fillColor(DARK).font('Helvetica-Bold').fontSize(10.5).text(ab.label, M + 44, y + 10);
                doc.fillColor(LGRAY).font('Helvetica').fontSize(7.5).text(ab.desc, M + 44, y + 26);
                // bar
                const barX = M + 44, barY = y + 44, barW = CW - 90, barH = 11;
                hbar(barX, barY, barW, barH, ab.pct, ab.color);
                // pct label
                doc.fillColor(ab.color).font('Helvetica-Bold').fontSize(9.5).text(String(ab.pct) + '%', M + CW - 40, y + 42);
                // pct context
                const ctx = ab.pct >= 80 ? 'Excellent' : ab.pct >= 65 ? 'Strong' : ab.pct >= 50 ? 'Good' : 'Developing';
                doc.fillColor(LGRAY).font('Helvetica').fontSize(7).text(ctx, M + CW - 40, y + 52);
                y += cardH + 4;
            });

            // Comparison chart (mini vertical bars visual)
            y += 6;
            if (y + 100 < YE) {
                y = st(y, 'Aptitude Comparison Chart  —  All 8 Dimensions');
                const chartW = CW, chartH = 70;
                const bWidth = Math.floor(chartW / aptBars.length) - 6;
                aptBars.forEach((ab, i) => {
                    const bx = M + i * (bWidth + 6);
                    vbar(bx, y + chartH, bWidth, chartH, ab.pct, ab.color);
                    doc.fillColor(LGRAY).font('Helvetica').fontSize(5.5)
                       .text(ab.label.split(' ')[0], bx, y + chartH + 4, { width: bWidth + 4, align: 'center' });
                });
                y += chartH + 20;
            }

            ftr();

            // ─────────────────────────────────────────────────────────────────
            // PAGE 4 — CAREER PATHS (detailed 6 careers)
            // ─────────────────────────────────────────────────────────────────
            doc.addPage();
            hdr('TOP CAREER PATHS', 'Detailed analysis with pros, cons and salary data for ' + P.title, 'Page 4 of 10');
            y = Y0;

            y = st(y, 'Top 6 Career Paths  —  Detailed Pros & Cons Analysis With Salary Data');
            const ccW = (CW - 8) / 2;
            const ccH = 126;
            P.careers.forEach((career: Career, idx: number) => {
                const cx = M + (idx % 2) * (ccW + 8);
                const cy = y + Math.floor(idx / 2) * (ccH + 6);
                card(cx, cy, ccW, ccH, idx % 2 === 0 ? '#FFFFFF' : BG);
                // header strip
                doc.roundedRect(cx, cy, ccW, 28, 6).fill(P.color);
                doc.rect(cx, cy + 14, ccW, 14).fill(P.color);
                doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(9.5).text(career.name, cx + 10, cy + 8, { width: ccW - 100 });
                doc.fillColor(P.lightColor).font('Helvetica-Bold').fontSize(7).text(career.demand + ' Demand', cx + ccW - 86, cy + 10, { width: 78, align: 'right' });
                // salary + growth
                doc.fillColor(P.color).font('Helvetica-Bold').fontSize(7.5).text('SALARY', cx + 10, cy + 33);
                doc.fillColor(DARK).font('Helvetica-Bold').fontSize(8.5).text(career.salary, cx + 10, cy + 43);
                doc.fillColor('#374151').font('Helvetica').fontSize(7).text(career.growth, cx + 10, cy + 54);
                // rating dots
                doc.fillColor('#374151').font('Helvetica-Bold').fontSize(6.5).text('RATING', cx + ccW - 82, cy + 33);
                dots(cx + ccW - 76, cy + 48, career.rating);
                // pros/cons divider
                doc.moveTo(cx + 10, cy + 65).lineTo(cx + ccW - 10, cy + 65).strokeColor(BORD).lineWidth(0.4).stroke();
                // pros (2 shown)
                doc.fillColor('#059669').font('Helvetica-Bold').fontSize(7).text('+ PROS', cx + 10, cy + 70);
                career.pros.slice(0, 2).forEach((p, pi) => {
                    doc.fillColor('#111827').font('Helvetica').fontSize(6.8)
                       .text('+ ' + clampText(p, 58), cx + 10, cy + 80 + pi * 15, { width: (ccW / 2) - 14, lineBreak: false });
                });
                // cons
                doc.fillColor('#DC2626').font('Helvetica-Bold').fontSize(7).text('- CONS', cx + ccW / 2 + 4, cy + 70);
                career.cons.slice(0, 2).forEach((c, ci) => {
                    doc.fillColor('#111827').font('Helvetica').fontSize(6.8)
                       .text('- ' + clampText(c, 58), cx + ccW / 2 + 4, cy + 80 + ci * 15, { width: (ccW / 2) - 14, lineBreak: false });
                });
            });
            y += Math.ceil(P.careers.length / 2) * (ccH + 6) + 8;

            // Salary comparison horizontal chart
            if (y + 110 < YE) {
                y = st(y, 'Salary Range Visual Comparison — Entry to Expert Level');
                const salColors = ['#059669','#2563EB','#7C3AED','#D97706','#E74623','#0891B2'];
                const maxSalW = CW - 120;
                P.careers.forEach((career: Career, i: number) => {
                    const barW = Math.round(maxSalW * (career.rating / 5));
                    doc.fillColor(GRAY).font('Helvetica').fontSize(7.5).text(career.name, M, y + 3, { width: 112 });
                    hbar(M + 116, y, maxSalW, 11, career.rating * 20, salColors[i % salColors.length]);
                    doc.fillColor(salColors[i % salColors.length]).font('Helvetica-Bold').fontSize(7.5).text(career.salary, M + 116 + barW + 4, y + 2);
                    y += 22;
                });
            }

            ftr();

            // ─────────────────────────────────────────────────────────────────
            // PAGE 5 — COURSE GUIDE & EXAM ROADMAP
            // ─────────────────────────────────────────────────────────────────
            doc.addPage();
            hdr('COURSE GUIDE & EXAM ROADMAP', 'Complete course details, fees, exams, and colleges for ' + P.title, 'Page 5 of 10');
            y = Y0;

            y = st(y, 'Recommended Courses  —  With Exam, Difficulty, Fees, Colleges and Our Rating');
            const entryH = 82;
            P.courses.forEach((course: Course, i: number) => {
                card(M, y, CW, entryH, i % 2 === 0 ? '#FFFFFF' : '#FAFAFA');
                // Number badge
                doc.roundedRect(M + 10, y + 10, 30, 30, 5).fill(P.color);
                doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(14).text(String(i + 1), M + 10, y + 18, { width: 30, align: 'center' });
                // Course name
                doc.fillColor(DARK).font('Helvetica-Bold').fontSize(11).text(course.name, M + 50, y + 10, { width: CW - 120 });
                // Exam
                doc.fillColor('#6B7280').font('Helvetica-Bold').fontSize(7.5).text('ENTRANCE EXAM', M + 50, y + 30);
                doc.fillColor(DARK).font('Helvetica').fontSize(8.5).text(course.exam, M + 50, y + 41);
                // Difficulty bar
                doc.fillColor('#6B7280').font('Helvetica-Bold').fontSize(7).text('EXAM DIFFICULTY', M + 50, y + 56);
                diffBar(M + 50, y + 68, course.examDiff);
                const diffLabel = course.examDiff >= 5 ? 'Very Hard' : course.examDiff >= 4 ? 'Hard' : course.examDiff >= 3 ? 'Moderate' : 'Manageable';
                doc.fillColor(LGRAY).font('Helvetica').fontSize(7).text(diffLabel, M + 108, y + 68);
                // Duration + Fees
                doc.fillColor('#6B7280').font('Helvetica-Bold').fontSize(7.5).text('DURATION', M + 220, y + 30);
                doc.fillColor(DARK).font('Helvetica').fontSize(8.5).text(course.duration, M + 220, y + 41);
                doc.fillColor('#6B7280').font('Helvetica-Bold').fontSize(7.5).text('APPROX. FEES', M + 220, y + 56);
                doc.fillColor(P.color).font('Helvetica-Bold').fontSize(8.5).text(course.fees, M + 220, y + 67);
                // Rating
                doc.fillColor('#6B7280').font('Helvetica-Bold').fontSize(7).text('OUR RATING', M + CW - 82, y + 10);
                dots(M + CW - 76, y + 26, course.rating);
                y += entryH + 6;
            });

            // Exam Calendar
            y += 2;
            y = st(y, 'Key Entrance Exam Preparation Timeline');
            const examCal = [
                { month: 'Class 11 (Full Year)', task: 'NCERT foundation + coaching enrollment + basics',  color: '#059669' },
                { month: 'Class 12 (Apr-Nov)',   task: 'Board exam prep + regular entrance mock tests',   color: '#2563EB' },
                { month: 'Class 12 (Dec-Jan)',   task: 'Intense revision + 3 full mocks per week target', color: '#7C3AED' },
                { month: 'Class 12 (Feb-Mar)',   task: 'Board examinations + last-minute aptitude review', color: '#D97706' },
                { month: 'Class 12 (Apr-Jun)',   task: 'Entrance exams: JEE/NEET/CLAT/CUET all held here', color: BRAND   },
            ];
            examCal.forEach((ec, i) => {
                if (y + 30 > YE) return;
                doc.roundedRect(M, y, 130, 26, 4).fill(ec.color + '22').strokeColor(ec.color).lineWidth(0.5).stroke();
                doc.fillColor(ec.color).font('Helvetica-Bold').fontSize(7.5).text(ec.month, M + 8, y + 9, { width: 114 });
                if (i < examCal.length - 1) {
                    doc.moveTo(M + 65, y + 26).lineTo(M + 65, y + 34).strokeColor(ec.color).lineWidth(1.5).stroke();
                }
                doc.fillColor(GRAY).font('Helvetica').fontSize(8).text(ec.task, M + 140, y + 8, { width: CW - 146 });
                y += 34;
            });

            ftr();

            // ─────────────────────────────────────────────────────────────────
            // PAGE 6 — 90-DAY ACTION PLAN
            // ─────────────────────────────────────────────────────────────────
            doc.addPage();
            hdr('90-DAY ACTION PLAN', 'Structured 3-phase preparation roadmap for ' + P.title, 'Page 6 of 10');
            y = Y0;

            y = st(y, '90-Day Structured Action Plan  —  Phase-by-Phase Preparation Roadmap');
            const phases = P.phases;
            const phaseH = Math.floor((YE - y - 100) / 3);
            phases.forEach((phase: Phase, pi: number) => {
                card(M, y, CW, phaseH, '#FFFFFF');
                // colored left strip
                doc.rect(M, y, 6, phaseH).fill(phase.color);
                doc.roundedRect(M, y, 6, phaseH, 3).fill(phase.color);
                // header
                doc.roundedRect(M + 6, y, CW - 6, 30, 0).fill(phase.color + '18');
                doc.rect(M + 6, y + 6, CW - 6, 24).fill(phase.color + '18');
                doc.fillColor(phase.color).font('Helvetica-Bold').fontSize(10).text(phase.period, M + 18, y + 9, { width: 380 });
                doc.fillColor(GRAY).font('Helvetica-Bold').fontSize(8).text('Focus: ' + phase.focus, M + 18, y + 22, { width: 340 });
                // badge
                doc.roundedRect(M + CW - 100, y + 7, 90, 18, 4).fill(phase.color);
                doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(7.5).text('Phase ' + String(pi + 1) + ' of 3', M + CW - 100, y + 13, { width: 90, align: 'center' });
                // tasks
                let ty = y + 36;
                phase.tasks.forEach((task: string, ti: number) => {
                    doc.roundedRect(M + 18, ty + 2, 16, 16, 3).fill(phase.color);
                    doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(8).text(String(ti + 1), M + 18, ty + 6, { width: 16, align: 'center' });
                    doc.fillColor(DARK).font('Helvetica').fontSize(8).text(task, M + 40, ty + 3, { width: CW - 56, lineGap: 1.5 });
                    ty += 20;
                    if (ty + 20 > y + phaseH - 6) return;
                });
                y += phaseH + 4;
            });
            y += 6;

            // Study tips section
            if (y + 120 < YE) {
                y = st(y, 'Essential Study Tips for ' + P.title);
                const tipCols = 2;
                const tipW = (CW - 8) / tipCols;
                P.studyTips.forEach((tip: string, ti: number) => {
                    const tx = M + (ti % tipCols) * (tipW + 8);
                    const ty2 = y + Math.floor(ti / tipCols) * 32;
                    card(tx, ty2, tipW, 28, BG);
                    doc.roundedRect(tx + 8, ty2 + 8, 12, 12, 3).fill(P.color);
                    doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(7).text(String(ti + 1), tx + 8, ty2 + 12, { width: 12, align: 'center' });
                    doc.fillColor(GRAY).font('Helvetica').fontSize(7.5).text(tip, tx + 26, ty2 + 9, { width: tipW - 32 });
                });
                y += Math.ceil(P.studyTips.length / tipCols) * 32 + 10;
            }

            // Resources
            if (y + 90 < YE) {
                y = st(y, 'Top Study Resources & Materials');
                P.resources.forEach((res: string) => {
                    doc.roundedRect(M, y, 8, 8, 2).fill(P.color);
                    doc.fillColor(GRAY).font('Helvetica').fontSize(8).text(res, M + 14, y, { width: CW - 16 });
                    y += 16;
                });
            }

            ftr();

            // ─────────────────────────────────────────────────────────────────
            // PAGE 7 — SALARY FORECAST & FINANCIAL ROADMAP
            // ─────────────────────────────────────────────────────────────────
            doc.addPage();
            hdr('SALARY FORECAST & FINANCIAL ROADMAP', 'Career growth trajectory and earnings potential for ' + P.title, 'Page 7 of 10');
            y = Y0;

            y = st(y, 'Career Growth & Salary Forecast  —  Year-by-Year Earnings Projection');
            // Table header
            doc.rect(M, y, CW, 26).fill(DARK);
            doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(8.5);
            doc.text('Career Stage',    M + 12,  y + 9);
            doc.text('Salary Range',    M + 180, y + 9);
            doc.text('Growth Rate',     M + 310, y + 9);
            doc.text('Timeline',        M + 430, y + 9);
            y += 26;
            P.salaryMatrix.forEach((row: SalRow, i: number) => {
                const rowH = 30;
                doc.rect(M, y, CW, rowH).fill(i % 2 === 0 ? '#FFFFFF' : BG).strokeColor(BORD).lineWidth(0.4).stroke();
                doc.fillColor(GRAY).font('Helvetica').fontSize(8.5).text(row.level, M + 12, y + 11);
                doc.fillColor('#2563EB').font('Helvetica-Bold').fontSize(9).text(row.range,  M + 180, y + 11);
                doc.fillColor('#059669').font('Helvetica-Bold').fontSize(8.5).text(row.growth, M + 310, y + 11);
                doc.fillColor(LGRAY).font('Helvetica').fontSize(8.5).text(row.years,  M + 430, y + 11);
                y += rowH;
            });
            y += 14;

            // Visual salary progression bars
            y = st(y, 'Visual Salary Progression Chart  —  Growth Stage Comparison');
            const salStages = P.salaryMatrix.map((r: SalRow) => ({
                label: r.level.split('(')[0].trim(),
                // Extract first number from range for rough scale
                scale: r.level.includes('10+') ? 100 : r.level.includes('5-10') ? 75 : r.level.includes('2-5') ? 50 : 25,
                color: r.level.includes('10+') ? BRAND : r.level.includes('5-10') ? '#7C3AED' : r.level.includes('2-5') ? '#2563EB' : '#059669',
            }));
            const chartAreaH = 100;
            const barW3 = Math.floor((CW - 20) / salStages.length) - 10;
            salStages.forEach((s, i) => {
                const bx = M + i * (barW3 + 10);
                vbar(bx, y + chartAreaH, barW3, chartAreaH, s.scale, s.color);
                doc.fillColor(s.color).font('Helvetica-Bold').fontSize(8).text(String(s.scale) + '%', bx, y + chartAreaH - 16, { width: barW3, align: 'center' });
                doc.fillColor(LGRAY).font('Helvetica').fontSize(6.5).text(s.label, bx - 8, y + chartAreaH + 4, { width: barW3 + 16, align: 'center' });
            });
            y += chartAreaH + 24;

            // Education ROI
            y = st(y, 'Education Investment vs Career Return  —  Is it Worth It?');
            const roiData = [
                { label: 'Course Fees (Total)',     value: P.courses[0]?.fees + '/yr approx', color: '#DC2626', pct: 25 },
                { label: 'Entry Level Starting Salary', value: P.salaryMatrix[0]?.range + '/yr', color: '#059669', pct: 35 },
                { label: 'Mid-Career Salary (5 yrs)',   value: P.salaryMatrix[1]?.range + '/yr', color: '#2563EB', pct: 65 },
                { label: 'Senior Level Salary (10 yr)', value: P.salaryMatrix[2]?.range + '/yr', color: '#7C3AED', pct: 100 },
            ];
            roiData.forEach(r => {
                doc.fillColor(GRAY).font('Helvetica-Bold').fontSize(8.5).text(r.label, M, y + 3, { width: 210 });
                hbar(M + 214, y, CW - 310, 12, r.pct, r.color);
                doc.fillColor(r.color).font('Helvetica-Bold').fontSize(8.5).text(r.value, M + CW - 90, y + 2);
                y += 24;
            });
            y += 8;

            // India-specific opportunities section
            if (y + 120 < YE) {
                y = st(y, 'India-Specific Career Opportunities for Your Stream');
                P.indiaOpportunities.forEach((opp: string, i: number) => {
                    card(M, y, CW, 28, i % 2 === 0 ? P.lightColor : '#FFFFFF');
                    doc.roundedRect(M + 8, y + 8, 14, 14, 3).fill(P.color);
                    doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(7.5).text('IN', M + 8, y + 12, { width: 14, align: 'center' });
                    doc.fillColor(DARK).font('Helvetica').fontSize(8).text(opp, M + 28, y + 9, { width: CW - 36 });
                    y += 32;
                });
            }

            ftr();

            // ─────────────────────────────────────────────────────────────────
            // PAGE 8 — INDUSTRY TRENDS
            // ─────────────────────────────────────────────────────────────────
            doc.addPage();
            hdr('INDUSTRY TRENDS & FUTURE SKILLS', 'Market intelligence and top in-demand skills for ' + P.title, 'Page 8 of 10');
            y = Y0;

            y = st(y, 'Top 6 Industry Trends  —  What is Driving Career Growth in Your Field');
            const trendW = (CW - 8) / 2;
            const trendH = Math.floor((YE - y - 160) / 3);
            P.trends.forEach((trend: Trend, ti: number) => {
                const tx = M + (ti % 2) * (trendW + 8);
                const ty = y + Math.floor(ti / 2) * (trendH + 6);
                card(tx, ty, trendW, trendH, '#FFFFFF');
                doc.roundedRect(tx, ty, trendW, 26, 6).fill(trend.color + '22');
                doc.rect(tx, ty + 14, trendW, 12).fill(trend.color + '22');
                doc.rect(tx, ty, 5, trendH).fill(trend.color);
                doc.roundedRect(tx, ty, 5, trendH, 3).fill(trend.color);
                doc.fillColor(trend.color).font('Helvetica-Bold').fontSize(9).text(trend.area, tx + 14, ty + 8, { width: trendW - 110 });
                doc.roundedRect(tx + trendW - 100, ty + 6, 92, 18, 4).fill(trend.color);
                doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(7).text(trend.stat, tx + trendW - 100, ty + 12, { width: 92, align: 'center' });
                doc.moveTo(tx + 12, ty + 28).lineTo(tx + trendW - 12, ty + 28).strokeColor(BORD).lineWidth(0.4).stroke();
                doc.fillColor(GRAY).font('Helvetica').fontSize(7.5)
                   .text(trend.detail, tx + 12, ty + 34, { width: trendW - 24, lineGap: 1.5 });
            });
            y += Math.ceil(P.trends.length / 2) * (trendH + 6) + 10;

            // Top skills section
            y = st(y, 'Top In-Demand Skills for ' + P.title + '  —  Build These in Class 11 & 12');
            const skillsWide = [
                { label: primary === 'science'  ? 'Python / Data Science'       : primary === 'commerce' ? 'Excel / Financial Modeling' : 'Communication / Writing',    pct: Math.min(97, sciPct + 18), color: P.color,     desc: 'Core technical skill for your stream' },
                { label: primary === 'science'  ? 'Mathematics / Statistics'    : primary === 'commerce' ? 'Tally ERP / Accounting'      : 'Creative Portfolio / Design', pct: Math.min(97, sciPct + 10), color: '#2563EB',   desc: 'High ROI skill for exam and career' },
                { label: primary === 'science'  ? 'Problem Solving / Algorithms': primary === 'commerce' ? 'Business Communication'      : 'Research / Analysis',         pct: Math.min(97, comPct + 12), color: '#7C3AED',   desc: 'Differentiator in competitive job market' },
                { label: primary === 'science'  ? 'Physics / Chemistry Core'    : primary === 'commerce' ? 'CA / Taxation Basics'        : 'Public Speaking / Debate',    pct: Math.min(97, artPct + 15), color: '#D97706',   desc: 'Builds subject mastery and depth' },
                { label: 'Critical Thinking',      pct: Math.min(97, Math.round((sciPct + comPct) / 2 + 8)), color: '#059669',   desc: 'Universally valued in all stream careers' },
                { label: 'Digital Literacy / Tech', pct: Math.min(97, sciPct + 4), color: BRAND,                                desc: 'Every modern career requires basic tech skill' },
            ];
            skillsWide.forEach(ab => {
                doc.fillColor(DARK).font('Helvetica-Bold').fontSize(9).text(ab.label, M, y + 2, { width: 200 });
                doc.fillColor(LGRAY).font('Helvetica').fontSize(7).text(ab.desc, M + 204, y + 4, { width: 148 });
                hbar(M + 356, y, 110, 12, ab.pct, ab.color);
                doc.fillColor(ab.color).font('Helvetica-Bold').fontSize(8.5).text(String(ab.pct) + '%', M + 474, y + 2);
                y += 22;
            });

            ftr();

            // ─────────────────────────────────────────────────────────────────
            // PAGE 9 — FUTURE OUTLOOK
            // ─────────────────────────────────────────────────────────────────
            doc.addPage();
            hdr('FUTURE OUTLOOK & MARKET INTELLIGENCE', 'India and global market forecast for your career stream', 'Page 9 of 10');
            y = Y0;

            // Future stats 4-box
            y = st(y, 'Key Market Statistics  —  Why Your Stream Has Exceptional Future Prospects');
            const fsW = (CW - 18) / 4;
            const fsH = 72;
            P.futureStats.forEach((fs: FStat, fi: number) => {
                const fx = M + fi * (fsW + 6);
                card(fx, y, fsW, fsH, fs.color + '12', fs.color);
                doc.rect(fx, y, fsW, 6).fill(fs.color);
                doc.fillColor(fs.color).font('Helvetica-Bold').fontSize(18).text(fs.value, fx, y + 16, { width: fsW, align: 'center' });
                doc.fillColor(GRAY).font('Helvetica').fontSize(6.5).text(fs.label, fx + 6, y + 48, { width: fsW - 12, align: 'center', lineGap: 1 });
            });
            y += fsH + 14;

            // India opportunities in depth
            y = st(y, 'India-Specific Opportunities  —  Why NOW is the Best Time for Your Stream');
            P.indiaOpportunities.forEach((opp: string, oi: number) => {
                const oColors = [P.color, '#2563EB', '#7C3AED', '#D97706', '#059669'];
                const oc = oColors[oi % oColors.length];
                card(M, y, CW, 34, oc + '10');
                doc.roundedRect(M, y, CW, 34, 5).fill(oc + '10').strokeColor(oc).lineWidth(0.5).stroke();
                doc.roundedRect(M + 8, y + 9, 18, 18, 4).fill(oc);
                doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(9).text(String(oi + 1), M + 8, y + 13, { width: 18, align: 'center' });
                doc.fillColor(DARK).font('Helvetica').fontSize(8.5).text(opp, M + 34, y + 11, { width: CW - 44 });
                y += 38;
            });
            y += 6;

            // Career timeline visual
            y = st(y, '10-Year Career Journey  —  What to Expect at Each Stage of Your Career');
            const timelineSteps = [
                { stage: 'Class 11-12',   focus: 'Foundation: choose stream, start prep',    col: '#059669', yr: 'Now'    },
                { stage: 'Year 1-2',      focus: 'Degree: college + internships + skills',   col: '#2563EB', yr: 'Age 18' },
                { stage: 'Year 3-4',      focus: 'Graduate: first job or PG entrance prep',  col: '#7C3AED', yr: 'Age 21' },
                { stage: 'Year 5-7',      focus: 'Growth: specialist role + salary jumps',   col: '#D97706', yr: 'Age 25' },
                { stage: 'Year 8-10',     focus: 'Senior: team lead or independent practice', col: BRAND,   yr: 'Age 28' },
            ];
            const tlStepW = Math.floor(CW / timelineSteps.length);
            const tlLineY = y + 22;
            // Draw connecting line
            doc.moveTo(M, tlLineY).lineTo(M + CW, tlLineY).strokeColor('#E2E8F0').lineWidth(2).stroke();
            timelineSteps.forEach((step, si) => {
                const sx = M + si * tlStepW + tlStepW / 2;
                doc.circle(sx, tlLineY, 7).fill(step.col);
                doc.fillColor(step.col).font('Helvetica-Bold').fontSize(7.5).text(step.yr, sx - 16, y + 4, { width: 32, align: 'center' });
                doc.fillColor(DARK).font('Helvetica-Bold').fontSize(7).text(step.stage, sx - tlStepW / 2 + 4, y + 34, { width: tlStepW - 8, align: 'center' });
                doc.fillColor(LGRAY).font('Helvetica').fontSize(6.5).text(step.focus, sx - tlStepW / 2 + 4, y + 46, { width: tlStepW - 8, align: 'center', lineGap: 1 });
            });
            y += 70;

            // Global outlook
            y = st(y, 'Global Career Outlook  —  International Opportunities for Your Stream');
            const globalPoints = primary === 'science'
                ? ['India is the #1 source of tech talent for Silicon Valley and global tech companies.',
                   'MBBS graduates can pursue USMLE (USA), PLAB (UK), and work globally with high salaries.',
                   'Data Science and AI roles have the highest global demand with remote work options.',
                   'Indian engineers in Germany, Canada, Australia are in high demand under skilled migration.',
                   'SpaceX, NASA, ESA recruit from IIT and top Indian engineering colleges.']
                : primary === 'commerce'
                ? ['Indian CAs are recognized by ICAEW (UK) and AICPA (USA) for global accounting roles.',
                   'Goldman Sachs, Morgan Stanley, Blackrock all have major India offices hiring MBAs.',
                   'Indian CFOs and Finance Directors are leading global companies in US, UK, Singapore.',
                   'ISB Hyderabad ranks in top 30 global MBA programs — opens international doors.',
                   'FinTech companies in Singapore, Dubai recruit extensively from Indian commerce graduates.']
                : ['Indian civil services officers work with UN agencies, World Bank as consultants.',
                   'Indian lawyers increasingly practice in Dubai, Singapore (DIFC Court), and UK courts.',
                   'UX Designers from India are hired remotely by US, European tech companies.',
                   'UNHCR, UNICEF, ILO hire humanities and social sciences graduates from India regularly.',
                   'India\'s OTT boom attracts international filmmakers and co-production opportunities.'];
            globalPoints.forEach((pt: string, gi: number) => {
                doc.roundedRect(M, y + 1, 7, 7, 2).fill(P.color);
                doc.fillColor(GRAY).font('Helvetica').fontSize(8.5).text(pt, M + 14, y, { width: CW - 16 });
                y += 18;
            });

            ftr();

            // ─────────────────────────────────────────────────────────────────
            // PAGE 10 — EDNOVATE BRANDING & PROGRAMS
            // ─────────────────────────────────────────────────────────────────
            doc.addPage();
            hdr('EDNOVATE — YOUR CAREER PARTNER', 'Courses, programs, and guidance for every stream in India', 'Page 10 of 10');
            y = Y0;

            // Big logo banner
            doc.roundedRect(M, y, CW, 70, 8).fill('#FFF7F5').strokeColor(BRAND).lineWidth(1).stroke();
            if (logoSvg) {
                try { SVGtoPDF(doc as any, logoSvg, M + 20, y + 12, { width: 180, height: 46, preserveAspectRatio: 'xMinYMid meet' }); }
                catch {
                    doc.fillColor(BRAND).font('Helvetica-Bold').fontSize(26).text('EDNOVATE', M + 20, y + 20);
                }
            } else {
                doc.fillColor(BRAND).font('Helvetica-Bold').fontSize(26).text('EDNOVATE', M + 20, y + 20);
            }
            doc.fillColor(DARK).font('Helvetica-Bold').fontSize(11).text('India\'s #1 AI-Powered Career Counseling Platform for Class 10 Students', M + 220, y + 18, { width: CW - 240 });
            doc.fillColor('#6B7280').font('Helvetica').fontSize(8).text('Science  |  Commerce  |  Arts  |  AI Assessment  |  1-on-1 Expert Mentorship', M + 220, y + 40, { width: CW - 240 });
            doc.fillColor(BRAND).font('Helvetica-Bold').fontSize(9).text('letsednovate.com  |  WhatsApp: 8651014840', M + 220, y + 55, { width: CW - 240 });
            y += 78;

            // About section
            y = st(y, 'About Ednovate');
            const aboutText = 'Ednovate is a premier Mumbai-based coaching institute founded in 2020, specializing in Chartered Accountancy (CA) and commerce education. Led by experienced faculty, it is known for high pass percentages and multiple All India Ranks (AIRs). The institute offers conceptual, test-based learning via face-to-face classroom programs, live interactive sessions, and recorded lectures, with personalized mentorship, 24x7 doubt support, and rigorous writing practice. Ednovate also runs a KYM (Know Your Mistake) reporting system and student events like Edno Fest, Edno Raas, and Edno Run.';
            doc.fillColor(GRAY).font('Helvetica').fontSize(8.5).text(aboutText, M, y, { width: CW, lineGap: 2, align: 'justify' });
            y = doc.y + 12;

            // Programs in 3 columns
            y = st(y, 'Our Complete Commerce Program Portfolio');
            const progW = (CW - 16) / 3;
            const programs = [
                {
                    stream: 'CA TRACK',
                    color: '#2563EB',
                    courses: [
                        'CA Foundation',
                        'CA Intermediate',
                        'CA Final',
                        'FYJC / SYJC Commerce',
                        'KYM Report Tracking',
                        'AIR-Focused Test Series',
                    ],
                    price: 'Starting INR 999',
                },
                {
                    stream: 'GLOBAL FINANCE CERTS',
                    color: '#7C3AED',
                    courses: [
                        'CFA',
                        'ACCA',
                        'CMA-US',
                        'FRM',
                        'FMAA',
                        'Career Mentorship for Finance Roles',
                    ],
                    price: 'Starting INR 999',
                },
                {
                    stream: 'MENTORSHIP & SUPPORT',
                    color: '#059669',
                    courses: [
                        '24x7 Doubt Support',
                        'Personal Mentorship',
                        'Concept + Writing Practice',
                        'Live + Recorded Hybrid Learning',
                        'Mumbai Classroom Programs',
                        'Performance Analytics Dashboard',
                    ],
                    price: 'Starting INR 999',
                },
            ];
            programs.forEach((prog, pi) => {
                const px = M + pi * (progW + 8);
                const pH = 190;
                doc.roundedRect(px, y, progW, pH, 7).fill(prog.color + '10').strokeColor(prog.color).lineWidth(0.8).stroke();
                doc.roundedRect(px, y, progW, 28, 7).fill(prog.color);
                doc.rect(px, y + 14, progW, 14).fill(prog.color);
                doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(8.5).text(prog.stream, px + 10, y + 9, { width: progW - 20, align: 'center' });
                let ry = y + 34;
                prog.courses.forEach((course, ci) => {
                    doc.roundedRect(px + 8, ry + 2, 8, 8, 2).fill(prog.color);
                    doc.fillColor(DARK).font('Helvetica').fontSize(7.5).text(course, px + 22, ry + 1, { width: progW - 28 });
                    ry += 20;
                    if (ry > y + pH - 28) return;
                });
                doc.roundedRect(px + 8, y + pH - 22, progW - 16, 16, 4).fill(prog.color);
                doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(7.5).text(prog.price, px + 8, y + pH - 17, { width: progW - 16, align: 'center' });
            });
            y += 198;

            // Why choose Ednovate
            y = st(y, 'Why 10,000+ Students Trust Ednovate');
            const whyPoints = [
                { icon: 'AIR', title: 'Rank-Focused Training', desc: 'Ednovate has produced 51+ AIRs with structured exam-focused preparation and rigorous testing.', color: BRAND },
                { icon: 'CA', title: 'Specialized Commerce Focus', desc: 'Deep specialization in CA and commerce education with high-result classroom and online systems.', color: '#2563EB' },
                { icon: 'KYM', title: 'KYM Report System', desc: 'Know Your Mistake reports help students track weak areas and improve in every test cycle.', color: '#7C3AED' },
                { icon: '24x7', title: 'Mentorship + Doubt Support', desc: 'Personal mentorship, 24x7 doubt support, and writing practice ensure consistent progress.', color: '#059669' },
                { icon: 'HYB', title: 'Hybrid Learning Formats', desc: 'Face-to-face Mumbai classes, live sessions, and recorded lectures in one ecosystem.', color: '#D97706' },
            ];
            const wyW = (CW - 8) / 2;
            const wyH = 44;
            whyPoints.forEach((wp, wi) => {
                const wx = M + (wi % 2) * (wyW + 8);
                const wy = y + Math.floor(wi / 2) * (wyH + 6);
                card(wx, wy, wyW, wyH, wp.color + '10');
                doc.roundedRect(wx + 8, wy + 10, 26, 26, 5).fill(wp.color);
                doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(8).text(wp.icon, wx + 8, wy + 19, { width: 26, align: 'center' });
                doc.fillColor(DARK).font('Helvetica-Bold').fontSize(8.5).text(wp.title, wx + 42, wy + 9);
                doc.fillColor(GRAY).font('Helvetica').fontSize(7).text(wp.desc, wx + 42, wy + 22, { width: wyW - 50 });
            });
            y += Math.ceil(whyPoints.length / 2) * (wyH + 6) + 12;

            // Final CTA
            if (y + 70 < YE) {
                doc.roundedRect(M, y, CW, 68, 8).fill('#FFF7F5').strokeColor(BRAND).lineWidth(1).stroke();
                doc.rect(M, y, CW, 6).fill(BRAND);
                doc.roundedRect(M, y, CW, 8, 4).fill(BRAND);
                doc.fillColor(BRAND).font('Helvetica-Bold').fontSize(14)
                   .text('Start Your Career Journey With Ednovate Today', M, y + 16, { width: CW, align: 'center' });
                doc.fillColor(GRAY).font('Helvetica').fontSize(9)
                   .text('Talk to our expert counselors and get your personalized roadmap within 24 hours.', M, y + 36, { width: CW, align: 'center' });
                doc.fillColor(BRAND).font('Helvetica-Bold').fontSize(12)
                   .text('Call / WhatsApp: 8651014840   |   letsednovate.com', M, y + 52, { width: CW, align: 'center' });
            }

            ftr();
            doc.end();
        })().catch(reject);
    });
