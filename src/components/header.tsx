"use client"

import { usePathname } from "next/navigation"
import { ModeToggle } from "@/components/mode-toggle"

export default function Header() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + "/")
  }

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <a href="/" className="flex items-center">
            <span className="futuristic-brand">JARVIS</span>
          </a>

          <nav className="hidden md:flex space-x-6">
            <a
              href="/dashboard"
              className={`nav-item ${isActive("/dashboard") ? "text-blue-600 font-medium" : "text-gray-600 hover:text-blue-600"}`}
            >
              <i className="fas fa-tachometer-alt mr-2"></i> Dashboard
            </a>
            <a
              href="/customers"
              className={`nav-item ${isActive("/customers") ? "text-blue-600 font-medium" : "text-gray-600 hover:text-blue-600"}`}
            >
              <i className="fas fa-users mr-2"></i> Klanten
            </a>
            <a
              href="/invoices"
              className={`nav-item ${isActive("/invoices") ? "text-blue-600 font-medium" : "text-gray-600 hover:text-blue-600"}`}
            >
              <i className="fas fa-file-invoice-dollar mr-2"></i> Facturen
            </a>
            <a
              href="/emails"
              className={`nav-item ${isActive("/emails") ? "text-blue-600 font-medium" : "text-gray-600 hover:text-blue-600"}`}
            >
              <i className="fas fa-envelope mr-2"></i> E-mails
            </a>
            <a
              href="/checklist"
              className={`nav-item ${isActive("/checklist") ? "text-blue-600 font-medium" : "text-gray-600 hover:text-blue-600"}`}
            >
              <i className="fas fa-tasks mr-2"></i> Checklist
            </a>
            <a
              href="/contractors"
              className={`nav-item ${isActive("/contractors") ? "text-blue-600 font-medium" : "text-gray-600 hover:text-blue-600"}`}
            >
              <i className="fas fa-hard-hat mr-2"></i> Aannemers
            </a>
            <a href="/backup" className="btn-glow px-3 py-1 rounded text-white text-sm">
              <i className="fas fa-download mr-2"></i> Backup
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <ModeToggle />
            <button className="md:hidden text-gray-600">
              <i className="fas fa-bars text-xl"></i>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
