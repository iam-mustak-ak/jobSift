import Hero from "@/components/common/hero";
import FeaturedJob from "@/components/jobs/featuredJob";
import JobCategories from "@/components/jobs/jobCategories";

export default function Home() {
    return (
        <main className="bg-white text-slate-900">
            <Hero />
            <JobCategories />
            <FeaturedJob />
        </main>
    );
}
