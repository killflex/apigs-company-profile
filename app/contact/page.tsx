import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ContactForm from "@/components/contact-form";
import FooterSection from "@/components/footer";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageSquare,
  Building2,
  MessageCircle,
} from "lucide-react";
import HeroHeader from "@/components/hero5-header";
import { getCompanyDetails } from "@/lib/data/queries";

export async function generateMetadata(): Promise<Metadata> {
  const company = await getCompanyDetails();

  return {
    title: `Kontak Kami - ${company.companyName}`,
    description: `Hubungi ${company.companyName} untuk konsultasi teknologi, diskusi proyek, atau kerjasama. Tim kami siap membantu kebutuhan IT Anda.`,
  };
}

const inquiryTypes = [
  {
    title: "Project Inquiry",
    description: "Diskusikan kebutuhan proyek teknologi Anda",
    icon: Building2,
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    title: "General Support",
    description: "Pertanyaan umum tentang layanan kami",
    icon: MessageSquare,
    bgColor: "bg-green-50 dark:bg-green-950/20",
    iconColor: "text-green-600 dark:text-green-400",
  },
  {
    title: "Partnership",
    description: "Peluang kerjasama dan partnership",
    icon: Mail,
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
];

export default async function ContactPage() {
  // Fetch company details from database
  const company = await getCompanyDetails();

  // Format phone number for WhatsApp (remove spaces, dashes, parentheses)
  const formatPhoneForWhatsApp = (phone: string | null) => {
    if (!phone) return null;
    // Remove all non-numeric characters except + at the start
    const cleaned = phone.replace(/[^\d+]/g, "");
    // If it starts with 0, replace with country code (assuming Indonesia +62)
    if (cleaned.startsWith("0")) {
      return "62" + cleaned.substring(1);
    }
    // If it starts with +, remove the +
    if (cleaned.startsWith("+")) {
      return cleaned.substring(1);
    }
    return cleaned;
  };

  const whatsappNumber = formatPhoneForWhatsApp(company.officePhone);

  // Generate dynamic contact info from database
  const contactInfo = [
    {
      title: "Alamat Kantor",
      icon: MapPin,
      details: company.officeAddress
        ? [
            `${company.companyName} HQ`,
            ...company.officeAddress.split("\n").filter((line) => line.trim()),
          ]
        : [`${company.companyName} HQ`, "Alamat kantor akan segera diumumkan"],
      link: company.officeAddressUrl || null,
    },
    {
      title: "Kontak",
      icon: Phone,
      details: [
        company.officePhone || "Nomor telepon akan segera diumumkan",
        company.contactEmail || "info@company.com",
        company.supportEmail && company.supportEmail !== company.contactEmail
          ? company.supportEmail
          : null,
      ].filter(Boolean) as string[],
      whatsappLink: whatsappNumber
        ? `https://api.whatsapp.com/send/?phone=${whatsappNumber}`
        : null,
    },
    {
      title: "Jam Operasional",
      icon: Clock,
      details: company.operationalHours
        ? ([
            ...company.operationalHours
              .split("\n")
              .filter((line) => line.trim()),
            company.timezone ? `Zona Waktu: ${company.timezone}` : null,
            "Response email: 24/7",
          ].filter(Boolean) as string[])
        : [
            "Senin - Jumat: 09:00 - 18:00",
            "Sabtu: 09:00 - 15:00",
            "Minggu: Tutup",
            "Response email: 24/7",
          ],
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
              Hubungi Kami
            </h1>
            <p className="text-lg text-muted-foreground">
              Mari diskusikan bagaimana {company.companyName} dapat membantu
              transformasi digital bisnis Anda. Tim ahli kami siap memberikan
              konsultasi dan solusi terbaik.
            </p>
          </div>
        </div>
      </section>
      {/* Contact Info Cards */}
      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-6 md:grid-cols-3 mb-12">
            {contactInfo.map((info) => (
              <Card key={info.title} className="text-center">
                <CardHeader>
                  <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <info.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{info.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    {info.details.map((detail, index) => (
                      <div key={index}>{detail}</div>
                    ))}
                    {info.link && (
                      <a
                        href={info.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline block mt-2"
                      >
                        Lihat di Maps →
                      </a>
                    )}
                    {"whatsappLink" in info && info.whatsappLink && (
                      <a
                        href={info.whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400 hover:underline mt-2"
                      >
                        <MessageCircle className="h-4 w-4" />
                        Chat via WhatsApp
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Form and Map */}
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-semibold mb-6">Kirim Pesan</h2>
              <ContactForm />
            </div>

            {/* Map or Additional Info */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Jenis Inquiry</h2>
              <div className="space-y-4">
                {inquiryTypes.map((type) => (
                  <div
                    key={type.title}
                    className="flex items-start gap-4 p-4 rounded-lg border border-border"
                  >
                    <div
                      className={`h-10 w-10 rounded-lg ${type.bgColor} flex items-center justify-center flex-shrink-0`}
                    >
                      <type.icon className={`h-5 w-5 ${type.iconColor}`} />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">{type.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {type.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Response Time */}
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center space-y-2">
                    <Clock className="h-8 w-8 text-primary mx-auto" />
                    <h3 className="font-medium">Response Time</h3>
                    <p className="text-sm text-muted-foreground">
                      Kami berkomitmen untuk merespon inquiry Anda dalam waktu
                      maksimal 24 jam pada hari kerja.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      <FooterSection />
    </>
  );
}
