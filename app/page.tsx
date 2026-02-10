"use client";

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

// === PODACI ZA UPLATU (tvoji) ===
const PAYEE_NAME = "Byway";
const PAYEE_IBAN = "HR0324840081135329520";
const PAYEE_ADDR1 = "Golska 13";
const PAYEE_CITY = "10040 Zagreb";

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

  // količine
  const [qty, setQty] = useState<Record<string, number>>(() =>
    Object.fromEntries(lines.map((l) => [l.id, 0]))
  );

  // povrat
  const [returnOpt, setReturnOpt] = useState(RETURN_OPTIONS[0]);

  // šifra
  const [code] = useState(orderCode);

  // podaci kupca (obavezno)
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [returnLocker, setReturnLocker] = useState("");

  // zbrojevi
  const baseCount = useMemo(() => baseLines.reduce((sum, l) => sum + (qty[l.id] || 0), 0), [qty]);
  const addonCount = useMemo(() => addonLines.reduce((sum, l) => sum + (qty[l.id] || 0), 0), [qty]);

  const subtotalBase = useMemo(
    () => baseLines.reduce((sum, l) => sum + (qty[l.id] || 0) * l.price, 0),
    [qty]
  );
  const subtotalAddons = useMemo(
    () => addonLines.reduce((sum, l) => sum + (qty[l.id] || 0) * l.price, 0),
    [qty]
  );
  const [needR1, setNeedR1] = useState(false);


  // popust 10% na oštrenje (base) kad 8+
  const discountRate = baseCount >= 8 ? 0.1 : 0;
  const discount = subtotalBase * discountRate;

  // standard surcharge: ako standard ima 1-3 kom dodaj 2€
  const standardCount = qty["knife_standard"] || 0;
  const standardSurcharge = standardCount > 0 && standardCount < 4 ? 2 : 0;

  // povrat besplatan kad je 4+ kom oštrenja
  const returnShipping = baseCount >= 4 ? 0 : returnOpt.price;

  const total = Math.max(0, subtotalBase - discount) + subtotalAddons + returnShipping + standardSurcharge;

  const baseSummary = baseLines
    .filter((l) => (qty[l.id] || 0) > 0)
    .map((l) => `- ${l.name} x ${qty[l.id]} = ${eur((qty[l.id] || 0) * l.price)}`)
    .join("\n");

  const addonSummary = addonLines
    .filter((l) => (qty[l.id] || 0) > 0)
    .map((l) => `- ${l.name} x ${qty[l.id]} = ${eur((qty[l.id] || 0) * l.price)}`)
    .join("\n");


  // validacija kupca
  const phoneOk = customerPhone.replace(/\D/g, "").length >= 8;
  const emailOk = customerEmail.includes("@");
  const isCustomerOk =
    baseCount > 0 &&
    customerName.trim().length >= 2 &&
    phoneOk &&
    emailOk &&
    returnLocker.trim().length >= 3;

  // HUB-3 PDF417 (HR banke) — izduženi barkod
  const payerName = (customerName || "").toUpperCase().slice(0, 30);
  const payerAddr1 = "";
  const payerCity = "";

  const amountCents = String(Math.round(total * 100)).padStart(15, "0");
  const model = "HR00";
  const reference = String(code).slice(0, 22);
  const purpose = "COST";
  const description = `Ostrenje nozeva ${code}`.slice(0, 35);

  const hub3Text = [
    "HRVHUB30",
    "EUR",
    amountCents,
    payerName,
    payerAddr1,
    payerCity,
    PAYEE_NAME.toUpperCase().slice(0, 25),
    PAYEE_ADDR1.toUpperCase().slice(0, 25),
    PAYEE_CITY.toUpperCase().slice(0, 27),
    PAYEE_IBAN.replace(/\s+/g, "").slice(0, 21),
    model,
    reference,
    purpose,
    description,
  ].join("\n");

  const pdf417Url =
    `https://bwipjs-api.metafloor.com/?bcid=pdf417&scale=2&eclevel=5&includetext=false&text=${encodeURIComponent(
      hub3Text
    )}`;

  const setLineQty = (id: string, v: number) => {
    const val = Math.max(0, Math.min(99, Number.isFinite(v) ? v : 0));
    setQty((prev) => ({ ...prev, [id]: val }));
  };

  const reset = () => {
    setQty(Object.fromEntries(lines.map((l) => [l.id, 0])));
    // NE brišem kupčeve podatke namjerno (da mu je lakše ispraviti narudžbu)
  };

  // mailto (ali zaključan dok nije ispunjeno)
  const mailSubject = encodeURIComponent(`Narudžba za oštrenje noževa – ${code}`);
  const mailBody = encodeURIComponent(
    `NARUDŽBA – ${code}\n\n` +
      `Kupac:\n` +
      `Ime i prezime: ${customerName}\n` +
      `Mobitel: ${customerPhone}\n` +
      `E-mail: ${customerEmail}\n` +
      `Paketomat za povrat (grad + lokacija): ${returnLocker}\n\n` +
     `R1 račun: ${needR1 ? "DA" : "NE"}\n` +
      (needR1
        ? `\nR1 PODACI (ispuniti):\n` +  
            `1) Naziv tvrtke:\n` +
            `2) Adresa tvrtke:\n` +
            `3) OIB:\n\n`
          : `\n`) +
  
      `Oštrenje (komada: ${baseCount}):\n${baseSummary || "-"}\n\n` +
      `Dodaci / popravci (komada: ${addonCount}):\n${addonSummary || "-"}\n\n` +
      `Međuzbroj oštrenje: ${eur(subtotalBase)}\n` +
      (discountRate ? `Popust (8+ kom): -${eur(discount)}\n` : "") +
      `Međuzbroj dodaci: ${eur(subtotalAddons)}\n` +
      `Povrat (BOX NOW): ${baseCount >= 4 ? "0,00 € (besplatan povrat za 4+)" : eur(returnShipping)}\n` +
      `Nadoplata (standard <4): ${eur(standardSurcharge)}\n` +
      `UKUPNO: ${eur(total)}\n\n` +
      `Uplata:\nPrimatelj: ${PAYEE_NAME}\nIBAN: ${PAYEE_IBAN}\nPoziv na broj: ${code}\nOpis: Ostrenje nozeva ${code}\n\n` +
      `Napomena: Račun šaljem e-mailom nakon evidentirane uplate.\n`
  );
  const sendEmailOrder = () => {
  // otvara e-mail klijenta s već popunjenom narudžbom
  window.location.href = `mailto:bruslab3@gmail.com?subject=${mailSubject}&body=${mailBody}`;
};


  const downloadPaymentPdf = async () => {
    if (!isCustomerOk) {
      alert("Prvo ispuni podatke kupca + paketomat za povrat (i odaberi barem 1 oštrenje).");
      return;
    }

    const { jsPDF } = await import("jspdf");

    // fetch barkoda kao sliku
    const res = await fetch(pdf417Url);
    const blob = await res.blob();

    const dataUrl: string = await new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result));
      r.onerror = reject;
      r.readAsDataURL(blob);
    });

    const doc = new jsPDF({ unit: "mm", format: "a4" });

    doc.setFontSize(16);
    doc.text("Upute za uplatu – Oštrenje noževa", 14, 20);

    doc.setFontSize(11);
    doc.text(`Šifra: ${code}`, 14, 30);

    doc.text(`Primatelj: ${PAYEE_NAME}`, 14, 42);
    doc.text(`IBAN: ${PAYEE_IBAN}`, 14, 49);
    doc.text(`Iznos: ${eur(total)}`, 14, 56);
    doc.text(`Poziv na broj: ${code}`, 14, 63);
    doc.text(`Opis: Ostrenje nozeva ${code}`.slice(0, 60), 14, 70);

    doc.text("Napomena: Račun šaljem e-mailom nakon evidentirane uplate.", 14, 82);

    doc.setFontSize(10);
    doc.text("2D barkod za uplatu (HUB-3 / PDF417):", 14, 96);

    // add image (PNG/JPEG - bwipjs vraća PNG)
    doc.addImage(dataUrl, "PNG", 14, 102, 90, 38);

    doc.save(`uplata_${code}.pdf`);
  };

  return (
    <>
      {/* HERO */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: 20 }}>
        <div style={{ borderRadius: 18, overflow: "hidden", border: "1px solid #eaeaea", height: 360 }}>
          <img
            src="/hero.webp"
            alt="Oštrenje noževa Zagreb – Byway"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>
      </section>

      <main style={{ maxWidth: 1020, margin: "0 auto", padding: 24, fontFamily: "system-ui, sans-serif" }}>
        {/* HEADER */}
        <header style={{ marginBottom: 22 }}>
          <h1 style={{ margin: "0 0 6px 0", fontSize: 32 }}>Oštrenje noževa Zagreb</h1>

          <p style={{ margin: "0 0 10px 0", opacity: 0.85 }}>
            Brza obrada (24–48 h). Slanje i povrat putem BOX NOW paketomata.
          </p>
          <p style={{ margin: "0 0 14px 0", opacity: 0.9 }}>
          Profesionalno oštrenje noževa pružamo na području Zagreba, koristeći precizne sustave oštrenja
          koji osiguravaju dugotrajnu oštrinu u svakodnevnoj upotrebi.
        </p>

          <div style={{ marginTop: 10, padding: 10, border: "1px solid #ddd", borderRadius: 10 }}>
            <strong>🎯 Akcije:</strong> 4+ kom oštrenja = besplatan povrat • 8+ kom oštrenja = 10% popusta
          </div>

          <div style={{ marginTop: 14 }}>
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
        {/* EDUKATIVNA SEKCIJA */}
