import { BrandInput, BrandOptions, BrandPositioning, VisualIdentity } from '../types'

/**
 * Iconify integration for brand icons
 *
 * This module provides utilities to access common icon libraries through Iconify
 * and map brand attributes to appropriate icon styles.
 */

export const iconCollections = {
  material: 'material-symbols',
  lucide: 'lucide',
  heroicons: 'heroicons',
  tabler: 'tabler',
  phosphor: 'ph',
  feather: 'feather',
  fontAwesome: 'fa6-solid',
  bootstrap: 'bi',
  carbon: 'carbon',
  fluent: 'fluent',
  radix: 'radix-icons',
} as const

export type IconCollection = keyof typeof iconCollections

export const iconStyles = {
  modern: ['lucide', 'heroicons', 'tabler'],
  minimal: ['feather', 'phosphor', 'radix-icons'],
  detailed: ['material-symbols', 'fluent', 'carbon'],
  classic: ['fa6-solid', 'bi'],
}

export const commonIcons = {
  home: 'home',
  search: 'search',
  settings: 'settings',
  user: 'user',
  users: 'users',
  plus: 'plus',
  minus: 'minus',
  check: 'check',
  x: 'x',
  menu: 'menu',
  arrowLeft: 'arrow-left',
  arrowRight: 'arrow-right',
  chevronDown: 'chevron-down',
  chevronUp: 'chevron-up',
  chevronLeft: 'chevron-left',
  chevronRight: 'chevron-right',
  bell: 'bell',
  calendar: 'calendar',
  clock: 'clock',
  heart: 'heart',
  star: 'star',
  mail: 'mail',
  phone: 'phone',
  trash: 'trash',
  edit: 'edit',
  save: 'save',
  upload: 'upload',
  download: 'download',
  share: 'share',
  link: 'link',
  image: 'image',
  video: 'video',
  audio: 'audio',
  file: 'file',
  folder: 'folder',
  lock: 'lock',
  unlock: 'unlock',
  eye: 'eye',
  eyeOff: 'eye-off',
  info: 'info',
  warning: 'warning',
  alert: 'alert',
  help: 'help',
  refresh: 'refresh',
  logout: 'logout',
  login: 'login',

  code: 'code',
  server: 'server',
  database: 'database',
  cloud: 'cloud',

  activity: 'activity',
  stethoscope: 'stethoscope',
  hospital: 'hospital',

  dollarSign: 'dollar-sign',
  creditCard: 'credit-card',
  pieChart: 'pie-chart',
  trendingUp: 'trending-up',

  book: 'book',
  graduationCap: 'graduation-cap',
  school: 'school',
  pencil: 'pencil',

  coffee: 'coffee',
  utensils: 'utensils',
  shoppingCart: 'shopping-cart',
  truck: 'truck',
}

/**
 * Map brand attributes to appropriate icon style
 *
 * @param positioning - Brand positioning information
 * @param options - Configuration options
 * @returns Recommended icon collection
 */
export function getIconCollectionForBrand(positioning: BrandPositioning, options: BrandOptions = {}): string {
  if (options.iconStyle && options.iconStyle in iconCollections) {
    return iconCollections[options.iconStyle as IconCollection]
  }

  const personality = positioning.voice.personality.map((p) => p.toLowerCase())

  if (personality.some((p) => ['modern', 'clean', 'sleek', 'minimalist'].includes(p))) {
    return iconCollections.lucide
  }

  if (personality.some((p) => ['professional', 'corporate', 'business'].includes(p))) {
    return iconCollections.material
  }

  if (personality.some((p) => ['playful', 'friendly', 'approachable'].includes(p))) {
    return iconCollections.phosphor
  }

  if (personality.some((p) => ['traditional', 'classic', 'established'].includes(p))) {
    return iconCollections.fontAwesome
  }

  if (personality.some((p) => ['technical', 'detailed', 'precise'].includes(p))) {
    return iconCollections.tabler
  }

  return iconCollections.lucide
}

/**
 * Get icon set for a brand
 *
 * @param input - Brand input data
 * @param positioning - Brand positioning information
 * @param options - Configuration options
 * @returns Array of icon names with their collection prefix
 */
export function getBrandIconSet(input: BrandInput, positioning: BrandPositioning, options: BrandOptions = {}): string[] {
  const collection = getIconCollectionForBrand(positioning, options)

  const industry = (input.industry || '').toLowerCase()
  const description = input.description.toLowerCase()

  const baseIcons = [commonIcons.home, commonIcons.search, commonIcons.menu, commonIcons.user, commonIcons.settings]

  const industryIcons: string[] = []

  if (industry.includes('tech') || description.includes('tech')) {
    industryIcons.push(commonIcons.code, commonIcons.server, commonIcons.database, commonIcons.cloud)
  }

  if (industry.includes('health') || description.includes('health')) {
    industryIcons.push(commonIcons.heart, commonIcons.activity, commonIcons.stethoscope, commonIcons.hospital)
  }

  if (industry.includes('finance') || description.includes('finance')) {
    industryIcons.push(commonIcons.dollarSign, commonIcons.creditCard, commonIcons.pieChart, commonIcons.trendingUp)
  }

  if (industry.includes('education') || description.includes('education')) {
    industryIcons.push(commonIcons.book, commonIcons.graduationCap, commonIcons.school, commonIcons.pencil)
  }

  if (industry.includes('food') || description.includes('food')) {
    industryIcons.push(commonIcons.coffee, commonIcons.utensils, commonIcons.shoppingCart, commonIcons.truck)
  }

  return [...baseIcons, ...industryIcons].map((icon) => `${collection}:${icon}`)
}

/**
 * Generate Iconify icon HTML
 *
 * @param icon - Icon name with collection prefix
 * @param size - Icon size in pixels
 * @param color - Icon color
 * @returns HTML string for the icon
 */
export function generateIconHtml(icon: string, size = 24, color = 'currentColor'): string {
  return `<span class="iconify" data-icon="${icon}" data-width="${size}" data-height="${size}" style="color: ${color};"></span>`
}

/**
 * Generate Iconify icon React component
 *
 * @param icon - Icon name with collection prefix
 * @param size - Icon size in pixels
 * @param color - Icon color
 * @returns React component string for the icon
 */
export function generateIconReact(icon: string, size = 24, color = 'currentColor'): string {
  const [collection, name] = icon.split(':')
  return `<Icon icon={${collection}${name}} width={${size}} height={${size}} color="${color}" />`
}
