import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './entities/document.entity';
const pdf = require('pdf-parse');
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';

@Injectable()
export class DocumentsService {
  private embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GOOGLE_API_KEY, // .envから読み込み
    modelName: 'embedding-001',
  });

  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
  ) {}

  async processFile(file: Express.Multer.File) {
    let rawText = '';
    if (file.mimetype === 'application/pdf') {
      const data = await pdf(file.buffer);
      rawText = data.text;
    } else {
      rawText = file.buffer.toString('utf-8');
    }

    // チャンク分割（500文字ずつ）
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 100,
    });
    const output = await splitter.createDocuments([rawText]);

    // 各チャンクをベクトル化してDBへ保存
    for (const chunk of output) {
      const vector = await this.embeddings.embedQuery(chunk.pageContent);
      const doc = this.documentRepository.create({
        fileName: file.originalname,
        content: chunk.pageContent,
        embedding: vector,
      });
      await this.documentRepository.save(doc);
    }
    return { message: '解析と保存が完了しました' };
  }
}
