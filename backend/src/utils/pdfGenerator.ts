import PDFDocument from 'pdfkit';
type StreamKey = 'science' | 'commerce' | 'arts';

type StreamProfile = {
    title: string;
    subtitle: string;
    description: string;
    strengths: string[];
    careers: string[];
    nextSteps: string[];
    salaryMatrix: { level: string; range: string; growth: string }[];
    color: string;
};

const STREAM_PROFILES: Record<StreamKey, StreamProfile> = {
    commerce: {
        title: 'Commerce Stream',
        subtitle: 'Finance, Business and Management',
        description:
            'Your profile indicates strong business orientation, practical decision making and financial awareness. Commerce can provide fast-track opportunities in management, finance and entrepreneurship.',
        strengths: ['Business logic', 'Financial planning', 'Decision making', 'Leadership potential'],
        careers: ['CA', 'Investment Banker', 'Financial Analyst', 'MBA', 'Entrepreneur', 'Management Consultant'],
        nextSteps: [
            'Choose Accounts, Economics and Business Studies in class 11 and 12.',
            'Prepare for CUET, IPMAT or CA Foundation based on your target.',
            'Build Excel, communication and presentation skills from class 11 onward.',
            'Do internships and case competitions to build an edge.'
        ],
        salaryMatrix: [
            { level: 'Entry Level', range: 'INR 4L - 8L', growth: 'Steady' },
            { level: 'Analyst / Associate', range: 'INR 8L - 20L', growth: 'Fast' },
            { level: 'Manager / Consultant', range: 'INR 20L - 45L', growth: 'High' },
            { level: 'Leadership / CXO', range: 'INR 50L - 2Cr+', growth: 'Top Tier' }
        ],
        color: '#2563eb'
    },
    science: {
        title: 'Science Stream',
        subtitle: 'Innovation, Engineering and Medical',
        description:
            'Your evaluation reflects strong analytical ability, technical curiosity and structured problem-solving. Science can open pathways to technology, research, engineering and healthcare.',
        strengths: ['Analytical thinking', 'Problem solving', 'Technical aptitude', 'Research mindset'],
        careers: ['Engineer', 'Doctor', 'Scientist', 'Data Scientist', 'Architect', 'Research Analyst'],
        nextSteps: [
            'Choose PCM / PCB based on your long-term target.',
            'Prepare for JEE / NEET / CUET with a realistic weekly plan.',
            'Focus on core concepts in Physics, Chemistry, Biology and Maths.',
            'Participate in Olympiads, coding or lab projects for profile strength.'
        ],
        salaryMatrix: [
            { level: 'Entry Level', range: 'INR 4L - 10L', growth: 'Steady' },
            { level: 'Specialist Role', range: 'INR 10L - 25L', growth: 'Fast' },
            { level: 'Senior Technical', range: 'INR 25L - 60L', growth: 'High' },
            { level: 'Expert / Leadership', range: 'INR 60L - 2Cr+', growth: 'Top Tier' }
        ],
        color: '#16a34a'
    },
    arts: {
        title: 'Arts and Humanities Stream',
        subtitle: 'Creativity, Communication and Society',
        description:
            'Your profile shows creativity, communication strength and human-centered thinking. Arts and Humanities can lead to impactful careers in law, design, media, psychology and public service.',
        strengths: ['Communication', 'Creative expression', 'Critical thinking', 'Social awareness'],
        careers: ['Lawyer', 'Psychologist', 'Journalist', 'Designer', 'Civil Services', 'Content Strategist'],
        nextSteps: [
            'Choose subjects aligned to your interests: Political Science, Psychology, Economics, etc.',
            'Build writing, speaking and portfolio projects from class 11.',
            'Prepare for CLAT, CUET or domain-specific entrance exams.',
            'Take part in debates, internships and creative showcases.'
        ],
        salaryMatrix: [
            { level: 'Entry Level', range: 'INR 3L - 7L', growth: 'Steady' },
            { level: 'Specialist Role', range: 'INR 7L - 18L', growth: 'Fast' },
            { level: 'Senior Professional', range: 'INR 18L - 45L', growth: 'High' },
            { level: 'Leadership / Expert', range: 'INR 45L - 1.5Cr+', growth: 'Top Tier' }
        ],
        color: '#db2777'
    }
};

const parseJSON = <T>(value: unknown, fallback: T): T => {
    if (value === null || value === undefined) return fallback;
    if (typeof value === 'object') return value as T;
    if (typeof value === 'string') {
        try {
            return JSON.parse(value) as T;
        } catch {
            return fallback;
        }
    }
    return fallback;
};

