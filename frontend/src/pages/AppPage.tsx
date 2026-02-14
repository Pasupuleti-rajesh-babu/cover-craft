import { useState, useEffect } from 'react';
import { Copy, Download, Edit2, Sparkles, Settings, ArrowRight } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/Button';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { generateCoverLetter } from '../utils/gemini';
import { generateAndDownloadDocx } from '../utils/docx';

export const AppPage: React.FC = () => {
    const [formData, setFormData] = useState({
        jdText: '',
        resumeText: '',
        tone: 'Neutral',
    });
    const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
    const [showKeyInput, setShowKeyInput] = useState(!localStorage.getItem('gemini_api_key'));
    const [generatedText, setGeneratedText] = useState('');
    const [extractedCompany, setExtractedCompany] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (apiKey) {
            localStorage.setItem('gemini_api_key', apiKey);
        }
    }, [apiKey]);

    const handleGenerate = async () => {
        if (!apiKey) {
            setShowKeyInput(true);
            alert("Please enter your Gemini API Key.");
            return;
        }
        if (!formData.jdText || !formData.resumeText) return;

        setIsGenerating(true);
        setGeneratedText(''); // Clear previous
        setIsEditing(false);

        try {
            const { coverLetter, company } = await generateCoverLetter(
                apiKey,
                formData.jdText,
                formData.resumeText,
                formData.tone
            );
            setGeneratedText(coverLetter);
            setExtractedCompany(company);
        } catch (error) {
            console.error("Generation failed", error);
            alert((error as Error).message || "Failed to generate. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDownload = async () => {
        if (!generatedText) return;
        try {
            // Clean filename
            const safeCompany = extractedCompany.replace(/[^a-z0-9]/gi, '_').substring(0, 20) || 'Company';
            const filename = `Cover_Letter_${safeCompany}.docx`;

            await generateAndDownloadDocx(generatedText, filename);
        } catch (error) {
            console.error("Download failed", error);
            alert("Failed to download.");
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedText);
    };

    return (
        <div className="h-screen bg-slate-50 flex flex-col font-sans overflow-hidden">
            <Navbar />

            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel: Context & Inputs */}
                <div className="w-full lg:w-1/2 flex flex-col border-r border-slate-200 bg-white overflow-y-auto">
                    <div className="p-8 max-w-2xl mx-auto w-full flex flex-col gap-8">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Create your letter</h1>
                            <p className="text-slate-500 mt-2 text-lg">
                                Paste your details below. We'll extract the job info tailored to your experience.
                            </p>
                        </div>

                        {/* API Key Toggle */}
                        <div className="flex items-center justify-between bg-slate-50 p-4 rounded-lg border border-slate-100">
                            <div className="flex items-center gap-2 text-slate-600">
                                <Settings className="h-4 w-4" />
                                <span className="text-sm font-medium">Gemini API Key</span>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setShowKeyInput(!showKeyInput)}>
                                {showKeyInput ? 'Hide' : (apiKey ? 'Configured' : 'Set Key')}
                            </Button>
                        </div>

                        {showKeyInput && (
                            <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                                <input
                                    type="password"
                                    className="w-full rounded-md border border-slate-300 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all shadow-sm"
                                    placeholder="Enter your Gemini API key"
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                />
                                <p className="text-xs text-slate-400 mt-1">
                                    Your key is stored locally in your browser.
                                </p>
                            </div>
                        )}

                        <div className="space-y-6">
                            <div className="group">
                                <label className="block text-sm font-medium text-slate-700 mb-2 group-focus-within:text-indigo-600 transition-colors">Job Description</label>
                                <textarea
                                    className="w-full h-48 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none placeholder:text-slate-400"
                                    placeholder="Paste the full job description here..."
                                    value={formData.jdText}
                                    onChange={(e) => setFormData({ ...formData, jdText: e.target.value })}
                                />
                            </div>

                            <div className="group">
                                <label className="block text-sm font-medium text-slate-700 mb-2 group-focus-within:text-indigo-600 transition-colors">Your Resume</label>
                                <textarea
                                    className="w-full h-48 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none placeholder:text-slate-400"
                                    placeholder="Paste your resume content here..."
                                    value={formData.resumeText}
                                    onChange={(e) => setFormData({ ...formData, resumeText: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Tone</label>
                                <div className="flex gap-3">
                                    {['Neutral', 'Confident', 'Warm'].map((t) => (
                                        <button
                                            key={t}
                                            className={clsx(
                                                "flex-1 py-2.5 text-sm font-medium rounded-lg border transition-all",
                                                formData.tone === t
                                                    ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200"
                                                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                                            )}
                                            onClick={() => setFormData({ ...formData, tone: t })}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 pb-12">
                            <Button
                                onClick={handleGenerate}
                                isLoading={isGenerating}
                                disabled={!formData.jdText || !formData.resumeText}
                                size="lg"
                                className="w-full justify-center text-lg h-14 shadow-xl shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 transition-all"
                            >
                                {isGenerating ? 'Crafting your letter...' : (<span>Generate Cover Letter <ArrowRight className="inline ml-2 h-5 w-5" /></span>)}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Preview (A4 Document Style) */}
                <div className="w-full lg:w-1/2 bg-slate-100 flex flex-col items-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px] [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)] pointer-events-none opacity-50"></div>

                    {/* Toolbar */}
                    <div className="z-20 mt-6 mb-2 flex items-center gap-2 bg-white/80 backdrop-blur pb-2 px-4 py-2 rounded-full shadow-sm border border-slate-200/60 sticky top-6">
                        <Button variant="ghost" size="sm" onClick={() => setIsEditing(!isEditing)} title={isEditing ? "View Mode" : "Edit Mode"} className={clsx("text-slate-600", isEditing && "bg-indigo-50 text-indigo-600")}>
                            <Edit2 className="h-4 w-4 mr-2" /> {isEditing ? 'Editing' : 'Edit'}
                        </Button>
                        <div className="w-px h-4 bg-slate-300 mx-1"></div>
                        <Button variant="ghost" size="sm" onClick={handleCopy} title="Copy Text" className="text-slate-600">
                            <Copy className="h-4 w-4 mr-2" /> Copy
                        </Button>
                        <Button variant="ghost" size="sm" onClick={handleDownload} title="Download DOCX" className="text-slate-600">
                            <Download className="h-4 w-4 mr-2" /> Download
                        </Button>
                    </div>

                    <div className="flex-1 w-full overflow-y-auto p-8 lg:p-12 flex items-start justify-center relative z-10 scroll-smooth">
                        <AnimatePresence mode="wait">
                            {isGenerating ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-white shadow-2xl w-[210mm] min-h-[297mm] p-[25mm] mx-auto relative flex flex-col items-center justify-center text-center opacity-90"
                                >
                                    <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center">
                                        <motion.div
                                            className="h-16 w-16 bg-indigo-600 rounded-xl shadow-lg flex items-center justify-center mb-6"
                                            animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                        >
                                            <Sparkles className="h-8 w-8 text-white" />
                                        </motion.div>
                                        <h3 className="text-xl font-serif text-slate-800 font-medium">Drafting your letter...</h3>
                                    </div>
                                    {/* Mock content lines for skeleton effect */}
                                    <div className="w-full space-y-4 opacity-10 blur-sm">
                                        <div className="h-4 bg-slate-900 w-1/3 mb-8"></div>
                                        <div className="h-3 bg-slate-400 w-full"></div>
                                        <div className="h-3 bg-slate-400 w-full"></div>
                                        <div className="h-3 bg-slate-400 w-5/6"></div>
                                        <div className="h-3 bg-slate-400 w-full mt-6"></div>
                                        <div className="h-3 bg-slate-400 w-4/6"></div>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="animate-in fade-in duration-700 w-full flex justify-center pb-20">
                                    {/* A4 Paper Container */}
                                    <div className="bg-white shadow-2xl w-[210mm] min-h-[297mm] p-[25mm] relative border border-slate-200/50 transition-shadow duration-300 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)]">

                                        {/* Content */}
                                        {isEditing ? (
                                            <textarea
                                                className="w-full h-full min-h-[800px] resize-none border-none focus:ring-0 text-slate-800 leading-normal font-serif text-[11pt] p-0 bg-transparent placeholder:text-slate-300"
                                                value={generatedText}
                                                onChange={(e) => setGeneratedText(e.target.value)}
                                                placeholder="Your cover letter will appear here..."
                                                style={{ fontFamily: '"Merriweather", serif' }}
                                                autoFocus
                                            />
                                        ) : (
                                            <div
                                                className="prose prose-slate max-w-none font-serif text-[11pt] leading-normal text-slate-900 whitespace-pre-wrap"
                                                style={{ fontFamily: '"Merriweather", serif' }}
                                            >
                                                {generatedText || <span className="text-slate-300 italic">Your cover letter will be generated here...</span>}
                                            </div>
                                        )}

                                        {/* Status Footer on the page */}
                                        {generatedText && (
                                            <div className="absolute bottom-4 right-8 flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
                                                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Auto-Saved</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};
