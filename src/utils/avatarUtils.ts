// Avatar utility functions using DiceBear API
// DiceBear provides free, consistent avatars that don't stretch or warp

/**
 * Generate a DiceBear avatar URL based on a seed (typically user ID or name)
 * @param seed - A unique identifier for the user (e.g., user ID or name)
 * @param style - The DiceBear style to use (default: 'identicon')
 * @param size - The size of the avatar in pixels (default: 200)
 * @returns A URL to the DiceBear avatar
 */
export function generateDiceBearAvatar(
  seed: string,
  style: 'identicon' | 'initials' | 'personas' | 'avataaars' = 'identicon',
  size: number = 200
): string {
  // Clean the seed to ensure consistency
  const cleanSeed = seed.replace(/\s+/g, '').toLowerCase();
  
  // Use DiceBear's API to generate a consistent avatar
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(cleanSeed)}&size=${size}`;
}

/**
 * Generate a fallback avatar URL for when no seed is available
 * @param style - The DiceBear style to use (default: 'identicon')
 * @param size - The size of the avatar in pixels (default: 200)
 * @returns A URL to a default DiceBear avatar
 */
export function getDefaultAvatar(
  style: 'identicon' | 'initials' | 'personas' | 'avataaars' = 'identicon',
  size: number = 200
): string {
  return generateDiceBearAvatar('default-user', style, size);
}

/**
 * Get avatar URL with fallback handling
 * @param userIdOrName - User ID or name to use as seed
 * @param style - The DiceBear style to use (default: 'identicon')
 * @param size - The size of the avatar in pixels (default: 200)
 * @returns A URL to the DiceBear avatar
 */
export function getAvatarUrl(
  userIdOrName: string | undefined | null,
  style: 'identicon' | 'initials' | 'personas' | 'avataaars' = 'identicon',
  size: number = 200
): string {
  if (!userIdOrName) {
    return getDefaultAvatar(style, size);
  }
  
  return generateDiceBearAvatar(userIdOrName, style, size);
}