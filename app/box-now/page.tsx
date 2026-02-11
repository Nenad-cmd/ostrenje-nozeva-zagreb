

"use client";

export default function BoxNowPage() {
  const copyRecipient = async () => {
    const text = `Paketomat: Dubrava 222, Zagreb
Ime: Byway
Mobitel: +385 95 910 5056
E-mail: bruslab3@gmail.com`;

    try {
      await navigator.clipboard.writeText(text);
      alert("Podaci za primatelja su kopirani ✔️");
    } catch {
      alert("Kopiranje nije uspjelo. Kopiraj ručno.");
    }
  };

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
        Slanje noževa na oštrenje je jednostavno. Slijedi ove korake kako bi paket sigurno stigao na obradu.
      </p>

      <section style={{ marginTop: 24 }}>
        <h2>Koraci slanja</h2>

        <ol style={{ paddingLeft: 18 }}>
          <li>
            <strong>Zapakiraj noževe</strong>
            <ul>
              <li>Zaštiti oštrice kartonom ili papirom</li>
              <li>Učvrsti ljepljivom trakom da se ne pomiču</li>
              <li>Stavi u čvrstu kutiju </li>
            </ul>
          </li>

          <li>
            <strong>Prijavi se na BOX NOW</strong>
            <ul>
              <li>Na BOX NOW stranici registriraj se ili se prijavi u sustav</li>
            </ul>
          </li>

          <li>
            <strong>Klikni na “Pošalji”</strong>
            <ul>
              <li>Odaberi veličinu paketa <strong>S / M / L</strong></li>
              <li>
               Unesi svoje podatke
              </li>
            </ul>
          </li>

          <li>
            <strong>Unesi podatke primatelja</strong>
            <ul>
              <li>
                <strong>Primatelj:</strong>
                <br />
                Paketomat: <strong>Dubrava 222, Zagreb</strong>
                <br />
                Ime: <strong>Byway</strong>
                <br />
                Mobitel: <strong>+385 95 910 5056</strong>
                <br />
                E-mail: <strong>bruslab3@gmail.com</strong>
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
            </ul>
          </li>

          <li>
            <strong>Plaćanje pošiljke</strong>
            <ul>
              <li>Nakon unosa podataka slijedi plaćanje pošiljke</li>
            </ul>
          </li>
<li>
  <strong>Broj za praćenje (SMS)</strong>
  <ul>
    <li>
      Nakon plaćanja dobivaš SMS s brojem  pošiljke.
    </li>
    <li>
      Isti broj dobivaš i na e-mail zajedno s naljepnicom za ispis.
    </li>
    <li>
      Ako nemaš pisač, <strong>jasno napiši broj paketa markerom</strong> na paket.
    </li>
    <li>
      Taj broj <strong>zapiši ili zalijepi na paket</strong>, a isti broj kasnije utipkaj i na BOX NOW paketomatu.
    </li>
  </ul>
</li>


          <li>
            <strong>Predaja paketa na paketomatu</strong>
            <ul>
              <li>Dođi do BOX NOW paketomata</li>
              <li>Upiši ili zalijepi broj za praćenje </li>
              <li>Ubaci paket u pretinac i <strong>zatvori vratašca</strong></li>
            </ul>
          </li>

          <li>
            <strong>Povrat nakon oštrenja</strong>
            <ul>
              <li>Rok obrade: 24–48 h od primitka paketa</li>
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
