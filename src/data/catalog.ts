import { CATEGORY_SEEDS } from "@/domain/taxonomy";

export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string;
  sortOrder: number;
};

export type Source = {
  id: string;
  slug: string;
  name: string;
  type: "NEWS" | "COMPANY_BLOG" | "RESEARCH" | "GOVERNMENT" | "NEWSLETTER" | "COMMUNITY" | "DEVELOPER_BLOG" | "OPEN_SOURCE";
  websiteUrl: string;
  feedUrl: string;
  popularityWeight: number;
  categories: string[];
};

export type Technology = {
  id: string;
  slug: string;
  name: string;
  description: string;
  aliases: string[];
  categorySlugs: string[];
  popularityScore: number;
  isActive: boolean;
};

export type Company = {
  id: string;
  slug: string;
  name: string;
  websiteUrl: string;
  description: string;
  aliases: string[];
};

export type TechEvent = {
  id: string;
  slug: string;
  name: string;
  url: string;
  location: string;
  startsAt: Date;
  endsAt: Date;
  companySlug?: string;
  status: "UPCOMING" | "LIVE" | "PAST";
  description: string | null;
  imageUrl: string | null;
  isVirtual: boolean;
};

export const categories: Category[] = CATEGORY_SEEDS.map((item) => ({ id: item.slug, ...item }));

export const sources: Source[] = [
  ["techcrunch", "TechCrunch", "NEWS", "https://techcrunch.com", "https://techcrunch.com/feed/", 1.4, ["startups-funding", "big-tech"]],
  ["the-verge", "The Verge", "NEWS", "https://www.theverge.com", "https://www.theverge.com/rss/index.xml", 1.3, ["consumer-technology", "big-tech"]],
  ["wired", "Wired", "NEWS", "https://www.wired.com", "https://www.wired.com/feed/rss", 1.2, ["consumer-technology", "research-innovation"]],
  ["ars-technica", "Ars Technica", "NEWS", "https://arstechnica.com", "https://feeds.arstechnica.com/arstechnica/index", 1.3, ["software-development", "consumer-technology"]],
  ["zdnet", "ZDNet", "NEWS", "https://www.zdnet.com", "https://www.zdnet.com/rss.xml", 1.1, ["cloud-computing", "big-tech"]],
  ["engadget", "Engadget", "NEWS", "https://www.engadget.com", "https://www.engadget.com/rss.xml", 1.1, ["consumer-technology"]],
  ["cnet", "CNET", "NEWS", "https://www.cnet.com", "https://www.cnet.com/rss/news/", 1, ["consumer-technology"]],
  ["microsoft-blog", "Microsoft Blog", "COMPANY_BLOG", "https://blogs.microsoft.com", "https://blogs.microsoft.com/feed/", 1.5, ["big-tech", "cloud-computing"]],
  ["azure-blog", "Azure Blog", "COMPANY_BLOG", "https://azure.microsoft.com/blog", "https://azure.microsoft.com/en-us/blog/feed/", 1.5, ["cloud-computing"]],
  ["google-blog", "Google Blog", "COMPANY_BLOG", "https://blog.google", "https://blog.google/rss/", 1.4, ["big-tech"]],
  ["google-ai-blog", "Google AI Blog", "COMPANY_BLOG", "https://blog.google/technology/ai/", "https://blog.google/technology/ai/rss/", 1.4, ["artificial-intelligence"]],
  ["aws-blog", "AWS Blog", "COMPANY_BLOG", "https://aws.amazon.com/blogs/", "https://aws.amazon.com/blogs/aws/feed/", 1.5, ["cloud-computing"]],
  ["openai-news", "OpenAI News", "COMPANY_BLOG", "https://openai.com/news/", "https://openai.com/news/rss.xml", 1.4, ["artificial-intelligence"]],
  ["nvidia-blog", "Nvidia Blog", "COMPANY_BLOG", "https://blogs.nvidia.com", "https://blogs.nvidia.com/feed/", 1.3, ["artificial-intelligence"]],
  ["meta-engineering", "Meta Engineering", "COMPANY_BLOG", "https://engineering.fb.com", "https://engineering.fb.com/feed/", 1.3, ["software-development", "big-tech"]],
  ["nist", "NIST", "GOVERNMENT", "https://www.nist.gov", "https://www.nist.gov/news-events/news/rss.xml", 1.1, ["government-technology", "cybersecurity"]],
  ["hacker-news", "Hacker News", "COMMUNITY", "https://news.ycombinator.com", "https://hnrss.org/frontpage", 1.3, ["software-development", "startups-funding"]],
  ["reddit-programming", "Reddit Programming", "COMMUNITY", "https://www.reddit.com/r/programming", "https://www.reddit.com/r/programming/.rss", 1, ["software-development"]],
  ["infoq", "InfoQ", "DEVELOPER_BLOG", "https://www.infoq.com", "https://feed.infoq.com", 1.2, ["software-development", "devops"]],
  ["stackoverflow-blog", "Stack Overflow Blog", "DEVELOPER_BLOG", "https://stackoverflow.blog", "https://stackoverflow.blog/feed/", 1.2, ["software-development"]],
  ["martin-fowler", "Martin Fowler", "DEVELOPER_BLOG", "https://martinfowler.com", "https://martinfowler.com/feed.atom", 1.3, ["software-development"]],
  ["kubernetes-blog", "Kubernetes Blog", "OPEN_SOURCE", "https://kubernetes.io/blog/", "https://kubernetes.io/feed.xml", 1.4, ["open-source", "devops"]],
  ["cncf", "CNCF", "OPEN_SOURCE", "https://www.cncf.io", "https://www.cncf.io/feed/", 1.3, ["open-source", "cloud-computing"]],
].map(([slug, name, type, websiteUrl, feedUrl, popularityWeight, categorySlugs]) => ({
  id: slug as string,
  slug: slug as string,
  name: name as string,
  type: type as Source["type"],
  websiteUrl: websiteUrl as string,
  feedUrl: feedUrl as string,
  popularityWeight: popularityWeight as number,
  categories: categorySlugs as string[],
}));

