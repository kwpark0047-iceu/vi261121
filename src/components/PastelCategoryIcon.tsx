import { motion } from 'motion/react';
import {
  Activity,
  Bot,
  Code2,
  Compass,
  Globe,
  Layers,
  LayoutTemplate,
  Mail,
  Megaphone,
  Pencil,
  Plug,
  Rocket,
  Smartphone,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Wand2,
} from 'lucide-react';
import type { ContentType } from '../types/vibeatlas';
import {
  getContentTypePastelStyle,
  getRolePastelStyle,
  type PastelIconRole,
} from '../lib/pastelIcons';

interface PastelCategoryIconProps {
  contentType?: ContentType;
  role?: PastelIconRole;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<PastelCategoryIconProps['size']>, { box: string; icon: string }> = {
  xs: { box: 'h-6 w-6 rounded-xl', icon: 'h-3.5 w-3.5' },
  sm: { box: 'h-8 w-8 rounded-2xl', icon: 'h-4 w-4' },
  md: { box: 'h-10 w-10 rounded-2xl', icon: 'h-5 w-5' },
  lg: { box: 'h-12 w-12 rounded-[18px]', icon: 'h-6 w-6' },
};

function renderContentTypeGlyph(contentType: ContentType, iconClass: string) {
  switch (contentType) {
    case 'web_app':
      return <Globe className={iconClass} strokeWidth={2.1} aria-hidden="true" />;
    case 'mobile_app':
      return <Smartphone className={iconClass} strokeWidth={2.1} aria-hidden="true" />;
    case 'ai_tool':
      return <Wand2 className={iconClass} strokeWidth={2.1} aria-hidden="true" />;
    case 'mcp_server':
      return <Plug className={iconClass} strokeWidth={2.1} aria-hidden="true" />;
    case 'ai_skill':
      return <Sparkles className={iconClass} strokeWidth={2.1} aria-hidden="true" />;
    case 'ai_agent':
      return <Bot className={iconClass} strokeWidth={2.1} aria-hidden="true" />;
    case 'template':
      return <LayoutTemplate className={iconClass} strokeWidth={2.1} aria-hidden="true" />;
    case 'open_source':
    default:
      return <Code2 className={iconClass} strokeWidth={2.1} aria-hidden="true" />;
  }
}

function renderRoleGlyph(role: PastelIconRole, iconClass: string) {
  switch (role) {
    case 'brand':
      return <Compass className={iconClass} strokeWidth={2.2} aria-hidden="true" />;
    case 'promo':
      return <Megaphone className={iconClass} strokeWidth={2.1} aria-hidden="true" />;
    case 'activity':
      return <Activity className={iconClass} strokeWidth={2.1} aria-hidden="true" />;
    case 'trending':
      return <TrendingUp className={iconClass} strokeWidth={2.1} aria-hidden="true" />;
    case 'mcp':
      return <Plug className={iconClass} strokeWidth={2.1} aria-hidden="true" />;
    case 'stacks':
      return <Layers className={iconClass} strokeWidth={2.1} aria-hidden="true" />;
    case 'makers':
      return <Users className={iconClass} strokeWidth={2.1} aria-hidden="true" />;
    case 'submit':
      return <Rocket className={iconClass} strokeWidth={2.1} aria-hidden="true" />;
    case 'newsletter':
      return <Mail className={iconClass} strokeWidth={2.1} aria-hidden="true" />;
    case 'discover':
      return <Compass className={iconClass} strokeWidth={2.1} aria-hidden="true" />;
    case 'stars':
      return <Star className={iconClass} strokeWidth={2.1} aria-hidden="true" />;
    case 'edit':
    default:
      return <Pencil className={iconClass} strokeWidth={2.1} aria-hidden="true" />;
  }
}

export function PastelCategoryIcon({
  contentType,
  role,
  size = 'sm',
  animated = true,
  className = '',
}: PastelCategoryIconProps) {
  const palette = contentType
    ? getContentTypePastelStyle(contentType)
    : getRolePastelStyle(role ?? 'brand');
  const dims = SIZE_CLASSES[size];

  const glyph = contentType
    ? renderContentTypeGlyph(contentType, dims.icon)
    : renderRoleGlyph(role ?? 'brand', dims.icon);

  if (!animated) {
    return (
      <span
        aria-hidden="true"
        className={`inline-flex shrink-0 items-center justify-center shadow-xs ${dims.box} ${palette.containerClass} ${className}`}
      >
        {glyph}
      </span>
    );
  }

  return (
    <motion.span
      aria-hidden="true"
      whileHover={{ scale: 1.07, rotate: -2 }}
      transition={{ type: 'spring', stiffness: 380, damping: 22 }}
      className={`inline-flex shrink-0 items-center justify-center shadow-xs ${dims.box} ${palette.containerClass} ${className}`}
    >
      {glyph}
    </motion.span>
  );
}
