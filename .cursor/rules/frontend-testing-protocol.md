# Frontend Testing Protocol Rules

## Core Principles

### 1. Chrome DevTools Priority
- ALWAYS use MCP Chrome DevTools for frontend testing
- NEVER run build commands without explicit user permission
- ALWAYS start with `pnpm dev` for development

### 2. Fallback Protocol
When Chrome DevTools is unavailable:
1. Detect unavailability
2. Communicate clearly to user
3. Present alternative methods
4. Request user decision

### 3. User Communication Template
```
⚠️ Chrome DevTools Unavailable

MCP Chrome DevTools is not responding, preventing direct frontend testing.

Available options:
1. 📋 Create detailed manual testing guide
2. 🔍 Static code analysis
3. ⏳ Wait for Chrome DevTools availability
4. ❌ Abort current task

Please choose how to proceed.
```

### 4. Build Permission Template
```
🔨 Build Permission Request

To test implemented functionality, I need to run:
`pnpm build`

May I proceed with the build? (Y/N)
```

## Implementation Rules

### Before Frontend Testing
- [ ] Check Chrome DevTools availability
- [ ] If unavailable, follow fallback protocol
- [ ] Always communicate limitations to user
- [ ] Wait for user decision before proceeding

### Before Build Commands
- [ ] Request explicit permission
- [ ] Explain build necessity
- [ ] Wait for user confirmation
- [ ] Never proceed without permission

### Alternative Methods
- Manual testing guides
- Static code analysis
- Documentation creation
- Other available MCPs (if appropriate)

## Compliance Checklist
- Chrome DevTools used when available
- User informed of tool limitations
- Alternatives presented clearly
- User decision respected
- Build permission requested
- Clear communication maintained
