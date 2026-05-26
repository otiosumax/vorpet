import { useEffect, useState } from "react";
import StatisticsPlaceholderRepository from "../services/statisticsPlaceholderRepository";
import "../styles/statistics.css";
import Stat from "./stat";

type StatisticsValue = {
  hunger: number;
  mood: number;
  energy: number;
};

const statisticsRepository = new StatisticsPlaceholderRepository("placeholder");

export default function Statistics() {
  const [statistics, setStatistics] = useState<StatisticsValue>({
    hunger: 0,
    mood: 0,
    energy: 0,
  });

  useEffect(() => {
    let isMounted = true;

    async function updateStatistics() {
      const nextStatistics = await statisticsRepository.getStatistics();

      if (isMounted) {
        setStatistics(nextStatistics);
      }
    }

    updateStatistics();
    const intervalId = window.setInterval(updateStatistics, 2500);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <div id="statistics">
      <Stat name="Hunger" icon="🍽️" value={statistics.hunger} />
      <Stat name="Mood" icon="😊" value={statistics.mood} />
      <Stat name="Energy" icon="⚡" value={statistics.energy} />
    </div>
  );
}
