require("dotenv").config();

const pool = require("../src/config/db");
const {
    retrieveKnowledge,
} = require("../src/services/knowledge/retrieval.service");

const TOP_K = 5;
const CANDIDATE_LIMIT = 20;

const testCases = [
    {
        name: "C++ expected semicolon",
        query: "expected ';' before expression",
        language: "C++",
        expectedSource: "cpp/expected-semicolon.md",
    },
    {
        name: "C++ undefined reference",
        query: "undefined reference to main",
        language: "C++",
        expectedSource: "cpp/undefined-reference.md",
    },
    {
        name: "C++ no matching function",
        query: "no matching function for call",
        language: "C++",
        expectedSource: "cpp/no-matching-function.md",
    },
    {
        name: "C++ cannot convert type",
        query: "cannot convert const char* to int",
        language: "C++",
        expectedSource: "cpp/cannot-convert-type.md",
    },
    {
        name: "Python NameError",
        query: "NameError: name 'total' is not defined",
        language: "Python",
        expectedSource: "python/name-error.md",
    },
    {
        name: "Java cannot find symbol",
        query: "cannot find symbol variable message",
        language: "Java",
        expectedSource: "java/cannot-find-symbol.md",
    },
];

const evaluateCase = async (testCase) => {
    const results = await retrieveKnowledge({
        query: testCase.query,
        language: testCase.language,
        limit: CANDIDATE_LIMIT,
    });

    const expectedIndex = results.findIndex(
        (result) =>
            result.document.sourceKey === testCase.expectedSource
    );

    const hybridRank =
        expectedIndex === -1 ? null : expectedIndex + 1;

    const topK = results.slice(0, TOP_K);
    const hitAtK = topK.some(
        (result) =>
            result.document.sourceKey === testCase.expectedSource
    );

    return {
        name: testCase.name,
        query: testCase.query,
        expectedSource: testCase.expectedSource,
        hybridRank,
        hitAtK,
        reciprocalRank: hybridRank ? 1 / hybridRank : 0,
        topResults: topK.map((result, index) => ({
            rank: index + 1,
            sourceKey: result.document.sourceKey,
            similarity: result.similarity,
            hybridScore: result.hybridScore,
            vectorRank: result.vectorRank,
            keywordRank: result.keywordRank,
        })),
    };
};

const main = async () => {
    const results = [];

    console.log(`Running ${testCases.length} retrieval evaluation cases.`);
    console.log(`Hybrid top-k metric: k = ${TOP_K}\n`);

    for (const testCase of testCases) {
        try {
            const result = await evaluateCase(testCase);
            results.push(result);

            console.log(
                `[${result.hitAtK ? "PASS" : "FAIL"}] ${result.name}`
            );
            console.log(`  Expected: ${result.expectedSource}`);
            console.log(
                `  Hybrid rank: ${result.hybridRank ?? "not in candidates"}`
            );

            for (const item of result.topResults) {
                console.log(
                    `  ${item.rank}. ${item.sourceKey}` +
                    ` | vector=${item.vectorRank ?? "-"}` +
                    ` | keyword=${item.keywordRank ?? "-"}` +
                    ` | similarity=${item.similarity ?? "-"}`
                );
            }

            console.log("");
        } catch (error) {
            console.error(
                `[ERROR] ${testCase.name}: ${error.message}\n`
            );

            results.push({
                name: testCase.name,
                expectedSource: testCase.expectedSource,
                hybridRank: null,
                hitAtK: false,
                reciprocalRank: 0,
                error: error.message,
                topResults: [],
            });
        }
    }

    const successfulRuns = results.filter((result) => !result.error);
    const topKHits = results.filter((result) => result.hitAtK).length;

    const mrr =
        results.length === 0
            ? 0
            : results.reduce(
                (sum, result) => sum + result.reciprocalRank,
                0
            ) / results.length;

    const topKAccuracy =
        results.length === 0 ? 0 : topKHits / results.length;

    const summary = {
        totalCases: testCases.length,
        successfulRuns: successfulRuns.length,
        failedRuns: results.length - successfulRuns.length,
        topK: TOP_K,
        topKHits,
        topKAccuracy,
        meanReciprocalRank: mrr,
        cases: results.map((result) => ({
            name: result.name,
            expectedSource: result.expectedSource,
            hybridRank: result.hybridRank,
            hitAtK: result.hitAtK,
            reciprocalRank: result.reciprocalRank,
            error: result.error ?? null,
        })),
    };

    console.log("===== Evaluation summary =====");
    console.log(JSON.stringify(summary, null, 2));

    if (
        successfulRuns.length !== testCases.length ||
        topKHits !== testCases.length
    ) {
        process.exitCode = 1;
    }
};

main()
    .catch((error) => {
        console.error("Evaluation aborted:", error.message);
        process.exitCode = 1;
    })
    .finally(async () => {
        await pool.end();
    });