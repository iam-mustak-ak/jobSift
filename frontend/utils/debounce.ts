export function debounce<F extends (...args: any[]) => void>(
    func: F,
    wait: number
) {
    let timeout: ReturnType<typeof setTimeout>;

    return function (this: any, ...args: Parameters<F>) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    } as F;
}
