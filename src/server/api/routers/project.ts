/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { z } from "zod";
import { createTRPCRouter, ProtectedProcedure } from "../trpc";
import { generateTutorial } from "@/lib/ai";
import { TRPCError } from "@trpc/server";
import { unstable_cache } from 'next/cache';
import { processRepositoryEmbeddings } from "@/lib/chatai";


const codeSnippetSchema = z.object({
  fileRef: z.string(),
  sourceCode: z.string(),
  language: z.string().optional(),
});

const subChapterSchema = z.object({
  subChapterTitle: z.string(),
  explanation: z.string(),
  codeSnippets: z.array(codeSnippetSchema).optional(),
  diagram: z.string().optional().nullable(),
});

const chapterContentSchema = z.object({
  subChapters: z.array(subChapterSchema),
});

const tutorialSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  repository: z.string(),
  chapters: z.array(z.object({
    chapterNumber: z.number(),
    title: z.string(),
    content: chapterContentSchema,
  }))
});



export const projectRouter = createTRPCRouter({
  createRepo: ProtectedProcedure.input(
    z.object({
      githubUrl: z
        .string()
        .url("Please provide a valid URL")
        .regex(
          /^https:\/\/github\.com\//,
          "Must be a valid GitHub repository URL"
        ),
      accessToken: z.string().min(1, "Access token is required"),
    })
  ).mutation(async ({ ctx, input }) => {
    try {
      if (!ctx.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated - ctx.userId is missing",
        });
      }

      const user = await ctx.db.user.findUnique({
        where: { id: ctx.userId }
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User account not found in database. Please refresh and try again.",
        });
      }
      const numOfTuts = await ctx.db.tutorial.count({
        where: {
          repo: {
            userId: ctx.userId
          }
        }
      })
      if(numOfTuts >= 3){
        throw new TRPCError({
          code: "PAYMENT_REQUIRED",
          message: "You have reached the maximum number of tutorials for this plan.",
        })
      }
      const existingRepo = await ctx.db.repo.findFirst({
        where: {
          githubUrl: input.githubUrl,
          userId: ctx.userId,
        },
      });

      let repo;

      if (existingRepo) {
        repo = existingRepo;
      } else {
        const repoName = input.githubUrl.split('/').pop() || 'Unknown Repository';
        
        repo = await ctx.db.repo.create({
          data: {
            name: repoName,
            githubUrl: input.githubUrl,
            accessToken: input.accessToken,
            userId: ctx.userId,
          },
        });
      }

      const response = await generateTutorial(input.githubUrl, input.accessToken);
      const validatedTutorial = tutorialSchema.parse(response);
      const tutorial = await ctx.db.tutorial.create({
        data: {
          title: validatedTutorial.title,
          description: validatedTutorial.description || `Comprehensive tutorial for ${repo.name}`,
          repository: validatedTutorial.repository,
          repoId: repo.id,
          chapters: {
            create: validatedTutorial.chapters.map((chapter) => ({
              chapterNumber: chapter.chapterNumber,
              title: chapter.title,
              subChapters: {
                create: chapter.content.subChapters.map((subChapter) => ({
                  subChapterTitle: subChapter.subChapterTitle,
                  explanation: subChapter.explanation,
                  diagram: subChapter.diagram || undefined,
                  codeSnippets: {
                    create: subChapter.codeSnippets?.map((snippet) => ({
                      fileRef: snippet.fileRef,
                      sourceCode: snippet.sourceCode,
                      language: snippet.language,
                    })) || [],
                  },
                })),
              },
            })),
          },
        },
        include: {
          chapters: {
            orderBy: {
              chapterNumber: 'asc',
            },
            include: {
              subChapters: {
                include: {
                  codeSnippets: true,
                },
              },
            },
          },
        },
      });

      const { revalidateTag } = await import('next/cache');
      revalidateTag(`user-${ctx.userId}-repos`);
      revalidateTag(`user-${ctx.userId}-chapters`);
      await processRepositoryEmbeddings(repo.githubUrl, repo.accessToken, tutorial.id);
      return {
        repo,
        tutorial,
        message: `Tutorial created successfully${existingRepo ? ' for existing repository' : ' with new repository'}`,
      };

    } catch (error) {
      console.error("Error creating repo and tutorial:", error);

      if (error instanceof TRPCError) {
        throw error;
      }

      if (error instanceof z.ZodError) {
        console.error("Zod validation errors:", error.errors);
        throw new TRPCError({
          code: "PARSE_ERROR",
          message: "Invalid tutorial data received from AI service",
          cause: error,
        });
      }

      if (error instanceof SyntaxError) {
        console.error("JSON parsing error from AI response:", error.message);
        throw new TRPCError({
          code: "PARSE_ERROR",
          message: "Invalid JSON received from AI service",
          cause: error,
        });
      }

      if (error && typeof error === 'object' && 'code' in error) {
        if (error.code === 'P2002') {
          throw new TRPCError({
            code: "CONFLICT",
            message: "A repository with this URL already exists for your account",
          });
        }
        if (error.code === 'P2025') {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User account not found. Please refresh the page and try again.",
          });
        }
      }

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create repository and generate tutorial",
      });
    }
  }),
  

  getRepos: ProtectedProcedure.query(async ({ ctx }) => {
  
    const cachedRepos = await unstable_cache(
      async () => {
        return await ctx.db.repo.findMany({
          where: { userId: ctx.userId },
          select: {
            id: true,
            name: true,
            githubUrl: true,
            createdAt: true,
            tutorials: {
              select: {
                id: true,
                title: true,
                createdAt: true,
              },
              orderBy: {
                createdAt: 'desc',
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        });
      },
      [`repos-${ctx.userId}`],
      {
        revalidate: 300, 
        tags: [`user-${ctx.userId}-repos`],
      }
    )();

    return cachedRepos;
  }),
getTutorialById: ProtectedProcedure
  .input(z.object({ tutorialId: z.string() }))
  .query(async ({ ctx, input }) => {
    const tutorial = await ctx.db.tutorial.findUnique({
      where: {
        id: input.tutorialId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        chapters: {
          select: {
            id: true,
            title: true,
            chapterNumber: true,
            subChapters: {
              select: {
                id: true,
                subChapterTitle: true,
                diagram: true,
                codeSnippets: {
                  select: {
                    id: true,
                    language: true
                  }
                }
              }
            }
          },
          orderBy: {
            chapterNumber: 'asc'
          }
        },
        chatSessions: {
          select: {
            id: true,
            title: true,
            createdAt: true,
            isActive: true,
            messages: {
              select: {
                id: true,
                content: true,
                createdAt: true
              },
              orderBy: {
                createdAt: 'desc'
              },
              take: 1
            }
          },
          where: {
            isActive: true
          },
          orderBy: {
            updatedAt: 'desc'
          }
        }
      }
    });

    if (!tutorial) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Tutorial not found',
      });
    }

    return tutorial;
  }),

  getRepoById : ProtectedProcedure.input(
    z.object({
      repoId: z.string().min(1, "Repo ID is required"),
    })
  ).query(async ({ ctx, input }) => {
    const repo = await ctx.db.repo.findFirst({
      where: {
        id: input.repoId,
        userId: ctx.userId,
      },
      select: {
        id: true,
        name : true
      },
    });
    return repo;
  }), 

