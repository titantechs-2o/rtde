import { defineAuth, secret } from "@aws-amplify/backend";


const LOCAL = "http://localhost:3000/";
const PROD  = "https://main.d6enf5qefd59h.amplifyapp.com/";

export const auth = defineAuth({
  loginWith: {
    email: true,

    externalProviders: {
      // ── Google (first-class) ──
      google: {
        clientId:     secret("GOOGLE_CLIENT_ID"),
        clientSecret: secret("GOOGLE_CLIENT_SECRET"),
        scopes:       ["openid", "email", "profile"],
      },

      // ── Must supply at least one real URI ──
      callbackUrls: [LOCAL, PROD],
      logoutUrls:   [LOCAL, PROD],
    },
  },

  // optional “username” display field
  userAttributes: {
    preferredUsername: { mutable: true, required: false },
  },
});
