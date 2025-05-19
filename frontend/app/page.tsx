import Hero from "@/components/common/hero";
import FeaturedJob from "@/components/jobs/featuredJob";
import JobCategories from "@/components/jobs/jobCategories";

export default function Home() {
    return (
        <>
            <Hero />
            <JobCategories />
            <FeaturedJob />
        </>
    );
}
