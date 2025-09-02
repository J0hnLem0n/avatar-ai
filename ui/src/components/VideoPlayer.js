import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Slider,
  Chip,
  LinearProgress,
  Grid
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  Stop,
  VolumeUp,
  VolumeOff,
  Fullscreen,
  Download,
  Timeline
} from '@mui/icons-material';
import styled from 'styled-components';

const VideoContainer = styled(Paper)`
  padding: 24px;
  background: rgba(30, 30, 30, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
`;

const VideoWrapper = styled(Box)`
  position: relative;
  width: 100%;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 16px;
`;

const VideoElement = styled.video`
  width: 100%;
  height: auto;
  display: block;
`;

const ControlsOverlay = styled(Box)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  padding: 16px;
  opacity: 0;
  transition: opacity 0.3s ease;
  
  ${VideoWrapper}:hover & {
    opacity: 1;
  }
`;

const TimelineContainer = styled(Box)`
  margin-top: 16px;
  padding: 16px;
  background: rgba(45, 45, 45, 0.8);
  border-radius: 8px;
`;

const TimeDisplay = styled(Typography)`
  font-family: 'Courier New', monospace;
  font-weight: 600;
  color: #90caf9;
`;

const VolumeSlider = styled(Slider)`
  width: 100px;
  margin: 0 16px;
  
  & .MuiSlider-track {
    background-color: #90caf9;
  }
  
  & .MuiSlider-thumb {
    background-color: #90caf9;
  }
`;

const TimelineSlider = styled(Slider)`
  & .MuiSlider-track {
    background-color: #f48fb1;
  }
  
  & .MuiSlider-thumb {
    background-color: #f48fb1;
  }
  
  & .MuiSlider-rail {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const VideoPlayer = ({ videoUrl, onTimeUpdate, onDurationChange }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [buffered, setBuffered] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoading(false);
      if (onDurationChange) {
        onDurationChange(video.duration);
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      if (onTimeUpdate) {
        onTimeUpdate(video.currentTime);
      }
    };

    const handleProgress = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const bufferedPercent = (bufferedEnd / video.duration) * 100;
        setBuffered(bufferedPercent);
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleLoadStart = () => setIsLoading(true);

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('progress', handleProgress);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('loadstart', handleLoadStart);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('progress', handleProgress);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('loadstart', handleLoadStart);
    };
  }, [onTimeUpdate, onDurationChange]);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const stopVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const handleSeek = (_, value) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value;
      setCurrentTime(value);
    }
  };

  const handleVolumeChange = (_, value) => {
    setVolume(value);
    if (videoRef.current) {
      videoRef.current.volume = value;
    }
    if (value === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume;
        setIsMuted(false);
      } else {
        videoRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const downloadVideo = () => {
    if (videoUrl) {
      const link = document.createElement('a');
      link.href = videoUrl;
      link.download = 'sadtalker-avatar.mp4';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!videoUrl) {
    return (
      <VideoContainer elevation={0}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            color: '#b3b3b3'
          }}
        >
          <Timeline sx={{ fontSize: '4rem', mb: 2, color: '#424242' }} />
          <Typography variant="h6" sx={{ color: '#757575' }}>
            No video available
          </Typography>
          <Typography variant="body2" sx={{ color: '#757575', textAlign: 'center' }}>
            Generate an avatar to see the video player
          </Typography>
        </Box>
      </VideoContainer>
    );
  }

  return (
    <VideoContainer elevation={0}>
      <Typography variant="h6" gutterBottom sx={{ color: '#ffffff', mb: 2 }}>
        Generated Avatar Video
      </Typography>

      <VideoWrapper>
        <VideoElement
          ref={videoRef}
          src={videoUrl}
          preload="metadata"
          onError={(e) => console.error('Video error:', e)}
        />
        
        <ControlsOverlay>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton onClick={togglePlayPause} sx={{ color: '#ffffff' }}>
                {isPlaying ? <Pause /> : <PlayArrow />}
              </IconButton>
              
              <IconButton onClick={stopVideo} sx={{ color: '#ffffff' }}>
                <Stop />
              </IconButton>
              
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                <IconButton onClick={toggleMute} sx={{ color: '#ffffff' }}>
                  {isMuted ? <VolumeOff /> : <VolumeUp />}
                </IconButton>
                <VolumeSlider
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  min={0}
                  max={1}
                  step={0.1}
                  size="small"
                />
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TimeDisplay variant="body2">
                {formatTime(currentTime)} / {formatTime(duration)}
              </TimeDisplay>
              
              <IconButton onClick={toggleFullscreen} sx={{ color: '#ffffff' }}>
                <Fullscreen />
              </IconButton>
              
              <IconButton onClick={downloadVideo} sx={{ color: '#ffffff' }}>
                <Download />
              </IconButton>
            </Box>
          </Box>
        </ControlsOverlay>
      </VideoWrapper>

      {isLoading && (
        <Box sx={{ mb: 2 }}>
          <LinearProgress 
            sx={{ 
              height: 4, 
              borderRadius: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#90caf9'
              }
            }} 
          />
        </Box>
      )}

      <TimelineContainer>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="subtitle2" sx={{ color: '#ffffff' }}>
            Timeline
          </Typography>
          <Chip 
            label={`${formatTime(currentTime)} / ${formatTime(duration)}`}
            size="small"
            sx={{ backgroundColor: '#f48fb1', color: 'white' }}
          />
        </Box>
        
        <TimelineSlider
          value={currentTime}
          onChange={handleSeek}
          max={duration}
          step={0.1}
          size="medium"
          sx={{ width: '100%' }}
        />
        
        <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="caption" sx={{ color: '#b3b3b3' }}>
            {formatTime(0)}
          </Typography>
          <Typography variant="caption" sx={{ color: '#b3b3b3' }}>
            {formatTime(duration)}
          </Typography>
        </Box>
      </TimelineContainer>
    </VideoContainer>
  );
};

export default VideoPlayer;
