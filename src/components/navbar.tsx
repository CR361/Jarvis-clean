"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ModeToggle } from "@/components/mode-toggle"
import { Bell, Menu, User } from "lucide-react"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <a href="/" className="flex items-center gap-2">
            <i className="fas fa-robot text-primary text-xl"></i>
            <span className="hidden font-bold sm:inline-block">Jarvis</span>
          </a>
        </div>

        <nav className="hidden flex-1 items-center space-x-1 md:flex md:justify-center">
          <a
            href="/dashboard"
            className={`px-3 py-2 text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/dashboard" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <i className="fas fa-chart-line mr-1"></i> Dashboard
          </a>
          <a
            href="/customers"
            className={`px-3 py-2 text-sm font-medium transition-colors hover:text-primary ${
              pathname.startsWith("/customers") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <i className="fas fa-users mr-1"></i> Klanten
          </a>
          <a
            href="/invoices"
            className={`px-3 py-2 text-sm font-medium transition-colors hover:text-primary ${
              pathname.startsWith("/invoices") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <i className="fas fa-file-invoice mr-1"></i> Facturen
          </a>
          <a
            href="/emails"
            className={`px-3 py-2 text-sm font-medium transition-colors hover:text-primary ${
              pathname.startsWith("/emails") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <i className="fas fa-envelope mr-1"></i> E-mails
          </a>
          <a
            href="/checklist"
            className={`px-3 py-2 text-sm font-medium transition-colors hover:text-primary ${
              pathname.startsWith("/checklist") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <i className="fas fa-tasks mr-1"></i> Checklist
          </a>
          <a
            href="/contractors"
            className={`px-3 py-2 text-sm font-medium transition-colors hover:text-primary ${
              pathname.startsWith("/contractors") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <i className="fas fa-hard-hat mr-1"></i> Aannemers
          </a>
          <a
            href="/backup"
            className={`px-3 py-2 text-sm font-medium transition-colors hover:text-primary ${
              pathname.startsWith("/backup") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <i className="fas fa-save mr-1"></i> Backup
          </a>
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-primary"></span>
            <span className="sr-only">Notifications</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Mijn Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profiel</DropdownMenuItem>
              <DropdownMenuItem>Instellingen</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Uitloggen</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ModeToggle />
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="container pb-3 md:hidden">
          <nav className="flex flex-col space-y-1">
            <a
              href="/dashboard"
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                pathname === "/dashboard" ? "bg-accent text-accent-foreground" : "text-muted-foreground"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <i className="fas fa-chart-line mr-2"></i> Dashboard
            </a>
            <a
              href="/customers"
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                pathname.startsWith("/customers") ? "bg-accent text-accent-foreground" : "text-muted-foreground"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <i className="fas fa-users mr-2"></i> Klanten
            </a>
            <a
              href="/invoices"
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                pathname.startsWith("/invoices") ? "bg-accent text-accent-foreground" : "text-muted-foreground"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <i className="fas fa-file-invoice mr-2"></i> Facturen
            </a>
            <a
              href="/emails"
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                pathname.startsWith("/emails") ? "bg-accent text-accent-foreground" : "text-muted-foreground"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <i className="fas fa-envelope mr-2"></i> E-mails
            </a>
            <a
              href="/checklist"
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                pathname.startsWith("/checklist") ? "bg-accent text-accent-foreground" : "text-muted-foreground"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <i className="fas fa-tasks mr-2"></i> Checklist
            </a>
            <a
              href="/contractors"
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                pathname.startsWith("/contractors") ? "bg-accent text-accent-foreground" : "text-muted-foreground"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <i className="fas fa-hard-hat mr-2"></i> Aannemers
            </a>
            <a
              href="/backup"
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                pathname.startsWith("/backup") ? "bg-accent text-accent-foreground" : "text-muted-foreground"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <i className="fas fa-save mr-2"></i> Backup
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
