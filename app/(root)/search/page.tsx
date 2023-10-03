import UserCard from "@/components/card/UserCard";
import { ProfileHeader, ThreadsTab } from "@/components/shared";
import { profileTabs } from "@/constants";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import { redirect } from "next/navigation";


async function page() {
  const user = await currentUser();

  if(!user) return null;
  
  const userInfo = await fetchUser(user.id);
  
  if(!userInfo?.onboarded) redirect("/onboarding");

  //TODO fetch all users
  const results = await fetchUsers({
    userId: user.id,
    searchString: '',
    pageNumber: 1,
    pageSize: 25,
  })

  return (
    <section>
        <h1 className="head-text mb-10">Search</h1>

        //TODO later will render search bar

        <div className="mt-14 flex flex-col gap-9">
            {results .users.length === 0 ? (
               <p className="no-result">No Users</p>
            ): (
              <>
                 {results.users.map((person) => (
                    <UserCard 
                      key={person.id}
                      id={person.id}
                      name={person.name}
                      username={person.username}
                      imgUrl={person.image}
                      personType="User"
                    />
                 ))}
              </>
            )}
        </div>
    </section>
  )
}

export default page;