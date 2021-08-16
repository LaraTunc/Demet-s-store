require('isomorphic-fetch');
const dotenv = require('dotenv');
const Koa = require('koa');
const next = require('next');
const { default: createShopifyAuth } = require('@shopify/koa-shopify-auth');
const { verifyRequest } = require('@shopify/koa-shopify-auth');
const { default: Shopify, ApiVersion } = require('@shopify/shopify-api');

const session = require('koa-session');

dotenv.config();
const { SHOPIFY_API_KEY, SHOPIFY_API_SECRET_KEY, SHOPIFY_APP_URL } =
	process.env;

Shopify.Context.initialize({
	API_KEY: SHOPIFY_API_KEY,
	API_SECRET_KEY: SHOPIFY_API_SECRET_KEY,
	SCOPES: [
		'read_products',
		'write_products',
		'read_script_tags',
		'write_script_tags',
	],
	HOST_NAME: SHOPIFY_APP_URL.replace(/https:\/\//, ''),
	API_VERSION: ApiVersion.October20,
	IS_EMBEDDED_APP: true,
	SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(),
});

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
	const server = new Koa();
	server.use(session({ secure: true, sameSite: 'none' }, server));
	server.keys = [SHOPIFY_API_SECRET_KEY];

	server.use(
		createShopifyAuth({
			afterAuth(ctx) {
				const { shop, acessToken } = ctx.session;

				ctx.redirect('/');
			},
		})
	);

	server.use(verifyRequest());
	server.use(async (ctx) => {
		await handle(ctx.req, ctx.res);
		ctx.respond = false;
		ctx.res.statusCode = 200;
		return;
	});

	server.listen(port, () => {
		console.log(`> Ready on http://localhost:${port}`);
	});
});
