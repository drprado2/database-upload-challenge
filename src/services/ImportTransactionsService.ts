import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';
import uploadConfig from '../config/upload';
import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

class ImportTransactionsService {
  async execute(csvFileName: string): Promise<Transaction[]> {
    const createTransactionService = new CreateTransactionService();
    const csvFilePath = path.join(uploadConfig.directory, csvFileName);
    const readCSVStream = fs.createReadStream(csvFilePath);
    const parseStream = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });
    const parseCSV = readCSVStream.pipe(parseStream);
    const lines: any[][] = [];

    parseCSV.on('data', line => {
      lines.push(line);
    });
    await new Promise(resolve => {
      parseCSV.on('end', resolve);
    });

    const transactionsCreated: Transaction[] = [];

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      console.log('line', i, line);
      const [title, type, value, category] = line;
      // eslint-disable-next-line no-await-in-loop
      const transaction = await createTransactionService.execute({
        title,
        type,
        value,
        category,
      });

      transactionsCreated.push(transaction);
    }

    return transactionsCreated;
  }
}

export default ImportTransactionsService;
