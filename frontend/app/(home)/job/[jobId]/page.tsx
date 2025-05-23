const Page = async ({ params }: { params: Promise<{ jobId: string }> }) => {
    const { jobId } = await params;

    return <h1>Welcome to {jobId}</h1>;
};

export default Page;
