import { db } from "@/server/db"
import { verifyWebhook } from "@clerk/nextjs/webhooks"
import { NextResponse, type NextRequest } from "next/server"

export const POST = async (request: NextRequest ) => { 
    try {
        const event = await verifyWebhook(request)
        switch (event.type) {
            case "user.created": 
            case "user.updated": 
            const data = event.data 
            const email = data.email_addresses.find(
                e => e.id === data.primary_email_address_id
              )?.email_address 
              const createUpdateUser = await db.user.upsert({
                where: { id: data.id }, 
                update: {
                    email : email,
                  firstName: data.first_name || "",
                  lastName: data.last_name || "",
                  image: data.image_url,
                },
                create: {
                  id: data.id,
                    email : email || " ",
                  firstName: data.first_name || "",
                  lastName: data.last_name || "",
                  image: data.image_url,
                },
              });
              break
              
            }
            return NextResponse.json({success : true} , {status : 200 })
        
        } catch (error) {
            console.error('Webhook error:', error);
            return new Response("Invalid webhook", { status: 400 })
          }
}