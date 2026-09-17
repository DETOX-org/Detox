/**
 * DETOX Curated Design Tokens
 * 
 * Strict palette constraints:
 * - Structural Dark Greens: #0B2B26, #163B32, #235347
 * - Muted Tones: #657166 (sage dark), #CFD6C4 (sage light)
 * - Curated Accents: #99CDD8, #FDE8D3, #F3C3B2, #B8C0FF, #C8B6FE, #E7C5FF, #FED5FF
 * - Surfaces: Workshop Charcoal (Dark) vs. Archival Drafting Paper (Light)
 */

export const DETOX_PALETTE = {
  // Structural Greens (Primary Anchor Colors)
  green: {
    darkest: '#0B2B26', // Deep structural ground / header accents
    deep: '#163B32',    // Primary card borders / engineering stamps
    accent: '#235347',  // Interactive highlights / active badges
  },

  // Muted Industrial Greys & Sages
  sage: {
    dark: '#657166',    // Technical labels / secondary borders
    light: '#CFD6C4',   // Muted badges / subtle dividers
  },

  // Curated Physical Accents (used sparingly as tags, status, telemetry - NEVER giant gradients)
  accents: {
    iceCyan: '#99CDD8',        // Protocol telemetry / active indicators
    peachCream: '#FDE8D3',     // Archival tags / warning stamps
    peachTerracotta: '#F3C3B2',// Hardware rev stamps / priority notes
    lavenderBlue: '#B8C0FF',   // Systems & runtime metadata
    softViolet: '#C8B6FE',     // Theory & math annotations
    softLilac: '#E7C5FF',      // Research group markers
    softRose: '#FED5FF',       // Human artifacts & sticky notes
  },

  // Two deliberate physical surfaces
  surfaces: {
    dark: {
      base: '#0b0c0e',
      cuttingMat: '#111215',
      panel: '#14161a',
      subtle: '#0e0f12',
      border: '#23272f',
      borderMuted: '#1b1d24',
      textPrimary: '#f4f4f5',
      textSecondary: '#a1a1aa',
      textMuted: '#71717a',
    },
    light: {
      base: '#ece9e2',
      draftingPaper: '#faf8f5',
      panel: '#f4f1ea',
      subtle: '#edeae3',
      border: '#ded9cf',
      borderMuted: '#e3dfd7',
      textPrimary: '#18181b',
      textSecondary: '#52525b',
      textMuted: '#71717a',
    },
  },
} as const;
