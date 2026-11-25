import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
} from 'lucide-react';
import { SkillItem, ExpertiseItem } from '../types';
import { SkillIcon } from './SkillIcon';
import { SEED_EXPERTISE } from '../lib/firebase';

interface SkillsSectionProps {
  skills?: SkillItem[];
  expertise?: ExpertiseItem[];
  onSelectExpertise?: (item: ExpertiseItem) => void;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  skills = [],
  expertise = [],
  onSelectExpertise,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'design' | 'video' | 'office' | 'it'>('all');
  const [expandedSkillId, setExpandedSkillId] = useState<string | null>(null);

  // Use dynamic expertise from props/state, or fallback to SEED_EXPERTISE
  const activeExpertiseList: ExpertiseItem[] =
    expertise && expertise.length > 0 ? expertise : (SEED_EXPERTISE as any);

  const handleOpenExpertise = (item: ExpertiseItem) => {
    if (onSelectExpertise) {
      onSelectExpertise(item);
    }
  };

  const filteredDynamicSkills = skills.filter((s) => {
    if (selectedFilter === 'all') return true;
    return s.category === selectedFilter;
  });

  return (
    <section className="relative z-10 w-full py-16 lg:py-24 bg-[#F5F3EF]" id="skills">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        {/* =========================================================================
            SECTION 1: SKILLS & EXPERTISE (CORE COMPETENCIES & DOMAIN BREAKDOWNS)
           ========================================================================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div className="flex flex-col gap-2">
            <div className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-white border border-[#E8E5DF] shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6900]" />
              <span className="font-mono text-[11px] uppercase tracking-widest text-[#FF6900] font-bold">
                Core Competencies &amp; Toolset
              </span>
            </div>
            <h2 className="text-[32px] sm:text-[42px] font-extrabold text-[#111318] tracking-tight">
              Skills &amp; Expertise
            </h2>
          </div>
          <p className="text-[14px] sm:text-[15px] text-[#5A606D] max-w-md">
            Click any discipline card below to inspect practical coursework, tangible client deliverables, and software workflows.
          </p>
        </div>

        {/* Dynamic Competency Cards Grid: Clean Editorial Styling (No Clutter Icons) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        
{[...activeExpertiseList]
  .sort((a, b) => (Number(a.sort_order) || 99) - (Number(b.sort_order) || 99))
  .map((card, idx) => {

            const isAiFeatured = card.category === 'ai' || idx === activeExpertiseList.length - 1;
            const cardNum = card.num || (idx < 9 ? `0${idx + 1}` : `${idx + 1}`);

            if (isAiFeatured && activeExpertiseList.length % 3 === 1) {
              // Full-width highlight card for AI Fundamentals or last odd item
              return (
                <div
                  key={card.id || cardNum}
                  onClick={() => handleOpenExpertise(card)}
                  className="lg:col-span-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-7 rounded-[24px] bg-white border-2 border-[#FFE0C2] shadow-sm hover:border-[#FF6900] hover:shadow-md transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold text-[#FF6900] tracking-wider uppercase">
                        {cardNum} &bull; {card.category}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#FFF2E5] text-[#FF6900] font-mono text-[10px] font-bold uppercase">
                        Featured
                      </span>
                    </div>
                    <h3 className="text-[20px] font-bold text-[#111318] group-hover:text-[#FF6900] transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-[14px] text-[#5A606D] leading-relaxed max-w-3xl">
                      {card.summary}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {card.tags?.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#E5E0D8] font-mono text-[11px] font-medium text-[#111318]"
                      >
                        {tag}
                      </span>
                    ))}
                    <div className="w-8 h-8 rounded-full bg-[#FFF2E5] text-[#FF6900] flex items-center justify-center group-hover:translate-x-1 transition-transform ml-1">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={card.id || cardNum}
                onClick={() => handleOpenExpertise(card)}
                className="flex flex-col justify-between p-6 sm:p-7 rounded-[24px] bg-white border border-[#E8E5DF] shadow-xs hover:border-[#FF6900]/50 hover:shadow-md transition-all duration-300 cursor-pointer group"
              >
                <div className="flex flex-col gap-3">
                  {/* Card Header: Category & Number in clean typography */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#FF6900] tracking-wider uppercase">
                      {cardNum} &bull; {card.category}
                    </span>
                    <span className="text-[11px] font-semibold text-[#717684] group-hover:text-[#FF6900] flex items-center gap-0.5 transition-colors">
                      <span>Inspect</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  {/* Title & Summary */}
                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-[19px] sm:text-[20px] font-bold text-[#111318] group-hover:text-[#FF6900] transition-colors leading-snug">
                      {card.title}
                    </h3>
                    <p className="text-[13px] sm:text-[14px] text-[#5A606D] leading-relaxed line-clamp-3">
                      {card.summary}
                    </p>
                  </div>
                </div>

                {/* Footer Deliverable Count & Tags */}
                <div className="pt-4 mt-4 border-t border-[#F0ECE5] flex items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1.5 overflow-hidden">
                    {card.tags?.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 rounded-full bg-[#FAF8F5] border border-[#E5E0D8] font-mono text-[10px] sm:text-[11px] font-medium text-[#111318]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  {card.deliverables && card.deliverables.length > 0 && (
                    <span className="font-mono text-[10px] text-[#717684] shrink-0 font-medium">
                      {card.deliverables.length} deliverables
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* =========================================================================
            SECTION 2: PRODUCTION STACK & SOFTWARE MASTERY (OFFICIAL APP LOGOS)
           ========================================================================= */}
        {skills.length > 0 && (
          <div className="mt-14 pt-10 border-t border-[#E8E5DF]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-[22px] font-bold text-[#111318]">
                  Production Stack &amp; Software Mastery
                </h3>
                <p className="text-[13px] text-[#5A606D] mt-0.5">
                  Interactive toolkit synced dynamically with official app logos — customizable via Admin Panel.
                </p>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'all', label: `All (${skills.length})` },
                  { id: 'design', label: 'Graphic Design' },
                  { id: 'video', label: 'Video Editing' },
                  { id: 'office', label: 'MS Office' },
                  { id: 'it', label: 'IT & AI' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedFilter(tab.id as any)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      selectedFilter === tab.id
                        ? 'bg-[#111318] text-white shadow-xs'
                        : 'bg-white text-[#5A606D] border border-[#E8E5DF] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredDynamicSkills.map((skill) => {
                const isExpanded = expandedSkillId === String(skill.id);
                return (
                  <div
                    key={skill.id}
                    className="p-5 rounded-2xl bg-white border border-[#E8E5DF] shadow-xs flex flex-col justify-between hover:border-[#FF6900]/50 hover:shadow-md transition-all group"
                  >
                    <div>
                      {/* App Logo + Title + Proficiency */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs overflow-hidden group-hover:scale-105 transition-transform">
                          <SkillIcon
                            icon={skill.icon}
                            name={skill.name}
                            category={skill.category}
                            className="w-10 h-10"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="font-bold text-[15px] text-[#111318] truncate">
                              {skill.name}
                            </h4>
                            <span className="text-xs font-semibold text-[#FF6900]">
  {['video', 'design'].includes(skill.category?.toLowerCase() || '')
    ? 'Advanced'
    : 'Intermediate'}
</span>
                           </div>
                          <span className="text-[12px] text-[#717684] block font-medium truncate">
                            {skill.focus || skill.category}
                          </span>
                        </div>
                      </div>
                      {skill.details && isExpanded && (
                        <p className="text-[12px] text-[#5A606D] mt-2.5 leading-relaxed pt-2.5 border-t border-[#F0ECE5]">
                          {skill.details}
                        </p>
                      )}
                    </div>

                    {skill.details && (
                      <button
                        onClick={() => setExpandedSkillId(isExpanded ? null : String(skill.id))}
                        className="mt-3 text-[11px] font-semibold text-[#111318] hover:text-[#FF6900] flex items-center gap-1 self-start transition-colors cursor-pointer"
                      >
                        {isExpanded ? (
                          <>
                            <span>Less details</span>
                            <ChevronUp className="w-3 h-3" />
                          </>
                        ) : (
                          <>
                            <span>Read skill details</span>
                            <ChevronDown className="w-3 h-3" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
