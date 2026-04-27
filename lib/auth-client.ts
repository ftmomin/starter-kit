import {
	customSessionClient,
	inferAdditionalFields,
	organizationClient,
} from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react'; // "better-auth/client" is deprecated;
import { toast } from 'sonner';

import type { auth } from '@/lib/auth';

export const authClient = createAuthClient({
	plugins: [
		inferAdditionalFields<typeof auth>(),
		customSessionClient<typeof auth>(),
		organizationClient({
			// schema: inferOrgAdditionalFields<typeof auth>(),
			schema: {
				organization: {
					additionalFields: {
						settings: {
							type: 'json',
							required: false,
						},
					},
				},
			},
			dynamicAccessControl: {
				enabled: true,
			},
		}),
	],
	fetchOptions: {
		onError(e) {
			if (e.error.status === 429) {
				toast.error('Too many requests. Please try again later.');
			}
		},
	},
});
