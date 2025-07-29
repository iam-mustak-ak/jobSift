import { Github, Linkedin, Mail } from "lucide-react";
import Link from "next/link";

type ResumeSocailProps = {
    link: string;
    text: string;
    type: "email" | "linkedin" | "github";
};

const ResumeSocial: React.FC<ResumeSocailProps> = ({ link, text, type }) => {
    let icon;
    if (type === "email") {
        icon = <Mail className="w-4 text-primary" />;
    }
    if (type === "github") {
        icon = <Github className="w-4 text-primary" />;
    }
    if (type === "linkedin") {
        icon = <Linkedin className="w-4 text-primary" />;
    }

    return (
        <>
            <Link
                href={type === "email" ? `mailto:${text}` : link}
                target="_blank"
                className="text-sm break-words"
            >
                {icon}
                {text}
            </Link>
        </>
    );
};

export default ResumeSocial;
