interface TitleProps {
  title: string;
}

const Title = ({ title }: TitleProps) => {
  return (
    <div className="pl-1 pt-3 text-4xl font-bold text-gray-400">{title}</div>
  );
};

export default Title;
