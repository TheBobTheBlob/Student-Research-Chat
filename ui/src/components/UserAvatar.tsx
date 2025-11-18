import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export interface UserAvatarProps {
    user: { first_name: string; last_name: string; picture?: string }
}

export default function UserAvatar({ user }: UserAvatarProps) {
    return (
        <Avatar>
            <AvatarImage src={user.picture} alt="User Picture" />
            <AvatarFallback>
                {user.first_name[0]}
                {user.last_name[0]}
            </AvatarFallback>
        </Avatar>
    )
}
