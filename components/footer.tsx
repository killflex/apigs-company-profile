import Image from "next/image";
import Link from "next/link";
import { getCompanyDetails } from "@/lib/data/queries";
import {
  Twitter,
  Linkedin,
  Facebook,
  Instagram,
  Youtube,
  MapPin,
  Mail,
} from "lucide-react";

export default async function FooterSection() {
  const company = await getCompanyDetails();

  // Parse office address into lines
  const officeLines = company.officeAddress
    ? company.officeAddress.split("\n").filter((line) => line.trim())
    : [];

  // Social media links with icons
  const socialLinks = [
    {
      name: "Twitter",
      url: company.twitterUrl,
      icon: Twitter,
      label: "X/Twitter",
    },
    {
      name: "LinkedIn",
      url: company.linkedinUrl,
      icon: Linkedin,
      label: "LinkedIn",
    },
    {
      name: "Facebook",
      url: company.facebookUrl,
      icon: Facebook,
      label: "Facebook",
    },
    {
      name: "Instagram",
      url: company.instagramUrl,
      icon: Instagram,
      label: "Instagram",
    },
    {
      name: "YouTube",
      url: company.youtubeUrl,
      icon: Youtube,
      label: "YouTube",
    },
  ].filter((link) => link.url); // Only show links that exist in database

  const footerSections = [
    {
      group: "Office",
      icon: MapPin,
      items:
        officeLines.length > 0
          ? [`${company.companyName} HQ`, ...officeLines]
          : [
              `${company.companyName} HQ`,
              "Office address",
              "will be announced soon",
            ],
    },
    {
      group: "Contact Us",
      icon: Mail,
      items: [
        company.contactEmail || "info@company.com",
        company.supportEmail || "",
        company.officePhone || "",
      ].filter(Boolean),
    },
    {
      group: "Collaboration",
      icon: null,
      items: [
        "Looking for collaboration?",
        "Don't hesitate to contact us",
        `Founded in ${company.foundedYear || new Date().getFullYear()}`,
      ],
    },
  ];
  return (
    <footer className="border-b bg-white pt-20 dark:bg-transparent">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link href="/" aria-label="go home" className="block size-fit">
              <Image
                className="h-8 w-auto dark:invert"
                src="/apigs-logo.png"
                alt="Logo"
                height={1804}
                width={476}
              />
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-6 md:col-span-3">
            {footerSections.map((section, index) => (
              <div key={index} className="space-y-4 text-sm">
                <div className="flex items-center gap-2">
                  {section.icon && (
                    <section.icon className="h-4 w-4 text-primary" />
                  )}
                  <span className="block font-medium">{section.group}</span>
                </div>
                {section.items.map((item, idx) => (
                  <p
                    key={idx}
                    className="text-muted-foreground hover:text-primary block duration-150"
                  >
                    <span>{item}</span>
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 flex flex-wrap items-end justify-between gap-6 border-t py-6">
          <span className="text-muted-foreground order-last block text-center text-sm md:order-first">
            © {new Date().getFullYear()} {company.companyName}, All rights
            reserved
          </span>
          <div className="order-first flex flex-wrap justify-center gap-6 text-sm md:order-last">
            {socialLinks.map((social) => (
              <Link
                key={social.name}
                href={social.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="text-muted-foreground hover:text-primary block"
              >
                <social.icon className="h-6 w-6" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
