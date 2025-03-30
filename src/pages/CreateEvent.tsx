
import { CreateEventForm } from "@/components/events/CreateEventForm";

export default function CreateEvent() {
  return (
    <div className="container max-w-2xl mx-auto px-4 py-6">
      <div className="mb-8 text-center">
        <img src="/lovable-uploads/65f3a573-3b4d-4ec7-90e5-78fab77b800d.png" alt="DAP Logo" className="w-16 h-16 mx-auto mb-4" />
        <h1 className="text-2xl font-bold">イベントを作成</h1>
      </div>

      <CreateEventForm />
    </div>
  );
}
