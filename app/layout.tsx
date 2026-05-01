import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wedding Invitation Automation",
  description: "Personalized wedding invitation image generator",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
