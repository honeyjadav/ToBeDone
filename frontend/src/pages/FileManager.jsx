import {
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  Button,
  Typography,
  Stack,
  TextField,
  InputAdornment,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import FolderIcon from '@mui/icons-material/Folder';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const files = [
  { id: 1, name: 'Project Proposal Q3.pdf', type: 'PDF', size: '2.4 MB', modified: 'Jul 5', owner: 'Alice', shared: 3, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice' },
  { id: 2, name: 'Design System', type: 'Folder', size: '—', modified: 'Jul 4', owner: 'Bob', shared: 8, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob' },
  { id: 3, name: 'API Documentation.docx', type: 'Document', size: '1.8 MB', modified: 'Jul 3', owner: 'Carol', shared: 5, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carol' },
  { id: 4, name: 'Marketing Assets', type: 'Folder', size: '—', modified: 'Jul 2', owner: 'David', shared: 12, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david' },
  { id: 5, name: 'Team Meeting Notes.txt', type: 'Text', size: '456 KB', modified: 'Jul 1', owner: 'Eve', shared: 2, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=eve' },
];

const getFileIcon = (type) => {
  return type === 'Folder' ? <FolderIcon sx={{ color: '#f59e0b' }} /> : <InsertDriveFileIcon sx={{ color: '#7c3aed' }} />;
};

export default function FileManager() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            File Manager
          </Typography>
          <Typography sx={{ color: '#64748b' }}>
            Store and share files with your team
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<CloudUploadIcon />}
          sx={{
            background: 'linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)',
          }}
        >
          Upload Files
        </Button>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            placeholder="Search files and folders..."
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#94a3b8' }} />
                </InputAdornment>
              ),
            }}
          />
        </CardContent>
      </Card>

      {!isMobile ? (
        <TableContainer component={Card}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'rgba(124, 58, 237, 0.05)' }}>
                <TableCell sx={{ fontWeight: 700, color: '#1e293b' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#1e293b' }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#1e293b' }}>Size</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#1e293b' }}>Modified</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#1e293b' }}>Owner</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#1e293b' }}>Shared With</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#1e293b' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {files.map((file) => (
                <TableRow key={file.id} sx={{ '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.02)' } }}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getFileIcon(file.type)}
                      <Typography sx={{ fontWeight: 500, color: '#1e293b' }}>
                        {file.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={file.type} size="small" sx={{ backgroundColor: 'rgba(124, 58, 237, 0.1)', color: '#7c3aed' }} />
                  </TableCell>
                  <TableCell sx={{ color: '#64748b' }}>{file.size}</TableCell>
                  <TableCell sx={{ color: '#64748b' }}>{file.modified}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar src={file.avatar} sx={{ width: 28, height: 28 }} />
                      <Typography sx={{ fontSize: '0.875rem', color: '#1e293b' }}>
                        {file.owner}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={`${file.shared} people`} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Button size="small" sx={{ color: '#7c3aed' }}>
                      <MoreVertIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Stack spacing={2}>
          {files.map((file) => (
            <Card key={file.id}>
              <CardContent>
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  {getFileIcon(file.type)}
                  <Typography sx={{ fontWeight: 600, flex: 1 }}>
                    {file.name}
                  </Typography>
                  <Button size="small" sx={{ color: '#7c3aed' }}>
                    <MoreVertIcon />
                  </Button>
                </Box>
                <Stack spacing={1} sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#64748b' }}>
                    <span>{file.type}</span>
                    <span>{file.size}</span>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#64748b' }}>
                    <span>{file.modified}</span>
                    <span>{file.shared} shared</span>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
}
