import ThreadCard from "@/components/card/ThreadCard";
import { fetchPost } from "@/lib/actions/thread.actions";
import { currentUser } from "@clerk/nextjs";


export default async function Home() {

  // fetch data from the database
  const results = await fetchPost( 1, 30 );
  console.log(results)

  const user = await currentUser();

  return (
    <>
      <h1 className="head-text text-xl">Home</h1>

      <section className="mt-9 flex flex-col">
          {results.posts.length === 0 ? (
            <p className="no-result">No thread found</p>
          ): (
            <>
              {results.posts.map((post) => (
                 <ThreadCard 
                 key={post._id} 
                 id={post._id} 
                 currentUserId={user?.id || ""}
                 parentId={post.parentId}
                 content={post.text}
                 author={post.author}
                 community={post.community}
                 createdAt={post.createdAt}
                 comments={post.comments}
                 />
              ))}
            </>
          )}
      </section>

    </>
  )
}