"use client";

import { useEffect, useState } from "react";
import PeriodCalendar from "@/components/PeriodTracker/PeriodCalendar";
import { predictNextCycle } from "@/lib/predictCycle";

export default function PredictPeriodPage() {
  const [predictedDates, setPredictedDates] = useState([]);

  useEffect(() => {
    const fetchPrediction = async () => {
      const res = await fetch("/api/period-tracker/predict");
      const data = await res.json();
      setPredictedDates(data.predictions || []);
    };
    fetchPrediction();
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">🔮 Predicted Period Dates</h1>
      <PeriodCalendar markedDates={predictedDates} />
    </main>
  );
}