import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Kanban, Shield, Zap, Layout, Users } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950">
      <header className="flex items-center justify-between px-6 py-4 border-b">
        <div className="text-2xl font-bold tracking-tighter">MOTION</div>
        <nav className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-sm font-medium hover:text-primary">Features</Link>
          <Link href="#pricing" className="text-sm font-medium hover:text-primary">Pricing</Link>
          <Link href="/login" className="text-sm font-medium hover:text-primary">Login</Link>
          <Button asChild>
            <Link href="/register">Get Started</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-24 px-6 text-center space-y-8 bg-zinc-50 dark:bg-zinc-900/50">
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-6xl font-extrabold tracking-tight sm:text-7xl">
              Manage Tasks with <span className="text-primary">Precision</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A production-ready Kanban system built for high-performance teams. Real-time updates, deep analytics, and seamless collaboration.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button size="lg" className="h-12 px-8 text-lg" asChild>
                <Link href="/register">
                  Start Building <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 text-lg">
                View Demo
              </Button>
            </div>
          </div>
          
          <div className="mt-16 max-w-5xl mx-auto rounded-xl overflow-hidden border shadow-2xl">
             <div className="aspect-video bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-muted-foreground italic">
               [Interactive Board Preview Component]
             </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-24 px-6">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Kanban className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Dynamic Kanban</h3>
              <p className="text-muted-foreground">Drag and drop tasks between columns with real-time state synchronization.</p>
            </div>
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Ultra Fast</h3>
              <p className="text-muted-foreground">Optimistic UI updates mean you never wait for the server. It feels instantaneous.</p>
            </div>
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Collaboration</h3>
              <p className="text-muted-foreground">Built-in presence indicators and real-time notifications for your team.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t px-6 text-center text-sm text-muted-foreground">
        &copy; 2024 Motion Inc. All rights reserved. Built with Next.js 16 and Redis Cloud.
      </footer>
    </div>
  );
}
