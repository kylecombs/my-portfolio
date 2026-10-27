# Kyle Combs - Portfolio Website

A modern portfolio website built with [Remix](https://remix.run/), TypeScript, and Tailwind CSS, showcasing software engineering projects and experience.

## 🚀 Features

- **Modern Tech Stack**: Built with Remix, TypeScript, and Tailwind CSS
- **Responsive Design**: Mobile-first approach with dark mode support
- **Fast Performance**: Server-side rendering with Remix
- **SEO Optimized**: Meta tags and proper HTML structure
- **Accessible**: Built with accessibility best practices

## 🏗️ Project Structure

```
app/
├── routes/
│   ├── _index.tsx          # Homepage with hero, about, and contact sections
│   └── projects.tsx        # Dedicated projects showcase page
├── root.tsx                # Root layout with navigation and fonts
├── entry.client.tsx        # Client-side entry point
├── entry.server.tsx        # Server-side entry point
└── tailwind.css           # Tailwind CSS imports
```

## 🛠️ Development

### Prerequisites

- Node.js >= 20.0.0
- npm or yarn

### Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open [http://localhost:5173](http://localhost:5173) in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run typecheck` - Run TypeScript checks
- `npm run lint` - Run ESLint

## 📄 Pages

### Homepage (`/`)

- Hero section with introduction
- About section with skills and quick facts
- Featured projects preview
- Experience timeline
- Contact information

### Projects (`/projects`)

- Detailed project showcase
- Technology stack for each project
- Links to GitHub repositories and live demos
- Project descriptions and features

## 🎨 Customization

### Adding New Projects

Edit the `projects` array in `app/routes/projects.tsx`:

```typescript
const projects = [
  {
    id: 1,
    title: "Your Project Name",
    description: "Project description...",
    technologies: ["React", "TypeScript", "Node.js"],
    githubUrl: "https://github.com/username/repo",
    liveUrl: "https://your-demo.com",
    imageGradient: "from-blue-400 to-purple-500",
  },
];
```

### Updating Personal Information

1. **Contact Links**: Update email, LinkedIn, and GitHub URLs in both `app/routes/_index.tsx` and `app/routes/projects.tsx`
2. **Meta Tags**: Update title and description in the `meta` function of each route
3. **About Section**: Modify the about text and skills in `app/routes/_index.tsx`
4. **Experience**: Update the experience section with your work history

### Styling

The project uses Tailwind CSS for styling. Key design elements:

- **Colors**: Blue (`blue-600`) as primary, gray for text and backgrounds
- **Typography**: Inter font from Google Fonts
- **Dark Mode**: Automatic dark mode support with `dark:` classes
- **Responsive**: Mobile-first with `sm:`, `md:`, `lg:` breakpoints

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deployment Options

- **Vercel**: Connect your GitHub repository to Vercel for automatic deployments
- **Netlify**: Deploy directly from GitHub with Netlify
- **Railway**: Deploy with Railway for full-stack applications
- **Self-hosted**: Use `npm run start` to run the production server

## 🔧 Technologies Used

- **Framework**: [Remix](https://remix.run/) - Full-stack web framework
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **Build Tool**: [Vite](https://vitejs.dev/) - Fast build tool and dev server
- **Linting**: [ESLint](https://eslint.org/) - Code linting and formatting

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Feel free to fork this project and use it as a template for your own portfolio. If you find any bugs or have suggestions for improvements, please open an issue or submit a pull request.

---

Built with ❤️ by Kyle Combs using Remix and TypeScript.
