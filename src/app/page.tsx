import Card from "./_components/Card";
import Header from "./_components/Header";

export default function Home() {
  return (
    <div className="flex h-screen w-full flex-col bg-gray-600">
      <Header />
      <a href="/detail">상세 조회</a>
      <Card />
    </div>
  );
}
