import React, { Fragment } from 'react';
import App from 'next/app';
import Head from 'next/head';
import { AppProvider } from '@shopify/polaris';
import { Provider } from '@shopify/app-bridge-react';
import '@shopify/polaris/dist/styles.css';
import translations from '@shopify/polaris/locales/en.json';
import Cookies from 'js-cookie';

class MyApp extends App {
	render() {
		const { Component, pageProps } = this.props;
		const config = {
			apiKey: API_KEY,
			shopOrigin: Cookies.get('shopOrigin'),
			host: Buffer.from(HOST_URL).toString('base64'),
			// forceRedirect: true,
		};

		return (
			<Fragment>
				<Head>
					<title>Demet's Store</title>
					<meta charSet="utf-8" />
				</Head>
				<Provider config={config}>
					<AppProvider i18n={translations}>
						<Component {...pageProps} />
					</AppProvider>
				</Provider>
			</Fragment>
		);
	}
}

export default MyApp;
