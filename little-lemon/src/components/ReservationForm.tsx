import { useState, useEffect, useRef, useReducer } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

type ReservationState = {
  status: "idle" | "loading" | "success" | "error";
};

type Action =
  | { type: "SUBMIT" }
  | { type: "SUCCESS" }
  | { type: "ERROR" }
  | { type: "RESET" };

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

export default function ReservationForm() {
  const [name, setName] = useState("");
  const [guests, setGuests] = useState(1);
  const [date, setDate] = useState("");
  const nameInputRef = useRef<HTMLInputElement>(null);

  const [state, dispatch] = useReducer(reservationReducer, { status: "idle" });

  useEffect(() => {
    if (state.status === "success") {
      const timer = setTimeout(() => {
        dispatch({ type: "RESET" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state.status]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: "SUBMIT" });

    // simulate network delay
    setTimeout(() => {
      if (name.trim() !== "" && date !== "") {
        dispatch({ type: "SUCCESS" });
        setName("");
        setDate("");
        setGuests(1);
        nameInputRef.current?.focus();
      } else {
        dispatch({ type: "ERROR" });
      }
    }, 1000);
  };

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
        <Alert variant="destructive">❌ Please fill out all fields.</Alert>
      )}
    </form>
  );
}
