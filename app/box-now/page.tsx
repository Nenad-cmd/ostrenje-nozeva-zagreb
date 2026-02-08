"use client";

export default function BoxNowPage() {
  return (
    <main
      style={{
        maxWidth: 760,
        margin: "0 auto",
        padding: 24,
        fontFamily: "system-ui, sans-serif",
        lineHeight: 1.6,
      }}
    >
      <h1 style={{ marginTop: 0 }}>Kako poslati noževe putem BOX NOW paketomata</h1>

      <p style={{ opacity: 0.85 }}>
        Slanje noževa na oštrenje je brzo i jednostavno. Slijedi ove korake i paket će sigurno stići.
      </p>

      <section style={{ marginTop: 24 }}>
        <h2>Koraci slanja</h2>
        const copyRecipient = async () => {
  const text = `Primatelj: Byway
E-mail: bruslab3@gmail.com
Paketomat: Dubrava 222, Zagreb`;

  try {
    await navigator.clipboard.writeText(text);
    alert("Podaci za primatelja su kopirani ✔️");
  } catch {
    alert("Kopiranje nije uspjelo. Kopiraj ručno.");
  }
};

        <ol style={{ paddingLeft: 18 }}>
          <li>
            <strong>Zapakiraj noževe</strong>
            <ul>
              <li>Zaštiti oštrice kartonom ili papirom</li>
              <li>Učvrsti ljepljivom trakom da se ne pomiču</li>
              <li>Stavi u čvrstu kutiju (ne u kovertu)</li>
            </ul>
          </li>

          <li>
            <strong>Dođi do BOX NOW paketomata</strong>
            <ul>
              <li>Odaberi najbližu BOX NOW lokaciju</li>
            </ul>
          </li>

         <li>
  <strong>Unesi podatke za slanje</strong>
  <ul>
    <li>
      <strong>Primatelj (kome šalješ paket):</strong><br />
      Byway<br />
      E-mail: bruslab3@gmail.com<br />
      Paketomat: <strong>Dubrava 222, Zagreb</strong>
      <div style={{ marginTop: 10 }}>
  <button
    onClick={copyRecipient}
    style={{
      padding: "8px 12px",
      borderRadius: 8,
      border: "1px solid #111",
      background: "#fff",
      cursor: "pointer",
      fontWeight: 600,
    }}
  >
    📋 Kopiraj podatke za primatelja
  </button>
</div>

    </li>
    <li style={{ marginTop: 8 }}>
      <strong>Pošiljatelj (ti):</strong><br />
      Upiši svoje ime i svoj mobitel ili e-mail
    </li>
    <li style={{ marginTop: 8 }}>
      <strong>Paketomat za povrat:</strong><br />
      Odaberi <strong>svoj</strong> najbliži BOX NOW paketomat (gdje želiš preuzeti paket natrag)
    </li>
    <li style={{ marginTop: 8 }}>
      <strong>Napomena:</strong><br />
      Upiši svoje ime i šifru narudžbe
    </li>
  </ul>
</li>


          <li>
            <strong>Pošalji paket</strong>
            <ul>
              <li>Spremi kod za praćenje pošiljke</li>
            </ul>
          </li>

          <li>
            <strong>Povrat nakon oštrenja</strong>
            <ul>
              <li>Povrat ide na paketomat koji navedeš u narudžbi</li>
              <li>
                <strong>4+ kom oštrenja → povrat besplatan</strong>
              </li>
            </ul>
          </li>
        </ol>
      </section>

      <section style={{ marginTop: 32, paddingTop: 16, borderTop: "1px solid #eee" }}>
        <h2>Važne napomene</h2>
        <ul>
          <li>❗ Ne slati noževe u omotnicama</li>
          <li>❗ Dobro zaštiti oštrice radi sigurnosti</li>
          <li>✔ Rok obrade: 24–48 h od primitka</li>
        </ul>
      </section>

      <section style={{ marginTop: 32, paddingTop: 16, borderTop: "1px solid #eee" }}>
        <a
          href="/"
          style={{
            display: "inline-block",
            padding: "12px 14px",
            borderRadius: 10,
            border: "1px solid #111",
            color: "#111",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          ← Povratak na narudžbu
        </a>
      </section>
    </main>
  );
}

