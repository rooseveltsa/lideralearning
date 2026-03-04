import { headers } from "next/headers"
import { handleStripeWebhook } from "@/lib/stripe-webhook"

export async function POST(req: Request) {
    const body = await req.text()
    const headerPayload = await headers()
    const signature = headerPayload.get("stripe-signature")

    return handleStripeWebhook({ body, signature })
}
