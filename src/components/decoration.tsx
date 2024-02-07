import WindowControl from "./WindowControl";
import { Card } from "./ui/card";

const Decoration = () => {
  return (
    <Card data-tauri-drag-region className="flex justify-between border rounded-none">
      <div className="select-none pointer-events-none font-bold self-center ml-4 text-lg">Unicontrol</div>
      <div></div>
      <div><WindowControl /></div>
    </Card>
  );
};

export default Decoration;
