"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ComponentRef, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export function Modal({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const dialogRef = useRef<ComponentRef<"dialog">>(null);

    useEffect(() => {
        if (!dialogRef.current?.open) {
            dialogRef.current?.showModal();
        }
    }, []);

    function onDismiss() {
        router.back();
    }

    return createPortal(
        <div>
            <dialog
                ref={dialogRef}
                className="fixed left-1/2 top-1/2 -translate-1/2 rounded-md"
                onClose={onDismiss}
            >
                {children}
                <button
                    onClick={onDismiss}
                    className="close-button absolute top-4 right-4 cursor-pointer"
                >
                    <X />
                </button>
            </dialog>
        </div>,
        document.querySelector("body")!
    );
}