const technologyRows: [string, string, string, string[], string[]][] = [
  ["kubernetes", "Kubernetes", "Container orchestration.", ["kubernetes", "k8s"], ["cloud-computing", "devops", "open-source"]],
  ["docker", "Docker", "Container runtime and packaging.", ["docker"], ["devops", "software-development"]],
  ["python", "Python", "General-purpose programming language.", ["python"], ["software-development"]],
  ["java", "Java", "Enterprise programming language.", ["java"], ["software-development"]],
  ["postgresql", "PostgreSQL", "Open-source relational database.", ["postgresql", "postgres"], ["data-engineering", "open-source"]],
  ["kafka", "Kafka", "Distributed event streaming.", ["kafka", "apache kafka"], ["data-engineering", "open-source"]],
  ["terraform", "Terraform", "Infrastructure as code.", ["terraform"], ["devops", "cloud-computing"]],
  ["azure", "Azure", "Microsoft cloud platform.", ["azure"], ["cloud-computing"]],
  ["aws", "AWS", "Amazon cloud services.", ["aws", "amazon web services"], ["cloud-computing"]],
  ["google-cloud", "Google Cloud", "Google Cloud Platform.", ["google cloud", "gcp"], ["cloud-computing"]],
  ["rust", "Rust", "Systems programming language.", ["rust"], ["software-development"]],
  ["react", "React", "UI library for the web.", ["react", "reactjs"], ["software-development"]],
  ["typescript", "TypeScript", "Typed JavaScript.", ["typescript"], ["software-development"]],
  ["linux", "Linux", "Open-source operating system.", ["linux"], ["open-source", "devops"]],
  ["mcp", "MCP", "Model Context Protocol.", ["mcp", "model context protocol"], ["artificial-intelligence", "software-development"]],
  ["agentic-ai", "Agentic AI", "Autonomous and tool-using AI agents.", ["agentic ai", "ai agents"], ["artificial-intelligence"]],
  ["quantum-computing", "Quantum Computing", "Quantum processors and algorithms.", ["quantum computing", "qubit"], ["quantum-computing", "research-innovation"]],
  ["openai-api", "OpenAI API", "OpenAI developer platform.", ["chatgpt", "gpt-4", "gpt-5"], ["artificial-intelligence"]],
  ["cuda", "CUDA", "NVIDIA parallel computing platform.", ["cuda"], ["artificial-intelligence"]],
  ["nextjs", "Next.js", "React framework.", ["next.js", "nextjs"], ["software-development"]],
  ["golang", "Go", "Google's systems language.", ["golang"], ["software-development"]],
  ["redis", "Redis", "In-memory data store.", ["redis"], ["data-engineering", "open-source"]],
  ["spark", "Apache Spark", "Distributed data processing.", ["apache spark"], ["data-engineering", "open-source"]],
  ["openshift", "OpenShift", "Red Hat Kubernetes platform.", ["openshift"], ["cloud-computing", "devops"]],
  ["cloudflare-workers", "Cloudflare Workers", "Edge compute.", ["cloudflare workers"], ["cloud-computing", "networking"]],
  ["github-actions", "GitHub Actions", "CI/CD workflows.", ["github actions"], ["devops"]],
  ["snowflake", "Snowflake", "Cloud data warehouse.", ["snowflake"], ["data-engineering"]],
  ["databricks", "Databricks", "Lakehouse platform.", ["databricks"], ["data-engineering"]],
  ["mongodb", "MongoDB", "Document database.", ["mongodb"], ["data-engineering"]],
  ["cve", "CVE / Vulnerabilities", "Security advisories and exploits.", ["cve", "zero-day", "ransomware"], ["cybersecurity"]],
  ["5g", "5G", "Mobile telecommunications.", ["5g"], ["telecommunications"]],
  ["robotics", "Robotics", "Autonomous machines.", ["robotics", "humanoid robot"], ["robotics"]],
  ["vision-pro", "Spatial Computing", "AR/VR platforms.", ["vision pro", "apple vision", "quest 3"], ["ar-vr"]],
  ["crispr", "CRISPR", "Gene editing.", ["crispr"], ["biotechnology"]],
];

