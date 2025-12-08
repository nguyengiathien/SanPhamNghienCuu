'use client';
import { useState } from "react";

export default function AssignmentCard({ assignment }) {
    const [isSubmitted, setIsSubmitted] = useState(assignment.isSubmitted || false);
    console.log('Rendering AssignmentCard for:', assignment.title, 'isSubmitted:', isSubmitted);

    // Try to parse various common date formats (ISO, dd/mm/yyyy, dd-mm-yyyy)
    function parseDate(s) {
        if (!s) return null;
        // try native parse first (covers ISO and many browser-recognized formats)
        const d = new Date(s);
        if (!isNaN(d)) return d;

        // try dd/mm/yyyy
        if (s.includes('/')) {
            const parts = s.split('/').map(p => p.trim());
            if (parts.length === 3) {
                const [dd, mm, yyyy] = parts;
                const dt = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
                if (!isNaN(dt)) return dt;
            }
        }

        // try dd-mm-yyyy or yyyy-mm-dd
        if (s.includes('-')) {
            const parts = s.split('-').map(p => p.trim());
            if (parts.length === 3) {
                // if first part looks like year (4 digits) assume yyyy-mm-dd
                if (parts[0].length === 4) {
                    const [yyyy, mm, dd] = parts;
                    const dt = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
                    if (!isNaN(dt)) return dt;
                } else {
                    // assume dd-mm-yyyy
                    const [dd, mm, yyyy] = parts;
                    const dt = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
                    if (!isNaN(dt)) return dt;
                }
            }
        }

        // fallback
        return null;
    }

    const dueDateObj = parseDate(assignment.dueDate);
    const now = new Date();
    const isOverdue = !isSubmitted && dueDateObj ? dueDateObj < now : false;

    // determine badge to show (only one badge)
    let statusBadge = null;
    if (isSubmitted) {
        statusBadge = (
            <p className="text-sm bg-green-600 p-1 text-white font-medium rounded absolute top-2 right-2">Đã nộp</p>
        );
    } else if (isOverdue) {
        statusBadge = (
            <p className="text-sm bg-red-600 p-1 text-white font-medium rounded absolute top-2 right-2">Trễ hạn</p>
        );
    } else {
        statusBadge = (
            <p className="text-sm bg-gray-600 p-1 text-white font-medium rounded absolute top-2 right-2">Chưa nộp</p>
        );
    }

    // formatted due date for display
    const dueDateDisplay = dueDateObj ? dueDateObj.toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric' }) : (assignment.dueDate || '—');

    return (
        <div className="relative assignment-card border border-gray-300 rounded-lg p-4 mb-4 shadow-sm hover:shadow-md transition-shadow duration-200">
            <h4 className="text-lg font-semibold text-indigo-900 mb-2">{assignment.title}</h4>
            <p className="text-gray-700 mb-2">{assignment.description}</p>
            <p className="text-sm text-gray-500">Due Date: {dueDateDisplay}</p>
            {statusBadge}
        </div>
    );
}