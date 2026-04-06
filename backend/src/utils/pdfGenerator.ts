import PDFDocument from 'pdfkit';

type StreamKey = 'science' | 'commerce' | 'arts';

interface Career  { name: string; rating: number; salary: string; }
interface Course  { name: string; exam: string; rating: number; duration: string; }
interface SalRow  { level: string; range: string; growth: string; years: string; }
interface Profile {
    title: string; subtitle: string; tagline: string; description: string;
    personality: string[];
    strengths: string[]; weaknesses: string[]; opportunities: string[]; threats: string[];
    careers: Career[]; courses: Course[]; nextSteps: string[]; salaryMatrix: SalRow[];
    color: string; lightColor: string;
}

const PROFILES: Record<StreamKey, Profile> = {
    science: {
        title: 'Science Stream',
        subtitle: 'Engineering, Medical and Research',
        tagline: 'Built for Innovation and Problem Solving',
        description:
            'Your assessment responses reflect strong analytical thinking, technical curiosity, and structured problem-solving ability. ' +
            'You naturally break complex challenges into logical steps — a core strength for engineering, medical, data science, and research careers.',
        personality: ['Analytical', 'Detail-Oriented', 'Methodical', 'Curious', 'Persistent'],
        strengths: [
            'Strong logical and analytical reasoning ability',
            'Technical aptitude with systematic and structured thinking',
            'Performs well under structured exam conditions like JEE/NEET',
        ],
        weaknesses: [
            'May find open-ended creative tasks less engaging',
            'Entrance exams (JEE/NEET) demand very high discipline and preparation',
            'Risk of burnout if subject interest is not genuinely deep',
        ],
        opportunities: [
            'Massive demand for engineers, doctors, and data scientists in India',
            'AI, data science, and biotech are high-growth fields globally',
            'Research fellowships and government scholarships are widely available',
        ],
        threats: [
            'JEE and NEET have extremely high competition among lakhs of students',
            'Rapid technology changes require continuous upskilling throughout career',
            'Long course duration for medical pathways (5 to 6 years)',
        ],
        careers: [
            { name: 'Software Engineer',   rating: 5, salary: 'INR 6L - 40L+' },
            { name: 'Doctor (MBBS / MD)',  rating: 5, salary: 'INR 8L - 50L+' },
            { name: 'Data Scientist',      rating: 5, salary: 'INR 8L - 35L+' },
            { name: 'Civil Engineer',      rating: 4, salary: 'INR 4L - 20L+' },
            { name: 'Research Scientist',  rating: 4, salary: 'INR 6L - 25L+' },
            { name: 'Architect',           rating: 3, salary: 'INR 5L - 18L+' },
        ],
        courses: [
            { name: 'B.Tech / B.E.',         exam: 'JEE Main / JEE Advanced', rating: 5, duration: '4 years'   },
            { name: 'MBBS / BDS',            exam: 'NEET UG',                 rating: 5, duration: '5.5 years' },
            { name: 'B.Sc (PCM / PCB)',      exam: 'CUET / State CET',        rating: 4, duration: '3 years'   },
            { name: 'B.Sc Computer Science', exam: 'CUET / University',       rating: 4, duration: '3 years'   },
            { name: 'Diploma Engineering',   exam: 'State Polytechnic Board', rating: 3, duration: '3 years'   },
        ],
        nextSteps: [
            'Take PCM for engineering or PCB for medical in Class 11 based on your long-term career goal.',
            'Begin JEE or NEET preparation from Class 11 with 4 to 5 hours of structured daily study.',
            'Master NCERT textbooks first, then move to higher JEE or NEET level problems and mock tests.',
            'Attempt full-length mock tests monthly, analyze weak areas, and revise consistently.',
        ],
        salaryMatrix: [
            { level: 'Entry Level (0-2 yrs)',   range: 'INR 4L - 10L',   growth: 'Steady',   years: '1-2 yrs'  },
            { level: 'Mid Level (2-5 yrs)',     range: 'INR 10L - 25L',  growth: 'Fast',     years: '3-5 yrs'  },
            { level: 'Senior (5-10 yrs)',       range: 'INR 25L - 60L',  growth: 'High',     years: '6-10 yrs' },
            { level: 'Expert / Lead (10+ yrs)', range: 'INR 60L - 2Cr+', growth: 'Top Tier', years: '10+ yrs'  },
        ],
        color: '#059669', lightColor: '#ECFDF5',
    },
    commerce: {
        title: 'Commerce Stream',
        subtitle: 'Finance, Business and Management',
        tagline: 'Built for Leadership and Financial Excellence',
        description:
            'Your assessment reveals strong business judgment, financial awareness, and outstanding leadership potential. ' +
            'You naturally think in systems, outcomes, and value creation. Students with this profile commonly achieve excellence in CA, MBA, investment banking, and entrepreneurship.',
        personality: ['Strategic', 'Goal-Oriented', 'Persuasive', 'Confident', 'Results-Driven'],
        strengths: [
            'Strong business acumen and financial thinking ability',
            'Excellent decision-making and natural leadership qualities',
            'Outstanding communication and persuasion skills',
        ],
        weaknesses: [
            'May require additional effort to build quantitative and data skills',
            'CA pathway is long and demands very high persistence and dedication',
            'Early entrepreneurship years often involve financial uncertainty',
        ],
        opportunities: [
            'India fintech boom creating high-demand roles in finance and banking',
            'Growing startup ecosystem and access to early-stage venture funding',
            'Global career options in investment banking, consulting, and management',
        ],
        threats: [
            'Automation is rapidly affecting routine accounting and finance jobs',
            'Top MBA programs (IIMs) are intensely competitive requiring high CAT score',
            'Global market volatility can affect finance and business careers',
        ],
        careers: [
            { name: 'Chartered Accountant (CA)', rating: 5, salary: 'INR 7L - 50L+'      },
            { name: 'Investment Banker',         rating: 5, salary: 'INR 10L - 1Cr+'      },
            { name: 'MBA Graduate',              rating: 5, salary: 'INR 8L - 40L+'       },
            { name: 'Financial Analyst',         rating: 4, salary: 'INR 6L - 25L+'       },
            { name: 'Entrepreneur',              rating: 4, salary: 'Variable / INR 10L+' },
            { name: 'Marketing Manager',         rating: 3, salary: 'INR 5L - 20L+'       },
        ],
        courses: [
            { name: 'CA Foundation to Final', exam: 'ICAI Examinations',  rating: 5, duration: '5 years'    },
            { name: 'BBA / BMS',              exam: 'IPMAT / CUET',       rating: 5, duration: '3 years'    },
            { name: 'B.Com (Hons)',           exam: 'CUET / State Board', rating: 4, duration: '3 years'    },
            { name: 'CMA Foundation',         exam: 'ICAI CMA',           rating: 4, duration: '4 years'    },
            { name: 'MBA (Post-Graduation)',  exam: 'CAT / MAT / XAT',    rating: 5, duration: '2 years PG' },
        ],
        nextSteps: [
            'Choose Accountancy, Economics, Business Studies, and Maths in Class 11.',
            'Register for CA Foundation after Class 12 Boards if you are targeting the CA pathway.',
            'Build Excel, Tally ERP, and presentation skills from Class 11 itself for an early edge.',
            'Prepare for IPMAT or CUET to target top BBA or Integrated MBA colleges.',
        ],
        salaryMatrix: [
            { level: 'Entry Level (0-2 yrs)',          range: 'INR 4L - 8L',    growth: 'Steady',   years: '1-2 yrs'  },
            { level: 'Analyst / Executive (2-5 yrs)',  range: 'INR 8L - 20L',   growth: 'Fast',     years: '3-5 yrs'  },
            { level: 'Manager (5-10 yrs)',             range: 'INR 20L - 45L',  growth: 'High',     years: '6-10 yrs' },
            { level: 'CXO / Partner (10+ yrs)',        range: 'INR 50L - 2Cr+', growth: 'Top Tier', years: '10+ yrs'  },
        ],
        color: '#2563EB', lightColor: '#EFF6FF',
    },
    arts: {
        title: 'Arts and Humanities',
        subtitle: 'Law, Design, Media and Social Sciences',
        tagline: 'Built for Creative Expression and Social Impact',
        description:
            'Your responses reveal exceptional creative thinking, strong communication ability, and deep social awareness. ' +
            'You have a natural empathy for people and a flair for original expression. This profile fits careers in law, psychology, civil services, design, journalism, and digital media.',
        personality: ['Creative', 'Empathetic', 'Expressive', 'Independent', 'Change-Maker'],
        strengths: [
            'Outstanding communication and storytelling capability',
            'Creative and original thinking in complex real-world situations',
            'Strong social awareness and empathy that drives human-centered work',
        ],
        weaknesses: [
            'Arts career paths are often underestimated which can cause self-doubt',
            'Entry-level salaries are typically lower, requiring patience in early years',
            'Strong personal portfolio and personal branding are essential to stand out',
        ],
        opportunities: [
            'Massive demand for designers, UX experts, and digital content creators',
            'Growing professional value of psychology, law, and social science degrees',
            'Government opportunities through UPSC, state services, and policy careers',
        ],
        threats: [
            'Social pressure to pursue science or commerce creates external friction',
            'Income can be inconsistent in early creative, media, and freelance careers',
            'Market perception in Tier 2 and Tier 3 cities still limits opportunities',
        ],
        careers: [
            { name: 'Civil Services (IAS / IPS)', rating: 5, salary: 'INR 8L - 25L + perks' },
            { name: 'Lawyer / LLB',               rating: 5, salary: 'INR 5L - 1Cr+'         },
            { name: 'UI / UX Designer',           rating: 4, salary: 'INR 5L - 30L+'         },
            { name: 'Psychologist',               rating: 4, salary: 'INR 4L - 20L+'         },
            { name: 'Content Strategist',         rating: 4, salary: 'INR 4L - 18L+'         },
            { name: 'Journalist / Media',         rating: 3, salary: 'INR 4L - 15L+'         },
        ],
        courses: [
            { name: 'LLB (5-year Integrated)',   exam: 'CLAT / AILET',       rating: 5, duration: '5 years'   },
            { name: 'BA Hons Psychology',        exam: 'CUET / University',  rating: 5, duration: '3 years'   },
            { name: 'BA with UPSC Prep',         exam: 'UPSC CSE (later)',   rating: 5, duration: '3 + 3 yrs' },
            { name: 'BA Journalism / Mass Comm', exam: 'CUET / State',       rating: 4, duration: '3 years'   },
            { name: 'B.Design / Fine Arts',      exam: 'NID / NIFT / UCEED', rating: 4, duration: '4 years'   },
        ],
        nextSteps: [
            'Take subjects aligned to your goal: History, Political Science, Psychology, or Economics.',
            'Build a portfolio with writing samples, debate records, and creative work from Class 11.',
            'Prepare for CLAT for law or CUET for BA (Hons) programs based on your final career goal.',
            'Join Model UN, internships, and social projects to build real-world experience and networks.',
        ],
        salaryMatrix: [
            { level: 'Entry Level (0-2 yrs)',      range: 'INR 3L - 7L',      growth: 'Steady',   years: '1-2 yrs'  },
            { level: 'Specialist (2-5 yrs)',       range: 'INR 7L - 18L',     growth: 'Moderate', years: '3-5 yrs'  },
            { level: 'Senior (5-10 yrs)',          range: 'INR 18L - 45L',    growth: 'High',     years: '6-10 yrs' },
            { level: 'Expert / Leader (10+ yrs)',  range: 'INR 45L - 1.5Cr+', growth: 'Top Tier', years: '10+ yrs'  },
        ],
        color: '#7C3AED', lightColor: '#F5F3FF',
    },
};

