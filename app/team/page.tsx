import { Metadata } from "next";
import TeamSection from "@/components/team";
import CallToAction from "@/components/call-to-action";
import FooterSection from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Users,
  Target,
  Award,
  ArrowRight,
  MapPin,
  Briefcase,
} from "lucide-react";
import HeroHeader from "@/components/hero5-header";
import { getCompanyDetails, getTeamMembers } from "@/lib/data/queries";

export async function generateMetadata(): Promise<Metadata> {
  const company = await getCompanyDetails();

  return {
    title: `Tim Kami - ${company.companyName}`,
    description: `Kenali tim berbakat di balik ${company.companyName}. Para ahli kami dalam pengembangan perangkat lunak, AI, analitik data, dan konsultasi IT siap membantu bisnis Anda berkembang.`,
  };
}

const departments = [
  {
    name: "Pengembangan Perangkat Lunak",
    description:
      "Developer full-stack, spesialis aplikasi mobile, dan ahli frontend",
    members: 12,
    roles: [
      "Frontend Developer",
      "Backend Developer",
      "Mobile Developer",
      "DevOps Engineer",
    ],
  },
  {
    name: "AI & Sains Data",
    description: "Engineer machine learning, data scientist, dan spesialis AI",
    members: 6,
    roles: ["ML Engineer", "Data Scientist", "AI Researcher", "Data Analyst"],
  },
  {
    name: "Konsultasi IT",
    description:
      "Solution architect, business analyst, dan konsultan teknologi",
    members: 4,
    roles: ["Solution Architect", "Business Analyst", "Technical Consultant"],
  },
  {
    name: "Manajemen & Operasional",
    description: "Tim kepemimpinan, project manager, dan dukungan operasional",
    members: 3,
    roles: ["Project Manager", "Operations Manager", "HR Specialist"],
  },
];

const benefits = [
  "Gaji dan tunjangan yang kompetitif",
  "Pengaturan kerja yang fleksibel",
  "Anggaran pengembangan profesional",
  "Teknologi dan tools terkini",
  "Asuransi kesehatan",
  "Kegiatan team building",
  "Kesempatan konferensi dan pelatihan",
  "Dukungan work-life balance",
];

export default async function TeamPage() {
  // Fetch company details and team members in parallel
  const [company, team] = await Promise.all([
    getCompanyDetails(),
    getTeamMembers(),
  ]);

  // Generate dynamic stats from database
  const companyStats = [
    {
      label: "Anggota Tim",
      value: `${company.teamMembersCount || team.length}+`,
      icon: Users,
    },
    {
      label: "Tahun Pengalaman",
      value: `${company.yearsExperience || "50"}+`,
      icon: Award,
    },
    {
      label: "Proyek Selesai",
      value: `${company.projectsCompleted || "100"}+`,
      icon: Target,
    },
  ];
  return (
    <>
      {/* Hero Section */}
      <HeroHeader />
      <section className="pt-24 md:pt-36">
        <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
          <div className="relative z-10 mx-auto max-w-3xl space-y-6 text-center">
            <h1 className="text-balance text-4xl font-semibold lg:text-6xl">
              Kenali Tim Hebat Kami di {company.companyName}
            </h1>
            <p className="text-lg text-muted-foreground">
              Teknolog yang bersemangat, pemecah masalah yang kreatif, dan
              profesional yang berdedikasi bekerja bersama untuk memberikan
              hasil luar biasa bagi klien kami.
            </p>
          </div>
        </div>
      </section>
      {/* Company Stats */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-6 md:grid-cols-3">
            {companyStats.map((stat) => (
              <Card key={stat.label} className="text-center">
                <CardContent className="pt-6">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-3xl font-bold mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* Departments */}
      <section className="py-12 md:py-20 bg-muted/50">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold mb-4">Departemen Kami</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Setiap departemen membawa keahlian khusus dan perspektif unik
              untuk memberikan solusi teknologi yang komprehensif.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {departments.map((dept) => (
              <Card key={dept.name}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{dept.name}</span>
                    <span className="text-sm font-normal text-muted-foreground flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {dept.members} anggota
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{dept.description}</p>
                  <div>
                    <h4 className="font-medium mb-2">Peran Utama:</h4>
                    <div className="flex flex-wrap gap-2">
                      {dept.roles.map((role) => (
                        <span
                          key={role}
                          className="px-2 py-1 bg-muted rounded-md text-xs"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* Team Members - Reuse existing component */}
      <TeamSection />
      {/* Culture & Benefits */}
      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-semibold">
                Mengapa Bergabung dengan {company.companyName}?
              </h2>
              <p className="text-muted-foreground">
                Kami percaya bahwa teknologi hebat berasal dari orang-orang
                hebat. Budaya kami dibangun atas kolaborasi, pembelajaran
                berkelanjutan, dan inovasi. Kami menyediakan lingkungan di mana
                individu berbakat dapat berkembang dan memberikan dampak yang
                berarti.
              </p>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Yang Kami Tawarkan:</h3>
                <div className="grid gap-2">
                  {benefits.map((benefit) => (
                    <div key={benefit} className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-primary rounded-full" />
                      <span className="text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Lokasi Kerja
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {company.officeAddress && (
                      <div>
                        <h4 className="font-medium">Lokasi Kantor (Pusat)</h4>
                        <p className="text-sm text-muted-foreground">
                          {company.officeAddress}
                        </p>
                        {company.officeAddressUrl && (
                          <a
                            href={company.officeAddressUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline"
                          >
                            Lihat di Maps →
                          </a>
                        )}
                      </div>
                    )}
                    {company.operationalHours && (
                      <div>
                        <h4 className="font-medium">Jam Kerja</h4>
                        <p className="text-sm text-muted-foreground">
                          {company.operationalHours}
                          {company.timezone && ` (${company.timezone})`}
                        </p>
                      </div>
                    )}
                    <div>
                      <h4 className="font-medium">Kerja Remote</h4>
                      <p className="text-sm text-muted-foreground">
                        Opsi kerja remote yang fleksibel tersedia
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium">Model Hybrid</h4>
                      <p className="text-sm text-muted-foreground">
                        Keseimbangan kolaborasi di kantor dan fleksibilitas
                        remote
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Pertumbuhan Karir
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Kami berinvestasi dalam pengembangan profesional tim melalui
                    program mentoring, pelatihan teknis, kehadiran konferensi,
                    dan dukungan sertifikasi.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      {/* Join Our Team CTA */}
      <section className="py-12 md:py-20 bg-muted/50">
        <div className="mx-auto max-w-4xl px-6 text-center space-y-6">
          <h2 className="text-3xl font-semibold">
            Siap Bergabung dengan Tim Kami?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Kami selalu mencari individu berbakat yang bersemangat tentang
            teknologi dan ingin membuat perbedaan. Lihat lowongan kami saat ini
            atau hubungi kami.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/contact">
                Hubungi Kami untuk Peluang Karir
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            {company.contactEmail && (
              <Button variant="outline" size="lg" asChild>
                <Link href={`mailto:${company.contactEmail}`}>Email</Link>
              </Button>
            )}
          </div>
        </div>
      </section>
      <CallToAction />
      <FooterSection />
    </>
  );
}
