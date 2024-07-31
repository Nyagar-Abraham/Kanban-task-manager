import { ThemeProvider } from '@/context/theme-provider';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
	// title: 'The wild oasis',
	title: {
		template: '%s / KanBan Task Management App',
		default: 'Welcome / KanBan Task Management App',
	},
	description:
		'	Our Task Management App is designed to streamline your workflow and enhance productivity by efficiently organizing and managing your tasks. Whether you are an individual managing personal tasks or a team coordinating projects, this app offers a comprehensive solution to stay on top of your workload.',
};
export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<html lang="en" suppressHydrationWarning>
				<head />
				<body className="min-h-[100dvh]">
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						{children}
					</ThemeProvider>
				</body>
			</html>
		</>
	);
}
