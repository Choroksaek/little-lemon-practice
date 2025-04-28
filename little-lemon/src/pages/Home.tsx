import ReservationForm from "@/components/ReservationForm";

export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Welcome to Little Lemon 🍋</h1>
      <p>We serve delicious Mediterranean food.</p>

      {/* Form 추가 */}
      <div className="mt-8">
        <ReservationForm />
      </div>
    </main>
  );
}
