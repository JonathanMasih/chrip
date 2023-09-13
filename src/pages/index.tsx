import {  SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { NextPage } from "next";
import { api } from "y/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import { LoadingPage, LoadingSpinner } from "y/components/loading";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { PageLayout } from "y/components/layout";
import { PostView } from "y/components/postview";
dayjs.extend(relativeTime);


const CreatePostWizard = () => {
  const { user } = useUser();

  const [input, setInput] = useState("");

  const ctx = api.useContext();

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.posts.getAll.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0] === null) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("Failed to post please try again later");
      };
    }
  });

  if (!user) return null;
  return <div className="flex gap-3 w-full">
    <Image
      src={user.profileImageUrl}
      alt="Profile image"
      className="w-14 h-14 rounded-full"
      width={56}
      height={56}
    />
    <input
      placeholder="Type some emojis!"
      className="bg-transparent grow outline-none"
      type="text"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      disabled={isPosting}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          if (input !== "") {
            mutate({ content: input });
          }
        }
      }}
    />
    {input !== "" && !isPosting && (<button onClick={() => mutate({ content: input })} >Post</button>)}
    {isPosting && <div className="flex justtify-center items-center"><LoadingSpinner size={20} /></div>}
  </div>
}

const Feed = () => {
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery();

  if (postsLoading)
    return (
      <div className="flex grow">
        <LoadingPage />
      </div>
    );

  if (!data) return <div>Something went wrong</div>;

  return (
    <div className="flex grow flex-col">
      {data?.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  );
};



const Home: NextPage = () => {
  const { user, isLoaded: userLoaded, isSignedIn } = useUser();

  //Start Fetching asap
  api.posts.getAll.useQuery();

  //Return Emprty div if user isn't loaded yer
  if (!userLoaded) return <div></div>;


  return (
    <PageLayout>
      <div className="flex border-b border-slate-400 p-4">
        {!isSignedIn && (
          <div className="flex justify-center">
            <SignInButton />
          </div>
        )}
        {!!isSignedIn && <CreatePostWizard />}
      </div>
      <Feed />
    </PageLayout >
  );
}

export default Home;