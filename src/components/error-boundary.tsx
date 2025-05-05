"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function ErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const errorHandler = (event: ErrorEvent) => {
      console.error("Error caught by error boundary:", event.error)
      setHasError(true)
      // Prevent the error from bubbling up
      event.preventDefault()
    }

    window.addEventListener("error", errorHandler)

    return () => {
      window.removeEventListener("error", errorHandler)
    }
  }, [])

  if (hasError) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <Card className="w-full max-w-md mx-auto mt-8">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <CardTitle>Er is iets misgegaan</CardTitle>
          </div>
          <CardDescription>
            Er is een probleem opgetreden bij het laden van deze pagina. Probeer het later opnieuw.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Als het probleem aanhoudt, neem dan contact op met de beheerder.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => window.location.reload()}>Pagina vernieuwen</Button>
        </CardFooter>
      </Card>
    )
  }

  return <>{children}</>
}
