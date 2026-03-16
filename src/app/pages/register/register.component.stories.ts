import type {Meta, StoryObj} from '@storybook/angular';
import {applicationConfig} from '@storybook/angular';
import {RegisterComponent} from './register.component';
import {createMockDataService} from '../../.storybook/mock-providers';

const meta: Meta<RegisterComponent> = {
  title: 'Pages/Register',
  component: RegisterComponent,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Registration page with name, email, and password fields. Includes password visibility toggle and link to login.',
      },
    },
  },
  decorators: [
    applicationConfig({
      providers: [createMockDataService()],
    }),
  ],
};

export default meta;
type Story = StoryObj<RegisterComponent>;

export const Default: Story = {
  name: 'Default',
};
