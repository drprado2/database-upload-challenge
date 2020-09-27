import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    category,
    type,
    value,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);

    if (type === 'outcome') {
      const currentBalance = await transactionRepository.getBalance();
      if (currentBalance.total < value)
        throw new AppError('The account doest not have enough balance');
    }

    let existentCategory = await categoryRepository.findOne({
      where: {
        title: category,
      },
    });

    if (!existentCategory) {
      existentCategory = categoryRepository.create({ title: category });
      await categoryRepository.save(existentCategory);
    }

    const transaction = transactionRepository.create({
      type,
      category_id: existentCategory.id,
      title,
      value,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
