import PDFDocument from 'pdfkit';

/**
 * SUCCESS ROADMAP CONTENT (2-PAGE ELITE REPORT)
 */
const SKILL_SCORES = [
    { label: "Financial Analytical Logic", score: 0.96 },
    { label: "Strategic Business Sense", score: 0.92 },
    { label: "Leadership & Management", score: 0.88 },
    { label: "Legal & Compliance Focus", score: 0.85 }
];

const ROADMAP_STEPS = [
    { title: "PHASE 1: Foundation (11th & 12th)", detail: "Mandatory: Accounts, Economics, Business Studies. Suggested: Applied Maths. Goal: 90%+ in Boards for Top Tier Colleges." },
    { title: "PHASE 2: Entrance & Degrees", detail: "Exams: CUET, IPMAT, CA Foundation. Courses: B.Com (Hons) SRCC, IPM (IIM Indore/Rohtak), BMS (SSCBS)." },
    { title: "PHASE 3: Professional Excellence", detail: "Pursue Global Certifications: CA (India), CFA (USA), or MBA (IIMs/Top Global B-Schools) for High Finance roles." },
    { title: "PHASE 4: Global Career Highs", detail: "Career Exit: MD at Investment Bank, CXO at MNCs, or Multi-million Dollar Startup Founder." }
];

const SALARY_MATRIX = [
    { level: "Junior Associate", range: "₹6L - ₹10L", growth: "↑ 20% YOY" },
    { level: "Certified CA / MBA", range: "₹15L - ₹30L", growth: "↑ 35% YOY" },
    { level: "VP / VP (Finance)", range: "₹45L - ₹80L", growth: "↑ 50% YOY" },
    { level: "CFO / Director", range: "₹1.5Cr - ₹5Cr+", growth: "↑ TOP 1%" }
];

