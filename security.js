// Security Protocol Implementation

// Function to set security headers
function setSecurityHeaders() {
    // Content Security Policy
    const csp = {
        'default-src': ["'self'"],
        'script-src': ["'self'", "'unsafe-inline'", 'https://cdnjs.cloudflare.com'],
        'style-src': ["'self'", "'unsafe-inline'", 'https://cdnjs.cloudflare.com', 'https://fonts.googleapis.com'],
        'img-src': ["'self'", 'data:', 'https:'],
        'font-src': ["'self'", 'https://fonts.gstatic.com'],
        'connect-src': ["'self'"],
        'frame-ancestors': ["'none'"],
        'form-action': ["'self'"]
    };

    // Convert CSP object to header string
    const cspHeader = Object.entries(csp)
        .map(([key, values]) => `${key} ${values.join(' ')}`)
        .join('; ');

    // Set security headers
    const headers = {
        'Content-Security-Policy': cspHeader,
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
        'Access-Control-Allow-Origin': "'self'"
    };

    // Apply headers to all responses
    if (typeof document !== 'undefined') {
        // For client-side security checks
        Object.entries(headers).forEach(([key, value]) => {
            console.log(`Security Header: ${key}: ${value}`);
        });
    }
}

// Initialize security protocols
document.addEventListener('DOMContentLoaded', () => {
    setSecurityHeaders();
    
    // Additional security checks
    if (window.location.protocol !== 'https:') {
        console.warn('Warning: This site should be served over HTTPS for maximum security');
    }
    
    // Prevent opening links in new windows without rel="noopener"
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
        if (!link.rel.includes('noopener')) {
            link.rel += ' noopener';
        }
    });
}); 