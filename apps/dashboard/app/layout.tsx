import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Neuro + Dashboard",
  description: "Painel principal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
