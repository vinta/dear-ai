.PHONY: link-claude-skills

link-claude-skills:
	mkdir -p .claude/skills
	@for dir in skills/*/; do \
		name=$$(basename "$$dir"); \
		ln -sfn "../../$$dir" ".claude/skills/$$name"; \
	done
