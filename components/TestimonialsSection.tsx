'use strict';
import React, { memo, useState, useCallback, useEffect } from 'react';
import { Star, Heart, CheckCircle2, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface Testimonial {
  name: string;
  role: string;
  avatar: string;
  quote: string;
  rating: number;
  highlightBadge: string;
  platform: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Sarah Mitchell',
    role: 'Senior React / Next.js Developer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
    quote: 'UpPitch has completely changed my Upwork game. I get 3x more replies now and closed a $12,500 contract in my first week!',
    rating: 5,
    highlightBadge: '$12.5k Contract Won',
    platform: 'Upwork Top Rated Plus',
  },
  {
    name: 'James Thornton',
    role: 'Full-Stack & Cloud Architect',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
    quote: 'The AI-generated proposals with instant case-study proof are incredible. Saves me 10+ hours every week and the results speak for themselves.',
    rating: 5,
    highlightBadge: '98% Job Success Score',
    platform: 'Upwork Freelancer',
  },
  {
    name: 'Ayesha Khan',
    role: 'Lead UI/UX Product Designer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&auto=format&fit=crop&q=80',
    quote: 'The personalized problem-first approach makes a huge difference. Clients immediately mention my opening sentence in interview invitations.',
    rating: 5,
    highlightBadge: '5 New Clients This Month',
    platform: 'Design Agency Lead',
  },
  {
    name: 'Daniel Rivera',
    role: 'B2B Growth & Outreach Consultant',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80',
    quote: 'Clean interface, powerful features, and amazing support. We scaled our agency cold email reply rate from 6% to 22% using Variation B.',
    rating: 5,
    highlightBadge: '22% Cold Outreach Reply',
    platform: 'Outreach Consultant',
  },
  {
    name: 'Elena Rostova',
    role: 'Mobile Developer (iOS / Flutter)',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=160&auto=format&fit=crop&q=80',
    quote: 'I used to spend 40 minutes on every single proposal. Now it takes 10 seconds and the tone is sharper than anything I could write manually.',
    rating: 5,
    highlightBadge: '10s Proposal Speed',
    platform: 'Top Rated Upwork',
  },
  {
    name: 'Marcus Vance',
    role: 'AI & Machine Learning Engineer',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=160&auto=format&fit=crop&q=80',
    quote: 'The Project Bank matching is sheer genius. It automatically picked my distributed systems case study and impressed an enterprise client.',
    rating: 5,
    highlightBadge: '$18k Enterprise Deal',
    platform: 'Freelance AI Specialist',
  },
  {
    name: 'Priya Patel',
    role: 'Shopify Plus & Ecommerce Expert',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80',
    quote: 'Eliminating robotic greetings like "Dear Hiring Manager" changed everything. Clients love the direct technical breakdown.',
    rating: 5,
    highlightBadge: '4x More Interview Invites',
    platform: 'Ecommerce Agency',
  },
  {
    name: 'David Chen',
    role: 'DevOps & Kubernetes Consultant',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=160&auto=format&fit=crop&q=80',
    quote: 'I booked 4 high-ticket discovery calls in my first 48 hours using UpPitch. Best investment for any serious freelancer.',
    rating: 5,
    highlightBadge: '4 Discovery Calls in 48h',
    platform: 'DevOps Engineer',
  },
];

