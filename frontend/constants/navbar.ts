export const navbarItems = [
    {
        id: 1,
        name: "Home",
        href: "/",
    },
    {
        id: 2,
        name: "Jobs",
        href: "/jobs",
        dropdownItems: [
            {
                id: 1,
                name: "Find a Job",
                href: "/find-jobs/?page=1",
            },
            {
                id: 2,
                name: "Post a Job",
                href: "/post-job",
            },
            {
                id: 3,
                name: "Suggested Jobs",
                href: "/suggested-jobs",
            },
        ],
    },
    {
        id: 5,
        name: "Analyze Resume",
        href: "/analyze-resume",
    },
];
