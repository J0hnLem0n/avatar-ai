import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Collapse,
  Paper,
  Divider
} from '@mui/material';
import {
  PlayArrow,
  Settings as SettingsIcon,
  ExpandMore,
  ExpandLess
} from '@mui/icons-material';
import styled from 'styled-components';
import FileUpload from './FileUpload';
import GenerationSettings from './GenerationSettings';
import VideoPlayer from './VideoPlayer';
import { useSocket } from '../contexts/SocketContext';

const MainContainer = styled(Box)`
  width: 100%;
`;

const SectionCard = styled(Paper)`
  padding: 24px;
  margin-bottom: 24px;
  background: rgba(30, 30, 30, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const GenerateButton = styled(Button)`
  background: linear-gradient(135deg, #90caf9 0%, #42a5f5 100%);
  color: white;
  padding: 12px 32px;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 12px;
  text-transform: none;
  box-shadow: 0 4px 16px rgba(144, 202, 249, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, #42a5f5 0%, #1976d2 100%);
    box-shadow: 0 6px 20px rgba(144, 202, 249, 0.4);
    transform: translateY(-2px);
  }
  
  &:disabled {
    background: rgba(255, 255, 255, 0.12);
    color: rgba(255, 255, 255, 0.38);
    box-shadow: none;
    transform: none;
  }
`;

const SettingsToggle = styled(Button)`
  color: #90caf9;
  border: 1px solid rgba(144, 202, 249, 0.3);
  padding: 8px 16px;
  border-radius: 8px;
  text-transform: none;
  
  &:hover {
    border-color: #90caf9;
    background: rgba(144, 202, 249, 0.1);
  }
`;

const StatusContainer = styled(Box)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(45, 45, 45, 0.8);
  border-radius: 8px;
  margin-bottom: 16px;
`;

const ProgressContainer = styled(Box)`
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
`;

const AvatarGenerator = () => {
  const { isConnected, generationStatus, startGeneration, generatedVideoUrl } = useSocket();

  const [imageFile, setImageFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [generationSettings, setGenerationSettings] = useState({
    size: 256,
    preprocess: 'crop',
    pose_style: 0,
    expression_scale: 1.0,
    batch_size: 2,
    enhancer: false,
    background_enhancer: false,
    still_mode: false,
    face3dvis: false,
    verbose: false,
  });

  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (generationStatus === 'generating') {
      setIsGenerating(true);
      setError(null);
    } else if (generationStatus === 'completed') {
      setIsGenerating(false);
    } else if (generationStatus === 'error') {
      setIsGenerating(false);
      setError('An error occurred during generation. Please try again.');
    }
  }, [generationStatus]);

  const handleImageSelect = (file) => {
    setImageFile(file);
    setError(null);
  };

  const handleImageRemove = () => {
    setImageFile(null);
  };

  const handleAudioSelect = (file) => {
    setAudioFile(file);
    setError(null);
  };

  const handleAudioRemove = () => {
    setAudioFile(null);
  };

  const handleSettingsChange = (newSettings) => {
    setGenerationSettings(newSettings);
  };

  const handleGenerate = async () => {
    if (!imageFile || !audioFile) {
      setError('Please select both an image and audio file.');
      return;
    }

    if (!isConnected) {
      setError('Not connected to server. Please check your connection.');
      return;
    }

    try {
      const success = startGeneration(imageFile, audioFile, generationSettings);
      if (success) {
        setError(null);
      } else {
        setError('Failed to start generation. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Generation error:', err);
    }
  };

  const canGenerate = imageFile && audioFile && isConnected && !isGenerating;

  const getStatusMessage = () => {
    switch (generationStatus) {
      case 'ready':
        return 'Ready to generate avatar';
      case 'generating':
        return 'Generating avatar... This may take several minutes';
      case 'completed':
        return 'Avatar generation completed successfully!';
      case 'error':
        return 'Generation failed. Please try again.';
      case 'disconnected':
        return 'Disconnected from server';
      default:
        return 'Initializing...';
    }
  };

  const getStatusColor = () => {
    switch (generationStatus) {
      case 'ready':
        return 'success';
      case 'generating':
        return 'info';
      case 'completed':
        return 'success';
      case 'error':
        return 'error';
      case 'disconnected':
        return 'warning';
      default:
        return 'info';
    }
  };

  return (
    <MainContainer>
      <Typography variant="h4" gutterBottom sx={{ color: '#ffffff', mb: 3, textAlign: 'center' }}>
        Create Your Digital Avatar
      </Typography>

      <Typography variant="body1" sx={{ color: '#b3b3b3', mb: 4, textAlign: 'center' }}>
        Upload a photo and audio file to generate a talking avatar using AI technology
      </Typography>

      {/* Connection Status */}
      <StatusContainer>
        <Box
          sx={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: isConnected ? '#4caf50' : '#f44336',
            animation: isConnected ? 'pulse 2s infinite' : 'none'
          }}
        />
        <Typography variant="body2" sx={{ color: '#ffffff' }}>
          {getStatusMessage()}
        </Typography>
      </StatusContainer>

      {/* Error Alert */}
      <Collapse in={!!error}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Collapse>

      <Grid container spacing={3}>
        {/* File Upload Section */}
        <Grid item xs={12} lg={6}>
          <SectionCard elevation={0}>
            <Typography variant="h6" gutterBottom sx={{ color: '#ffffff', mb: 3 }}>
              Upload Files
            </Typography>

            <FileUpload
              title="Source Image"
              accept={{
                'image/*': ['.jpg', '.jpeg', '.png', '.bmp', '.tiff']
              }}
              file={imageFile}
              onFileSelect={handleImageSelect}
              onFileRemove={handleImageRemove}
              fileType="image"
              maxSize={20 * 1024 * 1024} // 20MB
            />

            <Box sx={{ mt: 3 }}>
              <FileUpload
                title="Audio File"
                accept={{
                  'audio/*': ['.wav', '.mp3', '.m4a', '.flac', '.ogg']
                }}
                file={audioFile}
                onFileSelect={handleAudioSelect}
                onFileRemove={handleAudioRemove}
                fileType="audio"
                maxSize={50 * 1024 * 1024} // 50MB
              />
            </Box>
          </SectionCard>
        </Grid>

        {/* Generation Settings Section */}
        <Grid item xs={12} lg={6}>
          <SectionCard elevation={0}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" sx={{ color: '#ffffff' }}>
                Generation Settings
              </Typography>
              <SettingsToggle
                onClick={() => setShowSettings(!showSettings)}
                endIcon={showSettings ? <ExpandLess /> : <ExpandMore />}
                size="small"
              >
                <SettingsIcon sx={{ mr: 1 }} />
                {showSettings ? 'Hide' : 'Show'} Settings
              </SettingsToggle>
            </Box>

            <Collapse in={showSettings}>
              <GenerationSettings
                settings={generationSettings}
                onSettingsChange={handleSettingsChange}
              />
            </Collapse>

            <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

            <Box sx={{ textAlign: 'center' }}>
              <GenerateButton
                variant="contained"
                size="large"
                onClick={handleGenerate}
                disabled={!canGenerate}
                startIcon={isGenerating ? <CircularProgress size={20} color="inherit" /> : <PlayArrow />}
              >
                {isGenerating ? 'Generating...' : 'Generate Avatar'}
              </GenerateButton>

              {isGenerating && (
                <Typography variant="body2" sx={{ color: '#b3b3b3', mt: 2 }}>
                  This process may take several minutes. Please be patient.
                </Typography>
              )}
            </Box>
          </SectionCard>
        </Grid>
      </Grid>

      {/* Video Player Section */}
      {generatedVideoUrl && (
        <Box sx={{ mt: 4 }}>
          <VideoPlayer
            videoUrl={generatedVideoUrl}
            onTimeUpdate={(time) => console.log('Current time:', time)}
            onDurationChange={(duration) => console.log('Duration:', duration)}
          />
        </Box>
      )}

      {/* Generation Progress */}
      {isGenerating && (
        <SectionCard elevation={0}>
          <Typography variant="h6" gutterBottom sx={{ color: '#ffffff', mb: 2 }}>
            Generation Progress
          </Typography>
          <ProgressContainer>
            <CircularProgress size={24} sx={{ color: '#90caf9' }} />
            <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
              Processing your files... This may take several minutes depending on the length of your audio and selected quality settings.
            </Typography>
          </ProgressContainer>
        </SectionCard>
      )}
    </MainContainer>
  );
};

export default AvatarGenerator;
