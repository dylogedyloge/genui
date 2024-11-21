//schema.ts

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values"

// Enum for chat message sender type (user or bot)
export const byEnumChat = v.union(v.literal("user"), v.literal("bot"));

// Enum for order types
export const orderTypeEnum = v.union(
    v.literal("flight"),
    v.literal("hotel"),
    v.literal("tour"),
    v.literal("restaurant")
);

// Enum for order status
export const orderStatusEnum = v.union(
    v.literal("pending"),
    v.literal("confirmed"),
    v.literal("cancelled"),
    v.literal("completed")
);

export default defineSchema({
    // Notes table - stores chat sessions
    note: defineTable({
        title: v.string(),
        userId: v.string(),
        createdAt: v.number(), // Unix timestamp in milliseconds
    })
    .index("by_user", ["userId"])
    .index("by_user_and_time", ["userId", "createdAt"]),

    // Chats table - stores individual messages
    chats: defineTable({
        noteId: v.id("note"),
        data: v.string(),
        userId: v.string(),
        by: byEnumChat
    })
    .index("by_note", ["noteId"])
    .index("by_user", ["userId"]),

    // Orders table - stores all booking/purchase orders
    orders: defineTable({
        // User identification
        userId: v.string(),
        
        // Order classification
        orderType: orderTypeEnum,
        status: orderStatusEnum,
        
        // Timing
        createdAt: v.number(),
        
        // Financial information
        totalAmount: v.number(),
        currency: v.string(),
        
        // Detailed order information
        orderDetails: v.string(), // Stringified JSON containing type-specific details
        
        // References
        noteId: v.optional(v.id("note")), // Reference to chat session
        paymentId: v.optional(v.string()), // Payment transaction reference
        bookingReference: v.optional(v.string()), // Booking reference number
    })
    .index("by_user", ["userId"])
    .index("by_user_and_type", ["userId", "orderType"])
    .index("by_user_and_time", ["userId", "createdAt"])
    .index("by_status", ["status"])
});

/* 
Example orderDetails JSON structures for different order types:

Flight Order:
{
    flightNumber: string,
    departure: {
        airport: string,
        date: string,
        time: string
    },
    arrival: {
        airport: string,
        date: string,
        time: string
    },
    passengers: number,
    class: string
}

Hotel Order:
{
    hotelName: string,
    checkIn: string,
    checkOut: string,
    roomType: string,
    guests: number,
    numberOfRooms: number
}

Tour Order:
{
    tourName: string,
    date: string,
    numberOfPeople: number,
    duration: string,
    location: string
}

Restaurant Order:
{
    restaurantName: string,
    date: string,
    time: string,
    numberOfPeople: number,
    specialRequests: string
}
*/