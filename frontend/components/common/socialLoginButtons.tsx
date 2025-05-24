import Googlesvg from "@/lib/LogoProvider/googlesvg";
import { Button } from "../ui/button";

const SocialLoginButtons = ({
    isLogIn,
    role,
}: {
    isLogIn: boolean;
    role?: string;
}) => {
    const hangleGooleSignUpLogin = () => {
        isLogIn
            ? window.open(
                  `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/google?mode=login`,
                  "_self"
              )
            : window.open(
                  `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/google?mode=register&role=${role}`,
                  "_self"
              );
    };
    return (
        <div className="grid gap-2">
            <Button
                variant="outline"
                className="flex items-center justify-center w-full cursor-pointer"
                onClick={hangleGooleSignUpLogin}
            >
                <Googlesvg />
                <span>{isLogIn ? "Sign In" : "Sign Up"} With Google</span>
            </Button>
        </div>
    );
};

export default SocialLoginButtons;
