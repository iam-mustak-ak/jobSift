const Page = async ({ params }: { params: Promise<{ jobId: string }> }) => {
    const { jobId } = await params;
    console.log(jobId);
    return <h1>Welcome to Page</h1>;
};

export default Page;
