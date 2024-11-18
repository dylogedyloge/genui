// components/chat/Header.tsx
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface HeaderProps {
  onBack: () => void;
}

const Header: React.FC<HeaderProps> = ({ onBack }) => (
  <Button variant="secondary" className="self-end mb-4" onClick={onBack}>
    <ArrowRight className="w-4 h-4 mr-6" />
    برگشت
  </Button>
);

export default Header;
