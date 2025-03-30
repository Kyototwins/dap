
import { CreateEventForm } from "@/components/events/CreateEventForm";

export default function CreateEvent() {
  return (
    <div className="container max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-6">イベントを作成</h1>
      <CreateEventForm />
    </div>
  );
}
