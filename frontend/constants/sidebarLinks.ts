import {
    BookCheck,
    Bookmark,
    CircleUserRound,
    FileChartLine,
    FileUser,
    LayoutDashboard,
    NotepadText,
    Settings2,
} from "lucide-react";

export const sideabrLinksData = {
    basic: [
        {
            name: "Dashboard",
            url: "/profile",
            icon: LayoutDashboard,
        },
        {
            name: "Build Resume",
            url: "/build-resume",
            icon: FileUser,
        },
        {
            name: "Analyze Resume",
            url: "/analyze-resume",
            icon: FileChartLine,
        },
        {
            name: "My Jobs",
            url: "/my-jobs?page=1",
            icon: BookCheck,
        },
        {
            name: "Saved Jobs",
            url: "/saved-jobs",
            icon: Bookmark,
        },

        {
            name: "Applied Jobs",
            url: "/applied-jobs",
            icon: NotepadText,
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
                    url: "/find-jobs/?page=1",
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
