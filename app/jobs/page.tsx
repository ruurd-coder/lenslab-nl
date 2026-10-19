import Link from 'next/link'
import type { Metadata } from 'next'
import { createServiceClient } from '@/lib/supabase/server'
import { employmentLabel, formatSalary, type JobOpening } from '@/lib/careers'
import SiteNav from '@/components/site-nav'
import SiteFooter from '@/components/site-footer'

// Jobs are managed in the lenslab.tech admin (Vacancies) and shown here when
// "lenslab.nl" is ticked for the job.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Jobs bij LensLab | Werken bij LensLab',
  description: 'Openstaande vacatures bij LensLab. Bouw mee aan het platform waar opdrachtgevers en beeldmakers elkaar vinden.',
  alternates: { canonical: 'https://lenslab.nl/jobs' },
}

export default async function JobsPage() {
  const service = await createServiceClient()
  const { data } = await service
    .from('job_openings')
    .select('id, title, slug, intro, department, location, employment_type, hours_per_week, salary_min, salary_max, salary_period, show_salary')
    .eq('status', 'open')
    .contains('platforms', ['lenslab.nl'])
    .order('published_at', { ascending: false })
  const jobs = (data ?? []) as JobOpening[]
  const base = '/jobs'

  return (
    <div className="min-h-screen bg-[#FCFAFF]">
      <SiteNav />

      <section className="max-w-6xl mx-auto px-5 md:px-10 pt-14 pb-10">
        <p className="text-[11px] font-bold tracking-[0.15em] text-gray-400 uppercase mb-5">Jobs</p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 leading-[1.05] tracking-tight max-w-3xl mb-6"
          style={{ fontFamily: 'var(--font-dm-sans)' }}>
          Werk mee aan de kracht van sterke beelden.
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">
          Bij LensLab bouwen we aan het platform waar merken en beeldmakers elkaar vinden. Wil je meebouwen? Bekijk hieronder onze openstaande vacatures.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-5 md:px-10 pb-24">
        {!jobs.length ? (
          <div className="rounded-3xl bg-[#EEE8F8] text-center py-16 px-6">
            <p className="text-3xl mb-3">💼</p>
            <p className="text-gray-700 font-semibold">Er staan op dit moment geen vacatures open.</p>
            <p className="text-sm text-gray-500 mt-1">
              Toch interesse? Stuur een open sollicitatie naar{' '}
              <a href="mailto:hello@lenslab.nl" className="text-[#530095] underline">hello@lenslab.nl</a>.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => {
              const salary = formatSalary(job, 'nl')
              const meta = [job.department, job.location, employmentLabel(job.employment_type, 'nl'), job.hours_per_week && `${job.hours_per_week} uur/week`].filter(Boolean)
              return (
                <Link key={job.id} href={`${base}/${job.slug}`}
                  className="group flex flex-col sm:flex-row sm:items-center gap-4 bg-[#EEE8F8] hover:bg-[#E6DEEF] rounded-3xl p-6 sm:p-7 transition-colors">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg sm:text-xl font-black text-gray-900 leading-tight" style={{ fontFamily: 'var(--font-dm-sans)' }}>{job.title}</h2>
                    {job.intro && <p className="text-sm text-gray-600 leading-relaxed mt-2 line-clamp-2">{job.intro}</p>}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {meta.map((m) => (
                        <span key={m as string} className="text-[11px] font-semibold text-[#530095] bg-[#530095]/10 px-2.5 py-1 rounded-full">{m}</span>
                      ))}
                      {salary && <span className="text-[11px] font-semibold text-gray-700 bg-white px-2.5 py-1 rounded-full">{salary}</span>}
                    </div>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-[#530095] group-hover:translate-x-0.5 transition-transform">Bekijk vacature →</span>
                </Link>
              )
            })}
          </div>
        )}
      </section>

      <SiteFooter />
    </div>
  )
}
