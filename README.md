# AI-Verified Freelance Escrow Protocol on Stellar

## Overview

This project is a trustless, AI-powered escrow system built on the Stellar Testnet. It enables clients and freelancers to collaborate with automatic, objective, and transparent work verification. Payments are locked in a Soroban smart contract, and released only after the AI verifies that the delivered work meets the requirements.

The goal is to create programmable fairness:
AI judges the work → blockchain executes the decision → humans simply create.

---

## Features
- **Trustless escrow using Soroban smart contracts**
- **AI Evaluation Agent** (work approval, rejection, or revision)
- **3–5 second transaction finality**
- **Ultra-low transaction fees**
- **Designed for global freelance markets**

---
## How the AI Judge Works
 
**The AI Judge replaces manual review with a structured evaluation pipeline:**

**1. Requirement Parsing**

The client’s job description is converted into a structured checklist:
```json

{
  "requirements": [
    "Website must be responsive",
    "Navbar must contain 4 links",
    "Project must use React + TailwindCSS"
  ],
  "quality_metrics": ["responsiveness", "structure", "visual consistency"]
}
```

This ensures objective, machine-verifiable evaluation.
---
**2. Deliverable Analysis**

When the freelancer submits work (code, text, design, screenshots, etc.):

- **AI compares the deliverable to each requirement**

- **Detects missing features or inconsistencies**

- **Checks code quality and structure**

- **Verifies design alignment or visual similarities**

- **Uses task-specific evaluation prompts for accuracy**
---
**3. Objective Scoring**

The AI outputs pass/fail decisions with evidence:
```json

{
  "requirement": "Navbar must contain 4 links",
  "status": "passed",
  "evidence": "Detected links: Home, About, Work, Contact"
}
```
---
4. Quality Report & On-Chain Proof

**AI generates a full evaluation report including:**

- **Passed/failed criteria**

- **Suggested revisions**

- **Final recommendation**

The report is stored off-chain (IPFS/S3)
and its hash is written on-chain for immutability.
---
5. Smart Contract Trigger

Based on the report:

	 	
Approved	approve()	Payment released to freelancer
Needs Revision	request_revision()	Work returned for updates
Rejected	refund()	Refund issued to client

<table>
  <thead align="center">
    <tr border: none;>
      <td><b>Outcome</b></td>
      <td><b>Smart Contract Call</b></td>
      <td><b>Result</b></td>
    </tr>
  </thead>
   <tbody>
    <tr>
      <td><b>Approved</b></a></td>
      <td>approve()</td>
      <td>Payment released to freelancer</td>
    </tr>
	  <tr>
      <td><b>Needs Revision</b></a></td>
      <td>request_revision()</td>
      <td>Work returned for updates</td>
    </tr>
    <tr>
      <td><b>Rejected</b></a></td>
      <td>refund()</td>
      <td>Full refund to client</td>
    </tr>
  </tbody>
</table>

---

## System Architecture

---
```json

Client
│
▼
Deposits Funds → Stellar Escrow Contract
│
▼
Freelancer Submits Work
│
▼
AI Review
│
├─ Approve → Payment Released
├─ Revision → Return to Freelancer
└─ Reject → Refund Client
```

---

## Tech Stack
- **Frontend:** React / Next.js (optional for MVP)
- **Wallet:** Stellar Wallets Kit, Freighter**
- **Backend:** Node.js + Express
- **AI Layer:** OpenAI API or any LLM API
- **Blockchain:** Stellar Soroban Smart Contracts (Rust)
- **Network:** Stellar Testnet

---

## Future Improvements
- Multi-milestone payment flows
- Multi-language support
- Reputation scoring
- Encrypted file storage
- On-chain dispute resolution market
- Optional arbitration by third-party AI agents
- Mobile UI


# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
