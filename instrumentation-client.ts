// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
	dsn: "https://59f42a8af75d077b644445c3caa09b42@o4509419747147776.ingest.de.sentry.io/4509419824676944",

	// Add optional integrations for additional features
	integrations: [
		Sentry.feedbackIntegration({
			// Additional SDK configuration goes in here, for example:
			colorScheme: "system",
			isNameRequired: true,
			isEmailRequired: true,
		}),
		Sentry.replayIntegration(),
	],

	// Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
	tracesSampleRate: 1,

	// Define how likely Replay events are sampled.
	// This sets the sample rate to be 10%. You may want this to be 100% while
	// in development and sample at a lower rate in production
	replaysSessionSampleRate: 0.1,

	// Define how likely Replay events are sampled when an error occurs.
	replaysOnErrorSampleRate: 1.0,

	// Setting this option to true will print useful information to the console while you're setting up Sentry.
	debug: false,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