const parseJSON = <T>(v: unknown, fb: T): T => {
    if (!v) return fb;
    if (typeof v === 'object') return v as T;
    if (typeof v === 'string') { try { return JSON.parse(v) as T; } catch { return fb; } }
    return fb;
};

const getPrimaryStream = (scores: Record<string, number>, fallback: string): StreamKey => {
    const f = (fallback || '').toLowerCase();
    if (f === 'science' || f === 'commerce' || f === 'arts') return f as StreamKey;
    const keys: StreamKey[] = ['commerce', 'science', 'arts'];
    return keys.sort((a, b) => (scores[b] ?? 0) - (scores[a] ?? 0))[0] ?? 'commerce';
};

export const generateReportPDF = (student: any): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 0, size: 'A4', bufferPages: true });
        const chunks: Buffer[] = [];
        doc.on('data', (c: Buffer) => chunks.push(c));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        const W = 595.28, H = 841.89, M = 40, CW = W - M * 2;

        const answers = parseJSON<any[]>(student?.answers, []);
        const result  = parseJSON<Record<string, any>>(student?.result, {});
        const scores  = parseJSON<Record<string, number>>(result?.scores, {});
        const primary = getPrimaryStream(scores, result?.stream || 'commerce');
        const P       = PROFILES[primary];

        const sci = Math.max(0, Number(scores.science)  || 0);
        const com = Math.max(0, Number(scores.commerce) || 0);
        const art = Math.max(0, Number(scores.arts)     || 0);
        const tot = Math.max(sci + com + art, 1);

        const sciPct   = Math.round((sci / tot) * 100);
        const comPct   = Math.round((com / tot) * 100);
        const artPct   = Math.round((art / tot) * 100);
        const matchPct =
            typeof result?.percentage === 'number'
                ? Math.max(0, Math.min(100, Math.round(result.percentage)))
                : Math.max(sciPct, comPct, artPct);

        const answered  = Array.isArray(answers) ? answers.length : 0;
        const createdAt = student?.createdAt ? new Date(student.createdAt) : new Date();
        const dateStr   = Number.isNaN(createdAt.getTime())
            ? new Date().toLocaleDateString('en-IN')
            : createdAt.toLocaleDateString('en-IN');
        const ref = String(student?.id ?? '').slice(0, 8).toUpperCase() || 'XXXXXXXX';

        const aptBars = [
            { label: 'Analytical Aptitude',  pct: Math.min(97, sciPct + 12), color: '#059669' },
            { label: 'Creative Aptitude',    pct: Math.min(97, artPct + 15), color: '#7C3AED' },
            { label: 'Business Acumen',      pct: Math.min(97, comPct + 10), color: '#2563EB' },
            { label: 'Communication Skills', pct: Math.min(97, Math.round(artPct * 0.6 + comPct * 0.35 + 14)), color: '#D97706' },
            { label: 'Technical Ability',    pct: Math.min(97, sciPct + 6),  color: '#059669' },
        ];

        // ─── helpers ────────────────────────────────────────────────────────────

        const fillPage = () => doc.rect(0, 0, W, H).fill('#FFFFFF');

        const drawPageHeader = (title: string, subtitle: string, pageNum: string) => {
            fillPage();
            doc.rect(0, 0, W, 62).fill('#0F172A');
            doc.rect(0, 0, 7, 62).fill('#E74623');
            doc.roundedRect(M, 13, 37, 37, 6).fill('#E74623');
            doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(20)
               .text('E', M, 20, { width: 37, align: 'center' });
            doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(14).text(title, M + 50, 14);
            doc.fillColor('#94A3B8').font('Helvetica').fontSize(8).text(subtitle, M + 50, 36);
            doc.fillColor('#64748B').font('Helvetica').fontSize(7.5)
               .text('CC-' + ref + '  |  ' + dateStr + '  |  Page ' + pageNum, 0, 48, { width: W - M, align: 'right' });
            doc.rect(0, 62, W, 2).fill('#E74623');
        };

        const drawPageFooter = () => {
            doc.rect(0, H - 28, W, 28).fill('#F9FAFB');
            doc.moveTo(0, H - 28).lineTo(W, H - 28).strokeColor('#E2E8F0').lineWidth(0.5).stroke();
            doc.fillColor('#9CA3AF').font('Helvetica').fontSize(7)
               .text(
                   'Ednovate Career Counseling  |  AI-Powered Student Assessment  |  Confidential Student Report',
                   M, H - 18, { width: CW, align: 'center' }
               );
        };

        const secTitle = (y: number, title: string): number => {
            doc.rect(M, y, 4, 20).fill('#E74623');
            doc.fillColor('#111827').font('Helvetica-Bold').fontSize(12.5).text(title, M + 14, y + 2);
            return y + 30;
        };

        const drawBar = (x: number, y: number, w: number, h: number, pct: number, color: string) => {
            doc.roundedRect(x, y, w, h, h / 2).fill('#E2E8F0');
            const fw = Math.max(h, Math.round((w * pct) / 100));
            doc.roundedRect(x, y, fw, h, h / 2).fill(color);
        };

        const drawDots = (x: number, cy: number, rating: number, max = 5) => {
            for (let i = 0; i < max; i++) {
                if (i < rating) {
                    doc.circle(x + i * 11, cy, 4).fill('#E74623');
                } else {
                    doc.lineWidth(0.8).circle(x + i * 11, cy, 4).stroke('#D1D5DB');
                }
            }
        };

        // ─── PAGE 1: Profile + Stream Scores + Personality ───────────────────

        drawPageHeader('CAREER ASSESSMENT REPORT', 'AI-Powered Stream Analysis  |  Ednovate Career Counseling', '1 of 4');
        let y = 76;

        // Student profile card
        doc.roundedRect(M, y, CW, 90, 8).fill('#F9FAFB').strokeColor('#E2E8F0').lineWidth(0.7).stroke();
        doc.fillColor('#9CA3AF').font('Helvetica-Bold').fontSize(7.5).text('STUDENT PROFILE', M + 14, y + 12);
        doc.fillColor('#111827').font('Helvetica-Bold').fontSize(18)
           .text(String(student?.name || 'Student').toUpperCase(), M + 14, y + 28, { width: CW - 28 });
        const infoItems: [string, string][] = [
            ['Mobile',    String(student?.mobile   || '-')],
            ['Email',     String(student?.email    || '-')],
            ['Location',  String(student?.location || '-')],
            ['Attempted', answered + ' Questions'],
        ];
        let ix = M + 14;
        infoItems.forEach(([lbl, val]) => {
            doc.fillColor('#9CA3AF').font('Helvetica').fontSize(7).text(lbl, ix, y + 60);
            doc.fillColor('#374151').font('Helvetica-Bold').fontSize(8)
               .text(val, ix, y + 71, { width: 112, lineBreak: false });
            ix += 118;
        });
        y += 104;

        // Stream + match score row
        const rcW = Math.round(CW * 0.63);
        const scW = CW - rcW - 10;
        doc.roundedRect(M, y, rcW, 88, 8).fill(P.lightColor).strokeColor(P.color).lineWidth(0.8).stroke();
        doc.fillColor(P.color).font('Helvetica-Bold').fontSize(8).text('RECOMMENDED STREAM', M + 14, y + 12);
        doc.fillColor('#111827').font('Helvetica-Bold').fontSize(21)
           .text(P.title, M + 14, y + 28, { width: rcW - 28 });
        doc.fillColor('#374151').font('Helvetica').fontSize(9)
           .text(P.tagline, M + 14, y + 60, { width: rcW - 28 });
        const scX = M + rcW + 10;
        doc.roundedRect(scX, y, scW, 88, 8).fill(P.color);
        doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(8)
           .text('MATCH SCORE', scX, y + 12, { width: scW, align: 'center' });
        doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(36)
           .text(matchPct + '%', scX, y + 28, { width: scW, align: 'center' });
        doc.fillColor(P.lightColor).font('Helvetica').fontSize(7.5)
           .text('Based on your responses', scX, y + 72, { width: scW, align: 'center' });
        y += 102;

        // Stream score bars
        y = secTitle(y, 'Stream Score Breakdown');
        const scoreRows = [
            { label: 'Science',           pct: sciPct, score: sci, color: '#059669' },
            { label: 'Commerce',          pct: comPct, score: com, color: '#2563EB' },
            { label: 'Arts & Humanities', pct: artPct, score: art, color: '#7C3AED' },
        ];
        scoreRows.forEach(row => {
            doc.fillColor('#374151').font('Helvetica-Bold').fontSize(9).text(row.label, M, y + 2, { width: 118 });
            drawBar(M + 122, y, 285, 12, row.pct, row.color);
            doc.fillColor('#111827').font('Helvetica-Bold').fontSize(8.5)
               .text(row.score + '  (' + row.pct + '%)', M + 416, y + 2);
            y += 24;
        });
        y += 6;

        // Personality traits
        y = secTitle(y, 'Your Personality Traits');
        let px = M;
        P.personality.forEach(trait => {
            const tw = 91;
            doc.roundedRect(px, y, tw, 22, 4).fill(P.lightColor).strokeColor(P.color).lineWidth(0.5).stroke();
            doc.fillColor(P.color).font('Helvetica-Bold').fontSize(7.5)
               .text(trait, px, y + 7, { width: tw, align: 'center' });
            px += tw + 9;
        });
        y += 36;

        // Assessment insight
        y = secTitle(y, 'Assessment Insight');
        doc.fillColor('#374151').font('Helvetica').fontSize(9)
           .text(P.description, M, y, { width: CW, lineGap: 2.5, align: 'justify' });

        drawPageFooter();

        // ─── PAGE 2: SWOT + Aptitude ─────────────────────────────────────────

        doc.addPage();
        drawPageHeader('SWOT ANALYSIS  &  APTITUDE PROFILE', 'Personalized insight for ' + P.title, '2 of 4');
        y = 76;

        y = secTitle(y, 'SWOT Analysis  (Based on Your Stream Aptitude)');
        const bw = (CW - 8) / 2;
        const bh = 142;
        const swotBoxes = [
            { label: 'S   Strengths',     items: P.strengths,     bg: '#ECFDF5', bd: '#6EE7B7', tc: '#065F46' },
            { label: 'W   Weaknesses',    items: P.weaknesses,    bg: '#FEF2F2', bd: '#FCA5A5', tc: '#991B1B' },
            { label: 'O   Opportunities', items: P.opportunities, bg: '#EFF6FF', bd: '#93C5FD', tc: '#1E40AF' },
            { label: 'T   Threats',       items: P.threats,       bg: '#FFFBEB', bd: '#FCD34D', tc: '#92400E' },
        ];
        swotBoxes.forEach((box, idx) => {
            const bx = M + (idx % 2) * (bw + 8);
            const by = y + Math.floor(idx / 2) * (bh + 8);
            doc.roundedRect(bx, by, bw, bh, 6).fill(box.bg).strokeColor(box.bd).lineWidth(0.7).stroke();
            doc.fillColor(box.tc).font('Helvetica-Bold').fontSize(9.5).text(box.label, bx + 12, by + 12);
            doc.moveTo(bx + 12, by + 28).lineTo(bx + bw - 12, by + 28).strokeColor(box.bd).lineWidth(0.5).stroke();
            let iy = by + 34;
            box.items.forEach((item: string) => {
                doc.fillColor('#374151').font('Helvetica').fontSize(7.5)
                   .text('- ' + item, bx + 12, iy, { width: bw - 26 });
                iy = doc.y + 5;
            });
        });
        y += bh * 2 + 8 + 16;

        // Aptitude profile text
        y = secTitle(y, 'Aptitude Profile Summary');
        const aptText =
            'Based on your ' + answered + ' question responses, your aptitude profile strongly aligns with ' + P.title + '. ' +
            'You demonstrate the characteristics of a ' + P.personality.join(', ').toLowerCase() + ' individual. ' +
            'Students with this aptitude who choose ' + P.title + ' achieve significantly higher career satisfaction ' +
            'and long-term professional growth. Your strongest natural aptitude lies in ' +
            (P.personality[0] || '').toLowerCase() + ' and ' + (P.personality[1] || '').toLowerCase() + ' domains, ' +
            'which are key differentiators in your recommended field.';
        doc.fillColor('#374151').font('Helvetica').fontSize(9)
           .text(aptText, M, y, { width: CW, lineGap: 2.5, align: 'justify' });
        y = doc.y + 16;

        // Skill aptitude bars
        y = secTitle(y, 'Skill Aptitude Indicators  (Derived From Your Responses)');
        aptBars.forEach(ab => {
            doc.fillColor('#374151').font('Helvetica-Bold').fontSize(9).text(ab.label, M, y + 2, { width: 142 });
            drawBar(M + 148, y, 268, 12, ab.pct, ab.color);
            doc.fillColor('#111827').font('Helvetica-Bold').fontSize(8.5).text(ab.pct + '%', M + 424, y + 2);
            y += 23;
        });

        drawPageFooter();

        // ─── PAGE 3: Careers + Courses ───────────────────────────────────────

        doc.addPage();
        drawPageHeader('TOP CAREER PATHS  &  COURSE OPTIONS', 'Recommended pathways for ' + P.subtitle, '3 of 4');
        y = 76;

        // Career cards 2-column
        y = secTitle(y, 'Top Career Paths  (With Our Market Ratings)');
        const ccols  = 2;
        const cCardH = 46;
        const cCardW = (CW - 8) / ccols;
        P.careers.forEach((career: Career, idx: number) => {
            const cx = M + (idx % ccols) * (cCardW + 8);
            const cy = y + Math.floor(idx / ccols) * (cCardH + 6);
            doc.roundedRect(cx, cy, cCardW, cCardH, 6).fill('#F9FAFB').strokeColor('#E2E8F0').lineWidth(0.6).stroke();
            doc.fillColor('#111827').font('Helvetica-Bold').fontSize(9.5)
               .text(career.name, cx + 10, cy + 8, { width: cCardW - 98 });
            doc.fillColor('#6B7280').font('Helvetica').fontSize(7.5).text(career.salary, cx + 10, cy + 28);
            doc.fillColor('#9CA3AF').font('Helvetica-Bold').fontSize(6.5)
               .text('OUR RATING', cx + cCardW - 82, cy + 8, { width: 80 });
            drawDots(cx + cCardW - 78, cy + 32, career.rating);
        });
        y += Math.ceil(P.careers.length / ccols) * (cCardH + 6) + 14;

        // Course list
        y = secTitle(y, 'Recommended Courses  (With Entrance Exams and Ratings)');
        P.courses.forEach((course: Course) => {
            doc.roundedRect(M, y, CW, 34, 4).fill('#F9FAFB').strokeColor('#E2E8F0').lineWidth(0.6).stroke();
            doc.fillColor('#111827').font('Helvetica-Bold').fontSize(9.5)
               .text(course.name, M + 12, y + 6, { width: 210 });
            doc.fillColor('#6B7280').font('Helvetica').fontSize(7.5)
               .text('Exam: ' + course.exam, M + 12, y + 22, { width: 240 });
            doc.fillColor('#9CA3AF').font('Helvetica').fontSize(7.5)
               .text(course.duration, M + 280, y + 14, { width: 80 });
            doc.fillColor('#9CA3AF').font('Helvetica-Bold').fontSize(6.5)
               .text('OUR RATING', M + CW - 92, y + 6, { width: 88 });
            drawDots(M + CW - 56, y + 22, course.rating);
            y += 40;
        });

        drawPageFooter();

        // ─── PAGE 4: Action Plan + Salary Matrix + CTA ───────────────────────

        doc.addPage();
        drawPageHeader('ACTION PLAN  &  CAREER GROWTH FORECAST', 'Personalized roadmap for ' + P.title, '4 of 4');
        y = 76;

        // 90-day action plan
        y = secTitle(y, '90-Day Smart Action Plan');
        const stepColors = ['#059669', '#2563EB', '#7C3AED', '#E74623'];
        P.nextSteps.forEach((step: string, idx: number) => {
            const sc = stepColors[idx % 4];
            doc.roundedRect(M, y, 26, 26, 4).fill(sc);
            doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(12)
               .text(String(idx + 1), M, y + 6, { width: 26, align: 'center' });
            doc.fillColor('#374151').font('Helvetica').fontSize(9)
               .text(step, M + 34, y + 7, { width: CW - 38, lineGap: 2 });
            y += 42;
        });
        y += 8;

        // Salary matrix table
        y = secTitle(y, 'Career Growth and Salary Forecast');
        doc.rect(M, y, CW, 22).fill('#0F172A');
        doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(8.5);
        doc.text('Career Level',     M + 10,  y + 7);
        doc.text('Estimated Salary', M + 200, y + 7);
        doc.text('Growth Rate',      M + 340, y + 7);
        doc.text('Timeline',         M + 450, y + 7);
        y += 22;
        P.salaryMatrix.forEach((row: SalRow, idx: number) => {
            doc.rect(M, y, CW, 22).fill(idx % 2 === 0 ? '#FFFFFF' : '#F9FAFB')
               .strokeColor('#E2E8F0').lineWidth(0.5).stroke();
            doc.fillColor('#374151').font('Helvetica').fontSize(8.5).text(row.level, M + 10, y + 7);
            doc.fillColor('#2563EB').font('Helvetica-Bold').fontSize(8.5).text(row.range,  M + 200, y + 7);
            doc.fillColor('#059669').font('Helvetica-Bold').fontSize(8.5).text(row.growth, M + 340, y + 7);
            doc.fillColor('#6B7280').font('Helvetica').fontSize(8.5).text(row.years,       M + 450, y + 7);
            y += 22;
        });
        y += 18;

        // CTA box
        doc.roundedRect(M, y, CW, 76, 8).fill(P.lightColor).strokeColor(P.color).lineWidth(0.8).stroke();
        doc.fillColor(P.color).font('Helvetica-Bold').fontSize(14)
           .text('Need Personalized Guidance?', M, y + 14, { width: CW, align: 'center' });
        doc.fillColor('#374151').font('Helvetica').fontSize(9.5)
           .text('Talk to our expert counselors and get your customized career roadmap today.', M, y + 36, { width: CW, align: 'center' });
        doc.fillColor('#E74623').font('Helvetica-Bold').fontSize(11)
           .text('Call / WhatsApp: 8651014840', M, y + 55, { width: CW, align: 'center' });

        drawPageFooter();
        doc.end();
    });
};
