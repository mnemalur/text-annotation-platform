"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { PenTool, Tags, Settings, User } from "lucide-react"
import { useSession } from "next-auth/react"

export function MainNav() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === "admin"

  const routes = [
    // Only show Labels in navigation for admin users
    ...(isAdmin ? [{
      href: "/labels",
      label: "Labels",
      icon: Tags,
      active: pathname === "/labels"
    }] : []),
    // Only show Admin section for admin users
    ...(isAdmin ? [{
      href: "/admin",
      label: "Admin",
      icon: Settings,
      active: pathname === "/admin"
    }] : [])
  ]

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4">
        <Link 
          href="/" 
          className={cn(
            "flex items-center space-x-2 px-4 py-2 rounded-md transition-colors",
            pathname === "/" ? "bg-primary/10" : "hover:bg-primary/5"
          )}
        >
          <PenTool className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">Anuktha</span>
        </Link>
        <div className="ml-8 flex items-center space-x-4">
          {routes.map((route) => {
            const Icon = route.icon
            return (
              <Link key={route.href} href={route.href}>
                <Button
                  variant={route.active ? "default" : "ghost"}
                  className={cn(
                    "flex items-center space-x-2",
                    route.active && "bg-primary text-primary-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{route.label}</span>
                </Button>
              </Link>
            )
          })}
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  )
} 