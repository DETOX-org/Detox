/**
 * DETOX Platform V2 — CMS & Access Control Type Definitions
 */

export type ContentStatus = 'DRAFT' | 'REVIEW' | 'PUBLISHED';

export type ProjectCategory = 'STUDENT' | 'RESEARCH' | 'OSS' | 'CODING';

export interface ProjectItem {
  id: string;
  title: string;
  category: ProjectCategory;
  description: string;
  visualUrl?: string;
  visualLabel: string;
  visualCaption?: string;
  contributors: string[];
  status: ContentStatus;
  gitUrl: string;
  specs: string[];
  metrics?: { label: string; value: string };
  createdAt: string;
  updatedAt: string;
}

export type EventCategory = 'WORKSHOP' | 'PAPER SALON' | 'WEEKEND BUILD' | 'SECURITY AUDIT' | 'HACKATHON';

export interface EventItem {
  id: string;
  code: string;
  title: string;
  category: EventCategory;
  date: string;
  time: string;
  location: string;
  capacity?: string;
  description: string;
  photoUrl?: string;
  photoLabel: string;
  photoCaption: string;
  deliverables: string[];
  resources?: Array<{ label: string; url?: string }>;
  status: ContentStatus;
  isUpcoming: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HackathonItem {
  id: string;
  title: string;
  slug: string;
  tagline?: string;
  description: string;
  date: string;
  coverImage?: string;
  location?: string;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface HackathonProjectItem {
  id: string;
  hackathonId: string;
  title: string;
  slug: string;
  description: string;
  teamName?: string;
  teamMembers?: string[];
  coverImage?: string;
  screenshots?: string[];
  techStack?: string[];
  repositoryUrl?: string;
  demoUrl?: string;
  placement?: string;
  isWinner: boolean;
  isFeatured?: boolean;
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type MediaCategory = 'ALL' | 'EVENTS' | 'PROJECTS' | 'COMMUNITY' | 'PEOPLE';

export interface MediaItem {
  id: string;
  name: string;
  url?: string;
  category: MediaCategory;
  tags: string[];
  size: string;
  dimensions?: string;
  uploadedBy: string;
  uploadedAt: string;
  caption?: string;
}

export type PersonRoleArea = string;

export type CollageVisualSize = 'sm' | 'md' | 'lg' | 'featured';
export type PersonCropRatio = 'square' | 'portrait' | 'landscape';

export interface StageCoordinates {
  x: number; // percentage (0 to 100) across collage width
  y: number; // percentage (0 to 100) vertical placement on stage
}

export type CutoutArtStyle = 'natural' | 'paper' | 'sticker' | 'raw-cut' | 'shadowed';
export type EdgeOutlineStyle = 'none' | 'thin-paper' | 'white' | 'palette-accent';
export type LabelEditorialStyle = 'minimal' | 'editorial' | 'label' | 'side-note';
export type StageBackgroundType = 'garden' | 'solid' | 'gradient' | 'paper' | 'palette';
export type StagePatternType = 'none' | 'dots' | 'grid' | 'grain';
export type FocusScalePreset = 'subtle' | 'standard' | 'prominent';
export type RecessionPreset = 'subtle' | 'medium' | 'strong';
export type BlurPreset = 'none' | 'subtle' | 'soft';
export type LiftPreset = 'low' | 'medium' | 'high';
export type SpeedPreset = 'fast' | 'normal' | 'smooth';
export type DecorativeElementType = 'tape' | 'paper-scrap' | 'stamp' | 'mark' | 'color-chip';

export interface DecorativeElement {
  id: string;
  type: DecorativeElementType;
  x: number; // percentage (0 to 100)
  y: number; // percentage (0 to 100)
  scale?: number; // scale multiplier
  rotation?: number; // degrees e.g. -15 to +15
  text?: string;
  color?: string; // hex
}

export interface ShadowCustomization {
  enabled: boolean;
  strength: number; // 0 to 100
  softness: number; // 0 to 100
  offset: number; // 0 to 50
}

export interface HoverBehaviorSettings {
  focusScale: FocusScalePreset;
  recession: RecessionPreset;
  blur: BlurPreset;
  lift: LiftPreset;
  speed: SpeedPreset;
  labelStyle: LabelEditorialStyle;
}

export interface CollageStageSettings {
  title: string;
  categoryTag: string;
  leadText: string;
  statusText: string;
  bgType: StageBackgroundType;
  bgColor: string; // DETOX palette hex
  pattern: StagePatternType;
  hoverBehavior: HoverBehaviorSettings;
  decorativeElements: DecorativeElement[];
}

export interface PersonItem {
  id: string;
  name: string;
  slug?: string;
  roleArea: PersonRoleArea;
  focusTag: string;
  oneSentence: string;
  biography?: string;
  areaOfContribution?: string;
  activeProject: string;
  contributedProjectIds?: string[];
  participatedEventIds?: string[];
  githubUrl: string;
  email: string;
  socialLinks?: {
    github?: string;
    twitter?: string;
    x?: string;
    linkedin?: string;
    website?: string;
    discord?: string;
    telegram?: string;
    instagram?: string;
    youtube?: string;
    blog?: string;
    substack?: string;
    [key: string]: string | undefined;
  };
  photoUrl?: string;
  photoLabel: string;
  photoCaption: string;
  cutoutUrl?: string;
  originalPhotoUrl?: string;
  stagePosition?: StageCoordinates;
  stageScale?: number;
  stageRotation?: number;
  stageZIndex?: number;
  isForegroundAnchor?: boolean;
  cutoutContour?: 'natural' | 'paper-edge' | 'palette-glow';
  collageSize?: CollageVisualSize;
  aspectRatio?: PersonCropRatio;
  paletteAccent?: string;
  tagVariant?: string;
  status: ContentStatus;
  order?: number;

  // Visual Art Direction Customization Properties
  cutoutStyle?: CutoutArtStyle;
  shadowSettings?: ShadowCustomization;
  edgeOutline?: EdgeOutlineStyle;
  customOpacity?: number;
  labelStyle?: LabelEditorialStyle;
  mobilePosition?: StageCoordinates;
  mobileScale?: number;
  mobileRotation?: number;
  isVisibleInCollage?: boolean;
  isFeatured?: boolean;
}

export type AccomplishmentCategory = 'AWARD' | 'HACKATHON' | 'SELECTION' | 'MILESTONE' | 'COLLABORATION';

export interface AccomplishmentItem {
  id: string;
  title: string;
  date: string;
  category: AccomplishmentCategory;
  description: string;
  impact: string;
  verifiedLink?: string;
  status: ContentStatus;
}

export type AnnouncementType = 'INFO' | 'URGENT' | 'RELEASE';

export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  type: AnnouncementType;
  date: string;
  active: boolean;
  status: ContentStatus;
}

export type AuditAction = 
  | 'CREATE' 
  | 'UPDATE' 
  | 'DELETE' 
  | 'PUBLISH' 
  | 'REVIEW'
  | 'PROMOTE' 
  | 'DEMOTE' 
  | 'ROLE_CHANGE' 
  | 'SETTINGS';

export type AuditTargetType = 
  | 'PROJECT' 
  | 'EVENT' 
  | 'MEDIA' 
  | 'MEMBER' 
  | 'PERSON' 
  | 'SETTING' 
  | 'ACCOMPLISHMENT' 
  | 'ANNOUNCEMENT' 
  | 'HACKATHON' 
  | 'HACKATHON_PROJECT';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  action: AuditAction;
  targetType: AuditTargetType;
  targetId: string;
  details: string;
}

export interface UserRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isSystem: boolean;
}

export interface UserAccount {
  id: string;
  userId?: string;
  name: string;
  username?: string;
  email: string;
  avatar?: string;
  roleId: string;
  customPermissions?: string[];
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  bio?: string;
  skills?: string[];
  projectCount?: number;
  joinedDate: string;
  avatarInitials: string;
}

export interface SiteSettings {
  siteTitle: string;
  tagline: string;
  memberCountText: string;
  contactEmail: string;
  allowPublicSubmissions: boolean;
  maintenanceMode: boolean;
}
