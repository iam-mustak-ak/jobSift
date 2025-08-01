type LanguageProps = {
    language: string;
    status: "Working Proficiency" | "Native or Bilingual" | "Professional";
};
const LanguageCard: React.FC<LanguageProps> = ({ language, status }) => {
    return (
        <div>
            <div className="flex flex-col gap-0">
                <h4 className="text-sm">{language}</h4>
                <span className="text-xs text-primary">{status}</span>
            </div>
        </div>
    );
};

export default LanguageCard;
