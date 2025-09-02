import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, Paper, IconButton, Chip } from '@mui/material';
import { CloudUpload, Image, Audiotrack, Delete } from '@mui/icons-material';
import styled from 'styled-components';

const UploadContainer = styled(Paper)`
  padding: 24px;
  text-align: center;
  border: 2px dashed #424242;
  background: rgba(30, 30, 30, 0.5);
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    border-color: #90caf9;
    background: rgba(30, 30, 30, 0.8);
  }
  
  &.active {
    border-color: #90caf9;
    background: rgba(144, 202, 249, 0.1);
  }
`;

const UploadIcon = styled(CloudUpload)`
  font-size: 3rem;
  color: #90caf9;
  margin-bottom: 16px;
`;

const FilePreview = styled(Box)`
  margin-top: 16px;
  padding: 16px;
  background: rgba(45, 45, 45, 0.8);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const FileInfo = styled(Box)`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const FileIcon = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: rgba(144, 202, 249, 0.2);
`;

const FileUpload = ({
    title,
    accept,
    file,
    onFileSelect,
    onFileRemove,
    fileType = 'image',
    maxSize = 10 * 1024 * 1024 // 10MB
}) => {
    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            onFileSelect(acceptedFiles[0]);
        }
    }, [onFileSelect]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept,
        maxSize,
        multiple: false,
    });

    const getFileIcon = () => {
        switch (fileType) {
            case 'image':
                return <Image sx={{ color: '#90caf9' }} />;
            case 'audio':
                return <Audiotrack sx={{ color: '#f48fb1' }} />;
            default:
                return <CloudUpload sx={{ color: '#90caf9' }} />;
        }
    };

    const getFileTypeColor = () => {
        switch (fileType) {
            case 'image':
                return '#90caf9';
            case 'audio':
                return '#f48fb1';
            default:
                return '#90caf9';
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom sx={{ color: '#ffffff', mb: 2 }}>
                {title}
            </Typography>

            <UploadContainer
                {...getRootProps()}
                className={isDragActive ? 'active' : ''}
                elevation={0}
            >
                <input {...getInputProps()} />

                {!file ? (
                    <>
                        <UploadIcon />
                        <Typography variant="body1" sx={{ color: '#b3b3b3', mb: 1 }}>
                            {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#757575' }}>
                            or click to select files
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#757575', display: 'block', mt: 1 }}>
                            Max size: {formatFileSize(maxSize)}
                        </Typography>
                    </>
                ) : (
                    <FilePreview>
                        <FileInfo>
                            <FileIcon>
                                {getFileIcon()}
                            </FileIcon>
                            <Box>
                                <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 500 }}>
                                    {file.name}
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#b3b3b3' }}>
                                    {formatFileSize(file.size)}
                                </Typography>
                            </Box>
                        </FileInfo>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip
                                label={fileType}
                                size="small"
                                sx={{
                                    backgroundColor: getFileTypeColor(),
                                    color: 'white',
                                    fontWeight: 600
                                }}
                            />
                            <IconButton
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onFileRemove();
                                }}
                                sx={{ color: '#f44336' }}
                            >
                                <Delete />
                            </IconButton>
                        </Box>
                    </FilePreview>
                )}
            </UploadContainer>
        </Box>
    );
};

export default FileUpload;
