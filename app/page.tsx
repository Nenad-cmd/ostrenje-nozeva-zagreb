"use client";

const styles = {
  page: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: 20,
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
    lineHeight: 1.4 as const,
  },
  topbar: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "flex-start",
    flexWrap: "wrap" as const,
    marginBottom: 18,
  },
  brand: { margin: 0, fontSize: 30, letterSpacing: -0.5 },
  sub: { margin: "6px 0 0 0", opacity: 0.85 },
  badgeRow: { display: "flex", gap: 8, flexWrap: "wrap" as const, marginTop: 10 },
  badge: {
    border: "1px solid #e6e6e6",
    borderRadius: 999,
    padding: "6px 10px",
    fontSize: 13,
    background: "#fafafa",
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "1.25fr 0.75fr",
    gap: 16,
  },
  card: {
    border: "1px solid #eaeaea",
    borderRadius: 14,
    padding: 16,
    background: "#fff",
    boxShadow: "0 1px 10px rgba(0,0,0,0.04)",
  },
  cardTitle: { margin: "0 0 12px 0", fontSize: 20 },
  sectionTitle: { margin: "18px 0 10px 0", fontSize: 16, opacity: 0.9 },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    border: "1px solid #f0f0f0",
    borderRadius: 12,
    padding: 12,
  },
  price: { opacity: 0.75, fontSize: 13, marginTop: 3 },
  qtyWrap: { display: "flex", alignItems: "center", gap: 8 },
  qtyInput: {
    width: 84,
    padding: 10,
    borderRadius: 10,
    border: "1px solid #d9d9d9",
    textAlign: "center" as const,
  },
  select: { width: "100%", padding: 10, borderRadius: 10, border: "1px solid #d9d9d9" },
  divider: { borderTop: "1px solid #f0f0f0", margin: "12px 0" },
  totalRow: { display: "flex", justifyContent: "space-between", fontSize: 18, marginTop: 6 },
  btnPrimary: {
    textAlign: "center" as const,
    padding: "12px 12px",
    borderRadius: 12,
    background: "#111",
    color: "#fff",
    textDecoration: "none",
    border: "1px solid #111",
    cursor: "pointer",
  },
  btnGhost: {
    textAlign: "center" as const,
    padding: "12px 12px",
    borderRadius: 12,
    background: "#fff",
    color: "#111",
    textDecoration: "none",
    border: "1px solid #d9d9d9",
    cursor: "pointer",
  },
  small: { fontSize: 12, opacity: 0.8, lineHeight: 1.45 },
  footerSection: { marginTop: 18, borderTop: "1px solid #f0f0f0", paddingTop: 16 },
  // responsive fallback (simple)
  mobileHint: { fontSize: 12, opacity: 0.65, marginTop: 6 },
};

import { useMemo, useState } from "react";

type Line = { id: string; name: string; price: number; kind: "base" | "addon" };

const baseLines: Line[] = [
  { id: "knife_standard", name: "Oštrenje noža (standard)", price: 3, kind: "base" },
  { id: "knife_58plus", name: "Oštrenje noža (58+ HRC)", price: 5, kind: "base" },
  { id: "serrated", name: "Oštrenje nazubljenog noža", price: 6, kind: "base" },
  { id: "scissors", name: "Oštrenje škara", price: 5, kind: "base" },
];

const addonLines: Line[] = [
  { id: "repair_small", name: "Popravak manjih oštećenja (do 2 mm) — dodatak", price: 1, kind: "addon" },
  { id: "repair_big", name: "Popravak većih oštećenja (preko 2 mm) — dodatak", price: 3, kind: "addon" },
];

const RETURN_OPTIONS = [
  { id: "S", label: "Povrat BOX NOW S (≈ 1,80 €)", price: 1.8 },
  { id: "M", label: "Povrat BOX NOW M (≈ 4,00 €)", price: 4.0 },
];


