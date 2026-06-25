import { useState } from "react";

const STEPS = [
  { id: "type", label: "Lead Type" },
  { id: "contact", label: "Contact Info" },
  { id: "details", label: "Details" },
  { id: "timeline", label: "Timeline" },
  { id: "confirm", label: "Confirm" },
];

const STAGE_MAP = {
  buyer: "Inquired",
  seller: "Inquired",
  both: "Inquired",
  investor: "Inquired",
};

const TAG_MAP = {
  buyer: ["Buyer"],
  seller: ["Seller"],
  both: ["Buyer", "Seller"],
  investor: ["Investor", "Buyer"],
};

const SOURCE_OPTIONS = [
  "Facebook Ad",
  "Instagram Ad",
  "Referral",
  "Cold Call",
  "Website",
  "Open House",
  "Other",
];

const TIMELINE_OPTIONS = [
  { value: "0-30", label: "Ready now (0–30 days)", tag: "Hot" },
  { value: "30-90", label: "Soon (30–90 days)", tag: "Warm" },
  { value: "90-180", label: "Planning ahead (3–6 months)", tag: "Nurture" },
  { value: "180+", label: "Exploring (6+ months)", tag: "Long-Term" },
];

const PRICE_RANGES = [
  "Under $500K",
  "$500K – $750K",
  "$750K – $1M",
  "$1M – $1.5M",
  "$1.5M+",
  "Not sure yet",
];

const APPROVAL_OPTIONS = [
  "Yes, pre-approved",
  "In process",
  "Not yet — needs lender referral",
  "Cash buyer",
  "N/A (Seller)",
];

function ProgressBar({ current }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: "2rem" }}>
      {STEPS.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={s.id} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : "none" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: done ? "#1B3A5C" : active ? "#2E75B6" : "var(--color-background-secondary)",
                border: active ? "2px solid #2E75B6" : done ? "2px solid #1B3A5C" : "1.5px solid var(--color-border-tertiary)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 500,
                color: done || active ? "#fff" : "var(--color-text-tertiary)",
                transition: "all 0.2s",
              }}>
                {done ? <i className="ti ti-check" style={{ fontSize: 13 }} /> : i + 1}
              </div>
              <span style={{ fontSize: 10, color: active ? "#2E75B6" : "var(--color-text-tertiary)", whiteSpace: "nowrap", fontWeight: active ? 500 : 400 }}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ flex: 1, height: 1.5, background: done ? "#1B3A5C" : "var(--color-border-tertiary)", margin: "0 6px", marginBottom: 18, transition: "background 0.3s" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function ChoiceCard({ label, sub, icon, selected, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      gap: 8, padding: "1.25rem 1rem",
      border: selected ? "2px solid #2E75B6" : "1.5px solid var(--color-border-tertiary)",
      borderRadius: "var(--border-radius-lg)",
      background: selected ? "#EBF3FC" : "var(--color-background-primary)",
      cursor: "pointer", transition: "all 0.15s", flex: 1, minWidth: 100,
    }}>
      <i className={`ti ${icon}`} style={{ fontSize: 22, color: selected ? "#2E75B6" : "var(--color-text-secondary)" }} aria-hidden="true" />
      <span style={{ fontSize: 14, fontWeight: 500, color: selected ? "#1B3A5C" : "var(--color-text-primary)" }}>{label}</span>
      {sub && <span style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>{sub}</span>}
    </button>
  );
}

function Field({ label, required, children }) {
  return (
    <div style={{ marginBottom: "1.1rem" }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 5 }}>
        {label}{required && <span style={{ color: "#E24B4A", marginLeft: 3 }}>*</span>}
      </label>
      {children}
    </div>
  );
}

function Input({ ...props }) {
  return <input {...props} style={{ width: "100%", boxSizing: "border-box", ...props.style }} />;
}

function Select({ children, ...props }) {
  return <select {...props} style={{ width: "100%", boxSizing: "border-box", ...props.style }}>{children}</select>;
}

function StatusBadge({ status, message }) {
  const colors = {
    success: { bg: "var(--color-background-success)", border: "var(--color-border-success)", text: "var(--color-text-success)" },
    error: { bg: "var(--color-background-danger)", border: "var(--color-border-danger)", text: "var(--color-text-danger)" },
    loading: { bg: "var(--color-background-info)", border: "var(--color-border-info)", text: "var(--color-text-info)" },
  };
  const c = colors[status];
  return (
    <div style={{ padding: "0.75rem 1rem", borderRadius: "var(--border-radius-md)", background: c.bg, border: `1px solid ${c.border}`, color: c.text, fontSize: 14, display: "flex", alignItems: "center", gap: 8, marginBottom: "1rem" }}>
      <i className={`ti ${status === "success" ? "ti-circle-check" : status === "error" ? "ti-alert-circle" : "ti-loader-2"}`} style={{ fontSize: 16 }} aria-hidden="true" />
      {message}
    </div>
  );
}

