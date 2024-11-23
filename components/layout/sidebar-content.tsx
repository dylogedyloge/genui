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
import { useRouter } from "next/navigation";

export function SidebarContent() {
  return (
    <Content>
      <Button 
        className="flex justify-center gap-6 mx-4"
      >
        <Plus />
       <div>گفتگوی جدید</div>
      </Button>
      <SidebarGroup>
        <CollapsibleSection title="تاریخچه گفتگو" />
        <Separator orientation="horizontal" />
        <CollapsibleSection title="خریدها" />
      </SidebarGroup>
    </Content>
  );
}
function CollapsibleSection({
    title,
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
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    );
  }