import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Kanban, Shield, Zap, Layout, Users } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950">
      <header className="flex items-center justify-between px-6 py-4 border-b">
        <div className="text-2xl font-bold tracking-tighter text-pink-600 dark:text-pink-500">MOTION</div>
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
              Manage Tasks with <span className="text-pink-500 drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]">Precision</span>
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
          
          <div className="mt-16 max-w-6xl mx-auto rounded-2xl overflow-hidden border border-zinc-800 shadow-[0_0_50px_rgba(255,0,128,0.2)] bg-black relative group">
             <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
             <img 
               src="/hero.png" 
               alt="Motion Dashboard Preview" 
               className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
             />
             <div className="absolute bottom-8 left-8 z-20 text-left">
               <div className="flex items-center gap-2 mb-2">
                 <div className="h-2 w-2 rounded-full bg-pink-500 animate-pulse" />
                 <span className="text-xs font-semibold text-pink-500 uppercase tracking-widest">Live Preview</span>
               </div>
               <h3 className="text-2xl font-bold text-white">Experience the Power of Motion</h3>
               <p className="text-zinc-400 text-sm max-w-md">Seamlessly manage your most complex projects with our state-of-the-art Kanban engine.</p>
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
        <p className="font-medium">Created by <span className="text-foreground font-bold">RAPTR MAAZ</span></p>
        <p className="mt-1">All rights reserved BY MAAZ &copy; {new Date().getFullYear()}</p>
        <p className="mt-4 text-xs opacity-50">Built with Next.js 16 and Redis Cloud.</p>
      </footer>
    </div>
  );
}
