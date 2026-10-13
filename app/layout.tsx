import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL || "https://digiventures.ir"),
  title: {
    default: "دیجی‌ونچرز | صندوق سرمایه‌گذاری جسورانه شرکتی (CVC)",
    template: "%s | دیجی‌ونچرز",
  },
  description:
    "دیجی‌ونچرز — صندوق سرمایه‌گذاری جسورانه شرکتی (CVC) گروه دیجی‌کالا بر آینده تجارت الکترونیک، فین‌تک و هوش مصنوعی",
  icons: {
    icon: "/assets/images/digiventures-favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className="bg-white text-slate-900 font-sans antialiased selection:bg-brand-green selection:text-white">
        {children}
      </body>
    </html>
  );
}
