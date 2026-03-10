// ==========================================
// Cobble Quest - Constants & Configuration
// ==========================================

export const SERVER_CONFIG = {
  name: 'Cobble Quest',
  ip: 'mon.wrquest.xyz',
  version: '1.21.1',
  discord: 'https://discord.com/invite/3pqqysGqyf',
  discordTicket: 'https://discord.com/channels/892503948420853771/1452772962838118581',
  modpack: 'https://modrinth.com/modpack/cobble-quest',
  description:
    'El mejor servidor de Cobblemon. Explora, captura y batalla en una experiencia única de Pokémon × Minecraft.',
};

export const NAV_LINKS = [
  { label: 'Inicio', path: '/' },
  { label: 'Tienda', path: '/store' },
  { label: 'Rangos', path: '/ranks' },
  { label: 'Wiki', path: '/wiki' },
  { label: 'Soporte', path: '/support' },
];

export const CURRENCY_SYMBOL = '$';

export const RARITY_COLORS: Record<string, string> = {
  common: '#a8a8a8',
  uncommon: '#55ff55',
  rare: '#5555ff',
  epic: '#aa00aa',
  legendary: '#ffaa00',
  mythical: '#ff55ff',
};
