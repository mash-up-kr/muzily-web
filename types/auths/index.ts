export type SocialType = "KAKAO";

export interface AuthRequest {
  code: string;
  redirectUri: string;
  socialType: SocialType;
}

export interface AuthResponse {
  memberId: number;
  token: string;
}
