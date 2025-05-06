
interface FilterButtonProps {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

export function FilterButton({ children, active, onClick }: FilterButtonProps) {
  return (
    <button
      className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
        active 
          ? "bg-[#7f1184] text-white" 
          : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
      }`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
