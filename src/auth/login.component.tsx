import { Box, BoxProps, Button, H5, Icon, Text, MessageBox } from '@adminjs/design-system';
import { styled } from '@adminjs/design-system/styled-components';
import React from 'react';
import { useSelector } from 'react-redux';
import { ReduxState, useTranslation } from 'adminjs';

import SenseFooter from '../branding/footer.component.js';

type LoginTemplateAttributes = {
  errorMessage?: string | null;
  action?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [name: string]: any;
};

type WindowWithState = {
  __APP_STATE__: LoginTemplateAttributes;
};

const Wrapper = styled(Box)<BoxProps>`
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;
`;

const StyledLogo = styled.img`
  max-width: 200px;
  margin: ${({ theme }) => theme.space.md} 0;
`;

const handleLoginClick = () => {
  window.location.href = '/admin/login/initiate';
};

// eslint-disable-next-line react/function-component-definition
const CustomLogin: React.FC<LoginTemplateAttributes> = () => {
  const { translateComponent, translateMessage } = useTranslation();
  const branding = useSelector((state: ReduxState) => state.branding);
  const properties = (window as unknown as WindowWithState).__APP_STATE__;
  const { errorMessage: message } = properties;

  return (
    <Wrapper flex variant="grey" className="login__Wrapper">
      <Box bg="white" height="440px" flex boxShadow="login" width={[1, 2 / 3, 'auto']}>
        <Box p="x3" flexGrow={1} width={['100%', '100%', '480px']}>
          <H5 marginBottom="xxl" textAlign="center">
            {branding.logo ? <StyledLogo src={branding.logo} alt={branding.companyName} /> : branding.companyName}
          </H5>
          {message && (
            <MessageBox
              my="lg"
              message={message.split(' ').length > 1 ? message : translateMessage(message)}
              variant="danger"
            />
          )}
          <Box>
            <Text>
              <Icon icon="AlertCircle" />
              &nbsp; Warning: You are logging into the privileged access area. Please close this window immediately if
              you are not authorized for privileged access to Sense.
              <br />
              &nbsp;
            </Text>
          </Box>
          <Text mt="xl" textAlign="center">
            <Button onClick={handleLoginClick} variant="contained">
              {translateComponent('Login.loginButton')}
            </Button>
          </Text>
        </Box>
      </Box>
      <Box mt="xxl">
        <SenseFooter />
      </Box>
    </Wrapper>
  );
};

export default CustomLogin;
