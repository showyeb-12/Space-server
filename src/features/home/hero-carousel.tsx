"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { A11y, Autoplay, EffectFade, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { buttonStyles } from "@/components/ui/button";

const slides = [
  {
    eyebrow: "Photo studios",
    title: "Shoot in the light you actually want.",
    description:
      "Daylight lofts, clean cycloramas, and prop rooms with honest hourly rates.",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=80",
    category: "Photo Studio",
    price: "From $65/hr",
  },
  {
    eyebrow: "Film stages",
    title: "Set the scene. Roll camera.",
    description:
      "Flexible stages, blackout rooms, and production-ready corners for crews of every size.",
    image:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1800&q=80",
    category: "Film Stage",
    price: "From $80/hr",
  },
  {
    eyebrow: "Podcast lounges",
    title: "Hit record in a room that sounds right.",
    description:
      "Treated walls, good mics, and quiet corners. Walk in, plug in, and publish.",
    image:
      "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1800&q=80",
    category: "Podcast Lounge",
    price: "From $40/hr",
  },
];

export function HeroCarousel() {
  return (
    <Swiper
      modules={[A11y, Autoplay, EffectFade, Pagination]}
      effect="fade"
      fadeEffect={{ crossFade: true }}
      loop
      speed={900}
      autoplay={{
        delay: 6500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      }}
      pagination={{ clickable: true }}
      a11y={{ enabled: true }}
      className="hero-swiper h-[34rem] w-full sm:h-[38rem] lg:h-[42rem]"
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={slide.category} className="relative overflow-hidden">
          <Image
            src={slide.image}
            alt=""
            fill
            priority={index === 0}
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10"
            aria-hidden="true"
          />
          <div
            className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-black/45 to-transparent"
            aria-hidden="true"
          />

          <div className="container-shell relative z-10 flex h-full flex-col justify-end pb-16 sm:pb-20">
            <p className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white/85 backdrop-blur">
              <Sparkles className="size-3.5" aria-hidden="true" />
              {slide.eyebrow}
            </p>
            <h1 className="mt-5 max-w-3xl font-display text-4xl font-semibold leading-[0.96] tracking-[-0.05em] text-white sm:text-5xl lg:text-7xl">
              {slide.title}
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
              {slide.description}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/studios"
                className={buttonStyles({ variant: "primary", size: "lg" })}
              >
                Explore Studios
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href="/studios"
                className={buttonStyles({
                  variant: "ghost",
                  size: "lg",
                  className:
                    "border border-white/20 text-white backdrop-blur hover:bg-white/15",
                })}
              >
                Host Your Space
              </Link>
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold text-white/70 backdrop-blur">
                {slide.price}
              </span>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
