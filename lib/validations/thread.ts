import * as z from "zod";

// Thread validattion
export const ThreadValidation = z.object({
  thread: z.string().nonempty().min(3, { message: "Minimum of 3 characters" }),
  accountId: z.string(),
});

// comment validattion
export const CommentValidation = z.object({
  thread: z.string().nonempty().min(3, { message: "Minimum of 3 characters" }),
});
