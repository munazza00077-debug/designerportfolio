import React from 'react';
import { Play, ArrowUpRight } from 'lucide-react';
import { PortfolioStats, SkillItem } from '../types';


interface HeroProps {
  stats: PortfolioStats | null;
  skills?: SkillItem[];
  onViewCV?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ stats, skills = [], onViewCV }) => {
  const totalSkillsCount = skills.length > 0 ? skills.length : 7;

  return (
    <section
      className="relative z-10 w-full pt-16 sm:pt-24 pb-12 lg:pt-28 lg:pb-16 overflow-hidden bg-[#FAF8F5]"
      id="home"
    >
      {/* =========================================================================
          BACKGROUND LAYER: Category-Related Imagery, Watermark Collage & Radial Glow
         ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
        {/* Warm radial glow spots */}
        <div className="absolute w-[900px] h-[550px] bg-gradient-to-r from-[#FF6900]/12 via-[#FFF2E5]/80 to-[#FF6900]/8 rounded-full blur-[140px] -top-12 left-1/2 -translate-x-1/2" />
        <div className="absolute w-[450px] h-[450px] bg-[#FF6900]/6 rounded-full blur-[110px] top-40 -left-20" />
        <div className="absolute w-[450px] h-[450px] bg-[#3B82F6]/5 rounded-full blur-[110px] top-32 -right-20" />

        {/* Ambient Category Watermark Panels (Softly blended into background) */}
        <div className="absolute inset-0 max-w-[1600px] mx-auto opacity-[0.14] sm:opacity-[0.18] transition-opacity duration-700">
          {/* Top-Left Category: Graphic Design / Filigree Crest */}
          <div className="absolute -left-6 sm:left-4 lg:left-12 top-14 sm:top-20 w-40 sm:w-52 lg:w-64 rounded-2xl overflow-hidden border border-[#E8E5DF] shadow-lg -rotate-12 blur-[0.4px]">
            <img
              src="/assets/aistudio/Logo_12077448.jpg"
              alt="Category Branding"
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5] via-transparent to-transparent" />
          </div>

          {/* Bottom-Left Category: Admissions University Poster */}
          <div className="absolute left-2 sm:left-10 lg:left-20 top-[28rem] sm:top-[30rem] w-36 sm:w-48 lg:w-56 rounded-2xl overflow-hidden border border-[#E8E5DF] shadow-lg rotate-6 blur-[0.4px]">
            <img
              src="/assets/aistudio/Admissions_University_Poster_a1db8ec5.png"
              alt="Category Posters"
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5] via-transparent to-transparent" />
          </div>

          {/* Top-Right Category: Burger Lab Social Media Banner */}
          <div className="absolute -right-6 sm:right-4 lg:right-12 top-16 sm:top-24 w-40 sm:w-52 lg:w-64 rounded-2xl overflow-hidden border border-[#E8E5DF] shadow-lg rotate-12 blur-[0.4px]">
            <img
              src="/assets/aistudio/Burger_Food_Instagram_Post_f75f9144.png"
              alt="Category Social Media"
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5] via-transparent to-transparent" />
          </div>

          {/* Bottom-Right Category: Corporate Web Banner */}
          <div className="absolute right-2 sm:right-10 lg:right-20 top-[29rem] sm:top-[31rem] w-40 sm:w-56 lg:w-64 rounded-2xl overflow-hidden border border-[#E8E5DF] shadow-lg -rotate-6 blur-[0.4px]">
            <img
              src="/assets/aistudio/Website_Banner_53c790d7.png"
              alt="Category IT & Web"
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5] via-transparent to-transparent" />
          </div>
        </div>

        {/* Center Radial Vignette Mask (Ensures high contrast & sharp text readability) */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(250,248,245,0.85)_0%,rgba(250,248,245,0.65)_50%,rgba(250,248,245,0.95)_100%)]" />
      </div>

      {/* =========================================================================
          DESKTOP FLOATING CATEGORY CARDS (Left & Right Flanks on Large Screens)
         ========================================================================= */}
      {/* LEFT FLANK: Graphic Design & Luxury Brand Identity */}
      <div className="hidden xl:block absolute left-4 2xl:left-12 top-24 z-20 pointer-events-auto">
        <div className="flex flex-col gap-6">
          {/* Card 1: Logo & Monogram Crest */}
          <a
            href="#projects"
            className="group block w-56 p-2.5 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E8E5DF] shadow-[0_12px_32px_rgba(17,19,24,0.06)] hover:shadow-[0_16px_40px_rgba(255,105,0,0.12)] -rotate-6 hover:rotate-0 hover:scale-105 transition-all duration-300 animate-float-slow"
          >
            <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#FAF8F5] mb-2 border border-[#EAE6DF]">
              <img
                src="/assets/aistudio/Logo_12077448.jpg"
                alt="Graphic Design & Crest"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-[#111318]/90 text-white font-mono text-[9px] uppercase tracking-wider font-semibold backdrop-blur-xs">
                Design
              </span>

            </div>
            <div className="flex items-center justify-between px-1">
              <div>
                <p className="font-bold text-[12px] text-[#111318] group-hover:text-[#FF6900] transition-colors leading-tight">
                  A Boutique Crest
                </p>
                <p className="text-[10px] text-[#717684]">Luxury Monogram</p>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#717684] group-hover:text-[#FF6900] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
          </a>

          {/* Card 2: Luxury Silk Business Card */}
          <a
            href="#projects"
            className="group block w-52 p-2.5 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E8E5DF] shadow-[0_12px_32px_rgba(17,19,24,0.06)] hover:shadow-[0_16px_40px_rgba(255,105,0,0.12)] rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-300 animate-float-reverse ml-4"
          >
            <div className="relative w-full aspect-16/10 rounded-xl overflow-hidden bg-[#111318] mb-2 border border-[#EAE6DF]">
              <img
                src="/assets/aistudio/Business_card_b53b857b.png"
                alt="Luxury Silk Stationery"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-black/85 text-[#FF6900] font-mono text-[9px] uppercase tracking-wider font-semibold backdrop-blur-xs">
                Branding
              </span>
            </div>
            <div className="flex items-center justify-between px-1">
              <div>
                <p className="font-bold text-[12px] text-[#111318] group-hover:text-[#FF6900] transition-colors leading-tight">
                  Black Silk Card
                </p>
                <p className="text-[10px] text-[#717684]">Brand Stationery</p>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#717684] group-hover:text-[#FF6900] transition-colors" />
            </div>
          </a>
        </div>
      </div>

      {/* RIGHT FLANK: Video Reels & Print Marketing */}
      <div className="hidden xl:block absolute right-4 2xl:right-12 top-24 z-20 pointer-events-auto">
        <div className="flex flex-col gap-6 items-end">
          {/* Card 3: 9:16 Video Drone Reel Preview */}
          <a
            href="#reels"
            className="group block w-56 p-2.5 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E8E5DF] shadow-[0_12px_32px_rgba(17,19,24,0.06)] hover:shadow-[0_16px_40px_rgba(255,105,0,0.12)] rotate-6 hover:rotate-0 hover:scale-105 transition-all duration-300 animate-float-reverse"
          >
            <div className="relative w-full aspect-9/12 rounded-xl overflow-hidden bg-[#111318] mb-2 border border-[#EAE6DF]">
              <video
                src="/assets/aistudio/1_Kanal_Residential_Plot___Housing_Development_bea26688.mp4"
                muted
                autoPlay
                loop
                playsInline
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-[#FF6900] text-white font-mono text-[9px] uppercase tracking-wider font-semibold backdrop-blur-xs">
                9:16 Reel
              </span>

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-xs border border-white/20 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="w-4 h-4 fill-white ml-0.5" />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between px-1">
              <div>
                <p className="font-bold text-[12px] text-[#111318] group-hover:text-[#FF6900] transition-colors leading-tight">
                  Capital Smart City
                </p>
                <p className="text-[10px] text-[#717684]">Drone Reel &bull; 0:28</p>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#717684] group-hover:text-[#FF6900] transition-colors" />
            </div>
          </a>

          {/* Card 4: High-Conversion Tri-Fold Flyer / Poster */}
          <a
            href="#projects"
            className="group block w-52 p-2.5 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E8E5DF] shadow-[0_12px_32px_rgba(17,19,24,0.06)] hover:shadow-[0_16px_40px_rgba(255,105,0,0.12)] -rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-300 animate-float-slow mr-4"
          >
            <div className="relative w-full aspect-16/11 rounded-xl overflow-hidden bg-[#FAF8F5] mb-2 border border-[#EAE6DF]">
              <img
                src="/assets/aistudio/Flyer_9744df9f.png"
                alt="Tri-Fold Flyer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-[#111318]/90 text-white font-mono text-[9px] uppercase tracking-wider font-semibold backdrop-blur-xs">
                Flyers
              </span>
            </div>
            <div className="flex items-center justify-between px-1">
              <div>
                <p className="font-bold text-[12px] text-[#111318] group-hover:text-[#FF6900] transition-colors leading-tight">
                  Digital Agency
                </p>
                <p className="text-[10px] text-[#717684]">Tri-Fold Marketing</p>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#717684] group-hover:text-[#FF6900] transition-colors" />
            </div>
          </a>
        </div>
      </div>

      {/* =========================================================================
          MAIN HERO CONTENT (Centered, Polished & Perfectly Readable)
         ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <div className="flex flex-col items-center justify-center text-center mx-auto max-w-4xl gap-5 sm:gap-6">
          {/* Top Pill Announcement */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#E8E5DF] shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse shrink-0" />
            <span className="font-mono text-[11px] sm:text-[12px] font-semibold text-[#111318]">
              Available for Opportunities
            </span>
            <span className="text-[#D1CBC1]">•</span>
            <span className="text-[11px] sm:text-[12px] text-[#FF6900] font-mono font-semibold shrink-0">
              2026 Portfolio
            </span>
          </div>

          {/* Headline Matching Stitch Reference */}
          <div className="flex flex-col items-center text-center">
            <h1 className="font-extrabold text-[32px] sm:text-[50px] lg:text-[66px] leading-[1.1] sm:leading-[1.08] tracking-[-0.03em] text-[#111318]">
           
Professional Video Editor &amp;{' '}
<span className="italic font-normal font-editorial text-[#111318]">
  Graphic Designer
</span>

<span className="block text-[22px] sm:text-[34px] lg:text-[44px] text-[#FF6900] underline decoration-[#FF6900]/30 underline-offset-4 sm:underline-offset-8 mt-1 leading-tight">

  Creative Content That Makes an Impact.
</span>

            </h1>

            <p className="text-[15px] sm:text-[19px] font-semibold text-[#111318] mt-3 sm:mt-4 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
              <span>Munazza Irfan</span>
              <span className="text-[#D0CAC0]">•</span>
              <span className="text-[#FF6900]">Video Editor</span>
              <span className="text-[#D0CAC0]">•</span>
              <span className="text-[#5A606D]">Graphic Designer</span>
            </p>
          </div>

          {/* Introduction Copy */}
          <p className="text-[14px] sm:text-[17px] leading-relaxed text-[#5A606D] max-w-2xl font-normal mx-auto px-2">
          
I specialize in professional video editing and graphic design, creating engaging reels, short-form videos, promotional content, and branded visuals for businesses and social media. My focus is on clean editing, compelling storytelling, and creative designs that help brands communicate effectively and attract their audience.

          </p>

          {/* Action CTA Group */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3 pt-2 w-full max-w-md mx-auto">
            <a
              className="inline-flex items-center justify-center gap-1.5 px-6 py-3 sm:px-7 sm:py-3.5 rounded-full bg-[#111318] text-white text-[14px] sm:text-[15px] font-semibold hover:bg-[#232730] shadow-md hover:shadow-lg transition-all duration-200"
              href="#contact"
            >
              <span>Contact Me</span>
              <span className="text-xs">↗</span>
            </a>
            <a
              className="inline-flex items-center justify-center px-5 py-3 sm:px-6 sm:py-3.5 rounded-full bg-white hover:bg-[#F5F3EF] text-[#111318] text-[14px] sm:text-[15px] font-semibold border border-[#E2DFD8] shadow-xs transition-all duration-200"
              href="#education"
              onClick={onViewCV}
            >
              <span>Explore Credentials</span>
            </a>
          </div>

          {/* Micro Pill Highlights: Clean Typography Without Clutter Icons */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 pt-1 text-[12px] sm:text-[13px] text-[#5A606D]">
            <span className="px-3 py-1 rounded-full bg-white border border-[#EAE6DF] shadow-xs font-medium">
              MS Office Certified
            </span>
            <span className="px-3 py-1 rounded-full bg-white border border-[#EAE6DF] shadow-xs font-medium">
              Canva &amp; Photoshop
            </span>
            <span className="px-3 py-1 rounded-full bg-white border border-[#EAE6DF] shadow-xs font-medium">
              Prompt &amp; AI Tools
            </span>
            <span className="px-3 py-1 rounded-full bg-white border border-[#EAE6DF] shadow-xs font-medium">
              Rawalpindi, PK
            </span>
          </div>

          {/* Direct Contact Quick Chips */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-2.5 pt-1 w-full max-w-md mx-auto">
            <a
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 rounded-full bg-[#F5F3EF] hover:bg-[#EAE6DF] text-[#111318] text-[12px] sm:text-[13px] font-medium transition-colors"
              href="tel:03129547572"
            >
              <span className="font-mono text-[#717684] text-[11px] mr-1.5">Tel:</span>
              <span className="font-mono font-semibold">03129547572</span>
            </a>
            <a
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 rounded-full bg-[#F5F3EF] hover:bg-[#EAE6DF] text-[#111318] text-[12px] sm:text-[13px] font-medium transition-colors truncate"
              href="mailto:munazza.00077@gmail.com"
            >
              <span className="font-mono text-[#717684] text-[11px] mr-1.5">Email:</span>
              <span className="font-mono font-semibold truncate">munazza.00077@gmail.com</span>
            </a>
          </div>

          {/* =========================================================================
              INTERACTIVE CATEGORY SHOWCASE BAR (Visible on Mobile & Desktop)
             ========================================================================= */}
          <div className="w-full max-w-4xl mx-auto mt-8 sm:mt-10 pt-2 border-t border-[#E8E5DF]/70">
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF6900]" />
                <span className="font-mono text-[11px] sm:text-[12px] uppercase tracking-wider text-[#717684] font-semibold">
                  Core Production Disciplines
                </span>
              </div>
              <a
                href="#projects"
                className="text-[12px] sm:text-[13px] text-[#FF6900] hover:text-[#E05600] font-medium inline-flex items-center gap-1 group transition-colors"
              >
                <span>View Full Archive</span>
                <span className="group-hover:translate-x-0.5 transition-transform">↗</span>
              </a>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5">
              {/* Category 1: Graphic Design */}
              <a
                href="#projects"
                className="group flex flex-col p-2 sm:p-2.5 rounded-2xl bg-white border border-[#E8E5DF] hover:border-[#FF6900]/50 hover:shadow-md transition-all duration-300 text-left overflow-hidden relative"
              >
                <div className="relative w-full aspect-16/10 rounded-xl overflow-hidden bg-[#FAF8F5] mb-2">
                  <img
                    src="/assets/aistudio/Logo_12077448.jpg"
                    alt="Graphic Design"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-[#111318]/90 text-white text-[10px] font-semibold backdrop-blur-xs font-mono">
                    Design
                  </span>
                </div>
                <span className="font-bold text-[13px] sm:text-[14px] text-[#111318] group-hover:text-[#FF6900] transition-colors leading-snug">
                  Graphic Design
                </span>
                <span className="text-[11px] text-[#5A606D] truncate mt-0.5">
                  Logos, Monograms &amp; Kits
                </span>
              </a>

              {/* Category 2: Video Editing */}
              <a
                href="#reels"
                className="group flex flex-col p-2 sm:p-2.5 rounded-2xl bg-white border border-[#E8E5DF] hover:border-[#FF6900]/50 hover:shadow-md transition-all duration-300 text-left overflow-hidden relative"
              >
                <div className="relative w-full aspect-16/10 rounded-xl overflow-hidden bg-[#111318] mb-2">
                  <video
                    src="/assets/aistudio/1_Kanal_Residential_Plot___Housing_Development_bea26688.mp4"
                    muted
                    autoPlay
                    loop
                    playsInline
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-[#FF6900] text-white text-[10px] font-semibold font-mono">
                    6 Reels
                  </span>
                </div>
                <span className="font-bold text-[13px] sm:text-[14px] text-[#111318] group-hover:text-[#FF6900] transition-colors leading-snug">
                  Video Editing
                </span>
                <span className="text-[11px] text-[#5A606D] truncate mt-0.5">
                  9:16 Drone &amp; Kinetic Reels
                </span>
              </a>

              {/* Category 3: Posters & Flyers */}
              <a
                href="#projects"
                className="group flex flex-col p-2 sm:p-2.5 rounded-2xl bg-white border border-[#E8E5DF] hover:border-[#FF6900]/50 hover:shadow-md transition-all duration-300 text-left overflow-hidden relative"
              >
                <div className="relative w-full aspect-16/10 rounded-xl overflow-hidden bg-[#FAF8F5] mb-2">
                  <img
                    src="/assets/aistudio/Flyer_9744df9f.png"
                    alt="Posters & Flyers"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-[#111318]/90 text-white text-[10px] font-semibold backdrop-blur-xs font-mono">
                    Print
                  </span>
                </div>
                <span className="font-bold text-[13px] sm:text-[14px] text-[#111318] group-hover:text-[#FF6900] transition-colors leading-snug">
                  Posters &amp; Flyers
                </span>
                <span className="text-[11px] text-[#5A606D] truncate mt-0.5">
                  Tri-Folds &amp; Social Ads
                </span>
              </a>

              {/* Category 4: MS Office & IT */}
              <a
                href="#skills"
                className="group flex flex-col p-2 sm:p-2.5 rounded-2xl bg-white border border-[#E8E5DF] hover:border-[#FF6900]/50 hover:shadow-md transition-all duration-300 text-left overflow-hidden relative"
              >
                <div className="relative w-full aspect-16/10 rounded-xl overflow-hidden bg-[#FAF8F5] mb-2">
                  <img
                    src="/assets/aistudio/Website_Banner_53c790d7.png"
                    alt="MS Office & IT Operations"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-[#10B981] text-white text-[10px] font-semibold font-mono">
                    Office
                  </span>
                </div>
                <span className="font-bold text-[13px] sm:text-[14px] text-[#111318] group-hover:text-[#FF6900] transition-colors leading-snug">
                  MS Office &amp; IT
                </span>
                <span className="text-[11px] text-[#5A606D] truncate mt-0.5">
                  Word, Excel &amp; Systems
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* =========================================================================
            4 PROFESSIONAL STATISTICS CARDS: Clean Editorial Numbering
           ========================================================================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mt-10 sm:mt-12">
          <div className="flex flex-col p-4 sm:p-6 rounded-2xl bg-white border border-[#E8E5DF] shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:border-[#FF6900]/40 transition-all duration-200">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-[#717684]">
                IT Training
              </span>
              <span className="font-mono text-[11px] text-[#FF6900] font-bold">01</span>
            </div>
            <span className="text-[28px] sm:text-[38px] font-extrabold text-[#111318] leading-none">
              6 Mo
            </span>
            <span className="text-[11px] sm:text-[13px] text-[#5A606D] mt-1.5 sm:mt-2">
              Comprehensive Practical Course
            </span>
          </div>

          <div className="flex flex-col p-4 sm:p-6 rounded-2xl bg-white border border-[#E8E5DF] shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:border-[#FF6900]/40 transition-all duration-200">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-[#717684]">
                Skill Areas
              </span>
              <span className="font-mono text-[11px] text-[#FF6900] font-bold">02</span>
            </div>
            <span className="text-[28px] sm:text-[38px] font-extrabold text-[#FF6900] leading-none">
              {totalSkillsCount}+
            </span>
            <span className="text-[11px] sm:text-[13px] text-[#5A606D] mt-1.5 sm:mt-2">
              Office, Design, IT &amp; Media
            </span>
          </div>

          <div className="flex flex-col p-4 sm:p-6 rounded-2xl bg-white border border-[#E8E5DF] shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:border-[#FF6900]/40 transition-all duration-200">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-[#717684]">
                Academics
              </span>
              <span className="font-mono text-[11px] text-[#FF6900] font-bold">03</span>
            </div>
            <span className="text-[28px] sm:text-[38px] font-extrabold text-[#111318] leading-none">
             B.A
            </span>
            <span className="text-[11px] sm:text-[13px] text-[#5A606D] mt-1.5 sm:mt-2">
              Academic Qualification
            </span>
          </div>

          <div className="flex flex-col p-4 sm:p-6 rounded-2xl bg-white border border-[#E8E5DF] shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:border-[#FF6900]/40 transition-all duration-200">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-[#717684]">
                Languages
              </span>
              <span className="font-mono text-[11px] text-[#FF6900] font-bold">04</span>
            </div>
            <span className="text-[28px] sm:text-[38px] font-extrabold text-[#111318] leading-none">
              02
            </span>
            <span className="text-[11px] sm:text-[13px] text-[#5A606D] mt-1.5 sm:mt-2">
              Urdu (Native) • English (Fluent)
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
