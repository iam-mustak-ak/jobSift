type headingProps = {
    title: string;
    subHeading: string;
};

const SectionHeading = ({ title, subHeading }: headingProps) => {
    return (
        <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-secondary-foreground mb-2">
                {title}
            </h2>
            <p className="font-normal text-muted-foreground">{subHeading}</p>
        </div>
    );
};

export default SectionHeading;
