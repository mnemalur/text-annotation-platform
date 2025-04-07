"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, FileText, Tag, Users, Clock, CheckCircle2, BarChart3, Zap, HomeIcon, Settings, BookOpen, BarChart } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-white via-purple-50 to-white">
      {/* Left Navigation Pane */}
      <div className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Anuktha
          </h1>
        </div>
        
        <nav className="space-y-2">
          <Link href="/" className="flex items-center space-x-3 p-3 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors">
            <HomeIcon className="h-5 w-5" />
            <span>Home</span>
          </Link>
          <Link href="/annotator" className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
            <BookOpen className="h-5 w-5" />
            <span>Annotate</span>
          </Link>
          <Link href="/admin" className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
            <BarChart className="h-5 w-5" />
            <span>Analytics</span>
          </Link>
          <Link href="/settings" className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </Link>
        </nav>

        <div className="mt-auto">
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-4">
              <h3 className="font-semibold text-purple-800 mb-2">Need Help?</h3>
              <p className="text-sm text-purple-600 mb-3">Check out our documentation for guides and tutorials.</p>
              <Button variant="outline" className="w-full bg-white text-purple-600 hover:bg-purple-50">
                View Docs
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
          <div className="container mx-auto px-8 py-16">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">
                  Text Annotation Made Simple
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Import text data, create labels, and annotate content with our intuitive platform. Perfect for researchers and data scientists.
              </p>
              <div className="flex gap-4 justify-center">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="transform hover:scale-105 transition-all duration-200">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="container mx-auto px-8 py-12">
          <div className="grid grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-600">Total Documents</p>
                    <h3 className="text-2xl font-bold text-purple-800">1,234</h3>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <FileText className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600">Active Annotators</p>
                    <h3 className="text-2xl font-bold text-blue-800">42</h3>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600">Labels Created</p>
                    <h3 className="text-2xl font-bold text-green-800">89</h3>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <Tag className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Grid */}
        <div className="container mx-auto px-8 py-12">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Powerful Features
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Lightning Fast</CardTitle>
                <CardDescription>Annotate documents quickly with our optimized interface</CardDescription>
              </CardHeader>
            </Card>
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Accurate Results</CardTitle>
                <CardDescription>Ensure high-quality annotations with built-in validation</CardDescription>
              </CardHeader>
            </Card>
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>Track progress and analyze annotation patterns</CardDescription>
              </CardHeader>
            </Card>
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle>Real-time Updates</CardTitle>
                <CardDescription>See changes instantly as you annotate</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 py-16 mt-12">
          <div className="container mx-auto px-8">
            <div className="max-w-2xl mx-auto text-center text-white">
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-xl mb-8 text-purple-100">
                Join thousands of researchers and data scientists using Anuktha
              </p>
              <Button size="lg" className="bg-white text-purple-600 hover:bg-purple-50 transform hover:scale-105 transition-all duration-200">
                Start Your Free Trial <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

