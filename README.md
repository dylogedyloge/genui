This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# For https on development mode

-Install mkcert
For Windows
Download the mkcert executable:
Visit the mkcert GitHub releases page.
Download the latest release for Windows (e.g., mkcert-vX.X.X-windows-amd64.exe).
Rename the downloaded file to mkcert.exe and place it in a folder included in your system's PATH (e.g., C:\Windows\System32).

-Verify the installation by running in CMD:
mkcert -version

-mkcert -install in Project directory
-Generate the SSL certificate for localhost in Project directory:
mkcert localhost

This will generate:

localhost.pem (certificate)
localhost-key.pem (private key)
Place these files in your project directory if not already placed

- Now "local-ssl-proxy --source 3443 --target 3000 --cert localhost.pem --key localhost-key.pem" in Project directory

-npm run dev

-In different terminal "local-ssl-proxy --source 3443 --target 3000 --cert localhost.pem --key localhost-key.pem"
-Access your app at https://localhost:3443
