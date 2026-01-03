// // src/app/api/webhooks/clerk/route.ts
// import { db } from "@/server/db"
// import { verifyWebhook } from "@clerk/nextjs/webhooks"
// import { NextResponse, type NextRequest } from "next/server"

// export async function POST(request: NextRequest) { 
//     console.log("🔔 Webhook received!");
    
//     try {
//         const event = await verifyWebhook(request, {
//             signingSecret: process.env.CLERK_WEBHOOK_SIGNING_SECRET,
//         })
        
//         console.log("📦 Event type:", event.type);
        
//         switch (event.type) {
//             case "user.created": 
//             case "user.updated": 
//                 const data = event.data 
//                 const email = data.email_addresses.find(
//                     e => e.id === data.primary_email_address_id
//                 )?.email_address 
                
//                 console.log("👤 Processing user:", data.id, email);
                
//                 const user = await db.user.upsert({
//                     where: { id: data.id }, 
//                     update: {
//                         email: email,
//                         firstName: data.first_name || "",
//                         lastName: data.last_name || "",
//                         image: data.image_url,
//                     },
//                     create: {
//                         id: data.id,
//                         email: email || "",
//                         firstName: data.first_name || "",
//                         lastName: data.last_name || "",
//                         image: data.image_url,
//                     },
//                 });
                
//                 console.log("✅ User upserted:", user);
//                 break;
//         }
        
//         return NextResponse.json({ success: true }, { status: 200 })
        
//     } catch (error) {
//         console.error('❌ Webhook error:', error);
//         return new Response("Invalid webhook", { status: 400 })
//     }
// }