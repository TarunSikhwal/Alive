# Alive - Interactive Storyline AI

### **Chosen Vertical**
The chosen vertical is **Interactive Edutainment and Narrative Learning**. Specifically, this solution focuses on transforming static information into an immersive, step-by-step journey where the user is the protagonist of their own learning or story process[

---

### **Approach and Logic**
The application uses a **Dual-Mode Architecture** to separate standard conversational AI from structured narrative logic:

1.  **General Chat (Q&A):** A standard LLM implementation that processes markdown to provide rich-text responses for open-ended inquiries
2.  **Interactive Storyline (Story Mode):** A **State-Machine Approach** where the AI acts as a "Game Master." Instead of just replying, the AI is constrained by a system instruction to output data in a strict JSON schema
    *   **The Chain of Thought:** Each user response is appended to the `chatHistory`, allowing the AI to maintain context of previous "Steps" and "Choices"
    *   **JSON Enforcement:** By using `response_mime_type: "application/json"`, the logic ensures the backend receives a structured object containing a `title`, `content`, `question`, and `options` array

---

### **How the Solution Works**

#### **1. The Frontend (index.html)**
*   **Dynamic UI:** The UI is built with a mobile-first "chat-bubble" design using CSS variables for easy skinning
*   **Mode Switching:** When in Story Mode, the `renderStoryNode` function intercepts the JSON from the AI and generates physical buttons for the user to click
*   **Markdown Integration:** It utilizes `Marked.js` to render code blocks, bold text, and lists when in General Chat mode

#### **2. The Backend (server.js)**
*   **Security Proxy:** The Express server acts as a middleman to hide the `GEMINI_API_KEY` from the client-side code
*   **Standardized Routing:** It listens for POST requests on the root path and forwards the payload to the Google Gemini API
*   **Error Propagation:** The backend is designed to catch API errors (like quota issues or invalid keys) and pass them back to the UI in a format the frontend can display to the user

---

### **Assumptions Made**

*   **API Model Availability:** It is assumed that the environment has access to the `gemini-1.5-flash` model via the Google AI Studio or Vertex AI platform
*   **State Management:** The current logic assumes a **Session-Based State**; because `chatHistory` is stored in a local JavaScript variable, refreshing the browser will reset the story progress
*   **Strict JSON Formatting:** The Story Mode logic assumes the LLM will strictly adhere to the JSON schema provided in the system instruction. If the LLM returns prose instead of JSON, the frontend includes a `try...catch` block to alert the user
*   **Deployment Environment:** It is assumed the `GEMINI_API_KEY` is stored as an environment variable (`.env`) for the `server.js` to function securely
