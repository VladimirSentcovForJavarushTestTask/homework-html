# Installing Node.js and npm on macOS, Linux, and Windows

This guide covers the recommended steps to install **Node.js** and **npm** (Node Package Manager) across macOS, Linux,
and Windows.

---

## 📦 What Are Node.js and npm?

- **Node.js**: A JavaScript runtime built on Chrome’s V8 engine.
- **npm**: The default package manager for Node.js, used to manage JavaScript packages.

---

## ✅ Install on macOS

### Option 1: Using Homebrew (Recommended)

1. Install Homebrew if you haven't already:

   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. Install Node.js:

   ```bash
   brew install node
   ```

3. Verify installation:

   ```bash
   node -v
   npm -v
   ```

---

### Option 2: From Node.js Website

1. Go to [https://nodejs.org](https://nodejs.org)
2. Download the **macOS Installer (.pkg)**
3. Run the installer and follow the steps
4. Verify:

   ```bash
   node -v
   npm -v
   ```

---

## ✅ Install on Linux

### Option 1: Using NodeSource Binaries (Recommended)

#### For Debian/Ubuntu-based systems:

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### For RHEL/CentOS/Fedora:

```bash
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs
```

(You can change `18.x` to the desired version.)

#### Verify installation:

```bash
node -v
npm -v
```

---

### Option 2: Using nvm (Node Version Manager)

1. Install `nvm`:

   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
   ```

   Then reload shell:

   ```bash
   source ~/.nvm/nvm.sh
   ```

2. Install Node.js:

   ```bash
   nvm install node        # Latest version
   nvm install 18          # Specific version (example: 18)
   ```

3. Use a version:

   ```bash
   nvm use 18
   ```

4. Verify:

   ```bash
   node -v
   npm -v
   ```

---

## ✅ Install on Windows

### Option 1: Windows Installer

1. Go to [https://nodejs.org](https://nodejs.org)
2. Download the **Windows Installer (.msi)**
3. Run the installer:
    - Choose "Next"
    - Accept license
    - Keep default settings
    - Install tools for native modules (optional but recommended)
4. Restart your machine if prompted

5. Verify:

   Open **Command Prompt** or **PowerShell**:

   ```cmd
   node -v
   npm -v
   ```

---

### Option 2: Using `nvm-windows` (Manage multiple versions)

1. Download
   from: [https://github.com/coreybutler/nvm-windows/releases](https://github.com/coreybutler/nvm-windows/releases)
2. Install `.exe` file (not the zip)
3. Use it:

   ```cmd
   nvm install 18.17.1
   nvm use 18.17.1
   node -v
   npm -v
   ```

---

## 🔧 Troubleshooting

- If `node` is not found:
    - Ensure your `PATH` includes the Node.js install directory.
    - Restart terminal or computer.
- Use `nvm` or `nvm-windows` if you need to manage multiple versions.

---

## 🧪 Verify Node & npm

```bash
node -v   # e.g. v18.17.1
npm -v    # e.g. 9.8.1
```

You’re all set! 🎉
