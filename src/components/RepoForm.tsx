"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { api } from "@/trpc/react"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Github, Key, Sparkles } from "lucide-react"
import React, { useState } from "react"
import Link from "next/link"
import toast from "react-hot-toast"
import { useUser } from "@clerk/nextjs"

const formSchema = z.object({
  githubUrl: z.string().url("Please provide a valid URL").regex(/^https:\/\/github\.com\//, "Must be a valid GitHub repository URL"),
  accessToken : z.string(),
})

export function RepoForm() {
  const {user} = useUser()

  const [isLoading, setIsLoading] = useState(false)
  const { data: getLatestTutorial, refetch: refetchLatestTutorial } = api.project.getLatestTutorial.useQuery(
    undefined,
    { enabled: false } 
  );
const createRepo = api.project.createRepo.useMutation({
    onSuccess : async()=>{
    setIsLoading(false)
    const { data } = await refetchLatestTutorial();

    if(data){
      toast.success("Tutorial created successfully")
      window.location.href = `/dashboard`
    }

    },
      onError : async (error)=>{
        setIsLoading(false)
        const { data } = await refetchLatestTutorial();

        if(data){
          window.location.href = `/dashboard`
        }
    
  
    } 
  })
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      githubUrl: "",
      accessToken: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
  createRepo.mutate({
    githubUrl : values.githubUrl,
    accessToken : values.accessToken
  }) 
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white px-4 py-8">
      
      <Link href="/" className="mb-3 flex flex-row gap-2 items-center">
        <Image src="/final.png" alt="Logo" width={40} height={40} className='rounded-xl'/>
        <h1 className='text-3xl font-bold text-foreground'>Codelet</h1>
      </Link>
      
      <div className="w-full max-w-6xl mx-auto">
        
        <div className="text-center mb-5">
          <h1 className="text-3xl font-bold text-foreground mb-2">Connect Your Repository</h1>
          <p className="text-lg text-muted-foreground">
            Link your GitHub repository and generate comprehensive tutorials with <span className="text-foreground font-semibold">Codelet</span>
          </p>
        </div>

        <div className="bg-white border border-border rounded-2xl p-6 shadow-lg">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              <FormField
                control={form.control}
                name="githubUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-3 text-lg font-semibold text-foreground mb-3">
                      <div className="p-2 rounded-lg ">
                        <Github className="h-5 w-5 text-black" />
                      </div>
                      GitHub Repository URL
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://github.com/username/repository" 
                        {...field}
                        disabled={isLoading}
                        type="url"
                        className="h-12 text-base px-4 bg-background border-input focus-visible:ring-purple-500"
                      />
                    </FormControl>
                    <FormDescription className="text-sm text-muted-foreground">
                      Enter the full URL to your GitHub repository
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accessToken"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-3 text-lg font-semibold text-foreground mb-3">
                      <div className="p-2 rounded-lg ">
                        <Key className="h-5 w-5 text-black" />
                      </div>
                      GitHub Personal Access Token
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" 
                        {...field}
                        disabled={isLoading}
                        type="password"
                        className="h-12 text-base px-4 bg-background border-input focus-visible:ring-purple-500"
                      />
                    </FormControl>
                    <FormDescription className="text-sm text-muted-foreground flex items-start gap-2">
                      <div className="w-4 h-4 rounded-full bg-purple-600 mt-0.5 flex-shrink-0">
                        <span className="text-xs font-bold text-white flex items-center justify-center h-full">i</span>
                      </div>
                      <span>
                        Your GitHub personal access token for repository access. 
                        <a 
                          href="https://github.com/settings/tokens" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-purple-600 hover:text-purple-700 underline ml-1 font-medium"
                        >
                          Generate one here
                        </a>
                      </span>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="bg-secondary/50 border border-border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#ca2a30] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-white">!</span>
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold mb-1 text-foreground">Required Permissions</p>
                    <p className="text-muted-foreground">
                      Your token needs <code className="bg-muted px-2 py-1 rounded text-xs font-mono">repo</code> scope to access repository contents.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center pt-4 gap-2">
                <Button 
                  disabled={isLoading} 
                  type="submit"
                  className="h-12 px-8 text-base font-medium bg-black hover:bg-gray-800 text-white rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed border-0"
                >
                  <Sparkles className="!w-5 !h-5 mr-1" />
                  {isLoading ? "Generating..." : "Generate Tutorial"}
                </Button>
                {isLoading && 
                  <span className="text-sm text-muted-foreground">
                    This might take a few minutes...
                  </span>
                }
              </div>
            </form>
          </Form>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Secure and private. Your tokens are used only to access your repository.
        </p>
        
      </div>
    </div>
  )
}