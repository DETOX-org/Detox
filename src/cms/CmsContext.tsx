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
} from './seedData';

interface CmsContextValue {
  // Entities
  projects: ProjectItem[];
  events: EventItem[];
  mediaItems: MediaItem[];
  people: PersonItem[];
  accomplishments: AccomplishmentItem[];
  announcements: AnnouncementItem[];
  roles: UserRole[];
  users: UserAccount[];
  settings: SiteSettings;
  collageSettings: CollageStageSettings;
  auditLogs: AuditLogEntry[];

  // Current session & auth
  currentUser: UserAccount | null;
  currentRole: UserRole | null;
  switchUser: (user: UserAccount | null) => void;
  hasPermission: (permission: string) => boolean;

  // Mutations - Collage Art Direction
  updateCollageSettings: (updates: Partial<CollageStageSettings>) => void;
  publishCollageChanges: (peopleData: PersonItem[], settingsData?: Partial<CollageStageSettings>) => void;

  // Mutations - Projects
  addProject: (project: Omit<ProjectItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProject: (id: string, updates: Partial<ProjectItem>) => void;
  deleteProject: (id: string) => void;
  setProjectStatus: (id: string, status: ContentStatus) => void;

  // Mutations - Events
  addEvent: (event: Omit<EventItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEvent: (id: string, updates: Partial<EventItem>) => void;
  deleteEvent: (id: string) => void;
  setEventStatus: (id: string, status: ContentStatus) => void;

  // Mutations - Media
  addMedia: (media: Omit<MediaItem, 'id' | 'uploadedAt' | 'uploadedBy'>) => void;
  deleteMedia: (id: string) => void;

  // Mutations - People
  addPerson: (person: Omit<PersonItem, 'id'>) => void;
  updatePerson: (id: string, updates: Partial<PersonItem>) => void;
  deletePerson: (id: string) => void;
  setPersonStatus: (id: string, status: ContentStatus) => void;
  reorderPeople: (reordered: PersonItem[]) => void;

  // Mutations - Accomplishments
  addAccomplishment: (item: Omit<AccomplishmentItem, 'id'>) => void;
  updateAccomplishment: (id: string, updates: Partial<AccomplishmentItem>) => void;
  deleteAccomplishment: (id: string) => void;

  // Mutations - Announcements
  addAnnouncement: (item: Omit<AnnouncementItem, 'id'>) => void;
  updateAnnouncement: (id: string, updates: Partial<AnnouncementItem>) => void;
  deleteAnnouncement: (id: string) => void;

  // Mutations - Members & Access
  updateUserRole: (userId: string, roleId: string) => void;
  updateUserStatus: (userId: string, status: 'ACTIVE' | 'PENDING' | 'SUSPENDED') => void;
  updateRolePermissions: (roleId: string, permissions: string[]) => void;

  // Mutations - System
  updateSettings: (updates: Partial<SiteSettings>) => void;
  resetToSeedData: () => void;
}

const CmsContext = createContext<CmsContextValue | undefined>(undefined);

const STORAGE_KEY = 'detox_cms_v2_store';

export const CmsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state from localStorage or seed
  const [isLoaded, setIsLoaded] = useState(false);

  const [projects, setProjects] = useState<ProjectItem[]>(DEFAULT_PROJECTS);
  const [events, setEvents] = useState<EventItem[]>(DEFAULT_EVENTS);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(DEFAULT_MEDIA);
  const [people, setPeople] = useState<PersonItem[]>(DEFAULT_PEOPLE);
  const [accomplishments, setAccomplishments] = useState<AccomplishmentItem[]>(DEFAULT_ACCOMPLISHMENTS);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(DEFAULT_ANNOUNCEMENTS);
  const [roles, setRoles] = useState<UserRole[]>(DEFAULT_ROLES);
  const [users, setUsers] = useState<UserAccount[]>(DEFAULT_USERS);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [collageSettings, setCollageSettings] = useState<CollageStageSettings>(DEFAULT_COLLAGE_SETTINGS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(DEFAULT_AUDIT_LOGS);

  // Default active user is Super Admin for easy evaluator testing
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(DEFAULT_USERS[0]);

  // Read saved state on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.projects) setProjects(parsed.projects);
        if (parsed.events) setEvents(parsed.events);
        if (parsed.mediaItems) setMediaItems(parsed.mediaItems);
        if (parsed.collageSettings) setCollageSettings({ ...DEFAULT_COLLAGE_SETTINGS, ...parsed.collageSettings });
        if (parsed.people && Array.isArray(parsed.people)) {
          const mergedPeople = parsed.people.map((p: PersonItem) => {
            const def = DEFAULT_PEOPLE.find(
              (dp) =>
                dp.id === p.id ||
                (dp.slug && p.slug && dp.slug.toLowerCase() === p.slug.toLowerCase()) ||
                (dp.name && p.name && dp.name.toLowerCase() === p.name.toLowerCase())
            );
            if (def) {
              const rawCutout = typeof p.cutoutUrl === 'string' ? p.cutoutUrl.trim() : '';
              const isInvalid =
                !rawCutout ||
                rawCutout.includes(':\\') ||
                rawCutout.includes('.gemini') ||
                rawCutout.includes('brain') ||
                rawCutout.startsWith('file:');
              const isCustomUpload =
                !isInvalid &&
                (rawCutout.startsWith('data:') ||
                  rawCutout.startsWith('blob:') ||
                  rawCutout.startsWith('http://') ||
                  rawCutout.startsWith('https://') ||
                  rawCutout.startsWith('/'));
              const finalCutout = isCustomUpload ? rawCutout : def.cutoutUrl;
              return {
                ...def,
                ...p,
                cutoutUrl: finalCutout,
                photoUrl: finalCutout,
                originalPhotoUrl: p.originalPhotoUrl || def.originalPhotoUrl || finalCutout,
                stagePosition: p.stagePosition || def.stagePosition,
                stageScale: p.stageScale || def.stageScale,
                stageRotation: p.stageRotation ?? def.stageRotation,
                stageZIndex: p.stageZIndex ?? def.stageZIndex,
                isForegroundAnchor: p.isForegroundAnchor ?? def.isForegroundAnchor,
                paletteAccent: p.paletteAccent || def.paletteAccent,
                status: p.status || def.status,
              };
            }
            // For custom people added in Super Admin
            const customCutout = p.cutoutUrl || p.photoUrl || '';
            return {
              ...p,
              cutoutUrl: customCutout,
              photoUrl: customCutout,
            };
          });

          // Ensure any missing default seed people are added to the list
          DEFAULT_PEOPLE.forEach((dp) => {
            if (
              !mergedPeople.some(
                (mp: PersonItem) =>
                  mp.id === dp.id ||
                  (mp.slug && dp.slug && mp.slug.toLowerCase() === dp.slug.toLowerCase()) ||
                  (mp.name && dp.name && mp.name.toLowerCase() === dp.name.toLowerCase())
              )
            ) {
              mergedPeople.push(dp);
            }
          });

          setPeople(mergedPeople);
        }
        if (parsed.accomplishments) setAccomplishments(parsed.accomplishments);
        if (parsed.announcements) setAnnouncements(parsed.announcements);
        if (parsed.roles) setRoles(parsed.roles);
        if (parsed.users) setUsers(parsed.users);
        if (parsed.settings) setSettings(parsed.settings);
        if (parsed.auditLogs) setAuditLogs(parsed.auditLogs);
        if (parsed.currentUserId !== undefined) {
          const u = (parsed.users || DEFAULT_USERS).find((usr: UserAccount) => usr.id === parsed.currentUserId);
          setCurrentUser(u || null);
        }
      }
    } catch (e) {
      console.warn('Failed to parse CMS storage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save on updates once loaded
  useEffect(() => {
    if (!isLoaded) return;
    try {
      const payload = {
        projects,
        events,
        mediaItems,
        people,
        accomplishments,
        announcements,
        roles,
        users,
        settings,
        collageSettings,
        auditLogs,
        currentUserId: currentUser ? currentUser.id : null,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.warn('Failed to persist CMS storage', e);
    }
  }, [
    isLoaded,
    projects,
    events,
    mediaItems,
    people,
    accomplishments,
    announcements,
    roles,
    users,
    settings,
    collageSettings,
    auditLogs,
    currentUser,
  ]);

  // Current role lookup
  const currentRole = useMemo(() => {
    if (!currentUser) return null;
    return roles.find((r) => r.id === currentUser.roleId) || null;
  }, [currentUser, roles]);

  // Granular permissions check
  const hasPermission = useCallback(
    (permission: string): boolean => {
      if (!currentUser || !currentRole) return false;
      if (currentRole.permissions.includes('*')) return true;
      if (currentRole.permissions.includes(permission)) return true;
      if (currentUser.customPermissions?.includes(permission)) return true;
      return false;
    },
    [currentUser, currentRole]
  );

  // Audit logger
  const logAudit = useCallback(
    (action: AuditAction, targetType: AuditTargetType, targetId: string, details: string) => {
      const newEntry: AuditLogEntry = {
        id: `aud_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        timestamp: new Date().toISOString().replace('T', ' ').substr(0, 19),
        actorId: currentUser ? currentUser.id : 'anon',
        actorName: currentUser ? currentUser.name : 'Public Visitor',
        actorRole: currentRole ? currentRole.name : 'Public',
        action,
        targetType,
        targetId,
        details,
      };
      setAuditLogs((prev) => [newEntry, ...prev]);
    },
    [currentUser, currentRole]
  );

  // Switch session user
  const switchUser = useCallback((user: UserAccount | null) => {
    setCurrentUser(user);
  }, []);

  // Project Mutations
  const addProject = useCallback(
    (item: Omit<ProjectItem, 'id' | 'createdAt' | 'updatedAt'>) => {
      const now = new Date().toISOString().split('T')[0];
      const id = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `proj-${Date.now()}`;
      const newProject: ProjectItem = {
        ...item,
        id,
        createdAt: now,
        updatedAt: now,
      };
      setProjects((prev) => [newProject, ...prev]);
      logAudit('CREATE', 'PROJECT', id, `Created project "${item.title}" [Status: ${item.status}]`);
    },
    [logAudit]
  );

  const updateProject = useCallback(
    (id: string, updates: Partial<ProjectItem>) => {
      const now = new Date().toISOString().split('T')[0];
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: now } : p))
      );
      logAudit('UPDATE', 'PROJECT', id, `Updated project specifications for ${id}`);
    },
    [logAudit]
  );

  const deleteProject = useCallback(
    (id: string) => {
      const target = projects.find((p) => p.id === id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      logAudit('DELETE', 'PROJECT', id, `Deleted project "${target?.title || id}"`);
    },
    [projects, logAudit]
  );

  const setProjectStatus = useCallback(
    (id: string, status: ContentStatus) => {
      const now = new Date().toISOString().split('T')[0];
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status, updatedAt: now } : p))
      );
      logAudit(
        status === 'PUBLISHED' ? 'PUBLISH' : 'REVIEW',
        'PROJECT',
        id,
        `Transitioned project ${id} to ${status}`
      );
    },
    [logAudit]
  );

  // Event Mutations
  const addEvent = useCallback(
    (item: Omit<EventItem, 'id' | 'createdAt' | 'updatedAt'>) => {
      const now = new Date().toISOString().split('T')[0];
      const id = `evt-${Date.now()}`;
      const newEvent: EventItem = {
        ...item,
        id,
        createdAt: now,
        updatedAt: now,
      };
      setEvents((prev) => [newEvent, ...prev]);
      logAudit('CREATE', 'EVENT', id, `Created event "${item.title}" [Status: ${item.status}]`);
    },
    [logAudit]
  );

  const updateEvent = useCallback(
    (id: string, updates: Partial<EventItem>) => {
      const now = new Date().toISOString().split('T')[0];
      setEvents((prev) =>
        prev.map((e) => (e.id === id ? { ...e, ...updates, updatedAt: now } : e))
      );
      logAudit('UPDATE', 'EVENT', id, `Updated event ${id}`);
    },
    [logAudit]
  );

  const deleteEvent = useCallback(
    (id: string) => {
      const target = events.find((e) => e.id === id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
      logAudit('DELETE', 'EVENT', id, `Deleted event "${target?.title || id}"`);
    },
    [events, logAudit]
  );

  const setEventStatus = useCallback(
    (id: string, status: ContentStatus) => {
      const now = new Date().toISOString().split('T')[0];
      setEvents((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status, updatedAt: now } : e))
      );
      logAudit(
        status === 'PUBLISHED' ? 'PUBLISH' : 'REVIEW',
        'EVENT',
        id,
        `Transitioned event ${id} to ${status}`
      );
    },
    [logAudit]
  );

  // Media Mutations
  const addMedia = useCallback(
    (item: Omit<MediaItem, 'id' | 'uploadedAt' | 'uploadedBy'>) => {
      const now = new Date().toISOString().replace('T', ' ').substr(0, 16);
      const id = `med_${Date.now()}`;
      const newMedia: MediaItem = {
        ...item,
        id,
        uploadedAt: now,
        uploadedBy: currentUser ? currentUser.email : 'admin@detox.build',
      };
      setMediaItems((prev) => [newMedia, ...prev]);
      logAudit('CREATE', 'MEDIA', id, `Uploaded "${item.name}" to category ${item.category}`);
    },
    [currentUser, logAudit]
  );

  const deleteMedia = useCallback(
    (id: string) => {
      const target = mediaItems.find((m) => m.id === id);
      setMediaItems((prev) => prev.filter((m) => m.id !== id));
      logAudit('DELETE', 'MEDIA', id, `Deleted media asset "${target?.name || id}"`);
    },
    [mediaItems, logAudit]
  );

  // People Mutations
  const addPerson = useCallback(
    (person: Omit<PersonItem, 'id'>) => {
      const id = `per_${Date.now()}`;
      const newPerson: PersonItem = { ...person, id };
      setPeople((prev) => [...prev, newPerson]);
      logAudit('CREATE', 'PERSON', id, `Added builder "${person.name}" in ${person.roleArea}`);
    },
    [logAudit]
  );

  const updatePerson = useCallback(
    (id: string, updates: Partial<PersonItem>) => {
      setPeople((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
      logAudit('UPDATE', 'PERSON', id, `Updated profile for builder ${id}`);
    },
    [logAudit]
  );

  const deletePerson = useCallback(
    (id: string) => {
      const target = people.find((p) => p.id === id);
      setPeople((prev) => prev.filter((p) => p.id !== id));
      logAudit('DELETE', 'PERSON', id, `Removed builder profile "${target?.name || id}"`);
    },
    [people, logAudit]
  );

  const setPersonStatus = useCallback(
    (id: string, status: ContentStatus) => {
      setPeople((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
      logAudit('UPDATE', 'PERSON', id, `Set status for builder ${id} to ${status}`);
    },
    [logAudit]
  );

  const reorderPeople = useCallback(
    (reordered: PersonItem[]) => {
      const withUpdatedOrders = reordered.map((p, idx) => ({ ...p, order: idx + 1 }));
      setPeople(withUpdatedOrders);
      logAudit('UPDATE', 'PERSON', 'ALL', 'Reordered Minds Behind DETOX collage layout');
    },
    [logAudit]
  );

  // Accomplishments
  const addAccomplishment = useCallback(
    (item: Omit<AccomplishmentItem, 'id'>) => {
      const id = `acc_${Date.now()}`;
      setAccomplishments((prev) => [{ ...item, id }, ...prev]);
      logAudit('CREATE', 'ACCOMPLISHMENT', id, `Added accomplishment "${item.title}"`);
    },
    [logAudit]
  );

  const updateAccomplishment = useCallback(
    (id: string, updates: Partial<AccomplishmentItem>) => {
      setAccomplishments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
      );
      logAudit('UPDATE', 'ACCOMPLISHMENT', id, `Updated accomplishment ${id}`);
    },
    [logAudit]
  );

  const deleteAccomplishment = useCallback(
    (id: string) => {
      setAccomplishments((prev) => prev.filter((a) => a.id !== id));
      logAudit('DELETE', 'ACCOMPLISHMENT', id, `Deleted accomplishment ${id}`);
    },
    [logAudit]
  );

  // Announcements
  const addAnnouncement = useCallback(
    (item: Omit<AnnouncementItem, 'id'>) => {
      const id = `ann_${Date.now()}`;
      setAnnouncements((prev) => [{ ...item, id }, ...prev]);
      logAudit('CREATE', 'ANNOUNCEMENT', id, `Published announcement "${item.title}"`);
    },
    [logAudit]
  );

  const updateAnnouncement = useCallback(
    (id: string, updates: Partial<AnnouncementItem>) => {
      setAnnouncements((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
      );
      logAudit('UPDATE', 'ANNOUNCEMENT', id, `Updated announcement ${id}`);
    },
    [logAudit]
  );

  const deleteAnnouncement = useCallback(
    (id: string) => {
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
      logAudit('DELETE', 'ANNOUNCEMENT', id, `Deleted announcement ${id}`);
    },
    [logAudit]
  );

  // Member management
  const updateUserRole = useCallback(
    (userId: string, roleId: string) => {
      const role = roles.find((r) => r.id === roleId);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, roleId } : u))
      );
      logAudit('ROLE_CHANGE', 'MEMBER', userId, `Changed role for member ${userId} to ${role?.name || roleId}`);
    },
    [roles, logAudit]
  );

  const updateUserStatus = useCallback(
    (userId: string, status: 'ACTIVE' | 'PENDING' | 'SUSPENDED') => {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status } : u))
      );
      logAudit('UPDATE', 'MEMBER', userId, `Set member ${userId} status to ${status}`);
    },
    [logAudit]
  );

  const updateRolePermissions = useCallback(
    (roleId: string, permissions: string[]) => {
      setRoles((prev) =>
        prev.map((r) => (r.id === roleId ? { ...r, permissions } : r))
      );
      logAudit('SETTINGS', 'SETTING', roleId, `Updated permission grants for role ${roleId}`);
    },
    [logAudit]
  );

  const updateSettings = useCallback(
    (updates: Partial<SiteSettings>) => {
      setSettings((prev) => ({ ...prev, ...updates }));
      logAudit('SETTINGS', 'SETTING', 'global', `Updated site configuration`);
    },
    [logAudit]
  );

  const updateCollageSettings = useCallback(
    (updates: Partial<CollageStageSettings>) => {
      setCollageSettings((prev) => ({ ...prev, ...updates }));
      logAudit('SETTINGS', 'SETTING', 'collage', `Updated Minds Behind DETOX collage stage settings`);
    },
    [logAudit]
  );

  const publishCollageChanges = useCallback(
    (peopleData: PersonItem[], settingsData?: Partial<CollageStageSettings>) => {
      setPeople(peopleData);
      if (settingsData) {
        setCollageSettings((prev) => ({ ...prev, ...settingsData }));
      }
      logAudit('PUBLISH', 'PERSON', 'ALL', 'Published visual collage arrangement and art direction');
    },
    [logAudit]
  );

  const resetToSeedData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setProjects(DEFAULT_PROJECTS);
    setEvents(DEFAULT_EVENTS);
    setMediaItems(DEFAULT_MEDIA);
    setPeople(DEFAULT_PEOPLE);
    setAccomplishments(DEFAULT_ACCOMPLISHMENTS);
    setAnnouncements(DEFAULT_ANNOUNCEMENTS);
    setRoles(DEFAULT_ROLES);
    setUsers(DEFAULT_USERS);
    setSettings(DEFAULT_SETTINGS);
    setCollageSettings(DEFAULT_COLLAGE_SETTINGS);
    setAuditLogs(DEFAULT_AUDIT_LOGS);
    setCurrentUser(DEFAULT_USERS[0]);
  }, []);

  return (
    <CmsContext.Provider
      value={{
        projects,
        events,
        mediaItems,
        people,
        accomplishments,
        announcements,
        roles,
        users,
        settings,
        collageSettings,
        auditLogs,
        currentUser,
        currentRole,
        switchUser,
        hasPermission,
        addProject,
        updateProject,
        deleteProject,
        setProjectStatus,
        addEvent,
        updateEvent,
        deleteEvent,
        setEventStatus,
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
        updateRolePermissions,
        updateSettings,
        updateCollageSettings,
        publishCollageChanges,
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
