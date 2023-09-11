import { type AppType } from "next/app";
import { api } from "y/utils/api";
import { ClerkProvider } from '@clerk/nextjs'
import "y/styles/globals.css";
import { Toaster } from "react-hot-toast";
import Head from "next/head";

const MyApp: AppType = ({ Component, pageProps }) => {
  return <ClerkProvider>
        <Head>
        <title>Chirp</title>
        <meta name="description" content="☁" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    <Toaster  position="bottom-center"/>
    <Component {...pageProps} />
  </ClerkProvider>;
};

export default api.withTRPC(MyApp);
