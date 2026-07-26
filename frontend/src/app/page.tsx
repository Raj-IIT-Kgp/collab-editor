import Link from 'next/link';
import { ArrowRight, Edit3, Share2, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <header className="fixed top-0 w-full border-b bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Edit3 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">CoScribe</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Log in
            </Link>
            <Link href="/register" className="text-sm font-medium bg-gray-900 text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-all shadow-sm hover:shadow">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-medium mb-8">
            <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></span>
            Real-time collaboration is here
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
            Write together, <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              create faster.
            </span>
          </h1>
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            CoScribe is a production-grade workspace designed for teams. Edit documents simultaneously, leave inline comments, and organize your thoughts with zero friction.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-3.5 rounded-full text-base font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 hover:-translate-y-0.5">
              Start writing for free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/dashboard" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-200 px-8 py-3.5 rounded-full text-base font-semibold hover:bg-gray-50 transition-all hover:border-gray-300">
              Go to Dashboard
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-8 border-t border-gray-100">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Lightning Fast Sync</h3>
                <p className="text-gray-500 leading-relaxed">Powered by CRDTs and WebSockets, see your team's cursors fly across the screen at 60fps with zero merge conflicts.</p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="h-12 w-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-6">
                  <Edit3 className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Rich Formatting</h3>
                <p className="text-gray-500 leading-relaxed">Built on Meta's Lexical framework. Add code blocks, tables, lists, and drag-and-drop images directly from your desktop.</p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="h-12 w-12 bg-violet-50 rounded-xl flex items-center justify-center mb-6">
                  <Share2 className="h-6 w-6 text-violet-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Granular Security</h3>
                <p className="text-gray-500 leading-relaxed">Enterprise-ready Access Control Lists (ACL). Share public read-only links or invite colleagues with strict Editor permissions.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
