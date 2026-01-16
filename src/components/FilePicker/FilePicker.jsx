// src/components/FilePicker/FilePicker.jsx
import { useState, useRef } from 'react';
import { FiUpload, FiFile, FiImage, FiFileText, FiFileMinus, FiCheck, FiX, FiTrash2 } from 'react-icons/fi';
import styles from './FilePicker.module.css';

const FilePicker = ({
    onChange,
    accept,
    multiple = false,
    maxSize,
    label,
    error,
    preview = false,
    className = '',
    required = false,
    helperText,
    disabled = false,
    fullWidth = true,
    size = 'medium',

    // Individual file type flags
    jpg = false,
    png = false,
    pdf = false,
    doc = false,
    docx = false,
    txt = false,
    xls = false,
    xlsx = false,
    ppt = false,
    pptx = false,
    zip = false,
    mp4 = false,
    mp3 = false,

    // Additional config
    maxFiles,
    showFileSize = true,
    showFileType = true,
    dragDropText = "Drag & drop files here, or click to select",
    browseButtonText = "Browse Files",
    ...rest
}) => {
    const [files, setFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const inputRef = useRef(null);

    // Generate accept string from individual file type flags
    const generateAcceptString = () => {
        if (accept) return accept; // Use provided accept string if exists

        const types = [];
        if (jpg) types.push('.jpg', '.jpeg', 'image/jpeg');
        if (png) types.push('.png', 'image/png');
        if (pdf) types.push('.pdf', 'application/pdf');
        if (doc) types.push('.doc', 'application/msword');
        if (docx) types.push('.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        if (txt) types.push('.txt', 'text/plain');
        if (xls) types.push('.xls', 'application/vnd.ms-excel');
        if (xlsx) types.push('.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        if (ppt) types.push('.ppt', 'application/vnd.ms-powerpoint');
        if (pptx) types.push('.pptx', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
        if (zip) types.push('.zip', 'application/zip');
        if (mp4) types.push('.mp4', 'video/mp4');
        if (mp3) types.push('.mp3', 'audio/mpeg');

        return Array.from(new Set(types)).join(',');
    };

    const getFileIcon = (file) => {
        if (file.type.startsWith('image/')) return <FiImage className={styles.fileIcon} />;
        if (file.type.includes('pdf')) return <FiFileText className={styles.fileIcon} />;
        if (file.type.includes('document') || file.type.includes('word')) return <FiFileText className={styles.fileIcon} />;
        if (file.type.includes('spreadsheet') || file.type.includes('excel')) return <FiFileText className={styles.fileIcon} />;
        if (file.type.includes('presentation') || file.type.includes('powerpoint')) return <FiFileText className={styles.fileIcon} />;
        if (file.type.includes('audio')) return <FiFileMinus className={styles.fileIcon} />;
        if (file.type.includes('video')) return <FiFileMinus className={styles.fileIcon} />;
        if (file.type.includes('zip') || file.type.includes('compressed')) return <FiFileMinus className={styles.fileIcon} />;
        return <FiFile className={styles.fileIcon} />;
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const validateFile = (file, index) => {
        const errors = [];

        // Check max size if specified
        if (maxSize && file.size > maxSize) {
            errors.push(`File "${file.name}" exceeds maximum size of ${formatFileSize(maxSize)}`);
        }

        // Check max files limit
        if (maxFiles && files.length + (index !== undefined ? 0 : 1) > maxFiles) {
            errors.push(`Maximum ${maxFiles} file${maxFiles > 1 ? 's' : ''} allowed`);
        }

        // Check accepted types from generated accept string
        const acceptString = generateAcceptString();
        if (acceptString) {
            const acceptedTypes = acceptString.split(',').map(t => t.trim());
            const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
            const isAccepted = acceptedTypes.some(type => {
                if (type.startsWith('.')) {
                    return fileExtension === type.toLowerCase();
                }
                if (type.includes('/')) {
                    return file.type.includes(type.split('/')[1] || '');
                }
                return false;
            });

            if (!isAccepted && acceptedTypes.length > 0) {
                errors.push(`File type "${fileExtension}" is not accepted`);
            }
        }

        return errors.length > 0 ? errors.join(', ') : null;
    };

    const handleFiles = (fileList) => {
        const newFiles = Array.from(fileList);
        let errors = [];

        // Validate each new file
        newFiles.forEach((file, index) => {
            const error = validateFile(file, index);
            if (error) errors.push(error);
        });

        if (errors.length > 0) {
            setUploadError(errors[0]);
            return;
        }

        setUploadError('');

        // Create file objects with preview URLs for images
        const filesWithPreview = newFiles.map(file => {
            const fileObj = {
                file,
                name: file.name,
                size: file.size,
                type: file.type,
                lastModified: file.lastModified,
                preview: file.type.startsWith('image/') && preview
                    ? URL.createObjectURL(file)
                    : null
            };
            return fileObj;
        });

        const updatedFiles = multiple ? [...files, ...filesWithPreview] : filesWithPreview;
        setFiles(updatedFiles);
        onChange?.(multiple ? updatedFiles : updatedFiles[0]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (disabled) return;
        handleFiles(e.dataTransfer.files);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        if (disabled) return;
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const removeFile = (index) => {
        // Revoke object URL if it exists
        if (files[index].preview) {
            URL.revokeObjectURL(files[index].preview);
        }

        const updatedFiles = files.filter((_, i) => i !== index);
        setFiles(updatedFiles);
        onChange?.(multiple ? updatedFiles : null);
    };

    const clearAllFiles = () => {
        // Revoke all object URLs
        files.forEach(file => {
            if (file.preview) {
                URL.revokeObjectURL(file.preview);
            }
        });

        setFiles([]);
        onChange?.(multiple ? [] : null);
    };

    const handleBrowseClick = (e) => {
        e.stopPropagation();
        if (!disabled) {
            inputRef.current?.click();
        }
    };

    const containerClasses = [
        styles.container,
        styles[size],
        fullWidth && styles.fullWidth,
        className
    ].filter(Boolean).join(' ');

    const dropzoneClasses = [
        styles.dropzone,
        isDragging && styles.dragging,
        error && styles.error,
        disabled && styles.disabled,
        files.length > 0 && styles.hasFiles
    ].filter(Boolean).join(' ');

    const acceptString = generateAcceptString();
    const acceptedTypesList = acceptString
        ? acceptString.split(',').map(t => t.trim().replace(/^\./, '').toUpperCase()).filter(t => t)
        : ['All files'];

    return (
        <div className={containerClasses} {...rest}>
            {label && (
                <div className={styles.labelContainer}>
                    <label className={styles.label}>
                        {label}
                        {required && <span className={styles.required}>*</span>}
                    </label>
                    {maxFiles && (
                        <span className={styles.fileCounter}>
                            {files.length} / {maxFiles}
                        </span>
                    )}
                </div>
            )}

            <div
                className={dropzoneClasses}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept={acceptString}
                    multiple={multiple}
                    onChange={(e) => {
                        handleFiles(e.target.files);
                        e.target.value = ''; // Reset input
                    }}
                    className={styles.hiddenInput}
                    disabled={disabled}
                />

                <div className={styles.dropzoneContent}>
                    <div className={styles.iconWrapper}>
                        <FiUpload className={styles.icon} />
                    </div>

                    <div className={styles.textContent}>
                        <p className={styles.text}>{dragDropText}</p>
                        <p className={styles.subtext}>Supports: {acceptedTypesList.join(', ')}</p>

                        {maxSize && (
                            <p className={styles.sizeLimit}>
                                Max size: {formatFileSize(maxSize)}
                            </p>
                        )}
                    </div>

                    <button
                        type="button"
                        className={styles.browseButton}
                        onClick={handleBrowseClick}
                        disabled={disabled}
                    >
                        {browseButtonText}
                    </button>
                </div>
            </div>

            {(error || uploadError) && (
                <div className={styles.errorText}>
                    <FiX size={14} />
                    <span>{error || uploadError}</span>
                </div>
            )}

            {helperText && !error && (
                <div className={styles.helperText}>
                    {helperText}
                </div>
            )}

            {files.length > 0 && (
                <div className={styles.fileList}>
                    <div className={styles.fileListHeader}>
                        <h4 className={styles.fileListTitle}>Selected Files ({files.length})</h4>
                        {multiple && files.length > 1 && (
                            <button
                                type="button"
                                className={styles.clearAllButton}
                                onClick={clearAllFiles}
                                disabled={disabled}
                            >
                                <FiTrash2 size={14} />
                                Clear All
                            </button>
                        )}
                    </div>

                    <div className={styles.filesContainer}>
                        {files.map((fileObj, index) => (
                            <div key={`${fileObj.name}-${index}`} className={styles.fileItem}>
                                <div className={styles.fileInfo}>
                                    {preview && fileObj.preview ? (
                                        <div className={styles.previewContainer}>
                                            <img
                                                src={fileObj.preview}
                                                alt={fileObj.name}
                                                className={styles.preview}
                                                onLoad={() => {
                                                    // Clean up if needed
                                                }}
                                            />
                                            <div className={styles.previewOverlay} />
                                        </div>
                                    ) : (
                                        <div className={styles.fileIconContainer}>
                                            {getFileIcon(fileObj)}
                                        </div>
                                    )}

                                    <div className={styles.fileDetails}>
                                        <div className={styles.fileNameRow}>
                                            <span className={styles.fileName} title={fileObj.name}>
                                                {fileObj.name}
                                            </span>
                                            <span className={styles.fileStatus}>
                                                <FiCheck className={styles.successIcon} />
                                            </span>
                                        </div>

                                        <div className={styles.fileMeta}>
                                            {showFileSize && (
                                                <span className={styles.fileSize}>
                                                    {formatFileSize(fileObj.size)}
                                                </span>
                                            )}

                                            {showFileType && fileObj.type && (
                                                <span className={styles.fileType}>
                                                    {fileObj.type.split('/')[1] || fileObj.type}
                                                </span>
                                            )}

                                            <span className={styles.fileDate}>
                                                {new Date(fileObj.lastModified).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.fileActions}>
                                    <button
                                        type="button"
                                        className={styles.removeButton}
                                        onClick={() => removeFile(index)}
                                        disabled={disabled}
                                        aria-label={`Remove ${fileObj.name}`}
                                    >
                                        <FiX size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilePicker;