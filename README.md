## Running the app

Install dependencies:

```console
npm install
```

Create a git-ignored text file for storing secrets like your API token:

```
cp .env.example .env.local
```

Add the local .env and setup the [Replicate API token](https://replicate.com/account/api-tokens) to `.env.local` if running on Vercel:

```
REPLICATE_API_TOKEN=<token-here>
```

## NGROk to run locally over https:

1. Download and install ngrok from https://ngrok.com/download. Or, if using Mac cli and run:

```console
brew install ngrok
```

2. Sign up for an account if you don't have one.
3. After installation, open a terminal and run the command ngrok http 3000. This command creates a secure tunnel to your local machine on port 3000.
4. ngrok will provide you with a URL that looks something like https://<random-string>.ngrok.io. This is your ngrok host.
5. In your project's .env.local file, add the ngrok host to the NGROK_HOST variable. It should look something like this: NGROK_HOST=https://<random-string>.ngrok.io.

### Run the development server:

Start ngrok:

```console
ngrok http 3000
```

```console
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

For detailed instructions on how to create and use this template, see [replicate.com/docs/get-started/nextjs](https://replicate.com/docs/get-started/nextjs)


## Webhooks

Webhooks provide real-time updates about your predictions. When you create a prediction or training, specify a URL that you control and Replicate will send HTTP POST requests to that URL when the prediction is created, updated, and completed.

This app is set up to optionally request, receive, and validate webhooks.

### How webhooks work

1. You specify a webhook URL when creating a prediction in [app/api/predictions/[id]/route.js](app/api/predictions/[id]/route.js)
1. Replicate sends POST requests to the handler in [app/api/webhooks/route.js](app/api/webhooks/route.js) as the prediction is updated.

### Requesting and receiving webhooks

To test webhooks in development, you'll need to create a secure tunnel to your local machine, so Replicate can send POST requests to it. Follow these steps:

1. [Download and set up `ngrok`](https://replicate.com/docs/webhooks#testing-your-webhook-code), an open-source tool that creates a secure tunnel to your local machine so you can receive webhooks.
1. Run ngrok to create a publicly accessible URL to your local machine: `ngrok http 3000`
1. Copy the resulting ngrok.app URL and paste it into `.env.local`, like this: `NGROK_HOST="https://020228d056d0.ngrok.app"`.
1. Leave ngrok running.
1. In a separate terminal window, run the app with `npm run dev`
1. Open [localhost:3000](http://localhost:3000) in your browser and enter a prompt to generate an image.
1. Go to [replicate.com/webhooks](https://replicate.com/webhooks) to see your prediction status.

### Validating incoming webhooks

Follow these steps to set up your development environment to validate incoming webhooks:

1. Get your signing secret by running:
    ```
    curl -s -X GET -H "Authorization: Bearer $REPLICATE_API_TOKEN" https://api.replicate.com/v1/webhooks/default/secret
    ```
1. Add this secret to `.env.local`, like this: `REPLICATE_WEBHOOK_SIGNING_SECRET=whsec_...`
1. Now when you run a prediction, the webhook handler in [app/api/webhooks/route.js](app/api/webhooks/route.js) will verify the webhook.