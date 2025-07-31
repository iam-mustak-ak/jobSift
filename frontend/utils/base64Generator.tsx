export const base64Generator = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const filereader = new FileReader();
        filereader.onload = () => {
            if (filereader.result) {
                resolve(filereader.result as string);
            } else {
                reject(new Error("Failed to read file as base64"));
            }
        };
        filereader.onerror = (error) => reject(error);
        filereader.readAsDataURL(file);
    });
};
