import { User } from "@clerk/nextjs/dist/types/server";


export const filterUserForClient = (user: User) => {
  return {
    id: user.id,
    username: user.username,
    profilepicture: user.profileImageUrl
  }
}