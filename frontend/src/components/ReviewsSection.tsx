"use client";

import { Star, CheckCircle2, Quote, ExternalLink, RefreshCw } from "lucide-react";
import { apiRequest } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

import { formatRealDate } from "@/lib/utils";

// Real reviews captured from user's Google Maps screenshot
const INITIAL_REVIEWS = [
    {
        name: "Jakey & Friends",
        date: "an hour ago",
        rating: 5,
        text: "Excellent service. My driver was waiting at Arrivals for me with a clear sign. He was very polite and friendly and drove me with no delay.",
        verified: true,
        img: null,
    },
    {
        name: "Piyush Chaudhari",
        date: "2 days ago",
        rating: 5,
        text: "Trimurti tour and travels very good taxi service car condition new top model and neet and clean taxi driver behaviour also good",
        verified: true,
        img: null,
    },
    {
        name: "Vikram Patil",
        date: "1 month ago",
        rating: 5,
        text: "Reliable and affordable. I use Trimurti daily for my corporate travels. Their billing process is transparent and drivers are always courteous.",
        verified: true,
        img: null,
    },
    {
        name: "Sneha K.",
        date: "5 days ago",
        rating: 5,
        text: "Safety was my priority as a solo traveler. Trimurti Tours provided GPS tracking and a verified driver. I felt very secure throughout the night trip.",
        verified: true,
        img: null,
    },
];

