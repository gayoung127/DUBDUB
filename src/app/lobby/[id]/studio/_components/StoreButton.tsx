import Button from "@/app/_components/Button";
import { AudioFile, Track } from "@/app/_types/studio";

interface StoreButtonProps {
  tracks: Track[];
  assets: AudioFile[];
}
const StoreButton = ({ tracks, assets }: StoreButtonProps) => {
  function saveInfo() {
    console.log("save track = ", tracks);
    console.log("save assets = ", assets);
  }

  return (
    <>
      <Button onClick={saveInfo}>SAVE</Button>
    </>
  );
};

export default StoreButton;
