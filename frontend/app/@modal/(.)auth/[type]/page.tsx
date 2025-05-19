import { Modal } from "@/components/common/modal";
import SigninForm from "@/components/common/signinForm";
import SignupForm from "@/components/common/signupForm";
type LoginPageProps = {
    params: Promise<{ type: string }>;
};

export default async function Login({ params }: LoginPageProps) {
    const { type } = await params;
    return (
        <Modal>
            <div className="flex items-center justify-center ">
                {type === "login" ? <SigninForm /> : <SignupForm />}
            </div>
        </Modal>
    );
}
