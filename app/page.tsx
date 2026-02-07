"use client";

export default function Page() {
  return (
    <main style={{ padding: 40, fontFamily: "system-ui, sans-serif", maxWidth: 800, margin: "0 auto" }}>
      <h1>Oštrenje noževa Zagreb</h1>

      <p>
        Profesionalno oštrenje noževa i škara.  
        Slanje i povrat putem BOX NOW paketomata.
      </p>

      <h2>Kontakt upit (e-mail)</h2>
      <p><strong>Preferirani kontakt:</strong> e-mail</p>
      <p>📧 <a href="mailto:bruslab3@gmail.com">bruslab3@gmail.com</a></p>

      <form
        action="mailto:bruslab3@gmail.com"
        method="POST"
        encType="text/plain"
        style={{ marginTop: 20 }}
      >
        <div style={{ marginBottom: 12 }}>
          <label>Poruka</label><br />
          <textarea
            name="Poruka"
            rows={6}
            placeholder="Npr. broj noževa, vrsta (58+ HRC, nazubljeni), paketomat za povrat…"
            style={{ width: "100%", padding: 10 }}
            required
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
    </main>
  );
}
