/**
 * Node: Email Data Extraction
 * Purpose: Normalizes incoming webhook data (Postman/Outlook) into a flat JSON structure.
 * Handles nested 'body' objects and ensures string outputs for OpenAI.
 */

const items = $input.all();

return items.map(item => {
    // 1. Find the data (Handle Postman nested body vs Flat JSON)
    const root = item.json;
    let emailData = {};

    if (root.subject) {
        // Data is at the top level
        emailData = root;
    } else if (root.body && root.body.subject) {
        // Data is inside 'body' object (Postman/External Wrapper)
        emailData = root.body;
    } else {
        // Fallback for edge cases
        emailData = root.body || {};
    }

    // 2. SAFETY CHECK: Ensure 'body' is a STRING, not an Object
    let bodyText = emailData.body || "No body";
    
    // If body is actually an object, convert it to text to prevent AI hallucinations
    if (typeof bodyText === 'object') {
        bodyText = JSON.stringify(bodyText);
    }

    return {
        json: {
            subject: emailData.subject || "No subject",
            body: bodyText, 
            from: emailData.from || "unknown@example.com",
            to: emailData.to || "unknown@example.com"
        }
    };
});