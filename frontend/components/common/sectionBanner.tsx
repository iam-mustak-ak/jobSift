import HeroSearch from "./heroSearch";

const SectionBanner = () => {
    return (
        <div className="mt-16 pt-16 pb-12 bg-gradient-to-br from-transparent to-primary/20">
            <div className="max-w-[1280px] mx-auto">
                <HeroSearch showCategory={true} />
            </div>
        </div>
    );
};

export default SectionBanner;
