import { Separator } from "../ui/separator";

interface TemplatesTileProps {
    title: string;
}

const TemplatesTile: React.FC<TemplatesTileProps> = ({ title }) => {
    return (
        <>
            <h2 className="font-bold text-primary text-base uppercase">
                {title}
            </h2>
            <Separator className="h-0.5 bg-primary w-full" />
        </>
    );
};

export default TemplatesTile;
