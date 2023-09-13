
import type { GetServerSidePropsContext, GetStaticProps, InferGetServerSidePropsType, NextPage } from "next";
import Head from "next/head";
import { api } from "y/utils/api";
import { appRouter } from "y/server/api/root";
import { prisma } from "y/server/db";
import superjson from "superjson";
import { PageLayout } from "y/components/layout";
import { createServerSideHelpers } from '@trpc/react-query/server';
import Image from "next/image";
import { LoadingPage } from "y/components/loading";
import { PostView } from "y/components/postview";

const ProfileFeed = (props:{userId:string}) =>{

  const {data,isLoading} = api.posts.getPostsByUserId.useQuery({
    userId:props.userId,
  })

  if(isLoading)return <LoadingPage />;

  if(!data || data.length === 0)return<div>User has not posted</div>;


  return(
    <div className="flex flex-col">
      {data.map((fullPost)=>(
        <PostView {...(fullPost)}key={fullPost.post.id} />
      ))}
    </div>
  )

}

const ProfilePage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { username } = props;
  const { data } = api.profile.getUserByUsername.useQuery({
    username,
  });

  if (!data) return <div>404</div>
  return (
    <>
      <Head>
        <title>{data.username}</title>
      </Head>
      <PageLayout>
        <div className="h-36 bg-slate-600 relative">
          <Image
            src={data.profilepicture}
            alt={`${data.username ?? ""}'s profile pic`}
            width={128}
            height={128}

            className="absolute bottom-0 left-0 -mb-[64px] rounded-full border-4 border-black ml-4 bg-black"
          />
        </div>
        <div className="h-[64px]"></div>
        <div className="p-4 text-2xl font-bold"> {`@${data.username ?? ""}`} </div>
        <div   className="border-b border-slate-400 w-full"></div>
        <ProfileFeed userId={data.id}/>
      </PageLayout>
    </>
  );
}

// export const getStaticProps: GetStaticProps = async (context) => {
//   const ssg = createServerSideHelpers ({
//     router: appRouter,
//     ctx: {prisma , userId: null},
//     transformer: superjson
//     });
//   const slug = context.params?.slug;

//   if (typeof slug !== "string") throw new Error("No slug");

//   const username = slug.replace("@", "");

//   await ssg.profile.getUserByUsername.prefetch({ username: slug });

//   return {
//     props: {
//       trpcState: ssg.dehydrate(),
//       username,
//     },
//   }
// }

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ slug: string }>,
) {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: superjson,
  });
  const slug = context.params?.slug;

  if (typeof slug !== "string") throw new Error("No slug");

  const username = slug.replace("@", "");
  /*
   * Prefetching the `post.byId` query.
   * `prefetch` does not return the result and never throws - if you need that behavior, use `fetch` instead.
   */
  await helpers.profile.getUserByUsername.prefetch({ username });
  // Make sure to return { props: { trpcState: helpers.dehydrate() } }
  return {
    props: {
      trpcState: helpers.dehydrate(),
      username,
    },
  };
}


// export const getStaticPaths = () => {
//   return { path: [], fallback: "blocking" }
// }

export default ProfilePage;
