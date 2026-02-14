import { useState, useEffect } from 'react';
import { Copy, Download, Edit2, FileText, Check, Sparkles, Settings, ArrowRight } from 'lucide-react';
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

                {/* Right Panel: Preview */}
                <div className="w-full lg:w-1/2 bg-slate-100 flex flex-col relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

                    <div className="flex-1 overflow-y-auto p-8 lg:p-12 flex items-start justify-center relative z-10">
                        <AnimatePresence mode="wait">
                            {isGenerating ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="flex flex-col items-center justify-center min-h-[500px] text-center"
                                >
                                    <motion.div
                                        className="h-24 w-24 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-8"
                                        animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                    >
                                        <Sparkles className="h-10 w-10 text-indigo-500" />
                                    </motion.div>
                                    <h3 className="text-2xl font-bold text-slate-700">Writing your masterpiece...</h3>
                                    <p className="text-slate-500 mt-2 max-w-xs mx-auto">
                                        Analyzing the job description, tailored your resume, and applying the {formData.tone.toLowerCase()} tone.
                                    </p>
                                </motion.div>
                            ) : generatedText ? (
                                <div className="w-full max-w-2xl animate-in zoom-in-95 duration-500">
                                    <div className="bg-white rounded-none shadow-2xl min-h-[800px] w-full p-12 sm:p-16 relative mx-auto my-8 border border-slate-200/50">
                                        {/* Document Actions */}
                                        <div className="absolute top-4 right-4 flex gap-2 print:hidden backdrop-blur-sm bg-white/50 p-1 rounded-lg">
                                            <Button variant="ghost" size="sm" onClick={() => setIsEditing(!isEditing)} title="Edit">
                                                <Edit2 className="h-4 w-4 text-slate-500" />
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={handleCopy} title="Copy Text">
                                                <Copy className="h-4 w-4 text-slate-500" />
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={handleDownload} title="Download DOCX">
                                                <Download className="h-4 w-4 text-slate-500" />
                                            </Button>
                                        </div>

                                        {isEditing ? (
                                            <textarea
                                                className="w-full h-full min-h-[700px] resize-none border-none focus:ring-0 text-slate-800 leading-relaxed font-serif text-lg p-0 bg-transparent placeholder:text-slate-300"
                                                value={generatedText}
                                                onChange={(e) => setGeneratedText(e.target.value)}
                                                autoFocus
                                            />
                                        ) : (
                                            <div className="prose prose-slate max-w-none font-serif text-lg leading-relaxed text-slate-800 whitespace-pre-wrap">
                                                {generatedText}
                                            </div>
                                        )}
                                    </div>

                                    <div className="text-center text-sm text-slate-400 font-medium pb-8">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/50 border border-slate-200/50 shadow-sm">
                                            <Check className="h-3 w-3 text-green-500" />
                                            Optimized for ATS Parsing • {extractedCompany}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 h-full min-h-[500px]">
                                    <div className="h-20 w-20 rounded-2xl bg-white shadow-xl shadow-indigo-100 flex items-center justify-center mb-6 rotate-3 transition-transform hover:rotate-6 duration-500">
                                        <FileText className="h-10 w-10 text-indigo-500" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-slate-600">Ready to write</h3>
                                    <p className="max-w-xs text-center mt-2 text-slate-400">
                                        Your generated cover letter will appear here, formatted and ready to download.
                                    </p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};
