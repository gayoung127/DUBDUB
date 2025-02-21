import { Asset, AudioFile } from "../_types/studio";

interface Users {
  memberId: number | null;
  email: string | null;
  nickName: string | null;
  position: string | null;
  profileUrl: string | null;
}

function getBaseName(input: string) {
  return input.split("(")[0];
}

function getAssetsNum(input: string): number {
  const match = input.match(/\((\d+)\)/);

  if (match && match[1]) {
    return parseInt(match[1], 10);
  }
  return 0;
}

export function findPossibleId(
  audioFiles: Asset[] | null,
  users: Users[],
  role: string,
) {
  if (!audioFiles) {
    return "0";
  }

  let cnt = 0;

  for (const file of audioFiles) {
    const fileId = String(file.id);
    const baseName = getBaseName(fileId);
    if (baseName != role) {
      continue;
    }
    const assets = getAssetsNum(fileId);
    cnt = Math.max(cnt, assets);
  }

  cnt++;
  return role + "(" + cnt + ")";
}
