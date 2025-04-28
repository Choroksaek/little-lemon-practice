import { useState, useEffect, useRef, useReducer } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

// 1. Reducer 타입 정의
type ReservationState = {
  status: "idle" | "loading" | "success" | "error";
};

type Action =
  | { type: "SUBMIT" }
  | { type: "SUCCESS" }
  | { type: "ERROR" }
  | { type: "RESET" };

// 2. Reducer 함수 만들기
const reservationReducer = (state: ReservationState, action: Action): ReservationState => {
  switch (action.type) {
    case "SUBMIT":
      return { status: "loading" };
    case "SUCCESS":
      return { status: "success" };
    case "ERROR":
      return { status: "error" };
    case "RESET":
      return { status: "idle" };
    default:
      return state;
  }
};

// 3. 컴포넌트 본체
export default function ReservationForm() {
  // 입력값 상태
  const [name, setName] = useState("");
  const [guests, setGuests] = useState(1);
  const [date, setDate] = useState("");

  // 예약 진행 상태
  const [state, dispatch] = useReducer(reservationReducer, { status: "idle" });

  // 이름 인풋 ref
  const nameInputRef = useRef<HTMLInputElement>(null);

  // 예약 성공 후 메시지 사라지게
  useEffect(() => {
    if (state.status === "success") {
      const timer = setTimeout(() => {
        dispatch({ type: "RESET" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state.status]);

  // 제출 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: "SUBMIT" });

    // 간단한 유효성 체크
    setTimeout(() => {
      if (name.trim() && date) {
        dispatch({ type: "SUCCESS" });
        setName("");
        setGuests(1);
        setDate("");
        nameInputRef.current?.focus(); // 포커스 이동
      } else {
        dispatch({ type: "ERROR" });
      }
    }, 1000);
  };

  // 4. 화면
  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <Input
        ref={nameInputRef}
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        type="number"
        placeholder="Guests"
        value={guests}
        min={1}
        onChange={(e) => setGuests(parseInt(e.target.value))}
      />
      <Input
        type="date"
        placeholder="Date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <Button type="submit" disabled={state.status === "loading"}>
        {state.status === "loading" ? "Reserving..." : "Reserve"}
      </Button>

      {state.status === "success" && (
        <Alert variant="default">🎉 Reservation successful!</Alert>
      )}
      {state.status === "error" && (
        <Alert variant="destructive">❌ Please fill out all fields correctly.</Alert>
      )}
    </form>
  );
}
