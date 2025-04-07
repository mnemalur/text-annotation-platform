"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { FileText, Home, Tag, Users } from "lucide-react"

export function Navbar() {
  const pathname = usePathname()

  const routes = [
    {
      href: "/",
      label: "Home",
      icon: <Home className="mr-2 h-4 w-4" />,
      active: pathname === "/",
    },
    {
      href: "/annotate",
      label: "Annotate",
      icon: <FileText className="mr-2 h-4 w-4" />,
      active: pathname === "/annotate",
    },
    {
      href: "/labels",
      label: "Labels",
      icon: <Tag className="mr-2 h-4 w-4" />,
      active: pathname === "/labels",
    },
    {
      href: "/admin",
      label: "Admin",
      icon: <Users className="mr-2 h-4 w-4" />,
      active: pathname === "/admin",
    },
  ]

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center">
        <div className="mr-8 flex">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">
              <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">
                Anuktha
              </span>
            </span>
          </Link>
        </div>
        <nav className="flex items-center space-x-2">
          {routes.map((route) => (
            <Link key={route.href} href={route.href} passHref>
              <Button
                variant={route.active ? "default" : "ghost"}
                className={cn("justify-start", route.active && "bg-primary text-primary-foreground")}
              >
                {route.icon}
                {route.label}
              </Button>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}

