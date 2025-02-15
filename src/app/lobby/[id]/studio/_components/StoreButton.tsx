import { postProjectData } from "@/app/_apis/studio";
import Button from "@/app/_components/Button";
import { Asset, AudioFile, Track } from "@/app/_types/studio";
import { useParams } from "next/navigation";

interface StoreButtonProps {
  tracks: Track[];
  assets: Asset[];
}
const StoreButton = ({ tracks, assets }: StoreButtonProps) => {
  const params = useParams();
  const pid = params.id;

  async function saveInfo() {
    console.log("save track = ", tracks);
    console.log("save assets = ", assets);

    const workSpaceData = {
      assets: assets,
      tracks: tracks.map((track) => ({
        trackId: track.trackId,
        recorderId: track.recorderId,
        blockColor: track.blockColor,
        waveColor: track.waveColor,
        files: track.files,
      })),
    };

    await postProjectData(String(pid), workSpaceData);
    console.log("send data = ", workSpaceData);
  }

  return (
    <>
      <Button onClick={saveInfo}>SAVE</Button>
    </>
  );
};

export default StoreButton;
