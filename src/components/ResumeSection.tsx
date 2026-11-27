import React, { useState } from 'react';
import {
  FileText,
  Printer,
  X,
  CheckCircle2,
  Globe2,
  ArrowUpRight,
} from 'lucide-react';

import { SkillItem } from '../types';

interface ResumeSectionProps {
  onOpenInquiry: () => void;
  skills?: SkillItem[];
}

export const ResumeSection: React.FC<ResumeSectionProps> = ({ onOpenInquiry, skills }) => {
  const [showCVModal, setShowCVModal] = useState(false);

  const strengths = [
    {
      num: '01',
      title: 'Responsible & Punctual',
      desc: 'Committed to adhering strictly to timeframes, scheduled meetings, and project milestones.',
    },
    {
      num: '02',
      title: 'Hardworking & Dedicated',
      desc: 'Consistently goes the extra mile to refine documents, assets, and technical tasks thoroughly.',
    },
    {
      num: '03',
      title: 'Quick Learner',
      desc: 'Rapidly absorbs unfamiliar software tools, instructions, workflows, and modern techniques.',
    },
    {
      num: '04',
      title: 'Creative & Detail-Oriented',
      desc: 'Attentive to visual harmony, accurate formatting, typos, margins, and typography cohesion.',
    },
    {
      num: '05',
      title: 'Independent & Team-Oriented',
      desc: 'Capable of self-directed work while staying collaborative and supportive in team environments.',
    },
    {
      num: '06',
      title: 'Good Communication',
      desc: 'Clear, polite, and effective written and verbal communication backed by academic English study.',
    },
  ];


  return (
    <>
      {/* EDUCATION & TRAINING SECTION (#education) */}
      <section className="relative z-10 w-full py-16 lg:py-24 bg-[#F5F3EF]" id="education">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div className="flex flex-col gap-2">
              <div className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-white border border-[#E8E5DF]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6900]" />
                <span className="font-mono text-[11px] uppercase tracking-widest text-[#FF6900] font-bold">
                  Academic &amp; Specialized Certifications
                </span>
              </div>
              <h2 className="text-[34px] sm:text-[42px] font-extrabold text-[#111318] tracking-tight">
                Education &amp; Training
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setShowCVModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-[#E8E5DF] text-[#111318] hover:bg-[#FAF8F5] text-xs font-bold transition-all shadow-xs self-start md:self-auto cursor-pointer"
            >
              <FileText className="w-4 h-4 text-[#FF6900]" />
              <span>View &amp; Print Official CV</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 8 Cols: Clean Vertical Timeline */}
            <div className="lg:col-span-8 relative pl-6 sm:pl-8 border-l-2 border-[#E2DFD8] space-y-10">
              {/* Timeline Item 1 */}
              <div className="relative group">
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-5 h-5 rounded-full bg-[#FAF8F5] border-4 border-[#FF6900] shadow-xs" />
                <div className="p-7 sm:p-8 rounded-[24px] bg-white border border-[#E8E5DF] shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-[11px] font-bold text-[#FF6900] uppercase">
                      Current Academic Focus
                    </span>
                    <span className="px-3 py-1 rounded-full bg-[#FFF2E5] font-mono text-[11px] font-bold text-[#FF6900]">
                      3rd Semester Ongoing
                    </span>
                  </div>
                  <h3 className="text-[22px] font-extrabold text-[#111318]">BS in English</h3>
                  <p className="text-[15px] font-semibold text-[#5A606D] mt-0.5">
                    Khan Muhammad Khan Post Graduate College, Pallandri
                  </p>
                  <p className="text-[15px] text-[#5A606D] mt-3 leading-relaxed">
                    Developing rigorous textual analysis, formal English rhetoric, academic research writing, and professional interpersonal communication capabilities.
                  </p>
                </div>
              </div>

              {/* Timeline Item 2 */}
              <div className="relative group">
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-5 h-5 rounded-full bg-[#FAF8F5] border-4 border-[#111318] shadow-xs" />
                <div className="p-7 sm:p-8 rounded-[24px] bg-white border border-[#E8E5DF] shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-[11px] font-bold text-[#111318] uppercase">
                      Specialized Practical Training
                    </span>
                    <span className="px-3 py-1 rounded-full bg-[#F5F3EF] font-mono text-[11px] font-bold text-[#111318]">
                      6 Months Completed
                    </span>
                  </div>
                  <h3 className="text-[22px] font-extrabold text-[#111318]">
                    Comprehensive IT Course (6 Months)
                  </h3>
                  <p className="text-[15px] font-semibold text-[#FF6900] mt-0.5">
                    Technical Training &amp; Computer Education Institute
                  </p>

                  <div className="mt-5">
                    <p className="font-mono text-[11px] text-[#717684] uppercase tracking-wider mb-3 font-semibold">
                      Detailed Syllabus Covered:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {[
                        'Full MS Office Suite',
                        'Graphic Designing',
                        'Video Editing Techniques',
                        'Web & Internet Browsing',
                        'Online Collaboration & Meet',
                        'Windows Setup & OS Basics',
                        'AI Productivity Fundamentals',
                      ].map((item, idx) => (
                        <div
                          key={item}
                          className={`flex items-center gap-2 p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE6DF] text-[13px] text-[#111318] font-medium ${
                            idx === 6 ? 'sm:col-span-2 lg:col-span-3' : ''
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4 text-[#FF6900] shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline Item 3 */}
              <div className="relative group">
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-5 h-5 rounded-full bg-[#FAF8F5] border-4 border-[#8A8F9D] shadow-xs" />
                <div className="p-7 sm:p-8 rounded-[24px] bg-white border border-[#E8E5DF] shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-[11px] font-bold text-[#717684] uppercase">
                      Higher Secondary Education
                    </span>
                    <span className="px-3 py-1 rounded-full bg-[#F5F3EF] font-mono text-[11px] font-bold text-[#717684]">
                      Completed
                    </span>
                  </div>
                  <h3 className="text-[22px] font-extrabold text-[#111318]">
                    Intermediate (F.Sc. Pre-Science)
                  </h3>
                  <p className="text-[15px] font-semibold text-[#5A606D] mt-0.5">
                    Read Foundation College, Pallandri
                  </p>
                  <p className="text-[15px] text-[#5A606D] mt-3 leading-relaxed">
                    Pre-university foundational studies instilling disciplined study habits, scientific analytical approach, and critical thinking.
                  </p>
                </div>
              </div>
            </div>

            {/* Right 4 Cols: Target Roles & Placement Availability */}
            <div className="lg:col-span-4 p-7 sm:p-8 rounded-[28px] bg-white border border-[#E8E5DF] shadow-sm flex flex-col gap-6">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-widest text-[#FF6900] font-bold block mb-1">
                  Placement Availability
                </span>
                <h3 className="text-[24px] font-extrabold text-[#111318]">Target Roles</h3>
              </div>

              <div className="space-y-4 divide-y divide-[#F0ECE5]">
                <div className="pt-2">
                  <h4 className="text-[14px] font-bold text-[#111318]">Junior Graphic Designer</h4>
                  <p className="text-[12px] text-[#5A606D] mt-0.5">
                    Brand kits, posters, social media campaigns &amp; logos
                  </p>
                </div>
                <div className="pt-4">
                  <h4 className="text-[14px] font-bold text-[#111318]">
                    Video Editor &amp; Reel Creator
                  </h4>
                  <p className="text-[12px] text-[#5A606D] mt-0.5">
                    Vertical montages, beat sync &amp; bilingual captions
                  </p>
                </div>
                <div className="pt-4">
                  <h4 className="text-[14px] font-bold text-[#111318]">
                    MS Office &amp; Computer Operator
                  </h4>
                  <p className="text-[12px] text-[#5A606D] mt-0.5">
                    Excel data tracking, Word contracts &amp; pitch decks
                  </p>
                </div>
                <div className="pt-4">
                  <h4 className="text-[14px] font-bold text-[#111318]">
                    Office &amp; IT Support Assistant
                  </h4>
                  <p className="text-[12px] text-[#5A606D] mt-0.5">
                    System setup, archiving &amp; digital correspondence
                  </p>
                </div>
                <div className="pt-4">
                  <h4 className="text-[14px] font-bold text-[#111318]">Digital Studio Assistant</h4>
                  <p className="text-[12px] text-[#5A606D] mt-0.5">
                    Research, online meetings &amp; AI workflow support
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-[#F0ECE5] flex items-center justify-between text-xs">
                <span className="text-[#5A606D]">Languages: Urdu • English</span>
                <span className="font-mono text-[11px] font-bold text-[#10B981] bg-[#ECFDF5] px-2.5 py-1 rounded-full">
                  Full-Time • Immediate
                </span>
              </div>

              <button
                type="button"
                onClick={onOpenInquiry}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#111318] text-white font-bold text-[14px] hover:bg-[#232730] transition-colors shadow-xs cursor-pointer"
              >
                <span>Send Employment Offer</span>
                <ArrowUpRight className="w-4 h-4 text-[#FF6900]" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* WHY WORK WITH ME & LANGUAGE PROFICIENCY SECTION */}
      <section className="relative z-10 w-full py-16 lg:py-24 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          {/* Section Header */}
          <div className="flex flex-col gap-2 mb-12">
            <div className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-[#FFF2E5] border border-[#FFE0C2]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6900]" />
              <span className="font-mono text-[11px] uppercase tracking-widest text-[#FF6900] font-bold">
                Core Work Ethic
              </span>
            </div>
            <h2 className="text-[34px] sm:text-[42px] font-extrabold text-[#111318] tracking-tight">
              Why Work With Me?
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: 6 Strengths Grid */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {strengths.map((item) => (
                <div
                  key={item.title}
                  className="flex flex-col gap-2 p-5 rounded-2xl bg-white border border-[#E8E5DF] shadow-xs hover:border-[#FF6900]/40 transition-all"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold text-[#FF6900] tracking-wider">
                      {item.num}
                    </span>
                  </div>
                  <h4 className="text-[16px] font-bold text-[#111318]">{item.title}</h4>
                  <p className="text-[13px] text-[#5A606D] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>


            {/* Right: Language Proficiency Card */}
            <div className="lg:col-span-4 flex flex-col gap-4 p-6 sm:p-8 rounded-[28px] bg-white border border-[#E8E5DF] shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#FFF2E5] flex items-center justify-center text-[#FF6900]">
                  <Globe2 className="w-4 h-4" />
                </div>
                <h3 className="text-[18px] font-bold text-[#111318]">Language Proficiency</h3>
              </div>

              <div className="flex flex-col gap-3 mt-1">
                <div className="flex flex-col gap-1 p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EAE6DF]">
                  <div className="flex items-center justify-between">
                    <span className="text-[15px] font-bold text-[#111318]">Urdu</span>
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-white text-[#FF6900] border border-[#E5E0D8]">
                      NATIVE SPEAKER
                    </span>
                  </div>
                  <p className="text-[12px] text-[#5A606D]">
                    Full verbal fluency, reading, and writing capability.
                  </p>
                </div>

                <div className="flex flex-col gap-1 p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EAE6DF]">
                  <div className="flex items-center justify-between">
                    <span className="text-[15px] font-bold text-[#111318]">English</span>
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-white text-[#111318] border border-[#E5E0D8]">
                      FLUENT • BS SCHOLAR
                    </span>
                  </div>
                  <p className="text-[12px] text-[#5A606D]">
                    Academic reading, professional email drafting, and articulate verbal discussions.
                  </p>
                </div>
              </div>

              <div className="mt-2 p-3 rounded-xl bg-[#FFF9F2] border border-[#FFE8D1] flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#FF6900] shrink-0" />
                <span className="text-[12px] font-medium text-[#7A3000]">
                  Ready for multilingual corporate correspondence.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OFFICIAL CV PRINT / PREVIEW MODAL */}
      {showCVModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-[24px] bg-white p-6 sm:p-10 shadow-2xl border border-[#E8E5DF] my-8">
            <div className="flex items-center justify-between border-b border-[#F0ECE5] pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#111318] text-white flex items-center justify-center font-bold text-sm">
                  MI
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#111318]">Official Curriculum Vitae</h3>
                  <span className="text-xs text-[#717684]">Munazza Irfan • Rawalpindi, Pakistan</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF8F5] border border-[#E8E5DF] text-xs font-semibold text-[#111318] hover:bg-[#F5F3EF]"
                >
                  <Printer className="w-3.5 h-3.5 text-[#FF6900]" />
                  <span>Print</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowCVModal(false)}
                  className="p-1.5 rounded-full text-[#717684] hover:bg-[#F5F3EF] hover:text-[#111318]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-6 text-sm text-[#5A606D] leading-relaxed max-h-[70vh] overflow-y-auto pr-2">
              <div>
                <h4 className="font-bold text-[#111318] uppercase tracking-wider text-xs border-b border-[#F0ECE5] pb-1 mb-2 font-mono">
                  Career Objective
                </h4>
                <p>
                  Dedicated and enthusiastic professional with BS in English studies and completed
                  6-month certified IT qualification. Seeking roles as Junior Graphic Designer,
                  Video Content Editor, or Office Assistant where high precision, quick learning, and
                  organized execution bring tangible value.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#111318] uppercase tracking-wider text-xs border-b border-[#F0ECE5] pb-1 mb-2 font-mono">
                  Education &amp; Qualifications
                </h4>
                <ul className="space-y-2">
                  <li>
                  
<strong className="text-[#111318]">B.A</strong>

                  </li>
                  <li>
                    <strong className="text-[#111318]">Comprehensive 6-Month IT Certification (Completed)</strong>
                    <br />
                    Technical Training &amp; Computer Education Institute
                  </li>
                  <li>
                    <strong className="text-[#111318]">Intermediate (F.Sc. Pre-Science)</strong>
                    <br />
                    Read Foundation College, Pallandri
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-[#111318] uppercase tracking-wider text-xs border-b border-[#F0ECE5] pb-1 mb-2 font-mono">
                  Technical Core Skills
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>• MS Office (Word, Excel, PowerPoint)</div>
                  <div>• Graphic Design (Canva Pro, Photoshop)</div>
                  <div>• Video Editing (CapCut, Premiere Pro)</div>
                  <div>• Windows OS Setup &amp; Drivers</div>
                  <div>• Internet Research &amp; Cloud Drive</div>
                  <div>• Prompt Engineering &amp; AI Tools</div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-[#111318] uppercase tracking-wider text-xs border-b border-[#F0ECE5] pb-1 mb-2 font-mono">
                  Contact Information
                </h4>
                <p>
                  Phone: 03129547572 / +92-3126292672 • Email: munazza.00077@gmail.com
                  <br />
                  Location: Rawalpindi, Punjab, Pakistan
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#F0ECE5] flex justify-end">
              <button
                type="button"
                onClick={() => setShowCVModal(false)}
                className="px-6 py-2.5 rounded-full bg-[#111318] text-white text-xs font-semibold hover:bg-[#232730]"
              >
                Close CV Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
