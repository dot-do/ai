# @dot-do/database.do

Database SDK for the dot-do platform.

## Installation

```bash
npm install @dot-do/database.do
# or
yarn add @dot-do/database.do
# or
pnpm add @dot-do/database.do
```

## Usage

```typescript
import { DB, db } from '@dot-do/database.do';

// Define your database schema
const MyDB = DB({
  User: {
    name: 'string',
    email: 'string',
    age: 'number',
  },
  Post: {
    title: 'string',
    content: 'string',
    author: 'User',
  },
});

// Create a new user
const user = await db.User.create({
  name: 'John Doe',
  email: 'john@example.com',
  age: 30,
});

// Create a post
const post = await db.Post.create({
  title: 'Hello World',
  content: 'This is my first post',
  author: user.id,
});

// List all users
const users = await db.User.list();

// Get a specific post
const myPost = await db.Post.get(post.id);

// Update a user
await db.User.update(user.id, { age: 31 });

// Delete a post
await db.Post.delete(post.id);
```
