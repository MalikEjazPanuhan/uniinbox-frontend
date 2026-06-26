Markdown
# 🚀 UniInbox AI — Full-Stack AI Email Assistant

UniInbox AI is a production-ready, full-stack email management platform that uses generative AI to categorize incoming messages, maintain custom context personas, and automatically draft hyper-personalized email replies. Built using a modern decoupled architecture, it features a responsive React frontend paired with a high-performance FastAPI backend.

🖥️ **Live Frontend URL:** [Launch UniInbox AI](https://wonderful-lamington-380bef.netlify.app)  
⚙️ **Production Backend API:** Hosted on Hugging Face Spaces

---

## 🌟 Key Features

*   **🔒 Secure User Authentication:** Full JWT-based registration and login flows backed by a secure PostgreSQL database.
*   **🤖 Custom AI Personas:** Define specific tones, roles, or instructions (e.g., "Polite Customer Support," "Direct Executive") that the AI dynamically adopts when writing responses.
*   **📩 Smart Message Routing:** Ingests messages and organizes them into a clean, intuitive workspace UI.
*   **⚡ One-Click AI Draft Generation:** Evaluates original email content alongside user-defined personas to produce context-aware drafts ready for a human-in-the-loop review.
*   **🔬 Demo Sandbox Mode:** Integrated simulated environment allowing seamless testing of full features without complex external OAuth procedures.

---

## 🏗️ System Architecture

The application is split into two completely isolated microservices to ensure rapid scalability and decoupled deployments:

┌─────────────────────────────────┐       ┌─────────────────────────────────┐
│        React Frontend           │ ───👉 │         FastAPI Backend         │
│       (Hosted on Netlify)       │ 👈─── │  (Hosted on Hugging Face Spaces)│
└─────────────────────────────────┘       └─────────────────────────────────┘
│
▼
┌─────────────────────────────────┐
│      Supabase PostgreSQL        │
└─────────────────────────────────┘


*   **Frontend:** React (Vite), Tailwind CSS, Axios, Lucide React icons.
*   **Backend:** FastAPI, Python, Uvicorn, JWT Auth, Pydantic data validation.
*   **Database:** Supabase PostgreSQL managed database.

---

## 🛠️ Local Installation & Setup

### Prerequisites
*   Node.js (v18 or higher)
*   Python 3.10+

### 1. Frontend Setup
Navigate to the frontend directory, install dependencies, and start the local Vite development server:

```bash
# Clone the repository and navigate into the folder
cd uniinbox-frontend

# Install dependencies
npm install

# Run the development environment
npm run dev
2. Environment Configuration
Create a .env file in the root of your frontend directory to point to your live or local API:

Code snippet
VITE_API_URL=[https://malik-2025-uniinbox-ai.hf.space](https://malik-2025-uniinbox-ai.hf.space)
📦 Deployment Configuration
Frontend Deployment: Configured via a customized netlify.toml file to ensure smooth SPA routing handling and proper production builds using Vite.

Backend Deployment: Packaged using a custom Dockerfile optimized for hosting public python services inside Hugging Face Spaces container runtimes.

📄 License
This project is open-source and available under the MIT License.


---

### 💡 How to update this in VS Code right now:
1. Open your `README.md` file in the root folder of your project (`F:\uniinbox\frontend\README.md`). If it doesn't exist, create a new file with that exact name.
2. Paste the text above inside it and save the file.
3. Push this clean markdown file up to your GitHub repository using your terminal:

```bash
git add README.md
git commit -m "docs: add comprehensive production README"
git push origin main
