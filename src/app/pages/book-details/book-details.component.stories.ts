import type {Meta, StoryObj} from '@storybook/angular';
import {applicationConfig} from '@storybook/angular';
import {BookDetailsComponent} from './book-details.component';
import {createMockDataService} from '../../.storybook/mock-providers';
import {MOCK_BOOKS} from '../../.storybook/mock-data';

const meta: Meta<BookDetailsComponent> = {
  title: 'Pages/BookDetails',
  component: BookDetailsComponent,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Book details page showing title, author, description, reviews, rating, and add-to-cart button.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<BookDetailsComponent>;

export const Default: Story = {
  name: 'With Book',
  decorators: [
    applicationConfig({
      providers: [createMockDataService({books: MOCK_BOOKS})],
    }),
  ],
};

export const Loading: Story = {
  name: 'Loading State',
  decorators: [
    applicationConfig({
      providers: [createMockDataService({books: [], isLoading: true})],
    }),
  ],
};
