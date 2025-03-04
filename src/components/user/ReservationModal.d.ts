import React from "react";
interface ReservationModal {
    confirmText: string;
    onConfirm: () => void;
    children: React.ReactNode;
    cancelText: string;
    onCancel: () => void;
}
export default function ReservationModal({ confirmText, onConfirm, children, cancelText, onCancel, }: ReservationModal): import("react/jsx-runtime").JSX.Element;
export {};
