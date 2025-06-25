export interface UserProfile {
  id: string;
  nickname: string;
  profileImage: string | null;
  userType: string;
  isTermsAgreed: boolean;
}

export interface Kakao {
  init: (key: string) => void;
  isInitialized: () => boolean;
  Auth: {
    login: (options: {
      success: (auth: { access_token: string }) => void;
      fail: (error: any) => void;
    }) => void;
    authorize: (options: { redirectUri: string }) => void;
    logout: (callback?: () => void) => void;
  };
}

declare global {
  interface Window {
    Kakao: Kakao;
  }
}
