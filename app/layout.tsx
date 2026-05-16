import "./globals.css";

export const metadata = {
  title: "NextCard",
  description: "AI-powered flashcards and quizzes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
