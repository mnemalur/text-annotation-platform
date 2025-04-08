"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { PenTool, HelpCircle, ChevronLeft, ChevronRight, FolderOpen, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

export function LeftMenu() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isProjectsExpanded, setIsProjectsExpanded] = useState(false)
  const [selectedProject, setSelectedProject] = useState<string | null>(null)

  // Mock projects - in a real app this would come from a database or API
  const projects = [
    { id: "proj1", name: "Medical Reports", count: 42 },
    { id: "proj2", name: "Legal Documents", count: 28 },
    { id: "proj3", name: "Research Papers", count: 15 },
  ]

  const routes = [
    {
      href: "/annotate",
      label: "Annotation",
      icon: PenTool,
      active: pathname === "/annotate"
    },
    {
      href: "/help",
      label: "Help",
      icon: HelpCircle,
      active: pathname === "/help"
    }
  ]

  return (
    <div className={cn(
      "border-r bg-card h-[calc(100vh-4rem)] relative",
      isCollapsed ? "w-12" : "w-64"
    )}>
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-4 z-10 h-6 w-6 rounded-full border bg-background"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>
      
      <div className="flex flex-col gap-2 p-4">
        {routes.map((route) => {
          const Icon = route.icon
          return (
            <Link key={route.href} href={route.href}>
              <Button
                variant={route.active ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-2",
                  route.active && "bg-primary text-primary-foreground",
                  isCollapsed && "justify-center"
                )}
              >
                <Icon className="h-4 w-4" />
                {!isCollapsed && <span>{route.label}</span>}
              </Button>
            </Link>
          )
        })}

        {/* Projects Section */}
        {!isCollapsed && (
          <div className="mt-4">
            <Button
              variant="ghost"
              className="w-full justify-between"
              onClick={() => setIsProjectsExpanded(!isProjectsExpanded)}
            >
              <div className="flex items-center gap-2">
                <FolderOpen className="h-4 w-4" />
                <span>Projects</span>
              </div>
              {isProjectsExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
            
            {isProjectsExpanded && (
              <div className="mt-2 pl-4 space-y-1">
                {projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => setSelectedProject(project.id)}
                    className={cn(
                      "flex items-center justify-between w-full px-3 py-1.5 rounded-md text-sm",
                      selectedProject === project.id
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'hover:bg-muted/50 text-muted-foreground'
                    )}
                  >
                    <span>{project.name}</span>
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      selectedProject === project.id
                        ? 'bg-primary/20'
                        : 'bg-muted'
                    )}>
                      {project.count}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 