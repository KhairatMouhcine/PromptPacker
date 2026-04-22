export class GitignoreParser {
  private patterns: Array<{ pattern: string; isNegation: boolean; isDirectory: boolean; anchored: boolean }> = []
  private basePath: string

  constructor(basePath: string) {
    this.basePath = basePath
  }

  addRules(gitignoreContent: string) {
    const lines = gitignoreContent.split('\n')

    for (const line of lines) {
      const trimmed = line.trim()

      // Skip empty lines and comments
      if (!trimmed || trimmed.startsWith('#')) {
        continue
      }

      let pattern = trimmed
      let isNegation = false
      let isDirectory = false
      let anchored = false

      // Handle negation patterns (starting with !)
      if (pattern.startsWith('!')) {
        isNegation = true
        pattern = pattern.substring(1)
      }

      // Handle directory patterns (ending with /)
      if (pattern.endsWith('/')) {
        isDirectory = true
        pattern = pattern.slice(0, -1)
      }

      // Leading / anchors to root; a / in the middle also anchors (e.g. src/build)
      if (pattern.startsWith('/')) {
        anchored = true
        pattern = pattern.substring(1)
      } else if (pattern.includes('/')) {
        anchored = true
      }

      // Escape regex special chars, then convert gitignore wildcards:
      // ** must be handled before * to avoid double-substitution
      // * matches within a single path segment (no slash crossing)
      // ? matches one character but not a slash
      pattern = pattern
        .replace(/[.+^${}()|[\]\\]/g, '\\$&')
        .replace(/\*\*/g, '\x00')
        .replace(/\*/g, '[^/]*')
        .replace(/\?/g, '[^/]')
        .replace(/\x00/g, '.*')

      this.patterns.push({ pattern, isNegation, isDirectory, anchored })
    }
  }

  shouldIgnore(relativePath: string): boolean {
    let pathFromGitignore: string

    if (this.basePath === '' || this.basePath === '.') {
      // Root .gitignore: path is already relative to it
      pathFromGitignore = relativePath
    } else if (relativePath.startsWith(this.basePath + '/')) {
      pathFromGitignore = relativePath.substring(this.basePath.length + 1)
    } else {
      // Path is outside this .gitignore's scope
      return false
    }

    if (!pathFromGitignore) {
      return false
    }

    let shouldIgnore = false

    for (const { pattern, isNegation, isDirectory, anchored } of this.patterns) {
      let matches = false

      try {
        const pathParts = pathFromGitignore.split('/')

        if (isDirectory) {
          if (anchored) {
            // Anchored dir: only match at the specific rooted path
            const regex = new RegExp(`^${pattern}(/.*)?$`)
            matches = regex.test(pathFromGitignore)
          } else {
            // Non-anchored dir: match the directory name at any depth
            const regex = new RegExp(`(^|/)${pattern}(/|$)`)
            matches = regex.test(pathFromGitignore)
          }
        } else {
          if (anchored) {
            const regex = new RegExp(`^${pattern}$`)
            matches = regex.test(pathFromGitignore)
          } else {
            const regex = new RegExp(`^${pattern}$`)
            // Match full path, filename only, or any path suffix
            matches = regex.test(pathFromGitignore) ||
                     regex.test(pathParts[pathParts.length - 1]) ||
                     pathParts.some((_, index) => regex.test(pathParts.slice(index).join('/')))
          }
        }

        if (matches) {
          shouldIgnore = !isNegation
        }
      } catch (error) {
        console.warn(`Invalid gitignore pattern: ${pattern}`, error)
      }
    }

    return shouldIgnore
  }
}
