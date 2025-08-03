# Contributing to Geo-Temporal Weather Dashboard

Thank you for your interest in contributing to this project! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 18.17 or later
- npm 9.0 or later
- Git
- Basic knowledge of React, TypeScript, and Next.js

### Development Setup

1. **Fork and Clone**
```bash
git clone https://github.com/yourusername/geo-temporal-dashboard.git
cd geo-temporal-dashboard
```

2. **Install Dependencies**
```bash
npm install
```

3. **Environment Setup**
```bash
cp .env.example .env.local
```

4. **Start Development Server**
```bash
npm run dev
```

## 📝 Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow the existing code patterns and structure
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Ensure proper error handling

### Component Guidelines
- Use functional components with hooks
- Implement proper TypeScript types
- Follow the existing component structure
- Use Tailwind CSS for styling
- Ensure components are responsive

### State Management
- Use Zustand for global state
- Keep local state minimal
- Implement proper persistence where needed
- Follow the existing store patterns

### Performance
- Use React.memo for expensive components
- Implement proper loading states
- Optimize images and assets
- Minimize bundle size

## 🧪 Testing

### Before Submitting
```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build test
npm run build
```

### Code Quality
- Ensure TypeScript compilation passes
- Fix all ESLint warnings and errors
- Test on multiple screen sizes
- Verify accessibility standards

## 📋 Pull Request Process

### 1. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 2. Make Your Changes
- Follow the development guidelines
- Write clear, concise commit messages
- Test your changes thoroughly

### 3. Commit Guidelines
Use conventional commits:
```bash
feat: add new feature
fix: resolve bug
docs: update documentation
style: formatting changes
refactor: code restructuring
test: add tests
chore: maintenance tasks
```

### 4. Submit Pull Request
- Provide a clear description of changes
- Reference any related issues
- Include screenshots for UI changes
- Ensure all checks pass

## 🐛 Bug Reports

### Before Reporting
- Check existing issues
- Reproduce the bug consistently
- Test in different browsers/devices

### Bug Report Template
```markdown
**Describe the bug**
A clear description of the bug.

**To Reproduce**
Steps to reproduce the behavior.

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. iOS]
- Browser: [e.g. chrome, safari]
- Version: [e.g. 22]
```

## 💡 Feature Requests

### Feature Request Template
```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Alternative solutions or features you've considered.

**Additional context**
Any other context or screenshots about the feature request.
```

## 📚 Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://reactjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Project-Specific
- [Open-Meteo API Documentation](https://open-meteo.com/en/docs)
- [React-Leaflet Documentation](https://react-leaflet.js.org/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

## 🤝 Community

### Communication
- Use GitHub Issues for bug reports and feature requests
- Be respectful and constructive in discussions
- Help others when possible

### Recognition
Contributors will be recognized in the project README and release notes.

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to make this project better! 🎉
