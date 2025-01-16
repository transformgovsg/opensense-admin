import React from 'react';
import { Box, H2, Text } from '@adminjs/design-system';

const pageHeaderHeight = 300;
const pageHeaderPaddingY = 74;
const pageHeaderPaddingX = 250;

function DashboardHeader() {
  return (
    <Box data-css="default-dashboard">
      <Box
        position="relative"
        overflow="hidden"
        bg="white"
        height={pageHeaderHeight}
        py={pageHeaderPaddingY}
        px={['default', 'lg', pageHeaderPaddingX]}
      >
        <Box position="absolute" top={30} left={0} opacity={0.9} animate display={['none', 'none', 'none', 'block']}>
          {/* <RocketSVG /> */}
        </Box>
        <Text textAlign="center" color="grey100">
          <H2 fontWeight="bold">Welcome to Sense Admin!</H2>
          <Text opacity={0.8}>Manage your Sense Users, Databases and Permissions - all in one place.</Text>
        </Text>
      </Box>
    </Box>
  );
}

export default function Dashboard() {
  return (
    <Box>
      <DashboardHeader />
    </Box>
  );
}
