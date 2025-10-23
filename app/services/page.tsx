import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Features from "@/components/features-12";
import CallToAction from "@/components/call-to-action";
import FooterSection from "@/components/footer";
import {
  Code2,
  Brain,
  BarChart3,
  Settings,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import HeroHeader from "@/components/hero5-header";

export const metadata: Metadata = {
  title: "Layanan Kami - APIGS Indonesia",
  description:
    "Jelajahi layanan teknologi lengkap dari APIGS: Pengembangan Software, Konsultasi IT, AI & Machine Learning, dan Analitik Data.",
};

const services = [
  {
    title: "Software Development",
    slug: "software-development",
    description:
      "Pengembangan aplikasi web, mobile, dan sistem custom sesuai kebutuhan bisnis Anda.",
    icon: Code2,
    features: [
      "Web Application Development",
      "Mobile App Development (iOS & Android)",
      "API Development & Integration",
      "Database Design & Optimization",
      "Quality Assurance & Testing",
      "Maintenance & Support",
    ],
    technologies: [
      "React",
      "Next.js",
      "Node.js",
      "React Native",
      "PostgreSQL",
      "MongoDB",
    ],
    color: "blue",
  },
  {
    title: "IT Consulting",
    slug: "it-consulting",
    description:
      "Konsultasi strategis untuk transformasi digital dan optimalisasi infrastruktur IT.",
    icon: Settings,
    features: [
      "Digital Transformation Strategy",
      "IT Infrastructure Assessment",
      "System Architecture Design",
      "Technology Stack Recommendation",
      "Process Optimization",
      "Training & Knowledge Transfer",
    ],
    technologies: [
      "Cloud Services",
      "DevOps",
      "Microservices",
      "Docker",
      "Kubernetes",
      "AWS",
    ],
    color: "green",
  },
  {
    title: "AI & Machine Learning",
    slug: "ai-ml-development",
    description:
      "Implementasi solusi AI dan ML untuk automasi dan peningkatan efisiensi bisnis.",
    icon: Brain,
    features: [
      "Predictive Analytics",
      "Computer Vision Solutions",
      "Natural Language Processing",
      "Chatbot Development",
      "Recommendation Systems",
      "Process Automation",
    ],
    technologies: [
      "Python",
      "TensorFlow",
      "PyTorch",
      "OpenAI",
      "Hugging Face",
      "Langchain",
    ],
    color: "purple",
  },
  {
    title: "Data Analytics",
    slug: "data-analytics",
    description:
      "Transformasi data menjadi insights bisnis yang actionable untuk pengambilan keputusan.",
    icon: BarChart3,
    features: [
      "Business Intelligence Dashboard",
      "Data Visualization",
      "Statistical Analysis",
      "Data Pipeline Development",
      "Real-time Analytics",
      "Reporting & KPI Tracking",
    ],
    technologies: [
      "Power BI",
      "Tableau",
      "Apache Spark",
      "Elasticsearch",
      "Grafana",
      "D3.js",
    ],
    color: "orange",
  },
];

const colorClasses = {
  blue: "border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700",
  green:
    "border-green-200 dark:border-green-800 hover:border-green-300 dark:hover:border-green-700",
  purple:
    "border-purple-200 dark:border-purple-800 hover:border-purple-300 dark:hover:border-purple-700",
  orange:
    "border-orange-200 dark:border-orange-800 hover:border-orange-300 dark:hover:border-orange-700",
};

export default function ServicesPage() {
  return (
    <>
      {/* Hero Section */}
      <HeroHeader />
      <section className="pt-24 md:pt-36">
        <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16 lg:space-y-20">
          <div className="relative z-10 mx-auto max-w-3xl space-y-6 text-center">
            <h1 className="text-balance text-4xl font-semibold lg:text-6xl">
              Layanan Teknologi Terlengkap
            </h1>
            <p className="text-lg text-muted-foreground">
              Dari pengembangan software hingga implementasi AI, kami
              menyediakan solusi teknologi end-to-end untuk percepat
              transformasi digital bisnis Anda.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/contact">
                  Konsultasi Gratis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/portfolio">Lihat Portfolio</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      {/* Services Grid */}
      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 md:grid-cols-2">
            {services.map((service) => (
              <Card
                key={service.slug}
                className={`transition-all duration-300 hover:shadow-lg ${
                  colorClasses[service.color as keyof typeof colorClasses]
                }`}
              >
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <service.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                      <CardDescription className="mt-2">
                        {service.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Features */}
                  <div>
                    <h4 className="font-medium mb-3">Layanan Utama:</h4>
                    <div className="grid gap-2">
                      {service.features.map((feature) => (
                        <div
                          key={feature}
                          className="flex items-center gap-2 text-sm"
                        >
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                      {/* {service.features.length > 4 && (
                        <div className="text-sm text-muted-foreground">
                          +{service.features.length - 4} layanan lainnya
                        </div>
                      )} */}
                    </div>
                  </div>

                  {/* Technologies */}
                  <div>
                    <h4 className="font-medium mb-3">Teknologi:</h4>
                    <div className="flex flex-wrap gap-2">
                      {service.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 bg-muted rounded-md text-xs font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  {/* <div className="pt-4">
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={`/services/${service.slug}`}>
                        Pelajari Lebih Lanjut
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div> */}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* Process Section */}
      <section className="py-12 md:py-20 bg-muted/50">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold mb-4">Proses Kerja Kami</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Metodologi teruji untuk memastikan hasil yang optimal dan kepuasan
              klien
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-4">
            {[
              {
                step: "01",
                title: "Discovery",
                desc: "Analisis kebutuhan dan requirement gathering",
              },
              {
                step: "02",
                title: "Planning",
                desc: "Perencanaan strategis dan timeline proyek",
              },
              {
                step: "03",
                title: "Development",
                desc: "Implementasi solusi dengan metodologi agile",
              },
              {
                step: "04",
                title: "Delivery",
                desc: "Testing, deployment, dan knowledge transfer",
              },
            ].map((phase) => (
              <div key={phase.step} className="text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto text-xl font-bold">
                  {phase.step}
                </div>
                <h3 className="text-lg font-semibold">{phase.title}</h3>
                <p className="text-sm text-muted-foreground">{phase.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Existing Features Component */}
      <Features />
      <CallToAction />
      <FooterSection />
    </>
  );
}
