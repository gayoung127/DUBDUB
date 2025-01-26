interface BadgeProps {
  isSelected?: boolean;
  title: string;
}

const Badge = ({ isSelected, title }: BadgeProps) => {
  const badgeData = [
    { id: 1, name: "액션", backgroundColor: "#FFF3E0", textColor: "#F57800" },
    { id: 2, name: "코믹", backgroundColor: "#FFF9E7", textColor: "#FAA131" },
    { id: 3, name: "스릴러", backgroundColor: "#E8F3FF", textColor: "#1B64DA" },
    { id: 4, name: "공포", backgroundColor: "#EDF8F8", textColor: "#0C8585" },
    { id: 5, name: "로맨스", backgroundColor: "#F9F0FC", textColor: "#8222A2" },
    { id: 6, name: "SF", backgroundColor: "#FCF0F4", textColor: "#FF2D73" },
    { id: 7, name: "판타지", backgroundColor: "#DADFFF", textColor: "#2442FF" },
    { id: 8, name: "일상", backgroundColor: "#D6F1FF", textColor: "#0070AA" },
    { id: 9, name: "영화", backgroundColor: "#3C534A", textColor: "#A2E9CC" },
    {
      id: 10,
      name: "애니메이션",
      backgroundColor: "#643058",
      textColor: "#E264E0",
    },
    {
      id: 11,
      name: "다큐멘터리",
      backgroundColor: "#774418",
      textColor: "#FFAE75",
    },
    {
      id: 12,
      name: "드라마",
      backgroundColor: "#265A24",
      textColor: "#53FF5C",
    },
    {
      id: 13,
      name: "광고/CF",
      backgroundColor: "#2F0C70",
      textColor: "#C7C0FA",
    },
    {
      id: 14,
      name: "ON AIR",
      backgroundColor: "#FFEEEE",
      textColor: "#D22030",
    },
    {
      id: 15,
      name: "대기중",
      backgroundColor: "#EFEFEF",
      textColor: "#6D6D6D",
    },
    { id: 16, name: "기타", backgroundColor: "#EFEFEF", textColor: "#6D6D6D" },
    { id: 17, name: "PRO", backgroundColor: "#FFDACE", textColor: "#DE4B1B" },
  ];

  const badge = badgeData.find((b) => b.name === title);

  return (
    <div
      className="inline-flex h-[25px] items-center justify-center rounded-[4px] px-3"
      style={{
        backgroundColor: badge?.backgroundColor || "#EFEFEF",
        color: badge?.textColor || "#6D6D6D",
        outline: isSelected
          ? `2px solid ${badge?.textColor || "#6D6D6D"}`
          : "none",
      }}
    >
      {badge?.name || title}
    </div>
  );
};

export default Badge;
