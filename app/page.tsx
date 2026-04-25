import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Kanban, Shield, Zap, Layout, Users } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950">
      <header className="flex items-center justify-between px-6 py-4 border-b bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="text-2xl font-bold tracking-tighter text-zinc-900 dark:text-zinc-50">MOTION</div>
        <nav className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-sm font-medium hover:text-indigo-600 transition-colors">Features</Link>
          <Link href="#pricing" className="text-sm font-medium hover:text-indigo-600 transition-colors">Pricing</Link>
          <Link href="/login" className="text-sm font-medium hover:text-zinc-600 transition-colors">Login</Link>
          <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <Link href="/register">Get Started</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-24 px-6 text-center space-y-8 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/50 dark:to-zinc-950">
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-6xl font-extrabold tracking-tight sm:text-7xl text-zinc-900 dark:text-zinc-50">
              Manage Tasks with <span className="text-indigo-600 dark:text-indigo-400">Precision</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A professional-grade Kanban system for elite teams. Real-time collaboration, advanced analytics, and seamless project management.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button size="lg" className="h-12 px-8 text-lg bg-indigo-600 hover:bg-indigo-700" asChild>
                <Link href="/register">
                  Start Building <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 text-lg border-zinc-200 dark:border-zinc-800">
                View Demo
              </Button>
            </div>
          </div>
          
          <div className="mt-16 max-w-6xl mx-auto rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-2xl bg-white dark:bg-zinc-900 relative group">
             <img 
               src="/hero.png" 
               alt="Motion Dashboard Preview" 
               className="w-full h-full object-cover"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-white/20 dark:from-black/20 to-transparent pointer-events-none" />
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
        <p className="font-medium">Created by <span className="text-foreground font-bold">RAPTR MAAZ</span></p>
        <p className="mt-1">All rights reserved BY MAAZ &copy; {new Date().getFullYear()}</p>
        <p className="mt-4 text-xs opacity-50">Built with Next.js 16 and Redis Cloud.</p>
      </footer>
    </div>
  );
}
