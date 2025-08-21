"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { Bold, Italic, Underline, Link, List, AlignLeft, AlignCenter, AlignRight } from "lucide-react"

interface InlineTextEditorProps {
  initialContent?: string
  onChange?: (content: string) => void
  placeholder?: string
  className?: string
}

interface FloatingToolbarProps {
  isVisible: boolean
  position: { top: number; left: number }
  onCommand: (command: string, value?: string) => void
}

const FloatingToolbar: React.FC<FloatingToolbarProps> = ({ isVisible, position, onCommand }) => {
  if (!isVisible) return null

  const toolbarButtons = [
    { icon: Bold, command: "bold", title: "Bold (Ctrl+B)" },
    { icon: Italic, command: "italic", title: "Italic (Ctrl+I)" },
    { icon: Underline, command: "underline", title: "Underline (Ctrl+U)" },
    { icon: Link, command: "createLink", title: "Link", requiresValue: true },
    { icon: List, command: "insertUnorderedList", title: "Bullet List" },
    { icon: AlignLeft, command: "justifyLeft", title: "Align Left" },
    { icon: AlignCenter, command: "justifyCenter", title: "Align Center" },
    { icon: AlignRight, command: "justifyRight", title: "Align Right" },
  ]

  return (
    <div
      className="fixed z-50 bg-gray-900 text-white rounded-lg shadow-lg border border-gray-700 flex items-center p-1 animate-in fade-in-0 zoom-in-95 duration-200"
      style={{
        top: position.top - 50,
        left: Math.max(10, position.left - 100),
      }}
    >
      {toolbarButtons.map((button, index) => (
        <button
          key={index}
          type="button"
          onMouseDown={(e) => {
            // Prevent default to avoid losing selection
            e.preventDefault()
          }}
          onClick={(e) => {
            e.preventDefault()
            if (button.requiresValue) {
              const value = prompt(`Enter ${button.title.toLowerCase()}:`)
              if (value) onCommand(button.command, value)
            } else {
              onCommand(button.command)
            }
          }}
          className="p-2 rounded hover:bg-gray-700 transition-colors"
          title={button.title}
        >
          <button.icon className="w-4 h-4" />
        </button>
      ))}
    </div>
  )
}

const InlineTextEditor: React.FC<InlineTextEditorProps> = ({
  initialContent = "",
  onChange,
  placeholder = "Start writing your email content...",
  className = "",
}) => {
  const [showToolbar, setShowToolbar] = useState(false)
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 })
  const [hasContent, setHasContent] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout>(null)
  const isInitialized = useRef(false)

  // Initialize content only once
  useEffect(() => {
    if (!isInitialized.current && editorRef.current && initialContent) {
      editorRef.current.innerHTML = initialContent
      setHasContent(!!initialContent.trim())
      isInitialized.current = true
    }
  }, [initialContent])

  const checkContent = useCallback(() => {
    if (editorRef.current) {
      const textContent = editorRef.current.textContent || ""
      const innerHTML = editorRef.current.innerHTML || ""

      // Check if there's actual content (not just empty tags)
      const hasActualContent =
        textContent.trim().length > 0 ||
        innerHTML.includes("<img") ||
        innerHTML.includes("<br>") ||
        innerHTML.includes("<div>") ||
        innerHTML.includes("<p>")

      setHasContent(hasActualContent)
      return hasActualContent
    }
    return false
  }, [])

  const handleSelectionChange = useCallback(() => {
    const selection = window.getSelection()

    if (!selection || selection.isCollapsed || !selection.toString().trim()) {
      setShowToolbar(false)
      return
    }

    // Make sure the selection is within our editor
    const editorElement = editorRef.current
    if (!editorElement || !editorElement.contains(selection.anchorNode)) {
      setShowToolbar(false)
      return
    }

    const range = selection.getRangeAt(0)
    const rect = range.getBoundingClientRect()

    if (rect.width > 0 && rect.height > 0) {
      setToolbarPosition({
        top: rect.top + window.scrollY - 50,
        left: rect.left + rect.width / 2,
      })
      setShowToolbar(true)
    }
  }, [])

  const executeCommand = useCallback(
    (command: string, value?: string) => {
      // Save current selection
      const selection = window.getSelection()
      const range = selection?.getRangeAt(0)

      document.execCommand(command, false, value)

      // Restore focus and selection
      if (editorRef.current) {
        editorRef.current.focus()
        if (range && selection) {
          selection.removeAllRanges()
          selection.addRange(range)
        }
      }

      // Update content and check for changes
      setTimeout(() => {
        if (editorRef.current) {
          checkContent()
          onChange?.(editorRef.current.innerHTML)
        }
      }, 10)
    },
    [onChange, checkContent],
  )

  const handleInput = useCallback(
    (e: React.FormEvent<HTMLDivElement>) => {
      const target = e.target as HTMLDivElement

      // Check content immediately for placeholder
      checkContent()

      // Debounce the onChange call
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        onChange?.(target.innerHTML)
      }, 150)
    },
    [onChange, checkContent],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      // Handle keyboard shortcuts
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "b":
            e.preventDefault()
            executeCommand("bold")
            break
          case "i":
            e.preventDefault()
            executeCommand("italic")
            break
          case "u":
            e.preventDefault()
            executeCommand("underline")
            break
        }
      }
    },
    [executeCommand],
  )

  const handleMouseUp = useCallback(() => {
    // Small delay to ensure selection is complete
    setTimeout(handleSelectionChange, 10)
  }, [handleSelectionChange])

  const handleFocus = useCallback(() => {
    checkContent()
  }, [checkContent])

  const handleBlur = useCallback(() => {
    // Hide toolbar when editor loses focus, but with a delay
    // to allow toolbar clicks to register
    setTimeout(() => {
      setShowToolbar(false)
    }, 200)
  }, [])

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLDivElement>) => {
      // Allow default paste behavior
      setTimeout(() => {
        checkContent()
        if (editorRef.current) {
          onChange?.(editorRef.current.innerHTML)
        }
      }, 10)
    },
    [onChange, checkContent],
  )

  useEffect(() => {
    const handleDocumentSelectionChange = () => {
      if (document.activeElement === editorRef.current) {
        handleSelectionChange()
      } else {
        setShowToolbar(false)
      }
    }

    document.addEventListener("selectionchange", handleDocumentSelectionChange)

    return () => {
      document.removeEventListener("selectionchange", handleDocumentSelectionChange)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [handleSelectionChange])

  return (
    <>
      <div className=" rounded-lg overflow-hidden bg-white h-full relative">
        
        <div
          ref={editorRef}
          contentEditable
          className={`p-6 min-h-[400px] prose prose-sm focus:outline-none text-gray-900 leading-relaxed relative ${className}`}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onMouseUp={handleMouseUp}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onPaste={handlePaste}
          suppressContentEditableWarning={true}
          style={{
            minHeight: "400px",
            lineHeight: "1.6",
          }}
        />

        {/* Placeholder */}
        {!hasContent && (
          <div className="absolute top-6 left-6 text-gray-400 pointer-events-none select-none text-base">
            {placeholder}
          </div>
        )}
      </div>

      <FloatingToolbar isVisible={showToolbar} position={toolbarPosition} onCommand={executeCommand} />
    </>
  )
}

export default InlineTextEditor
