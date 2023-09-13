
import Link from "next/link";
import type { RouterOutputs } from "y/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";

dayjs.extend(relativeTime);

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

export const PostView = (props: PostWithUser) => {
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
          <Link href={`/@${author.username}`}>
            <span>  {`@${author.username!}`}</span>
          </Link>
          <Link href={`/post/${post.id}`}>
            <span className="font-thin">{` · ${dayjs(post.createdAt).fromNow()}`}</span>
          </Link>
        </div>
        <span className="text-2xl">  {post.content}</span>
      </div>
    </div>
  )
}