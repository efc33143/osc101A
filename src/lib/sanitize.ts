export function sanitize(input: string): string {
    if (!input) return ''
    
    // 1. Remove HTML/XML tags to prevent XSS, script injection, and iframe/binary embedding
    let safe = input.replace(/<[^>]*>?/gm, '')
    
    // 2. Remove URLs to prevent cross-linking and phishing (matches http://, https://, and www.)
    safe = safe.replace(/(https?:\/\/[^\s]+)/g, '[LINK REDACTED]')
    safe = safe.replace(/(www\.[^\s]+)/g, '[LINK REDACTED]')
    
    // 3. Trim whitespace
    return safe.trim()
}
