import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent, type ComponentType } from "react";
import { Mail, Phone, MapPin, type LucideProps, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/Button";
import { SiteLayout, PageHero, Eyebrow } from "@/components/SiteChrome";

export const Route = createFileRoute("/book-a-tour")({
  head: () => ({
    meta: [
      { title: "Contact Us — BRP Foundation" },
      {
        name: "description",
        content:
          "Connect with BRP Foundation in Baluwatar, Kathmandu, Nepal. Reach out for educational partnerships, Project Aabha school collaborations, or community development inquiries.",
      },
      { property: "og:title", content: "Contact Us — BRP Foundation" },
      {
        property: "og:description",
        content:
          "Connect with BRP Foundation to collaborate, support schools, or strengthen communities across Nepal.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/book-a-tour" }],
  }),
  component: ContactPage,
});

const contactCards: [ComponentType<LucideProps>, string, string, string][] = [
  [
    MapPin,
    "Foundation Headquarters",
    "Baluwatar, Kathmandu",
    "Baluwatar, Kathmandu, Nepal 44600. Conveniently located near the central district.",
  ],
  [
    Mail,
    "Email Inquiries",
    "info@brpgroup.com.np",
    "Reach our partnership team directly for questions, school inquiries, or collaboration proposals.",
  ],
  [
    Phone,
    "Telephone Support",
    "+977 01 4535691 / 4516390",
    "Available Sunday to Friday, 9:00 AM – 5:00 PM Nepal Time (NPT).",
  ],
];

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <SiteLayout>
      <PageHero
        eyebrow="CONNECT WITH US"
        title="Get in Touch with BRP Foundation"
        description="Whether you are an educator, community leader, partner organization, or supporter, we welcome conversations that turn shared intent into lasting action."
      />

      {/* Contact Cards Grid */}
      <section className="contact-grid container scroll-reveal">
        {contactCards.map(([Icon, label, headline, desc]) => (
          <article key={headline}>
            <small>{label}</small>
            <div>
              <Icon aria-hidden="true" />
              <h3>{headline}</h3>
              <p>{desc}</p>
            </div>
          </article>
        ))}
      </section>

      {/* Inquiry Form */}
      <section className="section narrow scroll-reveal">
        <div className="section-heading rise">
          <Eyebrow>SEND AN INQUIRY</Eyebrow>
          <h2>How Can We Collaborate?</h2>
          <p>Fill out the form below and our team will get back to you promptly.</p>
        </div>

        {submitted ? (
          <div className="form-success" style={{ textAlign: "center", padding: "48px 24px" }}>
            <CheckCircle2 size={48} color="#206337" style={{ margin: "0 auto 16px" }} />
            <h3>Thank You for Reaching Out</h3>
            <p style={{ maxWidth: "480px", margin: "12px auto 0", fontSize: "16px", color: "#1e3852" }}>
              Your inquiry has been received. A representative from BRP Foundation will contact you
              shortly.
            </p>
          </div>
        ) : (
          <form className="tour-form" onSubmit={handleSubmit}>
            <div className="form-cap">Complete the form below to send your message</div>

            <label>
              YOUR FULL NAME *
              <input required placeholder="Enter your full name" />
            </label>

            <label>
              EMAIL ADDRESS *
              <input required type="email" placeholder="name@example.com" />
            </label>

            <label>
              PHONE NUMBER
              <input type="tel" placeholder="+977 98XXXXXXXX (Optional)" />
            </label>

            <label>
              ORGANIZATION / AFFILIATION
              <input placeholder="School, Institution, or NGO (Optional)" />
            </label>

            <label className="wide">
              INQUIRY TYPE *
              <select required defaultValue="">
                <option value="" disabled>
                  Select inquiry focus
                </option>
                <option value="project-aabha">Project Aabha & School Reading Partnership</option>
                <option value="healthcare">Healthcare & Community Support</option>
                <option value="library-support">Digital Lab or Library Infrastructure</option>
                <option value="general">General Partnership / Other</option>
              </select>
            </label>

            <label className="wide">
              YOUR MESSAGE *
              <textarea
                required
                rows={4}
                placeholder="Share how you would like to collaborate or describe your school/community needs..."
              />
            </label>

            <Button type="submit">Send Message</Button>
            <small>WE RESPECT YOUR PRIVACY. YOUR DETAILS REMAIN STRICTLY CONFIDENTIAL.</small>
          </form>
        )}
      </section>
    </SiteLayout>
  );
}