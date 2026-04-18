import * as vscode from 'vscode'
import { promises as fs } from 'fs'
import { processUris, FileWithContent } from './fileProcessor'
import { PanelManager } from './panelManager'
import { addFiles } from './webview/messageHandler'
import { calculateOutputSize } from './outputGenerator/promptText'

/** Restore persisted file paths from workspaceState, re-reading content from disk. */
export async function restorePersistedFiles(context: vscode.ExtensionContext): Promise<void> {
  type PersistedFile = { path: string; absolutePath: string }
  const persisted = context.workspaceState.get<PersistedFile[]>('promptpacker.files', [])

  if (persisted.length === 0) {
    return
  }

  const restored: FileWithContent[] = []
  for (const entry of persisted) {
    try {
      const content = await fs.readFile(entry.absolutePath, 'utf-8')
      restored.push({ path: entry.path, content, absolutePath: entry.absolutePath })
    } catch {
      // File was deleted or moved — skip silently
    }
  }

  // Write back the restored set (drops any files that no longer exist)
  const persistedRestored = restored.map(f => ({ path: f.path, absolutePath: f.absolutePath }))
  await context.workspaceState.update('promptpacker.files', persistedRestored)
}

export function registerCommands(context: vscode.ExtensionContext): void {
  // promptpacker.addToPromptPacker — context menu on files/folders in Explorer
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'promptpacker.addToPromptPacker',
      async (clickedUri: vscode.Uri, selectedUris: vscode.Uri[]) => {
        const uris = selectedUris?.length ? selectedUris : [clickedUri]

        if (!uris || uris.length === 0) {
          vscode.window.showErrorMessage('PromptPacker: No files selected.')
          return
        }

        await vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Notification,
            title: 'PromptPacker: Processing files…',
            cancellable: false
          },
          async () => {
            const incoming = await processUris(uris)
            const panel = PanelManager.getOrCreate(context)
            panel // ensure panel is open
            await addFiles(context, incoming)
          }
        )
      }
    )
  )

  // promptpacker.openPanel — open/reveal the panel
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'promptpacker.openPanel',
      () => {
        const panel = PanelManager.getOrCreate(context)
        panel // ensure panel is revealed
        // State will be sent when webview fires 'ready'
      }
    )
  )

  // promptpacker.clearAll — clear files from panel and state
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'promptpacker.clearAll',
      async () => {
        await context.workspaceState.update('promptpacker.files', [])
        PanelManager.sendFileState([], calculateOutputSize([]))
        PanelManager.postMessage({ type: 'notification', kind: 'success', message: 'Cleared all files' })
      }
    )
  )
}
