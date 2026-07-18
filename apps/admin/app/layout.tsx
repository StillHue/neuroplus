import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Neuro + Admin",
  description: "Painel de administração",
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
