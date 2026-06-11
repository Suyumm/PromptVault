# ⚡ PromptVault

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![C#](https://img.shields.io/badge/C%23-239120?style=for-the-badge&logo=c-sharp&logoColor=white)
![SQL](https://img.shields.io/badge/SQL-4479A1?style=for-the-badge&logo=postgresql&logoColor=white)

PromptVault is a local developer tool designed to solve the biggest headache in AI integration: losing the perfect prompt. It acts as a version control and A/B testing environment specifically built for prompt engineering.

## 🚀 The Vision

When integrating Large Language Models (LLMs) into applications, changing a single word can break the entire output. PromptVault allows developers to:
* **Save & Version:** Keep track of every iteration of a prompt.
* **A/B Test:** Compare the outputs of Version A and Version B side-by-side.
* **Track Metrics:** Monitor API response times and token costs.

*(Note: Add a GIF here showing the side-by-side prompt comparison UI)*

## 🛠️ Tech Stack
* **Frontend:** React (Dark Mode supported, split-screen UI)
* **Backend:** C#.NET Web API
* **Database:** SQL
* **Integrations:** Direct API connections to major LLMs (OpenAI, etc.)

## ⚙️ Quick Start (MVP Version)
Currently, PromptVault runs purely on the frontend using `localStorage` for quick testing without needing a database setup.

1. Clone the repo: `git clone https://github.com/yourusername/PromptVault.git`
2. Install dependencies: `npm install`
3. Start the dev server: `npm start`
4. Enter your API key in the settings panel and start testing!

---
*Built for developers who treat prompts as code.*
