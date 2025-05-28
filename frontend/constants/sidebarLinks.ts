import {
    CircleUserRound,
    FileUser,
    House,
    NotepadText,
    Settings2,
} from "lucide-react";

export const sideabrLinksData = {
    basic: [
        {
            name: "Home",
            url: "/",
            icon: House,
        },
        {
            name: "Build Resume",
            url: "/",
            icon: FileUser,
        },
    ],
    account: [
        {
            title: "Account",
            url: "#",
            icon: CircleUserRound,
            isActive: true,
            items: [
                {
                    title: "Edit Profile",
                    url: "/edit-profile",
                },
                {
                    title: "Change Password",
                    url: "#",
                },
                {
                    title: "Settings",
                    url: "#",
                },
            ],
        },
    ],

    navMain: [
        {
            title: "Job",
            url: "#",
            icon: NotepadText,
            isActive: true,
            items: [
                {
                    title: "Find a job",
                    url: "#",
                },
                {
                    title: "Suggested Job",
                    url: "#",
                },
            ],
        },

        {
            title: "Settings",
            url: "#",
            icon: Settings2,
            items: [
                {
                    title: "Sessions",
                    url: "#",
                },
                {
                    title: "Deactive Account",
                    url: "#",
                },
            ],
        },
    ],
};
