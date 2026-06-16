// Metadata tiap karir untuk memperkaya tampilan hasil (ikon, deskripsi, gaji, roadmap).
import {
  FaServer, FaPalette, FaLayerGroup, FaMobileScreen, FaBrain, FaGear,
  FaDatabase, FaChartLine, FaShieldHalved, FaGamepad, FaCloud, FaUserGear,
  FaHeadset, FaClipboardList, FaTableColumns, FaTableCells, FaPenRuler, FaRobot,
} from "react-icons/fa6";

const DEFAULT = {
  icon: FaRobot,
  color: "from-brand-500 to-accent-500",
  desc: "Profesi di bidang teknologi informasi.",
  salary: "Rp 7 – 18 jt / bln",
  learn: ["Komunikasi teknis", "Problem solving", "Version control (Git)"],
};

export const CAREER_META = {
  "Backend Developer": {
    icon: FaServer, color: "from-emerald-500 to-teal-600",
    desc: "Membangun logika server, API, dan integrasi database aplikasi.",
    salary: "Rp 9 – 22 jt / bln",
    learn: ["Desain REST/GraphQL API", "Caching & message queue", "Database scaling"],
  },
  "Frontend Developer": {
    icon: FaPalette, color: "from-pink-500 to-rose-600",
    desc: "Membangun antarmuka pengguna yang interaktif dan responsif.",
    salary: "Rp 8 – 20 jt / bln",
    learn: ["State management lanjutan", "Web performance", "Accessibility (a11y)"],
  },
  "Full Stack Developer": {
    icon: FaLayerGroup, color: "from-violet-500 to-purple-600",
    desc: "Menguasai pengembangan frontend sekaligus backend secara menyeluruh.",
    salary: "Rp 10 – 25 jt / bln",
    learn: ["Arsitektur aplikasi", "CI/CD", "Cloud deployment"],
  },
  "Mobile App Developer": {
    icon: FaMobileScreen, color: "from-sky-500 to-blue-600",
    desc: "Mengembangkan aplikasi untuk perangkat Android & iOS.",
    salary: "Rp 9 – 22 jt / bln",
    learn: ["Native/Cross-platform (Flutter/RN)", "App store deployment", "Offline-first"],
  },
  "Machine Learning Engineer": {
    icon: FaBrain, color: "from-fuchsia-500 to-pink-600",
    desc: "Merancang & menerapkan model machine learning ke produk nyata.",
    salary: "Rp 12 – 30 jt / bln",
    learn: ["MLOps", "Deep learning", "Model deployment & monitoring"],
  },
  "DevOps Engineer": {
    icon: FaGear, color: "from-amber-500 to-orange-600",
    desc: "Mengelola CI/CD, infrastruktur, dan otomasi deployment.",
    salary: "Rp 12 – 28 jt / bln",
    learn: ["Kubernetes", "Infrastructure as Code", "Observability"],
  },
  "Data Engineer": {
    icon: FaDatabase, color: "from-cyan-500 to-teal-600",
    desc: "Membangun pipeline data dan infrastruktur pengolahan data skala besar.",
    salary: "Rp 11 – 26 jt / bln",
    learn: ["Apache Spark/Airflow", "Data warehouse", "Streaming data"],
  },
  "Data Scientist": {
    icon: FaChartLine, color: "from-indigo-500 to-blue-600",
    desc: "Menganalisis data untuk menghasilkan insight & model prediktif.",
    salary: "Rp 12 – 28 jt / bln",
    learn: ["Statistik lanjutan", "Eksperimen A/B", "Storytelling data"],
  },
  "Cybersecurity Analyst": {
    icon: FaShieldHalved, color: "from-red-500 to-rose-600",
    desc: "Melindungi sistem dari ancaman dan menganalisis kerentanan keamanan.",
    salary: "Rp 10 – 26 jt / bln",
    learn: ["Threat hunting", "SIEM tools", "Penetration testing"],
  },
  "Game Developer": {
    icon: FaGamepad, color: "from-purple-500 to-indigo-600",
    desc: "Mengembangkan game dengan engine modern dan logika gameplay.",
    salary: "Rp 8 – 22 jt / bln",
    learn: ["Unity/Unreal", "Game physics", "Optimasi grafis"],
  },
  "Cloud Engineer": {
    icon: FaCloud, color: "from-sky-500 to-cyan-600",
    desc: "Merancang & mengelola infrastruktur di cloud (AWS/GCP/Azure).",
    salary: "Rp 12 – 30 jt / bln",
    learn: ["Arsitektur cloud", "Terraform", "Cost optimization"],
  },
  "System Administrator": {
    icon: FaUserGear, color: "from-slate-500 to-slate-700",
    desc: "Mengelola server, jaringan, dan keandalan sistem operasional.",
    salary: "Rp 7 – 18 jt / bln",
    learn: ["Linux administration", "Scripting otomasi", "Monitoring"],
  },
  "IT Support Specialist": {
    icon: FaHeadset, color: "from-teal-500 to-emerald-600",
    desc: "Memberi dukungan teknis dan menyelesaikan masalah pengguna.",
    salary: "Rp 5 – 12 jt / bln",
    learn: ["Troubleshooting", "Ticketing system", "Komunikasi pelanggan"],
  },
  "Product Manager (Teknologi)": {
    icon: FaClipboardList, color: "from-orange-500 to-amber-600",
    desc: "Memimpin pengembangan produk dari ide hingga peluncuran.",
    salary: "Rp 15 – 35 jt / bln",
    learn: ["Product discovery", "Roadmapping", "Analisis metrik produk"],
  },
  "Database Administrator (DBA)": {
    icon: FaTableColumns, color: "from-blue-500 to-indigo-600",
    desc: "Mengelola, mengamankan, dan mengoptimalkan basis data.",
    salary: "Rp 10 – 24 jt / bln",
    learn: ["Query tuning", "Backup & recovery", "High availability"],
  },
  "Data Analyst": {
    icon: FaTableCells, color: "from-green-500 to-emerald-600",
    desc: "Mengubah data menjadi insight bisnis melalui visualisasi & laporan.",
    salary: "Rp 7 – 18 jt / bln",
    learn: ["SQL lanjutan", "BI tools (Tableau/Power BI)", "Dashboarding"],
  },
  "UX Designer": {
    icon: FaPenRuler, color: "from-rose-500 to-pink-600",
    desc: "Merancang pengalaman pengguna yang intuitif dan menyenangkan.",
    salary: "Rp 8 – 20 jt / bln",
    learn: ["User research", "Prototyping (Figma)", "Usability testing"],
  },
  "QA Engineer": {
    icon: FaClipboardList, color: "from-lime-500 to-green-600",
    desc: "Memastikan kualitas perangkat lunak melalui pengujian sistematis.",
    salary: "Rp 8 – 19 jt / bln",
    learn: ["Test automation", "CI testing", "Performance testing"],
  },
};

export const getCareerMeta = (name) => CAREER_META[name] || DEFAULT;
