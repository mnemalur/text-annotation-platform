"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PenTool } from "lucide-react"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"

export function NavBar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-90 transition-opacity">
            <PenTool className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl tracking-tight">Anuktha</span>
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Features</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 w-[400px]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          href="/features"
                        >
                          <div className="mb-2 mt-4 text-lg font-medium">
                            Annotation Platform
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Powerful annotation tools for your team
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <ListItem href="/features/annotation" title="Annotation">
                      Create and manage annotations with ease
                    </ListItem>
                    <ListItem href="/features/collaboration" title="Collaboration">
                      Work together in real-time
                    </ListItem>
                    <ListItem href="/features/export" title="Export">
                      Export your annotations in various formats
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4">
                    <ListItem href="/solutions/teams" title="For Teams">
                      Collaborate on annotation projects
                    </ListItem>
                    <ListItem href="/solutions/enterprise" title="Enterprise">
                      Custom solutions for large organizations
                    </ListItem>
                    <ListItem href="/solutions/research" title="Research">
                      Tools for academic and research projects
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/docs" legacyBehavior passHref>
                  <NavigationMenuLink className="font-medium">
                    Docs
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/pricing" legacyBehavior passHref>
                  <NavigationMenuLink className="font-medium">
                    Pricing
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="font-medium">
              Log In
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="ghost" className="font-medium">
              Contact
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="font-medium bg-foreground text-background hover:bg-foreground/90">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

const ListItem = ({ className, title, children, ...props }: any) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
} 