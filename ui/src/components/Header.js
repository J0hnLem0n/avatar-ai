import React from 'react';
import { AppBar, Toolbar, Typography, Box, Chip } from '@mui/material';
import { Face, AutoAwesome } from '@mui/icons-material';
import styled from 'styled-components';

const StyledAppBar = styled(AppBar)`
  background: linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const LogoContainer = styled(Box)`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const LogoIcon = styled(AutoAwesome)`
  color: #90caf9;
  font-size: 2rem;
`;

const Title = styled(Typography)`
  background: linear-gradient(135deg, #90caf9 0%, #f48fb1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
`;

const Subtitle = styled(Typography)`
  color: #b3b3b3;
  font-size: 0.875rem;
  margin-left: 8px;
`;

const StatusChip = styled(Chip)`
  background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
  color: white;
  font-weight: 600;
  margin-left: auto;
`;

const Header = () => {
    return (
        <StyledAppBar position="static" elevation={0}>
            <Toolbar>
                <LogoContainer>
                    <LogoIcon />
                    <Box>
                        <Title variant="h4" component="h1">
                            SadTalker
                        </Title>
                        <Subtitle variant="body2">
                            AI-Powered Digital Avatar Generation
                        </Subtitle>
                    </Box>
                </LogoContainer>

                <StatusChip
                    label="Ready"
                    size="small"
                    icon={<Face />}
                />
            </Toolbar>
        </StyledAppBar>
    );
};

export default Header;
