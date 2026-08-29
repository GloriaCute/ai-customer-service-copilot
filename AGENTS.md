# Project Rules

This is a portfolio B2B AI Customer Service RAG PoC.

## Product Positioning
- This is a B2B AI customer-service copilot, not a consumer chatbot.
- AI responses are suggestions; human agents make the final decision.
- The main purpose is to demonstrate AI product thinking, RAG workflow design, and human-AI collaboration.

## Core AI Principles
1. Do not fabricate knowledge that is not supported by the Dify knowledge base.
2. Knowledge-insufficient cases must support refusal and human escalation.
3. Preserve source citations when the Dify API provides them.
4. Do not fabricate citations, metrics, latency, accuracy, or business results.
5. Query Decomposition and multi-route retrieval are implemented in the existing Dify Chatflow. Do not rebuild the RAG system in the frontend.

## Security
1. Never expose DIFY_API_KEY in client-side code.
2. All real Dify requests must go through the server.
3. Store real secrets only in .env.local.
4. Keep .env.local in .gitignore.
5. .env.example must contain variable names only, never real secrets.

## Engineering Principles
1. Prefer simple architecture over over-engineering.
2. Do not add authentication, database, payment, multi-tenancy, or complex admin systems unless explicitly requested.
3. Keep components reasonably small and clearly named.
4. Do not modify unrelated files when fixing a localized issue.
5. Use TypeScript strictly.
6. Run typecheck/build after meaningful changes.
7. Remove dead code and unnecessary console logs.

## UI Principles
1. Professional B2B SaaS visual style.
2. Prioritize clarity, information hierarchy, and usability.
3. Avoid excessive gradients, glassmorphism, animations, AI glow effects, and decorative elements.
4. Highlight customer question, AI suggested response, knowledge sources, and human actions.
5. Support clear loading, success, refusal, error, and quota-exceeded states.

## Demo Requirements
1. Preserve Demo Mode as a fallback for portfolio demonstrations.
2. Clearly label Demo Mode when mock data is being used.
3. Never present mock results as real AI or real enterprise metrics.

## Development Process
Work phase by phase.
After each phase:
- run the project,
- check errors,
- summarize files changed,
- explain what was completed,
- stop and wait for confirmation before starting the next phase.
