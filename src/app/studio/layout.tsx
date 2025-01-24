import Header from "../_components/Header";

export default function StudioPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className="flex min-h-screen select-none flex-col items-center overflow-hidden bg-gray-400"
      style={{ cursor: "url('/images/icons/cursor-self.svg'), auto" }}
    >
      {children}
    </div>
  );
}
