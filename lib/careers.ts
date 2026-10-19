// Jobs (vacatures) shown on lenslab.nl/jobs. Copy of lenslab-b2b-saas
// lib/careers — the jobs are managed in the lenslab.tech admin (tables
// job_openings / job_applications, migration 076 in lenslab-b2b-saas).

export const CAREER_PLATFORMS = ["lenslab.design", "lenslab.nl"] as const;
export type CareerPlatform = (typeof CAREER_PLATFORMS)[number];

export const JOB_STATUSES = [
  { value: "draft", label: "Draft", style: "bg-gray-100 text-gray-500" },
  { value: "open", label: "Open", style: "bg-green-100 text-green-700" },
  { value: "paused", label: "Paused", style: "bg-amber-100 text-amber-700" },
  { value: "closed", label: "Closed", style: "bg-red-50 text-red-600" },
] as const;
export type JobStatus = (typeof JOB_STATUSES)[number]["value"];

export const EMPLOYMENT_TYPES = [
  { value: "fulltime", en: "Full-time", nl: "Fulltime" },
  { value: "parttime", en: "Part-time", nl: "Parttime" },
  { value: "freelance", en: "Freelance", nl: "Freelance" },
  { value: "internship", en: "Internship", nl: "Stage" },
] as const;

/** The hiring funnel, in order. */
export const STAGES = [
  { value: "applied", label: "Applicants", dot: "bg-gray-400" },
  { value: "interview", label: "In interview", dot: "bg-blue-500" },
  { value: "second_interview", label: "2nd interview", dot: "bg-indigo-500" },
  { value: "offer", label: "Offer", dot: "bg-[#530095]" },
  { value: "hired", label: "Hired", dot: "bg-green-500" },
  { value: "not_hired", label: "Not hired", dot: "bg-red-400" },
] as const;
export type Stage = (typeof STAGES)[number]["value"];

export const STAGE_VALUES = STAGES.map((s) => s.value) as Stage[];

export type JobOpening = {
  id: string;
  title: string;
  slug: string;
  platforms: string[];
  status: JobStatus;
  department: string | null;
  location: string | null;
  employment_type: string | null;
  hours_per_week: string | null;
  salary_min: number | null;
  salary_max: number | null;
  salary_period: "month" | "year" | "hour";
  show_salary: boolean;
  intro: string | null;
  description: string | null;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  hiring_manager_name: string | null;
  hiring_manager_email: string | null;
  target_hire_date: string | null;
  published_at: string | null;
  closed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type JobApplication = {
  id: string;
  job_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
  motivation: string | null;
  cv_path: string | null;
  cv_filename: string | null;
  source_platform: string | null;
  stage: Stage;
  stage_changed_at: string;
  rating: number | null;
  notes: string | null;
  created_at: string;
};

export const CV_BUCKET = "job-applications";

export function employmentLabel(value: string | null, lang: "en" | "nl") {
  if (!value) return null;
  return EMPLOYMENT_TYPES.find((t) => t.value === value)?.[lang] ?? value;
}

/** "€3.500 - €4.500 per month" / "€3.500 - €4.500 per maand". */
export function formatSalary(
  job: Pick<JobOpening, "salary_min" | "salary_max" | "salary_period" | "show_salary">,
  lang: "en" | "nl",
) {
  if (!job.show_salary || (job.salary_min == null && job.salary_max == null)) return null;
  const fmt = (n: number) => `€${n.toLocaleString("nl-NL")}`;
  const range =
    job.salary_min != null && job.salary_max != null && job.salary_min !== job.salary_max
      ? `${fmt(job.salary_min)} - ${fmt(job.salary_max)}`
      : fmt((job.salary_min ?? job.salary_max)!);
  const period = {
    en: { month: "per month", year: "per year", hour: "per hour" },
    nl: { month: "per maand", year: "per jaar", hour: "per uur" },
  }[lang][job.salary_period];
  return `${range} ${period}`;
}

export function slugify(title: string) {
  return title.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-");
}
