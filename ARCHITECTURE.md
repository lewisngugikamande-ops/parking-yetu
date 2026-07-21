
## Dependency Rules

| Layer | Can Import | Cannot Import |
|-------|------------|---------------|
| Foundation | Nothing | Everything else |
| Kernel | Foundation | Engine, Infrastructure, Applications |
| Engine | Foundation, Kernel | Infrastructure, Applications |
| Infrastructure | Foundation, Kernel, Engine | Applications |
| Applications | Everything | N/A |

## The One Entry Point

AccessEngine.process(request)
EOF

cat > ENGINE_LAWS.md << 'EOF'
# Engine Laws

1. The Engine Never Knows the Application
2. Sessions Are Immutable
3. Events Are Append-Only
4. Repositories Are Interfaces
5. Infrastructure Implements Interfaces
6. Applications Are Replaceable
7. Kernel Owns Startup
8. AccessEngine.process() Is the Only Entry Point
9. Policies Never Mutate State
10. Version Everything That Changes
EOF

echo "✅ Both files created!"