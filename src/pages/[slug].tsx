
import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { api } from "y/utils/api";
import { appRouter } from "y/server/api/root";
import { prisma } from "y/server/db";
import superjson from "superjson";
import { PageLayout } from "y/components/layout";
import { createProxySSGHelpers } from '@trpc/react-query/ssg';


const ProfilePage: NextPage<{ username: string }> = ({ username }) => {

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

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = createProxySSGHelpers ({
    router: appRouter,
    ctx: {prisma , userId: null},
    transformer: superjson
    });
  const slug = context.params?.slug;

  if (typeof slug !== "string") throw new Error("No slug");

  const username = slug.replace("@", "");

  await ssg.profile.getUserByUsername.prefetch({ username: slug });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  }
}

export const getStaticPaths = () => {
  return { path: [], fallback: "blocking" }
}

export default ProfilePage;
