import http from "~/api/core";
import type { AuthRequest, AuthResponse } from "~/types/auths";

export const postAuth = (authReq: AuthRequest): Promise<AuthResponse> =>
  http.post("/auth", {
    data: authReq,
  });

export const postAuthAnonymous = (): Promise<AuthResponse> =>
  http.post("/auth/anonymous");

export const postLogout = (): Promise<AuthResponse> => http.post("/logout");
