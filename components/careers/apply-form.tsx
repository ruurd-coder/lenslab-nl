'use client'

// Copy of lenslab-b2b-saas/components/careers/apply-form.tsx. Applications
// are handled centrally by lenslab.tech/api/jobs/apply (stores them, emails
// the team and sends the applicant a confirmation).

import { useRef, useState } from 'react'

const COPY = {
  en: {
    title: 'Apply for this job',
    first: 'First name', last: 'Last name', email: 'Email', phone: 'Phone',
    linkedin: 'LinkedIn', portfolio: 'Portfolio / website', motivation: 'Why do you want to join LensLab?',
    cv: 'CV', cvHint: 'PDF or Word, max 4 MB', cvPick: 'Choose file', cvNone: 'No file chosen',
    consent: 'I agree that LensLab stores my details to process my application.',
    submit: 'Send application', sending: 'Sending…',
    optional: 'optional',
    doneTitle: 'Thanks for applying!',
    done: "We've received your application and sent you a confirmation by email. We'll get back to you as soon as possible.",
    tooBig: 'Your CV can be at most 4 MB.',
    error: 'Something went wrong. Please try again.',
  },
  nl: {
    title: 'Solliciteer op deze vacature',
    first: 'Voornaam', last: 'Achternaam', email: 'E-mail', phone: 'Telefoon',
    linkedin: 'LinkedIn', portfolio: 'Portfolio / website', motivation: 'Waarom wil je bij LensLab werken?',
    cv: 'Cv', cvHint: 'PDF of Word, max. 4 MB', cvPick: 'Kies bestand', cvNone: 'Geen bestand gekozen',
    consent: 'Ik ga ermee akkoord dat LensLab mijn gegevens bewaart om mijn sollicitatie te behandelen.',
    submit: 'Verstuur sollicitatie', sending: 'Versturen…',
    optional: 'optioneel',
    doneTitle: 'Bedankt voor je sollicitatie!',
    done: 'We hebben je sollicitatie ontvangen en je een bevestiging gemaild. We nemen zo snel mogelijk contact met je op.',
    tooBig: 'Je cv mag maximaal 4 MB zijn.',
    error: 'Er ging iets mis. Probeer het opnieuw.',
  },
}

const input = 'w-full border border-gray-200 rounded-xl px-4 py-3 text-[15px] bg-white focus:outline-none focus:border-[#530095] transition-colors'
const labelCls = 'block text-sm font-semibold text-gray-800 mb-1.5'

export default function ApplyForm({
  jobId,
  platform,
  lang,
  endpoint = process.env.NEXT_PUBLIC_JOBS_APPLY_URL || 'https://lenslab.tech/api/jobs/apply',
}: {
  jobId: string
  platform: 'lenslab.design' | 'lenslab.nl'
  lang: 'en' | 'nl'
  endpoint?: string
}) {
  const t = COPY[lang]
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const form = new FormData(e.currentTarget)
    const cv = form.get('cv')
    if (cv instanceof File && cv.size > 4 * 1024 * 1024) { setError(t.tooBig); return }
    form.set('job_id', jobId)
    form.set('platform', platform)
    setState('sending')
    try {
      const res = await fetch(endpoint, { method: 'POST', body: form })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) { setError(body.error || t.error); setState('idle'); return }
      setState('done')
    } catch {
      setError(t.error)
      setState('idle')
    }
  }

  if (state === 'done') {
    return (
      <div className="rounded-3xl bg-[#EEE8F8] p-8 text-center">
        <p className="text-3xl mb-3">🎉</p>
        <h3 className="text-xl font-black text-gray-900 mb-2">{t.doneTitle}</h3>
        <p className="text-[15px] text-gray-600 leading-relaxed">{t.done}</p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="rounded-3xl bg-white border border-gray-200 p-6 sm:p-8 space-y-4">
      <h3 className="text-xl font-black text-gray-900 mb-2">{t.title}</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls} htmlFor="first_name">{t.first} *</label>
          <input id="first_name" name="first_name" required autoComplete="given-name" className={input} />
        </div>
        <div>
          <label className={labelCls} htmlFor="last_name">{t.last} *</label>
          <input id="last_name" name="last_name" required autoComplete="family-name" className={input} />
        </div>
        <div>
          <label className={labelCls} htmlFor="email">{t.email} *</label>
          <input id="email" name="email" type="email" required autoComplete="email" className={input} />
        </div>
        <div>
          <label className={labelCls} htmlFor="phone">{t.phone} <span className="font-normal text-gray-400">({t.optional})</span></label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" className={input} />
        </div>
        <div>
          <label className={labelCls} htmlFor="linkedin_url">{t.linkedin} <span className="font-normal text-gray-400">({t.optional})</span></label>
          <input id="linkedin_url" name="linkedin_url" placeholder="linkedin.com/in/…" className={input} />
        </div>
        <div>
          <label className={labelCls} htmlFor="portfolio_url">{t.portfolio} <span className="font-normal text-gray-400">({t.optional})</span></label>
          <input id="portfolio_url" name="portfolio_url" className={input} />
        </div>
      </div>

      <div>
        <label className={labelCls} htmlFor="motivation">{t.motivation}</label>
        <textarea id="motivation" name="motivation" rows={5} className={`${input} resize-y`} />
      </div>

      <div>
        <span className={labelCls}>{t.cv} <span className="font-normal text-gray-400">({t.cvHint})</span></span>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => fileRef.current?.click()}
            className="shrink-0 text-sm font-semibold border border-gray-200 rounded-xl px-4 py-2.5 hover:border-gray-400 transition-colors">
            {t.cvPick}
          </button>
          <span className="text-sm text-gray-500 truncate">{fileName ?? t.cvNone}</span>
        </div>
        <input ref={fileRef} type="file" name="cv" accept=".pdf,.doc,.docx" className="hidden"
          onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)} />
      </div>

      {/* Honeypot */}
      <input type="text" name="company_website" tabIndex={-1} autoComplete="off" aria-hidden="true"
        className="absolute -left-[9999px] w-px h-px opacity-0" />

      <label className="flex items-start gap-2.5 text-sm text-gray-600 cursor-pointer">
        <input type="checkbox" required className="mt-1 accent-[#530095]" />
        <span>{t.consent}</span>
      </label>

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>}

      <button type="submit" disabled={state === 'sending'}
        className="w-full sm:w-auto bg-[#530095] text-white font-semibold text-[15px] px-7 py-3.5 rounded-full hover:bg-[#3d006e] transition-colors disabled:opacity-60">
        {state === 'sending' ? t.sending : t.submit}
      </button>
    </form>
  )
}
