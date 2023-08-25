import { SignIn, SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import {api } from "y/utils/api";
import type { RouterOutputs} from "y/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
dayjs.extend(relativeTime);


const CreatePostWizard = () => {
  const { user } = useUser();
  if (!user) return null;
  return <div className="flex gap-3 w-full">
    <Image 
    src={user.profileImageUrl} 
    alt="Profile image" 
    className="w-14 h-14 rounded-full"
    width={56}
    height={56} 
    />
    <input placeholder="Type some emojis!" className="bg-transparent grow outline-none" />
  </div>
}

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  
  return (
    <div className="p-4 border-b border-slate-400 flex gap-3" key={props.post.id}>
      <Image 
      className="w-14 h-14 rounded-full" 
      src={author.profilepicture} 
      alt={`@${author.username}'s profile pciture`}
      width={56}
      height={56}
       />
      <div className="flex flex-col">
        <div className="flex gap-1 text-slate-300">
          <span>  {`@${author.username!}`}</span>
          <span className="font-thin">{` · ${dayjs(post.createdAt).fromNow() }`}</span>
        </div>
        <span>  {post.content}</span>
      </div>
    </div>
  )
}


const Home: NextPage = () => {
  const user = useUser();
  const { data, isLoading } = api.posts.getAll.useQuery();

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>Something went wrong...</div>;

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center ">
        <div className="h-full w-full border-x border-slate-400 md:max-w-2xl">
          <div className="border-b border-slate-400 p-4 flex">
            {!user.isSignedIn && (
              <div className="flex justify-center">
                <SignInButton />
              </div>
            )}
            {!!user.isSignedIn && <CreatePostWizard />}
            {!!user.isSignedIn && <SignOutButton />}
          </div>
          <div className="flex flex-col">
            {[...data, ...data]?.map((fullPost) => (
              <PostView key={fullPost.post.id} {...fullPost} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

export default Home;