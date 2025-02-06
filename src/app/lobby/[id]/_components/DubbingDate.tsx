interface DubbingDateProps {
  dubbingDate: string;
}

const DubbingDate = ({ dubbingDate }: DubbingDateProps) => {
  return <div className="pl-1 text-lg text-gray-400">DATE {dubbingDate}</div>;
};

export default DubbingDate;
