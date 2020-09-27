import { getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(transactionId: string): Promise<void> {
    const transactionRepository = getCustomRepository(TransactionsRepository);
    await transactionRepository.delete(transactionId);
  }
}

export default DeleteTransactionService;
