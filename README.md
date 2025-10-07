# todo-app
todo app for altschool

## Production notes

- The default MemoryStore used by `express-session` is not suitable for production. Use a dedicated session store (for example `connect-mongo`) when deploying to multi-process hosts like Vercel.
- Ensure your MongoDB connection string is set in an environment variable named `MONGO_URI` or `MONGODB_URI`.
- Remove deprecated mongoose options from `config/db.js` (this project uses the modern `mongoose.connect(uri)` signature).

If you deploy to Vercel or similar, add the env vars in the platform dashboard and configure a persistent session store.
