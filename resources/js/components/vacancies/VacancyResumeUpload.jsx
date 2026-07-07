import React, { useEffect, useRef, useState } from "react";

const ACCEPT =
    ".txt,.pdf,.doc,.docx,text/plain,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

const ALLOWED_EXTENSIONS = [".txt", ".pdf", ".doc", ".docx"];

export function validateResumeFile(file) {
    if (!file) {
        return "Прикрепите файл резюме (TXT, PDF, DOC или DOCX, до 2 МБ)";
    }

    const fileName = file.name.toLowerCase();
    const hasAllowedExtension = ALLOWED_EXTENSIONS.some((ext) => fileName.endsWith(ext));

    if (!hasAllowedExtension) {
        return "Допустимые форматы: TXT, PDF, DOC, DOCX";
    }

    if (file.size > 2 * 1024 * 1024) {
        return "Размер файла не должен превышать 2 МБ";
    }

    return "";
}

function formatFileSize(bytes) {
    if (bytes < 1024) {
        return `${bytes} Б`;
    }
    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} КБ`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
}

function VacancyResumeUpload({ file, onChange, disabled = false, id = "vacancy-resume" }) {
    const inputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        if (!file && inputRef.current) {
            inputRef.current.value = "";
        }
    }, [file]);

    const openPicker = () => {
        if (!disabled) {
            inputRef.current?.click();
        }
    };

    const handleFiles = (files) => {
        const nextFile = files?.[0] || null;
        onChange(nextFile);
    };

    const handleDragEnter = (event) => {
        event.preventDefault();
        if (!disabled) {
            setIsDragging(true);
        }
    };

    const handleDragLeave = (event) => {
        event.preventDefault();
        if (!event.currentTarget.contains(event.relatedTarget)) {
            setIsDragging(false);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragging(false);
        if (!disabled) {
            handleFiles(event.dataTransfer.files);
        }
    };

    const handleRemove = (event) => {
        event.stopPropagation();
        onChange(null);
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    return (
        <div className="vacancy-resume">
            <p className="vacancy-resume__label">Резюме</p>

            <input
                ref={inputRef}
                id={id}
                type="file"
                name="resume"
                accept={ACCEPT}
                required={!file}
                disabled={disabled}
                className="sr-only"
                onChange={(event) => handleFiles(event.target.files)}
            />

            {!file ? (
                <button
                    type="button"
                    disabled={disabled}
                    onClick={openPicker}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className={`vacancy-resume__dropzone ${isDragging ? "vacancy-resume__dropzone--active" : ""}`}
                >
                    <span className="vacancy-resume__icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
                            <path
                                d="M12 16V6m0 0L8 10m4-4 4 4M5 18h14"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </span>
                    <span className="vacancy-resume__title">
                        {isDragging ? "Отпустите файл здесь" : "Перетащите резюме или нажмите для выбора"}
                    </span>
                    <span className="vacancy-resume__hint">TXT, PDF, DOC, DOCX · до 2 МБ</span>
                </button>
            ) : (
                <div className="vacancy-resume__file">
                    <div className="vacancy-resume__file-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
                            <path
                                d="M8 4h6l4 4v12a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z"
                                stroke="currentColor"
                                strokeWidth="1.6"
                            />
                            <path d="M14 4v4h4" stroke="currentColor" strokeWidth="1.6" />
                        </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="vacancy-resume__file-name">{file.name}</p>
                        <p className="vacancy-resume__file-size">{formatFileSize(file.size)}</p>
                    </div>
                    <button
                        type="button"
                        disabled={disabled}
                        onClick={handleRemove}
                        className="vacancy-resume__remove"
                        aria-label="Удалить файл"
                    >
                        ×
                    </button>
                </div>
            )}

            {file && (
                <button
                    type="button"
                    disabled={disabled}
                    onClick={openPicker}
                    className="vacancy-resume__replace"
                >
                    Выбрать другой файл
                </button>
            )}
        </div>
    );
}

export default VacancyResumeUpload;
