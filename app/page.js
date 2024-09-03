import "./global.css"
import ImageDetector from "./image";

export default function Home() {
  return (
    <div className="container">
      <h2>Image Detection (Birds Only)</h2>
      <ImageDetector/>
    </div>
  );
}
