import ResumeForm from "./resumeForm";
import ResumePreview from "./resumePreview";

const ResumeBody: React.FC = () => {
    return (
        <div className="mx-auto grid max-w-[1600px] grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(390px,0.92fr)_minmax(0,1.08fr)]">
            <div className="min-w-0">
                <ResumeForm />
            </div>
            <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 p-3 shadow-sm xl:sticky xl:top-[10.5rem] xl:max-h-[calc(100vh-12rem)] xl:p-4">
                <div className="mb-3 flex items-center justify-between gap-3 px-1">
                    <div>
                        <h2 className="text-sm font-semibold text-slate-900">Live preview</h2>
                        <p className="text-xs text-slate-500">Updates as you edit</p>
                    </div>
                    <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-slate-500 ring-1 ring-slate-200">A4 page</span>
                </div>
                <div className="max-h-[70vh] overflow-auto rounded-xl bg-white shadow-inner xl:max-h-[calc(100vh-16rem)]">
                    <ResumePreview />
                </div>
            </section>
        </div>
    );
};

export default ResumeBody;