export const technologies: Technology[] = technologyRows.map(([slug, name, description, aliases, categorySlugs]) => ({
  id: slug,
  slug,
  name,
  description,
  aliases,
  categorySlugs,
  popularityScore: 0,
  isActive: true,
}));

const companyRows: [string, string, string, string, string[]][] = [
  ["microsoft", "Microsoft", "https://www.microsoft.com", "Cloud, developer tools, and productivity platforms.", ["microsoft", "msft", "azure"]],
  ["aws", "AWS", "https://aws.amazon.com", "Amazon Web Services cloud platform.", ["aws", "amazon web services"]],
  ["google-cloud", "Google Cloud", "https://cloud.google.com", "Google Cloud Platform.", ["google cloud", "gcp"]],
  ["oracle", "Oracle", "https://www.oracle.com", "Database and cloud infrastructure.", ["oracle"]],
  ["red-hat", "Red Hat", "https://www.redhat.com", "Enterprise Linux and OpenShift.", ["red hat", "redhat", "rhel"]],
  ["vmware", "VMware", "https://www.vmware.com", "Virtualization and cloud infrastructure.", ["vmware"]],
  ["databricks", "Databricks", "https://www.databricks.com", "Lakehouse and data intelligence platform.", ["databricks"]],
  ["snowflake", "Snowflake", "https://www.snowflake.com", "Cloud data platform.", ["snowflake"]],
  ["mongodb", "MongoDB", "https://www.mongodb.com", "Document database platform.", ["mongodb"]],
  ["github", "GitHub", "https://github.com", "Source control and developer collaboration.", ["github"]],
  ["cloudflare", "Cloudflare", "https://www.cloudflare.com", "Edge network, security, and workers.", ["cloudflare"]],
  ["nvidia", "Nvidia", "https://www.nvidia.com", "GPUs, CUDA, and AI systems.", ["nvidia"]],
  ["openai", "OpenAI", "https://openai.com", "Foundation models and developer APIs.", ["openai", "chatgpt"]],
  ["apple", "Apple", "https://www.apple.com", "Devices, platforms, and silicon.", ["apple"]],
  ["meta", "Meta", "https://www.meta.com", "Social platforms and infrastructure.", ["meta", "facebook"]],
  ["google", "Google", "https://www.google.com", "Search, Android, and research.", ["google", "alphabet"]],
  ["amazon", "Amazon", "https://www.amazon.com", "Retail, AWS, and devices.", ["amazon"]],
];

export const companies: Company[] = companyRows.map(([slug, name, websiteUrl, description, aliases]) => ({
  id: slug,
  slug,
  name,
  websiteUrl,
  description,
  aliases,
}));

const eventRows: [string, string, string, string, string, string?][] = [
  ["microsoft-build-2026", "Microsoft Build", "https://build.microsoft.com", "Seattle / digital", "2026-05-19", "microsoft"],
  ["microsoft-ignite-2026", "Microsoft Ignite", "https://ignite.microsoft.com", "Various", "2026-11-16", "microsoft"],
  ["google-io-2026", "Google I/O", "https://io.google", "Mountain View", "2026-05-12", "google"],
  ["aws-reinvent-2026", "AWS re:Invent", "https://reinvent.awsevents.com", "Las Vegas", "2026-11-30", "aws"],
  ["apple-wwdc-2026", "Apple WWDC", "https://developer.apple.com/wwdc/", "Cupertino / digital", "2026-06-08", "apple"],
  ["kubecon-na-2026", "KubeCon", "https://events.linuxfoundation.org", "North America", "2026-11-10"],
  ["dockercon-2026", "DockerCon", "https://www.docker.com/dockercon/", "TBA", "2026-10-06"],
  ["pycon-us-2026", "PyCon US", "https://us.pycon.org", "United States", "2026-05-13"],
  ["red-hat-summit-2026", "Red Hat Summit", "https://www.redhat.com/en/summit", "TBA", "2026-05-19", "red-hat"],
  ["oracle-cloudworld-2026", "Oracle CloudWorld", "https://www.oracle.com/cloudworld/", "Las Vegas", "2026-10-12", "oracle"],
  ["vmware-explore-2026", "VMware Explore", "https://www.vmware.com/explore.html", "Las Vegas", "2026-08-24", "vmware"],
  ["ces-2027", "CES", "https://www.ces.tech", "Las Vegas", "2027-01-07"],
  ["mwc-2027", "Mobile World Congress", "https://www.mwcbarcelona.com", "Barcelona", "2027-03-01"],
];

export const events: TechEvent[] = eventRows.map(([slug, name, url, location, date, companySlug]) => {
  const startsAt = new Date(`${date}T09:00:00.000Z`);
  return {
    id: slug,
    slug,
    name,
    url,
    location,
    startsAt,
    endsAt: new Date(startsAt.getTime() + 3 * 86_400_000),
    companySlug,
    status: startsAt >= new Date() ? "UPCOMING" : "PAST",
    description: null,
    imageUrl: null,
    isVirtual: location.includes("digital"),
  };
});
