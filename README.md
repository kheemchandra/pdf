

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

Check this project [live](https://pdf-production.up.railway.app/)

## Getting Started

Clone this project
```bash
git clone https://github.com/kheemchandra/pdf.git
cd pdf
```
Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API. 

## Deploy on Railway

This project is deployed on  [Railway](https://railway.app/) for hosting. Since in [Vercel](https://vercel.com/) we can not access filesystem [here](https://vercel.com/guides/why-does-my-serverless-function-work-locally-but-not-when-deployed?query=file%20system#reading-from-or-writing-to-the-filesystem). But you can use other hosting platform where you can access app file-system.


## Extra
This project uses  [PDFTron](https://www.pdftron.com/) demo key. You will need to get one for running this project. Keep that secret key in `env.local` for development and in   production you can configure your web hosting platform setting to keep secret key.

## Feedback

Feedbacks are welcome.

**Caution**


⚠ Suitable for pdf file size < 10 MB
