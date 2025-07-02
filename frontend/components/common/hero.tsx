import Image from "next/image";
import ContainerWrapper from "./containerWrapper";
import HeroSearch from "./heroSearch";

const Hero = () => {
    return (
        <div className="bg-gradient-to-br from-transparent to-primary/20">
            <ContainerWrapper>
                <div className="grid md:grid-cols-2 gap-20 items-center justify-center py-20 pt-40">
                    <div className="grid gap-10">
                        <h2 className="text-5xl font-semibold text-secondary-foreground leading-snug">
                            There Are{" "}
                            <span className="text-primary">93,178</span>{" "}
                            Postings Here For you!
                        </h2>
                        <p className="text-base font-normal text-muted-foreground">
                            Find Jobs, Employment & Career Opportunities
                        </p>
                        <HeroSearch showCategory={true} />

                        <div className="flex items-center gap-4">
                            <p className="text-base font-semibold text-muted-foreground">
                                Popular Searches :{" "}
                            </p>
                            <p className="text-muted-foreground ">
                                Designer, Developer, Web, IOS
                            </p>
                        </div>
                    </div>
                    <div>
                        <Image
                            src="/job-svg.svg"
                            width={1000}
                            height={500}
                            alt="Hero image"
                        />
                    </div>
                </div>
            </ContainerWrapper>
        </div>
    );
};

export default Hero;
