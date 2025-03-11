interface OptionProps {
  option: string;
  isSelected: boolean;
  onClick: () => void;
}

export default function MatchingOption({
  option,
  isSelected,
  onClick,
}: OptionProps) {
  return (
    <button
      onClick={onClick}
      className={`
        relative flex flex-col
        mb-2 w-full max-w-[424px]
        h-[80px] 
        bg-[#f9fafb] rounded-lg 
        text-[15px] md:text-[16px] 
        px-4 gap-1 justify-center text-start
        ${
          isSelected
            ? "shadow-lg text-main border border-solid border-main"
            : ""
        }
      `}
    >
      <div className="flex items-center justify-center">
        <p className="font-medium">{option}</p>
      </div>
    </button>
  );
}
