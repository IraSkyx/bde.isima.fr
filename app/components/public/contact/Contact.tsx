import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import { useMutation } from '@blitzjs/rpc';

import { ContactInputType } from 'app/components/forms/validations';
import ContactForm from 'app/components/public/contact/ContactForm';
import Snackbar from 'app/core/layouts/Snackbar';
import useSnackbar from 'app/entities/hooks/useSnackbar';
import contact from 'app/entities/users/mutations/contact';

export default function Contact() {
  const { open, message, severity, onShow, onClose } = useSnackbar();

  const [sendContact] = useMutation(contact);

  const onSuccess = async (data: ContactInputType) => {
    await sendContact(data)
      .then(() => onShow('success', 'Envoyé'))
      .catch((err) => onShow('error', err.message));
  };

  return (
    <Box>
      <a id="contact" href="#contact" />
      <Container className="px-2 py-8 md:p-8">
        <Typography variant="h3" align="right" gutterBottom>
          <b>CONTACT</b>
        </Typography>

        <Typography align="right" variant="subtitle2" gutterBottom>
          Vous souhaitez prendre contact ?
        </Typography>
        <Paper elevation={3} className="mt-4 p-4 dark:bg-blue">
          <ContactForm onSuccess={onSuccess} />
        </Paper>

        <Snackbar open={open} message={message} severity={severity} onClose={onClose} />
      </Container>
    </Box>
  );
}
