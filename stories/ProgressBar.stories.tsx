import { Meta } from '@storybook/react';
import ApplicationProgressBar from '../components/ApplicationProgressBar';
import { Story } from '@storybook/react';
import React from 'react';

export default {
  title: 'DACO/ProgressBar',
  component: ApplicationProgressBar,
} as Meta;

const Template: Story<any> = (args) => <ApplicationProgressBar {...args} />;

export const Primary = Template.bind({});

Primary.args = {};
