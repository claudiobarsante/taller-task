import { useState } from 'react'

interface Transaction {
  id: number;
  amount: number;
}

function PaymentDashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, amount: 50 },
    { id: 2, amount: 150 },
    { id: 3, amount: 200 },
  ]);
  const [target, setTarget] = useState<number | null>(null);
  const [result, setResult] = useState<string>('');

  const handleCheckTransactions = () => {
    if (target === null) return;

    const transactionMap = new Map<number, Transaction>();

    for (const transaction of transactions) {
      const complement = target - transaction.amount;

      if (transactionMap.has(complement)) {
        const matchedTransaction = transactionMap.get(complement);
        if (!matchedTransaction) return;
        setResult(`Transactions ${matchedTransaction.id} and ${transaction.id} add up to ${target}`);
        return;
      }

      transactionMap.set(transaction.amount, transaction);
    }

    setResult('No matching transactions found.');
    const id = transactions.length + 1;
    handleAddTransaction(id, target);
  };

  const handleAddTransaction = (id: number, amount: number) => {
    setTransactions([...transactions, { id, amount }]);
  };

  return (
    <div>
      <h1>Payment Transaction Dashboard</h1>
      <ul>
        {transactions.map((transaction) => (
          <li key={transaction.id}>
            ID: {transaction.id}, Amount: ${transaction.amount}
          </li>
        ))}
      </ul>
      <input
        type="number"
        placeholder="Enter target amount"
        onChange={(e) => setTarget(Number(e.target.value))}
      />
      <button onClick={handleCheckTransactions}>Check Transactions</button>
      <p>{result}</p>
    </div>
  );
}

export default PaymentDashboard;
