import "../styles/statistics.css";
import Stat from "./stat";

export default function Statistics() {
  return (
    <div id="statistics">
      <Stat name="Hunger" icon="🍽️" value={67} />
      <Stat name="Mood" icon="😊" value={69} />
      <Stat name="Energy" icon="⚡" value={42} />
    </div>
  );
}
