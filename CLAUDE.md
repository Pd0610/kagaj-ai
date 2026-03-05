# KagajAI — Project Instructions

> AI-powered government document generation platform for Nepal.

## Session Protocol — MANDATORY

All business intelligence lives in the private vault (git-tracked in claude-skills, never in this repo):
`~/Workspace/claude-skills/kagaj-ai/` (symlinked to Claude memory)

### Start of Session
1. Read `memory/MEMORY.md` — quick context
2. Read latest `memory/sessions/YYYY-MM-DD-session-NN.md` — last session's full context
3. Check `memory/decisions/README.md` — what's been decided
4. Check `memory/research/` if relevant

### During Session
- Log every non-trivial decision with ID, reasoning, and alternatives
- Note every discussion point — casual conversations lead to decisions later
- Track open questions

### End of Session — MANDATORY
1. Create `memory/sessions/YYYY-MM-DD-session-NN.md` with:
   - **Summary**: 1-2 lines
   - **Key Decisions**: Each with ID (D7, D8...), reasoning, alternatives considered
   - **What We Did**: Actions taken
   - **What We Discussed**: Discussion points (even without decisions)
   - **Open Questions**: Unresolved for future
   - **For Next Session**: Concrete next steps
2. Update `memory/decisions/README.md` index if new decisions were made
3. Update `memory/MEMORY.md` status line if project phase changed

### Why This Matters
Surya has context between sessions. Jarvis doesn't. Session files ARE Jarvis's memory.

## Code Conventions
_(To be established when we start building)_

## Rules
- **Business intelligence stays in memory/, never in git.** No business plans, competitive analysis, pricing strategy, or session logs in the repo.
- Every session gets a session file. No exceptions.
- Decisions are numbered and indexed.
- Research is saved, not repeated.
- When in doubt, check memory/ before asking Surya to repeat context.
