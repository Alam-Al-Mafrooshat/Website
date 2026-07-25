import "../globals.css";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar-IQ" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
