type ProfilePrps = {
    params: Promise<{ profileId: string }>;
};
const Page = async ({ params }: ProfilePrps) => {
    const { profileId } = await params;

    return <h1>Welcome to {profileId}</h1>;
};

export default Page;
