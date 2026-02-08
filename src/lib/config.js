/**
 * Centralized configuration for the application
 * Contact information can be overridden via environment variables
 */

export const siteConfig = {
  contact: {
    // Primary contact email
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'kevin@ktg.one',
    
    // Backup contact email
    backupEmail: process.env.NEXT_PUBLIC_BACKUP_EMAIL || 'kevinktg@outlook.com',
  },
};
