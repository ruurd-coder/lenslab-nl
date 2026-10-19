import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createServiceClient } from '@/lib/supabase/server'
import { employmentLabel, formatSalary, type JobOpening } from '@/lib/careers'
import SiteNav from '@/components/site-nav'
import SiteFooter from '@/components/site-footer'
import ApplyForm from '@/components/careers/apply-form'

export const dynamic = 'force-dynamic'

interface Props { params: Promise<{ slug: string }> }

async function getJob(slug: string) {
  const service = await createServiceClient()
  const { data } = await service
    .from('job_openings')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'open')
    .contains('platforms', ['lenslab.nl'])
    .maybeSingle()
  return data as JobOpening | null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const job = await getJob(slug)
  if (!job) return {}
  return {
    title: `${job.title} | Jobs bij LensLab`,
    description: job.intro || undefined,
    alternates: { canonical: `https://lenslab.nl/jobs/${job.slug}` },
  }
}

const EMPLOYMENT_SCHEMA: Record<string, string> = {
  fulltime: 'FULL_TIME', parttime: 'PART_TIME', freelance: 'CONTRACTOR', internship: 'INTERN',
}

function List({ title, items }: { title: string; items: string[] }) {
  if (!items?.length) return null
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-black text-gray-900 mb-4">{title}</h2>
      <ul className="space-y-2.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-[16px] text-gray-700 leading-[1.7]">
            <span className="text-[#530095] mt-0.5 shrink-0">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default async function JobPage({ params }: Props) {
  const { slug } = await params
  const job = await getJob(slug)
  if (!job) notFound()
  const base = '/jobs'

  const salary = formatSalary(job, 'nl')
  const facts = [
    { label: 'Locatie', value: job.location },
    { label: 'Dienstverband', value: employmentLabel(job.employment_type, 'nl') },
    { label: 'Uren', value: job.hours_per_week && `${job.hours_per_week} uur/week` },
    { label: 'Salaris', value: salary },
    { label: 'Team', value: job.department },
  ].filter((f) => f.value)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: [job.intro, job.description].filter(Boolean).join('\n\n') || job.title,
    datePosted: job.published_at ?? job.created_at,
    employmentType: job.employment_type ? EMPLOYMENT_SCHEMA[job.employment_type] : undefined,
    hiringOrganization: { '@type': 'Organization', name: 'LensLab', sameAs: 'https://lenslab.nl' },
    jobLocation: job.location
      ? { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: job.location, addressCountry: 'NL' } }
      : undefined,
    baseSalary: salary && job.salary_min != null
      ? {
          '@type': 'MonetaryAmount',
          currency: 'EUR',
          value: {
            '@type': 'QuantitativeValue',
            minValue: job.salary_min,
            maxValue: job.salary_max ?? job.salary_min,
            unitText: { month: 'MONTH', year: 'YEAR', hour: 'HOUR' }[job.salary_period],
          },
        }
      : undefined,
  }

  return (
    <div className="min-h-screen bg-[#FCFAFF]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <SiteNav />

      <article className="max-w-6xl mx-auto px-5 md:px-10 pt-10 pb-24">
        <Link href={base} className="text-sm text-gray-500 hover:text-gray-900">← Alle jobs</Link>

        <header className="mt-6 mb-10 max-w-3xl">
          {job.department && (
            <p className="text-[11px] font-bold tracking-[0.15em] text-[#530095] uppercase mb-4">{job.department}</p>
          )}
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 leading-[1.05] tracking-tight mb-5" style={{ fontFamily: 'var(--font-dm-sans)' }}>{job.title}</h1>
          {job.intro && <p className="text-lg text-gray-600 leading-relaxed">{job.intro}</p>}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          <div className="lg:col-span-2 min-w-0">
            {job.description && (
              <div className="space-y-5">
                {job.description.split(/\n\s*\n/).map((para, i) => (
                  <p key={i}
                    className="text-[16px] text-gray-700 leading-[1.75] whitespace-pre-line [&_strong]:font-bold [&_em]:italic [&_u]:underline [&_s]:line-through [&_a]:text-[#530095] [&_a]:underline [&_a:hover]:opacity-80"
                    dangerouslySetInnerHTML={{ __html: para }} />
                ))}
              </div>
            )}
            <List title="Wat ga je doen" items={job.responsibilities} />
            <List title="Wie zoeken we" items={job.requirements} />
            <List title="Wat bieden we" items={job.benefits} />

            <div id="apply" className="mt-14 scroll-mt-24">
              <ApplyForm jobId={job.id} platform="lenslab.nl" lang="nl" />
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 rounded-3xl bg-[#EEE8F8] p-6 space-y-4">
            {facts.map((f) => (
              <div key={f.label}>
                <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-gray-400">{f.label}</p>
                <p className="text-[15px] font-semibold text-gray-900 mt-0.5">{f.value}</p>
              </div>
            ))}
            <a href="#apply"
              className="block text-center bg-[#530095] text-white font-semibold text-[15px] px-6 py-3 rounded-full hover:bg-[#3d006e] transition-colors">
              Solliciteer direct
            </a>
          </aside>
        </div>
      </article>

      <SiteFooter />
    </div>
  )
}
