# Contributing to POIA

Thank you for your interest in contributing to POIA! This document provides guidelines and instructions for contributing.

## 🚀 Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/yourusername/poia.git
   cd poia
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Set up environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## 📝 Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow existing code patterns
- Use meaningful variable names
- Add comments for complex logic
- Keep functions focused and small

### Commit Messages

Use clear, descriptive commit messages:
- `feat: Add new intent template`
- `fix: Resolve wallet connection issue`
- `docs: Update deployment guide`
- `refactor: Improve intent parser`

### Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, tested code
   - Update documentation if needed
   - Add tests for new features

3. **Test your changes**
   ```bash
   npm run build
   npm run lint
   ```

4. **Submit pull request**
   - Provide clear description
   - Reference related issues
   - Include screenshots if UI changes

## 🧪 Testing

- Write tests for new features
- Ensure all tests pass
- Test on both testnet and mainnet (when applicable)

## 📚 Documentation

- Update README.md for user-facing changes
- Update DEPLOYMENT_GUIDE.md for deployment changes
- Add code comments for complex logic

## 🐛 Reporting Issues

When reporting issues, please include:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Browser/OS information
- Screenshots if applicable

## 💡 Feature Requests

We welcome feature requests! Please:
- Check if the feature already exists
- Provide clear use case
- Explain the expected behavior
- Consider implementation complexity

## 🔒 Security

If you discover a security vulnerability:
- **DO NOT** open a public issue
- Email security@poia.app (or create private issue)
- Include detailed description
- Wait for response before disclosure

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to POIA! 🎉

