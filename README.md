# print-pdf-serverless

ホームページのPDF化

## 使用方法

config/stg.ymlファイルを適宜修正

```
DEPLOYMENT_BUCKET: serverless-lambda-deploys
PDF_BUCKET_NAME: print-pdf-stg
PDF_BUCKET_KEY_PREFIX: print_pdf
```

インストールと実行

```
npm install

node_modules/serverless/bin/serverless deploy --profile xxxxx

node_modules/serverless/bin/serverless invoke -f exportPdf -p docs/sample.json --profile xxxxx

{
    "path": "https://print-pdf-stg.s3.ap-northeast-1.amazonaws.com/print_pdf/xxxxx.pdf"
}

```