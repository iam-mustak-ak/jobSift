export const formateSelectValues = (data: Record<string, any>[]) => {
    return data.map((item) => ({
        label: item.name,
        value: item._id,
    }));
};
