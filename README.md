# maiar-dexscreener

The purpose of this repository is to illustrate a simple call to an external resource.
In practice this is usually referred to a Retrieval Augmented Generation.

## Running the example

First create a `.env` file and add the following

```
OPENAI_API_KEY=
```

Then to build it run:

```
pnpm install
pnpm start
```

## Examples:

So we initialize the `runtime` with our new RAG plugin and provide it the following baseline information:

```
new PluginTrending({
      name: "Dexscreener Boosted Tokens",
      description: "Returns the list of the most boosted tokens on dexscreener",
      fetchTrending: formatTrending,
})
```

Input: `What are the most trending tokens on dex?`

Request Example:

```
curl -X POST http://localhost:3000/message \
 -H "Content-Type: application/json" \
 -d '{"message": "What is the last name of Socrates", "user": "test-user"}'
"The last name of Socrates in the EXTERNAL_SYSTEM is Potato."%

```

Output: `"Here are some of the most trending tokens on the Solana DEX: 1. Farting Unicorn (FU) - 1500 total amount. 2. ai16cz - 1100 total amount. 3. The Smartest AI on Earth - 1000 total amount. 4. Vive la blockchain! - 1000 total amount. 5. Antishifty ($ANTY) - 600 total amount. These tokens are currently gaining attention and activity on the platform.`
