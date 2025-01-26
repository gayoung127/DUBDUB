export interface RoleData {
  id: string;
  role: string;
  nickname?: string | null; // 통일된 타입
  profileImage?: string | null;
  selectedBy?: string | null;
}
export interface ScriptData {
  role: string;
  script: string;
}
