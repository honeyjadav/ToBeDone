import React from 'react';
import { Box, Typography, Button } from '@mui/material';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Log to console — could be extended to remote logging
    // eslint-disable-next-line no-console
    console.error('Unhandled error in UI:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            Something went wrong
          </Typography>
          <Typography sx={{ color: '#64748b', mb: 3 }}>
            An unexpected error occurred while rendering the page. Check the console for details.
          </Typography>
          <Button
            variant="contained"
            onClick={() => window.location.reload()}
            sx={{ textTransform: 'none' }}
          >
            Reload
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}
