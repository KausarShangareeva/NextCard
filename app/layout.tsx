import "./globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";
import ConditionalChrome from "@/components/layout/ConditionalChrome";
import { DemoModalProvider } from "@/components/demo-modal/DemoModalProvider";

const jakarta = Plus_Jakarta_Sans({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata = {
  title: "NextCard — Role-based compliance training, automated",
  description:
    "AMLR 2024/1624-aligned, role-based compliance training programs generated automatically for every employee at banks, fintech and real-estate firms.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className={jakarta.className}>
        <DemoModalProvider>
          <ConditionalChrome>{children}</ConditionalChrome>
        </DemoModalProvider>
      </body>
    </html>
  );
}
