import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getTestimonials } from "@/lib/data/queries";

export default async function Testimonials() {
  const testimonialsList = await getTestimonials();

  if (testimonialsList.length === 0) {
    return (
      <section className="py-16 md:py-32" id="review">
        <div className="mx-auto max-w-6xl space-y-8 px-6 md:space-y-16">
          <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center md:space-y-12">
            <h2 className="text-4xl font-medium lg:text-5xl mb-6">
              Apa Kata Mereka Tentang Kami
            </h2>
            <p>No testimonials available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-32" id="review">
      <div className="mx-auto max-w-6xl space-y-8 px-6 md:space-y-16">
        <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center md:space-y-12">
          <h2 className="text-4xl font-medium lg:text-5xl mb-6">
            Apa Kata Mereka Tentang Kami
          </h2>
          <p>
            Solusi kami telah membantu ribuan developer dan bisnis berinovasi
            dengan cepat. Berikut pengalaman nyata dari mereka yang telah
            mencoba.
          </p>
        </div>

        <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
          {testimonialsList.slice(0, 3).map((item) => (
            <Card key={item.id} className="col-span-2 md:col-span-1">
              <CardContent className="h-full">
                <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                  <p className="text-xl font-medium">{item.text}</p>

                  <div className="grid grid-cols-[auto_1fr] items-center gap-3">
                    <Avatar className="size-12">
                      <AvatarImage
                        src={`https://ui-avatars.com/api/?name=${item.firstName}+${item.lastName}&bold=true&background=d9d9d9&rounded=true`}
                        alt={item.firstName + " " + item.lastName}
                        height="400"
                        width="400"
                        loading="lazy"
                        className="object-cover dark:invert"
                      />
                      <AvatarFallback>
                        {item.firstName[0]}
                        {item.lastName[0]}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <cite className="text-sm font-medium">
                        {item.firstName + " " + item.lastName}
                      </cite>
                      <span className="text-muted-foreground block text-sm">
                        {item.position && item.company
                          ? `${item.position}, ${item.company}`
                          : item.position || item.company || ""}
                      </span>
                    </div>
                  </div>
                </blockquote>
              </CardContent>
            </Card>
          ))}
          {testimonialsList.length > 3 &&
            testimonialsList.slice(3, 4).map((item) => (
              <Card key={item.id} className="col-span-2 md:col-span-2">
                <CardContent className="h-full">
                  <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                    <p className="text-xl font-medium">{item.text}</p>

                    <div className="grid grid-cols-[auto_1fr] items-center gap-3">
                      <Avatar className="size-12">
                        <AvatarImage
                          src={`https://ui-avatars.com/api/?name=${item.firstName}+${item.lastName}&bold=true&background=d9d9d9&rounded=true`}
                          alt={item.firstName + " " + item.lastName}
                          height="400"
                          width="400"
                          loading="lazy"
                          className="object-cover dark:invert"
                        />
                        <AvatarFallback>
                          {item.firstName[0]}
                          {item.lastName[0]}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <cite className="text-sm font-medium">
                          {item.firstName + " " + item.lastName}
                        </cite>
                        <span className="text-muted-foreground block text-sm">
                          {item.position && item.company
                            ? `${item.position}, ${item.company}`
                            : item.position || item.company || ""}
                        </span>
                      </div>
                    </div>
                  </blockquote>
                </CardContent>
              </Card>
            ))}
          {testimonialsList.length > 4 &&
            testimonialsList.slice(4).map((item) => (
              <Card key={item.id} className="col-span-2 md:col-span-1">
                <CardContent className="h-full">
                  <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                    <p className="text-xl font-medium">{item.text}</p>

                    <div className="grid grid-cols-[auto_1fr] items-center gap-3">
                      <Avatar className="size-12">
                        <AvatarImage
                          src={`https://ui-avatars.com/api/?name=${item.firstName}+${item.lastName}&bold=true&background=d9d9d9&rounded=true`}
                          alt={item.firstName + " " + item.lastName}
                          height="400"
                          width="400"
                          loading="lazy"
                          className="object-cover dark:invert"
                        />
                        <AvatarFallback>
                          {item.firstName[0]}
                          {item.lastName[0]}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <cite className="text-sm font-medium">
                          {item.firstName + " " + item.lastName}
                        </cite>
                        <span className="text-muted-foreground block text-sm">
                          {item.position && item.company
                            ? `${item.position}, ${item.company}`
                            : item.position || item.company || ""}
                        </span>
                      </div>
                    </div>
                  </blockquote>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </section>
  );
}
