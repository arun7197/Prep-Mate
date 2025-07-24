import { Lightbulb, Volume2 } from "lucide-react";
import { textToSpeech } from './TextToSpeech';

interface Question {
  id: number;
  text: string;
  answer: string;
}

interface QuestionsSectionProps {
  interviewQuestion: Question[];
  activeIndex: number;
}

const QuestionsSection = ({ interviewQuestion, activeIndex}: QuestionsSectionProps) => {
  //console.log("Rendering QuestionsSection:", interviewQuestion);
  let audioFileUrl: string | null = null;

  const handlePlayQuestion = async () => {
    audioFileUrl = await textToSpeech(interviewQuestion[activeIndex]?.text);
    if (audioFileUrl) {
      const audio = new Audio(audioFileUrl);
      audio.play();
    } else {
      console.error("Audio file URL is null or undefined.");
    }
  };

  return (
    <div >
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {interviewQuestion.map((question, index) => (
          <h2
            key={question.id}
            className={`
              py-2 px-4 rounded-full text-xs md:text-sm text-center cursor-pointer
              transition-all duration-200 hover:scale-105
              ${index === activeIndex 
                ? 'bg-primary text-white shadow-md' 
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}
            `}
          >
            Question #{index + 1}
          </h2>
        ))}
      </div>
      
      <div className="space-y-6">
        <div className="bg-gray-50 p-6 rounded-xl">
          <h2 className=" font-medium text-gray-800 leading-relaxed">
            {interviewQuestion[activeIndex]?.text}
          </h2>
          <button
            onClick={handlePlayQuestion}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg flex items-center gap-2 
              hover:bg-primary/90 transition-colors duration-200 shadow-sm"
          >
            <Volume2 className="h-5 w-5" />
            <span className="text-sm">Play Question</span>
          </button>
        </div>

        <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-xl shadow-sm border border-amber-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-amber-100 p-2 rounded-lg">
              <Lightbulb className="h-5 w-5 text-amber-600" />
            </div>
            <h3 className="font-semibold text-amber-900">Important Note</h3>
          </div>
          <p className="text-amber-800 text-sm leading-relaxed">
            Click on Record Answer when you are ready. At the end of the interview, we will provide you with detailed feedback, including the correct answers and your responses for comparison.
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuestionsSection;