getChapters: ProtectedProcedure.input(
  z.object({
    tutorialId: z.string().min(1, "Tutorial ID is required"),
  })
).query(async ({ ctx, input }) => {
  const cachedChapters = await unstable_cache(
    async () => {
      return await ctx.db.chapter.findMany({
        where: {
          tutorialId: input.tutorialId,
          tutorial: {
            repo: {
              userId: ctx.userId,
            },
          },
        },
        select: {
          id: true,
          chapterNumber: true,
          title: true,
        },
        orderBy: {
          chapterNumber: "asc",
        },
      });
    },
    [`chapters-${input.tutorialId}-${ctx.userId}`],
    {
      revalidate: 600, 
      tags: [`tutorial-${input.tutorialId}-chapters`, `user-${ctx.userId}-chapters`],
    }
  )();

  return cachedChapters;
}),

getChapter: ProtectedProcedure.input(
  z.object({
    chapterId: z.string().min(1, "Chapter ID is required"),
  })
).query(async ({ ctx, input }) => {
  const cachedChapter = await unstable_cache(
    async () => {
      return await ctx.db.chapter.findFirst({
        where: {
          id: input.chapterId,
          tutorial: {
            repo: {
              userId: ctx.userId,
            },
          },
        },
        include: {
          subChapters: {
            include: {
              codeSnippets: true,
            },
          },
          tutorial: {
            select: {
              id: true,
              title: true,
              repository: true,
            },
          },
        },
      });
    },
    [`chapter-${input.chapterId}-${ctx.userId}`], 
    {
      revalidate: 900, 
      tags: [`chapter-${input.chapterId}`, `user-${ctx.userId}-chapters`],
    }
  )();

  return cachedChapter;
}),
getChatSessions: ProtectedProcedure.input(
  z.object({
    tutorialId: z.string().min(1, "Tutorial ID is required"),
  })
).query(async ({ ctx , input}) => {
  const chatSessions = await ctx.db.chatSession.findMany({
    where: {
      tutorialId: input.tutorialId,
    },
    orderBy: {
      createdAt: "desc",
    },
    select : {
      title : true,
      id : true
    }
  });
  return chatSessions;
}),
getLatestTutorials: ProtectedProcedure.input(z.object({
  repoId : z.string().min(1, "Repo ID is required"),
})).query(async ({ ctx , input}) => {
  const latestTutorials = await ctx.db.tutorial.findMany({
    where: {
      repo: {
        id : input.repoId,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return latestTutorials;
}),
getChatMessages : ProtectedProcedure.input(
  z.object({
    sessionId: z.string().min(1, "Session ID is required"),
  })
).query(async ({ ctx, input }) => {
  const chatMessages = await ctx.db.chatMessage.findMany({
    where: {
      chatId: input.sessionId,
    },
    orderBy: {
      createdAt: "asc",
    },
    select :{
      content : true,
      role : true
      
    }
  });
  return chatMessages;
}),
});