"use client";

import React, { ChangeEvent, useState } from 'react';
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { userValidation } from '@/lib/validations/user';
import * as z from "zod";
import Image from 'next/image';
import { isBase64Image } from '@/lib/utils';
import { useUploadThing } from "@/lib/uploadthing";
import { updateUser } from '@/lib/actions/user.actions';
import { usePathname, useRouter } from 'next/navigation';


interface Props {
  user: {
  id: string;
  objectId: string;
  username: string;
  name: string;
  bio:  string;
  image: string;
  }
  btnTitle: string;
};

const AccountProfile = ({ user, btnTitle }:Props) => {
const [files, setFiles] = useState<File[]>([]);
const { startUpload } = useUploadThing("media");
const router = useRouter();
const  pathname  = usePathname();

const form = useForm({
  resolver: zodResolver(userValidation),
  defaultValues: {
    profile_photo: user?.image || "",
    name: user?.name || "",
    username: user?.username || "",
    bio: user?.bio || "",
  },
});


// handle image function
const handleImage = (e: ChangeEvent<HTMLInputElement>, fieldChange: (value:string) => void) => {
  e.preventDefault();

  // reading the file
  const fileReader = new FileReader();

  if(e.target.files && e.target.files.length > 0) {
    const file = e.target.files[0];
    setFiles(Array.from(e.target.files));

    if(!file.type.includes("image")) return;

    fileReader.onload = async (event) => {
      const imageDataUrl = event.target?.result?.toString() || "";
      fieldChange(imageDataUrl);
    }
    fileReader.readAsDataURL(file);
  }
}


//Define a submit handler.
const onSubmit = async (values: z.infer<typeof userValidation>) => {
  const blob = values.profile_photo;

  const hasImageChanged = isBase64Image(blob);

  if(hasImageChanged) {
    const imgRes = await startUpload(files);

    if(imgRes && imgRes[0].fileUrl){
      values.profile_photo = imgRes[0].fileUrl;
    }
  }

  // update user profile
  await updateUser({
    userId: user.id,
    username: values.username,
    name:    values.name,
    bio:    values.bio,
    image:    values.profile_photo,
    path:    pathname,
  });

  // redirect user
  if(pathname === "/profile/edit"){
    router.back();
  }else {
    router.push("/");
  };
};

return (
  <Form {...form}>
    <form 
    onSubmit={form.handleSubmit(onSubmit)} 
    className="flex flex-col justify-start gap-10">

      <FormField
        control={form.control}
        name="profile_photo"
        render={({ field }) => (
          <FormItem className="flex items-center gap-4">
            <FormLabel className="account-form_image-label">
              {field.value ? (
                <Image src={field.value} alt="profile photo" 
                  width={96}
                  height={96}
                  priority
                  className="w-full object-contain"
                />
              ): (
              <Image src={"/assets/profile.svg"} alt="profile photo" 
                width={24}
                height={24}
                className="object-contain"
              />
            )}
            </FormLabel>
            <FormControl className="flex-1 text-base-semibold text-gray-200">
              <Input 
                type='file'
                accept='image/*'
                placeholder='Upload a photo'
                className="account-form_image-input"
                onChange={(e) => handleImage(e, field.onChange)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* second form */}
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem className="flex flex-col gap-3 w-full">
            <FormLabel className="text-base-semibold text-light-2">
                Name
            </FormLabel>
            <FormControl>
              <Input 
                type="text"
                // placeholder="Name"
                className="account-form_input no-focus"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {/* second form ends */}

      {/* third form */}
      <FormField
        control={form.control}
        name="username"
        render={({ field }) => (
          <FormItem className="flex flex-col gap-3 w-full">
            <FormLabel className="text-base-semibold text-light-2">
                username
            </FormLabel>
            <FormControl>
              <Input 
                type="text"
                // placeholder="username"
                className="account-form_input no-focus"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {/* third form ends */}

      {/* forth form */}
      <FormField
        control={form.control}
        name="bio"
        render={({ field }) => (
          <FormItem className="flex flex-col gap-3 w-full">
            <FormLabel className="text-base-semibold text-light-2">
              Bio
            </FormLabel>
            <FormControl>
              <Textarea 
                rows={10}
                // placeholder="Your Bio"
                className="account-form_input no-focus"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {/* forth form ends */}

      <Button type="submit" className="bg-primary-500">Submit</Button>
    </form>
  </Form>
);
}

export default AccountProfile;