export const TestimonialsSection: React.FC = memo(() => {
  const [startIndex, setStartIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const totalItems = TESTIMONIALS.length;

  // Calculate items per page dynamically based on screen width
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setItemsPerPage(1);
      } else if (width < 1024) {
        setItemsPerPage(2);
      } else if (width < 1280) {
        setItemsPerPage(3);
      } else {
        setItemsPerPage(4);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, totalItems - itemsPerPage);

  // Keep startIndex valid when resizing
  useEffect(() => {
    if (startIndex > maxIndex) {
      setStartIndex(maxIndex);
    }
  }, [itemsPerPage, maxIndex, startIndex]);

  const handleNext = useCallback(() => {
    setStartIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const handlePrev = useCallback(() => {
    setStartIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setIsAutoPlay(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  // Auto-rotate every 6 seconds when not hovered/touched
  useEffect(() => {
    if (!isAutoPlay) return;
    const timer = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [isAutoPlay, handleNext]);

  // Calculate card width percentage and offset
  const cardWidthPercent = 100 / itemsPerPage;

  return (
    <section
      id="testimonials"
      className="mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8 scroll-mt-20 relative z-10"
      aria-labelledby="testimonials-title"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
    >
      <div className="text-center max-w-3xl mx-auto space-y-2.5">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1 text-xs font-semibold text-indigo-700 font-mono">
          <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500/20" />
          <span>Loved by Freelancers Worldwide</span>
        </div>

        <h2
          id="testimonials-title"
          className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight"
        >
          Real People. Real Results.
        </h2>

        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
          Join thousands of top freelancers and agency owners who land higher-paying clients with UpPitch.
        </p>
      </div>

      {/* Carousel Container with Interactive Navigation */}
      <div className="relative group/carousel">
        
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={handlePrev}
          className="cursor-pointer absolute -left-2 sm:-left-4 lg:-left-5 top-1/2 -translate-y-1/2 z-30 flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white/95 border border-indigo-200 shadow-lg text-slate-700 hover:text-indigo-600 hover:border-indigo-400 hover:scale-110 active:scale-95 transition-all duration-200 backdrop-blur-sm"
          aria-label="Previous Testimonials"
        >
          <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>

        {/* Testimonials Cards Grid Window */}
        <div
          className="overflow-hidden py-2 px-1 rounded-2xl touch-pan-y"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${startIndex * cardWidthPercent}%)`,
            }}
          >
            {TESTIMONIALS.map((item, idx) => (
              <div
                key={idx}
                style={{ width: `${cardWidthPercent}%` }}
                className="shrink-0 px-2 sm:px-2.5"
              >
                <div className="h-full rounded-2xl sm:rounded-3xl border border-indigo-100 bg-white p-4 sm:p-6 space-y-3.5 relative flex flex-col justify-between card-hover-lift shadow-md shadow-indigo-500/5 group hover:border-indigo-200 transition-all">
                  
                  <div className="space-y-3">
                    {/* Top: Avatar & Name */}
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <img
                        src={item.avatar}
                        alt={item.name}
                        className="h-10 w-10 sm:h-11 sm:w-11 rounded-full object-cover ring-2 ring-indigo-100 shrink-0 shadow-xs"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">{item.name}</h4>
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        </div>
                        <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">{item.role}</p>
                      </div>
                    </div>

                    {/* Middle: 5 Gold Stars */}
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>

                    {/* Quote Text */}
                    <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed font-normal">
                      &ldquo;{item.quote}&rdquo;
                    </p>
                  </div>

                  {/* Bottom: Highlight Metric Badge */}
                  <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-1">
                    <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 sm:px-2.5 py-0.5 text-[9px] sm:text-[10px] font-bold text-indigo-700 font-mono shrink-0">
                      {item.highlightBadge}
                    </span>
                    <span className="text-[9px] sm:text-[10px] text-slate-400 font-medium truncate">
                      {item.platform}
                    </span>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={handleNext}
          className="cursor-pointer absolute -right-2 sm:-right-4 lg:-right-5 top-1/2 -translate-y-1/2 z-30 flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white/95 border border-indigo-200 shadow-lg text-slate-700 hover:text-indigo-600 hover:border-indigo-400 hover:scale-110 active:scale-95 transition-all duration-200 backdrop-blur-sm"
          aria-label="Next Testimonials"
        >
          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>

      </div>

      {/* Pagination Indicator Dots */}
      <div className="flex items-center justify-center gap-1.5 pt-1">
        {[...Array(maxIndex + 1)].map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setStartIndex(idx)}
            className={`cursor-pointer h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
              startIndex === idx ? 'w-5 sm:w-6 bg-indigo-600' : 'w-1.5 sm:w-2 bg-indigo-200 hover:bg-indigo-300'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

    </section>
  );
});

TestimonialsSection.displayName = 'TestimonialsSection';
