
interface EmptyTabContentProps {
  message: string;
}

export function EmptyTabContent({ message }: EmptyTabContentProps) {
  return (
    <div className="text-center py-8 text-gray-500">
      {message}
    </div>
  );
}
