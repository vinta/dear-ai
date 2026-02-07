.PHONY: link-claude-skills

link-claude-skills:
	mkdir -p .claude
	ln -sfn ../skills .claude/skills
