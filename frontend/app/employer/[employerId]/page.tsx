const Page = async ({
    params,
}: {
    params: Promise<{ employerId: string }>;
}) => {
    const { employerId } = await params;
    return <h1>Welcome to {employerId}</h1>;
};

export default Page;
