import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type {
  ProjectItem,
  EventItem,
  MediaItem,
  PersonItem,
  AccomplishmentItem,
  AnnouncementItem,
  UserRole,
  UserAccount,
  SiteSettings,
  AuditLogEntry,
  ContentStatus,
  AuditAction,
  AuditTargetType,
  CollageStageSettings,
  SubmissionItem,
} from './types';
import {
  DEFAULT_ROLES,
  DEFAULT_USERS,
  DEFAULT_MEDIA,
  DEFAULT_PROJECTS,
  DEFAULT_EVENTS,
  DEFAULT_PEOPLE,
  DEFAULT_ACCOMPLISHMENTS,
  DEFAULT_ANNOUNCEMENTS,
  DEFAULT_SETTINGS,
  DEFAULT_COLLAGE_SETTINGS,
  DEFAULT_AUDIT_LOGS,
  DEFAULT_SUBMISSIONS,
} from './seedData';
import { supabase, isSupabaseConfigured, type DbProfile } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface CmsContextValue {
  // Entities
  projects: ProjectItem[];
  events: EventItem[];
  submissions: SubmissionItem[];
  mediaItems: MediaItem[];
  people: PersonItem[];
  accomplishments: AccomplishmentItem[];
  announcements: AnnouncementItem[];
  roles: UserRole[];
  users: UserAccount[];
  settings: SiteSettings;
  collageSettings: CollageStageSettings;
  auditLogs: AuditLogEntry[];
  isLoadingData: boolean;
  isBackendConnected: boolean;

  // Current session & auth (authoritative Supabase user and role)
  currentUser: UserAccount | null;
  currentRole: UserRole | null;
  hasPermission: (permission: string) => boolean;

  // Mutations - Collage Art Direction
  updateCollageSettings: (updates: Partial<CollageStageSettings>) => Promise<void>;
  publishCollageChanges: (peopleData: PersonItem[], settingsData?: Partial<CollageStageSettings>) => Promise<void>;

  // Mutations - Projects
  addProject: (project: Omit<ProjectItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProject: (id: string, updates: Partial<ProjectItem>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  setProjectStatus: (id: string, status: ContentStatus) => Promise<void>;

  // Mutations - Events
  addEvent: (event: Omit<EventItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateEvent: (id: string, updates: Partial<EventItem>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  setEventStatus: (id: string, status: ContentStatus) => Promise<void>;

  // Mutations - Submissions
  addSubmission: (submission: Omit<SubmissionItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateSubmission: (id: string, updates: Partial<SubmissionItem>) => Promise<void>;
  deleteSubmission: (id: string) => Promise<void>;
  setSubmissionPublished: (id: string, published: boolean) => Promise<void>;

  // Mutations - Media
  addMedia: (media: Omit<MediaItem, 'id' | 'uploadedAt' | 'uploadedBy'>) => Promise<void>;
  deleteMedia: (id: string) => Promise<void>;

  // Mutations - People
  addPerson: (person: Omit<PersonItem, 'id'>) => Promise<void>;
  updatePerson: (id: string, updates: Partial<PersonItem>) => Promise<void>;
  deletePerson: (id: string) => Promise<void>;
  setPersonStatus: (id: string, status: ContentStatus) => Promise<void>;
  reorderPeople: (reordered: PersonItem[]) => Promise<void>;

  // Mutations - Accomplishments
  addAccomplishment: (item: Omit<AccomplishmentItem, 'id'>) => Promise<void>;
  updateAccomplishment: (id: string, updates: Partial<AccomplishmentItem>) => Promise<void>;
  deleteAccomplishment: (id: string) => Promise<void>;

  // Mutations - Announcements
  addAnnouncement: (item: Omit<AnnouncementItem, 'id'>) => Promise<void>;
  updateAnnouncement: (id: string, updates: Partial<AnnouncementItem>) => Promise<void>;
  deleteAnnouncement: (id: string) => Promise<void>;

  // Mutations - Members & Access (Super Admin)
  updateUserRole: (userId: string, roleId: string) => Promise<{ success: boolean; error?: string }>;
  updateUserStatus: (userId: string, status: 'ACTIVE' | 'PENDING' | 'SUSPENDED') => Promise<{ success: boolean; error?: string }>;
  refreshMembers: () => Promise<void>;

  // Mutations - System
  updateSettings: (updates: Partial<SiteSettings>) => void;
  syncSeedToSupabase: () => Promise<{ success: boolean; message: string }>;
  resetToSeedData: () => void;
}

const CmsContext = createContext<CmsContextValue | undefined>(undefined);

// Field Mappers: DB (snake_case) <-> Frontend (camelCase)
function mapDbPerson(row: any): PersonItem {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug || row.id,
    roleArea: row.role_area,
    focusTag: row.focus_tag || '',
    oneSentence: row.one_sentence || '',
    biography: row.biography || '',
    areaOfContribution: row.area_of_contribution || '',
    activeProject: row.active_project || '',
    contributedProjectIds: row.contributed_project_ids || [],
    participatedEventIds: row.participated_event_ids || [],
    githubUrl: row.github_url || '',
    email: row.email || '',
    socialLinks: row.social_links || {},
    photoUrl: row.photo_url || row.cutout_url,
    photoLabel: row.photo_label || row.name,
    photoCaption: row.photo_caption || '',
    cutoutUrl: row.cutout_url || row.photo_url,
    originalPhotoUrl: row.original_photo_url || row.cutout_url,
    stagePosition: row.stage_position || { x: 50, y: 10 },
    stageScale: row.stage_scale ?? 1.0,
    stageRotation: row.stage_rotation ?? 0,
    stageZIndex: row.stage_z_index ?? 10,
    isForegroundAnchor: Boolean(row.is_foreground_anchor),
    cutoutContour: row.cutout_contour || 'natural',
    collageSize: row.collage_size || 'md',
    aspectRatio: row.aspect_ratio || 'portrait',
    paletteAccent: row.palette_accent || '#38B2A2',
    tagVariant: row.tag_variant || 'teal',
    status: row.status || 'PUBLISHED',
    order: row.display_order ?? 0,
  };
}

function mapPersonToDb(p: Partial<PersonItem>): any {
  const row: any = {};
  if (p.id !== undefined) row.id = p.id;
  if (p.name !== undefined) row.name = p.name;
  if (p.slug !== undefined) row.slug = p.slug;
  if (p.roleArea !== undefined) row.role_area = p.roleArea;
  if (p.focusTag !== undefined) row.focus_tag = p.focusTag;
  if (p.oneSentence !== undefined) row.one_sentence = p.oneSentence;
  if (p.biography !== undefined) row.biography = p.biography;
  if (p.areaOfContribution !== undefined) row.area_of_contribution = p.areaOfContribution;
  if (p.activeProject !== undefined) row.active_project = p.activeProject;
  if (p.contributedProjectIds !== undefined) row.contributed_project_ids = p.contributedProjectIds;
  if (p.participatedEventIds !== undefined) row.participated_event_ids = p.participatedEventIds;
  if (p.githubUrl !== undefined) row.github_url = p.githubUrl;
  if (p.email !== undefined) row.email = p.email;
  if (p.socialLinks !== undefined) row.social_links = p.socialLinks;
  if (p.photoUrl !== undefined) row.photo_url = p.photoUrl;
  if (p.photoLabel !== undefined) row.photo_label = p.photoLabel;
  if (p.photoCaption !== undefined) row.photo_caption = p.photoCaption;
  if (p.cutoutUrl !== undefined) row.cutout_url = p.cutoutUrl;
  if (p.originalPhotoUrl !== undefined) row.original_photo_url = p.originalPhotoUrl;
  if (p.stagePosition !== undefined) row.stage_position = p.stagePosition;
  if (p.stageScale !== undefined) row.stage_scale = p.stageScale;
  if (p.stageRotation !== undefined) row.stage_rotation = p.stageRotation;
  if (p.stageZIndex !== undefined) row.stage_z_index = p.stageZIndex;
  if (p.isForegroundAnchor !== undefined) row.is_foreground_anchor = p.isForegroundAnchor;
  if (p.cutoutContour !== undefined) row.cutout_contour = p.cutoutContour;
  if (p.collageSize !== undefined) row.collage_size = p.collageSize;
  if (p.aspectRatio !== undefined) row.aspect_ratio = p.aspectRatio;
  if (p.paletteAccent !== undefined) row.palette_accent = p.paletteAccent;
  if (p.tagVariant !== undefined) row.tag_variant = p.tagVariant;
  if (p.status !== undefined) row.status = p.status;
  if (p.order !== undefined) row.display_order = p.order;
  row.updated_at = new Date().toISOString();
  return row;
}

function mapDbProject(row: any): ProjectItem {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    description: row.description,
    visualUrl: row.visual_url,
    visualLabel: row.visual_label || '',
    visualCaption: row.visual_caption || '',
    contributors: row.contributors || [],
    status: row.status || 'DRAFT',
    gitUrl: row.git_url || '',
    specs: row.specs || [],
    metrics: row.metrics || undefined,
    createdAt: row.created_at ? row.created_at.split('T')[0] : '',
    updatedAt: row.updated_at ? row.updated_at.split('T')[0] : '',
  };
}

function mapProjectToDb(p: Partial<ProjectItem>): any {
  const row: any = {};
  if (p.id !== undefined) row.id = p.id;
  if (p.title !== undefined) row.title = p.title;
  if (p.category !== undefined) row.category = p.category;
  if (p.description !== undefined) row.description = p.description;
  if (p.visualUrl !== undefined) row.visual_url = p.visualUrl;
  if (p.visualLabel !== undefined) row.visual_label = p.visualLabel;
  if (p.visualCaption !== undefined) row.visual_caption = p.visualCaption;
  if (p.contributors !== undefined) row.contributors = p.contributors;
  if (p.status !== undefined) row.status = p.status;
  if (p.gitUrl !== undefined) row.git_url = p.gitUrl;
  if (p.specs !== undefined) row.specs = p.specs;
  if (p.metrics !== undefined) row.metrics = p.metrics;
  row.updated_at = new Date().toISOString();
  return row;
}

function mapDbEvent(row: any): EventItem {
  return {
    id: row.id,
    code: row.code || '',
    title: row.title,
    category: row.category,
    date: row.date || '',
    time: row.time || '',
    location: row.location || '',
    capacity: row.capacity || '',
    description: row.description || '',
    photoUrl: row.photo_url,
    photoLabel: row.photo_label || '',
    photoCaption: row.photo_caption || '',
    deliverables: row.deliverables || [],
    resources: row.resources || [],
    status: row.status || 'DRAFT',
    isUpcoming: Boolean(row.is_upcoming),
    hasSubmissions: Boolean(row.has_submissions || row.category === 'HACKATHON' || row.id === 'game-building-hackathon-2026'),
    createdAt: row.created_at ? row.created_at.split('T')[0] : '',
    updatedAt: row.updated_at ? row.updated_at.split('T')[0] : '',
  };
}

function mapEventToDb(e: Partial<EventItem>): any {
  const row: any = {};
  if (e.id !== undefined) row.id = e.id;
  if (e.code !== undefined) row.code = e.code;
  if (e.title !== undefined) row.title = e.title;
  if (e.category !== undefined) row.category = e.category;
  if (e.date !== undefined) row.date = e.date;
  if (e.time !== undefined) row.time = e.time;
  if (e.location !== undefined) row.location = e.location;
  if (e.capacity !== undefined) row.capacity = e.capacity;
  if (e.description !== undefined) row.description = e.description;
  if (e.photoUrl !== undefined) row.photo_url = e.photoUrl;
  if (e.photoLabel !== undefined) row.photo_label = e.photoLabel;
  if (e.photoCaption !== undefined) row.photo_caption = e.photoCaption;
  if (e.deliverables !== undefined) row.deliverables = e.deliverables;
  if (e.resources !== undefined) row.resources = e.resources;
  if (e.status !== undefined) row.status = e.status;
  if (e.isUpcoming !== undefined) row.is_upcoming = e.isUpcoming;
  row.updated_at = new Date().toISOString();
  return row;
}

function mapDbSubmission(row: any): SubmissionItem {
  return {
    id: row.id,
    eventId: row.event_id,
    title: row.title,
    slug: row.slug || row.id,
    description: row.description || '',
    coverImage: row.cover_image || undefined,
    teamName: row.team_name || undefined,
    participantNames: row.participant_names || [],
    category: row.category || undefined,
    techStack: row.tech_stack || [],
    demoUrl: row.demo_url || undefined,
    repositoryUrl: row.repository_url || undefined,
    screenshots: row.screenshots || [],
    resultBadge: row.result_badge || undefined,
    published: Boolean(row.published),
    createdAt: row.created_at ? row.created_at.split('T')[0] : '',
    updatedAt: row.updated_at ? row.updated_at.split('T')[0] : '',
  };
}

function mapSubmissionToDb(s: Partial<SubmissionItem>): any {
  const row: any = {};
  if (s.id !== undefined) row.id = s.id;
  if (s.eventId !== undefined) row.event_id = s.eventId;
  if (s.title !== undefined) row.title = s.title;
  if (s.slug !== undefined) row.slug = s.slug;
  if (s.description !== undefined) row.description = s.description;
  if (s.coverImage !== undefined) row.cover_image = s.coverImage;
  if (s.teamName !== undefined) row.team_name = s.teamName;
  if (s.participantNames !== undefined) row.participant_names = s.participantNames;
  if (s.category !== undefined) row.category = s.category;
  if (s.techStack !== undefined) row.tech_stack = s.techStack;
  if (s.demoUrl !== undefined) row.demo_url = s.demoUrl;
  if (s.repositoryUrl !== undefined) row.repository_url = s.repositoryUrl;
  if (s.screenshots !== undefined) row.screenshots = s.screenshots;
  if (s.resultBadge !== undefined) row.result_badge = s.resultBadge;
  if (s.published !== undefined) row.published = s.published;
  row.updated_at = new Date().toISOString();
  return row;
}

function mapDbProfileToUser(p: DbProfile): UserAccount {
  const name = p.name || p.email.split('@')[0];
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('') || 'U';

  return {
    id: p.id,
    userId: p.user_id,
    name,
    username: p.username || undefined,
    email: p.email,
    avatar: p.avatar || undefined,
    roleId: p.role,
    status: p.status,
    bio: p.bio || undefined,
    skills: p.skills || [],
    joinedDate: p.created_at ? p.created_at.split('T')[0] : '2026-01-01',
    avatarInitials: initials,
  };
}

export const CmsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user: authUser, profile: authProfile, role: authRole } = useAuth();

  const [projects, setProjects] = useState<ProjectItem[]>(isSupabaseConfigured ? [] : DEFAULT_PROJECTS);
  const [events, setEvents] = useState<EventItem[]>(isSupabaseConfigured ? [] : DEFAULT_EVENTS);
  const [submissions, setSubmissions] = useState<SubmissionItem[]>(DEFAULT_SUBMISSIONS);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(isSupabaseConfigured ? [] : DEFAULT_MEDIA);
  const [people, setPeople] = useState<PersonItem[]>(isSupabaseConfigured ? [] : DEFAULT_PEOPLE);
  const [accomplishments, setAccomplishments] = useState<AccomplishmentItem[]>(isSupabaseConfigured ? [] : DEFAULT_ACCOMPLISHMENTS);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(isSupabaseConfigured ? [] : DEFAULT_ANNOUNCEMENTS);
  const [roles] = useState<UserRole[]>(DEFAULT_ROLES);
  const [users, setUsers] = useState<UserAccount[]>(DEFAULT_USERS);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [collageSettings, setCollageSettings] = useState<CollageStageSettings>(DEFAULT_COLLAGE_SETTINGS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(isSupabaseConfigured ? [] : DEFAULT_AUDIT_LOGS);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  // Derive Current User directly from Supabase Auth & Profile
  const currentUser = useMemo<UserAccount | null>(() => {
    if (!authUser || !authProfile) return null;
    return mapDbProfileToUser(authProfile);
  }, [authUser, authProfile]);

  // Derive Current Role
  const currentRole = useMemo<UserRole | null>(() => {
    if (!currentUser) return null;
    const roleId = currentUser.roleId || authRole || 'member';
    return (
      roles.find((r) => r.id === roleId) || {
        id: roleId,
        name: roleId === 'superadmin' ? 'Super Admin' : roleId === 'admin' ? 'Admin' : 'Member',
        description: 'DETOX Authenticated Member',
        permissions: roleId === 'superadmin' ? ['*'] : roleId === 'admin' ? ['admin.*'] : ['profile.edit'],
        isSystem: true,
      }
    );
  }, [currentUser, authRole, roles]);

  // Fetch live collections from Supabase on mount
  const fetchAllData = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setIsLoadingData(false);
      return;
    }

    try {
      const [
        projRes,
        evtRes,
        subRes,
        peopleRes,
        mediaRes,
        accRes,
        annRes,
        colRes,
        audRes,
      ] = await Promise.all([
        supabase.from('projects').select('*').order('created_at', { ascending: false }),
        supabase.from('events').select('*').order('date', { ascending: true }),
        supabase.from('submissions').select('*').order('created_at', { ascending: false }),
        supabase.from('people').select('*').order('display_order', { ascending: true }),
        supabase.from('media').select('*').order('created_at', { ascending: false }),
        supabase.from('accomplishments').select('*').order('date', { ascending: false }),
        supabase.from('announcements').select('*').order('created_at', { ascending: false }),
        supabase.from('collage_settings').select('*').eq('id', 'global').maybeSingle(),
        supabase.from('audit_logs').select('*').order('timestamp', { ascending: false }).limit(50),
      ]);

      if (projRes.data && !projRes.error && projRes.data.length > 0) {
        setProjects(projRes.data.map(mapDbProject));
      } else if (projRes.error || !projRes.data || projRes.data.length === 0) {
        setProjects(DEFAULT_PROJECTS);
      }

      if (evtRes.data && !evtRes.error && evtRes.data.length > 0) {
        setEvents(evtRes.data.map(mapDbEvent));
      } else if (evtRes.error || !evtRes.data || evtRes.data.length === 0) {
        setEvents(DEFAULT_EVENTS);
      }

      if (subRes.data && !subRes.error && subRes.data.length > 0) {
        setSubmissions(subRes.data.map(mapDbSubmission));
      } else if (subRes.error || !subRes.data || subRes.data.length === 0) {
        setSubmissions(DEFAULT_SUBMISSIONS);
      }
      if (peopleRes.data && !peopleRes.error) {
        setPeople(peopleRes.data.map(mapDbPerson));
      }
      if (mediaRes.data && !mediaRes.error) {
        setMediaItems(
          mediaRes.data.map((m: any) => ({
            id: m.id,
            name: m.name,
            url: m.url,
            category: m.category,
            tags: m.tags || [],
            size: m.size || '',
            dimensions: m.dimensions || '',
            uploadedBy: m.uploaded_by || '',
            uploadedAt: m.created_at ? m.created_at.split('T')[0] : '',
            caption: m.caption || '',
          }))
        );
      }
      if (accRes.data && !accRes.error) {
        setAccomplishments(
          accRes.data.map((a: any) => ({
            id: a.id,
            title: a.title,
            date: a.date,
            category: a.category,
            description: a.description || '',
            impact: a.impact || '',
            verifiedLink: a.verified_link || '',
            status: a.status || 'PUBLISHED',
          }))
        );
      }
      if (annRes.data && !annRes.error) {
        setAnnouncements(
          annRes.data.map((an: any) => ({
            id: an.id,
            title: an.title,
            content: an.content,
            type: an.type,
            date: an.date,
            active: Boolean(an.active),
            status: an.status || 'PUBLISHED',
          }))
        );
      }
      if (colRes.data && !colRes.error) {
        setCollageSettings((prev) => ({
          ...prev,
          title: colRes.data.title || prev.title,
          categoryTag: colRes.data.category_tag || prev.categoryTag,
          leadText: colRes.data.lead_text || prev.leadText,
          statusText: colRes.data.status_text || prev.statusText,
          bgType: colRes.data.bg_type || prev.bgType,
          bgColor: colRes.data.bg_color || prev.bgColor,
          pattern: colRes.data.pattern || prev.pattern,
          hoverBehavior: colRes.data.hover_behavior || prev.hoverBehavior,
          decorativeElements: colRes.data.decorative_elements || prev.decorativeElements,
        }));
      }
      if (audRes.data && !audRes.error) {
        setAuditLogs(
          audRes.data.map((l: any) => ({
            id: l.id,
            timestamp: l.timestamp ? l.timestamp.replace('T', ' ').substring(0, 19) : '',
            actorId: l.actor_id || '',
            actorName: l.actor_name || '',
            actorRole: l.actor_role || '',
            action: l.action,
            targetType: l.target_type,
            targetId: l.target_id,
            details: l.details || '',
          }))
        );
      }
    } catch (err) {
      console.warn('Error fetching data from Supabase:', err);
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  // Fetch all profiles for Super Admin / Admin
  const refreshMembers = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setUsers(data.map((p: any) => mapDbProfileToUser(p as DbProfile)));
      }
    } catch (e) {
      console.warn('Failed to load member profiles:', e);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  useEffect(() => {
    if (authRole === 'admin' || authRole === 'superadmin') {
      refreshMembers();
    }
  }, [authRole, refreshMembers]);

  // Granular permissions check
  const hasPermission = useCallback(
    (permission: string): boolean => {
      if (!currentUser || !currentRole) return false;
      if (currentRole.permissions.includes('*')) return true;
      if (currentRole.permissions.includes(permission)) return true;
      return false;
    },
    [currentUser, currentRole]
  );

  // Audit Logger with Supabase persistence
  const logAudit = useCallback(
    async (action: AuditAction, targetType: AuditTargetType, targetId: string, details: string) => {
      const entry: AuditLogEntry = {
        id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        actorId: currentUser ? currentUser.id : 'anon',
        actorName: currentUser ? currentUser.name : 'Public Visitor',
        actorRole: currentRole ? currentRole.name : 'Public',
        action,
        targetType,
        targetId,
        details,
      };

      setAuditLogs((prev) => [entry, ...prev]);

      if (isSupabaseConfigured) {
        try {
          await supabase.from('audit_logs').insert({
            id: entry.id,
            actor_id: entry.actorId,
            actor_name: entry.actorName,
            actor_role: entry.actorRole,
            action,
            target_type: targetType,
            target_id: targetId,
            details,
          });
        } catch (err) {
          console.warn('Failed to persist audit log to Supabase:', err);
        }
      }
    },
    [currentUser, currentRole]
  );

  // Mutations: Projects
  const addProject = useCallback(
    async (item: Omit<ProjectItem, 'id' | 'createdAt' | 'updatedAt'>) => {
      const now = new Date().toISOString().split('T')[0];
      const id = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `proj-${Date.now()}`;
      const newProj: ProjectItem = { ...item, id, createdAt: now, updatedAt: now };

      setProjects((prev) => [newProj, ...prev]);

      if (isSupabaseConfigured) {
        const { error } = await supabase.from('projects').insert(mapProjectToDb(newProj));
        if (error) console.error('Supabase error inserting project:', error);
      }

      await logAudit('CREATE', 'PROJECT', id, `Created project "${item.title}"`);
    },
    [logAudit]
  );

  const updateProject = useCallback(
    async (id: string, updates: Partial<ProjectItem>) => {
      const now = new Date().toISOString().split('T')[0];
      setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: now } : p)));

      if (isSupabaseConfigured) {
        const { error } = await supabase.from('projects').update(mapProjectToDb(updates)).eq('id', id);
        if (error) console.error('Supabase error updating project:', error);
      }

      await logAudit('UPDATE', 'PROJECT', id, `Updated project specifications for ${id}`);
    },
    [logAudit]
  );

  const deleteProject = useCallback(
    async (id: string) => {
      const target = projects.find((p) => p.id === id);
      setProjects((prev) => prev.filter((p) => p.id !== id));

      if (isSupabaseConfigured) {
        const { error } = await supabase.from('projects').delete().eq('id', id);
        if (error) console.error('Supabase error deleting project:', error);
      }

      await logAudit('DELETE', 'PROJECT', id, `Deleted project "${target?.title || id}"`);
    },
    [projects, logAudit]
  );

  const setProjectStatus = useCallback(
    async (id: string, status: ContentStatus) => {
      await updateProject(id, { status });
    },
    [updateProject]
  );

  // Mutations: Events
  const addEvent = useCallback(
    async (item: Omit<EventItem, 'id' | 'createdAt' | 'updatedAt'>) => {
      const now = new Date().toISOString().split('T')[0];
      const id = `evt-${Date.now()}`;
      const newEvent: EventItem = { ...item, id, createdAt: now, updatedAt: now };

      setEvents((prev) => [newEvent, ...prev]);

      if (isSupabaseConfigured) {
        const { error } = await supabase.from('events').insert(mapEventToDb(newEvent));
        if (error) console.error('Supabase error inserting event:', error);
      }

      await logAudit('CREATE', 'EVENT', id, `Created event "${item.title}"`);
    },
    [logAudit]
  );

  const updateEvent = useCallback(
    async (id: string, updates: Partial<EventItem>) => {
      const now = new Date().toISOString().split('T')[0];
      setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates, updatedAt: now } : e)));

      if (isSupabaseConfigured) {
        const { error } = await supabase.from('events').update(mapEventToDb(updates)).eq('id', id);
        if (error) console.error('Supabase error updating event:', error);
      }

      await logAudit('UPDATE', 'EVENT', id, `Updated event ${id}`);
    },
    [logAudit]
  );

  const deleteEvent = useCallback(
    async (id: string) => {
      const target = events.find((e) => e.id === id);
      setEvents((prev) => prev.filter((e) => e.id !== id));

      if (isSupabaseConfigured) {
        const { error } = await supabase.from('events').delete().eq('id', id);
        if (error) console.error('Supabase error deleting event:', error);
      }

      await logAudit('DELETE', 'EVENT', id, `Deleted event "${target?.title || id}"`);
    },
    [events, logAudit]
  );

  const setEventStatus = useCallback(
    async (id: string, status: ContentStatus) => {
      await updateEvent(id, { status });
    },
    [updateEvent]
  );

  // Mutations: Submissions
  const addSubmission = useCallback(
    async (item: Omit<SubmissionItem, 'id' | 'createdAt' | 'updatedAt'>) => {
      const now = new Date().toISOString().split('T')[0];
      const id = item.slug || `sub-${Date.now()}`;
      const newSubmission: SubmissionItem = { ...item, id, createdAt: now, updatedAt: now };

      setSubmissions((prev) => [newSubmission, ...prev]);

      if (isSupabaseConfigured) {
        const { error } = await supabase.from('submissions').insert(mapSubmissionToDb(newSubmission));
        if (error) console.error('Supabase error inserting submission:', error);
      }

      await logAudit('CREATE', 'SUBMISSION', id, `Added submission "${item.title}"`);
    },
    [logAudit]
  );

  const updateSubmission = useCallback(
    async (id: string, updates: Partial<SubmissionItem>) => {
      const now = new Date().toISOString().split('T')[0];
      setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates, updatedAt: now } : s)));

      if (isSupabaseConfigured) {
        const { error } = await supabase.from('submissions').update(mapSubmissionToDb(updates)).eq('id', id);
        if (error) console.error('Supabase error updating submission:', error);
      }

      await logAudit('UPDATE', 'SUBMISSION', id, `Updated submission "${id}"`);
    },
    [logAudit]
  );

  const deleteSubmission = useCallback(
    async (id: string) => {
      const target = submissions.find((s) => s.id === id);
      setSubmissions((prev) => prev.filter((s) => s.id !== id));

      if (isSupabaseConfigured) {
        const { error } = await supabase.from('submissions').delete().eq('id', id);
        if (error) console.error('Supabase error deleting submission:', error);
      }

      await logAudit('DELETE', 'SUBMISSION', id, `Deleted submission "${target?.title || id}"`);
    },
    [submissions, logAudit]
  );

  const setSubmissionPublished = useCallback(
    async (id: string, published: boolean) => {
      await updateSubmission(id, { published });
    },
    [updateSubmission]
  );

  // Mutations: People
  const addPerson = useCallback(
    async (person: Omit<PersonItem, 'id'>) => {
      const id = `per_${Date.now()}`;
      const newPerson: PersonItem = { ...person, id };

      setPeople((prev) => [...prev, newPerson]);

      if (isSupabaseConfigured) {
        const { error } = await supabase.from('people').insert(mapPersonToDb(newPerson));
        if (error) console.error('Supabase error inserting person:', error);
      }

      await logAudit('CREATE', 'PERSON', id, `Added builder "${person.name}"`);
    },
    [logAudit]
  );

  const updatePerson = useCallback(
    async (id: string, updates: Partial<PersonItem>) => {
      setPeople((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));

      if (isSupabaseConfigured) {
        const { error } = await supabase.from('people').update(mapPersonToDb(updates)).eq('id', id);
        if (error) console.error('Supabase error updating person:', error);
      }

      await logAudit('UPDATE', 'PERSON', id, `Updated profile for builder ${id}`);
    },
    [logAudit]
  );

  const deletePerson = useCallback(
    async (id: string) => {
      const target = people.find((p) => p.id === id);
      setPeople((prev) => prev.filter((p) => p.id !== id));

      if (isSupabaseConfigured) {
        const { error } = await supabase.from('people').delete().eq('id', id);
        if (error) console.error('Supabase error deleting person:', error);
      }

      await logAudit('DELETE', 'PERSON', id, `Removed builder profile "${target?.name || id}"`);
    },
    [people, logAudit]
  );

  const setPersonStatus = useCallback(
    async (id: string, status: ContentStatus) => {
      await updatePerson(id, { status });
    },
    [updatePerson]
  );

  const reorderPeople = useCallback(
    async (reordered: PersonItem[]) => {
      const withUpdatedOrders = reordered.map((p, idx) => ({ ...p, order: idx + 1 }));
      setPeople(withUpdatedOrders);

      if (isSupabaseConfigured) {
        try {
          await Promise.all(
            withUpdatedOrders.map((p) =>
              supabase.from('people').update({ display_order: p.order }).eq('id', p.id)
            )
          );
        } catch (e) {
          console.error('Error saving people reorder:', e);
        }
      }

      await logAudit('UPDATE', 'PERSON', 'ALL', 'Reordered Minds Behind DETOX collage layout');
    },
    [logAudit]
  );

  // Mutations: Collage Stage Settings
  const updateCollageSettings = useCallback(
    async (updates: Partial<CollageStageSettings>) => {
      setCollageSettings((prev) => ({ ...prev, ...updates }));

      if (isSupabaseConfigured) {
        const dbUpdates: any = { updated_at: new Date().toISOString() };
        if (updates.title !== undefined) dbUpdates.title = updates.title;
        if (updates.categoryTag !== undefined) dbUpdates.category_tag = updates.categoryTag;
        if (updates.leadText !== undefined) dbUpdates.lead_text = updates.leadText;
        if (updates.statusText !== undefined) dbUpdates.status_text = updates.statusText;
        if (updates.bgType !== undefined) dbUpdates.bg_type = updates.bgType;
        if (updates.bgColor !== undefined) dbUpdates.bg_color = updates.bgColor;
        if (updates.pattern !== undefined) dbUpdates.pattern = updates.pattern;
        if (updates.hoverBehavior !== undefined) dbUpdates.hover_behavior = updates.hoverBehavior;
        if (updates.decorativeElements !== undefined) dbUpdates.decorative_elements = updates.decorativeElements;

        await supabase.from('collage_settings').upsert({ id: 'global', ...dbUpdates });
      }

      await logAudit('SETTINGS', 'SETTING', 'collage', 'Updated Minds Behind DETOX collage stage settings');
    },
    [logAudit]
  );

  const publishCollageChanges = useCallback(
    async (peopleData: PersonItem[], settingsData?: Partial<CollageStageSettings>) => {
      setPeople(peopleData);
      if (settingsData) {
        setCollageSettings((prev) => ({ ...prev, ...settingsData }));
      }

      if (isSupabaseConfigured) {
        try {
          await Promise.all(
            peopleData.map((p) => supabase.from('people').upsert(mapPersonToDb(p)))
          );

          if (settingsData) {
            await updateCollageSettings(settingsData);
          }
        } catch (err) {
          console.error('Error saving collage visual arrangements to Supabase:', err);
        }
      }

      await logAudit('PUBLISH', 'PERSON', 'ALL', 'Published visual collage arrangement and art direction');
    },
    [logAudit, updateCollageSettings]
  );

  // Mutations: Media
  const addMedia = useCallback(
    async (item: Omit<MediaItem, 'id' | 'uploadedAt' | 'uploadedBy'>) => {
      const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
      const id = `med_${Date.now()}`;
      const newMedia: MediaItem = {
        ...item,
        id,
        uploadedAt: now,
        uploadedBy: currentUser ? currentUser.email : 'admin@detox.build',
      };

      setMediaItems((prev) => [newMedia, ...prev]);

      if (isSupabaseConfigured) {
        await supabase.from('media').insert({
          id,
          name: item.name,
          url: item.url || '',
          category: item.category,
          tags: item.tags || [],
          size: item.size || '',
          dimensions: item.dimensions || '',
          uploaded_by: newMedia.uploadedBy,
          caption: item.caption || '',
        });
      }

      await logAudit('CREATE', 'MEDIA', id, `Uploaded media asset "${item.name}"`);
    },
    [currentUser, logAudit]
  );

  const deleteMedia = useCallback(
    async (id: string) => {
      setMediaItems((prev) => prev.filter((m) => m.id !== id));

      if (isSupabaseConfigured) {
        await supabase.from('media').delete().eq('id', id);
      }

      await logAudit('DELETE', 'MEDIA', id, `Deleted media asset ${id}`);
    },
    [logAudit]
  );

  // Mutations: Accomplishments
  const addAccomplishment = useCallback(
    async (item: Omit<AccomplishmentItem, 'id'>) => {
      const id = `acc_${Date.now()}`;
      const newItem: AccomplishmentItem = { ...item, id };
      setAccomplishments((prev) => [newItem, ...prev]);

      if (isSupabaseConfigured) {
        await supabase.from('accomplishments').insert({
          id,
          title: item.title,
          date: item.date,
          category: item.category,
          description: item.description,
          impact: item.impact,
          verified_link: item.verifiedLink,
          status: item.status,
        });
      }

      await logAudit('CREATE', 'ACCOMPLISHMENT', id, `Added accomplishment "${item.title}"`);
    },
    [logAudit]
  );

  const updateAccomplishment = useCallback(
    async (id: string, updates: Partial<AccomplishmentItem>) => {
      setAccomplishments((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));

      if (isSupabaseConfigured) {
        const dbUpdates: any = {};
        if (updates.title !== undefined) dbUpdates.title = updates.title;
        if (updates.date !== undefined) dbUpdates.date = updates.date;
        if (updates.category !== undefined) dbUpdates.category = updates.category;
        if (updates.description !== undefined) dbUpdates.description = updates.description;
        if (updates.impact !== undefined) dbUpdates.impact = updates.impact;
        if (updates.verifiedLink !== undefined) dbUpdates.verified_link = updates.verifiedLink;
        if (updates.status !== undefined) dbUpdates.status = updates.status;
        await supabase.from('accomplishments').update(dbUpdates).eq('id', id);
      }

      await logAudit('UPDATE', 'ACCOMPLISHMENT', id, `Updated accomplishment ${id}`);
    },
    [logAudit]
  );

  const deleteAccomplishment = useCallback(
    async (id: string) => {
      setAccomplishments((prev) => prev.filter((a) => a.id !== id));

      if (isSupabaseConfigured) {
        await supabase.from('accomplishments').delete().eq('id', id);
      }

      await logAudit('DELETE', 'ACCOMPLISHMENT', id, `Deleted accomplishment ${id}`);
    },
    [logAudit]
  );

  // Mutations: Announcements
  const addAnnouncement = useCallback(
    async (item: Omit<AnnouncementItem, 'id'>) => {
      const id = `ann_${Date.now()}`;
      const newItem: AnnouncementItem = { ...item, id };
      setAnnouncements((prev) => [newItem, ...prev]);

      if (isSupabaseConfigured) {
        await supabase.from('announcements').insert({
          id,
          title: item.title,
          content: item.content,
          type: item.type,
          date: item.date,
          active: item.active,
          status: item.status,
        });
      }

      await logAudit('CREATE', 'ANNOUNCEMENT', id, `Published announcement "${item.title}"`);
    },
    [logAudit]
  );

  const updateAnnouncement = useCallback(
    async (id: string, updates: Partial<AnnouncementItem>) => {
      setAnnouncements((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));

      if (isSupabaseConfigured) {
        const dbUpdates: any = {};
        if (updates.title !== undefined) dbUpdates.title = updates.title;
        if (updates.content !== undefined) dbUpdates.content = updates.content;
        if (updates.type !== undefined) dbUpdates.type = updates.type;
        if (updates.date !== undefined) dbUpdates.date = updates.date;
        if (updates.active !== undefined) dbUpdates.active = updates.active;
        if (updates.status !== undefined) dbUpdates.status = updates.status;
        await supabase.from('announcements').update(dbUpdates).eq('id', id);
      }

      await logAudit('UPDATE', 'ANNOUNCEMENT', id, `Updated announcement ${id}`);
    },
    [logAudit]
  );

  const deleteAnnouncement = useCallback(
    async (id: string) => {
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));

      if (isSupabaseConfigured) {
        await supabase.from('announcements').delete().eq('id', id);
      }

      await logAudit('DELETE', 'ANNOUNCEMENT', id, `Deleted announcement ${id}`);
    },
    [logAudit]
  );

  // Mutations: Members & Roles (Super Admin Only)
  const updateUserRole = useCallback(
    async (userId: string, roleId: string): Promise<{ success: boolean; error?: string }> => {
      if (!isSupabaseConfigured) {
        setUsers((prev) => prev.map((u) => (u.id === userId || u.userId === userId ? { ...u, roleId } : u)));
        return { success: true };
      }

      try {
        const { error } = await supabase
          .from('profiles')
          .update({ role: roleId })
          .or(`id.eq.${userId},user_id.eq.${userId}`);

        if (error) {
          console.error('Supabase RLS/Trigger blocked role update:', error);
          return { success: false, error: error.message };
        }

        await refreshMembers();
        await logAudit('ROLE_CHANGE', 'MEMBER', userId, `Changed role for member ${userId} to ${roleId}`);
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message || 'Role change failed' };
      }
    },
    [logAudit, refreshMembers]
  );

  const updateUserStatus = useCallback(
    async (userId: string, status: 'ACTIVE' | 'PENDING' | 'SUSPENDED'): Promise<{ success: boolean; error?: string }> => {
      if (!isSupabaseConfigured) {
        setUsers((prev) => prev.map((u) => (u.id === userId || u.userId === userId ? { ...u, status } : u)));
        return { success: true };
      }

      try {
        const { error } = await supabase
          .from('profiles')
          .update({ status })
          .or(`id.eq.${userId},user_id.eq.${userId}`);

        if (error) {
          return { success: false, error: error.message };
        }

        await refreshMembers();
        await logAudit('UPDATE', 'MEMBER', userId, `Set member ${userId} status to ${status}`);
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message || 'Status change failed' };
      }
    },
    [logAudit, refreshMembers]
  );

  const updateSettings = useCallback((updates: Partial<SiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  }, []);

  const syncSeedToSupabase = useCallback(async (): Promise<{ success: boolean; message: string }> => {
    if (!isSupabaseConfigured) {
      return { success: false, message: 'Supabase credentials not configured yet.' };
    }

    try {
      for (const p of DEFAULT_PROJECTS) {
        await supabase.from('projects').upsert(mapProjectToDb(p));
      }
      for (const e of DEFAULT_EVENTS) {
        await supabase.from('events').upsert(mapEventToDb(e));
      }
      for (const pers of DEFAULT_PEOPLE) {
        await supabase.from('people').upsert(mapPersonToDb(pers));
      }
      await updateCollageSettings(DEFAULT_COLLAGE_SETTINGS);
      for (const a of DEFAULT_ACCOMPLISHMENTS) {
        await supabase.from('accomplishments').upsert({
          id: a.id,
          title: a.title,
          date: a.date,
          category: a.category,
          description: a.description,
          impact: a.impact,
          verified_link: a.verifiedLink,
          status: a.status,
        });
      }
      for (const an of DEFAULT_ANNOUNCEMENTS) {
        await supabase.from('announcements').upsert({
          id: an.id,
          title: an.title,
          content: an.content,
          type: an.type,
          date: an.date,
          active: an.active,
          status: an.status,
        });
      }

      await fetchAllData();
      return { success: true, message: 'All verified default seed data successfully synced to Supabase database.' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Sync failed.' };
    }
  }, [fetchAllData, updateCollageSettings]);

  const resetToSeedData = useCallback(() => {
    setProjects(DEFAULT_PROJECTS);
    setEvents(DEFAULT_EVENTS);
    setSubmissions(DEFAULT_SUBMISSIONS);
    setMediaItems(DEFAULT_MEDIA);
    setPeople(DEFAULT_PEOPLE);
    setAccomplishments(DEFAULT_ACCOMPLISHMENTS);
    setAnnouncements(DEFAULT_ANNOUNCEMENTS);
    setUsers(DEFAULT_USERS);
    setSettings(DEFAULT_SETTINGS);
    setCollageSettings(DEFAULT_COLLAGE_SETTINGS);
    setAuditLogs(DEFAULT_AUDIT_LOGS);
  }, []);

  return (
    <CmsContext.Provider
      value={{
        projects,
        events,
        submissions,
        mediaItems,
        people,
        accomplishments,
        announcements,
        roles,
        users,
        settings,
        collageSettings,
        auditLogs,
        isLoadingData,
        isBackendConnected: isSupabaseConfigured,
        currentUser,
        currentRole,
        hasPermission,
        addProject,
        updateProject,
        deleteProject,
        setProjectStatus,
        addEvent,
        updateEvent,
        deleteEvent,
        setEventStatus,
        addSubmission,
        updateSubmission,
        deleteSubmission,
        setSubmissionPublished,
        addMedia,
        deleteMedia,
        addPerson,
        updatePerson,
        deletePerson,
        setPersonStatus,
        reorderPeople,
        addAccomplishment,
        updateAccomplishment,
        deleteAccomplishment,
        addAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
        updateUserRole,
        updateUserStatus,
        refreshMembers,
        updateSettings,
        updateCollageSettings,
        publishCollageChanges,
        syncSeedToSupabase,
        resetToSeedData,
      }}
    >
      {children}
    </CmsContext.Provider>
  );
};

export const useCms = (): CmsContextValue => {
  const context = useContext(CmsContext);
  if (!context) {
    throw new Error('useCms must be used within a CmsProvider');
  }
  return context;
};
