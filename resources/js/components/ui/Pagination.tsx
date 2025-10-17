import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    className = ''
}) => {
    if (totalPages <= 1) return null;

    return (
        <div className={`flex flex-col sm:flex-row justify-between items-center gap-145 mt-4 text-sm text-gray-600 ${className}`}>
            <div className="w-full sm:w-auto text-center sm:text-left">
                Page {currentPage} sur {totalPages}
            </div>
            <div className="flex gap-2 w-full sm:w-auto justify-center sm:justify-end">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded-md border text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                >
Précédent
                </button>
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded-md border text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                >
Suivant
                </button>
            </div>
        </div>
    );
};

export default Pagination;
