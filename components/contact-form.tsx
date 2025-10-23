"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

// Validation schema matching the backend
const contactFormSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi").max(100, "Nama terlalu panjang"),
  email: z.string().email("Email tidak valid"),
  phone: z
    .string()
    .regex(
      /^[0-9\s\+\-\(\)]*$/,
      "Hanya angka dan karakter +, -, (, ) yang diperbolehkan"
    )
    .optional()
    .or(z.literal("")),
  company: z.string().optional().or(z.literal("")),
  inquiryType: z.enum(["general", "project", "partnership", "support"]),
  subject: z
    .string()
    .min(1, "Subject wajib diisi")
    .max(200, "Subject terlalu panjang"),
  message: z
    .string()
    .min(10, "Pesan minimal 10 karakter")
    .max(2000, "Pesan terlalu panjang"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      phone: "",
      subject: "",
      message: "",
      inquiryType: "general",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        // Log the full error for debugging
        console.error("API Error Response:", responseData);

        // Handle validation errors from the server
        if (
          responseData.error === "Validation failed" &&
          responseData.details
        ) {
          const errorMessages = responseData.details
            .map((err: any) => err.message)
            .join(", ");
          throw new Error(errorMessages);
        }
        throw new Error(responseData.error || "Gagal mengirim pesan");
      }

      // Success
      toast.success("Pesan berhasil terkirim! 🎉", {
        description:
          "Tim kami akan menghubungi Anda dalam 24-48 jam. Terima kasih!",
        duration: 5000,
      });

      // Reset form
      reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Gagal mengirim pesan", {
        description:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan. Silakan coba lagi nanti.",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Nama Lengkap *
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Masukkan nama lengkap"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email *
              </label>
              <Input
                id="email"
                type="email"
                placeholder="nama@email.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="company"
                className="block text-sm font-medium mb-2"
              >
                Perusahaan
              </label>
              <Input
                id="company"
                type="text"
                placeholder="Nama perusahaan"
                {...register("company")}
              />
              {errors.company && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.company.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2">
                Nomor Telepon
              </label>
              <Input
                id="phone"
                type="tel"
                placeholder="+6281234567890"
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="inquiryType"
              className="block text-sm font-medium mb-2"
            >
              Jenis Inquiry *
            </label>
            <select
              id="inquiryType"
              {...register("inquiryType")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="general">General Inquiry</option>
              <option value="project">Project Discussion</option>
              <option value="partnership">Partnership</option>
              <option value="support">Technical Support</option>
            </select>
            {errors.inquiryType && (
              <p className="text-sm text-red-600 mt-1">
                {errors.inquiryType.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium mb-2">
              Subject *
            </label>
            <Input
              id="subject"
              type="text"
              placeholder="Ringkasan topik yang ingin didiskusikan"
              {...register("subject")}
            />
            {errors.subject && (
              <p className="text-sm text-red-600 mt-1">
                {errors.subject.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-2">
              Pesan *
            </label>
            <textarea
              id="message"
              rows={6}
              placeholder="Jelaskan kebutuhan atau pertanyaan Anda secara detail..."
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              {...register("message")}
            />
            {errors.message && (
              <p className="text-sm text-red-600 mt-1">
                {errors.message.message}
              </p>
            )}
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mengirim...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Kirim Pesan
                </>
              )}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Dengan mengirim form ini, Anda menyetujui bahwa kami dapat
            menghubungi Anda terkait inquiry yang disampaikan.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
