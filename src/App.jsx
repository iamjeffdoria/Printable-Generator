import { useState } from 'react'
import {
  Terminal,
  Server,
  Zap,
  CalendarClock,
  Bug,
  Laptop,
  Sun,
  Moon,
  Printer,
  Shuffle,
  RotateCcw,
  Copy,
  Check,
  Hash,
  Type,
  AlignLeft,
  Palette,
  Sparkles,
  Eye,
  Pencil,
  Info,
} from 'lucide-react'

const PRESETS = {
  'Status Codes': [
    { code: '404', title: 'Focus Mode Active', sub: 'Interruption not found.' },
    { code: '503', title: 'Out of Order', sub: 'Service temporarily unavailable.' },
    { code: '200', title: 'In Flow State', sub: 'Everything is OK. Please keep it that way.' },
    { code: '418', title: 'I’m a Teapot', sub: 'Coffee requests will be declined.' },
    { code: '429', title: 'Too Many Requests', sub: 'Rate limit: one question per hour.' },
  ],
  'Focus & Flow': [
    { code: '>_', title: 'Deep Work', sub: 'Compiling. Please do not disturb.' },
    { code: 'DND', title: 'Do Not Disturb', sub: 'Shipping something. Back soon.' },
    { code: '{ }', title: 'Mid-Thought', sub: 'Context is loaded. Do not evict.' },
  ],
  Meetings: [
    { code: '302', title: 'Redirected to Calendar', sub: 'Book a slot. I will be there.' },
    { code: '408', title: 'Meeting Timeout', sub: 'Please wrap up and reconnect later.' },
    { code: '401', title: 'Unauthorized Interruption', sub: 'Credentials required: coffee.' },
  ],
  'Dev Humor': [
    { code: 'sudo', title: 'Ask Nicely', sub: 'Permission denied until you say please.' },
    { code: 'git', title: 'Not My Commit', sub: 'It worked on my machine.' },
    { code: 'rm -rf', title: 'Distractions', sub: 'Removing all interruptions recursively.' },
  ],
  'Remote Work': [
    { code: 'LIVE', title: 'On a Call', sub: 'Mic is hot. Please be quiet.' },
    { code: 'AFK', title: 'Back Soon', sub: 'Away from keyboard. Not from my job.' },
    { code: '504', title: 'Gateway Timeout', sub: 'Family or pet on camera. Retry later.' },
  ],
}

const INITIAL = PRESETS['Status Codes'][0]

const CATEGORY_ICONS = {
  'Status Codes': Server,
  'Focus & Flow': Zap,
  Meetings: CalendarClock,
  'Dev Humor': Bug,
  'Remote Work': Laptop,
}

function codeSize(code) {
  const len = code.length
  if (len <= 3) return 34
  if (len <= 5) return 24
  return 16
}

function Section({ icon: Icon, title, action, children }) {
  return (
    <section className="border-b-2 border-black p-4 last:border-b-0">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-500">
          <Icon size={14} />
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  )
}

function IconButton({ icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center border-2 border-black bg-white transition hover:bg-black hover:text-white active:translate-y-px"
    >
      <Icon size={14} />
    </button>
  )
}

function Field({ icon: Icon, label, hint, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-neutral-500">
        <span className="flex items-center gap-1.5">
          <Icon size={13} />
          {label}
        </span>
        <span className="font-mono normal-case tracking-normal">{hint}</span>
      </span>
      {children}
    </label>
  )
}

const inputClass =
  'w-full border-2 border-black bg-white px-3 py-2 font-mono text-sm text-black outline-none transition focus:bg-neutral-100 focus:shadow-[3px_3px_0_0_#000]'