export default function LeadIntakeForm() {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    leadType: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    source: "",
    referredBy: "",
    // Buyer fields
    targetAreas: "",
    priceRange: "",
    preApproval: "",
    mustHaves: "",
    // Seller fields
    propertyAddress: "",
    yearsOwned: "",
    propertyType: "",
    priceExpectation: "",
    condition: "",
    // Shared
    motivation: "",
    timeline: "",
    notes: "",
    apiKey: "",
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const isBuyer = ["buyer", "both", "investor"].includes(form.leadType);
  const isSeller = ["seller", "both"].includes(form.leadType);

  const timelineObj = TIMELINE_OPTIONS.find(t => t.value === form.timeline);
  const hotTag = timelineObj?.tag || "";
  const tags = [...(TAG_MAP[form.leadType] || []), ...(hotTag ? [hotTag] : [])];

  async function submitToFUB() {
    setSubmitting(true);
    setSubmitStatus(null);

    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      emails: form.email ? [{ value: form.email, type: "work" }] : [],
      phones: form.phone ? [{ value: form.phone, type: "mobile" }] : [],
      stage: STAGE_MAP[form.leadType] || "Inquired",
      source: form.source || "Other",
      tags: tags,
      notes: buildNotes(),
    };

    try {
      const res = await fetch("https://api.followupboss.com/v1/people", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Basic " + btoa(form.apiKey + ":"),
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSubmitStatus({ type: "success", message: "Lead successfully added to Follow Up Boss!" });
        setSubmitted(true);
      } else {
        const err = await res.json();
        setSubmitStatus({ type: "error", message: `FUB error: ${err.message || res.status}. Check your API key and try again.` });
      }
    } catch (e) {
      setSubmitStatus({ type: "error", message: "Could not reach Follow Up Boss. Check your API key and network connection." });
    }
    setSubmitting(false);
  }

  function buildNotes() {
    const lines = [];
    lines.push(`=== INTAKE FORM — ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} ===`);
    lines.push(`Lead Type: ${form.leadType.charAt(0).toUpperCase() + form.leadType.slice(1)}`);
    lines.push(`Source: ${form.source}${form.referredBy ? ` (Referred by: ${form.referredBy})` : ""}`);
    lines.push(`Timeline: ${timelineObj?.label || form.timeline}`);
    lines.push(`FUB Tags: ${tags.join(", ")}`);
    lines.push("");
    if (isBuyer) {
      lines.push("--- BUYER INFO ---");
      if (form.targetAreas) lines.push(`Target Areas: ${form.targetAreas}`);
      if (form.priceRange) lines.push(`Price Range: ${form.priceRange}`);
      if (form.preApproval) lines.push(`Pre-Approval: ${form.preApproval}`);
      if (form.mustHaves) lines.push(`Must-Haves: ${form.mustHaves}`);
    }
    if (isSeller) {
      lines.push("--- SELLER INFO ---");
      if (form.propertyAddress) lines.push(`Property: ${form.propertyAddress}`);
      if (form.yearsOwned) lines.push(`Years Owned: ${form.yearsOwned}`);
      if (form.propertyType) lines.push(`Type: ${form.propertyType}`);
      if (form.priceExpectation) lines.push(`Price Expectation: ${form.priceExpectation}`);
      if (form.condition) lines.push(`Condition: ${form.condition}`);
    }
    if (form.motivation) { lines.push(""); lines.push(`Motivation: ${form.motivation}`); }
    if (form.notes) { lines.push(""); lines.push(`Additional Notes: ${form.notes}`); }
    lines.push("");
    lines.push("— Submitted via Alvarez & Associates Lead Intake Form");
    return lines.join("\n");
  }

  function canAdvance() {
    if (step === 0) return !!form.leadType;
    if (step === 1) return form.firstName && form.lastName && (form.email || form.phone);
    if (step === 2) return true;
    if (step === 3) return !!form.timeline;
    if (step === 4) return !!form.apiKey;
    return true;
  }

  const stepContent = [
    // STEP 0: Lead Type
    <div key="type">
      <p style={{ fontSize: 14, color: "var(--color-text-secondary)", marginBottom: "1.25rem" }}>
        What best describes this lead?
      </p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {[
          { v: "buyer", label: "Buyer", icon: "ti-key", sub: "Looking to purchase" },
          { v: "seller", label: "Seller", icon: "ti-home-dollar", sub: "Looking to sell" },
          { v: "both", label: "Buy + Sell", icon: "ti-arrows-exchange", sub: "Both sides" },
          { v: "investor", label: "Investor", icon: "ti-trending-up", sub: "Investment purchase" },
        ].map(opt => (
          <ChoiceCard key={opt.v} label={opt.label} sub={opt.sub} icon={opt.icon} selected={form.leadType === opt.v} onClick={() => set("leadType", opt.v)} />
        ))}
      </div>
    </div>,

    // STEP 1: Contact Info
    <div key="contact">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px" }}>
        <Field label="First name" required><Input type="text" value={form.firstName} onChange={e => set("firstName", e.target.value)} placeholder="Maria" /></Field>
        <Field label="Last name" required><Input type="text" value={form.lastName} onChange={e => set("lastName", e.target.value)} placeholder="Gonzalez" /></Field>
      </div>
      <Field label="Email address"><Input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="maria@email.com" /></Field>
      <Field label="Phone number"><Input type="tel" value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="(510) 555-0100" /></Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px" }}>
        <Field label="Lead source">
          <Select value={form.source} onChange={e => set("source", e.target.value)}>
            <option value="">Select source…</option>
            {SOURCE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </Select>
        </Field>
        {form.source === "Referral" && (
          <Field label="Referred by"><Input type="text" value={form.referredBy} onChange={e => set("referredBy", e.target.value)} placeholder="Name of referral" /></Field>
        )}
      </div>
    </div>,

    // STEP 2: Details
    <div key="details">
      {isBuyer && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "0.75rem" }}>
            <i className="ti ti-key" style={{ fontSize: 15, color: "#2E75B6" }} aria-hidden="true" />
            <span style={{ fontSize: 13, fontWeight: 500, color: "#2E75B6" }}>Buyer details</span>
          </div>
          <Field label="Target areas / neighborhoods">
            <Input type="text" value={form.targetAreas} onChange={e => set("targetAreas", e.target.value)} placeholder="e.g. Walnut Creek, Concord, Pleasant Hill" />
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px" }}>
            <Field label="Price range">
              <Select value={form.priceRange} onChange={e => set("priceRange", e.target.value)}>
                <option value="">Select…</option>
                {PRICE_RANGES.map(r => <option key={r} value={r}>{r}</option>)}
              </Select>
            </Field>
            <Field label="Pre-approval status">
              <Select value={form.preApproval} onChange={e => set("preApproval", e.target.value)}>
                <option value="">Select…</option>
                {APPROVAL_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </Select>
            </Field>
          </div>
          <Field label="Must-haves / specific needs">
            <textarea value={form.mustHaves} onChange={e => set("mustHaves", e.target.value)} rows={2} placeholder="e.g. 3 bed, 2 bath, garage, good school district, backyard" style={{ width: "100%", boxSizing: "border-box", resize: "vertical" }} />
          </Field>
        </>
      )}
      {isSeller && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "0.75rem", marginTop: isBuyer ? "1rem" : 0 }}>
            <i className="ti ti-home-dollar" style={{ fontSize: 15, color: "#2E75B6" }} aria-hidden="true" />
            <span style={{ fontSize: 13, fontWeight: 500, color: "#2E75B6" }}>Seller details</span>
          </div>
          <Field label="Property address">
            <Input type="text" value={form.propertyAddress} onChange={e => set("propertyAddress", e.target.value)} placeholder="1234 Oak St, Walnut Creek, CA 94596" />
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 12px" }}>
            <Field label="Years owned">
              <Input type="number" min="0" value={form.yearsOwned} onChange={e => set("yearsOwned", e.target.value)} placeholder="e.g. 8" />
            </Field>
            <Field label="Property type">
              <Select value={form.propertyType} onChange={e => set("propertyType", e.target.value)}>
                <option value="">Select…</option>
                {["Single Family", "Condo / Townhome", "Multi-Family", "Land", "Other"].map(t => <option key={t} value={t}>{t}</option>)}
              </Select>
            </Field>
            <Field label="Condition">
              <Select value={form.condition} onChange={e => set("condition", e.target.value)}>
                <option value="">Select…</option>
                {["Move-in ready", "Minor updates needed", "Fixer-upper", "Unknown"].map(c => <option key={c} value={c}>{c}</option>)}
              </Select>
            </Field>
          </div>
          <Field label="Price expectation">
            <Input type="text" value={form.priceExpectation} onChange={e => set("priceExpectation", e.target.value)} placeholder="e.g. $850,000 or 'not sure yet'" />
          </Field>
        </>
      )}
      <Field label="Motivation for moving">
        <textarea value={form.motivation} onChange={e => set("motivation", e.target.value)} rows={2} placeholder="e.g. Upsizing for growing family, relocating for work, downsizing after kids moved out…" style={{ width: "100%", boxSizing: "border-box", resize: "vertical" }} />
      </Field>
    </div>,

    // STEP 3: Timeline
    <div key="timeline">
      <p style={{ fontSize: 14, color: "var(--color-text-secondary)", marginBottom: "1.25rem" }}>
        When is {form.firstName || "this lead"} looking to make a move?
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {TIMELINE_OPTIONS.map(opt => (
          <button key={opt.value} onClick={() => set("timeline", opt.value)} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "0.875rem 1rem",
            border: form.timeline === opt.value ? "2px solid #2E75B6" : "1.5px solid var(--color-border-tertiary)",
            borderRadius: "var(--border-radius-md)",
            background: form.timeline === opt.value ? "#EBF3FC" : "var(--color-background-primary)",
            cursor: "pointer", transition: "all 0.15s", textAlign: "left",
          }}>
            <span style={{ fontSize: 14, color: form.timeline === opt.value ? "#1B3A5C" : "var(--color-text-primary)", fontWeight: form.timeline === opt.value ? 500 : 400 }}>
              {opt.label}
            </span>
            <span style={{
              fontSize: 11, fontWeight: 500, padding: "3px 8px", borderRadius: 20,
              background: opt.tag === "Hot" ? "#FCEBEB" : opt.tag === "Warm" ? "#FAEEDA" : opt.tag === "Nurture" ? "#EBF3FC" : "#F1EFE8",
              color: opt.tag === "Hot" ? "#A32D2D" : opt.tag === "Warm" ? "#854F0B" : opt.tag === "Nurture" ? "#185FA5" : "#5F5E5A",
            }}>
              {opt.tag}
            </span>
          </button>
        ))}
      </div>
      <Field label="Additional notes for Ricky" style={{ marginTop: "1.25rem" }}>
        <textarea value={form.notes} onChange={e => set("notes", e.target.value)} rows={3} placeholder="Anything else Ricky should know before the appointment…" style={{ width: "100%", boxSizing: "border-box", resize: "vertical", marginTop: "1rem" }} />
      </Field>
    </div>,

    // STEP 4: Confirm + Submit
    <div key="confirm">
      <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-lg)", padding: "1rem 1.25rem", marginBottom: "1.25rem" }}>
        <p style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-tertiary)", marginBottom: "0.75rem", letterSpacing: "0.05em" }}>LEAD SUMMARY</p>
        {[
          ["Name", `${form.firstName} ${form.lastName}`],
          ["Email", form.email || "—"],
          ["Phone", form.phone || "—"],
          ["Type", form.leadType ? form.leadType.charAt(0).toUpperCase() + form.leadType.slice(1) : "—"],
          ["Source", form.source || "—"],
          ["Timeline", timelineObj?.label || "—"],
          ["FUB Stage", STAGE_MAP[form.leadType] || "—"],
          ["FUB Tags", tags.join(", ") || "—"],
          ...(isBuyer ? [
            ["Target Areas", form.targetAreas || "—"],
            ["Price Range", form.priceRange || "—"],
            ["Pre-Approval", form.preApproval || "—"],
          ] : []),
          ...(isSeller ? [
            ["Property", form.propertyAddress || "—"],
            ["Condition", form.condition || "—"],
            ["Price Expectation", form.priceExpectation || "—"],
          ] : []),
        ].map(([k, v]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "0.5px solid var(--color-border-tertiary)", fontSize: 13 }}>
            <span style={{ color: "var(--color-text-secondary)" }}>{k}</span>
            <span style={{ color: "var(--color-text-primary)", fontWeight: 400, maxWidth: "60%", textAlign: "right" }}>{v}</span>
          </div>
        ))}
      </div>

      <Field label="Follow Up Boss API key" required>
        <div style={{ position: "relative" }}>
          <Input type="password" value={form.apiKey} onChange={e => set("apiKey", e.target.value)} placeholder="Paste your FUB API key here" />
        </div>
        <p style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 5 }}>
          Find this in FUB → Admin → API → Your API Keys. This is never stored.
        </p>
      </Field>

      {submitStatus && (
        <StatusBadge status={submitStatus.type} message={submitStatus.message} />
      )}
    </div>,
  ];

  if (submitted) {
    return (
      <div style={{ padding: "2rem 0", textAlign: "center" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#EAF3DE", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
          <i className="ti ti-circle-check" style={{ fontSize: 28, color: "#3B6D11" }} aria-hidden="true" />
        </div>
        <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 8 }}>{form.firstName} {form.lastName} added to FUB</h2>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", marginBottom: "1.5rem" }}>
          Stage: <strong>Inquired</strong> &nbsp;·&nbsp; Tags: <strong>{tags.join(", ")}</strong>
        </p>
        <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "0.875rem 1rem", fontSize: 13, color: "var(--color-text-secondary)", marginBottom: "1.5rem", textAlign: "left" }}>
          <strong style={{ color: "var(--color-text-primary)", display: "block", marginBottom: 6 }}>Next steps for Grayson:</strong>
          <p style={{ margin: "4px 0" }}>1. Open FUB and verify the contact was created correctly</p>
          <p style={{ margin: "4px 0" }}>2. Assign the appropriate action plan based on timeline ({hotTag})</p>
          <p style={{ margin: "4px 0" }}>3. Alert Ricky via Google Chat if this is a Hot lead</p>
          <p style={{ margin: "4px 0" }}>4. Send the appointment confirmation text (Section 4, Template T2)</p>
        </div>
        <button onClick={() => { setSubmitted(false); setSubmitStatus(null); setStep(0); setForm(f => ({ ...f, firstName: "", lastName: "", email: "", phone: "", source: "", referredBy: "", leadType: "", targetAreas: "", priceRange: "", preApproval: "", mustHaves: "", propertyAddress: "", yearsOwned: "", propertyType: "", priceExpectation: "", condition: "", motivation: "", timeline: "", notes: "" })); }}
          style={{ fontSize: 14 }}>
          <i className="ti ti-plus" style={{ marginRight: 6 }} aria-hidden="true" />
          Add another lead
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "1.5rem 0" }}>
      <h2 className="sr-only">Lead intake form for Alvarez &amp; Associates — submit lead information to Follow Up Boss</h2>

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1.75rem" }}>
        <div style={{ width: 36, height: 36, borderRadius: "var(--border-radius-md)", background: "#1B3A5C", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <i className="ti ti-user-plus" style={{ fontSize: 18, color: "#fff" }} aria-hidden="true" />
        </div>
        <div>
          <p style={{ fontSize: 16, fontWeight: 500, margin: 0 }}>Lead intake</p>
          <p style={{ fontSize: 12, color: "var(--color-text-secondary)", margin: 0 }}>Alvarez & Associates · BLVD Real Estate</p>
        </div>
      </div>

      <ProgressBar current={step} />

      <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", padding: "1.5rem 1.5rem 1.25rem" }}>
        <h3 style={{ fontSize: 15, fontWeight: 500, margin: "0 0 1rem", color: "var(--color-text-primary)" }}>
          {["What type of lead is this?", "Contact information", "Property & situation details", "Timeline & notes", "Review & submit to Follow Up Boss"][step]}
        </h3>
        {stepContent[step]}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem", gap: 10 }}>
        <button onClick={() => setStep(s => s - 1)} disabled={step === 0} style={{ opacity: step === 0 ? 0.3 : 1, fontSize: 14 }}>
          <i className="ti ti-arrow-left" style={{ marginRight: 6 }} aria-hidden="true" />
          Back
        </button>
        {step < STEPS.length - 1 ? (
          <button onClick={() => setStep(s => s + 1)} disabled={!canAdvance()} style={{ opacity: canAdvance() ? 1 : 0.4, fontSize: 14 }}>
            Continue
            <i className="ti ti-arrow-right" style={{ marginLeft: 6 }} aria-hidden="true" />
          </button>
        ) : (
          <button onClick={submitToFUB} disabled={!canAdvance() || submitting} style={{ background: "#1B3A5C", color: "#fff", border: "none", borderRadius: "var(--border-radius-md)", padding: "0 1.25rem", height: 36, fontSize: 14, cursor: "pointer", opacity: canAdvance() && !submitting ? 1 : 0.5, display: "flex", alignItems: "center", gap: 8 }}>
            {submitting ? <><i className="ti ti-loader-2" style={{ fontSize: 15 }} aria-hidden="true" /> Submitting…</> : <><i className="ti ti-send" style={{ fontSize: 15 }} aria-hidden="true" /> Add to Follow Up Boss</>}
          </button>
        )}
      </div>
    </div>
  );
}
