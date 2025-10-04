"use client"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { SidebarMenuButton } from "./ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { ChevronsUpDown, User, CreditCard, LogOut } from "lucide-react"
import Link from "next/link"
import { useClerk } from "@clerk/nextjs"
import { UserProfile } from '@clerk/nextjs'
import { Button } from "./ui/button"

interface SerializableUser {
  id: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string;
  hasImage: boolean;
  emailAddresses: Array<{
    emailAddress: string;
  }>;
}

interface NavUserProps {
  user: SerializableUser
}

const NavUser = ({ user }: NavUserProps) => {
  const { signOut } = useClerk()
  const {openUserProfile} = useClerk()
  const handleLogout = () => {
    signOut()
  }
  const openProfile = () => {
    return null 
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="!hover:bg-gray-50">
      <SidebarMenuButton size="lg" className="hover:bg-gray-200 cursor-pointer">
      <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar>    
               { user.hasImage && 
               <AvatarImage
                className="w-8 h-8 rounded-full flex-1"
                src={user.imageUrl} 
                />}
                <AvatarFallback>
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.firstName} {user.lastName}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {user.emailAddresses[0]?.emailAddress}
                </span>
              </div>
              <ChevronsUpDown className="w-4 h-4 text-gray-500" />
            </div>
          </div>
        </SidebarMenuButton>
   
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-75 ml-10 p-1 !bg-white rounded-lg border border-gray-200 shadow-lg"
        align="end"
        sideOffset={8}
      >        
        <DropdownMenuLabel className="p-0">
          <div className="px-3 py-2">
            <div className="flex items-center gap-3">
              <Avatar className="relative">    
                {user.hasImage ? (
                  <AvatarImage
                    className="w-9 h-9 rounded-full object-cover"
                    src={user.imageUrl} 
                    alt={`${user.firstName} ${user.lastName}`}
                  />
                ) : (
                  <AvatarFallback className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold flex items-center justify-center">
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex flex-col items-start flex-1 min-w-0">
                <span className="truncate font-semibold text-gray-900 text-sm">
                  {user.firstName} {user.lastName}
                </span>
                <span className="truncate text-xs text-gray-500">
                  {user.emailAddresses[0]?.emailAddress}
                </span>
              </div>
            </div>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator className="my-1 h-px !bg-gray-200" />
        
        <DropdownMenuItem asChild className="focus:bg-gray-50 rounded-md mx-1">
          <SidebarMenuButton 
        onClick={()=> {openUserProfile()}}
        className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 cursor-pointer outline-none"
          >
            <User className="w-4 h-4" />
            Account
          </SidebarMenuButton>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild className="focus:bg-gray-50 rounded-md mx-1">
          <Link 
            href="/billing" 
            className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 cursor-pointer outline-none"
          >
            <CreditCard className="w-4 h-4" />
            Your plan 
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="my-1 h-px !bg-gray-200" />
        
        <DropdownMenuItem 
          className="flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 focus:bg-red-50 rounded-md mx-1 cursor-pointer outline-none"
          onSelect={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default NavUser