const crypto = require('crypto');

export function getStringHash(input: string): string {
    // Create a SHA-256 hash instance
    const hash = crypto.createHash('sha256');
    // Update the hash with the input string
    hash.update(input, 'utf8');
    // Generate the hash in hexadecimal format and return it
    return hash.digest('hex');
}