<section style={{ marginBottom: 24 }}>
  <h2 style={{ margin: "0 0 10px 0", fontSize: 22 }}>
    Kako postići oštrinu koja traje
  </h2>

  <p style={{ margin: 0, lineHeight: 1.65, opacity: 0.95 }}>
    <strong>
      Prava tajna dugotrajne oštrine nije u samom brušenju, već u precizno izvedenom
      uklanjanju srha.
    </strong>
    <br />
    Ovakav pristup potvrđen je i u profesionalnoj praksi, uključujući mesnu industriju,
    gdje se oštrina noža testira kroz kontinuirani, stvarni rad.
    <br />
    Metoda je detaljno opisana u knjizi{" "}
    <em>Knife Deburring: Science Behind the Lasting Razor Edge</em> autora Vadima
    Kraichuka, koja se smatra jednim od referentnih djela za razumijevanje dugotrajne
    oštrine noževa.
  </p>
</section>


        {/* Cjenik + Sažetak */}
        <section style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 18 }}>
          {/* CJENIK */}
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
                <li>
                  <strong>4+ kom (oštrenje)</strong> → besplatan povrat
                </li>
                <li>
                  <strong>8+ kom (oštrenje)</strong> → 10% popusta na oštrenje
                </li>
                <li style={{ opacity: 0.85 }}>Cijena popravka se dodaje na cijenu oštrenja.</li>
              </ul>
            </div>
          </div>

          {/* SAŽETAK + CTA */}
          <aside style={{ border: "1px solid #ddd", borderRadius: 10, padding: 16 }}>
            <h2 style={{ marginTop: 0 }}>Sažetak</h2>

            <div style={{ fontSize: 14, opacity: 0.85, marginBottom: 10 }}>
              Šifra narudžbe: <strong>{code}</strong>
            </div>

            <div style={{ marginBottom: 10 }}>
              Oštrenje (kom): <strong>{baseCount}</strong>
              <br />
              Dodaci (kom): <strong>{addonCount}</strong>
            </div>

            {/* Podaci kupca */}
            <div style={{ marginTop: 12 }}>
              <h3 style={{ margin: "0 0 8px 0" }}>Podaci za narudžbu (obavezno)</h3>

              <label style={{ display: "block", fontSize: 12, opacity: 0.8 }}>Ime i prezime</label>
              <input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="npr. Ivan Horvat"
                style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ccc", marginBottom: 8 }}
              />

              <label style={{ display: "block", fontSize: 12, opacity: 0.8 }}>Mobitel</label>
              <input
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="npr. 091 123 4567"
                style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ccc", marginBottom: 8 }}
              />

              <label style={{ display: "block", fontSize: 12, opacity: 0.8 }}>E-mail</label>
              <input
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="npr. ivan@email.com"
                style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ccc", marginBottom: 8 }}
              />

              <label style={{ display: "block", fontSize: 12, opacity: 0.8 }}>
                Paketomat za povrat (grad + lokacija)
              </label>
              <input
                value={returnLocker}
                onChange={(e) => setReturnLocker(e.target.value)}
                placeholder="npr. Zagreb, Dubrava 222"
                style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
              />
            </div>

            {/* Povrat */}
            <div style={{ marginTop: 12 }}>
              <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>Povrat (BOX NOW)</label>
              <select
                value={returnOpt.id}
                onChange={(e) =>
                  setReturnOpt(RETURN_OPTIONS.find((o) => o.id === e.target.value) || RETURN_OPTIONS[0])
                }
                style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
                disabled={baseCount >= 4}
              >
                {RETURN_OPTIONS.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>

              {baseCount >= 4 && (
                <div style={{ marginTop: 6, fontSize: 13, opacity: 0.8 }}>Povrat je besplatan (4+ kom oštrenja).</div>
              )}
            </div>

            {/* Cijena */}
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

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Nadoplata (standard &lt;4)</span>
                <strong>{eur(standardSurcharge)}</strong>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 18 }}>
                <span>Ukupno</span>
                <strong>{eur(total)}</strong>
              </div>
            </div>

            {/*CTA*/}
            <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
              <label
  style={{
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 14,
    cursor: "pointer",
    marginTop: 10,
  }}
