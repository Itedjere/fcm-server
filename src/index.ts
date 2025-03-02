import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";
import { sendNotificationMessage } from "./firebase/fcmNotificationMessageService.js";
import { sendDataMessage } from "./firebase/fcmDataMessageService.js";

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  type Response {
	status: String!
	message: String!
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
	sendNotifiMessage(token: String): Response!
	sendDataMessage(token: String): Response!
  }
`;

const books = [
	{
		title: "The Awakening",
		author: "Kate Chopin",
	},
	{
		title: "City of Glass",
		author: "Paul Auster",
	},
];

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
	Query: {
		books: () => books,
		sendNotifiMessage: async (_, args: { token: string }) => {
			const token = args.token;
			const title = "New Sale";
			const body = "New Sale added to your account";
			const link = "https://fcm-client-omega.vercel.app/about";
			try {
				const response = await sendNotificationMessage(
					token,
					title,
					body,
					link
				);
				if (response) {
					return {
						status: "success",
						message: "Notification sent successfully",
					};
				}
			} catch (error) {
				throw error;
			}
		},
		sendDataMessage: async (_, args: { token: string }) => {
			const token = args.token;
			const title = "New Sale";
			const body = "New Sale added to your account";
			const link = "https://fcm-client-omega.vercel.app/about";
			try {
				const response = await sendDataMessage(
					token,
					title,
					body,
					link
				);
				if (response) {
					return {
						status: "success",
						message: "Notification sent successfully",
					};
				}
			} catch (error) {
				throw error;
			}
		},
	},
};

interface MyContext {
	token?: string;
}

// Required logic for integrating with Express
const app = express();
// Our httpServer handles incoming requests to our Express app.
// Below, we tell Apollo Server to "drain" this httpServer,
// enabling our servers to shut down gracefully.
const httpServer = http.createServer(app);

// Same ApolloServer initialization as before, plus the drain plugin
// for our httpServer.
const server = new ApolloServer<MyContext>({
	typeDefs,
	resolvers,
	plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
// Ensure we wait for our server to start
await server.start();

// Set up our Express middleware to handle CORS, body parsing,
// and our expressMiddleware function.
app.use(
	"/",
	cors<cors.CorsRequest>(),
	express.json(),
	// expressMiddleware accepts the same arguments:
	// an Apollo Server instance and optional configuration options
	expressMiddleware(server, {
		context: async ({ req }) => ({ token: req.headers.token }),
	})
);

// Modified server startup
await new Promise<void>((resolve) =>
	httpServer.listen({ port: 4000 }, resolve)
);
console.log(`🚀 Server ready at http://localhost:4000/`);
