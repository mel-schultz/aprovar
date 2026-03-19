/**
 * @typedef {Object} Profile
 * @property {string} id
 * @property {string|null} full_name
 * @property {string|null} company
 * @property {string|null} logo_url
 * @property {string} brand_color
 * @property {string} created_at
 */

/**
 * @typedef {Object} Client
 * @property {string} id
 * @property {string} profile_id
 * @property {string} name
 * @property {string|null} email
 * @property {string|null} whatsapp
 * @property {string|null} logo_url
 * @property {string|null} notes
 * @property {string} created_at
 */

/**
 * @typedef {Object} Approver
 * @property {string} id
 * @property {string} client_id
 * @property {string} name
 * @property {string|null} email
 * @property {string|null} whatsapp
 */

/**
 * @typedef {Object} Deliverable
 * @property {string} id
 * @property {string} client_id
 * @property {string} profile_id
 * @property {string} title
 * @property {string|null} description
 * @property {string|null} file_url
 * @property {string|null} file_type
 * @property {'upload'|'drive'|'canva'} source
 * @property {'pending'|'approved'|'rejected'|'revision'} status
 * @property {string} token
 * @property {string|null} scheduled_at
 * @property {string|null} published_at
 * @property {'instagram'|'facebook'|'youtube'|'tiktok'|null} network
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} ApprovalEvent
 * @property {string} id
 * @property {string} deliverable_id
 * @property {string|null} approver_id
 * @property {'sent'|'viewed'|'approved'|'rejected'|'revision'} action
 * @property {string|null} comment
 * @property {string} created_at
 */

/**
 * @typedef {Object} TeamMember
 * @property {string} id
 * @property {string} profile_id
 * @property {string} email
 * @property {string|null} name
 * @property {'admin'|'member'} role
 * @property {string} invited_at
 * @property {boolean} accepted
 */

export {}
