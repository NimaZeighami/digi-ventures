# Permanent project instructions

Read `AGENTS.md`, `ARCHITECTURE.md`, `REQUIREMENTS.md`, and the applicable `.claude/skills/*/SKILL.md` before editing. Inspect existing code first and avoid rewriting working logic. Never claim completion without running the appropriate checks.

Never generate Elementor JSON from memory, put the whole app in an Elementor HTML widget, or make JavaScript the authorization/validation boundary. Keep non-administrators out of WordPress administration, never modify WordPress core, and prefer public WordPress/Elementor APIs. Record material choices in `DECISIONS.md`. Keep all release artifacts deployable on cPanel without Node.js or Composer.
