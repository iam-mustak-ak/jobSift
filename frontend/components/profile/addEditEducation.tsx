import { API_BASE_URL } from "@/lib/api";
import { useAuthStore } from "@/state/store";
import {
    CalendarDays,
    GraduationCap,
    Loader2,
    Plus,
    Save,
    Sparkles,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import CustomInput from "../common/customInput";
import EducationCard from "../common/educationCard";
import { Button } from "../ui/button";
import {
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "../ui/sheet";

type Education = {
    degree: string;
    institution: string;
    startDate: string;
    endDate: string;
};

const AddEditEducation = () => {
    const { setAuth, user } = useAuthStore((state) => state);

    const [formData, setFormData] = useState<Education>({
        degree: "",
        institution: "",
        startDate: "",
        endDate: "",
    });
    const [loading, setLoading] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null); // 🔥 track edit

    // handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // save to DB + Zustand
    const updateUserEducations = async (updatedList: Education[]) => {
        const updatedUser = { ...user, educations: updatedList };
        const response = await fetch(
            `${API_BASE_URL}/auth/update-profile`,
            {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedUser),
            }
        );
        if (!response.ok) throw new Error("Failed to save education details");
        setAuth(updatedUser);
    };

    // handle Add or Update
    const handleSave = async () => {
        setLoading(true);
        try {
            if (!formData.degree.trim() || !formData.institution.trim()) {
                toast.error("Please fill all required fields");
                return;
            }

            let updatedList: Education[];

            if (editingIndex !== null) {
                // 🔥 update existing
                updatedList = (user?.educations || []).map(
                    (edu: Education, i: number) =>
                        i === editingIndex ? formData : edu
                );
            } else {
                // 🔥 add new
                updatedList = [...(user?.educations || []), formData];
            }

            await updateUserEducations(updatedList);
            toast.success(editingIndex !== null ? "Education updated!" : "Education added!");

            // reset form
            setFormData({
                degree: "",
                institution: "",
                startDate: "",
                endDate: "",
            });
            setEditingIndex(null);
        } catch (err) {
            toast.error("Something went wrong");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // handle Remove
    const handleRemove = async (index: number) => {
        try {
            const updatedList = (user?.educations || []).filter(
                (_: Education, i: number) => i !== index
            );
            await updateUserEducations(updatedList);
            toast.success("Education removed!");
        } catch (err) {
            toast.error("Failed to remove education");
            console.error(err);
        }
    };

    // handle Edit → load data into form
    const handleEdit = (index: number) => {
        setEditingIndex(index);
        setFormData(user?.educations[index]);
    };

    return (
        <SheetContent className="w-full gap-0 overflow-hidden border-l-slate-200 bg-white p-0 sm:max-w-xl [&>button]:right-5 [&>button]:top-5 [&>button]:rounded-lg [&>button]:bg-white/15 [&>button]:p-2 [&>button]:text-white [&>button]:opacity-100 [&>button]:hover:bg-white/25">
            <SheetHeader className="relative overflow-hidden bg-gradient-to-br from-violet-700 via-violet-700 to-indigo-600 px-6 py-7 text-white sm:px-8">
                <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-14 h-48 w-48 rounded-full border-[28px] border-white/10" />
                <div className="relative flex items-start gap-4 pr-8">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-white/20">
                        <GraduationCap className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-violet-100">Profile details</p>
                        <SheetTitle className="text-xl font-bold text-white sm:text-2xl">
                            {editingIndex !== null ? "Edit education" : "Add your education"}
                        </SheetTitle>
                        <SheetDescription className="mt-2 max-w-sm text-sm leading-5 text-violet-100">
                            Share your academic background to give employers more context about you.
                        </SheetDescription>
                    </div>
                </div>
            </SheetHeader>

            <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6 sm:px-8">
                <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
                    <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-900">
                        <Sparkles className="h-4 w-4 text-violet-600" />
                        Education details
                    </div>
                    <div className="grid gap-4">
                        <CustomInput
                            id="add-int"
                            label="School or institution *"
                            name="institution"
                            type="text"
                            placeholder="e.g. University of Dhaka"
                            value={formData.institution}
                            onChange={handleChange}
                            required
                            className="h-11 rounded-xl border-slate-200 bg-white px-3.5 text-sm"
                        />
                        <CustomInput
                            id="add-deg"
                            label="Degree or qualification *"
                            name="degree"
                            type="text"
                            placeholder="e.g. BSc in Computer Science"
                            value={formData.degree}
                            onChange={handleChange}
                            required
                            className="h-11 rounded-xl border-slate-200 bg-white px-3.5 text-sm"
                        />
                        <div>
                            <p className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-700"><CalendarDays className="h-4 w-4 text-violet-600" /> Study period <span className="font-normal text-slate-400">(optional)</span></p>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <CustomInput
                                    id="add-start"
                                    label="Start date"
                                    name="startDate"
                                    type="date"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    className="h-11 rounded-xl border-slate-200 bg-white px-3.5 text-sm"
                                />
                                <CustomInput
                                    id="add-end"
                                    label="End date"
                                    name="endDate"
                                    type="date"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    className="h-11 rounded-xl border-slate-200 bg-white px-3.5 text-sm"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <div className="mb-3 flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-semibold text-slate-900">Education history</h3>
                            <p className="mt-1 text-xs text-slate-500">{user?.educations?.length || 0} entries on your profile</p>
                        </div>
                    </div>
                    {user?.educations?.length ? (
                        <div className="space-y-3">
                            {user.educations.map((edu: Education, i: number) => (
                                <EducationCard
                                    key={i}
                                    data={edu}
                                    onRemove={() => handleRemove(i)}
                                    onEdit={() => handleEdit(i)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-7 text-center">
                            <GraduationCap className="mx-auto h-7 w-7 text-slate-300" />
                            <p className="mt-2 text-sm font-medium text-slate-700">No education added yet</p>
                            <p className="mt-1 text-xs text-slate-500">Your entries will appear here after you save them.</p>
                        </div>
                    )}
                </section>
            </div>

            <SheetFooter className="mt-0 border-t border-slate-200 bg-white px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                <p className="hidden text-xs text-slate-400 sm:block">Fields marked * are required</p>
                <div className="flex w-full gap-3 sm:w-auto">
                    <SheetClose asChild>
                        <Button type="button" variant="outline" className="h-11 flex-1 rounded-xl sm:flex-none">
                            Close
                        </Button>
                    </SheetClose>
                    <Button type="button" onClick={handleSave} disabled={loading} className="h-11 flex-1 rounded-xl bg-violet-700 px-5 font-semibold shadow-md shadow-violet-700/15 hover:bg-violet-800 sm:flex-none">
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : editingIndex !== null ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                        {loading ? "Saving…" : editingIndex !== null ? "Save changes" : "Add education"}
                    </Button>
                </div>
            </SheetFooter>
        </SheetContent>
    );
};

export default AddEditEducation;
