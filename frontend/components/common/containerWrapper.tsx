const ContainerWrapper = ({ children }: { children: React.ReactNode }) => {
    return <div className="container mx-auto px-5 ">{children}</div>;
};

export default ContainerWrapper;
