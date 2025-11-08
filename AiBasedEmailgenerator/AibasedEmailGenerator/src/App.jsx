import { Box, Button, CircularProgress, Container, FormControl, InputLabel, MenuItem, Select, TextField, Typography, circularProgressClasses } from '@mui/material';
import axios from 'axios';
import { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';

function App() {
  
const [emailContent,SetEmailContent] = useState('');
const [tone,SetTone]=useState('');
const [generatedReply, SetGeneratedReply]= useState('');
const [loading,SetLoading] = useState(false);
const [error,SetError]=useState('');
const copiedMsg = ()=>toast("Copied to clipboard!");
const handleSubmit = async()=>{
  SetLoading(true);
  SetError('');
  try {
    const response = await axios.post("http://localhost:8080/api/email/generate",{
      emailContent,
      tone
    });
    SetGeneratedReply(typeof response.data === 'string'? response.data : JSON.stringify(response.data));
  } catch (error) {
    SetError("Failed to generate reply. Please try again after some time");
    console.error(error);
  }
  finally
  {
    SetLoading(false);
  }

};
  return (
 
    <Container maxWidth="md" sx={{py:4}}>
      <Typography variant='h3' component="h1" gutterBottom>
      AI Based Email Reply Generator
      </Typography>
      <Box sx={{mx:3}}>
        <TextField 
        fullWidth
        multiline 
        rows={6} 
        variant='outlined' 
        label='Original Email Content goes here....'
        onChange={(e)=> SetEmailContent(e.target.value)}
        sx ={{mb:2}}
        />
        <FormControl fullWidth sx={{mb:2}}>
          <InputLabel>
          Tone (Optional)</InputLabel>
          <Select 
          value={tone || ''}
          label={"Tone (Optional)"}
          onChange={(e)=>SetTone(e.target.value)}>
        
        <MenuItem value="">None</MenuItem>
        <MenuItem value="profesional">Profesional</MenuItem>
        <MenuItem value="casual">Casual</MenuItem>
        <MenuItem value="friendly">Friendly</MenuItem>
          </Select>
        </FormControl>

      <Button variant='contained'
      onClick={handleSubmit}
      disabled={!emailContent || loading}
      fullWidth
      >
        {loading? <CircularProgress size={24}/>: "Generate Reply"}
      </Button>

      </Box>
      {error && (<Typography color='error' sx={{mb:2}}>{error}</Typography>)}
      {generatedReply && (
        <Box sx={{mt:3}}>
        <Typography variant='h6' gutterBottom> Generated Reply</Typography>
        <TextField fullWidth
        multiline
        rows={6}
        variant='outlined'
        value={(generatedReply || '')}
        inputProps={{readOnly:true}}/>

        <Button variant='outlined' sx={{mt:2}} onClick={()=>{
        navigator.clipboard.writeText(generatedReply),
        copiedMsg();
      }}
        >Copy to clipborad</Button>
      <ToastContainer position='bottom-left'/>
        </Box>)}
    </Container>
    
  );
}

export default App
