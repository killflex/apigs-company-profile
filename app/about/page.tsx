import { Metadata } from "next";
import TeamSection from "@/components/team";
import StatsSection from "@/components/stats";
import CallToAction from "@/components/call-to-action";
import FooterSection from "@/components/footer";
import HeroHeader from "@/components/hero5-header";
import { getAboutPageData, getCompanyDetails } from "@/lib/data/queries";

export async function generateMetadata(): Promise<Metadata> {
  const company = await getCompanyDetails();

  return {
    title: `About Us - ${company.companyName}`,
    description: company.aboutUs
      ? `Learn about ${company.companyName}, our mission, vision, and the talented team behind our innovative IT solutions and services.`
      : `Learn about ${company.companyName}, our mission, vision, and the talented team behind our innovative IT solutions and services.`,
  };
}

export default async function AboutPage() {
  // Fetch all data in parallel for optimal performance
  const { company } = await getAboutPageData();
  return (
    <>
      {/* Reuse existing hero but with different content focus */}
      <HeroHeader />
      <section className="pt-24 md:pt-36">
        <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16 lg:space-y-20">
          <div className="relative z-10 mx-auto max-w-3xl space-y-6 text-center">
            <h1 className="text-balance text-4xl font-semibold lg:text-6xl">
              Tentang APIGS
            </h1>
            <p className="text-lg text-muted-foreground">
              {company.tagline ||
                "Advanced Programming & Information Gateway Solutions - Mitra teknologi terpercaya untuk transformasi digital bisnis Anda di Indonesia."}
            </p>
          </div>
        </div>
      </section>
      {/* Company Story Section */}
      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-semibold">Cerita Kami</h2>
              <div className="space-y-4 text-muted-foreground">
                {company.aboutUs ? (
                  <div
                    className="prose dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: company.aboutUs }}
                  />
                ) : (
                  <>
                    <p>
                      {company.companyName} didirikan dengan visi untuk menjadi
                      jembatan antara kebutuhan bisnis modern dengan solusi
                      teknologi inovatif. Kami memahami bahwa setiap perusahaan
                      memiliki tantangan unik dalam era digital ini.
                    </p>
                    <p>
                      Dengan pengalaman{" "}
                      {company.yearsExperience || "bertahun-tahun"} tahun dalam
                      industri teknologi, tim kami berkomitmen untuk memberikan
                      solusi yang tidak hanya memenuhi kebutuhan saat ini,
                      tetapi juga mempersiapkan bisnis Anda untuk masa depan.
                    </p>
                    <p>
                      Dari pengembangan perangkat lunak khusus hingga
                      implementasi AI dan analitik data, kami hadir sebagai
                      partner teknologi yang dapat diandalkan.
                    </p>
                  </>
                )}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 p-1">
                <div className="h-full w-full rounded-xl bg-background flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                      {company.foundedYear || 2020}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Tahun Didirikan
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Mission & Vision */}
      <section className="py-12 md:py-20 bg-muted/50">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <h2 className="text-3xl font-semibold">Misi Kami</h2>
              {company.mission ? (
                <div
                  className="text-muted-foreground prose dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: company.mission }}
                />
              ) : (
                <p className="text-muted-foreground">
                  Memberikan solusi teknologi inovatif yang dapat meningkatkan
                  efisiensi, produktivitas, dan daya saing bisnis klien kami.
                  Kami berkomitmen untuk menjadi partner terpercaya dalam setiap
                  langkah transformasi digital.
                </p>
              )}
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-semibold">Visi Kami</h2>
              {company.vision ? (
                <div
                  className="text-muted-foreground prose dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: company.vision }}
                />
              ) : (
                <p className="text-muted-foreground">
                  Menjadi perusahaan teknologi terdepan di Indonesia yang
                  dikenal karena inovasi, kualitas, dan dedikasi dalam membantu
                  bisnis mencapai potensi penuh mereka di era digital.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
      {/* Values Section */}
      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold mb-4">Nilai-Nilai Kami</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Nilai-nilai yang memandu setiap keputusan dan tindakan kami dalam
              melayani klien
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mx-auto">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold">Inovasi</h3>
              <p className="text-sm text-muted-foreground">
                Selalu mencari solusi kreatif dan teknologi terdepan untuk
                mengatasi tantangan bisnis
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold">Kolaborasi</h3>
              <p className="text-sm text-muted-foreground">
                Bekerja sama dengan klien sebagai partner untuk mencapai hasil
                terbaik
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center mx-auto">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="text-xl font-semibold">Kualitas</h3>
              <p className="text-sm text-muted-foreground">
                Komitmen pada standar kualitas tinggi dalam setiap proyek dan
                layanan
              </p>
            </div>
          </div>
        </div>
      </section>
      <StatsSection />
      <TeamSection />
      <CallToAction />
      <FooterSection />
    </>
  );
}
