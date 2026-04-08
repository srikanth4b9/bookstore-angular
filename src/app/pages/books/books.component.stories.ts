import type {Meta, StoryObj} from '@storybook/angular';
import {applicationConfig} from '@storybook/angular';
import {BooksComponent} from './books.component';
import {createMockStoreProviders} from '../../.storybook/mock-providers';
import {MOCK_BOOKS} from '../../.storybook/mock-data';

const meta: Meta<BooksComponent> = {
  title: 'Pages/Books',
  component: BooksComponent,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Book catalog page with search, category filter, sort controls, grid/list toggle, pagination, and add-to-cart functionality.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<BooksComponent>;

export const Default: Story = {
  name: 'With Books',
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
  name: 'No Results',
  decorators: [
    applicationConfig({
      providers: [...createMockStoreProviders({books: []})],
    }),
  ],
};
