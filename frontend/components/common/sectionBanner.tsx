import { formateCapitalized } from "@/utils/formateCapitalized";
import HeroSearch from "./heroSearch";

const SectionBanner = ({ title }: { title?: string }) => {
    return (
        <div className="mt-16 pt-16 pb-12 bg-gradient-to-br from-transparent to-primary/20">
            <div className="max-w-[1280px] mx-auto">
                {title ? (
                    <h2 className="text-3xl text-center font-bold">
                        {formateCapitalized(title)}
                    </h2>
                ) : (
                    <HeroSearch showCategory={true} />
                )}
            </div>
        </div>
    );
};

export default SectionBanner;
