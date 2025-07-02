export const salaryFormat = (salary: Record<string, number>) => {
    const min = Intl.NumberFormat("en-US", {
        notation: "compact",
        style: "currency",
        currency: "USD",
    }).format(salary?.min);
    const max = Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        notation: "compact",
    }).format(salary?.max);

    const newSalary: Record<string, string> = {
        min,
        max,
    };
    return newSalary;
};
