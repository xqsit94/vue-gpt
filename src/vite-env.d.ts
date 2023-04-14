/// <reference types="vite/client" />

interface ErrorResponse {
  error: ErrorData
}
interface ResponseContentData {
  role: string
  content: string
}

type ErrorData = {
  code: string | null
  message: string
  param: string | null
  type: string
}

type ContentData = {
  question: string
  role: string
  answer: string
}

interface CodeBlock {
  codeBlock: string
}
