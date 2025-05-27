<!--
frontend-dev-docs.md
-->

# 💻 Frontend Developer Guidelines

## How to Obtain Source Code:

    `$ git clone https://github.com/ucan-app/ucan-frontend.git`

## Directory Layout

```
ucan-frontend/
├── public/
│   ├── // Stores static files like images and icons
├── src/
│   ├── api/
│   │   └── // Store files that work with API calls here
│   ├── components/
│   │   ├── // Individual HTML components for pages
│   ├── pages/
│   │   ├── // Each path of the domain
│   ├── App_test.tsx	// Stores CI tests for frontend
│   ├── App.tsx 	// Stores persistent data across pages alongside route management
│   ├── App.css
│   ├── index.tsx
│   ├── index.css
│   ├── types.ts	// List of all required data types
│   └── dummyData.ts	// Placeholder data for testing
├── package.json, package-lock.json, tsconfig.json
	│	// Configuration for TypeScript, Node.js, and npm
├── .gitignore
└── README.md
```

## How to Build Software

- Install dependencies using `npm install`
- Run `npm run build` to build
- Run `npm start` to run the app locally at `localhost:3000`

## How to Test Software

- Use `npm test` to run all tests.
- Use `npm run test:single – “test name”` to run an individual test of the given name.
- Use `npm run test:describe – “describe section name”` to run a group of tests with the given section name.

## How to Add New Tests

`App_test.tsx` stores all tests for the frontend, divided up into sections based on what they test. Add future test sections using the `describe(“Section Name”, () => {// Tests});` syntax, and individual assertions using `it(“should have this assertion”, () => {// expect(this).to.equal(that)});`

- Use: `Mocha`.
- Name Convention: Ensure all test files end with `_test.tsx` to be recognizable by `npm test`.

## How to Build a Release of the Software

- Ensure software builds with no error: `npm run build`
- Create a new `release/tag` in GitHub with changelog and version
