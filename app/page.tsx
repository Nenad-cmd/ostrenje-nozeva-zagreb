"use client";

export default function Page() {
  return (
    <main style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h1>TEST STRANICA – OVO JE NOVI SADRŽAJ</h1>

      <h2>Kontakt upit (e-mail)</h2>

      <form action="mailto:bruslab3@gmail.com" method="POST" encType="text/plain">
        <textarea
          name="Poruka"
          rows={5}
          placeholder="Ovdje upišite poruku…"
          style={{ width: "100%", padding: 10 }}
        />
        <br /><br />
        <button type="submit">Pošalji e-mail</button>
      </form>
    </main>
  );
}