export default function App() {
  const [sign, setSign] = useState(INITIAL)
  const [theme, setTheme] = useState('light')
  const [category, setCategory] = useState('Status Codes')
  const [copied, setCopied] = useState(false)

  const update = (key) => (e) => setSign((s) => ({ ...s, [key]: e.target.value }))
  const dark = theme === 'dark'

  const shuffle = () => {
    const all = Object.entries(PRESETS).flatMap(([cat, items]) =>
      items.map((p) => ({ cat, p })),
    )
    const { cat, p } = all[Math.floor(Math.random() * all.length)]
    setCategory(cat)
    setSign(p)
  }

  const reset = () => {
    setCategory('Status Codes')
    setSign(INITIAL)
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${sign.code} - ${sign.title}\n${sign.sub}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard unavailable
    }
  }

  return (
    <div className="min-h-dvh bg-neutral-100 text-black lg:h-dvh lg:overflow-hidden print:h-auto print:min-h-0 print:overflow-visible print:bg-white">
      <div className="mx-auto flex min-h-dvh max-w-7xl flex-col gap-4 p-4 sm:p-6 lg:h-full lg:min-h-0 lg:flex-row lg:gap-6 print:block print:h-auto print:p-0">
        {/* Controls */}
        <aside className="order-2 flex w-full flex-col border-2 border-black bg-white lg:order-1 lg:w-[380px] lg:shrink-0 lg:overflow-y-auto lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden print:hidden">
          <header className="flex items-center gap-3 border-b-2 border-black p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-black text-white">
              <Terminal size={20} />
            </div>
            <div className="min-w-0">
              <h1 className="font-mono text-xl font-bold leading-tight tracking-tight">
                Sign.Print
              </h1>
              <p className="text-xs text-neutral-600">
                Desk signs for people who live in the terminal.
              </p>
            </div>
          </header>

          <Section
            icon={Sparkles}
            title="Presets"
            action={
              <div className="flex gap-1.5">
                <IconButton icon={Shuffle} label="Random preset" onClick={shuffle} />
                <IconButton icon={RotateCcw} label="Reset" onClick={reset} />
              </div>
            }
          >
            <div className="mb-3 flex gap-1.5">
              {Object.keys(PRESETS).map((cat) => {
                const Icon = CATEGORY_ICONS[cat]
                return (
                  <button
                    key={cat}
                    type="button"
                    title={cat}
                    aria-label={cat}
                    aria-pressed={category === cat}
                    onClick={() => setCategory(cat)}
                    className={`flex h-9 flex-1 items-center justify-center border-2 border-black transition active:translate-y-px ${
                      category === cat ? 'bg-black text-white' : 'bg-white hover:bg-neutral-200'
                    }`}
                  >
                    <Icon size={16} />
                  </button>
                )
              })}
            </div>

            <p className="mb-2 font-mono text-xs font-bold uppercase tracking-widest">
              {category}
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
              {PRESETS[category].map((p) => {
                const active =
                  p.code === sign.code && p.title === sign.title && p.sub === sign.sub
                return (
                  <button
                    key={p.code + p.title}
                    type="button"
                    onClick={() => setSign(p)}
                    className={`flex items-center gap-3 border-2 border-black px-3 py-2 text-left font-mono text-xs transition active:translate-y-px ${
                      active
                        ? 'bg-black text-white'
                        : 'bg-white hover:bg-neutral-100 hover:shadow-[3px_3px_0_0_#000]'
                    }`}
                  >
                    <span
                      className={`min-w-12 border px-1.5 py-0.5 text-center font-black ${
                        active ? 'border-white' : 'border-black'
                      }`}
                    >
                      {p.code}
                    </span>
                    <span className="truncate">{p.title}</span>
                  </button>
                )
              })}
            </div>
          </Section>

          <Section icon={Pencil} title="Customize">
            <div className="space-y-3">
              <Field icon={Hash} label="Code" hint={`${sign.code.length}/8`}>
                <input
                  className={inputClass}
                  value={sign.code}
                  maxLength={8}
                  onChange={update('code')}
                />
              </Field>
              <Field icon={Type} label="Title" hint={`${sign.title.length}/40`}>
                <input
                  className={inputClass}
                  value={sign.title}
                  maxLength={40}
                  onChange={update('title')}
                />
              </Field>
              <Field icon={AlignLeft} label="Subtext" hint={`${sign.sub.length}/80`}>
                <input
                  className={inputClass}
                  value={sign.sub}
                  maxLength={80}
                  onChange={update('sub')}
                />
              </Field>
            </div>
          </Section>

          <Section icon={Palette} title="Appearance">
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'light', label: 'Light', icon: Sun },
                { id: 'dark', label: 'Dark', icon: Moon },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={theme === id}
                  onClick={() => setTheme(id)}
                  className={`flex items-center justify-center gap-2 border-2 border-black py-2 text-xs font-semibold uppercase tracking-widest transition active:translate-y-px ${
                    theme === id ? 'bg-black text-white' : 'bg-white hover:bg-neutral-200'
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </div>
          </Section>

          <Section icon={Printer} title="Export">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex flex-1 items-center justify-center gap-2 border-2 border-black bg-black py-3 font-mono text-sm font-bold uppercase tracking-widest text-white transition hover:bg-white hover:text-black active:translate-y-px"
              >
                <Printer size={18} />
                Print sign
              </button>
              <button
                type="button"
                onClick={copy}
                title="Copy text"
                aria-label="Copy text"
                className="flex w-12 items-center justify-center border-2 border-black bg-white transition hover:bg-neutral-200 active:translate-y-px"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>
            <p className="mt-3 flex items-start gap-2 text-xs text-neutral-500">
              <Info size={14} className="mt-0.5 shrink-0" />
              Choose Landscape and turn off “Headers and footers” in the print dialog.
            </p>
          </Section>
        </aside>

        {/* Live preview / print area */}
        <main className="order-1 flex min-h-0 flex-1 flex-col gap-3 lg:order-2 print:block">
          <div className="flex items-center justify-between border-2 border-black bg-white px-4 py-2 print:hidden">
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
              <Eye size={14} />
              Live preview
            </span>
            <span className="font-mono text-xs text-neutral-500">11 × 8.5 in · Landscape</span>
          </div>

          <div className="flex min-h-0 flex-1 items-center justify-center border-2 border-dashed border-neutral-400 p-4 sm:p-6 print:block print:border-0 print:p-0">
            <div
              className={`flex aspect-[11/8.5] w-full flex-col items-center justify-center border-4 border-black p-[4%] text-center shadow-[4px_4px_0_0_#000] transition-colors sm:shadow-[8px_8px_0_0_#000] lg:w-[min(100%,calc((100dvh-13rem)*1.294))] print:fixed print:inset-0 print:aspect-auto print:w-screen! print:max-w-none print:border-0 print:shadow-none ${
                dark ? 'bg-black text-white' : 'bg-white text-black'
              }`}
              style={{ containerType: 'inline-size' }}
            >
              <div
                className="max-w-full font-mono font-black leading-none tracking-tighter"
                style={{ fontSize: `${codeSize(sign.code)}cqw` }}
              >
                {sign.code || '—'}
              </div>
              <div
                className={`mt-[3cqw] h-[0.8cqw] min-h-0.5 w-[12cqw] ${dark ? 'bg-white' : 'bg-black'}`}
              />
              <div
                className="mt-[3cqw] max-w-full wrap-break-word font-mono font-bold uppercase tracking-tight"
                style={{ fontSize: 'max(6cqw, 14px)' }}
              >
                {sign.title}
              </div>
              <div
                className={`mt-[1.5cqw] max-w-full wrap-break-word font-mono ${
                  dark ? 'text-neutral-300' : 'text-neutral-700'
                }`}
                style={{ fontSize: 'max(2.6cqw, 11px)' }}
              >
                {sign.sub}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}