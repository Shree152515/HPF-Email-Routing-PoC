/**
 * Node: Parser
 * Purpose: Validates AI Output and implements Error Handling.
 * If AI fails to return valid JSON, this node prevents the workflow from crashing.
 */

// 1. Get the content string from the OpenAI response
const response = $input.first().json;
const contentString = response.choices ? response.choices[0].message.content : "{}";

// 2. Clean the string (Remove Markdown formatting if present)
const cleanString = contentString.replace(/```json|```/g, '').trim();

// 3. Parse the string into an actual JSON object
let aiData;
try {
  aiData = JSON.parse(cleanString);
} catch (error) {
  // FALLBACK LOGIC: If AI returns garbage, default to "General Question" to ensure human review.
  aiData = { 
      category: "General Question", 
      error: "AI did not return valid JSON - Manual Review Required" 
  };
}

// 4. SAFELY Retrieve Original Email Data to merge with AI insights
let originalEmail = { from: "test-sender@example.com", subject: "Test Subject" };

try {
    const previousData = $('Email Data Extraction').first();
    if (previousData) {
        originalEmail = previousData.json;
    }
} catch (e) {
    console.log("Previous node data not found - using dummy data.");
}

// 5. Output combined data for the Traffic Polizei
return {
  json: {
    category: aiData.category || "General Question",
    organization_name: aiData.organization_name,
    contact_person: aiData.contact_person,
    project_title: aiData.project_title,
    reply_to_email: originalEmail.from,
    original_subject: originalEmail.subject
  }
};