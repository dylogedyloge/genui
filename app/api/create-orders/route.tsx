import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/utils/supabase-client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { chatId, userId, agentType, details } = req.body;

    const { data, error } = await supabase
      .from("orders")
      .insert({
        chat_id: chatId,
        user_id: userId,
        agent_type: agentType,
        details,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(200).json({ order: data });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
