import { Icon } from '@iconify/react';
import { Auth } from 'aws-amplify';
import googleFill from '@iconify/icons-eva/google-fill';
import twitterFill from '@iconify/icons-eva/twitter-fill';
import facebookFill from '@iconify/icons-eva/facebook-fill';
// material
import { Stack, Button, Divider, Typography, Tooltip } from '@material-ui/core';

// ----------------------------------------------------------------------

export default function AuthSocial() {
  return (
    <>
      <Tooltip title="comming soon">
        <Stack direction="row" spacing={2}>
          <Button fullWidth size="large" color="inherit" variant="outlined" disabled>
            <Icon icon={googleFill} color="#DF3E30" height={24} />
          </Button>

          <Button fullWidth size="large" color="inherit" variant="outlined" disabled>
            <Icon icon={facebookFill} color="#1877F2" height={24} />
          </Button>
        </Stack>
      </Tooltip>

      <Divider sx={{ my: 3 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          OR
        </Typography>
      </Divider>
    </>
  );
}
