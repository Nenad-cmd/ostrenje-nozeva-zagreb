
"use client";
import { PhoneIcon, LocationIcon, MailIcon, FacebookIcon } from "./components/icons";
import { useMemo, useState } from "react";

type Line = { id: string; name: string; price: number; kind: "base" | "addon" };

const baseLines: Line[] = [
  { id: "knife_standard", name: "Oštrenje noža (standard)", price: 3, kind: "base" },
  { id: "knife_58plus", name: "Oštrenje noža 58+ HRC(Japanski noževi)", price: 5, kind: "base" },
  { id: "serrated", name: "Oštrenje nazubljenog noža", price: 6, kind: "base" },
  { id: "scissors", name: "Oštrenje škara", price: 5, kind: "base" },
];

const addonLines: Line[] = [
  { id: "repair_small", name: "Popravak manjih oštećenja (do 2 mm) — dodatak", price: 1, kind: "addon" },
  { id: "repair_big", name: "Popravak većih oštećenja (preko 2 mm) — dodatak", price: 3, kind: "addon" },
];

// === PODACI ZA UPLATU ===
const PAYEE_NAME = "BrusLab";
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

  // šifra
  const [code] = useState(orderCode);

  // podaci kupca
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [needR1, setNeedR1] = useState(false);

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

  // nadoplata ako ima manje od 4 noža ukupno
  const standardSurcharge = baseCount > 0 && baseCount < 4 ? 2 : 0;

  const total = subtotalBase + subtotalAddons + standardSurcharge;

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
    emailOk;

  // HUB-3 PDF417 barkod podaci
  const payerName = (customerName || "").toUpperCase().slice(0, 30);
  const payerAddr1 = "";
  const payerCity = "";

  const amountCents = String(Math.round(total * 100)).padStart(15, "0");
  const model = "HR99";
  const reference = "";
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
    `https://metafloor.com{encodeURIComponent(
      hub3Text
    )}`;

  const setLineQty = (id: string, v: number) => {
    const val = Math.max(0, Math.min(99, Number.isFinite(v) ? v : 0));
    setQty((prev) => ({ ...prev, [id]: val }));
  };

  const reset = () => {
    setQty(Object.fromEntries(lines.map((l) => [l.id, 0])));
  };

  // E-mail priprema
  const mailSubject = encodeURIComponent(`Narudžba za oštrenje noževa – ${code}`);
  const mailBody = encodeURIComponent(
    `NARUDŽBA – ${code}\n\n` +
      `Kupac:\n` +
      `Ime i prezime: ${customerName}\n` +
      `Mobitel: ${customerPhone}\n` +
      `E-mail: ${customerEmail}\n\n` +
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
      `Međuzbroj dodaci: ${eur(subtotalAddons)}\n` +
      `Nadoplata (<4 kom ukupno): ${eur(standardSurcharge)}\n` +
      `UKUPNO: ${eur(total)}\n\n` +
      `Uplata:\n` +
      `Primatelj: ${PAYEE_NAME}\n` +
      `IBAN: ${PAYEE_IBAN}\n` +
      `Model: HR99\n` +
      `Opis placanja: Ostrenje nozeva ${code}\n\n` +
      `Dostava i preuzimanje:\n` +
      `- Noževe možete donijeti fizički na adresu ili poslati preko GLS paketomata.\n` +
      `- Povrat gotovih noževa vrši se pouzećem.\n\n` +
      `Napomena: uplata nije potrebna unaprijed. Placanje se vrsi prije povrata nozeva.\n` +
      `Racun saljem e-mailom nakon evidentirane uplate.\n`
  );

  const sendEmailOrder = () => {
    window.location.href = `mailto:bruslab3@://gmail.com{mailSubject}&body=${mailBody}`;
  };

  const downloadPaymentPdf = async () => {
    if (!isCustomerOk) {
      alert("Prvo ispuni podatke kupca i odaberi barem 1 oštrenje.");
      return;
    }

    const { jsPDF } = await import("jspdf");
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
    doc.text(`Model: HR99`, 14, 63);
    doc.text(`Opis placanja: Ostrenje nozeva ${code}`.slice(0, 60), 14, 70);
    doc.text("Napomena o dostavi: Nozeve mozete donijeti osobno ili poslati GLS paketomatom. Povrat se vrsi pouzecem.", 14, 78);
    doc.text("Racun saljem e-mailom nakon evidentirane uplate.", 14, 86);
    doc.setFontSize(10);
    doc.text("2D barkod za uplatu (HUB-3 / PDF417):", 14, 96);
    doc.addImage(dataUrl, "PNG", 14, 102, 90, 38);
    doc.save(`uplata_${code}.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 bg-white shadow-xl rounded-2xl my-6 font-sans text-gray-800">
      {/* Zaglavlje / Kontakt */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-6 mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{PAYEE_NAME}</h1>
          <p className="text-sm text-gray-500 mt-1">Profesionalno oštrenje svih vrsta noževa i škara</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-600 w-full md:w-auto">
          <div className="flex items-center gap-2"><LocationIcon className="w-4 h-4 text-blue-600" /> <span>{PAYEE_ADDR1}, {PAYEE_CITY}</span></div>
          <div className="flex items-center gap-2"><PhoneIcon className="w-4 h-4 text-blue-600" /> <span>091 XXX XXXX</span></div>
          <div className="flex items-center gap-2"><MailIcon className="w-4 h-4 text-blue-600" /> <span>bruslab3@gmail.com</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lijeva strana: Odabir usluga i Podaci */}
        <div className="lg:col-span-2 space-y-6">
          {/* Oštrenje sekcija */}
          <div>
            <h2 className="text-xl font-bold mb-3 text-gray-900">1. Odaberite usluge oštrenja</h2>
            <div className="space-y-3">
              {baseLines.map((line) => (
                <div key={line.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm md:text-base">{line.name}</p>
                    <p className="text-xs text-blue-600 font-medium">{eur(line.price)} / kom</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setLineQty(line.id, (qty[line.id] || 0) - 1)} className="w-8 h-8 bg-white border rounded-lg shadow-sm font-bold flex items-center justify-center hover:bg-gray-100">-</button>
                    <span className="w-8 text-center font-bold text-gray-900">{qty[line.id] || 0}</span>
                    <button onClick={() => setLineQty(line.id, (qty[line.id] || 0) + 1)} className="w-8 h-8 bg-white border rounded-lg shadow-sm font-bold flex items-center justify-center hover:bg-gray-100">+</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dodaci sekcija */}
          <div>
            <h2 className="text-xl font-bold mb-3 text-gray-900">2. Dodaci i popravci oštećenja</h2>
            <div className="space-y-3">
              {addonLines.map((line) => (
