"use client"

import { useState, useEffect } from "react"
import { X, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ToastNotificationProps {
  message: string
  onClose: () => void
}

export function ToastNotification({ message, onClose }: ToastNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  return (
    <div
      className={`fixed bottom-6 right-6 max-w-md transition-all duration-300 ease-out ${
        isVisible 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-4"
      }`}
    >
      <div className="bg-card border border-border rounded-lg shadow-lg p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-full bg-warning/10 flex-shrink-0">
            <Lightbulb className="w-5 h-5 text-warning" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">Sugerencia del Sistema</p>
            <p className="text-sm text-muted-foreground mt-1">{message}</p>
            <div className="flex items-center gap-2 mt-3">
              <Button size="sm" variant="default" className="text-xs">
                Revisar Caso
              </Button>
              <Button size="sm" variant="ghost" className="text-xs" onClick={handleClose}>
                Descartar
              </Button>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
