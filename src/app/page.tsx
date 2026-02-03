"use client";

import { Navbar } from "@/components/navbar";
import { useLanguage } from "@/components/language-context";
import { StripeCard } from "@/components/ui/stripe-card";
import { HeartbeatDivider } from "@/components/ui/heartbeat-divider";
import { Threads } from "@/components/ui/threads";
import { Editable } from "@/components/ui/pencil-edit";
import { AdminLogin } from "@/components/admin-login";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Box, Zap, Mail, Linkedin, ChevronRight } from "lucide-react";
import { FlashlightEffect, StageLight } from "@/components/ui/flashlight-effect";
import MagicBento from "@/components/ui/magic-bento";
import Aurora from "@/components/ui/Aurora";
import Image from "next/image";
import dynamic from "next/dynamic";
import PremiumHero from "@/components/ui/premium-hero";

const ExperienceTimeline = dynamic(() => import("@/components/ui/experience-timeline").then(mod => mod.ExperienceTimeline), { ssr: true });
const EducationTimeline = dynamic(() => import("@/components/ui/education-timeline").then(mod => mod.EducationTimeline), { ssr: true });

function AchievementCard({ ach, removeItem, t }: { ach: any; removeItem: any; t: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`liquid-glass transition-all duration-500 group relative overflow-hidden flex flex-col cursor-pointer md:cursor-default shadow-lg hover:shadow-blue-500/5 rounded-[2rem] border border-white/5 hover:border-blue-500/30
        ${isOpen ? "bg-blue-500/[0.03]" : ""}`}
      onClick={() => {
        if (window.innerWidth < 768) setIsOpen(!isOpen);
      }}
    >
      <div className="p-4 md:p-8 flex flex-row items-center gap-4 md:gap-6 w-full relative z-10">
        {/* Glow effect on hover */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full pointer-events-none group-hover:bg-blue-500/15 transition-all" />

        <div className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-zinc-900 border border-white/10 overflow-hidden group-hover:border-blue-500/40 transition-all relative shadow-2xl z-20">
          <Image
            src={ach.image || "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?auto=format&fit=crop&w=100&q=80"}
            width={64}
            height={64}
            className="w-full h-full object-cover transition-all duration-700 scale-100 group-hover:scale-115"
            alt={ach.title}
          />
        </div>

        <div className="flex-1 flex flex-col relative z-20 min-w-0">
          <div className="flex items-center justify-between w-full">
            <h3 className="text-sm md:text-xl font-black outfit uppercase tracking-normal text-white group-hover:text-blue-400 transition-colors truncate pr-2">
              {ach.title}
            </h3>

            {/* Mobile Toggle Arrow */}
            <motion.div
              animate={{ rotate: isOpen ? 90 : 0 }}
              className="md:hidden w-8 h-8 flex items-center justify-center bg-white/10 rounded-full text-blue-400 border border-white/10 flex-shrink-0"
            >
              <ChevronRight size={14} />
            </motion.div>
          </div>

          {/* Desktop Description */}
          <div className="hidden md:block">
            <Editable
              translationKey={`achievements_list.${ach.id}`}
              fields={[
                { key: "title", label: "Başarı Başlığı", type: "text" },
                { key: "desc", label: "Kısa Açıklama", type: "text" },
                { key: "image", label: "İkon / Görsel", type: "image" }
              ]}
              onDelete={() => removeItem("achievements_list", ach._originalIndex)}
            >
              <p className="text-sm md:text-base text-white/50 leading-relaxed font-medium">
                {ach.desc}
              </p>
            </Editable>
          </div>
        </div>
      </div>

      {/* Mobile Collapsible Body */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden"
          >
            <div className="px-6 pb-6 pt-0 relative z-20">
              <Editable
                translationKey={`achievements_list.${ach.id}`}
                fields={[
                  { key: "title", label: "Başarı Başlığı", type: "text" },
                  { key: "desc", label: "Kısa Açıklama", type: "text" },
                  { key: "image", label: "İkon / Görsel", type: "image" }
                ]}
                onDelete={() => removeItem("achievements_list", ach._originalIndex)}
              >
                <div className="h-[1px] w-full bg-white/5 mb-4" />
                <p className="text-sm text-white/70 leading-relaxed font-medium">
                  {ach.desc}
                </p>
              </Editable>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


// Scroll Float Effect Wrapper
const FloatSection = ({ children, id, className = "" }: { children: React.ReactNode, id?: string, className?: string }) => {
  return (
    <section
      id={id}
      className={`relative ${className}`}
    >
      <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-black to-transparent z-[5] pointer-events-none opacity-40" />
      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-black to-transparent z-[5] pointer-events-none opacity-40" />
      {children}
    </section>
  );
};

export default function Home() {
  const { t, language, addItem, removeItem, isAdmin } = useLanguage();
  const [selectedBlog, setSelectedBlog] = useState<any>(null);

  const blogsData = t("blog_list");
  const blogs = Array.isArray(blogsData)
    ? blogsData.map((b: any, idx: number) => ({
      ...b,
      id: b.id || `blog-${idx}`,
      _originalIndex: idx
    }))
    : [];

  const existingCategories = Array.from(new Set(blogs.map((b: any) => b.category).filter(Boolean))) as string[];

  const blogFields: any[] = [
    { key: "title", label: "Başlık", type: "text" },
    { key: "category", label: "Kategori", type: "text", options: existingCategories },
    { key: "color", label: "Kategori Rengi (Hex)", type: "text" },
    { key: "desc", label: "Kısa Açıklama", type: "text" },
    { key: "content", label: "İçerik (Markdown)", type: "rich-text" },
    { key: "image", label: "Kapak Görseli", type: "image" },
  ];

  const servicesData = t("what_i_do");
  const services = Array.isArray(servicesData)
    ? servicesData.map((s: any, idx: number) => ({
      ...s,
      id: s.id || `service-${idx}`,
      _originalIndex: idx
    }))
    : [];

  const serviceFields: any[] = [
    { key: "title", label: "Başlık", type: "text" },
    { key: "description", label: "Açıklama", type: "text" },
  ];
  const toolboxData = t("toolbox");
  const toolboxSkills = Array.isArray(toolboxData)
    ? toolboxData.map((s: any, idx: number) => ({
      ...s,
      id: s.id || `skill-${idx}`,
      _originalIndex: idx
    }))
    : [];

  const skillFields: any[] = [
    { key: "name", label: "Yetenek Adı", type: "text" },
  ];

  return (
    <div className="relative min-h-screen bg-black">
      <Navbar />

      <main>
        <section id="home" className="relative">
          <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-black to-transparent z-[5] pointer-events-none opacity-40" />
          <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-black to-transparent z-[5] pointer-events-none opacity-40" />
          <PremiumHero
            title={t("hero_title")}
            description={t("hero_description")}
            badgeText={t("hero_welcome")}
            ctaButtons={[
              { text: t("nav_blog"), href: "#blog", primary: true },
              { text: t("nav_contact"), href: "#contact" }
            ]}
            microDetails={t("skills")}
            language={language}
          />
        </section>

        <FloatSection id="career">
          <div className="container mx-auto px-4 pb-8">
            <ExperienceTimeline />
          </div>
        </FloatSection>

        <HeartbeatDivider />

        <FloatSection id="education">
          <div className="container mx-auto px-4 py-8">
            <EducationTimeline />
          </div>
        </FloatSection>

        <HeartbeatDivider />

        <FloatSection id="achievements" className="py-24 px-6 max-w-7xl mx-auto border-t border-white/5 bg-gradient-to-b from-black to-blue-500/[0.02]">
          <div className="px-4 md:px-10">
            <div className="flex flex-col gap-4 mb-20">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <Editable translationKey="achievements_title" className="w-auto">
                  <h2 className="text-4xl md:text-6xl font-black outfit uppercase tracking-tighter text-white leading-none">
                    {t("achievements_title")}
                  </h2>
                </Editable>
                {isAdmin && (
                  <button
                    onClick={() => addItem("achievements_list", { title: "Yeni Başarı", desc: "Başarı detayı...", image: "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?auto=format&fit=crop&w=100&q=80" })}
                    className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2"
                  >
                    + BAŞARI EKLE
                  </button>
                )}
              </div>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
              {(() => {
                const achievementsData = t("achievements_list");
                const achievements = Array.isArray(achievementsData)
                  ? achievementsData.map((a: any, idx: number) => ({ ...a, id: a.id || `ach-${idx}`, _originalIndex: idx }))
                  : [];

                return (
                  <div className="space-y-6">
                    {achievements.map((ach: any) => (
                      <AchievementCard
                        key={ach.id}
                        ach={ach}
                        removeItem={removeItem}
                        t={t}
                      />
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        </FloatSection>

        <HeartbeatDivider />

        <FloatSection id="projects" className="py-16 px-6 max-w-7xl mx-auto border-t border-white/5 bg-gradient-to-b from-black to-blue-500/[0.02]">
          <div className="px-4 md:px-10">
            <div className="mb-16">
              <Editable translationKey="projects_title">
                <h2 className="text-4xl md:text-6xl font-black outfit uppercase tracking-tighter text-white leading-none">
                  {t("projects_title")}
                </h2>
              </Editable>
            </div>

            <div className="relative">
              <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

              <div className="glass p-8 md:p-12 rounded-[2.5rem] border border-white/5 relative overflow-hidden group/list bg-white/[0.01] max-w-3xl shadow-3xl transition-all duration-700 hover:bg-white/[0.02]">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at(100%_0%,rgba(59,130,246,0.15)_0%,rgba(255,255,255,0.05)_40%,transparent_70%)] blur-[100px] opacity-100 pointer-events-none z-0" />

                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-blue-500/[0.01] to-transparent pointer-events-none" />

                <div className="relative z-10">
                  <Editable
                    translationKey="projects_content"
                    type="rich-text"
                  >
                    {(() => {
                      const projectData = t("projects_content");
                      const htmlContent = projectData?.projects_content || projectData || "";

                      return (
                        <div
                          className="prose prose-invert prose-blue max-w-none outfit
                                     text-white/70 font-medium leading-relaxed text-sm md:text-[15px]
                                     prose-blockquote:text-lg md:prose-blockquote:text-xl prose-blockquote:text-white prose-blockquote:font-black prose-blockquote:italic prose-blockquote:tracking-tighter prose-blockquote:leading-snug prose-blockquote:border-l-4 prose-blockquote:border-l-blue-500 prose-blockquote:pl-6 prose-blockquote:py-1 prose-blockquote:my-8
                                     prose-ul:list-none prose-ul:p-0 prose-ul:mt-4
                                     prose-li:relative prose-li:pl-7 prose-li:mb-4
                                     prose-li:before:content-[''] prose-li:before:absolute prose-li:before:left-0 prose-li:before:top-[0.65em]
                                     prose-li:before:w-1.5 prose-li:before:h-1.5 prose-li:before:bg-blue-500/50 prose-li:before:rounded-full
                                     prose-p:mb-4 prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline tracking-wide"
                          dangerouslySetInnerHTML={{ __html: htmlContent }}
                        />
                      );
                    })()}
                  </Editable>
                </div>
              </div>
            </div>
          </div>
        </FloatSection>

        <HeartbeatDivider />

        <FloatSection id="blog" className="py-16 px-6">
          <div className="max-w-7xl mx-auto px-4 md:px-10">
            <div className="mb-16 text-left">
              <Editable translationKey="blog_heading" type="text">
                <h2 className="text-4xl md:text-6xl font-black outfit uppercase tracking-tighter text-white leading-none">
                  {t("blog_heading")}
                </h2>
              </Editable>
            </div>

            {isAdmin && (
              <button
                onClick={() => addItem("blog_list", { title: "Yeni Yazı", category: "Genel", color: "#3b82f6", desc: "Kısa açıklama...", content: "", image: "" })}
                className="mb-8 px-6 py-3 bg-green-500 text-white rounded-full text-sm font-bold"
              >
                + Yazı Ekle
              </button>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog: any) => (
                <Editable
                  key={blog.id}
                  translationKey={`blog_list.${blog.id}`}
                  fields={blogFields}
                  onDelete={() => removeItem("blog_list", blog._originalIndex)}
                >
                  <div onClick={() => setSelectedBlog(blog)} className="cursor-pointer">
                    <StripeCard
                      title={blog.title}
                      categoryName={blog.category}
                      categoryColor={blog.color}
                      description={blog.desc}
                      image={blog.image}
                      linkText={language === 'tr' ? 'DEVAMINI OKU' : 'READ MORE'}
                    />
                  </div>
                </Editable>
              ))}
            </div>
          </div>
        </FloatSection>

        <HeartbeatDivider />

        <AnimatePresence>
          {selectedBlog && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-2xl"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-zinc-950 w-full max-w-5xl max-h-full overflow-y-auto rounded-[3rem] border border-white/10 shadow-3xl relative"
              >
                <button
                  onClick={() => setSelectedBlog(null)}
                  className="absolute top-8 right-8 p-4 bg-white/5 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-all z-10"
                >
                  <X size={24} />
                </button>

                {selectedBlog.image && (
                  <div className="w-full h-[400px] relative">
                    <Image src={selectedBlog.image} fill className="object-cover" alt="" />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                  </div>
                )}

                <div className="p-10 md:p-20">
                  <div className="flex items-center gap-4 mb-8">
                    <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 bg-white/5" style={{ color: selectedBlog.color }}>
                      {selectedBlog.category}
                    </span>
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black outfit uppercase tracking-tighter mb-10 leading-none text-white">
                    {selectedBlog.title}
                  </h2>
                  <div
                    className="prose prose-invert prose-blue max-w-none 
                             prose-p:text-white/90 prose-p:text-lg prose-p:leading-relaxed
                             prose-headings:text-white prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter
                             prose-strong:text-blue-400 prose-code:text-blue-300"
                    dangerouslySetInnerHTML={{ __html: selectedBlog.content || selectedBlog.desc }}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <FloatSection id="about" className="py-16 px-6 border-t border-white/5 bg-gradient-to-b from-black to-zinc-950 scroll-mt-24 relative overflow-hidden">
          <StageLight />
          <FlashlightEffect />
          <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-black to-transparent z-[5] pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
              <div className="space-y-10">
                <div className="flex flex-col gap-4">
                  <span className="text-blue-500 text-[10px] font-black tracking-[0.4em] uppercase">{t("about_badge") || (language === 'tr' ? 'HAKKIMDA' : 'ABOUT ME')}</span>
                  <Editable translationKey="about_title">
                    <h2 className="text-4xl md:text-6xl font-black outfit uppercase tracking-tighter leading-[0.85] text-white">
                      {t("about_title")}
                    </h2>
                  </Editable>
                </div>

                <div className="flex flex-col gap-10">
                  <Editable translationKey="about_text" type="rich-text">
                    <div
                      className="prose prose-invert prose-lg max-w-none text-white/70 leading-[1.8] font-medium outfit
                                prose-strong:text-blue-400 prose-strong:font-black
                                prose-p:mb-8 text-base md:text-lg tracking-wide"
                      dangerouslySetInnerHTML={{ __html: t("about_text") || t("about_content") }}
                    />
                  </Editable>
                </div>
              </div>

              <div className="relative flex justify-center lg:justify-end">
                <div className="w-full max-w-[320px] aspect-[4/5] relative group">
                  <div className="absolute inset-0 bg-blue-600/20 blur-[80px] rounded-full group-hover:bg-blue-600/40 transition-all duration-1000 opacity-50" />
                  <div className="relative w-full h-full rounded-[2.5rem] border border-white/10 overflow-hidden glass p-3 transform group-hover:scale-[1.02] group-hover:-rotate-1 transition-all duration-700 shadow-3xl">
                    <div className="relative w-full h-full rounded-[1.8rem] overflow-hidden bg-zinc-900 border border-white/5 relative">
                      <Editable translationKey="about_image" type="image">
                        <Image
                          src={t("about_image")}
                          width={400}
                          height={500}
                          className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
                          alt={t("profile_card.name")}
                        />
                      </Editable>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60" />
                    </div>
                  </div>
                  {/* Outer Floating Element */}
                  <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-500/10 backdrop-blur-xl border border-white/10 rounded-3xl -z-10 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-700" />
                </div>
              </div>
            </div>

            <div className="pt-16 border-t border-white/5 relative">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-16">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                      <Box size={20} />
                    </div>
                    <h4 className="text-2xl font-black uppercase tracking-tighter text-white">
                      ALET ÇANTAMDA NELER VAR?
                    </h4>
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30 ml-14">
                    TEKNİK BECERİLERİM VE KULLANDIĞIM TEKNOLOJİLER
                  </p>
                </div>

                {isAdmin && (
                  <button
                    onClick={() => addItem("toolbox", { name: "YENİ YETENEK" })}
                    className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-white transition-all backdrop-blur-md"
                  >
                    + YETENEK EKLE
                  </button>
                )}
              </div>

              <div className="relative z-10">
                <MagicBento
                  data={toolboxSkills.map(skill => ({
                    title: skill.name,
                    color: "rgba(255, 255, 255, 0.01)"
                  }))}
                  textAutoHide={false}
                  enableStars
                  enableSpotlight
                  enableBorderGlow={true}
                  enableTilt={true}
                  enableMagnetism={true}
                  clickEffect
                  spotlightRadius={400}
                  particleCount={8}
                  glowColor="59, 130, 246"
                />
              </div>
            </div>
          </div>
        </FloatSection>

        <HeartbeatDivider />

        <FloatSection id="contact" className="py-16 px-6 relative overflow-hidden bg-black">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.03)_0%,transparent_50%)]" />

          <div className="max-w-7xl mx-auto px-4 relative z-10 mb-32">
            {isAdmin && (
              <div className="flex justify-end mb-12">
                <button
                  onClick={() => addItem("what_i_do", { title: "Yeni Hizmet", description: "Hizmet açıklaması..." })}
                  className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-white transition-all backdrop-blur-md"
                >
                  + HİZMET EKLE
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services.map((s: any) => (
                <Editable
                  key={s.id}
                  translationKey={`what_i_do.${s.id}`}
                  fields={serviceFields}
                  onDelete={() => removeItem("what_i_do", s._originalIndex)}
                  className="w-full"
                >
                  <div className="glass p-10 rounded-[3rem] border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all group h-full">
                    <div className="flex flex-col gap-8">
                      <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20 group-hover:scale-110 transition-transform group-hover:bg-blue-500/20">
                        <Zap size={28} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black uppercase tracking-tighter text-white mb-4 leading-tight">{s.title}</h3>
                        <p className="text-sm text-white/40 leading-relaxed font-medium">{s.description}</p>
                      </div>
                    </div>
                  </div>
                </Editable>
              ))}
            </div>
          </div>

          <div className="max-w-4xl mx-auto relative z-10">
            <div className="glass p-16 md:p-24 rounded-[4rem] border border-white/10 border-t-blue-500 border-t-2 relative overflow-hidden group/contact-card shadow-3xl bg-white/[0.01]">
              <Aurora
                colorStops={["#3b82f6", "#10b981", "#3b82f6"]}
                blend={0.5}
                amplitude={1.0}
                speed={0.5}
              />
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.1)_0%,transparent_70%)] pointer-events-none" />

              <div className="relative z-10 text-center flex flex-col items-center">
                <Editable translationKey="contact_title">
                  <h2 className="text-4xl md:text-7xl font-black outfit uppercase tracking-tighter leading-[0.9] mb-8 text-white">
                    {t("contact_title")}
                  </h2>
                </Editable>

                <Editable translationKey="contact_subtitle">
                  <p className="text-white/50 text-base italic font-medium mb-16 max-w-xl">
                    {t("contact_subtitle")}
                  </p>
                </Editable>

                <div className="flex justify-center w-full">
                  <Editable translationKey="social.email" type="text" className="w-full flex justify-center">
                    <a href={`mailto:${t("social.email")}`} className="relative group inline-block">
                      <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full group-hover:bg-white/40 transition-all opacity-0 group-hover:opacity-100" />
                      <div className="relative bg-white text-black px-16 py-6 rounded-full font-black uppercase tracking-[0.2em] text-[11px] hover:scale-110 active:scale-95 transition-all shadow-2xl">
                        {t("contact_btn") || (language === 'tr' ? 'ANALİZE BAŞLAYALIM' : 'START ANALYSIS')}
                      </div>
                    </a>
                  </Editable>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto mt-20 relative z-10 px-4 md:px-0">
            <div className="flex flex-col gap-8 mb-10">
              <div className="flex items-center gap-4">
                <div className="w-8 h-[1px] bg-blue-500/30" />
                <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">
                  {language === 'tr' ? 'DİĞER KANALLAR' : 'OTHER CHANNELS'}
                </span>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Email Card */}
              <a
                href={`mailto:${t("social.email")}`}
                className="flex-1 glass group/card p-8 rounded-[2.5rem] border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20 group-hover/card:scale-110 transition-transform">
                    <Mail size={24} />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] block mb-1">{language === 'tr' ? 'E-POSTA' : 'EMAIL'}</span>
                    <span className="text-sm font-bold text-white/70 group-hover/card:text-white transition-colors">{t("social.email")}</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/20 group-hover/card:border-emerald-500/50 group-hover/card:text-emerald-500 transition-all">
                  <Zap size={16} />
                </div>
              </a>

              {/* LinkedIn Card */}
              <a
                href={t("social.linkedin")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 glass group/card p-8 rounded-[2.5rem] border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20 group-hover/card:scale-110 transition-transform">
                    <Linkedin size={24} />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] block mb-1">LINKEDIN</span>
                    <span className="text-sm font-bold text-white/70 group-hover/card:text-white transition-colors">{language === 'tr' ? 'Profesyonel Ağ' : 'Professional Network'}</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/20 group-hover/card:border-blue-500/50 group-hover/card:text-blue-500 transition-all">
                  <Zap size={16} />
                </div>
              </a>
            </div>
          </div>
        </FloatSection>

        <footer className="relative pt-40 pb-16 px-6 overflow-hidden border-t border-white/5 bg-black">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl opacity-20 pointer-events-none">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ rotate: 360 }}
                transition={{ duration: 20 + i * 10, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 left-1/2 -translate-x-1/2 border border-white/5 rounded-full"
                style={{
                  width: `${(i + 1) * 40}%`,
                  aspectRatio: "1",
                  top: `-${(i + 1) * 10}%`,
                }}
              >
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 3, repeat: Infinity, delay: i }}
                  className="absolute top-0 left-1/2 -translate-x-1/2 h-1.5 w-1.5 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,1)]"
                />
              </motion.div>
            ))}
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
              <div className="col-span-1 md:col-span-2">
                <div className="space-y-2 mb-8">
                  <Editable translationKey="footer_title_line1">
                    <h2 className="text-4xl md:text-6xl font-black outfit uppercase tracking-tighter leading-none text-white">
                      {t("footer_title_line1")}
                    </h2>
                  </Editable>
                  <Editable translationKey="footer_title_line2">
                    <h2 className="text-4xl md:text-6xl font-black outfit uppercase tracking-tighter leading-none text-blue-500">
                      {t("footer_title_line2")}
                    </h2>
                  </Editable>
                </div>

                <Editable translationKey="footer_desc">
                  <p className="text-white/40 max-w-md text-lg italic mt-4">
                    {t("footer_desc")}
                  </p>
                </Editable>
              </div>

              <div>
                <h4 className="text-white/20 text-[10px] font-bold uppercase tracking-[0.3em] mb-8">{language === 'tr' ? 'Navigasyon' : 'Navigation'}</h4>
                <ul className="flex flex-col gap-4 text-sm font-medium">
                  <li><a href="#home" className="hover:text-blue-500 transition-colors uppercase tracking-widest text-[10px] font-black pointer-events-auto text-white">{t("nav_welcome")}</a></li>
                  <li><a href="#career" className="hover:text-blue-500 transition-colors uppercase tracking-widest text-[10px] font-black pointer-events-auto text-white">{t("nav_career")}</a></li>
                  <li><a href="#blog" className="hover:text-blue-500 transition-colors uppercase tracking-widest text-[10px] font-black pointer-events-auto text-white">{t("nav_blog")}</a></li>
                  <li><a href="#about" className="hover:text-blue-500 transition-colors uppercase tracking-widest text-[10px] font-black pointer-events-auto text-white">{t("nav_whoami")}</a></li>
                </ul>
              </div>

              <div>
                <h4 className="text-white/20 text-[10px] font-bold uppercase tracking-[0.3em] mb-8">{language === 'tr' ? 'Sosyal Medya' : 'Social Media'}</h4>
                <ul className="flex flex-col gap-4 text-sm font-medium h-fit">
                  <Editable translationKey="social.linkedin" type="link">
                    <li><a href={t("social.linkedin")} target="_blank" className="hover:text-blue-500 transition-colors uppercase tracking-widest text-[10px] font-black pointer-events-auto text-white">LinkedIn</a></li>
                  </Editable>
                  <Editable translationKey="social.github" type="link">
                    <li><a href={t("social.github")} target="_blank" className="hover:text-blue-500 transition-colors uppercase tracking-widest text-[10px] font-black pointer-events-auto text-white">GitHub</a></li>
                  </Editable>
                  <Editable translationKey="social.email" type="text">
                    <li><a href={`mailto:${t("social.email")}`} className="hover:text-blue-500 transition-colors uppercase tracking-widest text-[10px] font-black pointer-events-auto text-white">Email</a></li>
                  </Editable>
                </ul>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between pt-12 border-t border-white/5 gap-8">
              <p className="text-white/20 text-[10px] font-bold uppercase tracking-[0.5em] text-center md:text-left">
                © {new Date().getFullYear()} Şükrücan Cebeci. {language === 'tr' ? 'Tüm Hakları Saklıdır.' : 'All Rights Reserved.'}
              </p>
              <div className="flex items-center gap-4 text-white/30 text-[11px] italic">
                <Editable translationKey="footer_joke">
                  <span>{t("footer_joke")}</span>
                </Editable>
                <div className="h-1 w-1 rounded-full bg-blue-500" />
                <AdminLogin />
              </div>
            </div>
          </div>

          {/* Footer Glow Background */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)] pointer-events-none" />
        </footer>
      </main>
    </div>
  );
}
