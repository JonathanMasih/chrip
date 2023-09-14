;
import Head from "next/head";
import {api } from "y/utils/api";
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { PageLayout } from "y/components/layout";
import Image from "next/image";
import { generateSSGHelper } from "y/server/helpers/sssHelper/ssgHelper";
import { PostView } from "y/components/postview";


const SinglePostPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { id } = props;
  const { data } = api.posts.getById.useQuery({
    id,
  });

  if (!data) return <div>404</div>
  return (
    <>
      <Head>
        <title>{`${data.post.content}  - @${data.author.username}`}</title>
      </Head>
      <PageLayout>  
        <PostView {...data}/>
      </PageLayout>
    </>
  );
}

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ id: string }>,
) {
  const ssg = generateSSGHelper();
  const id = context.params?.id;

  if (typeof id !== "string") throw new Error("No Id");
  /*
   * Prefetching the `post.byId` query.
   * `prefetch` does not return the result and never throws - if you need that behavior, use `fetch` instead.
   */
  await ssg.posts.getById.prefetch({id});
  // Make sure to return { props: { trpcState: helpers.dehydrate() } }
  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
}

export default SinglePostPage;
