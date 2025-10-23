import Link from "next/link";
import Image from "next/image";
import { Linkedin, Instagram, Github } from "lucide-react";
import { getTeamMembers } from "@/lib/data/queries";
import { getBestAvatarUrl } from "@/lib/utils/cloudinary";

export default async function TeamSection() {
  const team = await getTeamMembers();
  return (
    <section
      className="bg-gray-50 py-16 md:py-32 dark:bg-transparent"
      id="team"
    >
      <div className="mx-auto max-w-5xl border-t px-6">
        <span className="text-caption -ml-6 -mt-3.5 block w-max bg-gray-50 px-6 dark:bg-gray-950">
          Team
        </span>
        <div className="mt-12 gap-4 sm:grid sm:grid-cols-2 md:mt-24">
          <div className="sm:w-2/5">
            <h2 className="text-3xl font-bold sm:text-4xl">Tim ahli kami</h2>
          </div>
          <div className="mt-6 sm:mt-0">
            <p>
              Menggabungkan keahlian teknis mendalam dengan kolaboratif, bekerja
              sama dengan klien untuk merancang solusi IT yang presisi dan
              scalable.
            </p>
          </div>
        </div>
        <div className="mt-12 md:mt-24">
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member, index) => (
              <div key={member.id} className="group overflow-hidden">
                <Image
                  className="h-96 w-full rounded-md object-cover object-top grayscale transition-all duration-500 hover:grayscale-0 group-hover:h-[22.5rem] group-hover:rounded-xl"
                  src={getBestAvatarUrl(
                    member.avatarPublicId,
                    member.firstName,
                    member.lastName
                  )}
                  alt={member.displayName}
                  width={826}
                  height={1239}
                />
                <div className="px-2 pt-2 sm:pb-0 sm:pt-4">
                  <div className="flex justify-between">
                    <h3 className="text-title text-base font-medium transition-all duration-500 group-hover:tracking-wider">
                      {member.displayName}
                    </h3>
                    <span className="text-xs">_0{index + 1}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-muted-foreground inline-block translate-y-6 text-sm opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      {member.jobTitle}
                    </span>
                    <div className="flex space-x-2 translate-y-8 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                      {member.linkedinUrl && (
                        <Link
                          href={member.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Linkedin className="h-4 w-4" />
                        </Link>
                      )}
                      {member.instagramUrl && (
                        <Link
                          href={member.instagramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Instagram className="h-4 w-4" />
                        </Link>
                      )}
                      {member.githubUrl && (
                        <Link
                          href={member.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Github className="h-4 w-4" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
