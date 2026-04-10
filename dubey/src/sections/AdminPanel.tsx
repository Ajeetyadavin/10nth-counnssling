import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Download, Pencil, Plus, RefreshCw, Search, Trash2, Upload } from 'lucide-react';

type Tab = 'students' | 'questions' | 'settings' | 'otp';
type StatusFilter = 'All' | 'Partial' | 'Completed';

type Student = {
  id: string;
  name: string;
  mobile: string;
  location: string;
  source?: 'ednovate' | 'dubey' | string;
  status: 'Partial' | 'Completed' | string;
  answers?: any;
  createdAt?: string;
};

type SourceFilter = 'all' | 'ednovate' | 'dubey';
type AdminScope = 'all' | 'dubey';

type BrandContactSettings = {
  contactNumber: string;
  whatsappMessage: string;
};

type QuestionOption = {
  text: string;
  stream: 'commerce' | 'science' | 'arts' | 'neutral' | string;
  weight?: number;
};

type Question = {
  id: string;
  text: string;
  category?: string;
  language?: 'hinglish' | 'english' | string;
  options: QuestionOption[] | string;
  hidden?: boolean;
  fixed?: boolean;
};

const DEFAULT_API_BASE = import.meta.env.DEV ? '' : 'http://localhost:5001';
const API_BASE = import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE;

