"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChartArea, Brain, ChartNoAxesCombined, AppWindow } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BorderBeam } from "@/components/magicui/border-beam";

export default function Features() {
  type ImageKey = "item-1" | "item-2" | "item-3" | "item-4";
  const [activeItem, setActiveItem] = useState<ImageKey>("item-1");

  const images = {
    "item-1": {
      image: "/soft-dev.jpg",
      alt: "Software Development",
    },
    "item-2": {
      image: "/consult.jpg",
      alt: "IT Consulting",
    },
    "item-3": {
      image: "/ai-dev.jpg",
      alt: "Artificial Intelligence & Machine Learning",
    },
    "item-4": {
      image: "/data-dev.jpg",
      alt: "Data Analytics & Big Data",
    },
  };

  return (
    <section className="pt-12 md:pt-20 lg:pt-32" id="features">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16 lg:space-y-20 dark:[--color-border:color-mix(in_oklab,var(--color-white)_10%,transparent)]">
        <div className="relative z-10 mx-auto max-w-2xl space-y-6 text-center">
          <h2 className="text-balance text-4xl font-semibold lg:text-5xl">
            Solusi IT Terbaik untuk Bisnis Modern
          </h2>
          <p>
            Dari pengembangan software, konsultasi IT, hingga analitik data -
            solusi lengkap untuk percepat transformasi digital bisnis Anda.
          </p>
        </div>

        <div className="grid gap-12 sm:px-12 md:grid-cols-2 lg:gap-20 lg:px-0">
          <Accordion
            type="single"
            value={activeItem}
            onValueChange={(value) => setActiveItem(value as ImageKey)}
            className="w-full"
          >
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <div className="flex items-center gap-2 text-base">
                  <AppWindow className="size-4" />
                  Software Development
                </div>
              </AccordionTrigger>
              <AccordionContent>
                Mengembangkan web, mobile, dan desktop yang scalable dan sesuai
                kebutuhan unik bisnis Anda. Sistem ERP hingga platform
                e-commerce, solusi kami dibangun dengan teknologi modern.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>
                <div className="flex items-center gap-2 text-base">
                  <ChartNoAxesCombined className="size-4" />
                  IT Consulting
                </div>
              </AccordionTrigger>
              <AccordionContent>
                Memberikan rekomendasi berbasis data untuk transformasi digital
                bisnis Anda, termasuk migrasi cloud, optimasi infrastruktur, dan
                integrasi sistem.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>
                <div className="flex items-center gap-2 text-base">
                  <Brain className="size-4" />
                  Artificial Intelligence & Machine Learning
                </div>
              </AccordionTrigger>
              <AccordionContent>
                Tingkatkan efisiensi dengan solusi AI/ML custom: chatbot,
                analisis prediktif, atau computer vision. Kami membantu bisnis
                Anda mengolah data menjadi aksi nyata.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>
                <div className="flex items-center gap-2 text-base">
                  <ChartArea className="size-4" />
                  Data Analytics & Big Data
                </div>
              </AccordionTrigger>
              <AccordionContent>
                Mengubah data mentah menjadi insight berharga dengan layanan
                analitik kami. Dari dashboard real-time hingga pemodelan big
                data.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="bg-background relative flex overflow-hidden rounded-3xl border p-2">
            <div className="w-15 absolute inset-0 right-0 ml-auto border-l bg-[repeating-linear-gradient(-45deg,var(--color-border),var(--color-border)_1px,transparent_1px,transparent_8px)]"></div>
            <div className="aspect-76/59 bg-background relative w-[calc(3/4*100%+3rem)] rounded-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeItem}-id`}
                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="size-full overflow-hidden rounded-2xl border bg-zinc-900 shadow-md"
                >
                  <Image
                    src={images[activeItem].image}
                    className="size-full object-cover object-left-top dark:mix-blend-lighten"
                    alt={images[activeItem].alt}
                    width={1207}
                    height={929}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
            <BorderBeam
              duration={6}
              size={200}
              className="from-transparent via-yellow-700 to-transparent dark:via-white/50"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
