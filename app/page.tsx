"use client";

import React, { useEffect, useState, useRef } from "react";
import { useHealthStore } from "../store/healthStore";
import BlobAvatar from "../components/BlobAvatar";
import HealthProfilePanel from "../components/HealthProfilePanel";
import {
  Search,
  MessageSquare,
  Users,
  Compass,
  User as UserIcon,
  BookOpen,
  PlusCircle,
  Bell,
  FileText,
  ShieldAlert,
  Info,
  Briefcase,
  ChevronRight,
  ArrowRight,
  Send,
  Plus,
  Paperclip,
  Trash2,
  X,
} from "lucide-react";

export default function Home() {
  const {
    threads,
    activeThreadId,
    healthProfile,
    isTyping,
    newThread,
    selectThread,
    deleteThread,
    sendMessage,
  } = useHealthStore();

  const [mounted, setMounted] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-scroll chat to bottom
  const activeThread = threads.find((t) => t.id === activeThreadId);
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeThread?.messages, isTyping]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="w-16 h-16 bg-slate-350 rounded-full" />
          <div className="h-4 w-32 bg-slate-350 rounded" />
        </div>
      </div>
    );
  }

  // Calculate Health Profile Completion %
  const fields = [
    healthProfile.name,
    healthProfile.dobDay,
    healthProfile.dobMonth,
    healthProfile.dobYear,
    healthProfile.weight,
    healthProfile.height,
    healthProfile.gender,
  ];
  const filledFields = fields.filter((f) => f && f.trim() !== "").length;
  const completionPercent = Math.round((filledFields / 7) * 100);

  // Filter threads by search query
  const filteredThreads = threads.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.messages.some((m) => m.text.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    let currentId = activeThreadId;
    if (!currentId) {
      currentId = newThread();
    }

    sendMessage(inputText);
    setInputText("");
  };

  const handleChatNow = () => {
    const newId = newThread();
    selectThread(newId);
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex font-sans text-[#111827] antialiased select-none">
      {/* COLUMN 1: LEFT SIDEBAR (260px) */}
      <aside className="w-[260px] bg-white border-r border-[#E5E7EB] flex flex-col h-screen sticky top-0 shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.015)]">
        {/* Logo */}
        <div className="p-6 pb-5 flex items-center gap-3">
          <img
            src="/logo.png"
            alt="AskFirst Logo"
            className="w-9 h-9 object-contain rounded-xl shadow-sm border border-slate-100"
          />
          <span className="text-xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
            AskFirst
          </span>
        </div>

        {/* Sidebar Search */}
        <div className="px-4 mb-4">
          <div className="relative">
            <Search className="w-4.5 h-4.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-55 border border-slate-200/80 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto px-3 space-y-1 scrollbar-thin">
          <button
            onClick={() => selectThread(threads.length > 0 ? threads[0].id : null)}
            className="w-full flex items-center gap-3 px-3 py-3 text-sm font-semibold rounded-xl transition-all cursor-pointer bg-gradient-to-r from-blue-50/80 to-indigo-50/30 text-[#2563EB] border-l-4 border-[#2563EB]"
          >
            <MessageSquare className="w-4.5 h-4.5" />
            <span>Ask Clary</span>
          </button>

          <button className="w-full flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-xl text-[#6B7280] hover:bg-slate-50 hover:text-[#111827] transition-all cursor-pointer text-left">
            <Users className="w-4.5 h-4.5 text-slate-400" />
            <span>Ask Doctors</span>
          </button>

          <button className="w-full flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-xl text-[#6B7280] hover:bg-slate-50 hover:text-[#111827] transition-all cursor-pointer text-left">
            <Compass className="w-4.5 h-4.5 text-slate-400" />
            <span>Feed</span>
          </button>

          <button
            onClick={() => setIsProfileOpen(true)}
            className="w-full flex items-center justify-between px-3 py-3 text-sm font-medium rounded-xl text-[#6B7280] hover:bg-slate-50 hover:text-[#111827] transition-all cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <UserIcon className="w-4.5 h-4.5 text-slate-400" />
              <span>Profile</span>
            </div>
            <span className="text-[10px] bg-slate-900 text-white px-2 py-0.5 rounded-full font-bold">
              {completionPercent}%
            </span>
          </button>

          <button className="w-full flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-xl text-[#6B7280] hover:bg-slate-50 hover:text-[#111827] transition-all cursor-pointer text-left">
            <BookOpen className="w-4.5 h-4.5 text-slate-400" />
            <span>Blogs</span>
          </button>

          <button className="w-full flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-xl text-[#6B7280] hover:bg-slate-50 hover:text-[#111827] transition-all cursor-pointer text-left">
            <PlusCircle className="w-4.5 h-4.5 text-slate-400" />
            <span>Create</span>
          </button>

          <button className="w-full flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-xl text-[#6B7280] hover:bg-slate-50 hover:text-[#111827] transition-all cursor-pointer text-left">
            <Bell className="w-4.5 h-4.5 text-slate-400" />
            <span>Notifications</span>
          </button>

          <div className="pt-4 border-t border-slate-100 my-2" />

          <button className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-700 transition-all text-left">
            <FileText className="w-3.5 h-3.5" />
            <span>Community Guidelines</span>
          </button>

          <button className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-700 transition-all text-left">
            <FileText className="w-3.5 h-3.5" />
            <span>Privacy Policy</span>
          </button>

          <button className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-700 transition-all text-left">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Disclaimer</span>
          </button>

          <button className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-700 transition-all text-left">
            <Info className="w-3.5 h-3.5" />
            <span>About AskFirst</span>
          </button>

          <button className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-700 transition-all text-left">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Careers</span>
          </button>
        </nav>
      </aside>

      {/* COLUMN 2: CENTER PANEL */}
      <section className="flex-1 min-w-0 flex flex-col h-screen overflow-y-auto px-8 py-6 relative scrollbar-thin">
        {/* Top Centered Search Bar */}
        <div className="max-w-2xl mx-auto w-full mb-6">
          <div className="relative">
            <Search className="w-4.5 h-4.5 absolute left-4.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-3.5 bg-white border border-slate-200/80 rounded-full text-sm shadow-[0_2px_8px_rgba(0,0,0,0.02)] focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Hero Banner Card */}
        <div className="max-w-2xl mx-auto w-full bg-gradient-to-tr from-[#0F172A] to-[#1E40AF] rounded-3xl p-8 shadow-md flex items-center justify-between mb-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.06),transparent)] pointer-events-none" />
          <div className="space-y-2 z-10 max-w-sm">
            <div className="text-slate-355 text-xs uppercase tracking-wider font-semibold">Hi, I'm</div>
            <h2 className="text-3xl font-extrabold text-white leading-tight">
              Clary <span className="text-blue-400 font-normal">✦</span>
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed mt-1">
              Your personal AI health companion. Ask me anything about symptoms, medicines, lab metrics, or workouts.
            </p>
          </div>
          <div className="z-10 transform transition-transform group-hover:scale-105 duration-500">
            <BlobAvatar size="lg" />
          </div>
        </div>

        {/* Health Profile Card */}
        <div
          onClick={() => setIsProfileOpen(true)}
          className="max-w-2xl mx-auto w-full bg-white border border-slate-200/60 rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex items-center justify-between mb-8 cursor-pointer hover:border-blue-200 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-[#2563EB]">
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#111827]">Health Profile</h3>
              <p className="text-xs text-[#6B7280]">
                {healthProfile.name ? `Profile details loaded` : `Add your details to get started`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#111827] text-white flex items-center justify-center text-[11px] font-bold">
              {completionPercent}%
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </div>
        </div>

        {/* Chat History Section */}
        <div className="max-w-2xl mx-auto w-full flex-1 mb-24">
          <div className="mb-4">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
              Chat History
            </h4>
            <p className="text-[11px] italic text-[#6B7280] mt-0.5">
              Clary remembers every single detail.
            </p>
          </div>

          <div className="space-y-3">
            {filteredThreads.length === 0 ? (
              <div className="text-center py-12 bg-white/50 border border-slate-200/40 border-dashed rounded-3xl">
                <p className="text-sm text-slate-400">No chat history found</p>
              </div>
            ) : (
              filteredThreads.map((thread) => {
                const isActive = thread.id === activeThreadId;
                const lastMsg = thread.messages[thread.messages.length - 1]?.text || "";
                return (
                  <div
                    key={thread.id}
                    onClick={() => selectThread(thread.id)}
                    className={`group p-4.5 bg-white border ${
                      isActive ? "border-[#2563EB] ring-2 ring-blue-500/10" : "border-slate-200/60"
                    } hover:bg-slate-55 hover:border-slate-350 rounded-2xl shadow-[0_2px_4px_rgba(0,0,0,0.01)] cursor-pointer transition-all flex justify-between items-start gap-4`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-sm truncate text-[#111827]">
                          {thread.title}
                        </span>
                        <span className="text-[10px] text-[#6B7280] shrink-0 font-medium ml-2">
                          {new Date(thread.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-[#6B7280] truncate leading-normal">
                        {lastMsg}
                      </p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteThread(thread.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-650 rounded-lg transition-all cursor-pointer shrink-0"
                      title="Delete Conversation"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Bottom Sticky Action Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#F0F2F5] via-[#F0F2F5] to-transparent pt-12 pb-6 px-8 z-20">
          <div className="max-w-2xl mx-auto w-full">
            <button
              onClick={handleChatNow}
              className="w-full py-4.5 bg-[#111827] hover:bg-slate-850 text-white font-bold rounded-full flex items-center justify-center gap-2 shadow-lg shadow-slate-900/15 hover:shadow-xl hover:scale-[1.01] transition-all cursor-pointer"
            >
              <span>Chat now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <div className="text-center text-[10px] text-[#6B7280] mt-2 tracking-wide font-semibold">
              Symptoms · Labs · Nutrition · Mind
            </div>
          </div>
        </div>
      </section>

      {/* COLUMN 3: RIGHT PANEL (380px) */}
      <section className="w-[380px] bg-white border-l border-[#E5E7EB] flex flex-col h-screen sticky top-0 shrink-0 shadow-[-4px_0_24px_rgba(0,0,0,0.015)]">
        {activeThread ? (
          /* Active Chat View */
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BlobAvatar size="sm" />
                <div>
                  <h3 className="font-bold text-sm text-[#111827]">Clary</h3>
                  <p className="text-[10px] text-[#6B7280] font-semibold">
                    AI Health Companion
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleChatNow}
                  className="px-3.5 py-1.5 bg-[#111827] hover:bg-slate-850 text-white text-[11px] font-bold rounded-full flex items-center gap-1 cursor-pointer transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New chat</span>
                </button>

                <button
                  onClick={() => selectThread(null)}
                  className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-705 rounded-lg cursor-pointer transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable messages area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4.5 scrollbar-thin">
              {activeThread.messages.map((message) => {
                const isUser = message.sender === "user";
                return (
                  <div
                    key={message.id}
                    className={`flex items-start gap-2.5 ${
                      isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!isUser && (
                      <div className="shrink-0 pt-0.5">
                        <BlobAvatar size="sm" />
                      </div>
                    )}
                    <div
                      className={`max-w-[78%] px-4 py-3 rounded-2xl text-[15px] leading-relaxed shadow-[0_1px_3px_rgba(0,0,0,0.01)] border ${
                        isUser
                          ? "bg-[#EFF6FF] border-[#BFDBFE]/80 text-[#1E40AF] rounded-tr-none"
                          : "bg-white border-slate-200/80 text-[#111827] rounded-tl-none"
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-start gap-2.5 justify-start">
                  <div className="shrink-0 pt-0.5">
                    <BlobAvatar size="sm" />
                  </div>
                  <div className="px-4 py-3.5 bg-white border border-slate-200/80 rounded-2xl rounded-tl-none flex items-center gap-1 shadow-sm">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Form */}
            <form
              onSubmit={handleSend}
              className="p-4 border-t border-slate-100 bg-white"
            >
              <div className="flex items-center gap-2 px-3 py-2.5 border border-slate-250 rounded-2xl focus-within:ring-2 focus-within:ring-blue-500/10 focus-within:border-blue-500 transition-all">
                <button
                  type="button"
                  className="p-1 text-slate-400 hover:text-slate-650 cursor-pointer transition-all"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  placeholder="Ask anything..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 px-1 bg-transparent text-[14px] text-slate-800 placeholder:text-slate-400 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-2.5 bg-[#2563EB] disabled:opacity-45 hover:bg-blue-600 text-white rounded-xl shadow transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Empty State View */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(37,99,235,0.025),transparent_70%)] pointer-events-none" />
            <div className="transform scale-110 mb-6">
              <BlobAvatar size="lg" />
            </div>
            <h3 className="text-xl font-extrabold text-[#111827] tracking-tight">
              Ask me anything
            </h3>
            <p className="text-sm text-[#6B7280] mt-2 max-w-[240px] leading-relaxed">
              Health questions, symptoms, medications — I'm here to help.
            </p>
          </div>
        )}
      </section>

      {/* Slide-in Health Profile Panel */}
      <HealthProfilePanel isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </div>
  );
}
