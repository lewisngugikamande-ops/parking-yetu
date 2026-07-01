# ==========================================
# Parking Yetu - Makefile
# ==========================================

.PHONY: help docs verify lint

help:
	@echo "Available commands:"
	@echo "  make docs     - Bootstrap documentation"
	@echo "  make verify   - Verify documentation links"
	@echo "  make lint     - Lint markdown files"
	@echo "  make help     - Show this help"

docs:
	@echo "📚 Bootstrapping documentation..."
	@./scripts/bootstrap-docs.sh

verify:
	@echo "🔗 Verifying documentation links..."
	@find docs -name "*.md" -exec grep -oE '\([^)]+\.md\)' {} \; | \
		sed 's/(//;s/)//' | sort -u | while read link; do \
		if [ ! -f "docs/$$link" ] && [ ! -f "docs/adr/$$link" ]; then \
			echo "❌ Broken link: $$link"; \
			exit 1; \
		fi; \
	done
	@echo "✅ All links valid"

lint:
	@echo "🔍 Linting markdown files..."
	@npx markdownlint-cli docs/**/*.md 2>/dev/null || \
		echo "⚠️  markdownlint not installed. Run: npm install -g markdownlint-cli"
