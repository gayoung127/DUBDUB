import Button from "@/app/_components/Button";
import { Asset, AudioFile, Track } from "@/app/_types/studio";

interface StoreButtonProps {
  tracks: Track[];
  assets: Asset[];
}
const StoreButton = ({ tracks, assets }: StoreButtonProps) => {
  function saveInfo() {
    console.log("save track = ", tracks);
    console.log("save assets = ", assets);

    const workSpaceData = {
      assets: [...assets],
      tracks: [...tracks],
    };
    console.log("send data = ", workSpaceData);
  }

  return (
    <>
      <Button onClick={saveInfo}>SAVE</Button>
    </>
  );
};

export default StoreButton;

/*
saveData : {
    "assets": [
        {
        "id": "에셋 ID", 
        "url": "AudioBuffer 바이너리 코드",
        "duration":10,
        },
        {
        "id": "에셋 ID",
        "url": "AudioBuffer 바이너리 코드"
        "duration" : 3.4,
        },
        {
        "id": "에셋 ID",
        "url": "AudioBuffer 바이너리 코드"
        "duration" : 2.22,
        }
    ],

    "tracks": [
    {
      "trackId": 1,
      "recorderId": "이 트랙에 녹음하고 있는 참여자 ID",
    
      "files": [
        {
          "id": "오디오블록ID",
          "url": "에셋ID",
          "startPoint": 0,
          "duration": 5.0,
          "trimStart": 0.5,
          "trimEnd": 0.2,
          "volume": 1
        }
      ]
    },
    {
      "trackId": 2,
      "recorderId": "이 트랙에 녹음하고 있는 참여자 ID",
      "files": [
        {
          "id": "오디오블록ID",
          "url": "에셋ID",
          "startPoint": 0,
          "duration": 5.0,
          "trimStart": 0.5,
          "trimEnd": 0.2,
          "volume": 1
        },
        {
          "id": "오디오블록ID",
          "url": "에셋ID",
          "startPoint": 0,
          "duration": 5.0,
          "trimStart": 0.5,
          "trimEnd": 0.2,
          "volume": 1
        }
      ]
    }
  ]
}

*/
