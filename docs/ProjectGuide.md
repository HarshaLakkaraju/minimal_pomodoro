# 🍅 Pomodoro Timer - Complete Project Master Guide

## 📋 Project Overview
- **Name**: Pomodoro Timer
- **Type**: Electron-based desktop app
- **Platform**: Windows (portable + installer)
- **Purpose**: Minimal floating productivity timer

## 🚀 Quick Start Commands

### Development
```bash
npm start                    # Run in development
npm run build-installer      # Build installer version
npm run build-portable       # Build portable version
npm run build-all           # Build both versions
npm run release             # Build and publish to GitHub
```

### Maintenance
```bash
npm run maintenance         # Update dependencies + security audit
node scripts/update-electron.js  # Safe Electron version update
npm audit fix               # Fix security vulnerabilities
```

## 📁 Project Structure
```
pomodoro-timer/
├── assets/
│   └── icon.ico           # App icon (256x256, multiple sizes)
├── sounds/
│   └── alarm.mp3          # Notification sound
├── scripts/               # Maintenance scripts
├── main.js               # Electron main process
├── timer.js              # Timer logic & UI interactions
├── index.html            # App interface
├── style.css             # Styling
├── package.json          # Dependencies & build config
└── README.md             # User documentation
```

## ⚙️ Build Configuration

### package.json Essentials
```json
{
  "dependencies": {
    "electron-updater": "^6.0.0"  // MUST be in dependencies!
  },
  "devDependencies": {
    "electron": "^29.0.0",
    "electron-builder": "^24.13.3"
  },
  "build": {
    "files": [
      "main.js", "timer.js", "index.html", "style.css",
      "assets/**/*", "sounds/**/*"
    ]
  }
}
```

### Critical Build Notes
- ✅ **electron-updater MUST be in `dependencies`** (not devDependencies)
- ✅ Icon: `assets/icon.ico` (256x256 with multiple sizes)
- ✅ Sound: `sounds/alarm.mp3` (fallback beep included)

## 🎯 Key Features Implemented

### Core Functionality
- [x] 25/45/60/90 minute presets
- [x] Floating always-on-top window
- [x] Play/pause/reset functionality
- [x] Audio notifications (5-second alarm)
- [x] Auto-update system

### Keyboard Shortcuts
```
Space = Play/Pause
R     = Reset timer  
M     = Toggle menu
C     = Cycle presets
S     = Stop alarm
U     = Check updates
```

### Auto-Update System
- Checks on app start
- Background downloads
- User notifications
- One-click restart to install

## 🔄 Release Process

### Version Bump & Release
```bash
# 1. Update version
npm version patch  # or minor/major

# 2. Test build locally
npm run build-installer
# Test the built installer!

# 3. Commit & push
git add .
git commit -m "release: v1.x.x - description"
git push

# 4. Publish release
npm run release
```

### Release Checklist
- [ ] Test all features work
- [ ] Verify auto-update in previous version
- [ ] Update version in package.json
- [ ] Build and test installer locally
- [ ] Update README if needed
- [ ] Create GitHub release

## 🛠️ Maintenance Schedule

### Monthly (15 minutes)
```bash
npm run maintenance      # Update deps + security audit
# Quick manual testing of all features
```

### Quarterly (30 minutes)
- Update Electron if needed: `node scripts/update-electron.js`
- Test on latest Windows version
- Check GitHub issues

### Yearly (1-2 hours)
- Major dependency updates
- Review build process
- Consider new Electron LTS

## 🐛 Common Issues & Fixes

### "electron-updater not found" Error
**Cause**: electron-updater in devDependencies
**Fix**: Move to dependencies in package.json

### Build Failures
1. Clear caches: `rmdir /s node_modules && del package-lock.json`
2. Reinstall: `npm install`
3. Check icon file exists: `assets/icon.ico`

### Auto-Update Not Working
1. Verify GitHub token: `echo %GH_TOKEN%`
2. Check repository URL in package.json
3. Ensure electron-updater in dependencies

## 🌐 Distribution Methods

### For Users
1. **GitHub Releases** (primary)
   - Users download `Pomodoro Timer Setup.exe`
   - Professional installer experience

2. **Portable Version**
   - `PomodoroTimer-Portable.exe`
   - No installation required

### GitHub Setup
1. **Repository**: `pomodoro-timer` (clear, searchable name)
2. **Token**: `GH_TOKEN` environment variable with repo permissions
3. **Releases**: Automatic via `npm run release`

## 📝 User Support

### Documentation Files
- `README.md` - Main user documentation
- `docs/INSTALLATION.md` - Installation guide
- `docs/USAGE.md` - How to use the app

### Common User Questions
- **"App won't start"** → Reinstall, check Windows Defender
- **"No sound"** → Check volume, audio output
- **"Auto-update failed"** → Manual download from releases

## 🔧 Maintenance Scripts

### scripts/update-electron.js
```javascript
// Safely updates Electron version
// Tests build after update
// Run quarterly or for security updates
```

### scripts/update-deps.js  
```javascript
// Updates all dependencies safely
// Runs security audit
// Use: npm run maintenance
```

