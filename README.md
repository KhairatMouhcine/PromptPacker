# <img src="media/icon.png" width="48" align="center"> PromptPacker for VS Code

Combine files and folders into a single AI-ready prompt, directly from your editor.

> **This extension is not published on the VS Code Marketplace.**
> You must clone and build it locally. See [Installation](#installation) below.

---

## What it does

Right-click any file or folder in the Explorer → **Add to PromptPacker** → get a formatted block of text ready to paste into ChatGPT, Claude, Gemini, or any AI tool.

**Plain text output:**
```
======== FILES ========
*** src/index.ts ***
<file content>

*** src/utils.ts ***
<file content>
```

**Markdown output** (`.md` download): uses fenced code blocks with language hints.

---

## Installation

Since the extension is not on the Marketplace, you need to clone the repo, build it, and install the generated `.vsix` file manually. This takes about 2 minutes.

### Prerequisites

- [Node.js](https://nodejs.org) v18 or later
- [Git](https://git-scm.com)
- VS Code 1.85 or later

### Steps

**1. Clone the repository**
```bash
git clone https://github.com/KhairatMouhcine/PromptPacker.git
cd PromptPacker
```

**2. Install dependencies**
```bash
npm install
```

**3. Build the extension**
```bash
npm run build
```

**4. Package into a `.vsix` file**
```bash
npm install -g @vscode/vsce
vsce package --no-dependencies
```
This generates a file named `promptpacker-vscode-x.x.x.vsix` in the project folder.

**5. Install in VS Code**

Open VS Code, then either:
- Go to **Extensions** (`Ctrl+Shift+X`) → click the **`···`** menu (top-right) → **Install from VSIX…** → select the `.vsix` file
- Or run in your terminal:
  ```bash
  code --install-extension promptpacker-vscode-*.vsix
  ```

**6. Reload VS Code**

Press `Ctrl+Shift+P` → **Developer: Reload Window**

---

## Usage

### Add files to the prompt
Right-click any file or folder in the Explorer panel → **Add to PromptPacker**

Multi-select with `Ctrl+Click`, then right-click → **Add to PromptPacker**

Whole folders are walked recursively — ignored paths and `.gitignore` rules are respected automatically.

### Open the panel
`Ctrl+Shift+P` → **PromptPacker: Open Panel**

Or click the status bar item: `$(files) PromptPacker: 3 files`

### Export your prompt
From the PromptPacker panel:
| Button | Action |
|---|---|
| **Copy to Clipboard** | Copies the plain-text prompt |
| **Download .txt** | Saves as `promptpacker-output.txt` |
| **Download .md** | Saves as `promptpacker-output.md` with fenced code blocks |

### Remove files
Click **✕** next to any file, or **Clear All** to reset.

---

## Supported file types

| Category | Extensions |
|---|---|
| Code | `.js` `.jsx` `.ts` `.tsx` `.py` `.java` `.rb` `.php` `.go` `.rs` `.c` `.cpp` `.cs` `.swift` `.kt` `.scala` `.dart` `.lua` … |
| Web | `.html` `.css` `.scss` `.json` `.xml` `.yaml` `.graphql` |
| Config | `.env` `.toml` `.ini` `.tf` `.tfvars` `.hcl` `.proto` |
| Documents | `.pdf` `.docx` `.pptx` `.xlsx` `.xls` |
| Text / Docs | `.md` `.txt` `.tex` |
| Data | `.csv` `.tsv` `.sql` |
| Shell / Scripts | `.sh` `.bash` `.zsh` `.ps1` `.bat` |

**Automatically skipped:** `node_modules`, `.git`, `dist`, `build`, `.next`, `__pycache__`, and any path matched by `.gitignore`.

---

## Notes

- Files persist in the panel across sessions (stored in workspace state)
- Document files (PDF, DOCX, PPTX, XLSX) are extracted locally — no data leaves your machine
- `.gitignore` rules in selected folders are fully respected

---

## Author

<img src="https://avatars.githubusercontent.com/KhairatMouhcine?v=4" width="80" style="border-radius:50%">

**Mouhcine Khairat** · [GitHub](https://github.com/KhairatMouhcine)

## License

MIT — [PromptPacker](https://github.com/KhairatMouhcine/PromptPacker)
