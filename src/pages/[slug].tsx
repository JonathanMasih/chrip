
import type { GetServerSidePropsContext, GetStaticProps, InferGetServerSidePropsType, NextPage } from "next";
import Head from "next/head";
import { api } from "y/utils/api";
import { appRouter } from "y/server/api/root";
import { prisma } from "y/server/db";
import superjson from "superjson";
import { PageLayout } from "y/components/layout";
import { createServerSideHelpers } from '@trpc/react-query/server';

const ProfilePage = (  props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
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
        <div>{data.username}</div>
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
    ctx: {prisma , userId: null},
    transformer: superjson,
  });
   const slug = context.params?.slug;

     if (typeof slug !== "string") throw new Error("No slug");

  const username = slug.replace("@", "");
  /*
   * Prefetching the `post.byId` query.
   * `prefetch` does not return the result and never throws - if you need that behavior, use `fetch` instead.
   */
  await helpers.profile.getUserByUsername.prefetch({ username});
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
