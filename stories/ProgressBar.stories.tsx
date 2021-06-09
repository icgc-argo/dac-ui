import { Meta } from '@storybook/react';
import ApplicationProgressBar from '../components/ApplicationProgressBar';
import { Story } from '@storybook/react';
import React from 'react';
import { ApplicationState } from '../components/ApplicationProgressBar/progressStates';

const ApplicationsStates = Object.values(ApplicationState);

export default {
  title: 'DACO/ProgressBar',
  component: ApplicationProgressBar,
  argTypes: {
    state: {
      options: ApplicationsStates,
      control: { type: 'radio' },
      defaultValue: ApplicationsStates[0],
    },
  },
} as Meta;

const Template: Story<any> = (args) => <ApplicationProgressBar {...args} />;

export const Primary = Template.bind({});
