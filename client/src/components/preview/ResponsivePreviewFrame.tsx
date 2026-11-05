import React, { useState, useRef, useEffect, useCallback } from "react"
import { createPortal } from "react-dom"

export interface ResponsivePreviewFrameProps {
  children: React.ReactNode
  device: "desktop" | "tablet" | "mobile"
  isDark?: boolean
  className?: string
  title?: string
}

export function ResponsivePreviewFrame({
  children,
  device = "desktop",
  isDark = false,
  className = "",
  title = "Device Preview",
}: ResponsivePreviewFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null)
  const [isReady, setIsReady] = useState(false)

  // Synchronize stylesheets, preconnects, and style tags from host document
  const syncStyles = useCallback((doc: Document) => {
    // Clone all style elements and stylesheet links from parent head
    const parentStyles = Array.from(
      document.querySelectorAll(
        "link[rel='stylesheet'], link[rel='preconnect'], style"
      )
    )

    // Remove old injected style tags to prevent duplicate bloat
    const existing = Array.from(
      doc.head.querySelectorAll("[data-injected-preview='true']")
    )
    existing.forEach((el) => el.remove())

    parentStyles.forEach((node) => {
      const clone = node.cloneNode(true) as HTMLElement
      clone.setAttribute("data-injected-preview", "true")
      doc.head.appendChild(clone)
    })
  }, [])

  // Synchronize document attributes, theme class, and viewport settings
  const syncDocAttributes = useCallback((doc: Document, dark: boolean) => {
    // Viewport meta is critical for media queries to evaluate against iframe width
    if (!doc.head.querySelector("meta[name='viewport']")) {
      const meta = doc.createElement("meta")
      meta.name = "viewport"
      meta.content = "width=device-width, initial-scale=1.0"
      doc.head.appendChild(meta)
    }

    if (!doc.head.querySelector("meta[charset]")) {
      const meta = doc.createElement("meta")
      meta.setAttribute("charset", "UTF-8")
      doc.head.appendChild(meta)
    }

    // Set dark theme class and color-scheme on root html element
    if (dark) {
      doc.documentElement.classList.add("dark")
      doc.documentElement.setAttribute("data-mode", "dark")
      doc.documentElement.style.colorScheme = "dark"
    } else {
      doc.documentElement.classList.remove("dark")
      doc.documentElement.setAttribute("data-mode", "light")
      doc.documentElement.style.colorScheme = "light"
    }

    doc.documentElement.style.height = "100%"
    doc.documentElement.style.scrollBehavior = "smooth"
    doc.documentElement.style.overflowX = "hidden"

    doc.body.style.margin = "0"
    doc.body.style.padding = "0"
    doc.body.style.minHeight = "100%"
    doc.body.style.height = "100%"
    doc.body.style.overflowY = "auto"
    doc.body.style.overflowX = "hidden"
    doc.body.style.backgroundColor = "transparent"
  }, [])

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    const initIframe = () => {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document
        if (!doc) return

        syncStyles(doc)
        syncDocAttributes(doc, isDark)
        setMountNode(doc.body)
        setIsReady(true)
      } catch (err) {
        console.error("Failed to initialize responsive preview iframe:", err)
      }
    }

    if (iframe.contentDocument?.readyState === "complete") {
      initIframe()
    } else {
      iframe.addEventListener("load", initIframe)
    }

    // Observe document.head for dynamically injected styles (e.g. Vite HMR or async font loads)
    const observer = new MutationObserver(() => {
      const doc = iframe.contentDocument || iframe.contentWindow?.document
      if (doc) {
        syncStyles(doc)
      }
    })
    observer.observe(document.head, { childList: true, subtree: true })

    return () => {
      iframe.removeEventListener("load", initIframe)
      observer.disconnect()
    }
  }, [syncStyles, syncDocAttributes, isDark])

  // Sync dark mode changes immediately
  useEffect(() => {
    const iframe = iframeRef.current
    const doc = iframe?.contentDocument || iframe?.contentWindow?.document
    if (doc) {
      syncDocAttributes(doc, isDark)
    }
  }, [isDark, syncDocAttributes])

  // Width & frame configurations per device
  const frameConfig = {
    mobile: {
      widthClass: "w-[390px] max-w-full",
      heightClass: "h-[calc(100vh-140px)] min-h-[580px] max-h-[844px]",
      outerClass: "rounded-[32px] border-[6px] border-neutral-800 dark:border-neutral-600 shadow-2xl",
      hasSpeakerBar: true,
    },
    tablet: {
      widthClass: "w-[768px] max-w-full",
      heightClass: "h-[calc(100vh-140px)] min-h-[640px] max-h-[1024px]",
      outerClass: "rounded-[24px] border-[6px] border-neutral-800 dark:border-neutral-600 shadow-2xl",
      hasSpeakerBar: true,
    },
    desktop: {
      widthClass: "w-full max-w-6xl",
      heightClass: "h-[calc(100vh-140px)] min-h-[640px]",
      outerClass: "rounded-card border border-[var(--color-rule)] shadow-[var(--shadow-card)]",
      hasSpeakerBar: false,
    },
  }[device]

  return (
    <div
      className={`relative mx-auto flex flex-col bg-[var(--color-paper)] overflow-hidden transition-[width,max-width,border-radius] duration-200 ease-out ${frameConfig.widthClass} ${frameConfig.heightClass} ${frameConfig.outerClass} ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Device chrome top bar for mobile and tablet simulation */}
      {frameConfig.hasSpeakerBar && (
        <div className="h-6 w-full bg-neutral-800 dark:bg-neutral-600 flex items-center justify-center shrink-0 select-none">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-600 dark:bg-neutral-400" />
            <span className="w-12 h-1 rounded-full bg-neutral-700 dark:bg-neutral-500" />
          </div>
        </div>
      )}

      {/* Embedded Iframe Context */}
      <div className="relative flex-1 w-full h-full min-h-0 bg-transparent overflow-hidden">
        <iframe
          ref={iframeRef}
          title={title}
          className="w-full h-full border-0 block bg-transparent"
          style={{ colorScheme: isDark ? "dark" : "light" }}
        />

        {/* Loading placeholder while iframe mounts */}
        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-paper)] text-[var(--color-muted)] text-xs font-mono">
            Loading preview…
          </div>
        )}

        {/* Portaled Template Tree into Iframe Body */}
        {mountNode && createPortal(children, mountNode)}
      </div>
    </div>
  )
}
