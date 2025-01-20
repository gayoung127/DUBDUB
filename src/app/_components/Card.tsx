"use client";
import { useEffect, useState } from "react";
export default function Card() {
  const [cardNumber, setCardNumber] = useState<number>(0);
  useEffect(() => {
    setCardNumber(1);
    console.log(cardNumber);
  }, [cardNumber, setCardNumber]);
  return <div>{cardNumber}</div>;
}
