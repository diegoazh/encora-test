export interface JwtPayload {
  sub: string;
  username: string;
  email: string;
}

export interface JwtDecrypted {
  email: string;
  userid: string;
  username: string;
}
