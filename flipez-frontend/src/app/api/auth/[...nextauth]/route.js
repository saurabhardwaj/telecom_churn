import NextAuth from "next-auth";
import axios from 'axios';
import GoogleProvider  from "next-auth/providers/google";
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Username', type: 'text', placeholder: 'Username' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        return credentials;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, profile  }) {
      if (user && profile) {
        try {
          const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/signin/google`, user);
          if (response.status === 200) {
            token.id = response.data.user._id;
            token.email = response.data.user.email;
            token.accessToken = response.data.token;
            token.name = `${response.data.user.firstName} ${response.data.user.lastName}`
          }
        } catch (error) {
          console.error("Error fetching user details from your API:", error);
        }
      } else if (user) {
        token.id = user.id;
        token.email = user.email;
        token.accessToken = user.token;
        token.name = `${user.name}`
        token.role = user.role
      }
      return token;
    },
    async session({ session, token }) {
      // Add the token data to the session
      session.user.id = token.id;
      session.user.email = token.email;
      session.token = token.accessToken;
      session.user.name = token.name
      session.user.role = token.role
      return session;
    }
  },
})

export { handler as GET, handler as POST }