const ReviewsSection = () => {
    const [reviews, setReviews] = useState<any[]>(INITIAL_REVIEWS);
    const [isLive, setIsLive] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const [likedReviews, setLikedReviews] = useState<string[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem("liked_reviews");
        if (saved) setLikedReviews(JSON.parse(saved));

        const fetchReviews = async () => {
            try {
                const result = await apiRequest<{ success: boolean; data: any[] }>("/api/reviews");
                if (result.success && result.data.length > 0) {
                    setReviews(result.data);
                    setIsLive(true);
                } else {
                    setReviews(INITIAL_REVIEWS);
                    setIsLive(true);
                }
            } catch (error) {
                console.error("Failed to fetch reviews:", error);
                setReviews(INITIAL_REVIEWS);
                setIsLive(true);
            }
        };

        fetchReviews();
    }, []);

    const nextReview = () => {
        setCurrentIndex((prev) => (prev + 1) % reviews.length);
    };

    const prevReview = () => {
        setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
    };

    const currentReview = reviews[currentIndex];

    return (
        <section id="reviews" className="py-24 relative overflow-hidden bg-slate-50">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-[100px] -ml-48 -mb-48" />

            <div className="container relative z-10">
                <div className="grid lg:grid-cols-12 gap-12 items-center">
                    {/* Left Column: Stats & Branding */}
                    <div className="lg:col-span-12 xl:col-span-5 animate-fade-in-left">
                        <div className="space-y-6 text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
                            <span className={cn(
                                "inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border transition-all duration-500",
                                isLive ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-100 text-slate-400 border-slate-200"
                            )}>
                                {isLive ? (
                                    <>
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        CONNECTED TO GOOGLE MAPS
                                    </>
                                ) : (
                                    <>
                                        <RefreshCw size={12} className="animate-spin" />
                                        SYNCING REVIEWS...
                                    </>
                                )}
                            </span>
                            <h2 className="text-4xl md:text-6xl font-black text-slate-900 font-display leading-[1.1]">
                                Trusted by <br />
                                <span className="text-primary italic">100+ Happy Guests</span>
                            </h2>
                            <p className="text-slate-500 font-medium text-lg leading-relaxed">
                                Our reputation is built on reliability. Check out our real-time feedback from our Google Business Profile.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
                                <div className="flex items-center gap-4 bg-white px-6 py-4 rounded-3xl shadow-sm border border-slate-100">
                                    <div className="flex flex-col items-center">
                                        <div className="flex items-center gap-1 mb-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                                            ))}
                                        </div>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-2xl font-black text-slate-900">4.9</span>
                                            <span className="text-slate-400 text-[10px] font-bold">/ 5.0</span>
                                        </div>
                                    </div>
                                    <div className="w-px h-10 bg-slate-100 hidden sm:block" />
                                    <div className="text-center sm:text-left">
                                        <p className="text-slate-900 font-black text-sm uppercase tracking-tighter">Google Verified</p>
                                        <p className="text-slate-400 text-[10px] font-bold uppercase">Reputation Score</p>
                                    </div>
                                </div>
                                <a
                                    href="https://www.google.com/search?q=Trimurti+tours+and+travels+Amravati#lrd=0x3bd6a5ada334c66b:0x555cc87290f219fc,3"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-primary hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95 group/btn"
                                >
                                    Write a Review
                                    <ExternalLink size={14} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Review Carousel */}
                    <div className="lg:col-span-12 xl:col-span-7 flex flex-col gap-8">
                        {reviews.length > 0 && (
                            <div className="relative group/carousel">
                                {/* Navigation Buttons */}
                                <div className="absolute -left-4 sm:-left-6 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2">
                                    <button
                                        onClick={prevReview}
                                        suppressHydrationWarning
                                        className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-white shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/30 transition-all active:scale-90 group"
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="sm:w-6 sm:h-6 w-5 h-5"><path d="m15 18-6-6 6-6" /></svg>
                                    </button>
                                </div>
                                <div className="absolute -right-4 sm:-right-6 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2">
                                    <button
                                        onClick={nextReview}
                                        suppressHydrationWarning
                                        className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-white shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/30 transition-all active:scale-90 group"
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="sm:w-6 sm:h-6 w-5 h-5"><path d="m9 18 6-6-6-6" /></svg>
                                    </button>
                                </div>

                                {/* Active Review Card */}
                                <div
                                    key={currentIndex}
                                    className="bg-white p-8 sm:p-12 rounded-[2.5rem] sm:rounded-[4rem] border border-slate-100 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.05)] relative overflow-hidden animate-fade-in-right transform transition-all duration-700 hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.08)]"
                                >
                                    {/* Quote Icon Background */}
                                    <Quote size={120} className="absolute -top-6 -right-6 text-slate-50 rotate-12 opacity-50 transition-transform group-hover/carousel:-rotate-12 duration-1000" />

                                    <div className="relative space-y-6 sm:space-y-8">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                            <div className="flex items-center gap-5">
                                                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[2rem] bg-slate-900 flex items-center justify-center text-white font-black text-2xl uppercase shrink-0 shadow-2xl shadow-slate-200">
                                                    {currentReview.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-slate-900 font-black text-xl sm:text-2xl leading-tight">{currentReview.name}</p>
                                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
                                                        {currentReview.reviewerTitle || "Google Reviewer"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-start sm:items-end gap-2">
                                                <div className="flex items-center gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} size={18} className={cn(i < (currentReview.rating || 5) ? "fill-amber-400 text-amber-400" : "text-slate-100")} />
                                                    ))}
                                                </div>
                                                <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                                                    {formatRealDate(currentReview.reviewDate && currentReview.reviewTime ? `${currentReview.reviewDate}T${currentReview.reviewTime}` : (currentReview.reviewDate || currentReview.dateText || currentReview.date))}
                                                </span>
                                            </div>
                                        </div>

                                        <p className="text-slate-600 font-medium leading-[1.8] text-lg sm:text-xl italic">
                                            "{currentReview.text}"
                                        </p>

                                        {currentReview.ownerResponse && (
                                            <div className="mt-8 pt-8 border-t border-slate-50 relative group/response">
                                                <div className="absolute left-0 top-8 bottom-0 w-1.5 bg-primary/20 rounded-full" />
                                                <div className="pl-8 space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-slate-900 font-bold text-sm uppercase tracking-tighter italic">Response from management</p>
                                                        <CheckCircle2 size={16} className="text-emerald-500" />
                                                    </div>
                                                    <p className="text-slate-500 text-base leading-relaxed font-medium">
                                                        {currentReview.ownerResponse}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Review Progress Counter */}
                                <div className="mt-8 flex items-center justify-center lg:justify-end gap-6 px-4">
                                    <div className="flex gap-2">
                                        {reviews.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setCurrentIndex(idx)}
                                                suppressHydrationWarning
                                                className={cn(
                                                    "h-2 rounded-full transition-all duration-500",
                                                    currentIndex === idx ? "w-8 bg-primary" : "w-2 bg-slate-200 hover:bg-slate-300"
                                                )}
                                            />
                                        ))}
                                    </div>
                                    <div className="w-px h-6 bg-slate-100" />
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl font-black text-slate-900 leading-none">{String(currentIndex + 1).padStart(2, '0')}</span>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Review</span>
                                            <span className="text-[10px] font-bold text-slate-300 uppercase leading-none mt-0.5">of {String(reviews.length).padStart(2, '0')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ReviewsSection;
