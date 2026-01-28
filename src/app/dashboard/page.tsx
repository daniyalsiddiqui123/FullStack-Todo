'use client';
import { useState, useEffect } from 'react';
import TodoList from '@/components/todo/todo-list';
import Header from '@/components/common/header';
import { MCPSocketProvider } from '@/contexts/mcp-socket-context';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0
  });

  // Get user ID from somewhere - in a real app this would come from auth context or session
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') || 'default-user' : 'default-user';

  useEffect(() => {
    const handleTodosUpdated = (event: any) => {
      setStats({
        total: event.detail.total,
        completed: event.detail.completed,
        pending: event.detail.active
      });
    };

    window.addEventListener('todosUpdated', handleTodosUpdated);

    return () => {
      window.removeEventListener('todosUpdated', handleTodosUpdated);
    };
  }, []);

  return (
    <MCPSocketProvider>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        <Header />

        {/* Dashboard Header */}
        <div className="bg-gradient-to-r from-card/50 to-transparent backdrop-blur-sm border-b border-border/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">Dashboard</h1>
                </div>
                <p className="text-muted-foreground/80">Manage your tasks and boost your productivity</p>
              </div>
              <div className="mt-4 sm:mt-0">
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-muted-foreground/80">
                    Welcome back! Ready to tackle your tasks today?
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 p-6 hover:bg-card/70 transition-all duration-300 group">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <svg className="w-5 h-5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground/70">Total Tasks</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">{stats.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 p-6 hover:bg-card/70 transition-all duration-300 group">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground/70">Completed</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">{stats.completed}</p>
                </div>
              </div>
            </div>

            <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 p-6 hover:bg-card/70 transition-all duration-300 group">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground/70">Pending</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">{stats.pending}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
            <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 overflow-hidden">
              <div className="px-6 py-5 border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">My Tasks</h2>
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-sm shadow-primary/20">
                      All Tasks: {stats.total}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <TodoList />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <h3 className="text-lg font-semibold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">Quick Tips</h3>
              </div>
              <ul className="space-y-3 text-sm text-muted-foreground/80">
                <li className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">
                    <svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Break large tasks into smaller, manageable steps</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">
                    <svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Set deadlines to stay on track</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">
                    <svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Review and update tasks regularly</span>
                </li>
              </ul>
            </div>

            <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <h3 className="text-lg font-semibold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">Productivity Tip</h3>
              </div>
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-4 border border-border/30">
                <p className="text-sm text-foreground/90 italic">
                  "The secret to getting ahead is getting started. The secret to getting started is breaking your complex overwhelming tasks into small manageable tasks, and starting on the first one."
                </p>
                <p className="text-xs text-muted-foreground/70 mt-2">- Mark Twain</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </MCPSocketProvider>
  );
}