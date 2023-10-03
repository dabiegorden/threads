import { fetchUserPosts } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import ThreadCard from "../card/ThreadCard";


interface Props {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

const ThreadsTab = async ({ currentUserId, accountId, accountType } :Props) => {
let results = await fetchUserPosts(accountId);

if(!results) redirect("/");

  return (
    <section className="flex flex-col gap-10 mt-9">
          {results.threads.map((thread: any) => (
              <ThreadCard 
              key={thread._id} 
              id={thread._id} 
              currentUserId={currentUserId}
              parentId={thread.parentId}
              content={thread.text}
              author={
                accountType === "User" ? { name: results.name, image: results.image, id: results.id } : { name: thread.author.name, image: thread.author.image, id: thread.author.id }
              } // todo
              community={thread.community} //todo
              createdAt={thread.createdAt}
              comments={thread.comments}
            />
          ))}
    </section>
  )
}

export default ThreadsTab;