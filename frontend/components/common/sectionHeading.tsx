type headingProps = {
    title: string;
    subHeading: string;
    tone?: "default" | "light";
};

const SectionHeading = ({
    title,
    subHeading,
    tone = "default",
}: headingProps) => {
    return (
        <div className="text-center mb-12">
            <h2
                className={`mb-2 text-3xl font-semibold ${
                    tone === "light"
                        ? "text-slate-950"
                        : "text-secondary-foreground"
                }`}
            >
                {title}
            </h2>
            <p
                className={`font-normal ${
                    tone === "light" ? "text-slate-500" : "text-muted-foreground"
                }`}
            >
                {subHeading}
            </p>
        </div>
    );
};

export default SectionHeading;
