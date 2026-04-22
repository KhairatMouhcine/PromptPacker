# <img src="media/icon.png" width="48" align="center"> PromptPacker for VS Code

Combine files and folders into a single AI-ready prompt, directly from your editor.

## What it does

Select files or folders in the Explorer, click **Add to PromptPacker**, and get a formatted text prompt ready to paste into ChatGPT, Claude, Gemini, or any AI tool. No browser needed.

Output format:
```
======== FILES ========
*** src/index.ts ***
<file content>

*** src/utils.ts ***
<file content>
```

## Install (From Source)

Currently, the extension is not published to the VS Code Marketplace. You must install it locally from the source code.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/KhairatMouhcine/PromptPacker.git
   cd PromptPacker
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Build the extension:**
   ```bash
   npm run build
   ```
4. **Package and Install:**
   - Install the packaging tool: `npm install -g @vscode/vsce`
   - Create the `.vsix` package: `vsce package`
   - In VS Code, go to `Extensions` → `...` → `Install from VSIX…` and select the generated `.vsix` file.

*(Alternatively, press `F5` in VS Code to run it in a development window.)*

## Usage

### Add files
Right-click any file or folder in the Explorer panel → **Add to PromptPacker**

Multi-select files with `Ctrl+Click`, then right-click → **Add to PromptPacker**

### Open the panel
`Ctrl+Shift+P` → **PromptPacker: Open Panel**

The status bar shows the current file count: `$(files) PromptPacker: 3 files`

### Export your prompt
From the PromptPacker panel:
- **Copy to Clipboard** — copies the plain-text prompt
- **Download .txt** — saves as `promptpacker-output.txt`
- **Download .md** — saves as `promptpacker-output.md` with fenced code blocks

### Remove files
Click the **✕** button next to any file in the panel, or use **Clear All**.

## Supported file types

- **Code**: `.js`, `.jsx`, `.ts`, `.tsx`, `.py`, `.java`, `.rb`, `.php`, `.go`, `.rs`, `.c`, `.cpp`, `.cs`, `.swift`, `.kt`, `.scala`, `.dart`, `.lua`, and more
- **Web**: `.html`, `.css`, `.scss`, `.json`, `.xml`, `.yaml`, `.graphql`
- **Config**: `.env`, `.toml`, `.ini`, `.tf`, `.proto`
- **Documents**: `.pdf`, `.docx`, `.pptx`, `.xlsx`, `.xls`
- **Markdown / text**: `.md`, `.txt`, `.tex`
- **Data**: `.csv`, `.tsv`, `.sql`

Automatically skips: `node_modules`, `.git`, `dist`, `build`, `.next`, `__pycache__`, and files matched by `.gitignore`.

## Notes

- Files are kept in the panel until you close VS Code (stored in workspace state)
- `.gitignore` rules in uploaded folders are respected
- Document files (PDF, DOCX, PPTX, XLSX) are processed locally — no data leaves your machine

## Author

<img src="https://avatars.githubusercontent.com/KhairatMouhcine?v=4" width="100" style="border-radius: 50%;">

**Mouhcine Khairat** - [GitHub](https://github.com/KhairatMouhcine)

## License

MIT — part of the [PromptPacker](https://github.com/KhairatMouhcine/PromptPacker) project
