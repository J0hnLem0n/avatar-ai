import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Switch,
  FormControlLabel,
  Grid,
  Chip,
  Divider
} from '@mui/material';
import { Settings, Tune, Face, VideoSettings } from '@mui/icons-material';
import styled from 'styled-components';

const SettingsContainer = styled(Paper)`
  padding: 24px;
  background: rgba(30, 30, 30, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const SectionTitle = styled(Typography)`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  color: #90caf9;
  font-weight: 600;
`;

const SettingItem = styled(Box)`
  margin-bottom: 20px;
`;

const SliderContainer = styled(Box)`
  padding: 0 16px;
`;

const ValueDisplay = styled(Chip)`
  background: rgba(144, 202, 249, 0.2);
  color: #90caf9;
  font-weight: 600;
  margin-left: 16px;
`;

const GenerationSettings = ({ settings, onSettingsChange }) => {
  const [localSettings, setLocalSettings] = useState({
    size: 256,
    preprocess: 'crop',
    pose_style: 0,
    expression_scale: 1.0,
    batch_size: 2,
    enhancer: 'gfpgan',
    background_enhancer: 'realesrgan',
    still_mode: false,
    face3dvis: false,
    verbose: false,
    ...settings
  });

  const handleSettingChange = (key, value) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const preprocessOptions = [
    { value: 'crop', label: 'Crop (Recommended)', description: 'Crop face and keep original background' },
    { value: 'extcrop', label: 'Extend Crop', description: 'Extend crop area around face' },
    { value: 'resize', label: 'Resize', description: 'Resize image to target size' },
    { value: 'full', label: 'Full Image', description: 'Process full image without cropping' },
    { value: 'extfull', label: 'Extend Full', description: 'Extend full image processing' }
  ];

  const enhancerOptions = [
    { value: 'gfpgan', label: 'GFPGAN', description: 'High-quality face restoration' },
    { value: 'RestoreFormer', label: 'RestoreFormer', description: 'Alternative face restoration' },
    { value: null, label: 'None', description: 'No face enhancement' }
  ];

  const backgroundEnhancerOptions = [
    { value: 'realesrgan', label: 'Real-ESRGAN', description: 'High-quality background upscaling' },
    { value: null, label: 'None', description: 'No background enhancement' }
  ];

  return (
    <SettingsContainer elevation={0}>
      <SectionTitle variant="h6">
        <Settings />
        Generation Settings
      </SectionTitle>

      <Grid container spacing={3}>
        {/* Image Processing Settings */}
        <Grid item xs={12} md={6}>
          <Box>
            <SectionTitle variant="subtitle1">
              <Face />
              Image Processing
            </SectionTitle>

            <SettingItem>
              <FormControl fullWidth size="small">
                <InputLabel>Preprocessing Method</InputLabel>
                <Select
                  value={localSettings.preprocess}
                  label="Preprocessing Method"
                  onChange={(e) => handleSettingChange('preprocess', e.target.value)}
                >
                  {preprocessOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {option.label}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#b3b3b3' }}>
                          {option.description}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </SettingItem>

            <SettingItem>
              <Typography variant="body2" gutterBottom sx={{ color: '#ffffff' }}>
                Image Size: {localSettings.size}px
              </Typography>
              <SliderContainer>
                <Slider
                  value={localSettings.size}
                  onChange={(_, value) => handleSettingChange('size', value)}
                  min={128}
                  max={512}
                  step={64}
                  marks={[
                    { value: 128, label: '128' },
                    { value: 256, label: '256' },
                    { value: 512, label: '512' }
                  ]}
                  sx={{
                    '& .MuiSlider-track': { backgroundColor: '#90caf9' },
                    '& .MuiSlider-thumb': { backgroundColor: '#90caf9' },
                    '& .MuiSlider-mark': { backgroundColor: '#90caf9' }
                  }}
                />
              </SliderContainer>
            </SettingItem>

            <SettingItem>
              <FormControlLabel
                control={
                  <Switch
                    checked={localSettings.still_mode}
                    onChange={(e) => handleSettingChange('still_mode', e.target.checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#90caf9',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#90caf9',
                      },
                    }}
                  />
                }
                label="Still Mode (Full Body Animation)"
              />
            </SettingItem>
          </Box>
        </Grid>

        {/* Animation Settings */}
        <Grid item xs={12} md={6}>
          <Box>
            <SectionTitle variant="subtitle1">
              <VideoSettings />
              Animation Settings
            </SectionTitle>

            <SettingItem>
              <Typography variant="body2" gutterBottom sx={{ color: '#ffffff' }}>
                Pose Style: {localSettings.pose_style}
              </Typography>
              <SliderContainer>
                <Slider
                  value={localSettings.pose_style}
                  onChange={(_, value) => handleSettingChange('pose_style', value)}
                  min={0}
                  max={45}
                  step={1}
                  marks={[
                    { value: 0, label: '0' },
                    { value: 22, label: '22' },
                    { value: 45, label: '45' }
                  ]}
                  sx={{
                    '& .MuiSlider-track': { backgroundColor: '#f48fb1' },
                    '& .MuiSlider-thumb': { backgroundColor: '#f48fb1' },
                    '& .MuiSlider-mark': { backgroundColor: '#f48fb1' }
                  }}
                />
              </SliderContainer>
            </SettingItem>

            <SettingItem>
              <Typography variant="body2" gutterBottom sx={{ color: '#ffffff' }}>
                Expression Scale: {localSettings.expression_scale}
              </Typography>
              <SliderContainer>
                <Slider
                  value={localSettings.expression_scale}
                  onChange={(_, value) => handleSettingChange('expression_scale', value)}
                  min={0.1}
                  max={2.0}
                  step={0.1}
                  marks={[
                    { value: 0.1, label: '0.1' },
                    { value: 1.0, label: '1.0' },
                    { value: 2.0, label: '2.0' }
                  ]}
                  sx={{
                    '& .MuiSlider-track': { backgroundColor: '#f48fb1' },
                    '& .MuiSlider-thumb': { backgroundColor: '#f48fb1' },
                    '& .MuiSlider-mark': { backgroundColor: '#f48fb1' }
                  }}
                />
              </SliderContainer>
            </SettingItem>

            <SettingItem>
              <Typography variant="body2" gutterBottom sx={{ color: '#ffffff' }}>
                Batch Size: {localSettings.batch_size}
              </Typography>
              <SliderContainer>
                <Slider
                  value={localSettings.batch_size}
                  onChange={(_, value) => handleSettingChange('batch_size', value)}
                  min={1}
                  max={4}
                  step={1}
                  marks={[
                    { value: 1, label: '1' },
                    { value: 2, label: '2' },
                    { value: 4, label: '4' }
                  ]}
                  sx={{
                    '& .MuiSlider-track': { backgroundColor: '#f48fb1' },
                    '& .MuiSlider-thumb': { backgroundColor: '#f48fb1' },
                    '& .MuiSlider-mark': { backgroundColor: '#f48fb1' }
                  }}
                />
              </SliderContainer>
            </SettingItem>
          </Box>
        </Grid>

        {/* Enhancement Settings */}
        <Grid item xs={12}>
          <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
          
          <SectionTitle variant="subtitle1">
            <Tune />
            Enhancement Settings
          </SectionTitle>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <SettingItem>
                <FormControl fullWidth size="small">
                  <InputLabel>Face Enhancer</InputLabel>
                  <Select
                    value={localSettings.enhancer || ''}
                    label="Face Enhancer"
                    onChange={(e) => handleSettingChange('enhancer', e.target.value || null)}
                  >
                    {enhancerOptions.map((option) => (
                      <MenuItem key={option.value || 'none'} value={option.value}>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {option.label}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#b3b3b3' }}>
                            {option.description}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </SettingItem>
            </Grid>

            <Grid item xs={12} md={6}>
              <SettingItem>
                <FormControl fullWidth size="small">
                  <InputLabel>Background Enhancer</InputLabel>
                  <Select
                    value={localSettings.background_enhancer || ''}
                    label="Background Enhancer"
                    onChange={(e) => handleSettingChange('background_enhancer', e.target.value || null)}
                  >
                    {backgroundEnhancerOptions.map((option) => (
                      <MenuItem key={option.value || 'none'} value={option.value}>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {option.label}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#b3b3b3' }}>
                            {option.description}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </SettingItem>
            </Grid>
          </Grid>

          <Box sx={{ mt: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={localSettings.face3dvis}
                  onChange={(e) => handleSettingChange('face3dvis', e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#90caf9',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#90caf9',
                    },
                  }}
                />
              }
              label="Generate 3D Face Visualization"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={localSettings.verbose}
                  onChange={(e) => handleSettingChange('verbose', e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#90caf9',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#90caf9',
                    },
                  }}
                />
              }
              label="Save Intermediate Outputs"
            />
          </Box>
        </Grid>
      </Grid>
    </SettingsContainer>
  );
};

export default GenerationSettings;
