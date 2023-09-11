import { SignIn, SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import {api } from "y/utils/api";
import type { RouterOutputs} from "y/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import { LoadingPage, LoadingSpinner } from "y/components/loading";
import { useState } from "react";
import { toast } from "react-hot-toast";

const SinglePostPage: NextPage = () => {
  const {user, isLoaded: userLoaded,isSignedIn} = useUser();

  //Start Fetching asap
  api.posts.getAll.useQuery();

  //Return Emprty div if user isn't loaded yer
  if (!userLoaded ) return <div></div>;


  return (
    <>
      <Head>
        <title>Post</title>
      </Head>
      <main className="flex h-screen justify-center ">
        <div>
          Post View
        </div>
      </main>
    </>
  );
}

export default SinglePostPage;