### scripts/release.js
```javascript
// Interactive release process
// Version bump + build + publish
// Use: node scripts/release.js
```

## 💡 Pro Tips

### Development
- Test the actual built installer, not just `npm start`
- Keep auto-update code fault-tolerant
- Use semantic versioning: major.minor.patch

### User Experience  
- Minimal design = fewer bugs
- Clear error messages
- Silent failures where appropriate

### Long-term Maintenance
- Don't over-engineer features
- Annual Electron updates are sufficient
- Listen to user feedback for improvements

## 🚨 Emergency Fixes

### Critical Bug in Release
1. Immediately create hotfix branch
2. Fix the issue
3. Bump patch version
4. Release emergency update
5. Notify users via release notes

### Auto-Update Breaking
1. Remove auto-update code temporarily
2. Release stable version
3. Fix auto-update in next version

## 📊 Success Metrics

- **Downloads**: Monitor GitHub release downloads
- **Issues**: Address common user problems
- **Updates**: Auto-update adoption rate
- **Feedback**: User suggestions for improvements

---

## 🎯 Remember: The Goal
A **simple, reliable** Pomodoro timer that **just works**. Don't add unnecessary complexity. Focus on stability and user experience.

**Last Updated**: {Current Date}  
**Current Version**: 1.0.0  
**Next Maintenance Check**: {Date + 1 month}

---

## Long-Term Maintenance Strategy

### Maintenance Schedule:

**Monthly (15 minutes):**

- Check for security updates: `npm audit`
- Test the app still works
- Check GitHub issues

**Quarterly (30 minutes):**

- Update dependencies: `npm update`
- Test on latest Windows version
- Update documentation if needed

**Yearly (1-2 hours):**

- Consider Electron version update
- Review and update build process
- Major dependency updates

### Automated Maintenance Setup:

**Create `scripts/update-deps.js`:**

```jsx
const { execSync } = require('child_process');
const fs = require('fs');
const packageJson = require('../package.json');

console.log('🔍 Checking for outdated dependencies...');

try {
  // Check outdated packages
  const outdated = execSync('npm outdated --json', { encoding: 'utf8' });
  const outdatedJson = JSON.parse(outdated || '{}');

  if (Object.keys(outdatedJson).length === 0) {
    console.log('✅ All dependencies are up to date!');
    return;
  }

  console.log('📦 Outdated dependencies found:');
  Object.keys(outdatedJson).forEach(pkg => {
    const info = outdatedJson[pkg];
    console.log(`  ${pkg}: ${info.current} → ${info.latest}`);
  });

  // Update minor and patch versions safely
  console.log('🔄 Updating dependencies...');
  execSync('npm update', { stdio: 'inherit' });

  console.log('✅ Dependencies updated successfully!');

} catch (error) {
  console.error('❌ Update failed:', error.message);
}

```

**Add to package.json scripts:**

```json
{
  "scripts": {
    "update-deps": "node scripts/update-deps.js",
    "audit-fix": "npm audit fix",
    "maintenance": "npm run update-deps && npm run audit-fix"
  }
}

```

## 3. Electron Version Updates

### When to Update Electron:

**Update Immediately:**

- Security vulnerabilities in Electron
- Critical bug fixes
- Windows compatibility breaks

**Update Quarterly:**

- New Electron LTS versions
- Performance improvements
- New features you want to use

**Update Yearly:**

- Major version updates
- When Node.js version support changes

### Safe Update Process:

**Create `scripts/update-electron.js`:**

```jsx
const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔄 Checking Electron version...');

const currentVersion = JSON.parse(fs.readFileSync('package.json')).devDependencies.electron;
console.log(`Current Electron: ${currentVersion}`);

// Get latest version
try {
  const latestVersion = execSync('npm show electron version', { encoding: 'utf8' }).trim();
  console.log(`Latest Electron: ^${latestVersion}`);

  if (currentVersion.replace('^', '') !== latestVersion) {
    console.log('📥 Updating Electron...');
    execSync(`npm install --save-dev electron@^${latestVersion}`, { stdio: 'inherit' });
    console.log('✅ Electron updated successfully!');

    // Test build
    console.log('🧪 Testing build...');
    execSync('npm run build-installer', { stdio: 'inherit' });
    console.log('✅ Build test passed!');

  } else {
    console.log('✅ Electron is already up to date!');
  }
} catch (error) {
  console.error('❌ Update failed:', error.message);
}

```

## 4. Distribution to Other Users

### For Non-Technical Users:

**Method 1: GitHub Releases (Recommended)**

1. Create releases on GitHub
2. Users download `Pomodoro Timer Setup.exe`
3. They run it and follow installer

**Method 2: Microsoft Store (Advanced)**

- Package as MSIX for Windows Store
- Requires developer account ($19)

**Method 3: Direct Download**

- Host installer on your website
- Use services like Dropbox or Google Drive

### User Installation Process:

1. **Download**: Get `Pomodoro Timer Setup.exe` from GitHub releases
2. **Run**: Double-click the installer
3. **Install**: Follow setup wizard
4. **Launch**: Find in Start Menu or Desktop
5. **Use**: App runs automatically with auto-updates