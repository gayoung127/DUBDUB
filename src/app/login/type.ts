export interface UserProfile {
  id: string;
  nickname: string;
  profileImage: string | null;
  userType: string;
  isTermsAgreed: boolean;
}
