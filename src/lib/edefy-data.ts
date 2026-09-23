export type Program = { slug: string; title: string; age: string; image: string; description: string };
export type EventItem = { slug: string; title: string; image: string; date: string; location: string; description: string };
export type Article = { slug: string; title: string; image: string; date: string };

export const programs: Program[] = [
  {
    slug: "education-and-literacy",
    title: "Education & Literacy",
    age: "Pillar 01",
    image: "/gallery/002.jpg",
    description: "We help create learning environments where children grow with curiosity, confidence, and opportunity through school libraries, storybooks, and infrastructure.",
  },
  {
    slug: "health-and-wellbeing",
    title: "Health & Wellbeing",
    age: "Pillar 02",
    image: "/gallery/011.jpg",
    description: "Healthy communities are stronger communities. Supporting local healthcare infrastructure and maternity facilities in rural communities like Chhoprak, Gorkha.",
  },
  {
    slug: "community-and-heritage",
    title: "Community & Heritage",
    age: "Pillar 03",
    image: "/gallery/014.jpg",
    description: "Supporting shared spaces like the Baram Community Centre in Gorkha to foster participation, local decision-making, and inclusive development.",
  },
];

export const events: EventItem[] = [
  {
    slug: "project-aabha-phase-1",
    title: "Project Aabha: Kathmandu Valley",
    image: "/gallery/001.jpg",
    date: "PHASE 1",
    location: "Kathmandu (21 Schools)",
    description: "Partnered with 21 government schools, distributing curated storybooks, reading materials, and establishing reading corners.",
  },
  {
    slug: "project-aabha-phase-2",
    title: "Project Aabha: Lalitpur Expansion",
    image: "/gallery/003.jpg",
    date: "PHASE 2",
    location: "Lalitpur (20 Schools)",
    description: "Expanded to 20 additional schools, nurturing reading cultures and interactive classroom learning across the valley.",
  },
  {
    slug: "project-aabha-phase-3",
    title: "Project Aabha: Rural Outreach",
    image: "/gallery/005.jpg",
    date: "PHASE 3",
    location: "Gorkha & Dhading (9 Schools)",
    description: "Reaching 9 schools in remote rural areas with library setups, activity books, and educational resources.",
  },
  {
    slug: "community-health-initiative",
    title: "Chhoprak Community Health Centre",
    image: "/gallery/011.jpg",
    date: "ONGOING",
    location: "Chhoprak, Gorkha",
    description: "Strengthening rural health infrastructure and expanding maternity facilities for safer pre- and post-natal care.",
  },
];

const articleImages = [
  "/gallery/002.jpg",
  "/gallery/005.jpg",
  "/gallery/008.jpg",
  "/gallery/011.jpg",
  "/gallery/014.jpg",
  "/gallery/018.jpg",
];

export const articles: Article[] = [
  "nurturing-reading-cultures-in-nepal",
  "expanding-educational-access-in-rural-schools",
  "the-story-behind-project-aabha",
  "strengthening-rural-healthcare-in-gorkha",
  "the-role-of-community-centres-in-local-governance",
  "carrying-forward-dr-babu-ram-pokharels-vision",
].map((slug, i) => ({
  slug,
  title: [
    "Nurturing Reading Cultures in Nepal’s Government Schools",
    "Expanding Educational Access in Rural Communities",
    "The Story Behind Project Aabha: Lighting Young Minds",
    "Strengthening Rural Healthcare & Maternity Access in Gorkha",
    "The Role of Community Centres in Inclusive Development",
    "Carrying Forward the Vision of the Late Dr. Babu Ram Pokharel",
  ][i] ?? "BRP Foundation Initiative",
  image: articleImages[i] ?? "/gallery/001.jpg",
  date: "2026",
}));

export const gallery = [
  ["/gallery/001.jpg", "Project आभा: Lighting young minds, one story at a time"],
  ["/gallery/002.jpg", "Shree Shanti Vidyagriha Secondary School book distribution"],
  ["/gallery/003.jpg", "Educational support handover with teachers and students"],
  ["/gallery/004.jpg", "Joy of reading: discovering new stories and ideas"],
  ["/gallery/005.jpg", "Courtyard reading session with educators and school leadership"],
  ["/gallery/006.jpg", "Collaborative learning and classroom engagement"],
  ["/gallery/007.jpg", "Engaging students across partner schools in Nepal"],
  ["/gallery/008.jpg", "Shree Bal Byabasayee Kendra Secondary School partnership"],
  ["/gallery/011.jpg", "School principal and students with educational resources"],
  ["/gallery/012.jpg", "Community healthcare access and rural family support"],
  ["/gallery/013.jpg", "Supporting community wellbeing and local families"],
  ["/gallery/014.jpg", "Students receiving Kids Big Book reading materials"],
  ["/gallery/015.jpg", "Preserving local heritage and community gathering spaces"],
  ["/gallery/016.jpg", "Inclusive participation and community meetings in Gorkha"],
  ["/gallery/018.jpg", "Nurturing curiosity with Kids Story World collections"],
  ["/gallery/019.jpg", "Inspiring the next generation across 4 districts"],
  ["/gallery/021.jpg", "Activity book distribution with school heads and BRP team"],
] as const;

export const policyContent = {
  "privacy-policy": {
    title: "Privacy Policy",
    sections: [
      ["Introduction", "At BRP Foundation, we value and respect your privacy. This policy outlines how we treat information gathered through our website."],
      ["Information We Collect", "We may collect contact information you provide directly through our inquiry and partnership forms."],
      ["How We Use Information", "Any information collected is used solely to respond to inquiries, coordinate community partnerships, and provide organizational updates."],
      ["Data Protection", "We implement appropriate administrative and technical measures to protect any data shared with us."],
      ["Contact", "If you have questions about this policy, please reach out to info@brpgroup.com.np."]
    ]
  },
  terms: {
    title: "Terms & Conditions",
    sections: [
      ["Acceptance of Terms", "By accessing the BRP Foundation website, you agree to these terms of use."],
      ["Use of Website", "The content on this website is for general informational purposes relating to our social impact initiatives."],
      ["Intellectual Property", "All materials, images, and content are the property of BRP Foundation or used with permission from community partners."],
      ["Contact", "For inquiries regarding terms of use, please email info@brpgroup.com.np."]
    ]
  },
  "refund-policy": {
    title: "Contributions & Donations Policy",
    sections: [
      ["General Policy", "As a non-profit foundation, contributions made in support of community programs are utilized directly for educational resources, healthcare support, and infrastructure initiatives."],
      ["Inquiries", "For questions regarding contributions or partnerships, please contact info@brpgroup.com.np."]
    ]
  }
} as const;