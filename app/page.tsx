
export default function Home() {
  return (
    <main style={{ padding: 40, fontFamily: 'sans-serif' }}>
      <h1>Oštrenje noževa Zagreb</h1>
      <p>Stranica je uspješno postavljena. Uskoro više sadržaja.</p><section style={{ marginTop: 40 }}>
  <h2>Kontakt upit (e-mail)</h2>

  <p style={{ fontWeight: 600 }}>
    Preferirani kontakt: e-mail
  </p>
  <p>
    📧 <a href="mailto:bruslab3@gmail.com">bruslab3@gmail.com</a>
  </p>

  <form
    action="mailto:bruslab3@gmail.com"
    method="POST"
    encType="text/plain"
    style={{ maxWidth: 500 }}
  >
    <input
      type="hidden"
      name="Predmet"
      value={`Upit za oštrenje noževa – ${code}`}
    />

    <div style={{ marginBottom: 12 }}>
      <label>Ime i prezime</label><br />
      <input
        type="text"
        name="Ime i prezime"
        required
        style={{ width: "100%", padding: 10 }}
      />
    </div>

    <div style={{ marginBottom: 12 }}>
      <label>E-mail</label><br />
      <input
        type="email"
        name="E-mail"
        required
        style={{ width: "100%", padding: 10 }}
      />
    </div>

    <div style={{ marginBottom: 12 }}>
      <label>Poruka</label><br />
      <textarea
        name="Poruka"
        rows={5}
        required
        placeholder="Npr. broj noževa, vrsta (58+ HRC, nazubljeni), paketomat za povrat, rok…"
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

  <p style={{ fontSize: 12, opacity: 0.75, marginTop: 8 }}>
    Odgovaram putem e-maila u najkraćem mogućem roku.
  </p>
</section>

    </main>
  );
}

