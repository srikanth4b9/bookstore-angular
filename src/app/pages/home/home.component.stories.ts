import type {Meta, StoryObj} from '@storybook/angular';
import {applicationConfig} from '@storybook/angular';
import {HomeComponent} from './home.component';
import {createMockStoreProviders} from '../../.storybook/mock-providers';
import {MOCK_BOOKS} from '../../.storybook/mock-data';

const meta: Meta<HomeComponent> = {
  title: 'Pages/Home',
  component: HomeComponent,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Landing page with hero section, featured books grid (top 4), and browse-by-category cards.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<HomeComponent>;

export const Default: Story = {
  name: 'With Books & Categories',
  decorators: [
    applicationConfig({
      providers: [...createMockStoreProviders({books: MOCK_BOOKS})],
    }),
  ],
};

export const Loading: Story = {
  name: 'Loading State',
  decorators: [
    applicationConfig({
      providers: [...createMockStoreProviders({books: [], isLoading: true})],
    }),
  ],
};

export const Empty: Story = {
  name: 'No Books Available',
  decorators: [
    applicationConfig({
      providers: [...createMockStoreProviders({books: []})],
    }),
  ],
};
