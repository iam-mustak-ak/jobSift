import { Option } from "@/components/ui/multiSelect";

export const formatData = (data: any[]): Option[] => {
    return data.map((item) => ({
        label: item.name,
        value: item.name,
    }));
};
