"use client"

import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface FlashMessage {
  id: string
  category: string
  message: string
}

export default function FlashMessages() {
  const { toast } = useToast()
  const [messages, setMessages] = useState<FlashMessage[]>([])

  // In een echte applicatie zou je deze berichten van de server krijgen
  // Voor nu simuleren we dit met een leeg array

  useEffect(() => {
    // Toon alle flash messages als toasts
    messages.forEach((msg) => {
      toast({
        title: msg.category === "success" ? "Succes" : "Melding",
        description: msg.message,
        variant: msg.category === "error" ? "destructive" : "default",
      })
    })
  }, [messages, toast])

  return (
    <div className="container mt-4">
      {messages.map((msg) => (
        <div key={msg.id} className={`alert alert-${msg.category} alert-dismissible fade show`} role="alert">
          {msg.message}
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
            onClick={() => setMessages(messages.filter((m) => m.id !== msg.id))}
          ></button>
        </div>
      ))}
    </div>
  )
}
