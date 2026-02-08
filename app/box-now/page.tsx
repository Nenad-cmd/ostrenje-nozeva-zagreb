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
              <li>Primatelj: <strong>BrusLab</strong></li>
              <li>Kontakt: e-mail ili mobitel (tvoj)</li>
              <li>
                U napomenu upiši: <em>ime, prezime + šifru narudžbe</em>
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

