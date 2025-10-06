import { Option } from "@/components/ui/multiSelect";

export const formatData = (data: any[]): Option[] => {
    return data.map((item) => ({
        id: item._id,
        label: item.name,
        value: item.name,
    }));
};
