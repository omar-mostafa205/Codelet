"use client";

import { BookOpen, MessageSquare, Clock, Sparkles, Users, ArrowRight, Search, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import Link from "next/link";
import { useState } from "react";

function TutorialCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
            <div className="h-4 bg-gray-100 rounded-full w-1/3 mb-4" />
            <div className="h-6 bg-gray-200 rounded-full w-3/4 mb-3" />
            <div className="h-4 bg-gray-100 rounded-full w-full mb-2" />
            <div className="h-4 bg-gray-100 rounded-full w-2/3 mb-6" />
            <div className="flex gap-3">
                <div className="h-8 bg-gray-100 rounded-full w-24" />
                <div className="h-8 bg-gray-100 rounded-full w-24" />
            </div>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="col-span-full flex flex-col items-center justify-center py-28 text-center">
            <div className="relative mb-6">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center">
                    <BookOpen className="w-9 h-9 text-purple-500" />
                </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No tutorials yet</h3>
            <p className="text-gray-500 max-w-xs mb-8">
                Be the first to generate a tutorial and share your codebase knowledge with the community.
            </p>
            <Link href="/repo-upload">
                <button className="bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-900 transition-colors flex items-center gap-2">
                    Generate First Tutorial
                    <ArrowRight className="w-4 h-4" />
                </button>
            </Link>
        </div>
    );
}

function timeAgo(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
}

// Derive a consistent accent color per tutorial based on title
const CARD_ACCENTS = [
    { bg: "bg-purple-50", text: "text-purple-600", dot: "bg-purple-400", border: "border-purple-100" },
    { bg: "bg-orange-50", text: "text-orange-600", dot: "bg-orange-400", border: "border-orange-100" },
    { bg: "bg-gray-900", text: "text-gray-100", dot: "bg-green-400", border: "border-gray-800", dark: true },
    { bg: "bg-blue-50", text: "text-blue-600", dot: "bg-blue-400", border: "border-blue-100" },
];

function getAccent(title: string) {
    let hash = 0;
    for (let i = 0; i < title.length; i++) hash += title.charCodeAt(i);
    return CARD_ACCENTS[hash % CARD_ACCENTS.length];
}

export default function CommunityPage() {
    const router = useRouter();
    const [search, setSearch] = useState("");

    const { data: tutorials, isLoading } = api.project.getAllTutorials.useQuery();

    const filtered = tutorials?.filter((t) =>
        t.title?.toLowerCase().includes(search.toLowerCase()) ||
        t.description?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            {/* Hero */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 pt-14 pb-12">
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-100 text-purple-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
                            <span className="text-sm font-medium ">
                                COMMUNITY HUB
                            </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-3">
                                Explore Tutorials
                            </h1>
                            <p className="text-gray-500 text-lg max-w-xl">
                                AI-generated guides built from real codebases. Learn how others structured their projects.
                            </p>
                        </div>

                        {/* Stats row */}
                        <div className="flex gap-5 text-center flex-row">
                            <div className="bg-gray-50 rounded-2xl px-7 py-4 text-center min-w-[90px]">
                                <div className="text-2xl font-bold text-gray-900">{tutorials?.length ?? "—"} Tutorials</div>
                            </div>  
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative mt-8 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search tutorials..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-full py-3 pl-11 pr-5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300 transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <TutorialCardSkeleton key={i} />
                        ))}
                    </div>
                ) : (
                    <>
                        {filtered && filtered.length > 0 && (
                            <div className="flex items-center justify-between mb-6">
                                <p className="text-sm text-gray-500">
                                    {filtered.length} tutorial{filtered.length !== 1 ? "s" : ""}
                                    {search && ` for "${search}"`}
                                </p>
                                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                    <TrendingUp className="w-3.5 h-3.5" />
                                    Sorted by newest
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {!filtered || filtered.length === 0 ? (
                                <EmptyState />
                            ) : (
                                filtered.map((tutorial) => {
                                    const accent = getAccent(tutorial.title ?? "");
                                    const isDark = accent.dark;

                                    return (
                                        <div
                                            key={tutorial.id}
                                            onClick={() => router.push(`/dashboard/tutorial/${tutorial.id}`)}
                                            className={`
                        group relative rounded-2xl border p-6 cursor-pointer
                        transition-all duration-200 hover:-translate-y-1 hover:shadow-lg
                        ${isDark
                                                    ? "bg-gradient-to-br from-gray-900 to-black border-gray-800 hover:shadow-black/30"
                                                    : `bg-white ${accent.border} hover:shadow-gray-200/80`
                                                }
                      `}
                                        >
                                            {/* Top row */}
                                            <div className="flex items-start justify-between mb-5">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? "bg-white/10" : accent.bg}`}>
                                                    <BookOpen className={`w-5 h-5 ${isDark ? "text-purple-400" : accent.text}`} />
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <span className={`w-2 h-2 rounded-full ${accent.dot}`} />
                                                    <span className={`text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-400"}`}>
                                                        {timeAgo(tutorial.createdAt)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <h3 className={`font-bold text-lg leading-snug mb-2 line-clamp-2 group-hover:${isDark ? "text-purple-300" : accent.text} transition-colors ${isDark ? "text-white" : "text-gray-900"}`}>
                                                {tutorial.title ?? "Untitled Tutorial"}
                                            </h3>

                                            {tutorial.description && (
                                                <p className={`text-sm line-clamp-2 mb-5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                                                    {tutorial.description}
                                                </p>
                                            )}

                                            {/* Footer */}
                                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-dashed ${isDark ? 'border-white/10' : 'border-gray-100'}">
                                                <div className="flex items-center gap-3">
                                                    <div className={`flex items-center gap-1 text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                                                        <Clock className="w-3.5 h-3.5" />
                                                        {new Date(tutorial.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                                    </div>
                                                </div>

                                                <div className={`flex items-center gap-1 text-xs font-semibold transition-colors ${isDark ? "text-purple-400 group-hover:text-purple-300" : `${accent.text} opacity-0 group-hover:opacity-100`}`}>
                                                    View Tutorial
                                                    <ArrowRight className="w-3.5 h-3.5 translate-x-0 group-hover:translate-x-0.5 transition-transform" />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}