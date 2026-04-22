import { FileWithContent } from '../fileProcessor'

export function generatePromptText(files: FileWithContent[]): string {
  const parts = files.map(file => `*** ${file.path} ***\n${file.content}\n\n`)
  return '======== FILES ========\n' + parts.join('')
}

export function calculateOutputSize(files: FileWithContent[]): number {
  const HEADER_LEN = '======== FILES ========\n'.length
  let size = HEADER_LEN
  for (const file of files) {
    // "*** " (4) + path + " ***\n" (5) + content + "\n\n" (2)
    size += 4 + file.path.length + 5 + file.content.length + 2
  }
  return size
}
