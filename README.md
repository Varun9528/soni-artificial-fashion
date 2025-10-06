# Pachmarhi Tribal Art Marketplace

Discover authentic tribal art and handicrafts from Pachmarhi. Support local artisans and buy unique handmade products.

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- MySQL database
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```
Then edit `.env.local` with your configuration.

4. Set up the database:
```bash
npm run db:setup
npm run db:migrate
npm run db:seed
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

### Version Control

This project uses Git for version control. All changes should be committed to the repository:

```bash
git add .
git commit -m "Description of changes"
git push origin main
```

### Version Management

The project uses semantic versioning (MAJOR.MINOR.PATCH):

- **Patch version**: `npm run version:patch` - Bug fixes
- **Minor version**: `npm run version:minor` - New features (backward compatible)
- **Major version**: `npm run version:major` - Breaking changes

### Deployment Process

1. Increment version:
```bash
# For bug fixes
npm run version:patch

# For new features
npm run version:minor

# For breaking changes
npm run version:major
```

2. Deploy to production:
```bash
npm run deploy
```

### Environment Variables

Ensure the following environment variables are set in production:

- `DATABASE_URL` - Database connection string
- `JWT_SECRET` - Secret key for JWT token signing
- `NEXT_PUBLIC_APP_URL` - Public URL of the application

## Project Structure

```
src/
├── app/           # Next.js app router pages
├── components/    # React components
├── context/       # React context providers
├── lib/           # Utility libraries
├── services/      # API services
└── styles/        # CSS styles
```

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
