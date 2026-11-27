import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  Mail,
  Award,
  MessageSquare,
  Settings,
  LogOut,
  ArrowLeft,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  AlertCircle,
  ShieldAlert,
  Search,
  Phone,
  Send,
  Eye,
  Heart,
  Star,
  RefreshCw,
  UploadCloud,
  X,
  Lock,
  Sparkles,
  Layers,
} from 'lucide-react';
import { Project, Inquiry, Testimonial, SkillItem, PortfolioStats, ExpertiseItem } from '../types';
import {
  auth,
  db,
  User,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  updatePassword,
  checkIsUserAdmin,
  ensureAdminRecord,
  seedFirestoreDatabase,
  fetchAdminList,
  addAdminUser,
  removeAdminUser,
  AdminUserRecord,
} from '../lib/firebase';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { SKILL_ICON_OPTIONS, APP_LOGO_OPTIONS, SkillIcon } from './SkillIcon';
import { getDefaultSkillIcon, SkillCategory, SkillIconKey } from '../utils/portfolio-logic';
import { ExpertiseDetailModal } from './ExpertiseDetailModal';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  inquiries: Inquiry[];
  testimonials: Testimonial[];
  skills: SkillItem[];
  expertise?: ExpertiseItem[];
  stats: PortfolioStats | null;
  onRefreshData: () => Promise<void>;
  onAddProject: (project: any) => Promise<void>;
  onUpdateProject?: (id: string | number, data: any) => Promise<void>;
  onDeleteProject?: (id: string | number) => Promise<void>;
  onUpdateInquiryStatus: (id: string | number, status: string) => Promise<void>;
  onDeleteInquiry: (id: string | number) => Promise<void>;
  onAddSkill: (skill: Omit<SkillItem, 'id'>) => Promise<void>;
  onUpdateSkill: (id: string | number, skill: Partial<SkillItem>) => Promise<void>;
  onDeleteSkill: (id: string | number) => Promise<void>;
  onAddExpertise?: (item: Omit<ExpertiseItem, 'id'>) => Promise<void>;
  onUpdateExpertise?: (id: string | number, item: Partial<ExpertiseItem>) => Promise<void>;
  onDeleteExpertise?: (id: string | number) => Promise<void>;
  onAddTestimonial: (t: Omit<Testimonial, 'id'>) => Promise<void>;
  onDeleteTestimonial: (id: string | number) => Promise<void>;
}


const softwareGroups = [
  {
    title: '01 — Video Editing',
    keywords: ['premiere', 'capcut'],
  },
  {
    title: '02 — Graphic Design',
    keywords: ['canva', 'photoshop', 'illustrator'],
  },
  {
    title: '03 — MS Office',
    keywords: ['word', 'excel', 'powerpoint'],
  },
  {
    title: '04 — AI Tools',
    keywords: ['chatgpt'],
  },
  {
    title: '05 — IT & Hardware',
    keywords: ['windows', 'hardware'],
  },
];

