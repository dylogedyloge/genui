import { Button } from "@/components/shadcn/button";

interface SuggestedQuestionsProps {
  questions: string[];
  isLoading: boolean;
  onQuestionClick: (question: string) => void;
}

const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({
  questions,
  isLoading,
  onQuestionClick,
}) => (
  <div className="flex flex-wrap gap-2 mb-4">
    {questions.map((question, index) => (
      <Button
        key={index}
        variant="outline"
        className="text-sm"
        onClick={() => onQuestionClick(question)}
        disabled={isLoading}
      >
        {question}
      </Button>
    ))}
  </div>
);

export default SuggestedQuestions;
