import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Download, Zap } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Navbar } from '../components/Navbar';

export const LandingPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <Navbar />

            {/* Hero Section */}
            <section className="relative px-4 pt-20 pb-16 text-center lg:pt-32">
                <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
                    Craft the Perfect Cover Letter <br className="hidden sm:block" />
                    <span className="text-indigo-600">in Seconds.</span>
                </h1>
                <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
                    Stop staring at a blank page. Generate a tailored, human-sounding cover letter that highlights your skills and fits the job description perfectly.
                </p>
                <div className="mt-10 flex justify-center gap-4">
                    <Link to="/app">
                        <Button size="lg" className="gap-2">
                            Generate Cover Letter <ArrowRight className="h-5 w-5" />
                        </Button>
                    </Link>
                    <a href="#how-it-works">
                        <Button variant="ghost" size="lg">How it works</Button>
                    </a>
                </div>

                {/* Social Proof */}
                <div className="mt-12 text-sm font-medium text-slate-500">
                    TRUSTED BY JOB SEEKERS FROM
                </div>
                <div className="mt-4 flex flex-wrap justify-center gap-8 opacity-50 grayscale">
                    {/* Simple text placeholders or svgs for "logos" */}
                    <span className="text-xl font-bold">Google</span>
                    <span className="text-xl font-bold">Amazon</span>
                    <span className="text-xl font-bold">Microsoft</span>
                    <span className="text-xl font-bold">Spotify</span>
                </div>
            </section>

            {/* Features */}
            <section id="how-it-works" className="bg-white py-24 sm:py-32">
                <div className="container mx-auto px-4">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Everything you need to stand out</h2>
                    </div>
                    <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:max-w-none lg:grid-cols-3">
                        {[
                            {
                                title: 'Human Tone',
                                description: 'No robotic AI phrasing. We prioritize natural language that sounds like a real professional.',
                                icon: Zap,
                            },
                            {
                                title: 'ATS Friendly',
                                description: 'Keywords from the job description are naturally woven into the narrative to pass initial screens.',
                                icon: CheckCircle,
                            },
                            {
                                title: 'Word Download',
                                description: 'Export directly to .docx format, ready to edit and submit with your application.',
                                icon: Download,
                            },
                        ].map((feature) => (
                            <Card key={feature.title} className="flex flex-col items-start gap-4 border-none shadow-lg shadow-slate-200/50 transition-transform hover:-translate-y-1">
                                <div className="rounded-lg bg-indigo-50 p-3 text-indigo-600">
                                    <feature.icon className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
                                    <p className="mt-2 text-slate-600">{feature.description}</p>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="mt-auto border-t border-slate-200 bg-white py-12">
                <div className="container mx-auto px-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <p className="text-sm text-slate-500">© 2024 CoverCraft. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="text-sm text-slate-500 hover:text-indigo-600">Privacy</a>
                        <a href="#" className="text-sm text-slate-500 hover:text-indigo-600">Terms</a>
                        <a href="#" className="text-sm text-slate-500 hover:text-indigo-600">Twitter</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};