export const AdminPortal: React.FC<AdminPortalProps> = ({
  isOpen,
  onClose,
  projects,
  inquiries,
  testimonials,
  skills,
  expertise = [],
  stats,
  onRefreshData,
  onAddProject,
  onUpdateProject,
  onDeleteProject,
  onUpdateInquiryStatus,
  onDeleteInquiry,
  onAddSkill,
  onUpdateSkill,
  onDeleteSkill,
  onAddExpertise,
  onUpdateExpertise,
  onDeleteExpertise,
  onAddTestimonial,
  onDeleteTestimonial,
}) => {
  // Active screen with localStorage persistence across reloads
  const [activeScreen, setActiveScreen] = useState<
    'overview' | 'projects' | 'inquiries' | 'expertise' | 'skills' | 'testimonials' | 'settings'
  >(() => {
    try {
      const saved = localStorage.getItem('studio_admin_active_screen');
      if (
        saved &&
        ['overview', 'projects', 'inquiries', 'expertise', 'skills', 'testimonials', 'settings'].includes(saved)
      ) {
        return saved as any;
      }
    } catch {}
    return 'overview';
  });

  useEffect(() => {
    try {
      localStorage.setItem('studio_admin_active_screen', activeScreen);
    } catch {}
  }, [activeScreen]);

  // RBAC State
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);

  // Login Form State (Strictly Sign In - Registration from outside disabled)
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Settings State
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [adminList, setAdminList] = useState<AdminUserRecord[]>([]);
  const [adminListLoading, setAdminListLoading] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);

  // Project Modal State
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | number | null>(null);
  const [projectForm, setProjectForm] = useState({
    title: '',
    client_or_brand: '',
    category: 'branding' as any,
    media_type: 'image' as any,
    media_url: '',
    description: '',
    aspect_ratio: '1:1' as any,
    tags: 'Branding, Creative',
    featured: false,
    sort_order: 1,
  });

  // Skill Modal State
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [editingSkillId, setEditingSkillId] = useState<string | number | null>(null);
  const [skillError, setSkillError] = useState<string | null>(null);
  const [skillSaving, setSkillSaving] = useState(false);
  const [skillForm, setSkillForm] = useState<{
    name: string;
    category: SkillCategory;
    proficiency: number;
    focus: string;
    icon: SkillIconKey;
    details: string;
  }>({
    name: '',
    category: 'design',
    proficiency: 90,
    focus: '',
    icon: 'palette',
    details: '',
  });

  // Expertise Modal State
  const [isExpertiseModalOpen, setIsExpertiseModalOpen] = useState(false);
  const [editingExpertiseId, setEditingExpertiseId] = useState<string | number | null>(null);
  const [expertiseError, setExpertiseError] = useState<string | null>(null);
  const [expertiseSaving, setExpertiseSaving] = useState(false);
  const [previewingExpertise, setPreviewingExpertise] = useState<ExpertiseItem | null>(null);
  const [expertiseForm, setExpertiseForm] = useState<{
    num: string;
    title: string;
    category: ExpertiseItem['category'];
    icon: string;
    summary: string;
    details: string;
    tags: string;
    tools: string;
    coursework: string;
    deliverables: string;
    sort_order: number;
  }>({
    num: '01',
    title: '',
    category: 'office',
    icon: 'file-text',
    summary: '',
    details: '',
    tags: '',
    tools: '',
    coursework: '',
    deliverables: '',
    sort_order: 1,
  });


  // Testimonial Modal State
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [testimonialForm, setTestimonialForm] = useState({
    author: '',
    role: '',
    company: '',
    quote: '',
    rating: 5,
  });

  // Filters
  const [projectCategoryFilter, setProjectCategoryFilter] = useState('all');
  const [projectSearch, setProjectSearch] = useState('');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState('all');

  // Verify RBAC on auth change
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      setCheckingAuth(true);
      if (user) {
        const adminCheck = await checkIsUserAdmin(user);
        setIsAdmin(adminCheck);
      } else {
        setIsAdmin(false);
      }
      setCheckingAuth(false);
    });
    return () => unsub();
  }, []);


  // Load administrators list
  const loadAdmins = async () => {
    setAdminListLoading(true);
    try {
      const list = await fetchAdminList();
      setAdminList(list);
    } catch (e) {
      console.error('Failed to load admins:', e);
    } finally {
      setAdminListLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && isAdmin) {
      loadAdmins();
    }
  }, [isOpen, isAdmin, activeScreen]);

  if (!isOpen) return null;

  // Handle Administrator Login (Sign in only - creation only allowed from dashboard or Firestore)
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    try {
      const cred = await signInWithEmailAndPassword(auth, loginEmail.trim(), loginPassword);
      const check = await checkIsUserAdmin(cred.user);
      if (!check) {
        await signOut(auth);
        setIsAdmin(false);
        setAuthError(
          'Access Denied: Your account does not have administrator privileges. New administrators must be added through the Studio Admin Portal by an existing administrator.'
        );
      } else {
        setIsAdmin(true);
        setAuthError(null);
        setLoginEmail('');
        setLoginPassword('');
      }
    } catch (err: any) {
      console.error(err);
      let msg = err.message || 'Authentication failed';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        msg = 'Invalid email address or password.';
      } else if (err.code === 'auth/too-many-requests') {
        msg = 'Too many failed login attempts. Please wait a few moments and try again.';
      }
      setAuthError(msg);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      localStorage.removeItem('studio_admin_active_screen');
    } catch {}
    await signOut(auth);
    setIsAdmin(false);
  };

  // Cloud Sync Handler
  const handleCloudSync = async () => {
    setSyncLoading(true);
    try {
      const res = await seedFirestoreDatabase();
      setSettingsMessage({
        type: 'success',
        text: `Synced ${res?.projectsCount || 0} projects, ${res?.skillsCount || 0} skills, and ${res?.testimonialsCount || 0} testimonials into Firestore.`,
      });
      await onRefreshData();
    } catch (err: any) {
      setSettingsMessage({ type: 'error', text: `Sync failed: ${err.message}` });
    } finally {
      setSyncLoading(false);
    }
  };

  // Settings Actions
  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !newEmail.trim()) return;
    setSettingsLoading(true);
    setSettingsMessage(null);

    try {
      await updateEmail(currentUser, newEmail.trim());
      await ensureAdminRecord(currentUser.uid, newEmail.trim());
      setSettingsMessage({ type: 'success', text: `Email updated to ${newEmail.trim()}` });
      setNewEmail('');
    } catch (err: any) {
      setSettingsMessage({
        type: 'error',
        text: err.message || 'Failed to update email. You may need to re-authenticate first.',
      });
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !newPassword.trim()) return;
    setSettingsLoading(true);
    setSettingsMessage(null);

    try {
      await updatePassword(currentUser, newPassword.trim());
      setSettingsMessage({ type: 'success', text: 'Admin password updated successfully.' });
      setNewPassword('');
    } catch (err: any) {
      setSettingsMessage({ type: 'error', text: err.message || 'Failed to update password.' });
    } finally {
      setSettingsLoading(false);
    }
  };


  const handleAddAdminEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail.trim() || !newAdminEmail.includes('@')) {
      setSettingsMessage({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }
    setSettingsLoading(true);
    setSettingsMessage(null);

    try {
      await addAdminUser(newAdminEmail.trim(), currentUser?.email || 'admin');
      setSettingsMessage({
        type: 'success',
        text: `Success! Granted admin role to ${newAdminEmail.trim()}. They can now sign in to the studio after holding the logo for 10 seconds.`,
      });
      setNewAdminEmail('');
      await loadAdmins();
    } catch (err: any) {
      setSettingsMessage({ type: 'error', text: err?.message || 'Failed to grant admin role.' });
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleRevokeAdmin = async (admin: AdminUserRecord) => {
    const isSelf = admin.email.toLowerCase() === currentUser?.email?.toLowerCase();
    const promptMsg = isSelf
      ? `Are you sure you want to remove your OWN admin access (${admin.email})? You will be signed out immediately.`
      : `Are you sure you want to remove ${admin.email} from administrators?`;

    if (!window.confirm(promptMsg)) {
      return;
    }
    setSettingsLoading(true);
    try {
      await removeAdminUser(admin.id || admin.email);
      setSettingsMessage({
        type: 'success',
        text: `Successfully removed ${admin.email} from administrators.`,
      });
      await loadAdmins();
      if (isSelf) {
        await handleSignOut();
      }
    } catch (err: any) {
      setSettingsMessage({ type: 'error', text: err?.message || 'Failed to remove admin.' });
    } finally {
      setSettingsLoading(false);
    }
  };

  // Project Modal Actions
  const openNewProjectModal = () => {
    setEditingProjectId(null);
    setProjectForm({
      title: '',
      client_or_brand: '',
      category: 'branding',
      media_type: 'image',
      media_url: '',
      description: '',
      aspect_ratio: '1:1',
      tags: 'Branding, Creative',
      featured: false,
      sort_order: projects.length + 1,
    });
    setIsProjectModalOpen(true);
  };

  const openEditProjectModal = (p: Project) => {
    setEditingProjectId(p.id);
    setProjectForm({
      title: p.title,
      client_or_brand: p.client_or_brand,
      category: p.category,
      media_type: p.media_type,
      media_url: p.media_url,
      description: p.description,
      aspect_ratio: p.aspect_ratio,
      tags: p.tags.join(', '),
      featured: p.featured,
      sort_order: p.sort_order || 1,
    });
    setIsProjectModalOpen(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...projectForm,
      tags: projectForm.tags.split(',').map((t) => t.trim()).filter(Boolean),
    };

    if (editingProjectId) {
      if (onUpdateProject) {
        await onUpdateProject(editingProjectId, payload);
      } else {
        await updateDoc(doc(db, 'projects', String(editingProjectId)), payload);
      }
    } else {
      await onAddProject(payload);
    }

    setIsProjectModalOpen(false);
    await onRefreshData();
  };

  // Skill Modal Actions
  const openNewSkillModal = () => {
    setEditingSkillId(null);
    setSkillError(null);
    setSkillForm({
      name: '',
      category: 'design',
      proficiency: 90,
      focus: '',
      icon: 'palette',
      details: '',
    });
    setIsSkillModalOpen(true);
  };

  const openEditSkillModal = (s: SkillItem) => {
    setEditingSkillId(s.id);
    setSkillError(null);
    setSkillForm({
      name: s.name,
      category: s.category,
      proficiency: s.proficiency,
      focus: s.focus || '',
      icon: (s.icon as SkillIconKey) || getDefaultSkillIcon(s.category),
      details: s.details || '',
    });
    setIsSkillModalOpen(true);
  };

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    setSkillError(null);
    setSkillSaving(true);
    try {
      if (editingSkillId) {
        await onUpdateSkill(editingSkillId, skillForm);
      } else {
        await onAddSkill(skillForm);
      }
      setIsSkillModalOpen(false);
    } catch (err: any) {
      setSkillError(err?.message || 'Unable to save skill.');
    } finally {
      setSkillSaving(false);
    }
  };

  // Expertise Modal Actions
  const openNewExpertiseModal = () => {
    setEditingExpertiseId(null);
    setExpertiseError(null);
    const nextNum = expertise.length + 1;
    setExpertiseForm({
      num: nextNum < 10 ? `0${nextNum}` : `${nextNum}`,
      title: '',
      category: 'design',
      icon: 'palette',
      summary: '',
      details: '',
      tags: 'Canva Pro, Photoshop, Branding',
      tools: 'canva, photoshop',
      coursework: 'Completed during 6-Month IT Diploma course with practical assignments.',
      deliverables: 'Brand Identity Kits\nSocial Media Carousels\nTri-Fold Brochures',
      sort_order: nextNum,
    });
    setIsExpertiseModalOpen(true);
  };

  const openEditExpertiseModal = (item: ExpertiseItem) => {
    setEditingExpertiseId(item.id);
    setExpertiseError(null);
    setExpertiseForm({
      num: item.num || '',
      title: item.title,
      category: item.category,
      icon: item.icon || 'file-text',
      summary: item.summary,
      details: item.details || '',
      tags: Array.isArray(item.tags) ? item.tags.join(', ') : (item.tags || ''),
      tools: Array.isArray(item.tools) ? item.tools.join(', ') : (item.tools || ''),
      coursework: item.coursework || '',
      deliverables: Array.isArray(item.deliverables) ? item.deliverables.join('\n') : (item.deliverables || ''),
      sort_order: item.sort_order || 1,
    });
    setIsExpertiseModalOpen(true);
  };

  const handleSaveExpertise = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onAddExpertise || !onUpdateExpertise) return;
    setExpertiseError(null);
    setExpertiseSaving(true);
    try {
      const payload: Omit<ExpertiseItem, 'id'> = {
        num: expertiseForm.num.trim(),
        title: expertiseForm.title.trim(),
        category: expertiseForm.category,
        icon: expertiseForm.icon.trim(),
        summary: expertiseForm.summary.trim(),
        details: expertiseForm.details.trim(),
        tags: expertiseForm.tags.split(',').map((s) => s.trim()).filter(Boolean),
        tools: expertiseForm.tools.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean),
        coursework: expertiseForm.coursework.trim(),
        deliverables: expertiseForm.deliverables.split('\n').map((s) => s.trim()).filter(Boolean),
        sort_order: Number(expertiseForm.sort_order) || 1,
      };

      if (editingExpertiseId) {
        await onUpdateExpertise(editingExpertiseId, payload);
      } else {
        await onAddExpertise(payload);
      }
      setIsExpertiseModalOpen(false);
    } catch (err: any) {
      setExpertiseError(err?.message || 'Unable to save expertise domain.');
    } finally {
      setExpertiseSaving(false);
    }
  };


  // Testimonial Modal Actions
  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddTestimonial(testimonialForm);
    setIsTestimonialModalOpen(false);
    setTestimonialForm({ author: '', role: '', company: '', quote: '', rating: 5 });
  };

  // Filtered Projects
  const filteredProjects = projects.filter((p) => {
    const matchesCat = projectCategoryFilter === 'all' || p.category === projectCategoryFilter;
    const matchesSearch =
      projectSearch === '' ||
      p.title.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.client_or_brand.toLowerCase().includes(projectSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Filtered Inquiries
  const filteredInquiries = inquiries.filter((inq) => {
    if (inquiryStatusFilter === 'all') return true;
    return inq.status === inquiryStatusFilter;
  });

  // --- SCREEN: ROLE GATE (UNAUTHENTICATED OR NON-ADMIN) ---
  if (!currentUser || !isAdmin) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2B1421]/75 backdrop-blur-md p-4">
        <div className="w-full max-w-md rounded-3xl border border-rose-200 bg-white p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-700 border border-rose-200">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-[#2B1421]">Admin Control Suite</h3>
                <p className="text-xs text-[#6D475B]">Strict Role-Based Access Protected</p>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close Admin Login"
              className="rounded-lg p-2 text-[#6D475B] hover:bg-rose-50 hover:text-[#2B1421] transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {checkingAuth ? (
            <div className="py-8 text-center text-xs text-[#6D475B]">Verifying studio permissions...</div>
          ) : currentUser && !isAdmin ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-900 space-y-3">
              <div className="flex items-center gap-2 font-bold text-rose-700">
                <ShieldAlert className="h-5 w-5" /> Access Denied (Non-Admin Account)
              </div>
              <p>
                You are signed in as <strong className="text-[#2B1421]">{currentUser.email}</strong>, which does not have administrative privileges for this studio.
              </p>
              <button
                onClick={handleSignOut}
                className="w-full rounded-xl bg-[#2B1421] py-2.5 text-xs font-semibold text-white hover:bg-rose-800 transition-colors"
              >
                Sign Out & Switch Account
              </button>
            </div>
          ) : (
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div className="rounded-xl bg-[#FDF2F6] p-3 border border-rose-200 text-center">
                <div className="text-xs font-bold text-[#2B1421]">Administrator Sign In</div>
                <div className="text-[11px] text-[#5C3A4D] mt-0.5">
                  Strict Role-Based Access: Enter authorized credentials to manage the portfolio.
                </div>
              </div>

              {authError && (
                <div className="rounded-xl border border-rose-300 bg-rose-50 p-3 text-xs text-rose-800 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#3E1D2F] mb-1">
                    Administrator Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="munazza.00077@gmail.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full rounded-xl border border-rose-200 bg-[#FFF9FB] p-2.5 text-xs text-[#2B1421] focus:border-rose-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3E1D2F] mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full rounded-xl border border-rose-200 bg-[#FFF9FB] p-2.5 text-xs text-[#2B1421] focus:border-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 py-3 text-xs font-bold text-white hover:from-rose-700 hover:to-pink-700 transition-colors shadow-lg shadow-rose-500/20 disabled:opacity-50 cursor-pointer"
              >
                {authLoading ? 'Verifying Credentials...' : 'Sign In to Admin Portal'}
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs text-[#6D475B] hover:text-rose-700 transition-colors cursor-pointer"
                >
                  ← Return to Portfolio Website
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  const navItems: {
    id: typeof activeScreen;
    label: string;
    Icon: React.ComponentType<{ className?: string }>;
    badge?: number;
    highlightBadge?: boolean;
  }[] = [
    { id: 'overview', label: 'Overview Dashboard', Icon: LayoutDashboard },
    { id: 'projects', label: 'Projects & Reels', Icon: FolderKanban, badge: projects.length },
    { id: 'expertise', label: 'Skills & Expertise', Icon: Sparkles, badge: expertise.length },
    { id: 'skills', label: 'Software Stack', Icon: Award, badge: skills.length },
    {
      id: 'inquiries',
      label: 'Hiring & Inquiries',
      Icon: Mail,
      badge: inquiries.length,
      highlightBadge: inquiries.filter((i) => i.status === 'new').length > 0,
    },
    { id: 'testimonials', label: 'Client Endorsements', Icon: MessageSquare, badge: testimonials.length },
    { id: 'settings', label: 'Security & Settings', Icon: Settings },
  ];


  // --- FULL-SCREEN DEDICATED ADMIN PORTAL ---
  return (
    <div className="fixed inset-0 z-50 flex bg-[#FDF2F6] text-[#2B1421] overflow-hidden font-sans">
      {/* DEEP PLUM VELVET SIDEBAR NAVIGATION */}
      <aside className="hidden md:flex w-64 border-r border-rose-900/20 bg-[#2B1421] text-rose-100 flex-col justify-between shrink-0">
        <div>
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 font-display font-black text-white text-sm shadow-md">
                MI
              </div>
              <div>
                <h2 className="font-display text-sm font-bold text-white tracking-wide">ADMIN PORTAL</h2>
                <p className="text-[10px] text-rose-300 font-mono">Role: Super Admin</p>
              </div>
            </div>
          </div>

          <nav className="p-3 space-y-1">
            {navItems.map(({ id, label, Icon, badge, highlightBadge }) => {
              const active = activeScreen === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveScreen(id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md shadow-rose-950/30'
                      : 'text-rose-200/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                  </div>
                  {badge !== undefined && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] tabular-nums font-bold ${
                        active
                          ? 'bg-white/20 text-white'
                          : highlightBadge
                          ? 'bg-rose-500 text-white'
                          : 'bg-white/10 text-rose-200'
                      }`}
                    >
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Footer Profile & Return Button */}
        <div className="p-4 border-t border-white/10 bg-black/20 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="truncate pr-2">
              <p className="font-bold text-white truncate">{currentUser?.email || 'Administrator'}</p>
              <span className="text-[10px] text-emerald-300 font-mono">RBAC Verified</span>
            </div>
            <button
              onClick={handleSignOut}
              title="Sign Out"
              className="p-1.5 text-rose-200 hover:text-rose-400 hover:bg-white/10 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/10 py-2 text-xs font-semibold text-white hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Website
          </button>
        </div>
      </aside>

      {/* MAIN SCREEN AREA */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#FDF2F6]">
        {/* Top Bar Header */}
        <header className="min-h-16 border-b border-rose-200/80 bg-white px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="md:hidden rounded-lg border border-rose-200 p-1.5 text-[#4A2538] hover:bg-rose-50"
              aria-label="Back to website"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <h1 className="font-display text-base font-bold text-[#2B1421]">
              {activeScreen === 'overview' && 'Studio Analytics & System Overview'}
              {activeScreen === 'projects' && 'Projects & Video Reels Catalog'}
              {activeScreen === 'expertise' && 'Skills & Expertise Domains (Competencies)'}
              {activeScreen === 'skills' && 'Skills, Icons & Qualification Details'}
              {activeScreen === 'inquiries' && 'Client Inquiries & Hiring Proposals'}
              {activeScreen === 'testimonials' && 'Client Testimonials & Feedback'}
              {activeScreen === 'settings' && 'Admin Credentials & Cloud Configuration'}
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onRefreshData}
              className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-[#FFF9FB] px-3 py-1.5 text-xs font-semibold text-[#4A2538] hover:border-rose-400 hover:text-rose-800 transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5 text-rose-600" /> Refresh
            </button>

            {activeScreen === 'projects' && (
              <button
                onClick={openNewProjectModal}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 px-3.5 py-1.5 text-xs font-bold text-white hover:from-rose-700 hover:to-pink-700 transition-colors shadow-sm cursor-pointer"
              >
                <Plus className="h-4 w-4" /> Add Project
              </button>
            )}

            {activeScreen === 'expertise' && (
              <button
                onClick={openNewExpertiseModal}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 px-3.5 py-1.5 text-xs font-bold text-white hover:from-rose-700 hover:to-pink-700 transition-colors shadow-sm cursor-pointer"
              >
                <Plus className="h-4 w-4" /> Add Expertise
              </button>
            )}

            {activeScreen === 'skills' && (
              <button
                onClick={openNewSkillModal}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 px-3.5 py-1.5 text-xs font-bold text-white hover:from-rose-700 hover:to-pink-700 transition-colors shadow-sm cursor-pointer"
              >
                <Plus className="h-4 w-4" /> Add Skill
              </button>
            )}


            {activeScreen === 'testimonials' && (
              <button
                onClick={() => setIsTestimonialModalOpen(true)}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 px-3.5 py-1.5 text-xs font-bold text-white hover:from-rose-700 hover:to-pink-700 transition-colors shadow-sm"
              >
                <Plus className="h-4 w-4" /> Add Endorsement
              </button>
            )}
          </div>
        </header>

        {/* Mobile Nav Strip */}
        <div className="md:hidden flex items-center gap-1.5 overflow-x-auto border-b border-rose-200 bg-white px-4 py-2 shrink-0">
          {navItems.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveScreen(id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap ${
                activeScreen === id ? 'bg-rose-600 text-white' : 'bg-rose-50 text-[#5C3A4D]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Dynamic Screen Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-8">
          {/* SCREEN 1: OVERVIEW */}
          {activeScreen === 'overview' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-2xl border border-rose-200/80 bg-white p-5 space-y-1 shadow-2xs">
                  <div className="flex items-center justify-between text-[#6D475B] text-xs">
                    <span>Total Portfolio Works</span>
                    <FolderKanban className="h-4 w-4 text-rose-600" />
                  </div>
                  <p className="font-display text-3xl font-black text-[#2B1421] tabular-nums">{projects.length}</p>
                  <p className="text-[11px] text-[#7E576B]">
                    {projects.filter((p) => p.media_type === 'video').length} Video Reels ·{' '}
                    {projects.filter((p) => p.media_type === 'image').length} Graphics
                  </p>
                </div>

                <div className="rounded-2xl border border-rose-200/80 bg-white p-5 space-y-1 shadow-2xs">
                  <div className="flex items-center justify-between text-[#6D475B] text-xs">
                    <span>Hiring Inquiries</span>
                    <Mail className="h-4 w-4 text-rose-600" />
                  </div>
                  <p className="font-display text-3xl font-black text-[#2B1421] tabular-nums">{inquiries.length}</p>
                  <p className="text-[11px] text-emerald-700 font-semibold">
                    {inquiries.filter((i) => i.status === 'new').length} New Unread Proposals
                  </p>
                </div>

                <div className="rounded-2xl border border-rose-200/80 bg-white p-5 space-y-1 shadow-2xs">
                  <div className="flex items-center justify-between text-[#6D475B] text-xs">
                    <span>Total Visitor Views</span>
                    <Eye className="h-4 w-4 text-fuchsia-600" />
                  </div>
                  <p className="font-display text-3xl font-black text-[#2B1421] tabular-nums">
                    {stats?.totalViews || projects.reduce((acc, p) => acc + (p.views_count || 0), 0)}
                  </p>
                  <p className="text-[11px] text-[#7E576B]">Across all catalog items</p>
                </div>

                <div className="rounded-2xl border border-rose-200/80 bg-white p-5 space-y-1 shadow-2xs">
                  <div className="flex items-center justify-between text-[#6D475B] text-xs">
                    <span>Skills Configured</span>
                    <Award className="h-4 w-4 text-rose-600" />
                  </div>
                  <p className="font-display text-3xl font-black text-[#2B1421] tabular-nums">{skills.length}</p>
                  <p className="text-[11px] text-[#7E576B]">Icons & workflow details synced</p>
                </div>
              </div>

              {/* Firebase Cloud Connection Status */}
              <div className="rounded-2xl border border-rose-200/80 bg-white p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <h3 className="font-display text-sm font-bold text-[#2B1421]">Firestore Cloud Database Active</h3>
                  </div>
                  <p className="text-xs text-[#6D475B] font-mono break-all">
                    Project: <span className="text-rose-700 font-semibold">planning-with-ai-e65df</span> · DB:{' '}
                    <span className="text-fuchsia-700">ai-studio-munazzairfanport-11e7cd67-bba5-4278-9191-897f0c61797a</span>
                  </p>
                </div>
                <button
                  onClick={handleCloudSync}
                  disabled={syncLoading}
                  className="flex items-center gap-2 rounded-xl border border-rose-200 bg-[#FFF9FB] px-4 py-2 text-xs font-semibold text-[#3E1D2F] hover:border-rose-400 hover:bg-rose-50 transition-colors disabled:opacity-50 shrink-0"
                >
                  <UploadCloud className="h-4 w-4 text-rose-600" />
                  {syncLoading ? 'Syncing...' : 'Sync All Collections with Firestore'}
                </button>
              </div>

              {/* Recent Inquiries Preview */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#2B1421] uppercase tracking-wider">Latest Hiring Leads</h3>
                  <button
                    onClick={() => setActiveScreen('inquiries')}
                    className="text-xs text-rose-700 hover:underline font-semibold"
                  >
                    View All Inquiries →
                  </button>
                </div>

                {inquiries.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-rose-300 rounded-2xl bg-white">
                    <Mail className="mx-auto h-8 w-8 text-rose-400 mb-2" />
                    <p className="text-xs text-[#6D475B]">No hiring leads received yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {inquiries.slice(0, 3).map((inq) => (
                      <div
                        key={inq.id}
                        className="p-4 rounded-2xl border border-rose-200/80 bg-white space-y-2 shadow-2xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-[#2B1421]">{inq.name}</span>
                          <span className="rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase bg-rose-100 text-rose-800 border border-rose-200">
                            {inq.status}
                          </span>
                        </div>
                        <p className="text-xs text-rose-700 font-semibold">{inq.service}</p>
                        <p className="text-xs text-[#5C3A4D] line-clamp-2">{inq.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SCREEN 2: PROJECTS & REELS MANAGER */}
          {activeScreen === 'projects' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-rose-200/80">
                <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
                  {['all', 'video', 'branding', 'flyer', 'poster', 'social', 'banner'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setProjectCategoryFilter(cat)}
                      className={`rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap capitalize transition-colors ${
                        projectCategoryFilter === cat
                          ? 'bg-rose-600 text-white'
                          : 'bg-white text-[#5C3A4D] hover:text-rose-800 border border-rose-200'
                      }`}
                    >
                      {cat === 'all' ? `All (${projects.length})` : cat}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-rose-400" />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={projectSearch}
                    onChange={(e) => setProjectSearch(e.target.value)}
                    className="w-full rounded-xl border border-rose-200 bg-white py-1.5 pl-8 pr-3 text-xs text-[#2B1421] placeholder-[#9E7B8E] focus:border-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProjects.map((p) => (
                  <div
                    key={p.id}
                    className="rounded-2xl border border-rose-200/80 bg-white overflow-hidden flex flex-col justify-between hover:border-rose-400 transition-colors shadow-2xs"
                  >
                    <div>
                      <div className="relative aspect-video w-full bg-[#1F0D18] overflow-hidden">
                        {p.media_type === 'video' ? (
                          <video src={p.media_url} className="h-full w-full object-cover" muted />
                        ) : (
                          <img src={p.media_url} alt={p.title} className="h-full w-full object-cover" />
                        )}
                        <span className="absolute top-2 left-2 rounded-md bg-[#2B1421]/80 px-2 py-0.5 text-[10px] font-semibold text-white capitalize backdrop-blur-md">
                          {p.category}
                        </span>
                        {p.featured && (
                          <span className="absolute top-2 right-2 rounded-md bg-rose-600 px-2 py-0.5 text-[10px] font-bold text-white">
                            Featured
                          </span>
                        )}
                      </div>

                      <div className="p-4 space-y-1.5">
                        <span className="text-[10px] uppercase font-bold text-rose-700 tracking-wider">
                          {p.client_or_brand}
                        </span>
                        <h4 className="font-display text-sm font-bold text-[#2B1421] line-clamp-1">{p.title}</h4>
                        <p className="text-xs text-[#5C3A4D] line-clamp-2">{p.description}</p>
                      </div>
                    </div>

                    <div className="p-4 pt-2 border-t border-rose-100 flex items-center justify-between text-xs text-[#6D475B]">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 font-mono text-[11px]">
                          <Heart className="h-3 w-3 text-rose-500" /> {p.likes_count}
                        </span>
                        <span className="flex items-center gap-1 font-mono text-[11px]">
                          <Eye className="h-3 w-3 text-rose-400" /> {p.views_count}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditProjectModal(p)}
                          className="rounded-lg p-1.5 text-[#6D475B] hover:bg-rose-50 hover:text-rose-700 transition-colors"
                          title="Edit Project"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        {onDeleteProject && (
                          <button
                            onClick={() => onDeleteProject(p.id)}
                            className="rounded-lg p-1.5 text-[#6D475B] hover:bg-rose-50 hover:text-rose-600 transition-colors"
                            title="Delete Project"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SCREEN 3: INQUIRIES & HIRING LEADS */}
          {activeScreen === 'inquiries' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-rose-200/80">
                {['all', 'new', 'contacted', 'hired', 'archived'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setInquiryStatusFilter(status)}
                    className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold capitalize transition-colors ${
                      inquiryStatusFilter === status
                        ? 'bg-rose-600 text-white'
                        : 'bg-white text-[#5C3A4D] hover:text-rose-800 border border-rose-200'
                    }`}
                  >
                    {status === 'all' ? `All Leads (${inquiries.length})` : status}
                  </button>
                ))}
              </div>

              {filteredInquiries.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-rose-300 rounded-2xl bg-white">
                  <Mail className="mx-auto h-8 w-8 text-rose-400 mb-2" />
                  <p className="text-sm text-[#2B1421] font-semibold">No inquiries matching filter</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredInquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="p-5 rounded-2xl border border-rose-200/80 bg-white space-y-4 shadow-2xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-display text-base font-bold text-[#2B1421]">{inq.name}</h3>
                            <span
                              className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${
                                inq.status === 'hired'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : inq.status === 'contacted'
                                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                  : inq.status === 'archived'
                                  ? 'bg-rose-50 text-[#7E576B] border border-rose-200'
                                  : 'bg-rose-100 text-rose-800 border border-rose-200'
                              }`}
                            >
                              {inq.status}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 mt-1 text-xs text-[#6D475B]">
                            <span className="text-rose-700 font-semibold">{inq.service}</span>
                            {inq.budget && (
                              <span>
                                Budget: <strong className="text-[#2B1421]">{inq.budget}</strong>
                              </span>
                            )}
                            {inq.timeline && (
                              <span>
                                Timeline: <strong className="text-[#2B1421]">{inq.timeline}</strong>
                              </span>
                            )}
                            <span className="text-[#856275] font-mono text-[11px]">
                              {inq.created_at ? new Date(inq.created_at).toLocaleString() : 'Recent'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <select
                            value={inq.status}
                            onChange={(e) => onUpdateInquiryStatus(inq.id, e.target.value)}
                            className="rounded-xl border border-rose-200 bg-[#FFF9FB] px-3 py-1.5 text-xs text-[#2B1421] focus:border-rose-500 focus:outline-none"
                          >
                            <option value="new">Mark as New</option>
                            <option value="contacted">Mark as Contacted</option>
                            <option value="hired">Mark as Hired</option>
                            <option value="archived">Mark as Archived</option>
                          </select>

                          <button
                            onClick={() => onDeleteInquiry(inq.id)}
                            className="rounded-xl p-2 text-[#6D475B] hover:bg-rose-50 hover:text-rose-600 transition-colors"
                            title="Delete Lead"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="rounded-xl bg-[#FFF9FB] p-4 border border-rose-100 text-xs text-[#4A2538] leading-relaxed">
                        {inq.message}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <a
                          href={`mailto:${inq.email}?subject=Regarding your portfolio inquiry for Munazza Irfan`}
                          className="flex items-center gap-1.5 rounded-lg border border-rose-200 bg-[#FFF9FB] px-3 py-1.5 text-xs font-semibold text-[#3E1D2F] hover:bg-rose-50 hover:text-rose-800 transition-colors"
                        >
                          <Mail className="h-3.5 w-3.5 text-rose-600" /> Email: {inq.email}
                        </a>
                        {inq.phone && (
                          <>
                            <a
                              href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors"
                            >
                              <Send className="h-3.5 w-3.5" /> WhatsApp: {inq.phone}
                            </a>
                            <a
                              href={`tel:${inq.phone}`}
                              className="flex items-center gap-1.5 rounded-lg border border-rose-200 bg-[#FFF9FB] px-3 py-1.5 text-xs font-semibold text-[#3E1D2F] hover:bg-rose-50 transition-colors"
                            >
                              <Phone className="h-3.5 w-3.5 text-rose-600" /> Call
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SCREEN: SKILLS & EXPERTISE (CORE COMPETENCIES & DOMAIN BREAKDOWNS) */}
          {activeScreen === 'expertise' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-rose-200/80">
                <div>
                  <h3 className="text-sm font-bold text-[#2B1421]">Skills &amp; Expertise Domains (Competencies)</h3>
                  <p className="text-xs text-[#6D475B] mt-0.5">
                    Manage core disciplines, tangible client deliverables, software workflows, and detail screens displayed on the portfolio.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openNewExpertiseModal}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:from-rose-700 hover:to-pink-700 transition-all cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add New Expertise Domain</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {expertise.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-5 rounded-2xl border border-rose-200/80 bg-white flex flex-col justify-between gap-4 shadow-2xs hover:border-rose-300 transition-colors"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                            {exp.num || '00'}
                          </span>
                          <span className="rounded-md bg-rose-50 border border-rose-200 px-2 py-0.5 text-[10px] text-rose-700 uppercase font-semibold">
                            {exp.category}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#6D475B] font-mono">
                          {exp.deliverables?.length || 0} Deliverables
                        </span>
                      </div>

                      <div>
                        <h4 className="font-display text-sm font-bold text-[#2B1421]">{exp.title}</h4>
                        <p className="text-xs text-[#5C3A4D] mt-1 leading-relaxed line-clamp-2">
                          {exp.summary}
                        </p>
                      </div>

                      {exp.deliverables && exp.deliverables.length > 0 && (
                        <div className="p-2.5 rounded-xl bg-[#FFF9FB] border border-rose-100 text-[11px] text-[#5C3A4D] space-y-1">
                          <span className="font-semibold text-[#2B1421] block">Key Output Deliverables:</span>
                          <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                            {exp.deliverables.slice(0, 2).map((d, i) => (
                              <li key={i} className="truncate">{d}</li>
                            ))}
                            {exp.deliverables.length > 2 && (
                              <li className="text-rose-600 font-medium">+{exp.deliverables.length - 2} more...</li>
                            )}
                          </ul>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-1">
                        {exp.tags?.slice(0, 3).map((t) => (
                          <span key={t} className="px-2 py-0.5 rounded-md bg-rose-50 text-[10px] font-mono text-rose-700">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-rose-100">
                      <button
                        type="button"
                        onClick={() => setPreviewingExpertise(exp)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview Detail Screen</span>
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEditExpertiseModal(exp)}
                          className="rounded-lg p-2 text-[#6D475B] hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer"
                          title="Edit Expertise"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteExpertise && onDeleteExpertise(exp.id)}
                          className="rounded-lg p-2 text-[#6D475B] hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Delete Expertise"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SCREEN 4: SKILLS & QUALIFICATIONS (WITH OFFICIAL APP LOGOS + DETAILS) */}
          {activeScreen === 'skills' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-rose-200/80">
                <div>
                  <h3 className="text-sm font-bold text-[#2B1421]">Production Stack &amp; Software Mastery</h3>
                  <p className="text-xs text-[#6D475B] mt-0.5">
                    Add, edit, or delete software tools with official app logos — updates dynamically on the live portfolio.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openNewSkillModal}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:from-rose-700 hover:to-pink-700 transition-all cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add New Software Tool</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               
{softwareGroups.map((group) => {
  const groupSkills = skills.filter((s) =>
    group.keywords.some((keyword) =>
      s.name.toLowerCase().includes(keyword)
    )
  );

  if (groupSkills.length === 0) return null;

  return (
    <div key={group.title} className="col-span-full">
      <h3 className="text-lg font-bold text-[#2B1421] mb-4">
        {group.title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {groupSkills.map((s) => (

                  <div
                    key={s.id}
                    data-admin-skill={s.name}
                    className="p-5 rounded-2xl border border-rose-200/80 bg-white flex items-start justify-between gap-4 shadow-2xs hover:border-rose-300 transition-colors"
                  >
                    <div className="flex items-start gap-3.5 flex-1 min-w-0">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl overflow-hidden shadow-xs">
                        <SkillIcon icon={s.icon} name={s.name} category={s.category} className="h-12 w-12" />
                      </div>

                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <h4 className="font-display text-sm font-bold text-[#2B1421] truncate">{s.name}</h4>
                            <span className="rounded-md bg-rose-50 border border-rose-200 px-2 py-0.5 text-[10px] text-rose-700 uppercase font-semibold shrink-0">
                              {s.category}
                            </span>
                          </div>
                       
<span className="text-xs font-semibold text-rose-700 shrink-0">
  {['video', 'design'].includes(s.category?.toLowerCase() || '')
    ? 'Advanced'
    : 'Intermediate'}
</span>
                        </div>

                      
                        <p className="text-xs font-semibold text-rose-700">{s.focus || 'Core Qualification'}</p>
                        {s.details && (
                          <p className="text-xs text-[#5C3A4D] leading-relaxed bg-[#FFF9FB] border border-rose-100 rounded-xl p-2.5">
                            {s.details}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => openEditSkillModal(s)}
                        className="rounded-lg p-2 text-[#6D475B] hover:bg-rose-50 hover:text-rose-700 transition-colors"
                        title="Edit Skill"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDeleteSkill(s.id)}
                        className="rounded-lg p-2 text-[#6D475B] hover:bg-rose-50 hover:text-rose-600 transition-colors"
                        title="Delete Skill"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
    
);
})}
</div>
              </div>
          )}

          {/* SCREEN 5: TESTIMONIALS */}
          {activeScreen === 'testimonials' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-[#2B1421]">Client Recommendations & Quotes</h3>
                <p className="text-xs text-[#6D475B] mt-0.5">
                  Manage quotes from partners, real estate leads, and agency directors.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {testimonials.map((t) => (
                  <div
                    key={t.id}
                    className="p-5 rounded-2xl border border-rose-200/80 bg-white flex flex-col justify-between space-y-4 shadow-2xs"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-display text-sm font-bold text-[#2B1421]">{t.author}</h4>
                          <p className="text-xs text-[#6D475B]">
                            {t.role} · {t.company}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-rose-500">
                          {Array.from({ length: t.rating || 5 }).map((_, i) => (
                            <Star key={i} className="h-3.5 w-3.5 fill-rose-500" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-[#4A2538] italic leading-relaxed">"{t.quote}"</p>
                    </div>

                    <div className="flex justify-end pt-2 border-t border-rose-100">
                      <button
                        onClick={() => onDeleteTestimonial(t.id)}
                        className="rounded-lg p-1.5 text-[#6D475B] hover:bg-rose-50 hover:text-rose-700 transition-colors text-xs flex items-center gap-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete Endorsement
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SCREEN 6: SECURITY & SETTINGS */}
          {activeScreen === 'settings' && (
            <div className="max-w-2xl space-y-6">
              {settingsMessage && (
                <div
                  className={`rounded-2xl p-4 text-xs flex items-center gap-2 border ${
                    settingsMessage.type === 'success'
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                      : 'border-rose-300 bg-rose-50 text-rose-900'
                  }`}
                >
                  {settingsMessage.type === 'success' ? (
                    <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                  )}
                  <span>{settingsMessage.text}</span>
                </div>
              )}

              <div className="rounded-2xl border border-rose-200/80 bg-white p-6 space-y-5 shadow-2xs">
                <div>
                  <h3 className="font-display text-sm font-bold text-[#2B1421]">Current Admin Account</h3>
                  <p className="text-xs text-[#6D475B] mt-0.5">
                    Logged in as: <strong className="text-rose-700 font-mono">{currentUser?.email || 'Administrator'}</strong> (UID: {currentUser?.uid || '—'})
                  </p>
                </div>

                <form onSubmit={handleUpdateEmail} className="space-y-3 pt-3 border-t border-rose-100">
                  <label className="block text-xs font-semibold text-[#3E1D2F]">
                    Change Administrator Email Address
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      required
                      placeholder="newadmin@gmail.com"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="flex-1 rounded-xl border border-rose-200 bg-[#FFF9FB] p-2.5 text-xs text-[#2B1421] focus:border-rose-500 focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={settingsLoading}
                      className="rounded-xl border border-rose-200 bg-[#FFF9FB] px-4 py-2.5 text-xs font-semibold text-[#3E1D2F] hover:bg-rose-50 transition-colors disabled:opacity-50"
                    >
                      Update Email
                    </button>
                  </div>
                </form>

                <form onSubmit={handleUpdatePassword} className="space-y-3 pt-3 border-t border-rose-100">
                  <label className="block text-xs font-semibold text-[#3E1D2F]">
                    Change Administrator Password
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      required
                      minLength={6}
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="flex-1 rounded-xl border border-rose-200 bg-[#FFF9FB] p-2.5 text-xs text-[#2B1421] focus:border-rose-500 focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={settingsLoading}
                      className="rounded-xl border border-rose-200 bg-[#FFF9FB] px-4 py-2.5 text-xs font-semibold text-[#3E1D2F] hover:bg-rose-50 transition-colors disabled:opacity-50"
                    >
                      Update Password
                    </button>
                  </div>
                </form>

                {/* DYNAMIC STUDIO ADMINISTRATOR MANAGEMENT */}
                <div className="pt-5 border-t border-rose-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-display text-sm font-bold text-[#2B1421]">
                        Authorized Studio Administrators
                      </h4>
                      <p className="text-xs text-[#6D475B]">
                        Authorized admins can open this portal by holding the website logo for 10 seconds.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={loadAdmins}
                      disabled={adminListLoading}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-800 transition-colors"
                    >
                      {adminListLoading ? 'Refreshing...' : 'Refresh List'}
                    </button>
                  </div>

                  {/* Add New Admin Email */}
                  <form onSubmit={handleAddAdminEmail} className="space-y-2">
                    <label className="block text-xs font-semibold text-[#3E1D2F]">
                      Grant Role-Based Admin Access to Another Email
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        required
                        placeholder="new-admin@gmail.com"
                        value={newAdminEmail}
                        onChange={(e) => setNewAdminEmail(e.target.value)}
                        className="flex-1 rounded-xl border border-rose-200 bg-[#FFF9FB] p-2.5 text-xs text-[#2B1421] focus:border-rose-500 focus:outline-none"
                      />
                      <button
                        type="submit"
                        disabled={settingsLoading}
                        className="rounded-xl bg-[#111318] hover:bg-[#FF6900] px-4 py-2.5 text-xs font-bold text-white transition-colors disabled:opacity-50 shrink-0"
                      >
                        {settingsLoading ? 'Saving...' : 'Grant Role'}
                      </button>
                    </div>
                  </form>

                  {/* List of Active Administrators */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-[#717684]">
                      <span>Active Studio Administrators ({adminList.length})</span>
                      <span className="text-[11px] font-mono text-[#A89CA2]">Strict RBAC</span>
                    </div>

                    <div className="divide-y divide-rose-100 rounded-xl border border-rose-200 overflow-hidden bg-[#FAF8F5]">
                      {adminList.map((admin) => {
                        const emailStr = (admin.email || '').toLowerCase().trim();
                        const currentEmailStr = (currentUser?.email || '').toLowerCase().trim();
                        const isCurrent = Boolean(emailStr && currentEmailStr && emailStr === currentEmailStr);
                        const isPrimary = emailStr === 'munazza.00077@gmail.com';
                        const initials = (emailStr || 'AD').substring(0, 2).toUpperCase();
                        let dateStr = '';
                        if (admin.created_at) {
                          try {
                            const d = new Date(admin.created_at);
                            if (!isNaN(d.getTime())) {
                              dateStr = '• Added ' + d.toLocaleDateString();
                            }
                          } catch {}
                        }
                        return (
                          <div
                            key={admin.id || admin.email}
                            className="flex items-center justify-between p-3 text-xs bg-white hover:bg-rose-50/40 transition-colors gap-2"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-8 h-8 rounded-full bg-[#111318] text-white flex items-center justify-center font-bold text-xs shrink-0">
                                {initials}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono font-semibold text-[#111318] truncate">
                                    {admin.email || 'Authorized Admin'}
                                  </span>
                                  {isCurrent && (
                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 shrink-0">
                                      You
                                    </span>
                                  )}
                                  {isPrimary && (
                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#FF6900]/10 text-[#FF6900] shrink-0">
                                      Owner
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-[#717684] flex items-center gap-2 mt-0.5">
                                  <span className="capitalize">{admin.role === 'superadmin' ? 'Super Admin' : 'Studio Administrator'}</span>
                                  {dateStr && <span>{dateStr}</span>}
                                </div>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRevokeAdmin(admin)}
                              disabled={settingsLoading}
                              className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-100 hover:border-rose-300 text-xs font-semibold transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                              title={`Remove ${admin.email} from administrators`}
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                              <span>Delete</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* PROJECT MODAL */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2B1421]/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-rose-200 bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-rose-100">
              <h3 className="font-display text-sm font-bold text-[#2B1421]">
                {editingProjectId ? 'Edit Portfolio Project' : 'Publish New Project'}
              </h3>
              <button
                onClick={() => setIsProjectModalOpen(false)}
                className="rounded-lg p-1 text-[#6D475B] hover:text-[#2B1421]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#3E1D2F] mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  className="w-full rounded-xl border border-rose-200 bg-[#FFF9FB] p-2.5 text-[#2B1421] focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#3E1D2F] mb-1">Client / Brand</label>
                  <input
                    type="text"
                    value={projectForm.client_or_brand}
                    onChange={(e) => setProjectForm({ ...projectForm, client_or_brand: e.target.value })}
                    className="w-full rounded-xl border border-rose-200 bg-[#FFF9FB] p-2.5 text-[#2B1421] focus:border-rose-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#3E1D2F] mb-1">Category</label>
                  <select
                    value={projectForm.category}
                    onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value as any })}
                    className="w-full rounded-xl border border-rose-200 bg-[#FFF9FB] p-2.5 text-[#2B1421] focus:border-rose-500 focus:outline-none"
                  >
                    <option value="branding">Logos & Branding</option>
                    <option value="video">Video Reel</option>
                    <option value="flyer">Flyer</option>
                    <option value="poster">Poster</option>
                    <option value="social">Social Media</option>
                    <option value="banner">Website Banner</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#3E1D2F] mb-1">Media Type</label>
                  <select
                    value={projectForm.media_type}
                    onChange={(e) => setProjectForm({ ...projectForm, media_type: e.target.value as any })}
                    className="w-full rounded-xl border border-rose-200 bg-[#FFF9FB] p-2.5 text-[#2B1421] focus:border-rose-500 focus:outline-none"
                  >
                    <option value="image">Image (PNG / JPG)</option>
                    <option value="video">Video (MP4 Reel)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#3E1D2F] mb-1">Aspect Ratio</label>
                  <select
                    value={projectForm.aspect_ratio}
                    onChange={(e) => setProjectForm({ ...projectForm, aspect_ratio: e.target.value as any })}
                    className="w-full rounded-xl border border-rose-200 bg-[#FFF9FB] p-2.5 text-[#2B1421] focus:border-rose-500 focus:outline-none"
                  >
                    <option value="1:1">1:1 Square</option>
                    <option value="16:9">16:9 Landscape</option>
                    <option value="9:16">9:16 Vertical Reel</option>
                    <option value="3:4">3:4 Portrait Poster</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#3E1D2F] mb-1">Media URL / Path *</label>
                <input
                  type="text"
                  required
                  value={projectForm.media_url}
                  onChange={(e) => setProjectForm({ ...projectForm, media_url: e.target.value })}
                  className="w-full rounded-xl border border-rose-200 bg-[#FFF9FB] p-2.5 text-[#2B1421] focus:border-rose-500 focus:outline-none font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#3E1D2F] mb-1">Tags</label>
                <input
                  type="text"
                  value={projectForm.tags}
                  onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value })}
                  className="w-full rounded-xl border border-rose-200 bg-[#FFF9FB] p-2.5 text-[#2B1421] focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#3E1D2F] mb-1">Description</label>
                <textarea
                  rows={3}
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  className="w-full rounded-xl border border-rose-200 bg-[#FFF9FB] p-2.5 text-[#2B1421] focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={projectForm.featured}
                  onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                  className="rounded border-rose-300 text-rose-600 focus:ring-rose-500"
                />
                <label htmlFor="featuredCheck" className="text-[#4A2538]">
                  Featured in Exhibition Highlight
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-rose-100">
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  className="rounded-xl border border-rose-200 bg-white px-4 py-2 font-semibold text-[#6D475B] hover:text-[#2B1421]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 px-5 py-2 font-bold text-white hover:from-rose-700 hover:to-pink-700"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SKILL MODAL WITH APP LOGO PICKER + RICH DETAILS */}
      {isSkillModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2B1421]/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-rose-200 bg-white p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-rose-100">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden shadow-xs">
                  <SkillIcon icon={skillForm.icon} name={skillForm.name} category={skillForm.category} className="h-9 w-9" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-[#2B1421]">
                    {editingSkillId ? 'Edit Software Tool & Logo' : 'Add New Software Tool & Logo'}
                  </h3>
                  <span className="text-[10px] text-[#6D475B]">Dynamic production stack configuration</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSkillModalOpen(false)}
                className="rounded-lg p-1 text-[#6D475B] hover:text-[#2B1421]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {skillError && (
              <div className="rounded-xl border border-rose-300 bg-rose-50 p-3 text-xs text-rose-800 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{skillError}</span>
              </div>
            )}

            <form onSubmit={handleSaveSkill} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#3E1D2F] mb-1">Software / Tool Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Adobe Illustrator"
                    value={skillForm.name}
                    onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                    className="w-full rounded-xl border border-rose-200 bg-[#FFF9FB] p-2.5 text-[#2B1421] focus:border-rose-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#3E1D2F] mb-1">Category</label>
                  <select
                    value={skillForm.category}
                    onChange={(e) => {
                      const nextCat = e.target.value as SkillCategory;
                      setSkillForm({
                        ...skillForm,
                        category: nextCat,
                      });
                    }}
                    className="w-full rounded-xl border border-rose-200 bg-[#FFF9FB] p-2.5 text-[#2B1421] focus:border-rose-500 focus:outline-none"
                  >
                    <option value="design">Graphic Design</option>
                    <option value="video">Short-Form Video Editing</option>
                    <option value="office">MS Office & Operations</option>
                    <option value="it">IT Support & System Basics</option>
                  </select>
                </div>
              </div>

              {/* Official App Logo Picker */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-semibold text-[#3E1D2F]">Select Official App Logo</label>
                  <span className="text-[11px] font-mono text-rose-700">Current: {skillForm.icon}</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 max-h-52 overflow-y-auto p-1.5 border border-rose-100 rounded-xl bg-[#FFF9FB]">
                  {APP_LOGO_OPTIONS.map(({ key, label }) => {
                    const selected = skillForm.icon === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setSkillForm({ ...skillForm, icon: key as any })}
                        className={`flex flex-col items-center justify-center gap-1 rounded-xl border p-2 text-[10px] font-semibold transition-all ${
                          selected
                            ? 'border-rose-600 bg-rose-50 text-rose-900 ring-2 ring-rose-500/25'
                            : 'border-rose-200/80 bg-white text-[#5C3A4D] hover:border-rose-400 hover:bg-rose-50/50'
                        }`}
                      >
                        <SkillIcon icon={key} name={label} className="h-7 w-7" />
                        <span className="truncate max-w-full text-center text-[10px]">{label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Or enter custom icon key or image URL (https://...)"
                    value={skillForm.icon}
                    onChange={(e) => setSkillForm({ ...skillForm, icon: e.target.value as any })}
                    className="flex-1 rounded-xl border border-rose-200 bg-[#FFF9FB] p-2 text-xs text-[#2B1421] focus:border-rose-500 focus:outline-none font-mono"
                  />
                  <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center shrink-0 border border-rose-200 bg-white">
                    <SkillIcon icon={skillForm.icon} name={skillForm.name} className="w-6 h-6" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#3E1D2F] mb-1">
                  Proficiency Level ({skillForm.proficiency}%)
                </label>
                <input
                  type="range"
                  min="40"
                  max="100"
                  value={skillForm.proficiency}
                  onChange={(e) => setSkillForm({ ...skillForm, proficiency: Number(e.target.value) })}
                  className="w-full accent-rose-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#3E1D2F] mb-1">Specialization / Focus Note</label>
                <input
                  type="text"
                  placeholder="e.g. Vector Illustrations & Typography"
                  value={skillForm.focus}
                  onChange={(e) => setSkillForm({ ...skillForm, focus: e.target.value })}
                  className="w-full rounded-xl border border-rose-200 bg-[#FFF9FB] p-2.5 text-[#2B1421] focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#3E1D2F] mb-1">
                  Skill Details & Practical Workflow Description
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe deliverables, tools, techniques, or practical office/design projects done with this skill..."
                  value={skillForm.details}
                  onChange={(e) => setSkillForm({ ...skillForm, details: e.target.value })}
                  className="w-full rounded-xl border border-rose-200 bg-[#FFF9FB] p-2.5 text-[#2B1421] focus:border-rose-500 focus:outline-none leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-rose-100">
                <button
                  type="button"
                  onClick={() => setIsSkillModalOpen(false)}
                  className="rounded-xl border border-rose-200 bg-white px-4 py-2 font-semibold text-[#6D475B] hover:text-[#2B1421]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={skillSaving}
                  className="rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 px-5 py-2 font-bold text-white hover:from-rose-700 hover:to-pink-700 disabled:opacity-50"
                >
                  {skillSaving ? 'Saving...' : 'Save Skill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EXPERTISE DOMAIN MODAL (CORE COMPETENCIES & DETAIL SCREENS) */}
      {isExpertiseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2B1421]/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl rounded-2xl border border-rose-200 bg-white p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-rose-100">
              <div>
                <h3 className="font-display text-sm font-bold text-[#2B1421]">
                  {editingExpertiseId ? 'Edit Skills & Expertise Domain' : 'Add New Expertise Domain'}
                </h3>
                <span className="text-[10px] text-[#6D475B]">
                  Configures the card and rich detail screen displayed on the portfolio
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsExpertiseModalOpen(false)}
                className="rounded-lg p-1 text-[#6D475B] hover:text-[#2B1421]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {expertiseError && (
              <div className="rounded-xl border border-rose-300 bg-rose-50 p-3 text-xs text-rose-800 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{expertiseError}</span>
              </div>
            )}

            <form onSubmit={handleSaveExpertise} className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#3E1D2F] mb-1">Index Code / Num *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 01, 02"
                    value={expertiseForm.num}
                    onChange={(e) => setExpertiseForm({ ...expertiseForm, num: e.target.value })}
                    className="w-full rounded-xl border border-rose-200 bg-[#FFF9FB] p-2.5 text-xs text-[#2B1421] focus:border-rose-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#3E1D2F] mb-1">Category *</label>
                  <select
                    value={expertiseForm.category}
                    onChange={(e) =>
                      setExpertiseForm({ ...expertiseForm, category: e.target.value as ExpertiseItem['category'] })
                    }
                    className="w-full rounded-xl border border-rose-200 bg-[#FFF9FB] p-2.5 text-xs text-[#2B1421] focus:border-rose-500 focus:outline-none"
                  >
                    <option value="office">MS Office &amp; Operations</option>
                    <option value="design">Graphic Design &amp; Branding</option>
                    <option value="video">Video Editing &amp; Motion</option>
                    <option value="it">IT Support &amp; Systems</option>
                    <option value="research">Internet &amp; Academic Research</option>
                    <option value="collaboration">Online Team Collaboration</option>
                    <option value="ai">AI Fundamentals &amp; Automation</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#3E1D2F] mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={expertiseForm.sort_order}
                    onChange={(e) => setExpertiseForm({ ...expertiseForm, sort_order: Number(e.target.value) })}
                    className="w-full rounded-xl border border-rose-200 bg-[#FFF9FB] p-2.5 text-xs text-[#2B1421] focus:border-rose-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#3E1D2F] mb-1">Discipline / Competency Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Graphic Design & Visual Branding"
                  value={expertiseForm.title}
                  onChange={(e) => setExpertiseForm({ ...expertiseForm, title: e.target.value })}
                  className="w-full rounded-xl border border-rose-200 bg-[#FFF9FB] p-2.5 text-xs text-[#2B1421] focus:border-rose-500 focus:outline-none font-semibold"
                />
              </div>

              {/* Icon Key Selector */}
              <div>
                <label className="block font-semibold text-[#3E1D2F] mb-1.5">Category Icon *</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'palette', label: 'Palette (Design)' },
                    { key: 'film', label: 'Film (Video)' },
                    { key: 'file-text', label: 'Document (Office)' },
                    { key: 'cpu', label: 'CPU (IT Systems)' },
                    { key: 'globe', label: 'Globe (Research)' },
                    { key: 'users', label: 'Users (Collab)' },
                    { key: 'brain', label: 'Brain (AI)' },
                  ].map((ic) => (
                    <button
                      key={ic.key}
                      type="button"
                      onClick={() => setExpertiseForm({ ...expertiseForm, icon: ic.key })}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-medium cursor-pointer transition-colors ${
                        expertiseForm.icon === ic.key
                          ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                          : 'bg-white text-[#5C3A4D] border-rose-200 hover:bg-rose-50'
                      }`}
                    >
                      {ic.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#3E1D2F] mb-1">
                  Card Summary Overview (Shown on Portfolio Card) *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Short 2-sentence summary of the discipline..."
                  value={expertiseForm.summary}
                  onChange={(e) => setExpertiseForm({ ...expertiseForm, summary: e.target.value })}
                  className="w-full rounded-xl border border-rose-200 bg-[#FFF9FB] p-2.5 text-xs text-[#2B1421] focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#3E1D2F] mb-1">
                  Scope &amp; Practical Methodology Details (Shown in Detail Screen Modal) *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="In-depth multi-paragraph description of practical techniques, client outcomes, and methodology..."
                  value={expertiseForm.details}
                  onChange={(e) => setExpertiseForm({ ...expertiseForm, details: e.target.value })}
                  className="w-full rounded-xl border border-rose-200 bg-[#FFF9FB] p-2.5 text-xs text-[#2B1421] focus:border-rose-500 focus:outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#3E1D2F] mb-1">
                  Tangible Deliverables &amp; Client Output (One deliverable per line)
                </label>
                <textarea
                  rows={3}
                  placeholder={`Cohesive social media feed carousels and story kits\nHigh-resolution tri-fold brochures and event flyers\nLuxury stationery mockups and vector filigree emblems`}
                  value={expertiseForm.deliverables}
                  onChange={(e) => setExpertiseForm({ ...expertiseForm, deliverables: e.target.value })}
                  className="w-full rounded-xl border border-rose-200 bg-[#FFF9FB] p-2.5 text-xs text-[#2B1421] focus:border-rose-500 focus:outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#3E1D2F] mb-1">
                    Software Stack Used (Comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. canva, photoshop, illustrator"
                    value={expertiseForm.tools}
                    onChange={(e) => setExpertiseForm({ ...expertiseForm, tools: e.target.value })}
                    className="w-full rounded-xl border border-rose-200 bg-[#FFF9FB] p-2.5 text-xs text-[#2B1421] focus:border-rose-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#3E1D2F] mb-1">
                    Capability Tags (Comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Canva Pro, Photoshop, Branding"
                    value={expertiseForm.tags}
                    onChange={(e) => setExpertiseForm({ ...expertiseForm, tags: e.target.value })}
                    className="w-full rounded-xl border border-rose-200 bg-[#FFF9FB] p-2.5 text-xs text-[#2B1421] focus:border-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#3E1D2F] mb-1">
                  Practical Coursework &amp; Academic Training Context
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Certified via 6-Month Intensive IT & Creative Diploma with distinction..."
                  value={expertiseForm.coursework}
                  onChange={(e) => setExpertiseForm({ ...expertiseForm, coursework: e.target.value })}
                  className="w-full rounded-xl border border-rose-200 bg-[#FFF9FB] p-2.5 text-xs text-[#2B1421] focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-rose-100">
                <button
                  type="button"
                  onClick={() => setIsExpertiseModalOpen(false)}
                  className="rounded-xl border border-rose-200 bg-white px-4 py-2 font-semibold text-[#6D475B] hover:text-[#2B1421]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={expertiseSaving}
                  className="rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 px-5 py-2 font-bold text-white hover:from-rose-700 hover:to-pink-700 disabled:opacity-50 cursor-pointer"
                >
                  {expertiseSaving ? 'Saving...' : 'Save Expertise Domain'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL MODAL PREVIEW FOR ADMIN */}
      {previewingExpertise && (
        <ExpertiseDetailModal
          expertise={previewingExpertise}
          onClose={() => setPreviewingExpertise(null)}
        />
      )}

      {/* TESTIMONIAL MODAL */}
      {isTestimonialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2B1421]/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-rose-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-rose-100">
              <h3 className="font-display text-sm font-bold text-[#2B1421]">Add Client Endorsement</h3>
              <button
                onClick={() => setIsTestimonialModalOpen(false)}
                className="rounded-lg p-1 text-[#6D475B] hover:text-[#2B1421]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTestimonial} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#3E1D2F] mb-1">Client / Author Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Khurram Shahzad"
                  value={testimonialForm.author}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, author: e.target.value })}
                  className="w-full rounded-xl border border-rose-200 bg-[#FFF9FB] p-2.5 text-[#2B1421] focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#3E1D2F] mb-1">Designation / Role</label>
                  <input
                    type="text"
                    placeholder="e.g. Marketing Lead"
                    value={testimonialForm.role}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, role: e.target.value })}
                    className="w-full rounded-xl border border-rose-200 bg-[#FFF9FB] p-2.5 text-[#2B1421] focus:border-rose-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#3E1D2F] mb-1">Company / Brand</label>
                  <input
                    type="text"
                    placeholder="e.g. Eastern Housing"
                    value={testimonialForm.company}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, company: e.target.value })}
                    className="w-full rounded-xl border border-rose-200 bg-[#FFF9FB] p-2.5 text-[#2B1421] focus:border-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#3E1D2F] mb-1">Rating</label>
                <select
                  value={testimonialForm.rating}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, rating: Number(e.target.value) })}
                  className="w-full rounded-xl border border-rose-200 bg-[#FFF9FB] p-2.5 text-[#2B1421] focus:border-rose-500 focus:outline-none"
                >
                  <option value={5}>5 Stars (Exceptional)</option>
                  <option value={4}>4 Stars (Very Good)</option>
                  <option value={3}>3 Stars (Good)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#3E1D2F] mb-1">Quote / Feedback *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe your collaborative experience..."
                  value={testimonialForm.quote}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, quote: e.target.value })}
                  className="w-full rounded-xl border border-rose-200 bg-[#FFF9FB] p-2.5 text-[#2B1421] focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-rose-100">
                <button
                  type="button"
                  onClick={() => setIsTestimonialModalOpen(false)}
                  className="rounded-xl border border-rose-200 bg-white px-4 py-2 font-semibold text-[#6D475B] hover:text-[#2B1421]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 px-5 py-2 font-bold text-white hover:from-rose-700 hover:to-pink-700"
                >
                  Save Endorsement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
