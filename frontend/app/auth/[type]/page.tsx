import SigninForm from "@/components/common/signinForm";
import SignupForm from "@/components/common/signupForm";

type LoginPageProps = {
    params: Promise<{ type: string }>;
};

async function Login({ params }: LoginPageProps) {
    const { type } = await params;
    return (
        <div className="flex items-center justify-center h-[90dvh]">
            {type === "login" ? <SigninForm /> : <SignupForm />}
        </div>
    );
}

export default Login;
