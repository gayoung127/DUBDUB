export default function StudioPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className="flex min-h-screen select-none flex-col items-center overflow-y-hidden"
      style={{ cursor: "url('/images/icons/cursor-self.svg'), auto" }}
    >
      {children}
    </div>
  );
}
