import AccountProfile from "@/components/forms/AccountProfile";
import { currentUser } from "@clerk/nextjs";

async function page() {
const user = await currentUser();

// user Info
const userInfo = {};

// user data
const userData = {
  id: user?.id,
  objectId: userInfo?._id,
  username: userInfo?.username || user?.username,
  name: userInfo?.name || user?.firstName || "",
  bio: userInfo?.bio || "",
  image: userInfo?.image || user?.imageUrl,
};

  return(
    <main className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-20">
       <h1 className="head-text">Onboarding</h1>
       <p className="mt-3 text-babe-regular text-light-2">Complete your profile now to use Cordia</p>

       <section className="mt-10 p-10 bg-dark-2">
            <AccountProfile user={userData} btnTitle="Continue"/>
       </section>
    </main>
  )
}

export default page;