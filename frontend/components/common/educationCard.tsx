import { GraduationCapIcon } from "lucide-react";

const EducationCard = () => {
    return (
        <div className="flex items-start gap-3 rounded-lg border p-3 shadow-sm">
            <GraduationCapIcon />
            <div>
                <p className="text-md font-medium ">Leading University</p>
                <p className="text-sm">Computer science</p>
                <p className="text-sm">Started At: 2021</p>
                <p className="text-sm">End I: 2025</p>
            </div>
        </div>
    );
};

export default EducationCard;
