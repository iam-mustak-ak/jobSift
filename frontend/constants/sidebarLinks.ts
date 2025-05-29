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
                    url: "edit-profile",
                },
                {
                    title: "Change Password",
                    url: "change-password",
                },
                {
                    title: "Settings",
                    url: "settings",
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
                    url: "/find-jobs",
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
                    url: "sessions",
                },
                {
                    title: "Deactive Account",
                    url: "#",
                },
            ],
        },
    ],
};
