# CLAUDE.md - AI Assistant Guide for Frontlines-Continuous

> **Status:** This repository is currently in initial setup phase. This document will be updated as the project develops.

## Overview

This document serves as a comprehensive guide for AI assistants (like Claude) working on the Frontlines-Continuous repository. It provides context about the codebase structure, development workflows, coding conventions, and best practices.

---

## Repository Information

- **Repository:** Frontlines-Continuous
- **Owner:** michaelgg1234
- **Current State:** Initial setup phase - no source code yet
- **Git Configuration:**
  - Commit signing: Enabled (SSH)
  - Remote origin: Configured and ready

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Development Workflow](#development-workflow)
3. [Git Workflow](#git-workflow)
4. [Coding Conventions](#coding-conventions)
5. [Testing Guidelines](#testing-guidelines)
6. [AI Assistant Guidelines](#ai-assistant-guidelines)
7. [Common Tasks](#common-tasks)
8. [Troubleshooting](#troubleshooting)

---

## Project Structure

### Current Structure
```
Frontlines-Continuous/
├── .git/              # Git repository metadata
└── CLAUDE.md          # This file
```

### Expected Structure (To Be Updated)
As the project develops, this section will be updated to reflect:
- Source code organization
- Configuration file locations
- Test directory structure
- Build artifacts and output directories
- Documentation locations

---

## Development Workflow

### Branch Strategy

**Development Branches:**
- AI-generated feature branches follow pattern: `claude/claude-md-<session-id>`
- Current branch: `claude/claude-md-mi28qvir9k9tsa37-01UjokYfGiUkboLUCNJ12doU`

**Important Rules:**
1. Always develop on the designated Claude branch
2. Never push to main/master without explicit permission
3. Create pull requests for merging changes

### Environment Setup

*To be documented once project dependencies are established*

Requirements:
- [ ] Programming language and version
- [ ] Package manager
- [ ] Development dependencies
- [ ] Environment variables
- [ ] Local development setup steps

---

## Git Workflow

### Commit Guidelines

**Commit Message Format:**
```
<type>: <short description>

<optional detailed description>

<optional footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `refactor`: Code refactoring
- `test`: Test additions or modifications
- `chore`: Maintenance tasks
- `style`: Code style changes (formatting, etc.)

**Best Practices:**
1. Write clear, descriptive commit messages
2. Keep commits focused and atomic
3. Reference issue numbers when applicable
4. Sign commits (automatically configured)

### Push Protocol

**Standard Push:**
```bash
git push -u origin <branch-name>
```

**Retry Logic for Network Issues:**
- Retry up to 4 times with exponential backoff
- Wait times: 2s, 4s, 8s, 16s between retries

**Critical Requirements:**
- Branch must start with `claude/`
- Branch must end with matching session ID
- Push will fail with 403 if naming convention is violated

### Pull Request Process

1. **Before Creating PR:**
   - Ensure all tests pass
   - Review your changes
   - Update documentation if needed
   - Check for merge conflicts

2. **PR Title Format:**
   ```
   [Type] Brief description of changes
   ```

3. **PR Description Should Include:**
   - Summary of changes
   - Motivation and context
   - Testing performed
   - Related issue numbers
   - Breaking changes (if any)

---

## Coding Conventions

### General Principles

1. **Code Quality:**
   - Write self-documenting code
   - Use meaningful variable and function names
   - Keep functions small and focused
   - Follow DRY (Don't Repeat Yourself)
   - Apply SOLID principles where applicable

2. **Security:**
   - Never commit secrets or credentials
   - Sanitize user inputs
   - Avoid common vulnerabilities (SQL injection, XSS, CSRF, etc.)
   - Follow OWASP Top 10 guidelines

3. **Performance:**
   - Optimize for readability first, performance second
   - Profile before optimizing
   - Document performance-critical sections

### Language-Specific Guidelines

*To be added based on project's primary language(s)*

---

## Testing Guidelines

### Testing Philosophy

*To be established based on project needs*

Expected coverage:
- Unit tests
- Integration tests
- End-to-end tests (if applicable)

### Running Tests

```bash
# Commands to be added once test framework is established
```

### Writing Tests

*Best practices and patterns to be documented*

---

## AI Assistant Guidelines

### Core Principles

1. **Understanding Before Action:**
   - Always read relevant files before editing
   - Understand the context and existing patterns
   - Ask clarifying questions when requirements are ambiguous

2. **Code Exploration:**
   - Use specialized tools (Read, Grep, Glob) for file operations
   - Use Task tool with Explore agent for broad codebase exploration
   - Avoid guessing file locations - search systematically

3. **Task Management:**
   - Always use TodoWrite for multi-step tasks
   - Mark tasks in_progress before starting
   - Mark tasks completed immediately after finishing
   - Only one task should be in_progress at a time

4. **Safety First:**
   - Never run destructive commands without confirmation
   - Review security implications of code changes
   - Test changes before committing
   - Never skip git hooks or force push without explicit permission

### Tool Usage Preferences

**File Operations:**
- `Read` - for reading files (not `cat`)
- `Edit` - for editing files (not `sed`/`awk`)
- `Write` - for creating new files (not `echo >`)
- `Grep` - for searching file contents (not `grep`/`rg` via Bash)
- `Glob` - for finding files by pattern (not `find`/`ls`)

**Code Exploration:**
- Use `Task` tool with `subagent_type: Explore` for understanding codebase structure
- Use parallel tool calls when operations are independent
- Use sequential calls when operations have dependencies

### Communication Style

1. **Concise and Clear:**
   - Keep responses focused and actionable
   - Use markdown for formatting
   - Avoid unnecessary emojis unless requested

2. **Technical Accuracy:**
   - Prioritize correctness over validation
   - Provide objective, factual information
   - Disagree respectfully when necessary

3. **Progress Visibility:**
   - Keep user informed of progress
   - Use todos to show task breakdown
   - Explain decisions and trade-offs

### Common Patterns

#### Investigating Issues
```markdown
1. Reproduce the issue (if applicable)
2. Use Grep/Glob to locate relevant code
3. Read affected files
4. Analyze root cause
5. Propose solution
6. Implement fix
7. Test fix
8. Commit changes
```

#### Adding New Features
```markdown
1. Understand requirements (ask questions if needed)
2. Explore existing similar features
3. Plan implementation using TodoWrite
4. Implement incrementally
5. Test thoroughly
6. Update documentation
7. Commit and push
8. Create pull request
```

#### Refactoring
```markdown
1. Understand current implementation
2. Identify improvement opportunities
3. Plan refactoring steps
4. Make changes incrementally
5. Ensure tests still pass
6. Verify no behavior changes
7. Commit with clear description
```

---

## Common Tasks

### Starting Work on a New Feature

```bash
# Ensure you're on the correct Claude branch
git status

# Pull latest changes
git fetch origin claude/claude-md-mi28qvir9k9tsa37-01UjokYfGiUkboLUCNJ12doU
git pull origin claude/claude-md-mi28qvir9k9tsa37-01UjokYfGiUkboLUCNJ12doU

# Start implementation
# (Use TodoWrite to plan your work)
```

### Creating a Commit

```bash
# Stage relevant files
git add <files>

# Check what will be committed
git status
git diff --staged

# Create commit with descriptive message
git commit -m "$(cat <<'EOF'
feat: Add feature description

Detailed explanation of changes and why they were made.
EOF
)"

# Verify commit
git log -1
```

### Pushing Changes

```bash
# Push to your Claude branch
git push -u origin claude/claude-md-mi28qvir9k9tsa37-01UjokYfGiUkboLUCNJ12doU
```

---

## Troubleshooting

### Git Issues

**Problem:** Push fails with 403 error
**Solution:** Verify branch name starts with `claude/` and ends with correct session ID

**Problem:** Merge conflicts
**Solution:**
```bash
git fetch origin
git status
# Resolve conflicts manually in affected files
git add <resolved-files>
git commit
```

**Problem:** Network timeout during push/pull
**Solution:** Retry with exponential backoff (automated in workflow)

### Build/Test Issues

*To be documented as project develops*

---

## Project-Specific Notes

### Key Decisions and Architecture

*This section will be populated as architectural decisions are made*

- [ ] Technology stack selection
- [ ] Database choice
- [ ] API design patterns
- [ ] State management approach
- [ ] Authentication/authorization strategy

### Dependencies and Services

*To be documented*

### Known Issues and Limitations

*To be tracked*

---

## Updates and Maintenance

**Last Updated:** 2025-11-16
**Updated By:** Claude (Initial creation)

### Change Log

- **2025-11-16:** Initial CLAUDE.md created for empty repository
  - Established document structure
  - Defined git workflow conventions
  - Created AI assistant guidelines
  - Set up templates for future documentation

---

## Next Steps for Development

When starting actual project development, update this document with:

1. **Project Setup:**
   - [ ] Add README.md with project description
   - [ ] Choose and document technology stack
   - [ ] Set up package manager and dependencies
   - [ ] Configure development environment

2. **Code Organization:**
   - [ ] Establish directory structure
   - [ ] Define module/component organization
   - [ ] Set up configuration management

3. **Development Tools:**
   - [ ] Configure linting and formatting
   - [ ] Set up testing framework
   - [ ] Add pre-commit hooks
   - [ ] Configure CI/CD pipeline

4. **Documentation:**
   - [ ] Add API documentation
   - [ ] Create contribution guidelines
   - [ ] Add license file
   - [ ] Document deployment process

5. **Update This File:**
   - [ ] Fill in language-specific conventions
   - [ ] Add actual build/test commands
   - [ ] Document project structure
   - [ ] Add troubleshooting entries based on real issues

---

## Resources

### Documentation Links
*To be added*

### Related Repositories
*To be added*

### Contact Information
*To be added*

---

**Note to AI Assistants:** This document should be treated as the source of truth for working with this repository. When in doubt, refer to these guidelines. If you discover patterns or conventions not documented here, suggest updates to keep this file current and useful.
