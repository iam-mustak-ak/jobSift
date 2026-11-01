import SigninForm from "@/components/common/signinForm";
import AuthShell from "@/components/common/authShell";

const Page = () => {
    return (
        <AuthShell>
            <SigninForm />
        </AuthShell>
    );
};

export default Page;
