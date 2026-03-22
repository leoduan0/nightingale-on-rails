# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project
npx sv create my-app
```

To recreate this project with the same configuration:

```sh
# recreate this project
bun x sv@0.12.8 create --template minimal --types ts --install bun .
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

You are an expert full-stack developer and AI system designer. Build a **secure, full-stack Svelte web app** that simplifies the mental health intake process with the following requirements:

1. Pages
   - Home page (/): contains the front page, complete with modern looking hero sections
   - Sign in page (/sign-in): allows users to sign in. add extra dropdown that allows the user to specify whether they are logging in as a clinician or as a patient (but NOT a separate page)
   - Sign up page (/sign-up): allows users to sign up
   - Dashboard (/dashboard): only accessible if the user is signed in; details below
   - Privacy Policy (/privacy-policy): just generate some boilerplate for now
   - Terms of Service (/terms-of-service): just generate some boilerplate for now
1. Dashboard
   - Users can see one questionnaire that contains their personal information and demographics that have nothing to do with mental health (have two fields that ask for age and gender for now)
   - Users can see another section that takes them to a chat with an AI chatbot (more details below).
1. Chatbot
   - The AI chatbot only listens but does not give therapeutic advice (other than don't suicide, etc). Assume that we are using the OpenAI API for this. The AI chatbot would start a free-flowing conversation with the client about their mental health struggles.
   - The AI asks mostly probing questions. For example, if the user says that they have been suffering depression, a good question to ask would not be "how severe is it" or "how long you've been having it" but "what's been causing it?" because the last question is much more informative and natural for you to talk about. this incentivizes the user to give more information
   - There will be a button that says "end conversation". Upon pressing this button, the AI would send a goodbye message, wish the user well. Then, the conversation would be summarized and then saved.
   - The chatlog and the questionnare, along with their respective summaries, would be stored.
   - Users can review and edit the AI-generated summaries before saving. They can also edit it at any time from their dashboard.
   - Include a consent screen clearly explaining data usage and privacy.
   - Implement a labelling system where if the person seems to be having issues that would benefit from immediate treatment, flag it (but don't let the user see what they have been flagged as). The three tiers should be: high, medium, low.
1. **Clinician-Facing Features:**
   - Psychiatrists can log in and view submitted forms and chat summaries for each patient.
   - For the greatest certainty, I will specify that, when creating the Prisma database schemas, make the information between clinicians and patients completely separate (i.e. don't create a users table).
   - In their dashboard, show a list of their patients. Be creative, I will give the rest of the wand power to you.
   - When the clinician clicks into each patient, they would be able to see their patient's chatlog, questionnaire, and their summaries. Remind you that each patient has only one questionnaire and chatlog (for now).
   - Support a dashboard to filter, sort, or search through patients by their last name or first name (but that's it for now).
   - Allow exporting data to PDF.
1. **Technical Requirements:**
   - **Frontend**: SvelteKit with TypeScript + Tailwind CSS. Use zod for form validation. Use shadcn-svelte for the UI library.
   - **Backend:** Svelte with Prisma. Use Supabase Postgres with Supabase Auth.
   - **Deployment:** Vercel deployment
1. **Code Quality & Documentation:**
   - Provide clear folder structure, component structure, and comments explaining each file.
   - Don't modify this README file

Deliver **all files, code, and folder structure** in one codebase ready to run locally.  
Label frontend vs backend clearly and include sample `.env.example` for API keys or database credentials.

Focus on creating a **minimal viable product (MVP)** with working end-to-end flow: user chat → AI extraction → form review → clinician dashboard.

Make the code **production-ready**, but keep it simple enough for iteration.

Throughout your entire coding process, constantly look up the official documentation for all of the tools that you are going to use.
