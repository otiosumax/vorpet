import { useEffect, useState } from "react";
import { useStatisticsStore } from "../store/statisticsStore";
import "../styles/statistics.css";
import Stat from "./stat";

type StatisticsValue = {
  mood: string;
  experience: number;
  level: number;
};

const moodPercentByName: Record<string, number> = {
  happy: 100,
  excited: 85,
  tired: 45,
  sad: 25,
};

export default function Statistics() {
  const [statistics, setStatistics] = useState<StatisticsValue>({
    mood: "happy",
    experience: 0,
    level: 1,
  });

  useEffect(() => {
    let isMounted = true;
    const statisticsStore = useStatisticsStore;

    async function updateStatistics() {
      const nextStatistics = await statisticsStore.loadStatistics();

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
      <Stat
        name={`Mood: ${statistics.mood}`}
        icon="😊"
        value={moodPercentByName[statistics.mood] ?? 50}
      />
      <Stat name="Experience" icon="⭐" value={statistics.experience % 100} />
      <Stat name="Level" icon="🏆" value={Math.min(statistics.level * 10, 100)} />
    </div>
  );
}
