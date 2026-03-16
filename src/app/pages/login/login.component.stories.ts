import type {Meta, StoryObj} from '@storybook/angular';
import {applicationConfig} from '@storybook/angular';
import {LoginComponent} from './login.component';
import {createMockDataService} from '../../.storybook/mock-providers';

const meta: Meta<LoginComponent> = {
  title: 'Pages/Login',
  component: LoginComponent,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Login page with email and password fields, password visibility toggle, and link to registration.',
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
type Story = StoryObj<LoginComponent>;

export const Default: Story = {
  name: 'Default',
};

export const WithCredentials: Story = {
  name: 'With Pre-filled Credentials',
  args: {
    email: 'john@example.com',
    password: 'password123',
  },
};
