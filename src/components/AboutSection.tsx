import React from 'react';

export const AboutSection: React.FC = () => {

  return (
    <section className="relative z-10 w-full py-16 lg:py-24" id="about">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col gap-2 mb-12">
          <div className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-[#FFF2E5] border border-[#FFE0C2]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6900]" />
            <span className="font-mono text-[11px] uppercase tracking-widest text-[#FF6900] font-bold">
              Background &amp; Journey
            </span>
          </div>
          <h2 className="text-[34px] sm:text-[42px] font-extrabold text-[#111318] tracking-tight">
            About Me
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Portrait Presentation Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[430px]">
              {/* Subtle decorative shadow blur */}
              <div className="absolute -inset-2 bg-gradient-to-r from-[#FF6900]/15 via-[#FBBF24]/10 to-transparent rounded-[32px] blur-xl -z-10" />

              {/* Warm Card Enclosure */}
              <div className="relative rounded-[28px] bg-white p-3.5 border border-[#E8E5DF] shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
                {/* Browser-like header */}
                <div className="flex items-center justify-between px-3 py-2 border-b border-[#F0ECE5] mb-3 bg-[#FAF8F5] rounded-t-[20px]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                    <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                    <span className="w-3 h-3 rounded-full bg-[#27C93F]" />
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white border border-[#E5E0D8] text-[11px] font-mono text-[#5A606D]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                    <span>munazza.portfolio • 2026</span>
                  </div>
                  <span className="font-mono text-[10px] text-[#8A8F9D] uppercase font-semibold">Verified</span>
                </div>


                {/* Portrait Frame with overlay badge */}
                <div className="relative w-full aspect-[4/5] rounded-[20px] overflow-hidden bg-[#F5F3EF] flex items-center justify-center group shadow-inner">
                  <img
                    alt="Munazza Irfan - IT & Office Skills Professional"
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    src="/assets/munazza_portrait.jpg"
                    onError={(e) => {
                      // Fallback in case of path resolution issues
                      (e.target as HTMLImageElement).src =
                        'https://lh3.googleusercontent.com/aida-public/AB6AXuDSjmAoMrFLypnok8q1vX7O9AFsd4K4RVSkv5KWnlKY8PA0Mngr-7LluYQgYO2HEgmvmdr0d6Zt_I8wvD4EkqHd_u3PtbVSp1yBbj4HAA5Q3U72Ym059hSincKQfXBrlesx8amn0wH_pB3ZqdajquBrvv-9AaZ5yCdko6KRlJes0f5yE6CvfVIOOqLQpcXlTopBYSQozXCndAETf_dDRVnQlcGfazFOMnKq5oxBhksS';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex flex-col justify-end p-5">
                    <div className="inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-full bg-white/95 backdrop-blur-md mb-2 shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-[#10B981] shrink-0" />
                      <span className="font-mono text-[11px] font-semibold text-[#111318]">
                       
Video Editor & Designer

                      </span>
                    </div>
                    <h3 className="text-white text-[22px] font-bold tracking-tight">
                      Munazza Irfan
                    </h3>
                    <p className="text-white/85 text-[13px]">
                     
Rawalpindi • B.A

                    </p>
                  </div>
                </div>

                {/* Floating micro badges below photo: Clean typographic badges */}
                <div className="grid grid-cols-2 gap-2.5 mt-3">
                  <div className="flex flex-col p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE6DF]">
                    <span className="font-mono text-[10px] text-[#FF6900] uppercase font-bold">
                      Credential
                    </span>
                    <span className="font-mono text-[12px] font-bold text-[#111318] truncate mt-0.5">
                      Certified IT (6-Mo)
                    </span>
                  </div>
                  <div className="flex flex-col p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE6DF]">
                    <span className="font-mono text-[10px] text-[#717684] uppercase font-bold">
                      Discipline
                    </span>
                    <span className="font-mono text-[12px] font-bold text-[#111318] truncate mt-0.5">
                      Design &amp; Edit
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative Bio + Badges + Professional Overview */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Core Bio Card */}
            <div className="flex flex-col gap-6 p-7 sm:p-8 rounded-[28px] bg-white border border-[#E8E5DF] shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
              <div className="flex flex-col gap-4 text-[#5A606D] text-[16px] sm:text-[17px] leading-relaxed">
                <p className="text-[#111318] font-semibold text-[19px] sm:text-[20px] leading-snug">
                 
I am Munazza Irfan, a B.A student, with practical skills in video editing, graphic design, and IT operations. I have completed a comprehensive 6-month IT course covering MS Office, creative design, video editing, Windows systems, internet technologies, and AI productivity tools.

                </p>
                <p>
                  
I have hands-on experience creating promotional videos, social media reels, branded graphics, and digital content. I focus on delivering visually engaging work that meets client requirements and communicates their message effectively.

                </p>
                <p>
                 
My goal is to help businesses and content creators bring their ideas to life through professional video editing, engaging social media content, and creative graphic design. I focus on quality, attention to detail, and client satisfaction.

                </p>
              </div>

              {/* Pill Badges: Pure clean typography without clutter icons */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-[#F0ECE5]">
                <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-[#FAF8F5] border border-[#E5E0D8] text-[#111318] text-xs font-mono font-medium">
                  Academic Foundation
                </div>
                <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-[#FAF8F5] border border-[#E5E0D8] text-[#111318] text-xs font-mono font-medium">
                  Practical IT Proficiency
                </div>
                <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-[#FAF8F5] border border-[#E5E0D8] text-[#111318] text-xs font-mono font-medium">
                  Continuous Learning
                </div>
              </div>
            </div>

            {/* Professional Overview Details Panel: Clean header */}
            <div className="flex flex-col gap-4 p-6 sm:p-8 rounded-[28px] bg-white border border-[#E8E5DF] shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
              <h3 className="text-[18px] font-bold text-[#111318] flex items-center justify-between">
                <span>Professional Overview</span>
                <span className="font-mono text-xs text-[#FF6900] font-bold">Verified</span>
              </h3>


              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EAE6DF]">
                  <span className="font-mono text-[11px] text-[#717684] uppercase">
                    Current Academic Track
                  </span>
                  <span className="text-[14px] text-[#111318] font-semibold mt-0.5">
                   B.A
                  </span>
                 
                </div>

                <div className="flex flex-col p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EAE6DF]">
                  <span className="font-mono text-[11px] text-[#717684] uppercase">
                    Technical Certification
                  </span>
                  <span className="text-[14px] text-[#111318] font-semibold mt-0.5">
                    6-Month IT Diploma
                  </span>
                  <span className="text-[12px] text-[#5A606D]">
                    Office, Systems &amp; Media Fundamentals
                  </span>
                </div>

                <div className="flex flex-col p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EAE6DF]">
                  <span className="font-mono text-[11px] text-[#717684] uppercase">
                    Base Location
                  </span>
                  <span className="text-[14px] text-[#111318] font-semibold mt-0.5">
                    Rawalpindi, Punjab, Pakistan
                  </span>
                  <span className="text-[12px] text-[#5A606D]">
                    Available for In-Office &amp; Remote
                  </span>
                </div>

                <div className="flex flex-col p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EAE6DF]">
                  <span className="font-mono text-[11px] text-[#717684] uppercase">
                    Primary Objective
                  </span>
                  <span className="text-[13px] text-[#111318] font-semibold mt-0.5 leading-snug">
                    
Video Editor • Graphic Designer • Content Creator

                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
