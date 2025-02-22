<script lang="ts">
	import SvelteSeo from 'svelte-seo';
</script>

<SvelteSeo
	title="Privacy Policy - AmbitiousYou"
	description="Learn how AmbitiousYou handles and protects your personal information. Our privacy policy outlines our data collection, usage, and protection practices."
	canonical="https://www.ambitiousyou.pro/privacy_policy"
	keywords="privacy policy, data protection, personal information, data security, user privacy, data collection, information handling, privacy practices, data usage, user data, data protection policy"
	openGraph={{
		title: 'Privacy Policy - AmbitiousYou',
		description:
			'Learn how AmbitiousYou handles and protects your personal information. Our privacy policy outlines our data collection, usage, and protection practices.',
		url: 'https://www.ambitiousyou.pro/privacy_policy',
		type: 'website',
		images: [
			{
				url: 'https://raw.githubusercontent.com/hemants1703/AmbitiousYou/refs/heads/main/static/og_data/OG_IMAGE.png',
				width: 1200,
				height: 630,
				alt: 'AmbitiousYou Privacy Policy'
			}
		],
		site_name: 'AmbitiousYou!'
	}}
	twitter={{
		card: 'summary_large_image',
		creator: '@hemants1703',
		title: 'Privacy Policy - AmbitiousYou',
		description:
			'Learn how AmbitiousYou handles and protects your personal information. Our privacy policy outlines our data collection, usage, and protection practices.',
		image:
			'https://raw.githubusercontent.com/hemants1703/AmbitiousYou/refs/heads/main/static/og_data/OG_IMAGE.png'
	}}
/>

<svelte:head>
	<title>Privacy Policy - AmbitiousYou</title>
</svelte:head>

<div class="container mx-auto px-6 py-20">
	<h1 class="text-3xl font-bold mb-4">Privacy Policy</h1>
	<p class="mb-4 text-muted-foreground">
		Welcome to AmbitiousYou! Your privacy is important to us. This privacy policy explains how we
		collect, use, and protect your personal information.
	</p>

	<h2 class="text-2xl font-semibold mb-2">1. Information We Collect</h2>
	<p class="mb-4 pl-10 text-muted-foreground">
		We collect information that you provide to us directly, such as when you create an account,
		update your profile, or use our services. This information may include your name, email address,
		and other personal details.
	</p>

	<h2 class="text-2xl font-semibold mb-2">2. How We Use Your Information</h2>
	<p class="mb-4 pl-10 text-muted-foreground">
		We use your information to provide, maintain, and improve our services. This includes using your
		information to:
	</p>
	<ul class="list-disc list-inside mb-4 pl-10 text-muted-foreground">
		<li>Manage your account and its data for you.</li>
		<li>Personalize your experience on our platform.</li>
		<li>Communicate with you about updates, promotions, and other information.</li>
		<li>Analyze usage and trends to improve our services.</li>
	</ul>

	<h2 class="text-2xl font-semibold mb-2">3. Sharing Your Information</h2>
	<p class="mb-4 pl-10 text-muted-foreground">
		We do not share your personal information with third parties except as necessary to provide our
		services, comply with legal obligations, or protect our rights. This may include sharing
		information with:
	</p>
	<ul class="list-disc list-inside mb-4 pl-10 text-muted-foreground">
		<li>Service providers who assist us in operating our platform</li>
		<li>Law enforcement or regulatory authorities if required by law</li>
	</ul>

	<h2 class="text-2xl font-semibold mb-2">4. Data Security</h2>
	<p class="mb-4 pl-10 text-muted-foreground">
		We take reasonable measures to protect your personal information from unauthorized access, use,
		or disclosure.
	</p>

	<h2 class="text-2xl font-semibold mb-2">5. Your Choices</h2>
	<p class="mb-4 pl-10 text-muted-foreground">
		You have the right to access, update, or delete your personal information. You can do this by
		logging into your account and updating your profile settings. If you need assistance, please
		contact us at support@ambitious-you.vercel.app
	</p>

	<h2 class="text-2xl font-semibold mb-2">6. Changes to This Privacy Policy</h2>
	<p class="mb-4 pl-10 text-muted-foreground">
		We may update this privacy policy from time to time. We will notify you of any changes by
		posting the new privacy policy on this page. You are advised to review this privacy policy
		periodically for any changes.
	</p>

	<h2 class="text-2xl font-semibold mb-2">7. Contact Us</h2>
	<p class="mb-4 pl-10 text-muted-foreground">
		If you have any questions or concerns about this privacy policy, please contact us at
		support@ambitious-you.vercel.app.
	</p>
</div>
