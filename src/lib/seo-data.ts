const BASE_URL = "https://jmrh.lovable.app";

export const COMMON_KEYWORDS = "JMRH, Journal of Multidisciplinary Research Horizon, academic journal, research paper, peer-reviewed journal, open access journal, PhD research, multidisciplinary research, scholarly publication, Ooty, Nilgiris, Gudalur, Tamil Nadu, India, research mentoring, academic mentorship, paper publication, dissertation support, postgraduate research, education research, teaching research, technology research, science journal, humanities journal, social science research";

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "JMRH Publications",
  alternateName: "Journal of Multidisciplinary Research Horizon",
  url: BASE_URL,
  logo: "https://storage.googleapis.com/gpt-engineer-file-uploads/z6n6yRQR3COHl1C465nlg0EUjOx2/uploads/1770267719301-download.webp",
  description: "JMRH is a peer-reviewed, open-access academic journal based in Gudalur, The Nilgiris, Tamil Nadu, India. Dedicated to advancing multidisciplinary research through rigorous scholarly mentoring and publication for PhD scholars and early-career researchers.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Gudalur",
    addressLocality: "The Nilgiris",
    addressRegion: "Tamil Nadu",
    postalCode: "643212",
    addressCountry: "IN",
  },
  contactPoint: {
    "@type": "ContactPoint",
    email: "info@jmrhpublications.com",
    contactType: "editorial office",
  },
  sameAs: [],
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "JMRH - Journal of Multidisciplinary Research Horizon",
  alternateName: "JMRH Publications",
  url: BASE_URL,
  description: "Peer-reviewed open-access academic journal for multidisciplinary research from Ooty, Nilgiris, Gudalur region. Supporting PhD scholars, postgraduates, and researchers in education, technology, science, and humanities.",
  publisher: { "@type": "Organization", name: "JMRH Publications" },
  potentialAction: {
    "@type": "SearchAction",
    target: `${BASE_URL}/archives?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export const periodicaSchema = {
  "@context": "https://schema.org",
  "@type": "Periodical",
  name: "Journal of Multidisciplinary Research Horizon",
  alternateName: "JMRH",
  url: BASE_URL,
  publisher: {
    "@type": "Organization",
    name: "JMRH Publications",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Gudalur, The Nilgiris",
      addressRegion: "Tamil Nadu",
      addressCountry: "IN",
    },
  },
  description: "A peer-reviewed, open-access multidisciplinary academic journal published from the Nilgiris district near Ooty, Tamil Nadu, India. Covering research in education, technology, science, humanities, and social sciences.",
  isAccessibleForFree: true,
  inLanguage: "en",
};

export const pageSEO = {
  home: {
    title: "JMRH – Journal of Multidisciplinary Research Horizon | Peer-Reviewed Academic Journal | Ooty, Nilgiris",
    description: "JMRH is a peer-reviewed, open-access academic journal from Gudalur, Nilgiris near Ooty, Tamil Nadu. Submit your PhD research papers in education, technology, science & humanities. Free mentoring for scholars.",
    keywords: COMMON_KEYWORDS + ", home, submit paper, call for papers, research publication India",
  },
  about: {
    title: "About JMRH – Multidisciplinary Research Journal | Gudalur, Nilgiris, Tamil Nadu",
    description: "Learn about JMRH Publications – a scholarly journal based in Gudalur, The Nilgiris near Ooty. We mentor PhD scholars and early-career researchers across education, technology, science, and humanities.",
    keywords: COMMON_KEYWORDS + ", about JMRH, journal history, academic mission, research vision",
  },
  guidelines: {
    title: "Author Guidelines – How to Submit Research Papers | JMRH Journal",
    description: "Complete author guidelines for submitting research papers to JMRH. Formatting requirements, submission process, and manuscript preparation for PhD scholars and researchers.",
    keywords: COMMON_KEYWORDS + ", author guidelines, submission guidelines, manuscript format, paper submission, how to publish research paper",
  },
  editorial: {
    title: "Editorial Board – JMRH Academic Journal | Expert Reviewers & Editors",
    description: "Meet the JMRH editorial board – experienced academics and researchers guiding peer review in education, technology, science, and humanities from the Nilgiris region.",
    keywords: COMMON_KEYWORDS + ", editorial board, peer reviewers, academic editors, journal committee",
  },
  ethics: {
    title: "Publication Ethics & Policies – JMRH | Academic Integrity Standards",
    description: "JMRH publication ethics policy covering plagiarism, authorship, peer review integrity, and open access standards for academic research publishing.",
    keywords: COMMON_KEYWORDS + ", publication ethics, plagiarism policy, academic integrity, research ethics, COPE guidelines",
  },
  archives: {
    title: "Research Archives – Published Papers & Issues | JMRH Journal",
    description: "Browse published research papers and past issues of JMRH. Open-access archives covering multidisciplinary research in education, technology, science, and humanities.",
    keywords: COMMON_KEYWORDS + ", published papers, journal archives, past issues, research articles, open access papers",
  },
  reviews: {
    title: "Peer Reviews & Testimonials – JMRH Journal | Scholar Feedback",
    description: "Read reviews and testimonials from researchers and PhD scholars who published with JMRH. Learn about our mentoring and peer review experience.",
    keywords: COMMON_KEYWORDS + ", reviews, testimonials, scholar feedback, peer review experience",
  },
  contact: {
    title: "Contact JMRH – Reach Our Editorial Office | Gudalur, Nilgiris",
    description: "Contact JMRH Publications editorial office in Gudalur, The Nilgiris, Tamil Nadu. Get in touch for paper submissions, queries, and research mentoring support.",
    keywords: COMMON_KEYWORDS + ", contact, editorial office, Gudalur address, reach us, phone, email",
  },
  submitPaper: {
    title: "Submit Your Research Paper – JMRH | Online Manuscript Submission",
    description: "Submit your research paper or manuscript to JMRH online. Open to PhD scholars, postgraduates, and researchers in all disciplines. Fast peer review process.",
    keywords: COMMON_KEYWORDS + ", submit paper, manuscript submission, online submission, publish research, call for papers",
  },
  // New pages SEO
  aboutUs: {
    title: "About Us – JMRH Publications | Academic Publishing Platform | Tamil Nadu",
    description: "JMRH Publications is an MSME-registered independent academic publishing platform from Tamil Nadu, India. Promoting ethical scholarly communication across multidisciplinary domains.",
    keywords: COMMON_KEYWORDS + ", about us, MSME registered, academic publisher India, publishing platform",
  },
  callForPapers: {
    title: "Call for Papers 2026 – Submit Research to JMRH | Open Access Journal",
    description: "JMRH invites original research manuscripts for 2026 issues. Submit papers in commerce, education, technology, science, humanities & more. APC ₹650 after acceptance.",
    keywords: COMMON_KEYWORDS + ", call for papers 2026, submit manuscript, research submission, CFP India",
  },
  policies: {
    title: "Publication Policies – JMRH | Ethics, Peer Review, Plagiarism & Copyright",
    description: "Complete publication policies of JMRH including ethics, peer review, plagiarism screening, open access, copyright, withdrawal, and refund policies.",
    keywords: COMMON_KEYWORDS + ", publication policies, journal ethics, peer review policy, plagiarism policy, copyright policy",
  },
  journalAbout: {
    title: "About the Journal – JMRH | Peer-Reviewed Open Access Monthly Journal",
    description: "JMRH is an international, peer-reviewed, open-access journal published monthly. Double-blind peer review, multidisciplinary coverage from Nilgiris, Tamil Nadu.",
    keywords: COMMON_KEYWORDS + ", about journal, peer reviewed, open access, monthly journal, double blind review",
  },
  journalAimsScope: {
    title: "Aims & Scope – JMRH Journal | Multidisciplinary Research Areas",
    description: "Discover JMRH's research scope covering commerce, economics, education, social sciences, technology, environmental studies, and innovation.",
    keywords: COMMON_KEYWORDS + ", aims and scope, research areas, multidisciplinary scope, journal coverage",
  },
  journalEditorialBoard: {
    title: "Editorial Board – JMRH | Dr. Karthick B, Editor-in-Chief",
    description: "Meet the JMRH editorial board led by Dr. Karthick B. Expert academicians from Government Arts and Science College, Gudalur and Nilgiri College.",
    keywords: COMMON_KEYWORDS + ", editorial board, editor in chief, Dr Karthick B, Gudalur college, reviewers",
  },
  journalGuidelines: {
    title: "Author Guidelines – JMRH | Manuscript Submission & Formatting Rules",
    description: "Submit manuscripts to JMRH via email. APA 7th Edition, Times New Roman 12pt, double spacing. DOC/DOCX format only. APC ₹650 after acceptance.",
    keywords: COMMON_KEYWORDS + ", author guidelines, manuscript format, APA citation, submission rules",
  },
  journalEthics: {
    title: "Publication Ethics – JMRH | UGC & COPE Compliance Standards",
    description: "JMRH enforces strict publication ethics: plagiarism under 10%, UGC and COPE guidelines compliance. No duplicate submissions or data fabrication.",
    keywords: COMMON_KEYWORDS + ", publication ethics, UGC guidelines, COPE, plagiarism check, research integrity",
  },
  journalPeerReview: {
    title: "Peer Review Process – JMRH | Double-Blind Review in 3-4 Weeks",
    description: "JMRH uses double-blind peer review with minimum 2 independent reviewers. Review completed in 3-4 weeks. Decisions based solely on academic merit.",
    keywords: COMMON_KEYWORDS + ", peer review, double blind review, review process, academic evaluation",
  },
  journalAPC: {
    title: "Article Processing Charges – JMRH | ₹650 INR After Acceptance",
    description: "JMRH Article Processing Charge is ₹650 INR, charged only after acceptance. Covers peer review, copyediting, formatting, and online publication.",
    keywords: COMMON_KEYWORDS + ", APC, article processing charge, publication fee, ₹650, affordable journal",
  },
  journalCurrentIssue: {
    title: "Current Issue – JMRH Journal | Volume 1, Issue 1 (2026)",
    description: "View the current issue of JMRH journal. Volume 1, Issue 1 published in 2026. Submit your research for upcoming issues.",
    keywords: COMMON_KEYWORDS + ", current issue, latest issue, volume 1, 2026 journal",
  },
  journalArchives: {
    title: "Journal Archives – JMRH | Browse Published Volumes & Issues",
    description: "Browse JMRH journal archives. Download published articles, view abstracts, and access past volumes and issues in open-access format.",
    keywords: COMMON_KEYWORDS + ", journal archives, published volumes, past issues, download papers",
  },
  journalOpenAccess: {
    title: "Open Access Policy – JMRH | Free CC BY-NC Licensed Research",
    description: "All JMRH articles are freely accessible under Creative Commons CC BY-NC license. Read, download, copy, and share for non-commercial purposes.",
    keywords: COMMON_KEYWORDS + ", open access, CC BY-NC, free access, creative commons, open science",
  },
  journalPlagiarism: {
    title: "Plagiarism Policy – JMRH | Similarity Index Under 10%",
    description: "JMRH enforces strict anti-plagiarism policy. Similarity index must not exceed 10%. All submissions screened using plagiarism detection software.",
    keywords: COMMON_KEYWORDS + ", plagiarism policy, similarity check, plagiarism detection, originality",
  },
  journalReviewerBoard: {
    title: "Reviewer Board – JMRH | Expert Academic Reviewers",
    description: "Meet the JMRH reviewer board - expert academics providing double-blind peer review across multidisciplinary research domains.",
    keywords: COMMON_KEYWORDS + ", reviewer board, peer reviewers, academic review panel",
  },
  journalSubmit: {
    title: "Submit Manuscript – JMRH | Easy Online Research Paper Submission",
    description: "Submit your research manuscript to JMRH. Upload DOC/DOCX files, fill author details, and submit for peer review. Fast and secure submission process.",
    keywords: COMMON_KEYWORDS + ", submit manuscript, upload paper, online submission, research submission",
  },
  terms: {
    title: "Terms & Conditions – JMRH Publications",
    description: "Terms and conditions governing the use of JMRH Publications website and services. Read before submitting manuscripts or using our platform.",
    keywords: COMMON_KEYWORDS + ", terms and conditions, legal terms, website terms",
  },
  privacy: {
    title: "Privacy Policy – JMRH Publications | Data Protection",
    description: "JMRH Publications privacy policy. Learn how we collect, use, and protect your personal information and research data.",
    keywords: COMMON_KEYWORDS + ", privacy policy, data protection, personal information, GDPR",
  },
  security: {
    title: "Security Policy – JMRH Publications | Secure Academic Platform",
    description: "JMRH Publications security measures to protect manuscripts, reviewer data, and author information on our academic platform.",
    keywords: COMMON_KEYWORDS + ", security policy, data security, secure platform, manuscript protection",
  },
  plagiarismPolicy: {
    title: "Plagiarism Policy – JMRH Publications | Anti-Plagiarism Standards",
    description: "Strict anti-plagiarism policy enforced by JMRH. All manuscripts screened for originality. Similarity index must be below 10%.",
    keywords: COMMON_KEYWORDS + ", plagiarism policy, anti plagiarism, similarity index, originality check",
  },
  openAccessPolicy: {
    title: "Open Access Policy – JMRH Publications | Free Research Access",
    description: "JMRH follows open-access publishing. All journal articles freely accessible under Creative Commons CC BY-NC license.",
    keywords: COMMON_KEYWORDS + ", open access policy, free research, CC BY-NC license",
  },
  disclaimer: {
    title: "Disclaimer – JMRH Publications | Academic Content Notice",
    description: "Disclaimer for JMRH Publications. Content is for academic and informational purposes. Authors are responsible for their submissions.",
    keywords: COMMON_KEYWORDS + ", disclaimer, academic disclaimer, content notice",
  },
  refund: {
    title: "Refund Policy – JMRH Publications | APC Refund Information",
    description: "JMRH refund policy for Article Processing Charges. APC charged only after acceptance. Refund conditions and exceptions explained.",
    keywords: COMMON_KEYWORDS + ", refund policy, APC refund, payment policy, processing charges",
  },
  copyright: {
    title: "Copyright Policy – JMRH Publications | Author Rights",
    description: "JMRH copyright policy. Authors retain copyright. Non-exclusive publishing rights granted to JMRH for distribution and archiving.",
    keywords: COMMON_KEYWORDS + ", copyright policy, author rights, publishing rights, intellectual property",
  },
};
