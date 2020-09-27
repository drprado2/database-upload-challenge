import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();
    const totalIncome = transactions
      .filter(x => x.type === 'income')
      .reduce(
        (previousValue, currentValue) => previousValue + currentValue.value,
        0,
      );
    const totalOutcome = transactions
      .filter(x => x.type === 'outcome')
      .reduce(
        (previousValue, currentValue) => previousValue + currentValue.value,
        0,
      );
    return {
      income: totalIncome,
      outcome: totalOutcome,
      total: totalIncome - totalOutcome,
    };
  }
}

export default TransactionsRepository;