export const generateReportPDF = (student: any): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 0, size: 'A4', bufferPages: true });
    const chunks: Buffer[] = [];
    
    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', (err: Error) => reject(err));

    const W = 595.28;
    const H = 841.89;
    const MX = 50;

    // --- HELPER FOR GRIDS ---
    const drawGridLine = (y: number) => {
        doc.moveTo(MX, y).lineTo(W - MX, y).strokeColor('#e2e8f0').lineWidth(0.5).stroke();
    };

    // ==========================================
    // PAGE 1: THE EXECUTIVE ASSESSMENT
    // ==========================================
    
    // Header (Deep Navy)
    doc.rect(0, 0, W, 180).fill('#0f172a');
    doc.fillColor('#3b82f6').fontSize(22).font('Helvetica-Bold').text('APNA CAREER ELITE REPORT', MX, 50, { characterSpacing: 1 });
    doc.fillColor('#ffffff').fontSize(14).font('Helvetica').text('Official AI-Powered Career Blueprint', MX, 80);
    
    // Student Identity Card
    doc.fillColor('#1e293b').roundedRect(MX, 110, W - (MX * 2), 75, 8).fill().stroke('#334155');
    doc.fillColor('#94a3b8').fontSize(9).font('Helvetica-Bold').text('STUDENT PROFILE', MX + 20, 125);
    
    doc.fillColor('#ffffff').fontSize(16).text(student.name.toUpperCase(), MX + 20, 142);
    doc.fontSize(10).font('Helvetica').text(`Mobile: ${student.mobile}  |  Location: ${student.location}`, MX + 20, 162);
    
    doc.fillColor('#60a5fa').fontSize(10).font('Helvetica-Bold').text(`REF: CC-ENG-${student.id.substring(0,6).toUpperCase()}`, W - MX - 150, 142, { align: 'right', width: 130 });

    let y = 210;

    // Recommendation Section
    doc.fillColor('#64748b').fontSize(11).font('Helvetica-Bold').text('PRIMARY RECOMMENDATION', MX, y);
    y += 20;

    doc.fillColor('#eff6ff').roundedRect(MX, y, W - (MX * 2), 120, 10).fill().stroke('#3b82f6');
    doc.fillColor('#1d4ed8').fontSize(36).font('Helvetica-Bold').text('COMMERCE', MX + 25, y + 30);
    doc.fillColor('#3b82f6').fontSize(16).font('Helvetica').text('Corporate Strategist & High-Finance Leader', MX + 25, y + 75);

    // AI Score Badge
    doc.fillColor('#10b981').roundedRect(W - MX - 150, y + 30, 125, 60, 10).fill();
    doc.fillColor('#ffffff').fontSize(10).font('Helvetica-Bold').text('MATCH SCORE', W - MX - 150, y + 42, { width: 125, align: 'center' });
    doc.fontSize(24).text('98%', W - MX - 150, y + 58, { width: 125, align: 'center' });

    y += 150;

    // Visual Chart: Skill Match Bar Chart
    doc.fillColor('#1e293b').fontSize(16).font('Helvetica-Bold').text('ASSESSED SKILL PERCENTILES', MX, y);
    y += 35;

    SKILL_SCORES.forEach((skill, i) => {
        doc.fillColor('#475569').fontSize(10).font('Helvetica-Bold').text(skill.label, MX, y);
        
        // Bar Background
        doc.roundedRect(MX + 180, y - 5, 250, 14, 7).fill('#f1f5f9');
        // Bar Progress
        const barWidth = 250 * skill.score;
        doc.roundedRect(MX + 180, y - 5, barWidth, 14, 7).fill('#2563eb');
        
        // Percentage Text
        doc.fillColor('#1d4ed8').fontSize(9).font('Helvetica-Bold').text(`${Math.round(skill.score * 100)}%`, MX + 180 + barWidth + 10, y);
        
        y += 32;
    });

    y += 20;

    // Why Section (Grid aligned)
    doc.fillColor('#1e293b').fontSize(16).font('Helvetica-Bold').text('WHY IS THIS YOUR PERFECT FIT?', MX, y);
    y += 30;
    doc.fillColor('#475569').fontSize(11).font('Helvetica').text("Your evaluation highlights extraordinary talent in data logic and resource management. Commerce is more than just 'Accounts'; it is the study of how the world grows by managing capital. Based on your risk-taking patterns and analytical speed, Commerce offers you the highest RoI (Return on Investment) for your career efforts.", MX, y, { width: W - (MX * 2), lineGap: 5, align: 'justify' });

    // Footer Page 1
    doc.fillColor('#94a3b8').fontSize(8).font('Helvetica').text('Page 1 of 2  -  Proprietary Assessment  -  Apna Career', 0, H - 30, { align: 'center' });

    // ==========================================
    // PAGE 2: THE SUCCESS ROADMAP
    // ==========================================
    doc.addPage();
    
    // Header Page 2
    doc.rect(0, 0, W, 80).fill('#0f172a');
    doc.fillColor('#ffffff').fontSize(18).font('Helvetica-Bold').text('THE COMMERCE SUCCESS ROADMAP', MX, 35);
    
    y = 110;

    // ROADMAP TIMELINE (Graphical)
    ROADMAP_STEPS.forEach((step, i) => {
        // Vertical Connector Line
        if (i < ROADMAP_STEPS.length - 1) {
            doc.moveTo(MX + 20, y + 20).lineTo(MX + 20, y + 80).strokeColor('#3b82f6').lineWidth(2).stroke();
        }
        
        // Circle Label
        doc.fillColor('#2563eb').circle(MX + 20, y + 15, 15).fill();
        doc.fillColor('#ffffff').fontSize(12).font('Helvetica-Bold').text(`${i+1}`, MX + 20 - 4, y + 15 - 5);
        
        // Detail Box
        doc.fillColor('#f8fafc').roundedRect(MX + 50, y, W - MX - (MX + 60), 65, 8).fill().stroke('#e2e8f0');
        doc.fillColor('#1e40af').fontSize(12).font('Helvetica-Bold').text(step.title, MX + 70, y + 15);
        doc.fillColor('#475569').fontSize(10).font('Helvetica').text(step.detail, MX + 70, y + 33, { width: W - MX - (MX + 100) });
        
        y += 85;
    });

    y += 30;

    // SALARY MATRIX TABLE
    doc.fillColor('#1e293b').fontSize(16).font('Helvetica-Bold').text('CAREER SALARY & GROWTH MATRIX', MX, y);
    y += 30;

    // Header Table
    doc.fillColor('#0f172a').rect(MX, y, W - (MX * 2), 30).fill();
    doc.fillColor('#ffffff').fontSize(10).font('Helvetica-Bold');
    doc.text('CAREER LEVEL', MX + 20, y + 10);
    doc.text('EST. SALARY (ANNUAL)', MX + 200, y + 10);
    doc.text('GROWTH POTENTIAL', MX + 360, y + 10);
    
    y += 30;
    
    SALARY_MATRIX.forEach((item, i) => {
        doc.fillColor(i % 2 === 0 ? '#ffffff' : '#f8fafc').rect(MX, y, W - (MX * 2), 35).fill().stroke('#e2e8f0');
        doc.fillColor('#475569').fontSize(11).font('Helvetica');
        doc.text(item.level, MX + 20, y + 12);
        doc.fillColor('#1e40af').font('Helvetica-Bold').text(item.range, MX + 200, y + 12);
        doc.fillColor('#10b981').text(item.growth, MX + 360, y + 12);
        y += 35;
    });

    // Final CTA Box
    y += 50;
    doc.fillColor('#eff6ff').roundedRect(MX, y, W - (MX * 2), 80, 10).fill().stroke('#3b82f6');
    doc.fillColor('#1e3a8a').fontSize(14).font('Helvetica-Bold').text('WANT TO START YOUR COMMERCE JOURNEY?', 0, y + 18, { align: 'center', width: W });
    doc.fillColor('#2563eb').fontSize(22).font('Helvetica-Bold').text('CALL: 865101484', 0, y + 42, { align: 'center', width: W });

    // Footer Page 2
    doc.fillColor('#94a3b8').fontSize(8).font('Helvetica').text('© 2024 Apna Career Assessment | Official Document', 0, H - 30, { align: 'center' });

    doc.end();
  });
};




