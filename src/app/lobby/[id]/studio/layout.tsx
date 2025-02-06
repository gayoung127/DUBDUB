export default function StudioPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-full min-h-screen select-none flex-col items-center overflow-y-hidden">
      {children}
    </div>
  );
}
