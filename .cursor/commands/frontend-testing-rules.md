# Frontend Testing Rules Integration

## Core Rule: Chrome DevTools Priority

**ALWAYS use MCP Chrome DevTools for frontend testing**
**NEVER run build commands without explicit user permission**

## Fallback Protocol

When Chrome DevTools unavailable:
1. Detect unavailability
2. Communicate to user: "Chrome DevTools not available"
3. Present alternatives:
   - Manual testing guide
   - Static code analysis  
   - Wait for availability
   - Abort task
4. Request user decision
5. Execute according to choice

## Build Permission Protocol

Before ANY build command:
1. Request permission: "May I run `pnpm build`?"
2. Explain necessity
3. Wait for user confirmation
4. Never proceed without permission

## Communication Templates

### Unavailable Tools:
```
⚠️ Chrome DevTools Unavailable
MCP Chrome DevTools not responding. 
Options: Manual guide, Code analysis, Wait, Abort
Please choose how to proceed.
```

### Build Permission:
```
🔨 Build Permission Request
Need to run: `pnpm build`
May I proceed? (Y/N)
```

## Compliance Checklist
- [ ] Chrome DevTools checked first
- [ ] User informed of limitations
- [ ] Alternatives presented
- [ ] User decision awaited
- [ ] Build permission requested
- [ ] Clear communication maintained

## Quality Standards
- Transparent about tool limitations
- Proactive in presenting alternatives
- Respectful of user decisions
- Professional communication
- Comprehensive testing when possible
- Detailed documentation when not

These rules ensure optimal frontend testing workflow while respecting user preferences and technical limitations.
