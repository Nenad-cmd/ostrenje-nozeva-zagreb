export const metadata = {
  title: "Oštrenje noževa Zagreb | Byway",
  description:
    "Profesionalno oštrenje noževa u Zagrebu. Brza obrada (24–48 h). Slanje i povrat putem BOX NOW paketomata ili osobna predaja uz najavu.",
   icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Oštrenje noževa Zagreb | Byway",
    description:
      "Brza obrada (24–48 h). BOX NOW slanje/povrat ili osobna predaja uz najavu.",
    url: "https://www.ostrenje-nozeva-zagreb.com.hr/",
    siteName: "Byway",
    type: "website",
    images: [
      {
        url: "/hero.webp",
        width: 1200,
        height: 630,
        alt: "Oštrenje noževa Zagreb – Byway",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hr">
      export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hr">
      <body style={{ backgroundColor: "#f2f2f2" }}>
        {children}
      </body>
    </html>
  );
}
        {children}
      </body>
    </html>
  );
}
