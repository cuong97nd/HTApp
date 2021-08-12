import { Icon } from '@iconify/react';
import { Auth } from 'aws-amplify';
import googleFill from '@iconify/icons-eva/google-fill';
import twitterFill from '@iconify/icons-eva/twitter-fill';
import facebookFill from '@iconify/icons-eva/facebook-fill';
// material
import { Stack, Button, Divider, Typography } from '@material-ui/core';

// ----------------------------------------------------------------------

export default function AuthSocial() {
  return (
    <>
      <Stack direction="row" spacing={2}>
        <Button
          fullWidth
          size="large"
          color="inherit"
          variant="outlined"
          onClick={() => {
            Auth.federatedSignIn();
          }}
        >
          <Icon icon={googleFill} color="#DF3E30" height={24} />
        </Button>

        <Button fullWidth size="large" color="inherit" variant="outlined">
          <Icon icon={facebookFill} color="#1877F2" height={24} />
        </Button>
      </Stack>

      <Divider sx={{ my: 3 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          OR
        </Typography>
      </Divider>
    </>
  );
}
