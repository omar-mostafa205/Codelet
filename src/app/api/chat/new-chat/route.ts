/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { db } from "@/server/db"
import { NextResponse } from "next/server"

export const POST = async (request: Request) => {
  try {
    const body = await request.json()
    const tutorialId = body.tutorialId
    if (!tutorialId) {
      return NextResponse.json(
        { error: "tutorialId is required" },
        { status: 400 }
      )
    }

     const newChat = await db.chatSession.create({
      data: {
        tutorialId,
      },
    })

    return NextResponse.json(newChat, { status: 201 })
  } catch (error) {
    console.error("Error creating chat session:", error)
    return NextResponse.json(
      { error: "Failed to create chat" },
      { status: 500 }
    )
  }
}