>
  <input
    type="checkbox"
    checked={needR1}
    onChange={(e) => setNeedR1(e.target.checked)}
  />
  Trebam R1 račun
</label>
              
 <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>
  Poslovni korisnici mogu dodatne podatke upisati u e-mailu.
</div>
   
  {/* EMAIL */}
  <button
    type="button"
    onClick={sendEmailOrder}
    disabled={!isCustomerOk}
    style={{
      textAlign: "center",
      padding: "12px",
      borderRadius: 10,
      border: "1px solid #111",
      background: isCustomerOk ? "#fff" : "#eee",
      color: "#111",
      fontWeight: 600,
      cursor: isCustomerOk ? "pointer" : "not-allowed",
    }}
  >
    Otvori e-mail narudžbu 
  </button>

  <div style={{ fontSize: 12, opacity: 0.7 }}>
    Otvara e-mail aplikaciju s popunjenom narudžbom.
  </div>

  {/* PDF */}
  <button
    type="button"
    onClick={downloadPaymentPdf}
    disabled={!isCustomerOk}
    style={{
      padding: "12px",
      borderRadius: 10,
      border: "1px solid #111",
      background: isCustomerOk ? "#111" : "#999",
      color: "#fff",
      cursor: isCustomerOk ? "pointer" : "not-allowed",
      fontWeight: 700,
    }}
  >
    ⬇️ Preuzmi PDF uplatnicu
  </button>

  <img
    src={pdf417Url}
    alt="2D barkod za uplatu (HUB-3 PDF417)"
    style={{
      width: "100%",
      height: "auto",
      borderRadius: 12,
      border: "1px solid #eee",
    }}
  />

  {/* RESET */}
  <button
    type="button"
    onClick={reset}
    style={{
      padding: "10px",
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
    <div style={{ marginTop: 6 }}>
      Račun šaljem e-mailom nakon evidentirane uplate.
    </div>
  </div>

  {!isCustomerOk && (
    <div style={{ fontSize: 12, opacity: 0.7 }}>
      Za slanje narudžbe i uplatnicu obavezno ispuni: ime, mobitel, e-mail i paketomat za povrat.
    </div>
  )}
</div>

          </aside>
        </section>

        {/* FAQ */}
        <section style={{ marginTop: 28, borderTop: "1px solid #eee", paddingTop: 18 }}>
          <h2>Česta pitanja</h2>

          <p>
            <strong>Kako mogu prepoznati tvrđu oštricu (58+ HRC)?</strong>
            <br />
            Tvrđe oštrice najčešće se nalaze kod japanskih noževa i noževa od kvalitetnijih čelika, poput noževa marke
            Global i sličnih japanskih ili polu-japanskih čelika.Takvi noževi dulje zadržavaju oštrinu, ali zahtijevaju
            više faza oštrenja.
          </p>
  
        </section>

        {/* Kontakt forma */}
        <section style={{ marginTop: 28, borderTop: "1px solid #eee", paddingTop: 18 }}>
          <h2>Kontakt upit (e-mail)</h2>
          <p>
            <strong>Preferirani kontakt:</strong> e-mail
          </p>
          <p>
            📧 <a href="mailto:bruslab3@gmail.com">bruslab3@gmail.com</a>
          </p>

          <form
            action="mailto:bruslab3@gmail.com"
            method="POST"
            encType="text/plain"
            style={{ maxWidth: 520, marginTop: 10 }}
          >
            <div style={{ marginBottom: 12 }}>
              <label>Ime i prezime</label>
              <br />
              <input type="text" name="Ime i prezime" required style={{ width: "100%", padding: 10 }} />
            </div>

            <div style={{ marginBottom: 12 }}>
              <label>E-mail</label>
              <br />
              <input type="email" name="E-mail" required style={{ width: "100%", padding: 10 }} />
            </div>

            <div style={{ marginBottom: 12 }}>
              <label>Poruka</label>
              <br />
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

          <p style={{ fontSize: 12, opacity: 0.75, marginTop: 10 }}>Odgovaram putem e-maila u najkraćem mogućem roku.</p>
        </section>

        {/* Osobna predaja */}
        <section style={{ marginTop: 32, paddingTop: 18, borderTop: "1px solid #eee", fontSize: 15 }}>
          <h2>Kontakt i osobna predaja</h2>

          <p>
            Noževe je moguće donijeti i osobno na fizičku lokaciju u Zagrebu, <strong>isključivo uz prethodnu najavu</strong>.
          </p>

          <p>
            📍 <strong>Adresa:</strong> Golska 13, Zagreb 10040
            <br />
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