const AdminPanel = ({
  onBack,
  adminToken,
  adminScope,
  onUnauthorized
}: {
  onBack: () => void;
  adminToken: string | null;
  adminScope: AdminScope;
  onUnauthorized: () => void;
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('students');
  const [students, setStudents] = useState<Student[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filter, setFilter] = useState<StatusFilter>('All');
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('all');
  const [search, setSearch] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [questionLimit, setQuestionLimit] = useState<number>(45);
  const [ednovateOtpRequired, setEdnovateOtpRequired] = useState<boolean>(true);
  const [dubeyOtpRequired, setDubeyOtpRequired] = useState<boolean>(true);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsMsg, setSettingsMsg] = useState('');
  const [ednovateContactSettings, setEdnovateContactSettings] = useState<BrandContactSettings>({
    contactNumber: '8651014840',
    whatsappMessage: 'Hey, I need my Career Counselling Report'
  });
  const [dubeyContactSettings, setDubeyContactSettings] = useState<BrandContactSettings>({
    contactNumber: '8651014840',
    whatsappMessage: 'Hey, I need my Career Counselling Report'
  });
  const [importingQuestions, setImportingQuestions] = useState(false);
  const [questionLanguageFilter, setQuestionLanguageFilter] = useState<'all' | 'hinglish' | 'english'>('all');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<(Question & { options: QuestionOption[] }) | null>(null);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);

  // OTP Verification Data
  const [otpVerified, setOtpVerified] = useState<any[]>([]);
  const [otpFailed, setOtpFailed] = useState<any[]>([]);
  const [otpStats, setOtpStats] = useState({ verifiedCount: 0, failedCount: 0, totalAttempts: 0 });

  const [newQ, setNewQ] = useState({
    text: '',
    category: 'neutral',
    language: 'hinglish' as 'hinglish' | 'english',
    hidden: false,
    fixed: false,
    options: [
      { text: '', stream: 'commerce', weight: 1 },
      { text: '', stream: 'science', weight: 1 },
      { text: '', stream: 'arts', weight: 1 },
      { text: '', stream: 'neutral', weight: 1 }
    ] as QuestionOption[]
  });

  const parseOptions = (raw: Question['options']): QuestionOption[] => {
    try {
      return Array.isArray(raw) ? raw : JSON.parse(raw || '[]');
    } catch {
      return [];
    }
  };

  const resetQuestionForm = () => {
    setShowAddQuestion(false);
    setEditingQuestion(null);
    setNewQ({
      text: '',
      category: 'neutral',
      language: 'hinglish',
      hidden: false,
      fixed: false,
      options: [
        { text: '', stream: 'commerce', weight: 1 },
        { text: '', stream: 'science', weight: 1 },
        { text: '', stream: 'arts', weight: 1 },
        { text: '', stream: 'neutral', weight: 1 }
      ]
    });
  };

  const adminFetch = async (input: RequestInfo | URL, init: RequestInit = {}) => {
    if (!adminToken) {
      onUnauthorized();
      throw new Error('Admin session missing. Please login again.');
    }

    const headers = new Headers(init.headers || {});
    headers.set('Authorization', `Bearer ${adminToken}`);

    const res = await fetch(input, { ...init, headers });
    if (res.status === 401) {
      onUnauthorized();
      throw new Error('Session expired. Please login again.');
    }

    return res;
  };

  const fetchStudents = async () => {
    try {
      const res = await adminFetch(`${API_BASE}/api/admin/students?status=${filter === 'All' ? '' : filter}`);
      const data = await res.json();
      setStudents(Array.isArray(data) ? data : []);
      setIsConnected(true);
    } catch {
      setIsConnected(false);
    }
  };

  const fetchQuestions = async () => {
    try {
      const languageParam = questionLanguageFilter === 'all' ? '' : `&language=${questionLanguageFilter}`;
      const res = await adminFetch(`${API_BASE}/api/admin/questions?includeHidden=1${languageParam}`);
      const data = await res.json();
      setQuestions(Array.isArray(data) ? data : []);
      setIsConnected(true);
    } catch {
      setIsConnected(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await adminFetch(`${API_BASE}/api/admin/settings`);
      const data = await res.json();
      setQuestionLimit(Number(data?.questionLimit) || 45);
      setEdnovateOtpRequired(data?.otpSettings?.ednovate === undefined ? (data?.otpRequired !== false) : (data?.otpSettings?.ednovate !== false));
      setDubeyOtpRequired(data?.otpSettings?.dubey === undefined ? true : (data?.otpSettings?.dubey !== false));
      if (data?.contactSettings?.ednovate) {
        setEdnovateContactSettings({
          contactNumber: String(data.contactSettings.ednovate.contactNumber || '8651014840'),
          whatsappMessage: String(data.contactSettings.ednovate.whatsappMessage || 'Hey, I need my Career Counselling Report')
        });
      }
      if (data?.contactSettings?.dubey) {
        setDubeyContactSettings({
          contactNumber: String(data.contactSettings.dubey.contactNumber || '8651014840'),
          whatsappMessage: String(data.contactSettings.dubey.whatsappMessage || 'Hey, I need my Career Counselling Report')
        });
      }
      setIsConnected(true);
    } catch {
      setIsConnected(false);
    }
  };

  const fetchOtpData = async () => {
    try {
      const res = await adminFetch(`${API_BASE}/api/admin/otp-verification`);
      const data = await res.json();
      setOtpVerified(data.verified || []);
      setOtpFailed(data.failed || []);
      setOtpStats({
        verifiedCount: data.verifiedCount || 0,
        failedCount: data.failedCount || 0,
        totalAttempts: data.totalAttempts || 0
      });
      setIsConnected(true);
    } catch {
      setIsConnected(false);
    }
  };

  const deleteStudent = async (id: string) => {
    if (!window.confirm('Delete student?')) return;
    setIsDeleting(id);
    try {
      await adminFetch(`${API_BASE}/api/admin/student/${id}`, { method: 'DELETE' });
      setStudents((prev) => prev.filter((s) => s.id !== id));
    } catch {
      alert('Delete failed');
    } finally {
      setIsDeleting(null);
    }
  };

  const deleteQuestion = async (id: string) => {
    if (!window.confirm('Delete question?')) return;
    try {
      await adminFetch(`${API_BASE}/api/admin/questions/${id}`, { method: 'DELETE' });
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    } catch {
      alert('Delete failed');
    }
  };

  const addQuestion = async () => {
    if (!newQ.text.trim()) return alert('Question text is required');
    try {
      const res = await adminFetch(`${API_BASE}/api/admin/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newQ)
      });
      if (!res.ok) throw new Error('Add failed');
      const added = await res.json();
      setQuestions((prev) => [added, ...prev]);
      resetQuestionForm();
    } catch {
      alert('Add failed');
    }
  };

  const updateQuestion = async () => {
    if (!editingQuestion || !editingQuestion.text.trim()) return alert('Question text is required');
    try {
      const res = await adminFetch(`${API_BASE}/api/admin/questions/${editingQuestion.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingQuestion)
      });
      if (!res.ok) throw new Error('Update failed');
      const updated = await res.json();
      setQuestions((prev) => prev.map((q) => (q.id === updated.id ? updated : q)));
      resetQuestionForm();
    } catch {
      alert('Update failed');
    }
  };

  const toggleQuestionSelection = (id: string) => {
    setSelectedQuestionIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAllQuestions = () => {
    if (selectedQuestionIds.length === questions.length) {
      setSelectedQuestionIds([]);
    } else {
      setSelectedQuestionIds(questions.map((q) => q.id));
    }
  };

  const updateSelectedVisibility = async (hidden: boolean) => {
    if (selectedQuestionIds.length === 0) {
      alert('Pehle questions select karo');
      return;
    }

    try {
      const res = await adminFetch(`${API_BASE}/api/admin/questions/visibility/bulk`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedQuestionIds, hidden })
      });

      if (!res.ok) throw new Error('Visibility update failed');
      const data = await res.json();
      const updatedIds = new Set((data?.rows || []).map((r: any) => r.id));

      setQuestions((prev) =>
        prev.map((q) => (updatedIds.has(q.id) ? { ...q, hidden } : q))
      );
      setSelectedQuestionIds([]);
    } catch {
      alert('Hide/Unhide update failed');
    }
  };

  const updateSelectedFixed = async (fixed: boolean) => {
    if (selectedQuestionIds.length === 0) {
      alert('Pehle questions select karo');
      return;
    }

    try {
      const res = await adminFetch(`${API_BASE}/api/admin/questions/fixed/bulk`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedQuestionIds, fixed })
      });

      if (!res.ok) throw new Error('Fixed update failed');
      const data = await res.json();
      const updatedIds = new Set((data?.rows || []).map((r: any) => r.id));

      setQuestions((prev) => prev.map((q) => (updatedIds.has(q.id) ? { ...q, fixed } : q)));
      setSelectedQuestionIds([]);
    } catch {
      alert('Fixed update failed');
    }
  };

  const updateSingleVisibility = async (id: string, hidden: boolean) => {
    try {
      const res = await adminFetch(`${API_BASE}/api/admin/questions/visibility/bulk`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: [id], hidden })
      });

      if (!res.ok) throw new Error('Visibility update failed');
      setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, hidden } : q)));
    } catch {
      alert('Hide/Unhide update failed');
    }
  };

  const updateSingleFixed = async (id: string, fixed: boolean) => {
    try {
      const res = await adminFetch(`${API_BASE}/api/admin/questions/fixed/bulk`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: [id], fixed })
      });

      if (!res.ok) throw new Error('Fixed update failed');
      setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, fixed } : q)));
    } catch {
      alert('Fixed update failed');
    }
  };

  const csvEscape = (value: unknown) => {
    const str = String(value ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const parseCsvLine = (line: string) => {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i += 1) {
      const ch = line[i];
      const next = line[i + 1];

      if (ch === '"') {
        if (inQuotes && next === '"') {
          current += '"';
          i += 1;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }

    values.push(current.trim());
    return values;
  };

  const exportQuestionsCSV = () => {
    const header = [
      'text', 'category', 'hidden', 'fixed', 'order',
      'opt1_text', 'opt1_stream', 'opt1_weight',
      'opt2_text', 'opt2_stream', 'opt2_weight',
      'opt3_text', 'opt3_stream', 'opt3_weight',
      'opt4_text', 'opt4_stream', 'opt4_weight',
      'opt5_text', 'opt5_stream', 'opt5_weight',
      'opt6_text', 'opt6_stream', 'opt6_weight'
    ];

    const rows = questions.map((q, index) => {
      const opts = parseOptions(q.options);
      const row = [
        q.text,
        q.category || 'neutral',
        Boolean(q.hidden),
        Boolean(q.fixed),
        index
      ];

      for (let i = 0; i < 6; i += 1) {
        const opt = opts[i] || { text: '', stream: 'neutral', weight: 1 };
        row.push(opt.text || '', opt.stream || 'neutral', Number(opt.weight) || 1);
      }

      return row.map(csvEscape).join(',');
    });

    const content = [header.join(','), ...rows].join('\n');
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `questions_excel_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importQuestionsCSV = async (file: File) => {
    setImportingQuestions(true);
    try {
      const text = await file.text();
      const lines = text
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

      if (lines.length < 2) {
        alert('CSV empty hai. Pehle questions add karo.');
        return;
      }

      const headers = parseCsvLine(lines[0]).map((h) => h.toLowerCase());
      const idx = (name: string) => headers.indexOf(name.toLowerCase());

      const incoming = lines.slice(1).map((line, lineIndex) => {
        const cols = parseCsvLine(line);
        const get = (name: string) => {
          const i = idx(name);
          return i >= 0 ? (cols[i] || '') : '';
        };

        const options: QuestionOption[] = [];
        for (let i = 1; i <= 6; i += 1) {
          const t = get(`opt${i}_text`).trim();
          if (!t) continue;
          options.push({
            text: t,
            stream: (get(`opt${i}_stream`) || 'neutral') as any,
            weight: Number(get(`opt${i}_weight`)) || 1
          });
        }

        return {
          text: get('text').trim(),
          category: (get('category') || 'neutral').trim(),
          hidden: String(get('hidden')).toLowerCase() === 'true',
          fixed: String(get('fixed')).toLowerCase() === 'true',
          order: Number(get('order')) || lineIndex,
          options
        };
      }).filter((q) => q.text.length > 0 && q.options.length > 0);

      if (incoming.length === 0) {
        alert('Valid rows nahi mile. Template export karke usi format me import karo.');
        return;
      }

      const res = await adminFetch(`${API_BASE}/api/admin/questions/import`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'merge', questions: incoming })
      });

      if (!res.ok) throw new Error('Import failed');
      const data = await res.json();
      await fetchQuestions();
      alert(`Import done: inserted ${data.inserted}, updated ${data.updated}, skipped ${data.skipped}`);
    } catch {
      alert('Import failed. CSV file format check karo.');
    } finally {
      setImportingQuestions(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const saveSettings = async () => {
    const cleanPhone = (value: string) => String(value || '').replace(/\D/g, '').slice(0, 15);
    const cleanMessage = (value: string) => String(value || '').replace(/\s+/g, ' ').trim();
    const safeLimit = Number(questionLimit);
    if (adminScope === 'all' && (!Number.isInteger(safeLimit) || safeLimit < 1 || safeLimit > 200)) {
      setSettingsMsg('Question limit 1 to 200 ke beech hona chahiye.');
      return;
    }

    const nextEdnovateNumber = cleanPhone(ednovateContactSettings.contactNumber);
    const nextDubeyNumber = cleanPhone(dubeyContactSettings.contactNumber);
    if (adminScope === 'all' && nextEdnovateNumber.length < 8) {
      setSettingsMsg('Ednovate contact number valid rakho (minimum 8 digits).');
      return;
    }
    if (nextDubeyNumber.length < 8) {
      setSettingsMsg('Dubey contact number valid rakho (minimum 8 digits).');
      return;
    }

    const nextEdnovateMessage = cleanMessage(ednovateContactSettings.whatsappMessage) || 'Hey, I need my Career Counselling Report';
    const nextDubeyMessage = cleanMessage(dubeyContactSettings.whatsappMessage) || 'Hey, I need my Career Counselling Report';

    try {
      setSettingsSaving(true);
      setSettingsMsg('');
      const payload: Record<string, unknown> = {
        otpSettings: {
          dubey: dubeyOtpRequired,
          ...(adminScope === 'all' ? { ednovate: ednovateOtpRequired } : {})
        },
        contactSettings: {
          dubey: {
            contactNumber: nextDubeyNumber,
            whatsappMessage: nextDubeyMessage
          },
          ...(adminScope === 'all'
            ? {
                ednovate: {
                  contactNumber: nextEdnovateNumber,
                  whatsappMessage: nextEdnovateMessage
                }
              }
            : {})
        }
      };

      if (adminScope === 'all') {
        payload.questionLimit = safeLimit;
        payload.otpRequired = ednovateOtpRequired;
      }

      const res = await adminFetch(`${API_BASE}/api/admin/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Save failed');
      const data = await res.json();
      setQuestionLimit(Number(data?.questionLimit) || safeLimit || 45);
      setEdnovateOtpRequired(data?.otpSettings?.ednovate === undefined ? (data?.otpRequired !== false) : (data?.otpSettings?.ednovate !== false));
      setDubeyOtpRequired(data?.otpSettings?.dubey === undefined ? dubeyOtpRequired : (data?.otpSettings?.dubey !== false));
      if (data?.contactSettings?.ednovate) {
        setEdnovateContactSettings({
          contactNumber: String(data.contactSettings.ednovate.contactNumber || nextEdnovateNumber || '8651014840'),
          whatsappMessage: String(data.contactSettings.ednovate.whatsappMessage || nextEdnovateMessage)
        });
      }
      if (data?.contactSettings?.dubey) {
        setDubeyContactSettings({
          contactNumber: String(data.contactSettings.dubey.contactNumber || nextDubeyNumber || '8651014840'),
          whatsappMessage: String(data.contactSettings.dubey.whatsappMessage || nextDubeyMessage)
        });
      }
      setSettingsMsg('Settings saved. Contact/WhatsApp config update ho gaya.');
    } catch {
      setSettingsMsg('Settings save nahi hua.');
    } finally {
      setSettingsSaving(false);
    }
  };

  const exportCSV = async () => {
    try {
      const res = await adminFetch(`${API_BASE}/api/admin/export`);
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `students_data_${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert('CSV export failed');
    }
  };

  const downloadPDF = async (id: string) => {
    try {
      const res = await adminFetch(`${API_BASE}/api/admin/report/${id}`);
      if (!res.ok) throw new Error('PDF download failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Report_${id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert('PDF download failed');
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (activeTab === 'students') fetchStudents();
    if (activeTab === 'questions') fetchQuestions();
    if (activeTab === 'settings') fetchSettings();
    if (activeTab === 'otp') fetchOtpData();
  }, [activeTab, filter, questionLanguageFilter, adminToken]);

  useEffect(() => {
    if (adminScope === 'dubey') {
      setSourceFilter('dubey');
    }
  }, [adminScope]);

  return (
    <div className="h-full w-full overflow-y-auto bg-slate-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto bg-white border border-slate-200 rounded-lg p-4 md:p-6 space-y-4 min-h-full">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Admin Panel</h1>
            <p className="text-sm text-slate-500">Simple management view</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium ${isConnected ? 'text-emerald-600' : 'text-rose-600'}`}>
              {isConnected ? 'Server online' : 'Server offline'}
            </span>
            <button
              onClick={() => {
                if (activeTab === 'students') fetchStudents();
                else if (activeTab === 'questions') fetchQuestions();
                else if (activeTab === 'otp') fetchOtpData();
                else if (activeTab === 'settings') fetchSettings();
              }}
              className="inline-flex items-center gap-1.5 border border-slate-300 px-3 py-2 rounded-md text-sm text-slate-700 hover:bg-slate-100"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 border border-slate-300 px-3 py-2 rounded-md text-sm text-slate-700 hover:bg-slate-100"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => {
              setActiveTab('students');
              setEditingQuestion(null);
              setShowAddQuestion(false);
            }}
            className={`px-3 py-2 rounded-md text-sm ${activeTab === 'students' ? 'bg-slate-900 text-white' : 'border border-slate-300 text-slate-700 hover:bg-slate-100'}`}
          >
            Students
          </button>
          <button
            onClick={() => {
              setActiveTab('questions');
              setShowAddQuestion(false);
            }}
            className={`px-3 py-2 rounded-md text-sm ${activeTab === 'questions' ? 'bg-slate-900 text-white' : 'border border-slate-300 text-slate-700 hover:bg-slate-100'}`}
          >
            Questions
          </button>
          <button
            onClick={() => {
              setActiveTab('otp');
              setShowAddQuestion(false);
              setEditingQuestion(null);
            }}
            className={`px-3 py-2 rounded-md text-sm ${activeTab === 'otp' ? 'bg-slate-900 text-white' : 'border border-slate-300 text-slate-700 hover:bg-slate-100'}`}
          >
            OTP Verification
          </button>
          <button
            onClick={() => {
              setActiveTab('settings');
              setShowAddQuestion(false);
              setEditingQuestion(null);
            }}
            className={`px-3 py-2 rounded-md text-sm ${activeTab === 'settings' ? 'bg-slate-900 text-white' : 'border border-slate-300 text-slate-700 hover:bg-slate-100'}`}
          >
            Settings
          </button>
        </div>

        {activeTab === 'students' ? (
          <div className="space-y-4 min-h-0">
            <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
              <div className="relative md:max-w-sm w-full">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name or mobile"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full border border-slate-300 rounded-md py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {(['All', 'Partial', 'Completed'] as StatusFilter[]).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setFilter(opt)}
                    className={`px-3 py-2 rounded-md text-sm ${filter === opt ? 'bg-slate-900 text-white' : 'border border-slate-300 text-slate-700 hover:bg-slate-100'}`}
                  >
                    {opt}
                  </button>
                ))}
                {(adminScope === 'dubey'
                  ? [{ key: 'dubey' as SourceFilter, label: 'Dubey' }]
                  : [
                      { key: 'all' as SourceFilter, label: 'All Brands' },
                      { key: 'ednovate' as SourceFilter, label: 'Ednovate' },
                      { key: 'dubey' as SourceFilter, label: 'Dubey' }
                    ]).map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setSourceFilter(opt.key)}
                    className={`px-3 py-2 rounded-md text-sm ${sourceFilter === opt.key ? 'bg-blue-700 text-white' : 'border border-slate-300 text-slate-700 hover:bg-slate-100'}`}
                  >
                    {opt.label}
                  </button>
                ))}
                <button
                  onClick={exportCSV}
                  className="px-3 py-2 rounded-md text-sm border border-slate-300 text-slate-700 hover:bg-slate-100"
                >
                  Download CSV
                </button>
              </div>
            </div>

            <div className="border border-slate-200 rounded-md overflow-auto max-h-[70vh]">
              <table className="w-full text-sm">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="text-left px-3 py-2">Name</th>
                    <th className="text-left px-3 py-2">Brand</th>
                    <th className="text-left px-3 py-2">Mobile</th>
                    <th className="text-left px-3 py-2">Location</th>
                    <th className="text-left px-3 py-2">Date</th>
                    <th className="text-left px-3 py-2">Time</th>
                    <th className="text-left px-3 py-2">Progress</th>
                    <th className="text-right px-3 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students
                    .filter((s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.mobile.includes(search))
                    .filter((s) => {
                      const sourceKey = String(s.source || 'ednovate').trim().toLowerCase();
                      return sourceFilter === 'all' ? true : sourceKey === sourceFilter;
                    })
                    .map((student) => {
                      const answersArray = Array.isArray(student.answers) ? student.answers : (typeof student.answers === 'string' ? JSON.parse(student.answers || '[]') : []);
                      const progress = answersArray.length;
                      const total = questionLimit || 45;
                      const created = student.createdAt ? new Date(student.createdAt) : null;
                      const createdDate = created && !Number.isNaN(created.getTime()) ? created.toLocaleDateString('en-IN') : '-';
                      const createdTime = created && !Number.isNaN(created.getTime()) ? created.toLocaleTimeString('en-IN') : '-';
                      const sourceKey = String(student.source || 'ednovate').trim().toLowerCase();
                      const brand = sourceKey === 'dubey' ? 'Dubey' : 'Ednovate';
                      
                      return (
                        <tr key={student.id} className="border-t border-slate-200">
                          <td className="px-3 py-2 font-medium">{student.name}</td>
                          <td className="px-3 py-2 text-slate-500">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${brand === 'Dubey' ? 'bg-sky-100 text-sky-700' : 'bg-indigo-100 text-indigo-700'}`}>
                              {brand}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-slate-500">{student.mobile}</td>
                          <td className="px-3 py-2 text-slate-500">{student.location}</td>
                          <td className="px-3 py-2 text-slate-500">{createdDate}</td>
                          <td className="px-3 py-2 text-slate-500">{createdTime}</td>
                          <td className="px-3 py-2">
                            {student.status === 'Completed' ? (
                              <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Completed</span>
                            ) : (
                              <div className="flex flex-col gap-0.5">
                                <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase w-fit">Partial</span>
                                <span className="text-[10px] font-black text-slate-400 ml-1">{progress} / {total} Done</span>
                              </div>
                            )}
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex items-center justify-end gap-2">
                              {student.status === 'Completed' && (
                                <button
                                  onClick={() => downloadPDF(student.id)}
                                  className="inline-flex items-center gap-1 border border-slate-300 px-2 py-1 rounded text-xs text-slate-700 hover:bg-slate-100"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                  PDF
                                </button>
                              )}
                              <button
                                onClick={() => deleteStudent(student.id)}
                                disabled={isDeleting === student.id}
                                className="inline-flex items-center gap-1 border border-rose-300 px-2 py-1 rounded text-xs text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        ) : activeTab === 'questions' ? (
          <div className="space-y-4">
            <div className="flex items-center justify-end">
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleSelectAllQuestions}
                  className="inline-flex items-center gap-1.5 border border-slate-300 px-3 py-2 rounded-md text-sm text-slate-700 hover:bg-slate-100"
                >
                  {selectedQuestionIds.length === questions.length && questions.length > 0 ? 'Unselect All' : 'Select All'}
                </button>
                <button
                  onClick={() => updateSelectedVisibility(true)}
                  className="inline-flex items-center gap-1.5 border border-amber-300 px-3 py-2 rounded-md text-sm text-amber-700 hover:bg-amber-50"
                >
                  Hide Selected
                </button>
                <button
                  onClick={() => updateSelectedVisibility(false)}
                  className="inline-flex items-center gap-1.5 border border-emerald-300 px-3 py-2 rounded-md text-sm text-emerald-700 hover:bg-emerald-50"
                >
                  Unhide Selected
                </button>
                <button
                  onClick={() => updateSelectedFixed(true)}
                  className="inline-flex items-center gap-1.5 border border-indigo-300 px-3 py-2 rounded-md text-sm text-indigo-700 hover:bg-indigo-50"
                >
                  Mark Fixed
                </button>
                <button
                  onClick={() => updateSelectedFixed(false)}
                  className="inline-flex items-center gap-1.5 border border-slate-300 px-3 py-2 rounded-md text-sm text-slate-700 hover:bg-slate-100"
                >
                  Unfix Selected
                </button>
                <button
                  onClick={exportQuestionsCSV}
                  className="inline-flex items-center gap-1.5 border border-slate-300 px-3 py-2 rounded-md text-sm text-slate-700 hover:bg-slate-100"
                >
                  <Download className="w-4 h-4" />
                  Export Excel (CSV)
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,text/csv,application/vnd.ms-excel"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) importQuestionsCSV(f);
                  }}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={importingQuestions}
                  className="inline-flex items-center gap-1.5 border border-slate-300 px-3 py-2 rounded-md text-sm text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                >
                  <Upload className="w-4 h-4" />
                  {importingQuestions ? 'Importing...' : 'Import Excel (CSV)'}
                </button>
                <select
                  value={questionLanguageFilter}
                  onChange={(e) => setQuestionLanguageFilter(e.target.value as 'all' | 'hinglish' | 'english')}
                  className="border border-slate-300 px-3 py-2 rounded-md text-sm text-slate-700"
                >
                  <option value="all">All Languages</option>
                  <option value="hinglish">Hinglish</option>
                  <option value="english">English</option>
                </select>
                <button
                  onClick={() => {
                    setShowAddQuestion(true);
                    setEditingQuestion(null);
                  }}
                  className="inline-flex items-center gap-1.5 border border-slate-300 px-3 py-2 rounded-md text-sm text-slate-700 hover:bg-slate-100"
                >
                  <Plus className="w-4 h-4" />
                  Add Question
                </button>
              </div>
            </div>

            {(showAddQuestion || editingQuestion) && (
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-md">
                <h3 className="font-semibold text-slate-900 text-base mb-3">{editingQuestion ? 'Edit Question' : 'Add Question'}</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Question</label>
                    <input
                      type="text"
                      placeholder="Enter question"
                      value={editingQuestion ? editingQuestion.text : newQ.text}
                      onChange={(e) => editingQuestion
                        ? setEditingQuestion({ ...editingQuestion, text: e.target.value })
                        : setNewQ({ ...newQ, text: e.target.value })}
                      className="w-full border border-slate-300 rounded-md p-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Language</label>
                    <select
                      value={editingQuestion ? (editingQuestion.language || 'hinglish') : newQ.language}
                      onChange={(e) => {
                        const lang = e.target.value as 'hinglish' | 'english';
                        if (editingQuestion) {
                          setEditingQuestion({ ...editingQuestion, language: lang });
                        } else {
                          setNewQ({ ...newQ, language: lang });
                        }
                      }}
                      className="w-full border border-slate-300 rounded-md p-2.5 text-sm"
                    >
                      <option value="hinglish">Hinglish</option>
                      <option value="english">English</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Visibility</label>
                    <select
                      value={editingQuestion ? (editingQuestion.hidden ? 'hidden' : 'visible') : (newQ.hidden ? 'hidden' : 'visible')}
                      onChange={(e) => {
                        const isHidden = e.target.value === 'hidden';
                        if (editingQuestion) {
                          setEditingQuestion({ ...editingQuestion, hidden: isHidden });
                        } else {
                          setNewQ({ ...newQ, hidden: isHidden });
                        }
                      }}
                      className="w-full border border-slate-300 rounded-md p-2.5 text-sm"
                    >
                      <option value="visible">Visible (User test me dikhega)</option>
                      <option value="hidden">Hidden (User test me nahi dikhega)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Fixed Question</label>
                    <select
                      value={editingQuestion ? (editingQuestion.fixed ? 'fixed' : 'normal') : (newQ.fixed ? 'fixed' : 'normal')}
                      onChange={(e) => {
                        const isFixed = e.target.value === 'fixed';
                        if (editingQuestion) {
                          setEditingQuestion({ ...editingQuestion, fixed: isFixed });
                        } else {
                          setNewQ({ ...newQ, fixed: isFixed });
                        }
                      }}
                      className="w-full border border-slate-300 rounded-md p-2.5 text-sm"
                    >
                      <option value="normal">Normal (Shuffle pool)</option>
                      <option value="fixed">Fixed (Test me guaranteed aayega)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {(editingQuestion ? editingQuestion.options : newQ.options).map((opt, i) => (
                      <div key={i} className="bg-white border border-slate-200 rounded-md p-2.5">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder={`Option ${i + 1}`}
                            value={opt.text}
                            onChange={(e) => {
                              if (editingQuestion) {
                                const opts = [...editingQuestion.options];
                                const current = opts[i] || { text: '', stream: 'neutral', weight: 1 };
                                opts[i] = { ...current, text: e.target.value };
                                setEditingQuestion({ ...editingQuestion, options: opts });
                              } else {
                                const opts = [...newQ.options];
                                const current = opts[i] || { text: '', stream: 'neutral', weight: 1 };
                                opts[i] = { ...current, text: e.target.value };
                                setNewQ({ ...newQ, options: opts });
                              }
                            }}
                            className="flex-1 border border-slate-300 rounded-md p-2 text-sm outline-none"
                          />
                          <select
                            value={opt.stream}
                            onChange={(e) => {
                              if (editingQuestion) {
                                const opts = [...editingQuestion.options];
                                const current = opts[i] || { text: '', stream: 'neutral', weight: 1 };
                                opts[i] = { ...current, stream: e.target.value };
                                setEditingQuestion({ ...editingQuestion, options: opts });
                              } else {
                                const opts = [...newQ.options];
                                const current = opts[i] || { text: '', stream: 'neutral', weight: 1 };
                                opts[i] = { ...current, stream: e.target.value };
                                setNewQ({ ...newQ, options: opts });
                              }
                            }}
                            className="border border-slate-300 rounded-md p-2 text-xs uppercase outline-none"
                          >
                            <option value="commerce">Commerce</option>
                            <option value="science">Science</option>
                            <option value="arts">Arts</option>
                            <option value="neutral">Neutral</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 justify-end mt-4">
                  <button
                    onClick={resetQuestionForm}
                    className="px-3 py-2 rounded-md text-sm border border-slate-300 text-slate-700 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={editingQuestion ? updateQuestion : addQuestion}
                    className="px-3 py-2 rounded-md text-sm bg-slate-900 text-white hover:bg-slate-800"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}

            <div className="border border-slate-200 rounded-md max-h-[70vh] overflow-y-auto p-3 space-y-3">
              {questions.map((q) => (
                <div key={q.id} className="bg-white border border-slate-200 rounded-md p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedQuestionIds.includes(q.id)}
                          onChange={() => toggleQuestionSelection(q.id)}
                        />
                        <span className="text-xs text-slate-500 uppercase">{q.category || 'neutral'}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-700 uppercase">
                          {q.language || 'hinglish'}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded ${q.hidden ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          {q.hidden ? 'Hidden' : 'Visible'}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded ${q.fixed ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                          {q.fixed ? 'Fixed' : 'Normal'}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-slate-900">{q.text}</h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {parseOptions(q.options).map((opt, i) => (
                          <div key={i} className="bg-slate-50 border border-slate-200 rounded p-2">
                            <div className="text-[10px] text-slate-500 uppercase">{opt.stream}</div>
                            <div className="text-xs text-slate-800">{opt.text}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setEditingQuestion({ ...q, options: parseOptions(q.options) });
                          setShowAddQuestion(false);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="inline-flex items-center gap-1 border border-slate-300 px-2 py-1 rounded text-xs text-slate-700 hover:bg-slate-100"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => deleteQuestion(q.id)}
                        className="inline-flex items-center gap-1 border border-rose-300 px-2 py-1 rounded text-xs text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                      <button
                        onClick={() => updateSingleVisibility(q.id, !q.hidden)}
                        className="inline-flex items-center gap-1 border border-slate-300 px-2 py-1 rounded text-xs text-slate-700 hover:bg-slate-100"
                      >
                        {q.hidden ? 'Unhide' : 'Hide'}
                      </button>
                      <button
                        onClick={() => updateSingleFixed(q.id, !q.fixed)}
                        className="inline-flex items-center gap-1 border border-indigo-300 px-2 py-1 rounded text-xs text-indigo-700 hover:bg-indigo-50"
                      >
                        {q.fixed ? 'Unfix' : 'Fix'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {questions.length === 0 && (
                <div className="text-center py-10 text-sm text-slate-500">No questions found.</div>
              )}
            </div>
          </div>
        ) : activeTab === 'otp' ? (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="border border-emerald-200 rounded-md p-4 bg-emerald-50">
                <p className="text-sm font-medium text-emerald-700">Verified</p>
                <p className="text-2xl font-bold text-emerald-900">{otpStats.verifiedCount}</p>
                <p className="text-xs text-emerald-600">Successfully verified OTP</p>
              </div>
              <div className="border border-rose-200 rounded-md p-4 bg-rose-50">
                <p className="text-sm font-medium text-rose-700">Failed</p>
                <p className="text-2xl font-bold text-rose-900">{otpStats.failedCount}</p>
                <p className="text-xs text-rose-600">Wrong/Expired OTP attempts</p>
              </div>
              <div className="border border-slate-200 rounded-md p-4 bg-slate-100">
                <p className="text-sm font-medium text-slate-700">Total Attempts</p>
                <p className="text-2xl font-bold text-slate-900">{otpStats.totalAttempts}</p>
                <p className="text-xs text-slate-600">All OTP requests</p>
              </div>
            </div>

            {/* Verified Section */}
            <div className="border border-slate-200 rounded-md overflow-hidden">
              <div className="bg-emerald-100 px-4 py-2">
                <h3 className="text-sm font-semibold text-emerald-900">✓ Successfully Verified ({otpVerified.length})</h3>
              </div>
              <div className="overflow-auto max-h-[40vh]">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50 sticky top-0">
                    <tr>
                      <th className="text-left px-4 py-2 text-slate-600">Mobile</th>
                      <th className="text-left px-4 py-2 text-slate-600">OTP Requested</th>
                      <th className="text-left px-4 py-2 text-slate-600">Verified At</th>
                      <th className="text-left px-4 py-2 text-slate-600">Attempts</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {otpVerified.length > 0 ? (
                      otpVerified.map((item: any, idx) => {
                        const requestedDate = item.otpRequestedAt ? new Date(item.otpRequestedAt) : null;
                        const verifiedDate = item.verifiedAt ? new Date(item.verifiedAt) : null;
                        return (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="px-4 py-2 font-mono text-emerald-600">{item.mobile}</td>
                            <td className="px-4 py-2 text-slate-600">
                              {requestedDate ? requestedDate.toLocaleString('en-IN') : '-'}
                            </td>
                            <td className="px-4 py-2 text-emerald-600">
                              {verifiedDate ? verifiedDate.toLocaleString('en-IN') : '-'}
                            </td>
                            <td className="px-4 py-2">
                              <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-semibold">
                                {item.attemptsTaken || 1}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-4 py-4 text-center text-slate-500">
                          No verified OTPs yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Failed Section */}
            <div className="border border-slate-200 rounded-md overflow-hidden">
              <div className="bg-rose-100 px-4 py-2">
                <h3 className="text-sm font-semibold text-rose-900">✗ Failed/Incomplete ({otpFailed.length})</h3>
              </div>
              <div className="overflow-auto max-h-[40vh]">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50 sticky top-0">
                    <tr>
                      <th className="text-left px-4 py-2 text-slate-600">Mobile</th>
                      <th className="text-left px-4 py-2 text-slate-600">OTP Requested</th>
                      <th className="text-left px-4 py-2 text-slate-600">Failure Reason</th>
                      <th className="text-left px-4 py-2 text-slate-600">Attempts</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {otpFailed.length > 0 ? (
                      otpFailed.map((item: any, idx) => {
                        const requestedDate = item.otpRequestedAt ? new Date(item.otpRequestedAt) : null;
                        return (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="px-4 py-2 font-mono text-rose-600">{item.mobile}</td>
                            <td className="px-4 py-2 text-slate-600">
                              {requestedDate ? requestedDate.toLocaleString('en-IN') : '-'}
                            </td>
                            <td className="px-4 py-2">
                              <span className={`${
                                item.failureReason === 'Max attempts exceeded'
                                  ? 'bg-orange-100 text-orange-700'
                                  : item.failureReason === 'OTP expired'
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-slate-100 text-slate-700'
                              } px-2 py-1 rounded text-xs font-semibold`}>
                                {item.failureReason || 'Unknown'}
                              </span>
                            </td>
                            <td className="px-4 py-2">
                              <span className="bg-rose-100 text-rose-700 px-2 py-1 rounded text-xs font-semibold">
                                {item.attempts || 0}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-4 py-4 text-center text-slate-500">
                          No failed OTPs
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 max-w-xl">
            {adminScope === 'all' && (
              <div className="border border-slate-200 rounded-md p-4 bg-slate-50">
                <h3 className="text-base font-semibold text-slate-900 mb-2">Test Question Count</h3>
                <p className="text-sm text-slate-600 mb-3">
                  Admin yahan set karega kitne questions user test me dikhne chahiye.
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={200}
                    value={questionLimit}
                    onChange={(e) => setQuestionLimit(Number(e.target.value))}
                    className="w-32 border border-slate-300 rounded-md p-2 text-sm"
                  />
                </div>
              </div>
            )}

            {adminScope === 'all' && (
              <div className="border border-slate-200 rounded-md p-4 bg-slate-50">
                <h3 className="text-base font-semibold text-slate-900 mb-2">OTP Requirement</h3>
                <p className="text-sm text-slate-600 mb-3">
                  Brand-wise OTP control: Ednovate aur Dubey ke liye alag toggle.
                </p>
                <div className="space-y-2">
                  <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={ednovateOtpRequired}
                      onChange={(e) => {
                        setEdnovateOtpRequired(e.target.checked);
                      }}
                    />
                    Ednovate OTP Required
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={dubeyOtpRequired}
                      onChange={(e) => setDubeyOtpRequired(e.target.checked)}
                    />
                    Dubey OTP Required
                  </label>
                </div>
              </div>
            )}

            {adminScope === 'dubey' && (
              <div className="border border-slate-200 rounded-md p-4 bg-slate-50">
                <h3 className="text-base font-semibold text-slate-900 mb-2">OTP Requirement (Dubey)</h3>
                <p className="text-sm text-slate-600 mb-3">
                  Dubey panel se aap Dubey users ke liye OTP on/off kar sakte ho.
                </p>
                <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={dubeyOtpRequired}
                    onChange={(e) => {
                      setDubeyOtpRequired(e.target.checked);
                    }}
                  />
                  Dubey OTP Required
                </label>
              </div>
            )}

            {adminScope === 'all' && (
              <div className="border border-slate-200 rounded-md p-4 bg-slate-50 space-y-3">
                <h3 className="text-base font-semibold text-slate-900">Ednovate Contact Settings</h3>
                <input
                  type="text"
                  value={ednovateContactSettings.contactNumber}
                  onChange={(e) => setEdnovateContactSettings((prev) => ({ ...prev, contactNumber: e.target.value }))}
                  placeholder="Ednovate WhatsApp Number"
                  className="w-full border border-slate-300 rounded-md p-2 text-sm"
                />
                <textarea
                  value={ednovateContactSettings.whatsappMessage}
                  onChange={(e) => setEdnovateContactSettings((prev) => ({ ...prev, whatsappMessage: e.target.value }))}
                  placeholder="WhatsApp Prefilled Message"
                  rows={3}
                  className="w-full border border-slate-300 rounded-md p-2 text-sm"
                />
              </div>
            )}

            <div className="border border-slate-200 rounded-md p-4 bg-slate-50 space-y-3">
              <h3 className="text-base font-semibold text-slate-900">Dubey Contact Settings</h3>
              <input
                type="text"
                value={dubeyContactSettings.contactNumber}
                onChange={(e) => setDubeyContactSettings((prev) => ({ ...prev, contactNumber: e.target.value }))}
                placeholder="Dubey WhatsApp Number"
                className="w-full border border-slate-300 rounded-md p-2 text-sm"
              />
              <textarea
                value={dubeyContactSettings.whatsappMessage}
                onChange={(e) => setDubeyContactSettings((prev) => ({ ...prev, whatsappMessage: e.target.value }))}
                placeholder="WhatsApp Prefilled Message"
                rows={3}
                className="w-full border border-slate-300 rounded-md p-2 text-sm"
              />
            </div>

            <div>
              <button
                onClick={saveSettings}
                disabled={settingsSaving}
                className="px-3 py-2 rounded-md text-sm bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50"
              >
                {settingsSaving ? 'Saving...' : 'Save Settings'}
              </button>
              {settingsMsg && <p className="text-xs text-slate-600 mt-2">{settingsMsg}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
