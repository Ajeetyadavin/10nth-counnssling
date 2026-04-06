import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Download, Pencil, Plus, RefreshCw, Search, Trash2, Upload } from 'lucide-react';

type Tab = 'students' | 'questions' | 'settings';
type StatusFilter = 'All' | 'Partial' | 'Completed';

type Student = {
  id: string;
  name: string;
  mobile: string;
  location: string;
  status: 'Partial' | 'Completed' | string;
  answers?: any;
  createdAt?: string;
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
  options: QuestionOption[] | string;
  hidden?: boolean;
  fixed?: boolean;
};

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

const AdminPanel = ({ onBack }: { onBack: () => void }) => {
  const [activeTab, setActiveTab] = useState<Tab>('students');
  const [students, setStudents] = useState<Student[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filter, setFilter] = useState<StatusFilter>('All');
  const [search, setSearch] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [questionLimit, setQuestionLimit] = useState<number>(45);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsMsg, setSettingsMsg] = useState('');
  const [importingQuestions, setImportingQuestions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<(Question & { options: QuestionOption[] }) | null>(null);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);

  const [newQ, setNewQ] = useState({
    text: '',
    category: 'neutral',
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

  const fetchStudents = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/students?status=${filter === 'All' ? '' : filter}`);
      const data = await res.json();
      setStudents(Array.isArray(data) ? data : []);
      setIsConnected(true);
    } catch {
      setIsConnected(false);
    }
  };

  const fetchQuestions = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/questions?includeHidden=1`);
      const data = await res.json();
      setQuestions(Array.isArray(data) ? data : []);
      setIsConnected(true);
    } catch {
      setIsConnected(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/settings`);
      const data = await res.json();
      setQuestionLimit(Number(data?.questionLimit) || 45);
      setIsConnected(true);
    } catch {
      setIsConnected(false);
    }
  };

  const deleteStudent = async (id: string) => {
    if (!window.confirm('Delete student?')) return;
    setIsDeleting(id);
    try {
      await fetch(`${API_BASE}/api/admin/student/${id}`, { method: 'DELETE' });
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
      await fetch(`${API_BASE}/api/admin/questions/${id}`, { method: 'DELETE' });
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    } catch {
      alert('Delete failed');
    }
  };

  const addQuestion = async () => {
    if (!newQ.text.trim()) return alert('Question text is required');
    try {
      const res = await fetch(`${API_BASE}/api/admin/questions`, {
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
      const res = await fetch(`${API_BASE}/api/admin/questions/${editingQuestion.id}`, {
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
      const res = await fetch(`${API_BASE}/api/admin/questions/visibility/bulk`, {
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
      const res = await fetch(`${API_BASE}/api/admin/questions/fixed/bulk`, {
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
      const res = await fetch(`${API_BASE}/api/admin/questions/visibility/bulk`, {
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
      const res = await fetch(`${API_BASE}/api/admin/questions/fixed/bulk`, {
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

  const exportQuestionsJSON = () => {
    const cleanQuestions = questions.map((q, index) => ({
      text: q.text,
      options: parseOptions(q.options),
      category: q.category || 'neutral',
      hidden: Boolean(q.hidden),
      fixed: Boolean(q.fixed),
      order: index
    }));

    const payload = {
      exportedAt: new Date().toISOString(),
      count: cleanQuestions.length,
      questions: cleanQuestions
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `questions_export_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importQuestionsJSON = async (file: File) => {
    setImportingQuestions(true);
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const incoming = Array.isArray(parsed) ? parsed : (Array.isArray(parsed?.questions) ? parsed.questions : []);

      if (!Array.isArray(incoming) || incoming.length === 0) {
        alert('Invalid JSON format. questions array expected.');
        return;
      }

      const res = await fetch(`${API_BASE}/api/admin/questions/import`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'merge', questions: incoming })
      });

      if (!res.ok) throw new Error('Import failed');
      const data = await res.json();
      await fetchQuestions();
      alert(`Import done: inserted ${data.inserted}, updated ${data.updated}, skipped ${data.skipped}`);
    } catch {
      alert('Import failed. Valid JSON file upload karo.');
    } finally {
      setImportingQuestions(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const saveSettings = async () => {
    const safeLimit = Number(questionLimit);
    if (!Number.isInteger(safeLimit) || safeLimit < 1 || safeLimit > 200) {
      setSettingsMsg('Question limit 1 to 200 ke beech hona chahiye.');
      return;
    }

    try {
      setSettingsSaving(true);
      setSettingsMsg('');
      const res = await fetch(`${API_BASE}/api/admin/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionLimit: safeLimit })
      });

      if (!res.ok) throw new Error('Save failed');
      const data = await res.json();
      setQuestionLimit(Number(data?.questionLimit) || safeLimit);
      setSettingsMsg('Settings saved. User test ab isi question count ke saath chalega.');
    } catch {
      setSettingsMsg('Settings save nahi hua.');
    } finally {
      setSettingsSaving(false);
    }
  };

  const exportCSV = () => window.open(`${API_BASE}/api/admin/export`, '_blank');
  const downloadPDF = (id: string) => window.open(`${API_BASE}/api/admin/report/${id}`, '_blank');

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (activeTab === 'students') fetchStudents();
    if (activeTab === 'questions') fetchQuestions();
    if (activeTab === 'settings') fetchSettings();
  }, [activeTab, filter]);

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
              onClick={activeTab === 'students' ? fetchStudents : fetchQuestions}
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
                    .map((student) => {
                      const answersArray = Array.isArray(student.answers) ? student.answers : (typeof student.answers === 'string' ? JSON.parse(student.answers || '[]') : []);
                      const progress = answersArray.length;
                      const total = questionLimit || 45;
                      const created = student.createdAt ? new Date(student.createdAt) : null;
                      const createdDate = created && !Number.isNaN(created.getTime()) ? created.toLocaleDateString('en-IN') : '-';
                      const createdTime = created && !Number.isNaN(created.getTime()) ? created.toLocaleTimeString('en-IN') : '-';
                      
                      return (
                        <tr key={student.id} className="border-t border-slate-200">
                          <td className="px-3 py-2 font-medium">{student.name}</td>
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
                  onClick={exportQuestionsJSON}
                  className="inline-flex items-center gap-1.5 border border-slate-300 px-3 py-2 rounded-md text-sm text-slate-700 hover:bg-slate-100"
                >
                  <Download className="w-4 h-4" />
                  Export JSON
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/json"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) importQuestionsJSON(f);
                  }}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={importingQuestions}
                  className="inline-flex items-center gap-1.5 border border-slate-300 px-3 py-2 rounded-md text-sm text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                >
                  <Upload className="w-4 h-4" />
                  {importingQuestions ? 'Importing...' : 'Import JSON'}
                </button>
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
        ) : (
          <div className="space-y-4 max-w-xl">
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
                <button
                  onClick={saveSettings}
                  disabled={settingsSaving}
                  className="px-3 py-2 rounded-md text-sm bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50"
                >
                  {settingsSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
              {settingsMsg && <p className="text-xs text-slate-600 mt-2">{settingsMsg}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
