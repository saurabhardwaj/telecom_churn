// next-auth.d.ts
import NextAuth from 'next-auth';

// Extend the Session type to include accessToken
declare module 'next-auth' {
  interface Session {
    token?: string;
  }
}
