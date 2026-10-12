import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Laptop, Sparkles, HeartHandshake } from "lucide-react";
import { Button } from "@/components/Button";
import { SiteLayout, PageHero, Eyebrow } from "@/components/SiteChrome";

export const Route = createFileRoute("/program")({
  head: () => ({
    meta: [
      { title: "Project Aabha — BRP Foundation" },
      {
        name: "description",
        content:
          "Project Aabha (प्रोजेक्ट आभा) is BRP Foundation’s flagship educational initiative, bringing books, digital learning labs, and reading resources to schools across Nepal.",
      },
      { property: "og:title", content: "Project Aabha — BRP Foundation" },
      {
        property: "og:description",
        content:
          "Lighting young minds across Nepal through literacy, library handovers, and foundational learning opportunities.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/program" }],
  }),
  component: ProgramPage,
});

const aabhaPillars = [
  {
    icon: BookOpen,
    title: "Kids Big Book Collections",
    text: "Enlarged, vibrantly illustrated reading books designed for shared classroom reading, drawing students together around engaging stories.",
    image: "/gallery/014.jpg",
  },
  {
    icon: Sparkles,
    title: "Kids Story & Activity World",
    text: "Curated collections of grade-appropriate storybooks and hands-on activity materials that build vocabulary, creativity, and comprehension.",
    image: "/gallery/018.jpg",
  },
  {
    icon: Laptop,
    title: "Digital Learning & Computer Labs",
    text: "Equipping schools with essential computers, interactive software, and basic digital literacy infrastructure for modern learning.",
    image: "/gallery/006.jpg",
  },
  {
    icon: HeartHandshake,
    title: "Teacher & School Partnerships",
    text: "Collaborating with school leadership and teachers to embed reading sessions into everyday routines and build enduring library culture.",
    image: "/gallery/008.jpg",
  },
] as const;

function ProgramPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="OUR FLAGSHIP INITIATIVE"
        title="Project आभा"
        subtitle="Lighting young minds, one story at a time."
        description="Project Aabha (प्रोजेक्ट आभा) is BRP Foundation's dedicated education initiative, creating vibrant learning environments where children discover the joy and opportunity of reading."
      />

      {/* Hero Showcase Images */}
      <section className="container scroll-reveal" style={{ marginBottom: "60px" }}>
        <div className="program-hero-images">
          <img
            src="/gallery/006.jpg"
            alt="Collaborative classroom learning session supported by Project Aabha"
            loading="lazy"
          />
          <img
            src="/gallery/014.jpg"
            alt="Students holding Kids Big Book reading materials during handover"
            loading="lazy"
          />
        </div>
      </section>

      {/* Program Pillars */}
      <section className="section container scroll-reveal">
        <div className="section-heading rise">
          <Eyebrow>CORE INITIATIVES</Eyebrow>
          <h2>How Project आभा Creates Opportunity</h2>
          <p>
            Implemented in partnership with Himalayan Hopes and local educators, Project आभा combines
            physical books, digital access, and school leadership engagement to ignite young minds.
          </p>
        </div>

        <div className="card-grid stagger">
          {aabhaPillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <article key={pillar.title} className="image-card">
                <img src={pillar.image} alt={pillar.title} loading="lazy" />
                <div className="card-overlay">
                  <div className="meta">
                    <Icon size={16} aria-hidden="true" style={{ display: "inline", marginRight: "6px" }} />
                    PROJECT आभा
                  </div>
                  <h3>{pillar.title}</h3>
                  <p>{pillar.text}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Story & Partnership Context */}
      <section className="section narrow story scroll-reveal">
        <div className="section-heading rise">
          <Eyebrow>OUR REACH & PARTNERSHIPS</Eyebrow>
          <h2>One school, one library, one story at a time</h2>
        </div>
        <div className="stats">
          <div>
            <b>50+</b>
            <span>SCHOOLS IMPACTED</span>
          </div>
          <div>
            <b>4+</b>
            <span>DISTRICTS IN NEPAL</span>
          </div>
          <div>
            <b>1000s</b>
            <span>STUDENTS ENGAGED</span>
          </div>
        </div>
        <p style={{ marginTop: "32px", fontSize: "16.5px", lineHeight: "1.7", color: "#1e3852" }}>
          From initial partnerships in schools like Shree Shanti Vidyagriha and Shree Bal Byabasayee
          Kendra Secondary School in Kathmandu to rural schools in Gorkha and Siranchok, Project आभा
          ensures that lack of resources never limits a child's imagination.
        </p>
        <div className="button-row" style={{ marginTop: "36px" }}>
          <Button to="/gallery">Explore Impact Gallery</Button>
          <Button to="/book-a-tour" variant="outline">Partner With Project Aabha</Button>
        </div>
      </section>
    </SiteLayout>
  );
}