function eur(n: number) {
  return new Intl.NumberFormat("hr-HR", { style: "currency", currency: "EUR" }).format(n);
}

function orderCode() {
  const part = Math.random().toString(36).slice(2, 8).toUpperCase();
  const d = new Date();
  const y = String(d.getFullYear()).slice(2);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `ONZ-${y}${m}${day}-${part}`;
}


export default function Page() {
  const lines = [...baseLines, ...addonLines];
  const [qty, setQty] = useState<Record<string, number>>(() =>
    Object.fromEntries(lines.map((l) => [l.id, 0]))
  );
  const [returnOpt, setReturnOpt] = useState(RETURN_OPTIONS[0]);
  const [code] = useState(orderCode);

  const baseCount = useMemo(
    () => baseLines.reduce((sum, l) => sum + (qty[l.id] || 0), 0),
    [qty]
  );
  const standardCount = qty["knife_standard"] || 0;

const standardSurcharge =
  standardCount > 0 && standardCount < 4 ? 2 : 0;

  const addonCount = useMemo(
    () => addonLines.reduce((sum, l) => sum + (qty[l.id] || 0), 0),
    [qty]
  );

  const subtotalBase = useMemo(
    () => baseLines.reduce((sum, l) => sum + (qty[l.id] || 0) * l.price, 0),
    [qty]
  );
  const subtotalAddons = useMemo(
    () => addonLines.reduce((sum, l) => sum + (qty[l.id] || 0) * l.price, 0),
    [qty]
  );

  // Popust 10% računamo na oštrenje (base) kad je 8+ kom
  const discountRate = baseCount >= 8 ? 0.1 : 0;
  const discount = subtotalBase * discountRate;

  // Povrat besplatan kad je 4+ kom oštrenja
  const returnShipping = baseCount >= 4 ? 0 : returnOpt.price;

  const total = Math.max(0, subtotalBase - discount) + subtotalAddons + returnShipping + standardSurcharge;

  const baseSummary = baseLines
    .filter((l) => (qty[l.id] || 0) > 0)
    .map((l) => `- ${l.name} x ${qty[l.id]} = ${eur(qty[l.id] * l.price)}`)
    .join("\n");

  const addonSummary = addonLines
    .filter((l) => (qty[l.id] || 0) > 0)
    .map((l) => `- ${l.name} x ${qty[l.id]} = ${eur(qty[l.id] * l.price)}`)
    .join("\n");

   const messageWA = encodeURIComponent(
    `Pozdrav! Želim naručiti oštrenje.\n\n` +
      `Šifra narudžbe: ${code}\n\n` +
      `Oštrenje (komada: ${baseCount}):\n${baseSummary || "- (nije odabrano)"}\n\n` +
      `Dodaci / popravci (količina: ${addonCount}):\n${addonSummary || "- (bez dodataka)"}\n\n` +
      `Međuzbroj oštrenje: ${eur(subtotalBase)}\n` +
      (discountRate ? `Popust (8+ kom): -${eur(discount)}\n` : "") +
      `Međuzbroj dodaci: ${eur(subtotalAddons)}\n` +
      `Povrat (BOX NOW): ${baseCount >= 4 ? "0,00 € (besplatan povrat za 4+)" : eur(returnShipping)}\n` +
      `Ukupno: ${eur(total)}\n\n` +
      `Napomena: Cijena popravka se dodaje na cijenu oštrenja.\n\n` +
      `Ime i prezime:\nMobitel:\nPaketomat za povrat (grad + lokacija):\n`
  );

  const setLineQty = (id: string, v: number) => {
    const val = Math.max(0, Math.min(99, Number.isFinite(v) ? v : 0));
    setQty((prev) => ({ ...prev, [id]: val }));
  };

  const reset = () => setQty(Object.fromEntries(lines.map((l) => [l.id, 0])));

  const mailSubject = encodeURIComponent(`Narudžba za oštrenje noževa – ${code}`);
  const mailBody = encodeURIComponent(
    `Šifra narudžbe: ${code}\n\n` +
      `Oštrenje (komada: ${baseCount}):\n${baseSummary || "-"}\n\n` +
      `Dodaci / popravci:\n${addonSummary || "-"}\n\n` +
      `Ukupno: ${eur(total)}\n\n` +
      `Paketomat za povrat (grad + lokacija):\n` +
      `Napomena:\n`
  );
  
  return (
    <>
      {/* HERO SEKCIJA */}
      <section
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "20px",
        }}
      >
        <div
          style={{
            borderRadius: 18,
            overflow: "hidden",
            border: "1px solid #eaeaea",
            height: 360,
          }}
        >
          <img
            src="/hero.webp"
            alt="Oštrenje noževa Zagreb – Byway"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
      </section>
    
  <main style={{ maxWidth: 1020, margin: "0 auto", padding: 24, fontFamily: "system-ui, sans-serif" }}>
    <header style={{ marginBottom: 22 }}>
  <h1 style={{ margin: "0 0 6px 0", fontSize: 32 }}>
    Oštrenje noževa Zagreb
  </h1>

  <p style={{ margin: "0 0 10px 0", opacity: 0.85 }}>
    Brza obrada (24–48 h). Slanje i povrat putem BOX NOW paketomata.
  </p>

  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
    <span style={{ border: "1px solid #e6e6e6", borderRadius: 999, padding: "6px 10px", fontSize: 13 }}>
      4+ kom oštrenja = besplatan povrat
    </span>
    <span style={{ border: "1px solid #e6e6e6", borderRadius: 999, padding: "6px 10px", fontSize: 13 }}>
      8+ kom oštrenja = 10% popusta
    </span>
    <span style={{ border: "1px solid #e6e6e6", borderRadius: 999, padding: "6px 10px", fontSize: 13 }}>
      Preferirani kontakt: e-mail
    </span>
  </div>

  <div style={{ marginTop: 10, padding: 10, border: "1px solid #ddd", borderRadius: 10 }}>
    <strong>🎯 Akcije:</strong> 4+ kom oštrenja = besplatan povrat • 8+ kom oštrenja = 10% popusta
  </div>  <div style={{ marginTop: 14 }}>
    <a
      href="/box-now"
      style={{
        display: "inline-block",
        padding: "8px 12px",
        borderRadius: 8,
        border: "1px solid #111",
        textDecoration: "none",
        color: "#111",
        fontWeight: 600,
        fontSize: 14,
      }}
    >
      📦 Kako poslati noževe (BOX NOW upute)
    </a>
  </div>

