"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  HardDrive,
  Home,
  Mail,
  Settings,
  Users,
  CheckSquare,
  HardHat,
} from "lucide-react"
import { usePathname } from "next/navigation"

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  const navItems = [
    {
      title: "Dashboard",
      icon: Home,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      title: "Klanten",
      icon: Users,
      href: "/customers",
      active: pathname.startsWith("/customers"),
    },
    {
      title: "Facturen",
      icon: FileText,
      href: "/invoices",
      active: pathname.startsWith("/invoices"),
    },
    {
      title: "E-mails",
      icon: Mail,
      href: "/emails",
      active: pathname.startsWith("/emails"),
    },
    {
      title: "Checklist",
      icon: CheckSquare,
      href: "/checklist",
      active: pathname.startsWith("/checklist"),
    },
    {
      title: "Aannemers",
      icon: HardHat,
      href: "/contractors",
      active: pathname.startsWith("/contractors"),
    },
    {
      title: "Backup",
      icon: HardDrive,
      href: "/backup",
      active: pathname.startsWith("/backup"),
    },
    {
      title: "Instellingen",
      icon: Settings,
      href: "/settings",
      active: pathname.startsWith("/settings"),
    },
  ]

  return (
    <div
      className={cn(
        "group relative hidden h-full flex-col border-r bg-background transition-all duration-300 ease-in-out md:flex",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-14 items-center border-b px-4">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="ml-auto">
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-1 p-2">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                item.active ? "bg-accent text-accent-foreground" : "text-muted-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              <span className={cn("transition-opacity", isCollapsed ? "opacity-0" : "opacity-100")}>{item.title}</span>
            </a>
          ))}
        </nav>
      </ScrollArea>
    </div>
  )
}