const toTitleCase = (value: string) => {
    if (!value) return '';
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

const getPrimaryStream = (scores: Record<string, number>, fallback: string): StreamKey => {
    const keys: StreamKey[] = ['commerce', 'science', 'arts'];
    const top = keys.sort((a, b) => (scores[b] || 0) - (scores[a] || 0))[0];
    const cleanFallback = (fallback || '').toLowerCase();
    if (keys.includes(cleanFallback as StreamKey)) return cleanFallback as StreamKey;
    return top || 'commerce';
};

const getPercent = (value: number, max: number) => {
    if (!max || max <= 0) return 0;
    return Math.max(0, Math.min(100, Math.round((value / max) * 100)));
};

export const generateReportPDF = (student: any): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 0, size: 'A4', bufferPages: true });
        const chunks: Buffer[] = [];

        doc.on('data', (chunk: Buffer) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', (err: Error) => reject(err));

        const W = 595.28;
        const H = 841.89;
        const M = 36;
        const contentW = W - M * 2;

        const answers = parseJSON<any[]>(student?.answers, []);
        const result = parseJSON<any>(student?.result, {});
        const scores = parseJSON<Record<string, number>>(result?.scores, {});
        const primaryStream = getPrimaryStream(scores, result?.stream || 'commerce');
        const profile = STREAM_PROFILES[primaryStream];

        const maxScore = Math.max(scores.commerce || 0, scores.science || 0, scores.arts || 0, 1);
        const scorePercentages = {
            commerce: getPercent(scores.commerce || 0, maxScore),
            science: getPercent(scores.science || 0, maxScore),
            arts: getPercent(scores.arts || 0, maxScore)
        };

        const overallPercentage =
            typeof result?.percentage === 'number'
                ? Math.max(0, Math.min(100, Math.round(result.percentage)))
                : scorePercentages[primaryStream];

        const createdAt = student?.createdAt ? new Date(student.createdAt) : new Date();
        const reportDate = Number.isNaN(createdAt.getTime())
            ? new Date().toLocaleDateString('en-IN')
            : createdAt.toLocaleDateString('en-IN');
        const reportTime = Number.isNaN(createdAt.getTime())
            ? new Date().toLocaleTimeString('en-IN')
            : createdAt.toLocaleTimeString('en-IN');

        const reference = String(student?.id || 'unknown').slice(0, 8).toUpperCase();
        const answered = Array.isArray(answers) ? answers.length : 0;

        const drawHeader = (title: string, subtitle: string) => {
            doc.rect(0, 0, W, 92).fill('#0f172a');
            doc.roundedRect(M, 22, 34, 34, 8).fill('#e74623');
            doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(18).text('E', M + 12, 31);

            doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(18).text(title, M + 46, 26);
            doc.fillColor('#cbd5e1').font('Helvetica').fontSize(10).text(subtitle, M + 46, 50);

            doc.fillColor('#93c5fd').font('Helvetica-Bold').fontSize(9).text(`Ref: CC-${reference}`, W - M - 130, 28, {
                width: 130,
                align: 'right'
            });
            doc.fillColor('#cbd5e1').font('Helvetica').fontSize(9).text(`Generated: ${reportDate} ${reportTime}`, W - M - 130, 44, {
                width: 130,
                align: 'right'
            });
        };

        const drawFooter = (pageLabel: string) => {
            doc.fillColor('#94a3b8').font('Helvetica').fontSize(8).text(
                `Page ${pageLabel}  |  Career Blueprint  |  Confidential Student Report`,
                0,
                H - 22,
                { align: 'center', width: W }
            );
        };

        drawHeader('Career Blueprint Report', 'AI-Powered Stream Recommendation');

        let y = 110;

        doc.fillColor('#ffffff').roundedRect(M, y, contentW, 98, 10).fill().stroke('#e2e8f0');
        doc.fillColor('#475569').font('Helvetica-Bold').fontSize(10).text('STUDENT DETAILS', M + 16, y + 12);
        doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(16).text(String(student?.name || 'Student').toUpperCase(), M + 16, y + 30);
        doc.fillColor('#475569').font('Helvetica').fontSize(10).text(
            `Mobile: ${student?.mobile || '-'}   |   Email: ${student?.email || '-'}   |   Location: ${student?.location || '-'}`,
            M + 16,
            y + 54,
            { width: contentW - 32 }
        );
        doc.fillColor('#475569').font('Helvetica').fontSize(10).text(
            `Status: ${student?.status || '-'}   |   Questions Attempted: ${answered}`,
            M + 16,
            y + 70,
            { width: contentW - 32 }
        );

        y += 116;

        doc.fillColor('#eef2ff').roundedRect(M, y, contentW, 118, 10).fill().stroke(profile.color);
        doc.fillColor(profile.color).font('Helvetica-Bold').fontSize(11).text('PRIMARY RECOMMENDATION', M + 16, y + 14);
        doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(28).text(toTitleCase(primaryStream), M + 16, y + 34);
        doc.fillColor('#334155').font('Helvetica').fontSize(12).text(profile.subtitle, M + 16, y + 69);

        doc.roundedRect(W - M - 136, y + 22, 120, 74, 10).fill(profile.color);
        doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(10).text('MATCH SCORE', W - M - 136, y + 36, {
            width: 120,
            align: 'center'
        });
        doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(30).text(`${overallPercentage}%`, W - M - 136, y + 50, {
            width: 120,
            align: 'center'
        });

        y += 134;

        doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(14).text('Stream Score Breakdown', M, y);
        y += 20;

        const scoreRows: { key: StreamKey; color: string }[] = [
            { key: 'commerce', color: '#2563eb' },
            { key: 'science', color: '#16a34a' },
            { key: 'arts', color: '#db2777' }
        ];

        scoreRows.forEach((row) => {
            const score = scores[row.key] || 0;
            const percent = scorePercentages[row.key];
            const barX = M + 120;
            const barY = y + 3;
            const barW = 300;

            doc.fillColor('#334155').font('Helvetica-Bold').fontSize(10).text(toTitleCase(row.key), M, y + 1);
            doc.roundedRect(barX, barY, barW, 10, 5).fill('#e2e8f0');
            doc.roundedRect(barX, barY, Math.max(8, (barW * percent) / 100), 10, 5).fill(row.color);
            doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(9).text(`${score} (${percent}%)`, barX + barW + 12, y + 1);

            y += 22;
        });

        y += 8;

        doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(14).text('Assessment Summary', M, y);
        y += 18;
        doc.fillColor('#475569').font('Helvetica').fontSize(10).text(profile.description, M, y, {
            width: contentW,
            align: 'justify',
            lineGap: 3
        });

        y += 56;
        doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(14).text('Key Strengths Observed', M, y);
        y += 16;
        profile.strengths.forEach((item) => {
            doc.fillColor(profile.color).circle(M + 4, y + 5, 2.2).fill();
            doc.fillColor('#334155').font('Helvetica').fontSize(10).text(item, M + 12, y);
            y += 16;
        });

        drawFooter('1 of 2');

        doc.addPage();
        drawHeader('Action Plan and Career Roadmap', `${profile.title} detailed plan`);

        y = 112;

        doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(14).text('Top Career Paths', M, y);
        y += 18;
        doc.fillColor('#ffffff').roundedRect(M, y, contentW, 72, 10).fill().stroke('#e2e8f0');
        doc.fillColor('#334155').font('Helvetica').fontSize(10).text(profile.careers.join('  |  '), M + 14, y + 24, {
            width: contentW - 28,
            align: 'center'
        });

        y += 88;
        doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(14).text('90-Day Smart Action Plan', M, y);
        y += 20;

        profile.nextSteps.forEach((step, idx) => {
            doc.fillColor(profile.color).circle(M + 8, y + 6, 7).fill();
            doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(8).text(String(idx + 1), M + 6, y + 3);
            doc.fillColor('#334155').font('Helvetica').fontSize(10).text(step, M + 22, y, {
                width: contentW - 30,
                lineGap: 2
            });
            y += 34;
        });

        y += 10;
        doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(14).text('Career Salary and Growth Matrix', M, y);
        y += 20;

        doc.rect(M, y, contentW, 24).fill('#0f172a');
        doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(9);
        doc.text('Level', M + 12, y + 8);
        doc.text('Estimated Salary', M + 220, y + 8);
        doc.text('Growth', M + 410, y + 8);
        y += 24;

        profile.salaryMatrix.forEach((row, index) => {
            doc.rect(M, y, contentW, 28).fill(index % 2 === 0 ? '#ffffff' : '#f8fafc').stroke('#e2e8f0');
            doc.fillColor('#334155').font('Helvetica').fontSize(9.5).text(row.level, M + 12, y + 9);
            doc.fillColor('#1d4ed8').font('Helvetica-Bold').fontSize(9.5).text(row.range, M + 220, y + 9);
            doc.fillColor('#059669').font('Helvetica-Bold').fontSize(9.5).text(row.growth, M + 410, y + 9);
            y += 28;
        });

        y += 18;
        doc.fillColor('#eff6ff').roundedRect(M, y, contentW, 88, 10).fill().stroke('#bfdbfe');
        doc.fillColor('#1e3a8a').font('Helvetica-Bold').fontSize(13).text('Need personalized counseling support?', M, y + 18, {
            width: contentW,
            align: 'center'
        });
        doc.fillColor('#2563eb').font('Helvetica-Bold').fontSize(11).text('Call / WhatsApp: 865101484', M, y + 40, {
            width: contentW,
            align: 'center'
        });
        doc.fillColor('#475569').font('Helvetica').fontSize(9).text(
            'This document is auto-generated from your assessment responses and should be used as a career guidance reference.',
            M + 20,
            y + 58,
            { width: contentW - 40, align: 'center' }
        );

        drawFooter('2 of 2');
        doc.end();
    });
};




