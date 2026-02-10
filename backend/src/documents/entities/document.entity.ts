import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Document {
  // 自動で増えるID（1, 2, 3...）
  @PrimaryGeneratedColumn()
  id: number;

  // アップロードされたファイルの名前
  @Column()
  fileName: string;

  // PDFから抽出されたテキストの中身（500文字程度のチャンク）
  @Column({ type: 'text' })
  content: string;

  // ページ番号（任意）
  @Column({ type: 'integer', nullable: true })
  pageNumber: number;

  // AI（Gemini）が生成したベクトルデータ
  // pgvectorを使っているので型は 'vector'、次元数は Gemini の 768 を指定
  @Column({ type: 'text', nullable: true })
  embedding: number[];

  // 登録された日時を自動記録
  @CreateDateColumn()
  createdAt: Date;
}
