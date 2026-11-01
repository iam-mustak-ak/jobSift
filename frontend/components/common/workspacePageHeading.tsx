import { ReactNode } from "react";

const WorkspacePageHeading = ({
    title,
    description,
    icon,
    action,
}: {
    title: string;
    description: string;
    icon: ReactNode;
    action?: ReactNode;
}) => (
    <div className="flex flex-col gap-4 rounded-3xl border border-violet-100 bg-gradient-to-r from-violet-50 via-white to-indigo-50 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-violet-700 shadow-sm ring-1 ring-violet-100">
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-700">Workspace</p>
                <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">{title}</h1>
                <p className="mt-1 text-sm leading-5 text-slate-500">{description}</p>
            </div>
        </div>
        {action}
    </div>
);

export default WorkspacePageHeading;
