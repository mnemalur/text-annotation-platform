"use client"

import { NavBar } from "@/components/nav-bar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileText, ImageIcon, Play, Mail, Github } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      
      {/* Hero Section */}
      <main className="flex-1">
        <section className="container flex flex-col items-center justify-center gap-4 pt-32 pb-8 md:pt-40">
          <h1 className="text-center text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Annotation{" "}
            <span className="text-primary">Made Simple</span>
          </h1>
          <p className="max-w-[42rem] text-center text-muted-foreground sm:text-xl">
            Anuktha provides the developer tools and cloud infrastructure
            to build, scale, and secure your annotation projects.
          </p>
          <div className="flex gap-4 mt-8">
            <Link href="/annotate">
              <Button size="lg" className="h-11 px-8">
                Start Annotating
              </Button>
            </Link>
            <Link href="/demo">
              <Button
                size="lg"
                variant="outline"
                className="h-11 px-8"
              >
                Get a Demo
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section with Gradient Background */}
        <section className="relative min-h-[60vh] mt-16">
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(circle at center, rgba(var(--primary-rgb), 0.15) 0%, rgba(var(--primary-rgb), 0) 70%)",
            }}
          />
          
          {/* Features Grid */}
          <div className="container relative mx-auto px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Platform Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="flex flex-col items-center text-center p-8 rounded-xl bg-card/60 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all hover:scale-105">
                <FileText className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Text Annotation</h3>
                <p className="text-muted-foreground">
                  Annotate documents, articles, and research papers with custom labels and relationships.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-8 rounded-xl bg-card/60 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all hover:scale-105">
                <ImageIcon className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Image Support</h3>
                <p className="text-muted-foreground">
                  Coming soon: Annotate images with bounding boxes, polygons, and semantic segmentation.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-8 rounded-xl bg-card/60 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all hover:scale-105">
                <Play className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Video Analysis</h3>
                <p className="text-muted-foreground">
                  Coming soon: Frame-by-frame video annotation with temporal relationship tracking.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t mt-24">
        <div className="container mx-auto px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <h3 className="font-bold text-lg">Anuktha</h3>
              <p className="text-sm text-muted-foreground">
                Making annotation simple and efficient for teams of all sizes.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/features">Features</Link></li>
                <li><Link href="/pricing">Pricing</Link></li>
                <li><Link href="/docs">Documentation</Link></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about">About</Link></li>
                <li><Link href="/contact">Contact</Link></li>
                <li><Link href="/privacy">Privacy Policy</Link></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Connect</h4>
              <div className="flex space-x-4">
                <Link href="mailto:contact@anuktha.com" className="text-muted-foreground hover:text-foreground">
                  <Mail className="h-5 w-5" />
                </Link>
                <Link href="https://github.com/anuktha" className="text-muted-foreground hover:text-foreground">
                  <Github className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Anuktha. All rights reserved.</p>
            <p className="mt-2">
              Licensed under MIT License. View our{" "}
              <Link href="/terms" className="underline hover:text-foreground">Terms of Service</Link>
              {" "}and{" "}
              <Link href="/privacy" className="underline hover:text-foreground">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

