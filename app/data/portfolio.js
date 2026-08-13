// ─────────────────────────────────────────────────────────────
// Everything on the site is edited from this one file.
//
// Items marked PLACEHOLDER are invented stand-ins so the layout
// reads correctly — swap them for the real thing. Images are
// Pexels URLs; replace a `src` with "/photos/your-file.jpg" once
// you drop the file into /public/photos.
// ─────────────────────────────────────────────────────────────

const pexels = (id, w = 1400) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

export const profile = {
  name: "Samridhi Parajuli",
  first: "Samridhi",
  last: "Parajuli",
  role: "Full Stack Developer",
  location: "Toronto, Canada",
  email: "samridhiii.parajuli@gmail.com",
  github: "https://github.com/SamridhiParajuli",
  linkedin: "https://linkedin.com/in/SamridhiParajuli",
  // Drop the PDF at /public/resume.pdf and this link works as-is.
  resume: "/resume.pdf",
  cover: pexels(2312369, 1800),
  portrait: pexels(574071, 1200),
};

export const about = {
  lede: "I build the parts people actually touch, and the parts that make them work.",
  body: [
    "I'm a computer science engineer working across the full stack — Next.js and React on the front, Python and FastAPI behind it. Most of what I enjoy sits at the seam between the two: turning a messy interaction into something a person can just do.",
    "Right now I'm going deep on applied AI. My most recent build lets you query a database out loud — speech in, SQL out, results back in plain language. Teaching a system to understand what someone meant, not just what they typed, is the problem I keep coming back to.",
  ],
  // Shown as the museum-style wall label beside the portrait.
  captionTitle: "The Subject",
  captionMeta: "Full stack · AI systems · Toronto",
};

// PLACEHOLDER — replace with your real projects.
// The first frame is the one you described; the rest are stand-ins.
export const projects = [
  {
    frame: "01",
    title: "Speech to SQL",
    year: "2026",
    role: "Solo build",
    blurb:
      "Ask a database a question out loud and get an answer back in plain language.",
    body: "Speech is transcribed in the browser, parsed into a constrained SQL query against a known schema, then run and summarised. The hard part wasn't generating SQL — it was refusing to generate the wrong one, so the query is validated against the schema before it ever reaches the database.",
    stack: ["Next.js", "FastAPI", "Whisper", "PostgreSQL", "OpenAI API"],
    src: pexels(1181671),
    href: "https://github.com/SamridhiParajuli",
  },
  {
    frame: "02",
    title: "Ledger",
    year: "2025",
    role: "Solo build",
    blurb: "A shared expense tracker that settles up in the fewest transfers.",
    body: "PLACEHOLDER — Group expenses reduced to a minimal set of payments using a graph settlement pass, with a real-time balance view so nobody has to ask who owes what.",
    stack: ["React", "Node.js", "PostgreSQL", "Prisma"],
    src: pexels(3861958),
    href: "https://github.com/SamridhiParajuli",
  },
  {
    frame: "03",
    title: "Retrieval Desk",
    year: "2025",
    role: "Solo build",
    blurb: "Ask questions of your own documents and get cited answers.",
    body: "PLACEHOLDER — A retrieval pipeline over uploaded PDFs: chunking, embeddings, and a reranking pass so the answer arrives with the paragraph it came from attached.",
    stack: ["Python", "FastAPI", "pgvector", "LangChain"],
    src: pexels(546819),
    href: "https://github.com/SamridhiParajuli",
  },
  {
    frame: "04",
    title: "Transit Board",
    year: "2024",
    role: "Solo build",
    blurb: "Live departure times for the stops you actually use.",
    body: "PLACEHOLDER — A pared-down transit dashboard that polls open GTFS feeds and shows only your saved stops, built to be readable from across a room.",
    stack: ["Next.js", "TypeScript", "Redis"],
    src: pexels(265087),
    href: "https://github.com/SamridhiParajuli",
  },
  {
    frame: "05",
    title: "Studio CMS",
    year: "2024",
    role: "Team of three",
    blurb: "A content backend for people who don't want a content backend.",
    body: "PLACEHOLDER — Role-based publishing with draft previews and a schema editor, so a non-technical team can change the site without a deploy.",
    stack: ["React", "Express", "MongoDB", "AWS S3"],
    src: pexels(1092644),
    href: "https://github.com/SamridhiParajuli",
  },
  {
    frame: "06",
    title: "Field Notes",
    year: "2023",
    role: "Solo build",
    blurb: "Offline-first notes that sync when you come back into signal.",
    body: "PLACEHOLDER — A progressive web app with conflict-aware sync, written to stay useful on a phone with no connection.",
    stack: ["Next.js", "IndexedDB", "Service Workers"],
    src: pexels(270348),
    href: "https://github.com/SamridhiParajuli",
  },
];

// PLACEHOLDER — replace with your real education history.
export const education = [
  {
    period: "2021 — 2025",
    title: "B.E. Computer Science & Engineering",
    org: "Your University",
    place: "PLACEHOLDER",
    note: "Coursework across data structures, databases, distributed systems, and machine learning. Final-year work focused on natural language interfaces to structured data.",
    src: pexels(356056),
  },
  {
    period: "2025 — 2026",
    title: "Applied AI, self-directed",
    org: "Ongoing",
    place: "Toronto",
    note: "Working through retrieval systems, evaluation, and agent design by building them — the speech-to-SQL project came out of this.",
    src: pexels(590022),
  },
];

// PLACEHOLDER — replace with certifications you actually hold.
export const certifications = [
  { title: "AWS Certified Cloud Practitioner", issuer: "Amazon Web Services", year: "2025" },
  { title: "Meta Front-End Developer", issuer: "Coursera", year: "2024" },
  { title: "Machine Learning Specialization", issuer: "DeepLearning.AI", year: "2025" },
  { title: "Google Data Analytics", issuer: "Coursera", year: "2024" },
];

// The negative strip. Each roll is one band of the filmstrip.
export const skills = [
  {
    roll: "Front of house",
    stock: "UI 400",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "HTML / CSS"],
  },
  {
    roll: "Back of house",
    stock: "API 200",
    items: ["Python", "FastAPI", "Node.js", "Express", "REST", "WebSockets"],
  },
  {
    roll: "Storage",
    stock: "DATA 100",
    items: ["PostgreSQL", "MongoDB", "Redis", "Prisma", "pgvector", "SQL"],
  },
  {
    roll: "Applied AI",
    stock: "ML 800",
    items: ["OpenAI API", "LangChain", "Embeddings", "RAG", "Whisper", "Prompt design"],
  },
  {
    roll: "Toolkit",
    stock: "OPS 320",
    items: ["Git", "Docker", "AWS", "Vercel", "CI/CD", "Linux"],
  },
];

export const plates = [
  { id: "cover", label: "Cover" },
  { id: "subject", label: "The Subject" },
  { id: "exposures", label: "Exposures" },
  { id: "negative", label: "The Negative" },
  { id: "provenance", label: "Provenance" },
  { id: "stamps", label: "Stamps" },
  { id: "colophon", label: "Colophon" },
];
