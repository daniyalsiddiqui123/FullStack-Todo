'use client';

import { useState, useEffect } from 'react';
import TodoChatbotWindow from '@/components/todo/todo-chatbot-window';
import Header from '@/components/common/header';
import { MCPSocketProvider } from '@/contexts/mcp-socket-context';

export default function AIChatbotPage() {
  // Get user ID from somewhere - in a real app this would come from auth context or session
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') || 'default-user' : 'default-user';

  return (
    <MCPSocketProvider>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        <Header />

        {/* Page Header */}
        <div className="bg-gradient-to-r from-card/50 to-transparent backdrop-blur-sm border-b border-border/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse"></div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">AI Assistant</h1>
                </div>
                <p className="text-muted-foreground/80">Chat with our AI assistant to manage your tasks naturally</p>
              </div>
              <div className="mt-4 sm:mt-0">
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-muted-foreground/80">
                    Powered by advanced AI processing
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 overflow-hidden">
            <div className="p-6">
              <TodoChatbotWindow userId={userId} />
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 p-6 hover:bg-card/70 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
                <svg className="w-6 h-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent mb-2">Natural Language</h3>
              <p className="text-sm text-muted-foreground/80">Speak to the assistant in plain English to manage your tasks.</p>
            </div>

            <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 p-6 hover:bg-card/70 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent mb-2">Smart Recognition</h3>
              <p className="text-sm text-muted-foreground/80">AI understands context and complex commands automatically.</p>
            </div>

            <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 p-6 hover:bg-card/70 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent mb-2">Quick Actions</h3>
              <p className="text-sm text-muted-foreground/80">Use quick buttons for common todo operations instantly.</p>
            </div>
          </div>
        </main>
      </div>
    </MCPSocketProvider>
  );
}