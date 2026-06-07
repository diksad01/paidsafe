const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className="mb-16 animate-fade-up">
    <div className="flex items-center gap-4 mb-8">
      <h2 className="font-display text-xl font-bold text-brand-text-primary">{title}</h2>
      <div className="flex-1 h-px bg-brand-border" />
    </div>
    {children}
  </section>
);

const TokenSwatch = ({
  color,
  label,
  textClass,
}: {
  color: string;
  label: string;
  textClass?: string;
}) => (
  <div className="flex flex-col gap-2">
    <div
      className="h-14 rounded-xl border border-brand-border shadow-card"
      style={{ backgroundColor: color }}
    />
    <div>
      <p className={`text-xs font-semibold ${textClass ?? "text-brand-text-primary"}`}>
        {label}
      </p>
      <p className="text-2xs text-brand-text-secondary font-mono">{color}</p>
    </div>
  </div>
);

const DesignSystem = () => {
  return (
    <div className="min-h-screen bg-brand-bg">
      <header className="bg-brand-primary border-b border-brand-border sticky top-0 z-50">
        <div className="page-container py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-accent rounded-xl flex items-center justify-center">
              <span className="text-white font-display font-bold text-xs">PS</span>
            </div>
            <div>
              <span className="font-display font-bold text-white text-base">PaidSafe</span>
              <span className="ml-2 badge badge-accent text-2xs">Design System</span>
            </div>
          </div>
          <span className="text-brand-text-secondary text-xs font-mono">v1.0.0</span>
        </div>
      </header>

      <div className="page-container py-12 sm:py-16">

        <div className="mb-16">
          <p className="text-brand-text-secondary text-xs font-mono uppercase tracking-widest mb-3">
            Foundation
          </p>
          <h1 className="section-title mb-3">Design Tokens</h1>
          <p className="section-subtitle max-w-xl">
            The visual language of PaidSafe. Every color, size, and shadow is intentional and consistent.
          </p>
        </div>

        <Section title="Color Palette">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            <TokenSwatch color="#2D3748" label="Primary" />
            <TokenSwatch color="#6C63FF" label="Accent" />
            <TokenSwatch color="#EEF0FF" label="Accent Light" />
            <TokenSwatch color="#FFFFFF" label="Background" />
            <TokenSwatch color="#F7F8FA" label="Card BG" />
            <TokenSwatch color="#1A202C" label="Text Primary" />
            <TokenSwatch color="#718096" label="Text Secondary" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-4">
            <TokenSwatch color="#38A169" label="Success" />
            <TokenSwatch color="#F0FFF4" label="Success Light" />
            <TokenSwatch color="#D69E2E" label="Warning" />
            <TokenSwatch color="#FFFFF0" label="Warning Light" />
            <TokenSwatch color="#E53E3E" label="Danger" />
            <TokenSwatch color="#FFF5F5" label="Danger Light" />
          </div>
        </Section>

        <Section title="Typography">
          <div className="card card-body space-y-6">
            <div className="space-y-1">
              <p className="hint-text font-mono">font-display / Syne — Display</p>
              <p className="font-display text-4xl font-bold text-brand-text-primary">
                Secure payments, zero stress.
              </p>
            </div>
            <div className="divider" />
            <div className="space-y-1">
              <p className="hint-text font-mono">font-display / Syne — Heading</p>
              <h2 className="font-display text-2xl font-semibold text-brand-text-primary">
                Contract Dashboard
              </h2>
            </div>
            <div className="divider" />
            <div className="space-y-1">
              <p className="hint-text font-mono">font-sans / DM Sans — Body</p>
              <p className="text-brand-text-secondary leading-relaxed max-w-prose">
                PaidSafe holds client funds in escrow until milestones are approved. Freelancers
                get paid on time, every time — without chasing invoices or worrying about disputes.
              </p>
            </div>
            <div className="divider" />
            <div className="space-y-1">
              <p className="hint-text font-mono">font-mono / DM Mono — Amounts</p>
              <p className="amount-large">$12,450.00</p>
            </div>
          </div>
        </Section>

        <Section title="Buttons">
          <div className="card card-body space-y-8">
            <div>
              <p className="label-base mb-4">Variants</p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                <button className="btn-primary">Primary Action</button>
                <button className="btn-secondary">Secondary</button>
                <button className="btn-ghost">Ghost</button>
                <button className="btn-danger">Destructive</button>
                <button className="btn-success">Confirm</button>
              </div>
            </div>

            <div className="divider" />

            <div>
              <p className="label-base mb-4">Sizes</p>
              <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3">
                <button className="btn-primary btn-lg">Large</button>
                <button className="btn-primary">Default</button>
                <button className="btn-primary btn-sm">Small</button>
              </div>
            </div>

            <div className="divider" />

            <div>
              <p className="label-base mb-4">With Icons</p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                <button className="btn-primary">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  New Contract
                </button>
                <button className="btn-secondary">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export
                </button>
                <button className="btn-icon btn-ghost" aria-label="Settings">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="divider" />

            <div>
              <p className="label-base mb-4">States</p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                <button className="btn-primary" disabled>Disabled</button>
                <button className="btn-primary opacity-75 cursor-wait">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Processing...
                </button>
                <button className="btn-success">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  Approved
                </button>
              </div>
            </div>
          </div>
        </Section>

        <Section title="Form Inputs">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card card-body space-y-5">
              <h3 className="font-display font-semibold text-base text-brand-text-primary">
                Standard Fields
              </h3>

              <div className="field-group">
                <label className="label-base">
                  Contract Title
                </label>
                <input
                  className="input-base"
                  type="text"
                  placeholder="e.g. Brand Identity Design"
                />
              </div>

              <div className="field-group">
                <label className="label-base">
                  Client Email
                  <span className="label-optional">(optional)</span>
                </label>
                <input
                  className="input-base"
                  type="email"
                  placeholder="client@company.com"
                />
                <p className="hint-text">We'll send contract terms to this address.</p>
              </div>

              <div className="field-group">
                <label className="label-base">Category</label>
                <select className="select-base">
                  <option value="">Select a category</option>
                  <option>Design</option>
                  <option>Development</option>
                  <option>Marketing</option>
                  <option>Consulting</option>
                </select>
              </div>

              <div className="field-group">
                <label className="label-base">Scope of Work</label>
                <textarea
                  className="textarea-base"
                  rows={3}
                  placeholder="Describe deliverables and expectations..."
                />
              </div>
            </div>

            <div className="card card-body space-y-5">
              <h3 className="font-display font-semibold text-base text-brand-text-primary">
                States & Addons
              </h3>

              <div className="field-group">
                <label className="label-base">Contract Value</label>
                <div className="flex">
                  <span className="input-prefix">USD</span>
                  <input
                    className="input-with-prefix"
                    type="number"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="field-group">
                <label className="label-base">Website</label>
                <div className="flex">
                  <input
                    className="input-with-suffix"
                    type="text"
                    placeholder="yourname"
                  />
                  <span className="input-suffix">.paidsafe.io</span>
                </div>
              </div>

              <div className="field-group">
                <label className="label-base">Success State</label>
                <input
                  className="input-success"
                  type="text"
                  defaultValue="Brand Identity — Acme Corp"
                />
                <p className="text-xs text-brand-success mt-1.5 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  Looks good!
                </p>
              </div>

              <div className="field-group">
                <label className="label-base">Error State</label>
                <input
                  className="input-error"
                  type="email"
                  defaultValue="not-an-email"
                />
                <p className="error-text">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Please enter a valid email address.
                </p>
              </div>

              <div className="field-group">
                <label className="label-base">Disabled</label>
                <input
                  className="input-base"
                  type="text"
                  defaultValue="Read-only value"
                  disabled
                />
              </div>
            </div>
          </div>
        </Section>

        <Section title="Cards">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="card card-body">
              <p className="hint-text font-mono mb-2">.card</p>
              <h3 className="font-display font-semibold text-brand-text-primary mb-1">
                Standard Card
              </h3>
              <p className="text-brand-text-secondary text-xs leading-relaxed">
                Default card with subtle border and shadow. Use for most content containers.
              </p>
            </div>

            <div className="card-flat card-body">
              <p className="hint-text font-mono mb-2">.card-flat</p>
              <h3 className="font-display font-semibold text-brand-text-primary mb-1">
                Flat Card
              </h3>
              <p className="text-brand-text-secondary text-xs leading-relaxed">
                No shadow, filled background. Use for nested containers or secondary sections.
              </p>
            </div>

            <div className="card-accent card-body">
              <p className="hint-text font-mono mb-2">.card-accent</p>
              <h3 className="font-display font-semibold text-brand-accent mb-1">
                Accent Card
              </h3>
              <p className="text-brand-accent text-xs leading-relaxed opacity-80">
                Indigo-tinted background for highlighted information or calls to action.
              </p>
            </div>

            <div className="card-success card-body">
              <p className="hint-text font-mono mb-2">.card-success</p>
              <h3 className="font-display font-semibold text-brand-success mb-1">
                Success Card
              </h3>
              <p className="text-brand-success text-xs opacity-80">
                For confirmations, completed states, or positive metrics.
              </p>
            </div>

            <div className="card-warning card-body">
              <p className="hint-text font-mono mb-2">.card-warning</p>
              <h3 className="font-display font-semibold text-brand-warning mb-1">
                Warning Card
              </h3>
              <p className="text-brand-warning text-xs opacity-80">
                Pending actions or items needing attention.
              </p>
            </div>

            <div className="card-danger card-body">
              <p className="hint-text font-mono mb-2">.card-danger</p>
              <h3 className="font-display font-semibold text-brand-danger mb-1">
                Danger Card
              </h3>
              <p className="text-brand-danger text-xs opacity-80">
                Errors, overdue items, or destructive action warnings.
              </p>
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className="card-header">
              <div>
                <p className="hint-text font-mono mb-0.5">.card-header / .card-body / .card-footer</p>
                <h3 className="font-display font-semibold text-brand-text-primary">
                  Structured Card
                </h3>
              </div>
              <button className="btn-secondary btn-sm">View all</button>
            </div>
            <div className="card-body">
              <p className="text-brand-text-secondary text-sm">
                Cards with header, body, and footer sections create consistent, scannable layouts
                across dashboards and list views.
              </p>
            </div>
            <div className="card-footer">
              <span className="text-xs text-brand-text-secondary">Last updated 2 min ago</span>
              <button className="btn-primary btn-sm">Save changes</button>
            </div>
          </div>
        </Section>

        <Section title="Stat Cards">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total in Escrow", value: "$48,200", delta: "+12%", positive: true },
              { label: "Active Contracts", value: "24", delta: "+3", positive: true },
              { label: "Released This Month", value: "$18,750", delta: "+8%", positive: true },
              { label: "Disputed", value: "2", delta: "+1", positive: false },
            ].map((stat) => (
              <div key={stat.label} className="stat-card">
                <p className="text-2xs font-semibold text-brand-text-secondary uppercase tracking-wider">
                  {stat.label}
                </p>
                <p className="amount-large text-2xl mt-1">{stat.value}</p>
                <p
                  className={`text-xs font-medium mt-1 ${
                    stat.positive ? "text-brand-success" : "text-brand-danger"
                  }`}
                >
                  {stat.delta} vs last month
                </p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Badges & Status">
          <div className="card card-body space-y-6">
            <div>
              <p className="label-base mb-3">Badge Variants</p>
              <div className="flex flex-wrap gap-2">
                <span className="badge-accent">Active</span>
                <span className="badge-success">Completed</span>
                <span className="badge-warning">Pending</span>
                <span className="badge-danger">Overdue</span>
                <span className="badge-neutral">Draft</span>
                <span className="badge-primary">New</span>
              </div>
            </div>

            <div className="divider" />

            <div>
              <p className="label-base mb-3">Status Dots</p>
              <div className="flex flex-wrap gap-5">
                {[
                  { cls: "dot-active", label: "Active" },
                  { cls: "dot-pending", label: "Pending" },
                  { cls: "dot-danger", label: "Overdue" },
                  { cls: "dot-inactive", label: "Inactive" },
                ].map((s) => (
                  <div key={s.label} className="flex items-center gap-2">
                    <span className={s.cls} />
                    <span className="text-xs text-brand-text-secondary">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="divider" />

            <div>
              <p className="label-base mb-3">Tags</p>
              <div className="flex flex-wrap gap-2">
                {["Design", "Q2 2024", "Milestone 3", "High Priority", "Retainer"].map((t) => (
                  <span key={t} className="tag">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </Section>

        <Section title="Avatars & Progress">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card card-body space-y-5">
              <p className="label-base">Avatar Sizes</p>
              <div className="flex items-end gap-4">
                <div className="flex flex-col items-center gap-2">
                  <div className="avatar-sm"><span>AC</span></div>
                  <span className="text-2xs text-brand-text-secondary">sm</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="avatar-md"><span>AC</span></div>
                  <span className="text-2xs text-brand-text-secondary">md</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="avatar-lg"><span>AC</span></div>
                  <span className="text-2xs text-brand-text-secondary">lg</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="avatar-xl"><span>AC</span></div>
                  <span className="text-2xs text-brand-text-secondary">xl</span>
                </div>
              </div>
            </div>

            <div className="card card-body space-y-5">
              <p className="label-base">Progress Bars</p>
              <div className="space-y-4">
                {[
                  { label: "Milestone 1 — Logo concepts", pct: 100, color: "bg-brand-success" },
                  { label: "Milestone 2 — Brand kit", pct: 65, color: "bg-brand-accent" },
                  { label: "Milestone 3 — Guidelines", pct: 20, color: "bg-brand-warning" },
                ].map((p) => (
                  <div key={p.label}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-xs text-brand-text-secondary">{p.label}</span>
                      <span className="text-xs font-semibold text-brand-text-primary font-mono">{p.pct}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className={`progress-fill ${p.color}`} style={{ width: `${p.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        <Section title="Data Table">
          <div className="card overflow-hidden">
            <div className="card-header">
              <h3 className="font-display font-semibold text-brand-text-primary">Recent Contracts</h3>
              <button className="btn-primary btn-sm">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New
              </button>
            </div>
            <div className="overflow-x-auto scrollbar-hide">
              <table className="table-base">
                <thead>
                  <tr>
                    {["Contract", "Client", "Value", "Status", "Date"].map((h) => (
                      <th key={h} className="table-head">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[].map((row: any) => (
                    <tr key={row.title} className="table-row">
                      <td className="table-cell font-medium">{row.title}</td>
                      <td className="table-cell text-brand-text-secondary">{row.client}</td>
                      <td className="table-cell amount-display">{row.value}</td>
                      <td className="table-cell">
                        <span className={
                          row.status === "active" ? "badge-accent" :
                          row.status === "completed" ? "badge-success" : "badge-warning"
                        }>
                          {row.status}
                        </span>
                      </td>
                      <td className="table-cell text-brand-text-secondary">{row.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Section>

        <Section title="Skeleton Loaders">
          <div className="card card-body space-y-4">
            <div className="flex items-center gap-4">
              <div className="skeleton w-10 h-10 rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-4 rounded w-2/5" />
                <div className="skeleton h-3 rounded w-1/4" />
              </div>
              <div className="skeleton h-6 w-16 rounded-full" />
            </div>
            <div className="skeleton h-px w-full" />
            <div className="space-y-2">
              <div className="skeleton h-3 rounded w-full" />
              <div className="skeleton h-3 rounded w-5/6" />
              <div className="skeleton h-3 rounded w-4/6" />
            </div>
            <div className="flex gap-3 pt-2">
              <div className="skeleton h-9 rounded-xl flex-1" />
              <div className="skeleton h-9 rounded-xl w-24" />
            </div>
          </div>
        </Section>

        <Section title="Dividers">
          <div className="card card-body space-y-6">
            <div>
              <p className="label-base mb-3">Standard Divider</p>
              <div className="divider" />
            </div>
            <div>
              <p className="label-base mb-3">Divider with Label</p>
              <p className="divider-label">or continue with</p>
            </div>
          </div>
        </Section>

      </div>
    </div>
  );
};

export default DesignSystem;