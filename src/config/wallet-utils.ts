// Calculate wallet balance based on transactions and user role
export function calculateWalletBalance(
  transactions: any[],
  userId: string,
  userRole: string
) {
  return transactions.reduce((total, transaction) => {
    if (transaction.type === "CREDIT") {
      // If admin is viewing
      if (userRole === "ADMIN") {
        // If admin is the course creator, they get 100%
        if (transaction.course.instructorId === userId) {
          return total + transaction.amount;
        } else {
          // Admin gets 20% of each transaction
          return total + transaction.amount * 0.2;
        }
      }
      // If teacher is viewing
      else if (userRole === "TEACHER") {
        // Teacher gets 80% of each transaction for their courses
        return total + transaction.amount * 0.8;
      }
    } else if (transaction.type === "DEBIT") {
      return total - transaction.amount;
    }
    return total;
  }, 0);
}

// Calculate amount for a specific transaction based on user role
export function calculateTransactionAmount(
  transaction: any,
  userId: string,
  userRole: string
) {
  if (transaction.type === "CREDIT") {
    if (userRole === "ADMIN") {
      // If admin is the course creator, they get 100%
      if (transaction.course.instructorId === userId) {
        return transaction.amount;
      } else {
        // Admin gets 20% of each transaction
        return transaction.amount * 0.2;
      }
    } else if (userRole === "TEACHER") {
      // Teacher gets 80% of each transaction for their courses
      return transaction.amount * 0.8;
    }
  }
  return transaction.amount;
}

// Format date to readable format
export function formatTransactionDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Filter transactions based on user role
export function filterTransactionsByRole(
  transactions: any[],
  userId: string,
  userRole: string
) {
  if (userRole === "ADMIN") {
    return transactions; // Admin sees all transactions
  } else {
    // Teachers only see transactions for their courses
    return transactions.filter(
      (transaction) => transaction.course.instructorId === userId
    );
  }
}
