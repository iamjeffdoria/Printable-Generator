import { useState } from 'react'

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

function codeSize(code) {
  const len = code.length
  if (len <= 3) return 34
  if (len <= 5) return 24
  return 16
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-neutral-500">
        {label}
      </span>
      {children}
    </label>
  )
}

const inputClass =
  'w-full border-2 border-black bg-white px-3 py-2 font-mono text-sm text-black outline-none focus:bg-neutral-100'

export default function App() {
  const [sign, setSign] = useState(INITIAL)
  const [theme, setTheme] = useState('light')

  const update = (key) => (e) => setSign((s) => ({ ...s, [key]: e.target.value }))
  const dark = theme === 'dark'

  return (
    <div className="min-h-screen bg-neutral-100 text-black print:min-h-0 print:bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 p-6 lg:flex-row">
        {/* Controls */}
        <aside className="w-full space-y-6 lg:w-96 print:hidden">
          <header>
            <h1 className="font-mono text-2xl font-bold tracking-tight">Sign.Print</h1>
            <p className="mt-1 text-sm text-neutral-600">
              Desk signs for people who live in the terminal.
            </p>
          </header>

          <section className="space-y-4">
            {Object.entries(PRESETS).map(([category, items]) => (
              <div key={category}>
                <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-neutral-500">
                  {category}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {items.map((p) => {
                    const active =
                      p.code === sign.code && p.title === sign.title && p.sub === sign.sub
                    return (
                      <button
                        key={p.code + p.title}
                        onClick={() => setSign(p)}
                        className={`border-2 border-black px-2.5 py-1 font-mono text-xs transition ${
                          active ? 'bg-black text-white' : 'bg-white hover:bg-neutral-200'
                        }`}
                      >
                        {p.code} {p.title}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </section>

          <section className="space-y-3">
            <Field label="Code">
              <input
                className={inputClass}
                value={sign.code}
                maxLength={8}
                onChange={update('code')}
              />
            </Field>
            <Field label="Title">
              <input
                className={inputClass}
                value={sign.title}
                maxLength={40}
                onChange={update('title')}
              />
            </Field>
            <Field label="Subtext">
              <input
                className={inputClass}
                value={sign.sub}
                maxLength={80}
                onChange={update('sub')}
              />
            </Field>
          </section>

          <section className="flex gap-2">
            {['light', 'dark'].map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`flex-1 border-2 border-black py-2 text-xs font-semibold uppercase tracking-widest ${
                  theme === t ? 'bg-black text-white' : 'bg-white hover:bg-neutral-200'
                }`}
              >
                {t}
              </button>
            ))}
          </section>

          <button
            onClick={() => window.print()}
            className="w-full border-2 border-black bg-black py-3 font-mono text-sm font-bold uppercase tracking-widest text-white transition hover:bg-white hover:text-black"
          >
            Print sign
          </button>
          <p className="text-xs text-neutral-500">
            Tip: choose Landscape and turn off “Headers and footers” in the print dialog.
          </p>
        </aside>

        {/* Live preview / print area */}
        <main className="flex flex-1 items-start justify-center print:block">
          <div
            className={`flex aspect-[11/8.5] w-full flex-col items-center justify-center border-4 border-black p-[4%] text-center shadow-[8px_8px_0_0_#000] print:fixed print:inset-0 print:aspect-auto print:border-0 print:shadow-none ${
              dark ? 'bg-black text-white' : 'bg-white text-black'
            }`}
            style={{ containerType: 'inline-size' }}
          >
            <div
              className="font-mono font-black leading-none tracking-tighter"
              style={{ fontSize: `${codeSize(sign.code)}cqw` }}
            >
              {sign.code || '—'}
            </div>
            <div
              className={`mt-[3cqw] h-[0.8cqw] w-[12cqw] ${dark ? 'bg-white' : 'bg-black'}`}
            />
            <div
              className="mt-[3cqw] font-mono font-bold uppercase tracking-tight"
              style={{ fontSize: '6cqw' }}
            >
              {sign.title}
            </div>
            <div
              className={`mt-[1.5cqw] font-mono ${dark ? 'text-neutral-300' : 'text-neutral-700'}`}
              style={{ fontSize: '2.6cqw' }}
            >
              {sign.sub}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}