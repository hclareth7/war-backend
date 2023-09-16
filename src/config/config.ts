

export const CONFIGS = {
    company: { name: "EMPRESA BUENA", logoUrl: "https://logo.png" },
    pdfTitle: "Document",
    s3BaseUrl: `${process.env.S3_CLOUD_ENDPOINT}/swift/v1/1e325b6357b7498d909f5f789f02df29/${process.env.BUCKET_NAME}`,
    searchableFields: {
        beneficiary: ['first_name', 'second_name', 'first_last_name', 'second_last_name', 'identification'],
        user: ['name', 'email']
    }
};