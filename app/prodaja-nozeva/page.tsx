export default function ProdajaNozeva() {
  return (
    <main style={{ padding: "40px", maxWidth: "1000px", margin: "0 auto" }}>
      <h1>Prodaja noževa</h1>

      <p>
        Nudimo Xinzuo kuhinjske noževe. Svi proizvodi označeni kao dostupni nalaze
        se kod nas i šalju se odmah.
      </p>

      <hr />

      <section>
        <h2>Xinzuo set (3 noža)</h2>
        <ul>
          <li>Količina: 5 setova</li>
          <li>Cijena: (upiši cijenu)</li>
        </ul>

        <p>
          <a href="mailto:INFO@DOMENA.HR?subject=Upit%20za%20Xinzuo%20set%20(3%20no%C5%BEa)">
            Pošalji upit za narudžbu
          </a>
        </p>
      </section>

      <hr />

      <section>
        <h2>Pojedinačni noževi</h2>
        <ul>
          <li>Količina: 6 kom</li>
          <li>Cijena: (upiši cijene po modelu)</li>
        </ul>

        <p>
          <a href="mailto:INFO@DOMENA.HR?subject=Upit%20za%20Xinzuo%20pojedina%C4%8Dni%20no%C5%BE">
            Pošalji upit za narudžbu
          </a>
        </p>
      </section>

      <hr />

      <p style={{ fontSize: "14px", opacity: 0.8 }}>
        Napomena: Noževi su nabavljeni direktno od proizvođača. Navedeni
        artikli su dostupni odmah. Za artikle po narudžbi rok isporuke može biti
        oko 30 dana.
      </p>
    </main>
  );
}
