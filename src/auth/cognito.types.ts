export type CognitoAuthToken = {
  access_token: string;
  id_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: number;
};

export type IdToken = {
  at_hash: string;
  sub: string;
  'cognito:groups': string[];
  iss: string;
  'cognito:username': string;
  nonce: string;
  origin_jti: string;
  aud: string;
  identities: Array<{
    userId: string;
    providerName: string;
    providerType: string;
    issuer: string | null;
    primary: string;
    dateCreated: string;
  }>;
  token_use: string;
  auth_time: number;
  exp: number;
  'custom:whitelisted_db': string;
  iat: number;
  jti: string;
  email: string;
};
