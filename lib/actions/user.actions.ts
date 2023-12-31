"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import Thread from "../models/thread.model";
import { FilterQuery, SortOrder } from "mongoose";

interface Params {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

export async function updateUser({
  userId,
  username,
  name,
  bio,
  image,
  path,
}: Params): Promise<void> {
  connectToDB();

  try {
    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      {
        upsert: true,
      }
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Fail to create/update user: ${error.message}`);
  }
}

// fetch user
export async function fetchUser(userId: string) {
  try {
    connectToDB();

    return await User.findOne({ id: userId });
    //   .populate({
    //   path: "communities",
    //   model: "Community",
    // })
  } catch (error: any) {
    throw new Error(`Fail to fetch user: ${error.message}`);
  }
}

// fetch user post
export async function fetchUserPosts(userId: string) {
  try {
    connectToDB();

    // fined all threads authored by the user with a giving a id

    // TODO:populate community

    const threads = await User.findOne({ id: userId }).populate({
      path: "threads",
      model: Thread,
      populate: {
        path: "children",
        model: Thread,
        populate: {
          path: "author",
          model: User,
          select: "name image id",
        },
      },
    });
    return threads;
  } catch (error: any) {
    throw new Error(`Error while fetching user posts ${error.message}`);
  }
}

// TODO fetch Users
export async function fetchUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  try {
    connectToDB();

    const skipAmount = (pageNumber - 1) * pageSize;

    const regex = new RegExp(searchString, "i");

    const query: FilterQuery<typeof User> = {
      id: { $ne: userId },
    };

    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    // todo sort options
    const sortOptions = { createdAt: sortBy };

    const usersQuerry = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const totalUsersCount = await User.countDocuments(query);

    const users = await usersQuerry.exec();

    const isNext = totalUsersCount > skipAmount + users.length;

    return { isNext, users };
  } catch (error: any) {
    throw new Error(`Fail to fetch user: ${error.message}`);
  }
}

//TODO getActivity
export async function getActivity(userId: string) {
  try {
    connectToDB();

    //todo find all thread created by the user
    const userThread = await Thread.find({ author: userId });

    //todo collect all the chiled thread ids (replies) from the children field
    const chiledThreadIds = userThread.reduce((acc, userThread) => {
      return acc.concat(userThread.children);
    }, []);

    const replies = await Thread.find({
      _id: { $in: chiledThreadIds },
      author: { $ne: userId },
    }).populate({
      path: "author",
      model: User,
      select: "name image _id",
    });

    return replies;
  } catch (error: any) {
    throw new Error(`Fail to get user activities: ${error.message}`);
  }
}
