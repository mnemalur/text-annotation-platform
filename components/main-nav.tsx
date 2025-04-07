import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const items = [
  {
    title: "Projects",
    href: "/projects",
  },
  {
    title: "Datasets",
    href: "/datasets",
  },
  {
    title: "Labels",
    href: "/labels",
  },
  {
    title: "Admin",
    href: "/admin",
  },
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      <Link
        href="/"
        className="flex items-center space-x-2 font-bold"
      >
        <span>Data Annotation Platform</span>
      </Link>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === item.href
              ? "text-foreground"
              : "text-muted-foreground"
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  )
} 