</header>


    {/* Ovdje dalje ide tvoj sadržaj: section cjenik, sažetak, faq, kontakt... */}
  

    <section style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 18 }}>
        
        <div style={{ border: "1px solid #ddd", borderRadius: 10, padding: 16 }}>
          <h2 style={{ marginTop: 0 }}>Cjenik</h2>

          <h3 style={{ marginBottom: 8 }}>Oštrenje</h3>
          <div style={{ display: "grid", gap: 10 }}>
            {baseLines.map((l) => (
              <div
                key={l.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  border: "1px solid #eee",
                  borderRadius: 10,
                  padding: 12,
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{l.name}</div>
                  <div style={{ opacity: 0.75 }}>{eur(l.price)} / kom</div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <label style={{ fontSize: 12, opacity: 0.8 }}>Količina</label>
                  <input
                    type="number"
                    min={0}
                    value={qty[l.id] ?? 0}
                    onChange={(e) => setLineQty(l.id, Number(e.target.value || 0))}
                    style={{
                      width: 80,
                      padding: 10,
                      borderRadius: 8,
                      border: "1px solid #ccc",
                      textAlign: "center",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <h3 style={{ marginTop: 18, marginBottom: 8 }}>Dodaci / popravci</h3>
          <div style={{ display: "grid", gap: 10 }}>
            {addonLines.map((l) => (
              <div
                key={l.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  border: "1px solid #eee",
                  borderRadius: 10,
                  padding: 12,
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{l.name}</div>
                  <div style={{ opacity: 0.75 }}>{eur(l.price)} / kom</div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <label style={{ fontSize: 12, opacity: 0.8 }}>Količina</label>
                  <input
                    type="number"
                    min={0}
                    value={qty[l.id] ?? 0}
                    onChange={(e) => setLineQty(l.id, Number(e.target.value || 0))}
                    style={{
                      width: 80,
                      padding: 10,
                      borderRadius: 8,
                      border: "1px solid #ccc",
                      textAlign: "center",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px dashed #ddd" }}>
            <h3 style={{ margin: "0 0 6px 0" }}>Pravila</h3>
            <ul style={{ marginTop: 0 }}>
              <li><strong>4+ kom (oštrenje)</strong> → besplatan povrat</li>
              <li><strong>8+ kom (oštrenje)</strong> → 10% popusta na oštrenje</li>
              <li style={{ opacity: 0.85 }}>Cijena popravka se dodaje na cijenu oštrenja.</li>
            </ul>
          </div>
        </div>

      {/*Sažetak + CTA */}
        <aside style={{ border: "1px solid #ddd", borderRadius: 10, padding: 16 }}>
          <h2 style={{ marginTop: 0 }}>Sažetak</h2>

          <div style={{ fontSize: 14, opacity: 0.85, marginBottom: 10 }}>
            Šifra narudžbe: <strong>{code}</strong>
          </div>

          <div style={{ marginBottom: 10 }}>
            Oštrenje (kom): <strong>{baseCount}</strong><br />
            Dodaci (kom): <strong>{addonCount}</strong>
          </div>

          <div style={{ marginTop: 12 }}>
            <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>
              Povrat (BOX NOW)
            </label>
            <select
              value={returnOpt.id}
              onChange={(e) => setReturnOpt(RETURN_OPTIONS.find((o) => o.id === e.target.value) || RETURN_OPTIONS[0])}
              style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
              disabled={baseCount >= 4}
            >
              {RETURN_OPTIONS.map((o) => (
                <option key={o.id} value={o.id}>{o.label}</option>
              ))}
            </select>
            {baseCount >= 4 && (
              <div style={{ marginTop: 6, fontSize: 13, opacity: 0.8 }}>
                Povrat je besplatan (4+ kom oštrenja).
              </div>
            )}
          </div>

          <div style={{ marginTop: 14, borderTop: "1px solid #eee", paddingTop: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Međuzbroj oštrenje</span>
              <strong>{eur(subtotalBase)}</strong>
            </div>

            {discountRate > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Popust (10%)</span>
                <strong>-{eur(discount)}</strong>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Međuzbroj dodaci</span>
              <strong>{eur(subtotalAddons)}</strong>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Povrat</span>
              <strong>{baseCount >= 4 ? eur(0) : eur(returnShipping)}</strong>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 18 }}>
              <span>Ukupno</span>
              <strong>{eur(total)}</strong>
            </div>
          </div>

          <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
            <a
              href={`https://wa.me/385959105056?text=${messageWA}`}
              style={{
                textAlign: "center",
                padding: "12px 12px",
                borderRadius: 10,
                background: "#111",
                color: "#fff",
                textDecoration: "none",
              }}
            >
             <a
  href={`mailto:bruslab3@gmail.com?subject=${mailSubject}&body=${mailBody}`}
  style={{
    textAlign: "center",
    padding: "12px 12px",
    borderRadius: 10,
    border: "1px solid #111",
    background: "#fff",
    color: "#111",
    textDecoration: "none",
  }}
>
  Pošalji narudžbu e-mailom (preferirano)
</a>

<a
  href={`https://wa.me/385959105056?text=${messageWA}`}
  style={{
    textAlign: "center",
    padding: "12px 12px",
    borderRadius: 10,
    background: "#111",
    color: "#fff",
    textDecoration: "none",
  }}
>
  Pošalji narudžbu na WhatsApp
</a>


             <button
              onClick={reset}
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid #ccc",
                background: "#fff",
                cursor: "pointer",
              }}
            >
              Reset
            </button>

            <div style={{ fontSize: 12, opacity: 0.8, lineHeight: 1.4 }}>
              Kupac plaća slanje prema meni (BOX NOW). Povrat je besplatan za <strong>4+</strong> kom oštrenja.
            </div>
          </div>
        </aside>
    </section>
      
      

      {/* FAQ */}
      <section style={{ marginTop: 28, borderTop: "1px solid #eee", paddingTop: 18 }}>
        <h2>Česta pitanja</h2>

        <p>
          <strong>Kako mogu prepoznati tvrđu oštricu (58+ HRC)?</strong><br />
          Tvrđe oštrice najčešće se nalaze kod japanskih noževa i noževa od kvalitetnijih čelika,
          poput noževa marke Global i sličnih japanskih ili polu-japanskih čelika.
        </p>

        <p>
          Takvi noževi dulje zadržavaju oštrinu, ali zahtijevaju preciznije oštrenje.
          Ako niste sigurni u tvrdoću, nož se može procijeniti nakon pregleda.
        </p>
      </section>

      {/* Kontakt forma (opcionalno — ostavio sam link mailto gore; ovo je dodatni klasični upit) */}
      <section style={{ marginTop: 28, borderTop: "1px solid #eee", paddingTop: 18 }}>
        <h2>Kontakt upit (e-mail)</h2>
        <p><strong>Preferirani kontakt:</strong> e-mail</p>
        <p>📧 <a href="mailto:bruslab3@gmail.com">bruslab3@gmail.com</a></p>

        <form
          action="mailto:bruslab3@gmail.com"
          method="POST"
          encType="text/plain"
          style={{ maxWidth: 520, marginTop: 10 }}
        >
          <div style={{ marginBottom: 12 }}>
            <label>Ime i prezime</label><br />
            <input type="text" name="Ime i prezime" required style={{ width: "100%", padding: 10 }} />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label>E-mail</label><br />
            <input type="email" name="E-mail" required style={{ width: "100%", padding: 10 }} />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label>Poruka</label><br />
            <textarea
              name="Poruka"
              rows={6}
              required
              placeholder="Npr. broj noževa, vrsta (58+ HRC, nazubljeni), paketomat za povrat…"
              style={{ width: "100%", padding: 10 }}
            />
          </div>

          <button
            type="submit"
            style={{
              padding: "12px 16px",
              borderRadius: 8,
              border: "none",
              background: "#111",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Pošalji e-mail upit
          </button>
        </form>

        <p style={{ fontSize: 12, opacity: 0.75, marginTop: 10 }}>
          Odgovaram putem e-maila u najkraćem mogućem roku.
        </p>
      </section>
    <section
  style={{
    marginTop: 32,
    paddingTop: 18,
    borderTop: "1px solid #eee",
    fontSize: 15,
  }}
>
  <h2>Kontakt i osobna predaja</h2>

  <p>
    Noževe je moguće donijeti i osobno na fizičku lokaciju u Zagrebu,
    <strong> isključivo uz prethodnu najavu</strong>.
  </p>

  <p>
    📍 <strong>Adresa:</strong> Golska 13, Zagreb 10040<br />
    📞 <strong>Najava:</strong> telefonom ili e-mailom prije dolaska
  </p>

  <p style={{ marginTop: 8 }}>
    <a
      href="https://www.google.com/maps/search/?api=1&query=Golska+13+Zagreb+10040"
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: "underline", color: "#111", fontWeight: 600 }}
    >
      📍 Prikaži lokaciju na Google Maps
    </a>
  </p>
</section>

    </main>
  </>
  );
}
