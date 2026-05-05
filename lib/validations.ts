import { z } from "zod"

export const createMessageSchema = z.object({
  nickname: z
    .string()
    .min(1, "昵称不能为空")
    .max(20, "昵称不能超过20个字符"),
  content: z
    .string()
    .min(1, "留言内容不能为空")
    .max(500, "留言内容不能超过500个字符"),
})

export const voteSchema = z.object({
  type: z.enum(["like", "dislike"]),
})

export type CreateMessageInput = z.infer<typeof createMessageSchema>
export type VoteInput = z.infer<typeof voteSchema>
