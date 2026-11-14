import { API_BASE_URL } from "@/lib/api";
import Googlesvg from "@/lib/LogoProvider/googlesvg";
import { Button } from "../ui/button";

const SocialLoginButtons = ({
    isLogIn,
    role,
}: {
    isLogIn: boolean;
    role?: string;
}) => {
    const handleGooleSignUpLogin = () => {
        if (isLogIn) {
            window.open(
                `${API_BASE_URL}/auth/google?mode=login`,
                "_self"
            );
        } else {
            window.open(
                `${API_BASE_URL}/auth/google?mode=register&role=${role}`,
                "_self"
            );
        }
    };
    return (
        <div className="grid gap-2">
            <Button
                variant="outline"
                className="h-11 w-full cursor-pointer rounded-xl border-slate-200 bg-white text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                onClick={handleGooleSignUpLogin}
            >
                <Googlesvg />
                <span>Continue with Google</span>
            </Button>
        </div>
    );
};

export default SocialLoginButtons;
