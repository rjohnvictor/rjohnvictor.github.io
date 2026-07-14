export interface MotionTokens {
  fast: number;      // ms
  normal: number;    // ms
  slow: number;      // ms
  easing: string;
  cardHoverY: string; // CSS translateY value on card hover, '0' disables
}

export interface CardTokens {
  radius: string;
  padding: string;
  paddingSm: string;         // smaller variant (e.g. nested cards)
  className: string;         // '' | 'ki-card'
  hoverBorderColor: string;
  hoverBoxShadow: string;
  topAccentLine: boolean;    // power mode energy line across card top
}

export interface TagTokens {
  bg: string;
  border: string;
  color: string;
  radius: string;
  fontFamily: string;
}

export interface EffectTokens {
  accentTextShadow: string;
  accentBorderColor: string; // color for left-border highlights / quotes
  factValueColor: string;    // color for "quick facts" row values
  linkHoverBorderColor: string;
  linkHoverBoxShadow: string;
}

export interface ThreeTokens {
  heroCanvas: boolean;
  philosophyCanvas: boolean;
}

export type AboutLayout      = 'twoColumn' | 'prose';
export type SkillsLayout     = 'cards' | 'prose';
export type ProjectsLayout   = 'grid' | 'featured+grid' | 'list';
export type ExperienceLayout = 'cards' | 'energy-timeline' | 'reading-list';

export interface LayoutTokens {
  about: AboutLayout;
  skills: SkillsLayout;
  projects: ProjectsLayout;
  experience: ExperienceLayout;
}

export interface ThemeTokens {
  id: 'professional' | 'power' | 'zen';
  motion: MotionTokens;
  card: CardTokens;
  tag: TagTokens;
  effect: EffectTokens;
  three: ThreeTokens;
  layout: LayoutTokens;
}
