export default function ProdajaNozeva() {
  const products = [
    {
      title: "Xinzuo set – 3 noža",
      price: 150,
      img: "/nozevi/set-3.jpg",
      alt: "Xinzuo set od 3 noža",
      note: "Set od 3 kuhinjska noža.",
      mailSubject: "Upit za Xinzuo set (3 noža)",
      mailBody:
        "Pozdrav,%0A%0AZainteresiran/a sam za Xinzuo set (3 noža) – 150 €.%0A%0AIme i prezime:%0ATelefon:%0AAdresa za dostavu:%0A%0AHvala!",
    },
    {
      title: "Xinzuo Parry nož",
      price: 40 ,
      img: "/nozevi/parry.jpg",
      alt: "Xinzuo Parry nož",
      note: "Manji kuhinjski nož (Parry).",
      mailSubject: "Upit za Xinzuo Parry nož",
      mailBody:
        "Pozdrav,%0A%0AZainteresiran/a sam za Xinzuo Parry nož – 40 €.%0A%0AIme i prezime:%0ATelefon:%0AAdresa za dostavu:%0A%0AHvala!",
    },
    {
      title: "Xinzuo Nakiri nož",
      price: 60 ,
      img: "/nozevi/nakiri.jpg",
      alt: "Xinzuo Nakiri nož",
      note: "Nakiri – idealan za povrće.",
      mailSubject: "Upit za Xinzuo Nakiri nož",
      mailBody:
        "Pozdrav,%0A%0AZainteresiran/a sam za Xinzuo Nakiri nož – 60 € .%0A%0AIme i prezime:%0ATelefon:%0AAdresa za dostavu:%0A%0AHvala!",
    },
    {
      title: "Dijamantni oštrač",
      price: 40 ,
      img: "/nozevi/ostrac-dijamantni.jpg",
      alt: "Dijamantni oštrač",
      note: "Dijamantni oštrač za održavanje oštrine.",
      mailSubject: "Upit za dijamantni oštrač",
      mailBody:
        "Pozdrav,%0A%0AZainteresiran/a sam za dijamantni oštrač – 40 €.%0A%0AIme i prezime:%0ATelefon:%0AAdresa za dostavu:%0A%0AHvala!",
    },
  ];

  const eur = (n: number) =>
    new Intl.NumberFormat("hr-HR", { style: "currency", currency: "EUR" }).format(n);

  return (
    <main style={{ maxWidth: 1020, margin: "0 auto", padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ marginTop: 0 }}>Prodaja noževa</h1>

      <p style={{ opacity: 0.9, lineHeight: 1.6, marginTop: 6 }}>
        Trenutno u ponudi: Xinzuo noževi i dijamantni oštrač. Za narudžbu pošaljite upit e-mailom.
      </p>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 16,
          marginTop: 18,
        }}
      >
        {products.map((p) => (
          <article key={p.title} style={{ border: "1px solid #ddd", borderRadius: 12, overflow: "hidden" }}>
            {/* Slika (ako ne postoji, vidjet ćeš alt/blank, ali stranica radi) */}
            <div style={{ width: "100%", height: 190, background: "#f5f5f5" }}>
              <img
                src={p.img}
                alt={p.alt}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>

            <div style={{ padding: 14 }}>
              <h2 style={{ margin: "0 0 6px 0", fontSize: 18 }}>{p.title}</h2>

              <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 6 }}>{eur(p.price)}</div>

              <div style={{ fontSize: 13, opacity: 0.8, lineHeight: 1.45, minHeight: 36 }}>{p.note}</div>

              <div style={{ marginTop: 12 }}>
                <a
                  href={`mailto:bruslab3@gmail.com?subject=${encodeURIComponent(p.mailSubject)}&body=${p.mailBody}`}
                  style={{
                    display: "inline-block",
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: "1px solid #111",
                    textDecoration: "none",
                    color: "#111",
                    fontWeight: 800,
                    width: "100%",
                    textAlign: "center",
                    boxSizing: "border-box",
                  }}
                >
                  Pošalji upit
                </a>
              </div>
            </div>
          </article>
        ))}
      </section>

      <p style={{ fontSize: 12, opacity: 0.75, marginTop: 18 }}>
        Napomena: Dostava i plaćanje po dogovoru (preporuka: uplata na račun). Račun/ potvrda po potrebi.
      </p>

      <p style={{ marginTop: 18 }}>
        <a href="/" style={{ textDecoration: "underline", color: "#111", fontWeight: 600 }}>
          ← Povratak na početnu
        </a>
      </p>
    </main>
  );
}
