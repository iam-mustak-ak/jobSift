const Page = async ({ params }: { params: Promise<{ category: string }> }) => {
    const { category } = await params;
    return <h1>Welcome to {category}</h1>;
};

export default Page;
