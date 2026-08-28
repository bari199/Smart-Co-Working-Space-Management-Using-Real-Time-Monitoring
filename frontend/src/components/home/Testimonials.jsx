import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Rahul Das",
    role: "Startup Founder",
    text: "Finding a professional workspace for our team became much easier. The booking process is simple and the space was exactly as expected.",
  },
  {
    name: "Ananya Sharma",
    role: "Product Manager",
    text: "I needed a quiet place for a client meeting and found a great room within minutes. The whole experience felt effortless.",
  },
  {
    name: "Arjun Mehta",
    role: "Business Consultant",
    text: "Smart Workspace gives us the flexibility to work from different cities without dealing with complicated workspace contracts.",
  },
];

const Testimonials = () => {
  return (
    <section className="section-padding bg-white">
      <div className="container-width">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-label">Customer stories</p>

          <h2 className="section-title mt-2">
            Trusted by teams,
            <span className="text-[var(--secondary)]">
              {" "}
              loved by professionals.
            </span>
          </h2>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.name}
              className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex gap-1 text-[var(--secondary)]">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <Star key={item} size={14} fill="currentColor" />
                  ))}
                </div>

                <Quote size={24} className="text-[var(--accent)]" />
              </div>

              <p className="mt-5 text-sm leading-7 text-[var(--muted)]">
                “{testimonial.text}”
              </p>

              <div className="mt-6 border-t border-[var(--border)] pt-4">
                <p className="text-sm font-bold text-[var(--text)]">
                  {testimonial.name}
                </p>

                <p className="mt-1 text-xs text-[var(--muted)]">
                  {testimonial.role}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
