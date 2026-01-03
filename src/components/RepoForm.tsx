"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Image from "next/image"
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
import { Github, Key, Sparkles, Code, Brain, FileText, CheckCircle } from "lucide-react"
import React, { useState, useEffect } from "react"
import Link from "next/link"
import toast from "react-hot-toast"
import { useUser } from "@clerk/nextjs"
import LoadingC from "./LoadingC"

const formSchema = z.object({
  githubUrl: z.string().url("Please provide a valid URL").regex(/^https:\/\/github\.com\//, "Must be a valid GitHub repository URL"),
  accessToken: z.string(),
})

export function RepoForm() {
  const { user } = useUser()
  const [isLoading, setIsLoading] = useState(false)


  const createRepo = api.project.createRepo.useMutation({
    onSuccess: async () => {
      setIsLoading(false)
      toast.success("Tutorial created successfully")
      window.location.href = `/dashboard`
    },
    onError: async (error) => {
      setIsLoading(false)
      toast.error(error.message)
      // window.location.href = `/dashboard`
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
      githubUrl: values.githubUrl,
      accessToken: values.accessToken
    })
  }

  // Loading Steps Screen
  if (isLoading) {
    return (
      <LoadingC isLoading = {isLoading} />
    )
  }

  // Main Form
  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-2">
      <div className="w-full max-w-[680px]">
        <div className="bg-white rounded-[25px] shadow-sm p-10">

          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-20">
              <div>
                <h1 className="text-[34px] leading-[1.1] text-gray-900 mb-1 font-semibold">
                  Connect Your
                </h1>
                <h2 className="text-[34px] leading-[1.1]">
                  <span className="text-gray-400">Repository</span>
                </h2>
                <p className="text-gray-500 mt-3 text-[15px]">Link your GitHub repository and generate tutorials</p>
              </div>

              <div className="relative w-44 h-28">
                <div className="absolute top-0 right-20 w-14 h-14 bg-white rounded-2xl shadow-md flex items-center justify-center border border-gray-100 z-10">
                  <Sparkles className="w-5 h-5 text-gray-800" />
                </div>

                <div className="absolute top-0 -right-1 w-14 h-14 bg-white rounded-2xl shadow-md flex items-center justify-center border border-gray-100 -rotate-6 z-30">
                  <Github className="w-5 h-5 text-gray-800" />
                </div>

                <div className="absolute -top-4 right-8 w-14 h-14 bg-white rounded-2xl shadow-md flex items-center justify-center border border-gray-100 rotate-10 z-20">
                  <Key className="w-5 h-5 text-gray-800" />
                </div>
              </div>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
              <FormField
                control={form.control}
                name="githubUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-gray-900 font-semibold mb-2 text-sm">
                      GitHub Repository URL <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://github.com/username/repository"
                        {...field}
                        disabled={isLoading}
                        type="url"
                        className="w-full h-11 px-4 bg-gray-50 border-0 rounded-xl text-gray-600 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-gray-300 focus-visible:ring-offset-0"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accessToken"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-gray-900 font-semibold mb-2 text-sm">
                      GitHub Personal Access Token <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                        {...field}
                        disabled={isLoading}
                        type="password"
                        className="w-full h-11 px-4 bg-gray-50 border-0 rounded-xl text-gray-600 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-gray-300 focus-visible:ring-offset-0"
                      />
                    </FormControl>
                    <FormDescription className="text-sm text-gray-500 mt-2">
                      Your GitHub personal access token for repository access.{" "}
                      <a
                        href="https://github.com/settings/tokens"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 underline"
                      >
                        Generate one here
                      </a>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="bg-red-50 rounded-xl p-4 mt-6">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-white">!</span>
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold mb-1 text-gray-900">Required Permissions</p>
                    <p className="text-gray-600">
                      Your token needs <code className="bg-white px-2 py-0.5 rounded text-xs font-mono">repo</code> scope to access repository contents.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-6 mt-6 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600 text-sm">Ready to generate</span>
                </div>

                <div className="flex gap-3">
                  <Link href="/dashboard">
                    <button
                      type="button"
                      className="px-8 py-3 bg-white cursor-pointer text-gray-700 rounded-[14px] font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 border border-gray-200"
                    >
                      Cancel
                    </button>
                  </Link>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-8 py-3 bg-[#0f172a] text-white rounded-[14px] font-medium hover:bg-gray-900 cursor-pointer transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    Generate
                  </button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}