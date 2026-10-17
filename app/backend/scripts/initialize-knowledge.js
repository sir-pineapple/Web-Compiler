require("dotenv").config();

const pool = require("../src/config/db");
const {
    runMigrations,
} = require("../src/services/migrations.service");
const {
    runIngestion,
} = require("./ingest-knowledge");

const main = async () => {
    console.log("Running database migrations...");
    await runMigrations();

    console.log("Initializing the RAG knowledge base...");
    const summary = await runIngestion();

    console.log(
        "Knowledge initialization summary:",
        JSON.stringify(summary, null, 2)
    );

    if (summary.failed > 0) {
        throw new Error(
            `${summary.failed} knowledge document(s) failed ingestion`
        );
    }

    console.log("Knowledge initialization completed successfully.");
};

main()
    .catch((error) => {
        console.error(
            `Knowledge initialization failed: ${error.message}`
        );
        process.exitCode = 1;
    })
    .finally(async () => {
        await pool.end();
    });