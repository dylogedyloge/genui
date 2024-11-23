"use client";
import { Plus, ChevronLeft } from "lucide-react";
import { Button } from "@/components/shadcn/button";
import {
  SidebarContent as Content,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
} from "@/components/shadcn/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/shadcn/collapsible";
import { Separator } from "@/components/shadcn/separator";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";


export function SidebarContent() {
  const createNote = useMutation(api.notes.create);
  const notes = useQuery(api.notes.getNotes);
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const handleNewChat = async () => {
    if (isCreating) return;

    setIsCreating(true);
    try {
      const noteId = await createNote();
      
      if (!noteId) {
        throw new Error("No note ID returned");
      }

      // Navigate to the new chat
      router.push(`/chat/${noteId}`);
      
      toast({
        title: "موفقیت",
        description: "گفتگوی جدید ایجاد شد",
      });
    } catch (error) {
      console.error("Error creating new chat:", error);
      
      // More specific error message
      const errorMessage = error instanceof Error 
        ? error.message 
        : "مشکل نامشخصی رخ داده است";

      toast({
        title: "خطا",
        description: `مشکلی در ایجاد گفتگو رخ داده است: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };
  return (
    <Content>
      <Button 
        className="flex justify-center gap-6 mx-4"
        onClick={handleNewChat}
        disabled={isCreating}
      >
        <Plus />
        <div>{isCreating ? "در حال ایجاد..." : "گفتگوی جدید"}</div>
      </Button>
      <SidebarGroup>
        <CollapsibleSection title="تاریخچه گفتگو" notes={notes}/>
        <Separator orientation="horizontal" />
        <CollapsibleSection title="خریدها" />
      </SidebarGroup>
    </Content>
  );
}

// function CollapsibleSection({ title }: { title: string }) {
//   return (
//     <SidebarMenu>
//       <Collapsible asChild className="group/collapsible">
//         <SidebarMenuItem>
//           <CollapsibleTrigger asChild>
//             <SidebarMenuButton>
//               <span>{title}</span>
//               <ChevronLeft className="mr-auto transition-transform duration-200 group-data-[state=open]/collapsible:-rotate-90" />
//             </SidebarMenuButton>
//           </CollapsibleTrigger>
//           <CollapsibleContent>
//             <SidebarMenuSub></SidebarMenuSub>
//           </CollapsibleContent>
//         </SidebarMenuItem>
//       </Collapsible>
//     </SidebarMenu>
//   );
// }
function CollapsibleSection({
  title,
  notes,
}: {
  title: string;
  notes?: { _id: string; title: string }[];
}) {
  const router = useRouter();

  return (
    <SidebarMenu>
      <Collapsible asChild className="group/collapsible">
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton>
              <span>{title}</span>
              <ChevronLeft className="mr-auto transition-transform duration-200 group-data-[state=open]/collapsible:-rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {notes ? (
                notes.map((note) => (
                  <SidebarMenuItem key={note._id}>
                    <SidebarMenuButton
                      onClick={() => router.push(`/chat/${note._id}`)}
                    >
                      {note.title}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              ) : (
                <SidebarMenuItem>
                  <SidebarMenuButton>در حال بارگذاری...</SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    </SidebarMenu>
  );
}