import { useUser } from "@clerk/nextjs";
import { NextPage } from "next";
import Head from "next/head";
import {api } from "y/utils/api";

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