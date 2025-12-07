# Intelligent Email Routing & Automation (PoC)

## 📌 Project Overview
This Proof of Concept (PoC) automates the classification and processing of incoming grant applications for the Hasso Plattner Foundation. It utilizes **OpenAI (GPT-4o)** for semantic analysis and **n8n** for orchestration, reducing manual triage time from minutes to seconds.

## 🏗 Architectural Choices

### 1. Orchestration: n8n (vs. Azure Logic Apps)
*   **Reasoning:** n8n provides superior visualization of complex logic and allows for custom JavaScript execution ("Code Nodes") without the cold-start latency of serverless functions.
*   **Deployment:** Designed to run on **Azure App Services** (Docker Container) to utilize existing cloud infrastructure.

### 2. Intelligence: OpenAI GPT-4o Mini
*   **Reasoning:** Chosen for its low latency and cost-efficiency while maintaining high accuracy for text classification tasks.
*   **Optimization:** HTML tags are stripped from emails before sending to the API to reduce token usage and cost.

### 3. Storage: Azure Blob Storage
*   **Reasoning:** Implemented a **Stateless Architecture**. The execution layer (n8n) does not store data locally. All processed applications are archived in Azure Blob Storage as JSON files.
*   **Compliance:** Creates an immutable audit trail (`application-Name-Timestamp.json`) ensuring no data is ever overwritten.

## 🚀 Setup & Installation

### Prerequisites
*   n8n (Self-hosted or Desktop version)
*   OpenAI API Key
*   Azure Storage Account Connection String
*   SMTP Server Credentials (or Ethereal.email for testing)

### Installation Steps
1.  **Import Workflow:**
    *   Open n8n.
    *   Go to `Menu` > `Import` > `From File`.
    *   Select `workflow.json` from this repository.
2.  **Configure Credentials:**
    *   Open the **OpenAI Node** and add your API Key.
    *   Open the **Azure Blob Storage Node** and add your Connection String.
    *   Open the **Send Email Node** and add SMTP details.
3.  **Run Simulation:**
    *   Open the **Webhook Node** and click "Listen for Test Event".
    *   Send a POST request (via Postman) to the Test URL with a JSON body containing `subject` and `body`.

## ⚙️ Assumptions
1.  **Input Format:** The system assumes incoming webhooks follow a standard JSON structure (`subject`, `body`, `from`). The `Data Extraction` node normalizes this to handle nested variations.
2.  **Volume:** The current architecture is designed for typical inbox volumes (<10k/day). For higher loads, an **Azure Queue** would be introduced before the webhook to buffer requests.
3.  **Security:** In a production environment, API Keys would be stored in **Azure Key Vault** and referenced via environment variables, not stored directly in the node credentials.